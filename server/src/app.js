import express from 'express';
import dotenv from 'dotenv';
// ×‘×ž×§×•×ž×™ ×˜×•×¢×Ÿ .env â€” ×‘-Railway ×”×ž×©×ª× ×™× ×ž×•×’×“×¨×™× ×™×©×™×¨×•×ª
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { validateEnv } from './config/validateEnv.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import aiRoutes from './routes/ai.js';
import uploadRoutes from './routes/upload.js';
import newsletterRoutes from './routes/newsletter.js';
import cartRoutes from './routes/cart.js';
import couponRoutes from './routes/coupons.js';
import { checkAbandonedCarts } from './jobs/abandonedCartJob.js';

validateEnv();

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = (process.env.CLIENT_URL || '').split(',').map(s => s.trim());
      if (allowed.includes('*') || allowed.some(o => origin.startsWith(o)) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: '×™×•×ª×¨ ×ž×“×™ ×‘×§×©×•×ª, × ×¡×” ×©×•×‘ ×ž××•×—×¨ ×™×•×ª×¨' },
  })
);

// Stripe Webhook â€” ×—×™×™×‘ ×œ×¤× ×™ express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '250kb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || '×©×’×™××” ×¤× ×™×ž×™×ª ×‘×©×¨×ª',
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`ðŸš€ Server running on port ${process.env.PORT}`);
  });

  // ×‘×“×™×§×ª ×¢×’×œ×•×ª × ×˜×•×©×•×ª ×›×œ ×©×¢×”
  setInterval(checkAbandonedCarts, 60 * 60 * 1000);
  console.log('â° Abandoned cart job scheduled (every 1h)');
});

