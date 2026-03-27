import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    salePrice: Number,
    category: {
      type: String,
      enum: ['חתן ומלווים', 'Casual', 'Formal'],
      required: true,
    },
    tags: [String],
    sizes: [String],
    colors: [String],
    images: [String],
    colorImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    stock: { type: Number, default: 0 }, // סה"כ מלאי (מחושב)
    sizeStock: { type: mongoose.Schema.Types.Mixed, default: {} }, // מלאי לפי מידה { "M": 5, "L": 3 }
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
