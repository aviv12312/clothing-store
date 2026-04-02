import express from 'express';
import crypto from 'crypto';
import {
  register,
  login,
  refreshToken,
  logout,
  me,
} from '../controllers/authController.js';
import {
  registerRules,
  loginRules,
  validate,
} from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { sendPasswordReset } from '../services/emailService.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.post('/refresh', refreshToken);
router.get('/me', protect, me);
router.post('/logout', logout);

// ×©×œ×— ××™×ž×™×™×œ ×œ××™×¤×•×¡ ×¡×™×¡×ž×”
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: '× ×“×¨×© ××™×ž×™×™×œ' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');
  // ×ª×ž×™×“ ×ž×—×–×™×¨ success ×›×“×™ ×œ× ×œ×—×©×•×£ ×× ×”××™×ž×™×™×œ ×§×™×™×
  if (!user) return res.json({ message: '×× ×”××™×ž×™×™×œ ×§×™×™× ×‘×ž×¢×¨×›×ª â€” × ×©×œ×— ×§×™×©×•×¨ ×œ××™×¤×•×¡' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 ×“×§×•×ª
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendPasswordReset(user.email, user.name, resetUrl);

  res.json({ message: '×× ×”××™×ž×™×™×œ ×§×™×™× ×‘×ž×¢×¨×›×ª â€” × ×©×œ×— ×§×™×©×•×¨ ×œ××™×¤×•×¡' });
});

// ××™×¤×•×¡ ×”×¡×™×¡×ž×” ×¢× ×”×˜×•×§×Ÿ
router.post('/reset-password/:token', async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpires');

  if (!user) return res.status(400).json({ error: '×”×§×™×©×•×¨ ×¤×’ ×ª×•×§×£ ××• ××™× ×• ×ª×§×™×Ÿ' });

  const { password } = req.body;
  if (!password || password.length < 8) return res.status(400).json({ error: '×¡×™×¡×ž×” ×—×™×™×‘×ª ×œ×”×™×•×ª ×œ×¤×—×•×ª 8 ×ª×•×•×™×' });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: '×”×¡×™×¡×ž×” ××•×¤×¡×” ×‘×”×¦×œ×—×”' });
});

// מחיקת חשבון לקוח — תיקון 13 לחוק הגנת הפרטיות
router.delete('/account', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // מחיקת נתוני המשתמש (הזמנות נשמרות לצורכי ביקורת 7 שנים)
    await User.findByIdAndUpdate(userId, {
      name: 'משתמש מחוק',
      email: `deleted_${userId}@deleted.invalid`,
      password: 'DELETED',
      isDeleted: true,
      deletedAt: new Date(),
    });
    res.clearCookie('refreshToken');
    res.json({ message: 'החשבון נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה במחיקת החשבון' });
  }
});

export default router;

