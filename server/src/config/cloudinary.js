import { v2 as cloudinary } from 'cloudinary';

// Cloudinary מוגדר בתוך handler/פונקציה כי ES modules מריצים imports לפני dotenv,
// כך שמשתני הסביבה זמינים רק בזמן קריאה ולא בזמן טעינת המודול.
export const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};
