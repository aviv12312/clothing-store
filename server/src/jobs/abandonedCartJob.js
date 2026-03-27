import AbandonedCart from '../models/AbandonedCart.js';
import { sendAbandonedCart, sendAbandonedCartDiscount } from '../services/emailService.js';

export const checkAbandonedCarts = async () => {
  const twoHoursAgo  = new Date(Date.now() - 2  * 60 * 60 * 1000);
  const twoDaysAgo   = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // שלב 1 — אחרי 2 שעות: אימייל תזכורת
  const reminderCarts = await AbandonedCart.find({
    updatedAt: { $lt: twoHoursAgo },
    emailSent: false,
  });

  for (const cart of reminderCarts) {
    try {
      await sendAbandonedCart(cart.email, cart.name, cart.items, cart.total);
      cart.emailSent = true;
      cart.emailSentAt = new Date();
      await cart.save();
      console.log(`📧 Abandoned cart reminder → ${cart.email}`);
    } catch (err) {
      console.error(`Reminder failed for ${cart.email}:`, err.message);
    }
  }

  // שלב 2 — אחרי יומיים: אימייל עם 10% הנחה
  const discountCarts = await AbandonedCart.find({
    updatedAt: { $lt: twoDaysAgo },
    emailSent: true,
    discountEmailSent: false,
  });

  for (const cart of discountCarts) {
    try {
      await sendAbandonedCartDiscount(cart.email, cart.name, cart.items, cart.total);
      cart.discountEmailSent = true;
      cart.discountEmailSentAt = new Date();
      await cart.save();
      console.log(`🎁 Discount email → ${cart.email}`);
    } catch (err) {
      console.error(`Discount email failed for ${cart.email}:`, err.message);
    }
  }
};
