import express from 'express';
import crypto from 'crypto';
import Newsletter from '../models/Newsletter.js';
import { sendNewsletterWelcome } from '../services/emailService.js';

const router = express.Router();

// הרשמה לניוזלטר — שומר IP + token הסרה + שיטת הסכמה
router.post('/subscribe', async (req, res) => {
  const { email, method } = req.body;
  if (!email) return res.status(400).json({ error: 'נא להזין אימייל' });

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.active) return res.status(400).json({ error: 'אימייל זה כבר רשום' });
    // רישום מחדש של מי שביטל
    existing.active = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = null;
    existing.consentIp = req.ip;
    existing.consentMethod = method || 'footer';
    existing.unsubscribeToken = crypto.randomBytes(32).toString('hex');
    await existing.save();
    return res.json({ success: true, message: 'נרשמת מחדש בהצלחה!' });
  }

  const unsubscribeToken = crypto.randomBytes(32).toString('hex');
  await Newsletter.create({
    email,
    consentIp: req.ip,
    consentMethod: method || 'footer',
    unsubscribeToken,
  });

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

// ביטול הרשמה — דרך token (מהאימייל)
router.get('/unsubscribe', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'טוקן חסר' });

  const sub = await Newsletter.findOneAndUpdate(
    { unsubscribeToken: token },
    { active: false, unsubscribedAt: new Date() },
    { new: true }
  );

  if (!sub) return res.status(404).json({ error: 'טוקן לא תקין' });
  res.json({ success: true, message: 'הוסרת מרשימת התפוצה' });
});

// ביטול הרשמה — דרך אימייל ישיר (מהפרופיל)
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'נא להזין אימייל' });

  await Newsletter.findOneAndUpdate(
    { email },
    { active: false, unsubscribedAt: new Date() }
  );
  res.json({ success: true, message: 'הוסרת מרשימת התפוצה' });
});

export default router;
