import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true }, // אחוז הנחה (10 = 10%)
  email: { type: String, required: true },    // שייך ללקוח ספציפי
  used: { type: Boolean, default: false },
  usedAt: { type: Date },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Coupon', couponSchema);
