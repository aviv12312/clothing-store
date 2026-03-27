import mongoose from 'mongoose';

const abandonedCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      size: String,
      color: String,
      quantity: Number,
    },
  ],
  total: Number,
  updatedAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date },
  discountEmailSent: { type: Boolean, default: false },
  discountEmailSentAt: { type: Date },
});

export default mongoose.model('AbandonedCart', abandonedCartSchema);
