import express from 'express';
import Stripe from 'stripe';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendOrderConfirmation, sendAdminNewOrderAlert } from '../services/emailService.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// אתחול מאוחר — dotenv כבר נטען
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// יצירת Payment Intent
router.post('/stripe/create-intent', protect, async (req, res) => {
  const stripe = getStripe();
  const { cartItems, shippingAddress } = req.body;

  const ids = cartItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });

  let total = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const p = products.find((p) => p._id.toString() === item.productId);
    if (!p) return res.status(400).json({ error: `מוצר לא נמצא: ${item.productId}` });
    if (p.stock < item.quantity)
      return res.status(400).json({ error: `אין מלאי: ${p.name}` });
    const price = p.salePrice || p.price;
    total += price * item.quantity;
    orderItems.push({
      product: p._id,
      name: p.name,
      price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: p.images[0],
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'ils',
    metadata: { userId: req.user.id },
  });

  // צור הזמנה במצב pending
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalPrice: total,
    shippingAddress,
    paymentMethod: 'stripe',
    paymentId: intent.id,
  });

  res.json({ clientSecret: intent.client_secret, orderId: order._id, totalAmount: total });
});

// Stripe Webhook
router.post('/webhook', async (req, res) => {
  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send('Invalid webhook signature');
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const order = await Order.findOneAndUpdate(
      { paymentId: pi.id },
      { paymentStatus: 'paid', orderStatus: 'בטיפול' },
      { new: true }
    );

    // הורדת מלאי
    if (order?.items) {
      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (!prod) continue;

        if (item.size && prod.sizeStock?.[item.size] !== undefined) {
          const updated = { ...prod.sizeStock };
          updated[item.size] = Math.max(0, (updated[item.size] || 0) - item.quantity);
          await Product.findByIdAndUpdate(item.product, {
            sizeStock: updated,
            stock: Math.max(0, (prod.stock || 0) - item.quantity),
          });
        } else {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }
  }
  res.json({ received: true });
});

// ── PayPal: צור הזמנה ──
router.post('/paypal/create-order', protect, async (req, res) => {
  const { cartItems, shippingAddress } = req.body;

  const ids = cartItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });

  let total = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const p = products.find((p) => p._id.toString() === item.productId);
    if (!p) return res.status(400).json({ error: `מוצר לא נמצא: ${item.productId}` });
    if (p.stock < item.quantity)
      return res.status(400).json({ error: `אין מלאי: ${p.name}` });
    const price = p.salePrice || p.price;
    total += price * item.quantity;
    orderItems.push({
      product: p._id, name: p.name, price,
      size: item.size, color: item.color,
      quantity: item.quantity, image: p.images?.[0],
    });
  }

  // קבל PayPal access token
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('PayPal token error:', JSON.stringify(tokenData));
    return res.status(502).json({ error: 'שגיאה בהתחברות ל-PayPal' });
  }

  // צור הזמנת PayPal
  const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'ILS', value: total.toFixed(2) } }],
    }),
  });
  const paypalOrder = await orderRes.json();
  if (!paypalOrder.id) {
    console.error('PayPal order error:', JSON.stringify(paypalOrder));
    return res.status(502).json({ error: 'שגיאה ביצירת הזמנת PayPal' });
  }

  // שמור הזמנה ב-DB
  const order = await Order.create({
    user: req.user.id, items: orderItems, totalPrice: total,
    shippingAddress, paymentMethod: 'paypal', paymentId: paypalOrder.id,
  });

  res.json({ paypalOrderId: paypalOrder.id, orderId: order._id, totalAmount: total });
});

// ── PayPal: אשר תשלום ──
router.post('/paypal/capture-order', protect, async (req, res) => {
  const { paypalOrderId, couponCode } = req.body;

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const { access_token } = await tokenRes.json();

  const captureRes = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    }
  );
  const captureData = await captureRes.json();

  if (captureData.status === 'COMPLETED') {
    const order = await Order.findOneAndUpdate(
      { paymentId: paypalOrderId },
      { paymentStatus: 'paid', orderStatus: 'בטיפול' },
      { new: true }
    );

    // הורדת מלאי לפי מידה
    if (order?.items) {
      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (!prod) continue;

        if (item.size && prod.sizeStock?.[item.size] !== undefined) {
          // הורד מלאי לפי מידה
          const updated = { ...prod.sizeStock };
          updated[item.size] = Math.max(0, (updated[item.size] || 0) - item.quantity);
          await Product.findByIdAndUpdate(item.product, {
            sizeStock: updated,
            stock: Math.max(0, (prod.stock || 0) - item.quantity),
          });
        } else {
          // הורד מלאי כללי
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    // סימון קופון כנוצל
    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase(), used: false },
          { used: true, usedAt: new Date() }
        );
      } catch (e) { console.error('Coupon mark error:', e.message); }
    }

    // שליחת response מיד - בלי לחכות לאימיילים
    res.json({ success: true, orderId: order?._id });

    // שליחת אימיילים ברקע (לא חוסם)
    try {
      const user = await User.findById(order.user).select('email name');
      if (user) {
        sendOrderConfirmation(order, user.email, user.name).catch(e => console.error('Email error:', e.message));
        sendAdminNewOrderAlert(order, user.name, user.email).catch(e => console.error('Admin email error:', e.message));
      }
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    return;
  }

  res.status(400).json({ error: 'תשלום לא הושלם' });
});

export default router;
