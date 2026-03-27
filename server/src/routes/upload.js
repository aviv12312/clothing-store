import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cloudinary מוגדר בתוך ה-handler כי ES modules מריצים imports לפני dotenv
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

// multer — שמור בזיכרון (לא בדיסק)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB מקסימום
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('קבצי תמונה בלבד'), false);
  },
});

// העלאת תמונה אחת
router.post('/', protect, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'לא נשלחה תמונה' });

    // העלה ל-Cloudinary דרך stream
    const cld = getCloudinary();
    const result = await new Promise((resolve, reject) => {
      const stream = cld.uploader.upload_stream(
        { folder: 'dream-and-work', transformation: [{ width: 800, crop: 'limit', quality: 'auto' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'שגיאה בהעלאת התמונה' });
  }
});

// העלאת מספר תמונות (עד 5)
router.post('/multiple', protect, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'לא נשלחו תמונות' });

    const cld = getCloudinary();
    const uploads = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cld.uploader.upload_stream(
              { folder: 'dream-and-work', transformation: [{ width: 800, crop: 'limit', quality: 'auto' }] },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      )
    );

    res.json({ urls: uploads });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'שגיאה בהעלאת התמונות' });
  }
});

export default router;
