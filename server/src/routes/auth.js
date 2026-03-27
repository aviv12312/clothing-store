import express from 'express';
import crypto from 'crypto';
import {
  register,
  login,
  refreshToken,
  logout,
} from '../controllers/authController.js';
import {
  registerRules,
  loginRules,
  validate,
} from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import User from '../models/User.js';
import { sendPasswordReset } from '../services/emailService.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// שלח אימייל לאיפוס סיסמה
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'נדרש אימייל' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');
  // תמיד מחזיר success כדי לא לחשוף אם האימייל קיים
  if (!user) return res.json({ message: 'אם האימייל קיים במערכת — נשלח קישור לאיפוס' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 דקות
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendPasswordReset(user.email, user.name, resetUrl);

  res.json({ message: 'אם האימייל קיים במערכת — נשלח קישור לאיפוס' });
});

// איפוס הסיסמה עם הטוקן
router.post('/reset-password/:token', async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpires');

  if (!user) return res.status(400).json({ error: 'הקישור פג תוקף או אינו תקין' });

  const { password } = req.body;
  if (!password || password.length < 8) return res.status(400).json({ error: 'סיסמה חייבת להיות לפחות 8 תווים' });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'הסיסמה אופסה בהצלחה' });
});

export default router;
