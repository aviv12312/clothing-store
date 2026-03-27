import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { sendNewsletterWelcome } from '../services/emailService.js';

const router = express.Router();

// הרשמה לניוזלטר
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'נא להזין אימייל' });

  const existing = await Newsletter.findOne({ email });
  if (existing) return res.status(400).json({ error: 'אימייל זה כבר רשום' });

  const subscriber = await Newsletter.create({ email });

  // שליחת אימייל ברוכים הבאים
  try {
    await sendNewsletterWelcome(email);
  } catch (e) {
    console.error('Newsletter email error:', e.message);
  }

  res.json({ success: true, message: 'נרשמת בהצלחה!' });
});

// בדיקה אם אימייל רשום
router.get('/check/:email', async (req, res) => {
  const sub = await Newsletter.findOne({ email: req.params.email, active: true });
  res.json({ subscribed: !!sub });
});

// ביטול הרשמה
router.get('/unsubscribe/:email', async (req, res) => {
  await Newsletter.findOneAndUpdate({ email: req.params.email }, { active: false });
  res.json({ success: true, message: 'הוסרת מרשימת התפוצה' });
});

export default router;
