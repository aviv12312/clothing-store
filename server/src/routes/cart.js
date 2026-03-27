import express from 'express';
import AbandonedCart from '../models/AbandonedCart.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// שמירת עגלה (נקרא כשמוסיפים/מסירים מוצר)
router.post('/save', protect, async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    // עגלה ריקה — מחק מהמעקב
    await AbandonedCart.findOneAndDelete({ user: req.user._id });
    return res.json({ success: true });
  }

  await AbandonedCart.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      email: req.user.email,
      name: req.user.name,
      items,
      total,
      updatedAt: new Date(),
      emailSent: false, // איפוס — הלקוח עדיין פעיל
    },
    { upsert: true, new: true }
  );

  res.json({ success: true });
});

// ניקוי עגלה אחרי רכישה
router.delete('/clear', protect, async (req, res) => {
  await AbandonedCart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true });
});

export default router;
