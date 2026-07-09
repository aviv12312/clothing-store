import Coupon from '../models/Coupon.js';

// מקור אמת יחיד לאימות קופון — משמש גם ב-/coupons/validate וגם בזרימת התשלום.
// זורק Error עם status תואם כשהקופון לא תקין; מחזיר סכומים כשהוא תקין.
export const validateCouponForUser = async (couponCode, user, subtotal) => {
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
