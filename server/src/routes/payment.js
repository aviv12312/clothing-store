import express from 'express';
import Stripe from 'stripe';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendOrderConfirmation, sendAdminNewOrderAlert } from '../services/emailService.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

const getAvailableStock = (product, size, color) => {
  if (color && size && product.sizeStock?.[color]?.[size] !== undefined) {
    return Number(product.sizeStock[color][size]) || 0;
  }

  if (size && product.sizeStock?.[size] !== undefined) {
    return Number(product.sizeStock[size]) || 0;
  }

  return Number(product.stock) || 0;
};

const decrementProductStock = async (product, item) => {
  if (item.color && item.size && product.sizeStock?.[item.color]?.[item.size] !== undefined) {
    const updated = { ...product.sizeStock };
    updated[item.color] = { ...updated[item.color], [item.size]: Math.max(0, (updated[item.color][item.size] || 0) - item.quantity) };
    await Product.findByIdAndUpdate(item.product, {
      sizeStock: updated,
      stock: Math.max(0, (product.stock || 0) - item.quantity),
    });
    return;
  }

  if (item.size && product.sizeStock?.[item.size] !== undefined) {
    const updated = { ...product.sizeStock };
    updated[item.size] = Math.max(0, (updated[item.size] || 0) - item.quantity);
    await Product.findByIdAndUpdate(item.product, {
      sizeStock: updated,
      stock: Math.max(0, (product.stock || 0) - item.quantity),
    });
    return;
  }

  await Product.findByIdAndUpdate(item.product, {
    $inc: { stock: -item.quantity },
  });
};

router.post('/stripe/create-intent', protect, async (req, res) => {
  const stripe = getStripe();
  const { cartItems, shippingAddress } = req.body;

  const ids = cartItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });

  let total = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = products.find((entry) => entry._id.toString() === item.productId);
    if (!product) return res.status(400).json({ error: `מוצר לא נמצא: ${item.productId}` });
    if (getAvailableStock(product, item.size, item.color) < item.quantity) {
      return res.status(400).json({ error: `אין מלאי: ${product.name}` });
    }

    const price = product.salePrice || product.price;
    total += price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: product.images[0],
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'ils',
    metadata: { userId: req.user.id },
  });

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

router.post('/webhook', async (req, res) => {
  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Invalid webhook signature');
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const order = await Order.findOneAndUpdate(
      { paymentId: paymentIntent.id },
      { paymentStatus: 'paid', orderStatus: 'בטיפול' },
      { new: true }
    );

    if (order?.items) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;
        await decrementProductStock(product, item);
      }
    }
  }

  res.json({ received: true });
});

router.post('/paypal/create-order', protect, async (req, res) => {
  const { cartItems, shippingAddress } = req.body;

  const ids = cartItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });

  let total = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = products.find((entry) => entry._id.toString() === item.productId);
    if (!product) return res.status(400).json({ error: `מוצר לא נמצא: ${item.productId}` });
    if (getAvailableStock(product, item.size, item.color) < item.quantity) {
      return res.status(400).json({ error: `אין מלאי: ${product.name}` });
    }

    const price = product.salePrice || product.price;
    total += price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: product.images?.[0],
    });
  }

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const paypalBase = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  const tokenRes = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('PayPal token error:', JSON.stringify(tokenData));
    return res.status(502).json({ error: 'שגיאה בהתחברות ל-PayPal' });
  }

  const orderRes = await fetch(`${paypalBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'ILS', value: total.toFixed(2) } }] }),
  });
  const paypalOrder = await orderRes.json();
  if (!paypalOrder.id) {
    console.error('PayPal order error:', JSON.stringify(paypalOrder));
    return res.status(502).json({ error: 'שגיאה ביצירת הזמנת PayPal' });
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalPrice: total,
    shippingAddress,
    paymentMethod: 'paypal',
    paymentId: paypalOrder.id,
  });

  res.json({ paypalOrderId: paypalOrder.id, orderId: order._id, totalAmount: total });
});

router.post('/paypal/capture-order', protect, async (req, res) => {
  const { paypalOrderId, couponCode } = req.body;

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const paypalBase = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  const tokenRes = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const { access_token } = await tokenRes.json();

  const captureRes = await fetch(`${paypalBase}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
  });
  const captureData = await captureRes.json();

  if (captureData.status === 'COMPLETED') {
    const order = await Order.findOneAndUpdate(
      { paymentId: paypalOrderId },
      { paymentStatus: 'paid', orderStatus: 'בטיפול' },
      { new: true }
    );

    if (order?.items) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;
        await decrementProductStock(product, item);
      }
    }

    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase(), used: false },
          { used: true, usedAt: new Date() }
        );
      } catch (error) {
        console.error('Coupon mark error:', error.message);
      }
    }

    res.json({ success: true, orderId: order?._id });

    try {
      const user = await User.findById(order.user).select('email name');
      if (user) {
        sendOrderConfirmation(order, user.email, user.name).catch((error) => console.error('Email error:', error.message));
        sendAdminNewOrderAlert(order, user.name, user.email).catch((error) => console.error('Admin email error:', error.message));
      }
    } catch (error) {
      console.error('Email error:', error.message);
    }

    return;
  }

  res.status(400).json({ error: 'תשלום לא הושלם' });
});

export default router;
