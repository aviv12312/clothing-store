import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// אימות קוד הנחה
router.post('/validate', protect, async (req, res) => {
  const { code, total } = req.body;
  if (!code) return res.status(400).json({ error: 'נא להזין קוד' });

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon)
    return res.status(404).json({ error: 'קוד הנחה לא קיים' });

  if (coupon.used)
    return res.status(400).json({ error: 'קוד זה כבר נוצל' });

  if (coupon.expiresAt < new Date())
    return res.status(400).json({ error: 'קוד ההנחה פג תוקף' });

  if (coupon.email !== req.user.email)
    return res.status(400).json({ error: 'קוד זה לא שייך לחשבון שלך' });

  const discountAmount = (total * coupon.discount) / 100;
  const newTotal = total - discountAmount;

  res.json({
    valid: true,
    discount: coupon.discount,
    discountAmount: discountAmount.toFixed(2),
    newTotal: newTotal.toFixed(2),
    code: coupon.code,
  });
});

export default router;
