import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendStatusUpdate, sendAdminCancellationAlert } from '../services/emailService.js';

const router = express.Router();

// קבל הזמנות של המשתמש המחובר
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json(orders);
});

// קבל כל ההזמנות (אדמין)
router.get('/', protect, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

// ביטול הזמנה על ידי לקוח (תוך 2 שעות)
router.patch('/:id/cancel', protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });
  if (order.orderStatus === 'בוטל') return res.status(400).json({ error: 'ההזמנה כבר בוטלה' });
  if (['נשלח', 'הגיע'].includes(order.orderStatus))
    return res.status(400).json({ error: 'לא ניתן לבטל הזמנה שכבר נשלחה' });

  const hoursSince = (Date.now() - new Date(order.createdAt)) / 1000 / 60 / 60;
  if (hoursSince > 2) return res.status(400).json({ error: 'לא ניתן לבטל לאחר יותר מ-2 שעות מביצוע ההזמנה' });

  order.orderStatus = 'בוטל';
  await order.save();

  // אימייל ללקוח
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

// עדכן סטטוס הזמנה (אדמין)
router.patch('/:id/status', protect, requireAdmin, async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'הזמנה לא נמצאה' });

  // שלח אימייל ללקוח
  try {
    const user = await User.findById(order.user).select('email name');
    if (user) await sendStatusUpdate(order, user.email, user.name, orderStatus);
  } catch (err) {
    console.error('Status email error:', err.message);
  }

  res.json(order);
});

export default router;
