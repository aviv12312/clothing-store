import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendStatusUpdate, sendAdminCancellationAlert } from '../services/emailService.js';

const router = express.Router();

const restoreProductStock = async (item) => {
  const product = await Product.findById(item.product);
  if (!product) return;

  if (item.color && item.size && product.sizeStock?.[item.color]?.[item.size] !== undefined) {
    const updated = { ...product.sizeStock };
    updated[item.color] = { ...updated[item.color], [item.size]: (updated[item.color][item.size] || 0) + item.quantity };
    await Product.findByIdAndUpdate(item.product, {
      sizeStock: updated,
      stock: (product.stock || 0) + item.quantity,
    });
    return;
  }

  if (item.size && product.sizeStock?.[item.size] !== undefined) {
    const updated = { ...product.sizeStock };
    updated[item.size] = (updated[item.size] || 0) + item.quantity;
    await Product.findByIdAndUpdate(item.product, {
      sizeStock: updated,
      stock: (product.stock || 0) + item.quantity,
    });
    return;
  }

  await Product.findByIdAndUpdate(item.product, {
    $inc: { stock: item.quantity },
  });
};

router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json(orders);
});

router.get('/', protect, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

router.patch('/:id/cancel', protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });
  if (order.orderStatus === 'בוטל') return res.status(400).json({ error: 'ההזמנה כבר בוטלה' });
  if (['נשלח', 'הגיע'].includes(order.orderStatus)) {
    return res.status(400).json({ error: 'לא ניתן לבטל הזמנה שכבר נשלחה' });
  }

  const hoursSince = (Date.now() - new Date(order.createdAt)) / 1000 / 60 / 60;
  if (hoursSince > 2) {
    return res.status(400).json({ error: 'לא ניתן לבטל לאחר יותר מ-2 שעות מביצוע ההזמנה' });
  }

  if (order.paymentStatus === 'paid' && order.stockDeducted && Array.isArray(order.items)) {
    for (const item of order.items) {
      await restoreProductStock(item);
    }
  }

  order.orderStatus = 'בוטל';
  order.stockDeducted = false;
  await order.save();

  try {
    const user = await User.findById(req.user.id).select('email name');
    if (user) {
      await sendStatusUpdate(order, user.email, user.name, 'בוטל');
      await sendAdminCancellationAlert(order, user.name, user.email);
    }
  } catch (err) {
    console.error('Cancel email error:', err.message);
  }

  res.json({ success: true, order });
});

router.patch('/:id/status', protect, requireAdmin, async (req, res) => {
  const { orderStatus } = req.body;
  const VALID_STATUSES = ['בטיפול', 'נשלח', 'הגיע', 'בוטל', 'ממתין לאישור'];
  if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
    return res.status(400).json({ error: 'סטטוס לא חוקי' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
  if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });

  try {
    const user = await User.findById(order.user).select('email name');
    if (user) await sendStatusUpdate(order, user.email, user.name, orderStatus);
  } catch (err) {
    console.error('Status email error:', err.message);
  }

  res.json(order);
});

// טופס ביטול עסקה — בודק 14 יום מיום המסירה / תאריך ההזמנה
router.post('/:id/cancellation-request', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });

    if (order.orderStatus === 'בוטל') {
      return res.status(400).json({ error: 'ההזמנה כבר בוטלה' });
    }

    // תאריך התחלת ספירת 14 הימים — מיום המסירה או מיום ההזמנה
    const startDate = order.deliveredAt || order.createdAt;
    const daysSince = (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince > 14) {
      return res.status(400).json({
        error: 'חלפו יותר מ-14 ימים מיום קבלת המוצר — לא ניתן לבטל',
        daysSince: Math.floor(daysSince),
      });
    }

    const { reason } = req.body;
    order.cancellationRequest = {
      requestedAt: new Date(),
      reason: reason || 'לא צוין',
      status: 'pending',
    };
    await order.save();

    res.json({
      success: true,
      message: 'בקשת הביטול התקבלה. נחזור אליך תוך 2 ימי עסקים.',
      daysRemaining: Math.floor(14 - daysSince),
    });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעיבוד הבקשה' });
  }
});

export default router;

