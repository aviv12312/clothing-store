import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'אימייל לא תקין'],
  },
  subscribedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  // תיקון חוק הספאם — תיעוד הסכמה
  consentIp: { type: String, default: null },
  consentMethod: { type: String, enum: ['checkout', 'footer', 'register', 'manual'], default: 'footer' },
  unsubscribedAt: { type: Date, default: null },
  unsubscribeToken: { type: String, default: null },
});

export default mongoose.model('Newsletter', newsletterSchema);
