import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sku: String,
  images: [String],
}, { _id: false });

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
    variants: { type: [variantSchema], default: [] },
    stock: { type: Number, default: 0 },
    sizeStock: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
