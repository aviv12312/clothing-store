import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateCouponForUser } from '../services/couponService.js';

const router = express.Router();

// אימות קוד הנחה
router.post('/validate', protect, async (req, res) => {
  const { code, total } = req.body;
  if (!code) return res.status(400).json({ error: 'נא להזין קוד' });

  try {
    const subtotal = Number(total) || 0;
    const { coupon, discountAmount, finalTotal } = await validateCouponForUser(code, req.user, subtotal);
    res.json({
      valid: true,
      discount: coupon.discount,
      discountAmount: discountAmount.toFixed(2),
      newTotal: finalTotal.toFixed(2),
      code: coupon.code,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'שגיאה באימות הקוד' });
  }
});

export default router;
