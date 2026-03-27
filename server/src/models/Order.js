import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        size: String,
        color: String,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],
    totalPrice: Number,
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      zipCode: String,
      phone: String,
    },
    paymentMethod: { type: String, enum: ['stripe', 'paypal'] },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['בטיפול', 'נשלח', 'הגיע', 'בוטל'],
      default: 'בטיפול',
    },
    paymentId: String,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
