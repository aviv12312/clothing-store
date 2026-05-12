import mongoose from 'mongoose';

const homepageImageSetSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      enum: ['hero', 'collectionStory', 'lookbookWorkday', 'lookbookEvening', 'lookbookEvent'],
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.every((url) => typeof url === 'string' && url.trim().length > 0),
        message: 'Homepage images must be valid URLs',
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('HomepageImageSet', homepageImageSetSchema);
