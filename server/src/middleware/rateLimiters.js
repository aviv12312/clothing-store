import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'יותר מדי ניסיונות — נסה שוב בעוד 15 דקות' },
  standardHeaders: true,
  skip: () => process.env.NODE_ENV !== 'production',
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'יותר מדי שאלות לבוט — המתן דקה' },
});
