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
    subtotalPrice: Number,
    discountAmount: { type: Number, default: 0 },
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
      enum: ['×‘×˜×™×¤×•×œ', '× ×©×œ×—', '×”×’×™×¢', '×‘×•×˜×œ'],
      default: '×‘×˜×™×¤×•×œ',
    },
    paymentId: String,
    couponCode: String,
    stockDeducted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

