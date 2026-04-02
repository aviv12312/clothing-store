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
    updated[item.color] = {
      ...updated[item.color],
      [item.size]: Math.max(0, (updated[item.color][item.size] || 0) - item.quantity),
    };

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

  await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
};

const validateCouponForUser = async (couponCode, user, subtotal) => {
  if (!couponCode) {
    return { coupon: null, discountAmount: 0, finalTotal: subtotal };
  }

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) {
    const error = new Error('קוד הנחה לא קיים');
    error.status = 404;
    throw error;
  }

  if (coupon.used) {
    const error = new Error('קוד זה כבר נוצל');
    error.status = 400;
    throw error;
  }

  if (coupon.expiresAt < new Date()) {
    const error = new Error('קוד ההנחה פג תוקף');
    error.status = 400;
    throw error;
  }

  if (coupon.email !== user.email) {
    const error = new Error('קוד זה לא שייך לחשבון שלך');
    error.status = 400;
    throw error;
  }

  const discountAmount = Number(((subtotal * coupon.discount) / 100).toFixed(2));
  const finalTotal = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));
  return { coupon, discountAmount, finalTotal };
};

const buildOrderFromCart = async (cartItems) => {
  const ids = cartItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });

  let subtotal = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = products.find((entry) => entry._id.toString() === item.productId);
    if (!product) {
      const error = new Error(`מוצר לא נמצא: ${item.productId}`);
      error.status = 400;
      throw error;
    }

    if (getAvailableStock(product, item.size, item.color) < item.quantity) {
      const error = new Error(`אין מלאי: ${product.name}`);
      error.status = 400;
      throw error;
    }

    const price = product.salePrice || product.price;
    subtotal += price * item.quantity;
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

  return { subtotal: Number(subtotal.toFixed(2)), orderItems };
};

const finalizePaidOrder = async (order) => {
  if (!order) return null;
  if (order.paymentStatus === 'paid' && order.stockDeducted) return order;

  for (const item of order.items || []) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    await decrementProductStock(product, item);
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'בטיפול';
  order.stockDeducted = true;
  await order.save();
  return order;
};

const markCouponUsed = async (couponCode) => {
  if (!couponCode) return;
  try {
    await Coupon.findOneAndUpdate(
      { code: couponCode.toUpperCase(), used: false },
      { used: true, usedAt: new Date() }
    );
  } catch (error) {
    console.error('Coupon mark error:', error.message);
  }
};

router.post('/stripe/create-intent', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const { cartItems, shippingAddress, couponCode } = req.body;
    const { subtotal, orderItems } = await buildOrderFromCart(cartItems);
    const { coupon, discountAmount, finalTotal } = await validateCouponForUser(couponCode, req.user, subtotal);

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100),
      currency: 'ils',
      metadata: { userId: req.user.id },
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotalPrice: subtotal,
      discountAmount,
      totalPrice: finalTotal,
      couponCode: coupon?.code,
      shippingAddress,
      paymentMethod: 'stripe',
      paymentId: intent.id,
      stockDeducted: false,
    });

    res.json({ clientSecret: intent.client_secret, orderId: order._id, totalAmount: finalTotal });
  } catch (error) {
    console.error('Stripe create intent error:', error.message);
    res.status(error.status || 500).json({ error: error.message || 'שגיאה ביצירת התשלום' });
  }
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
    const order = await Order.findOne({ paymentId: paymentIntent.id });
    const paidOrder = await finalizePaidOrder(order);
    if (paidOrder?.couponCode) await markCouponUsed(paidOrder.couponCode);
  }

  res.json({ received: true });
});

router.post('/paypal/create-order', protect, async (req, res) => {
  try {
    const { cartItems, shippingAddress, couponCode } = req.body;
    const { subtotal, orderItems } = await buildOrderFromCart(cartItems);
    const { coupon, discountAmount, finalTotal } = await validateCouponForUser(couponCode, req.user, subtotal);

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
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'ILS', value: finalTotal.toFixed(2) } }],
      }),
    });
    const paypalOrder = await orderRes.json();
    if (!paypalOrder.id) {
      console.error('PayPal order error:', JSON.stringify(paypalOrder));
      return res.status(502).json({ error: 'שגיאה ביצירת הזמנת PayPal' });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotalPrice: subtotal,
      discountAmount,
      totalPrice: finalTotal,
      couponCode: coupon?.code,
      shippingAddress,
      paymentMethod: 'paypal',
      paymentId: paypalOrder.id,
      stockDeducted: false,
    });

    res.json({ paypalOrderId: paypalOrder.id, orderId: order._id, totalAmount: finalTotal });
  } catch (error) {
    console.error('PayPal create order error:', error.message);
    res.status(error.status || 500).json({ error: error.message || 'שגיאה ביצירת ההזמנה' });
  }
});

router.post('/paypal/capture-order', protect, async (req, res) => {
  try {
    const { paypalOrderId } = req.body;
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const paypalBase = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const tokenRes = await fetch(`${paypalBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(500).json({ error: 'PayPal auth failed' });
    const { access_token } = tokenData;

    const captureRes = await fetch(`${paypalBase}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    });
    const captureData = await captureRes.json();

    if (captureData.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'תשלום לא הושלם' });
    }

    const order = await Order.findOne({ paymentId: paypalOrderId });
    if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });

    const paidOrder = await finalizePaidOrder(order);
    if (paidOrder?.couponCode) await markCouponUsed(paidOrder.couponCode);

    res.json({ success: true, orderId: paidOrder?._id });

    try {
      const user = await User.findById(paidOrder.user).select('email name');
      if (user) {
        sendOrderConfirmation(paidOrder, user.email, user.name).catch((error) => console.error('Email error:', error.message));
        sendAdminNewOrderAlert(paidOrder, user.name, user.email).catch((error) => console.error('Admin email error:', error.message));
      }
    } catch (error) {
      console.error('Email error:', error.message);
    }
  } catch (error) {
    console.error('PayPal capture error:', error.message);
    res.status(error.status || 500).json({ error: error.message || 'שגיאה בלכידת התשלום' });
  }
});

export default router;
