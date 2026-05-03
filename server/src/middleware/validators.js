import { body, validationResult } from 'express-validator';

export const validate = (rules) => async (req, res, next) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'נתונים לא תקינים',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerRules = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('סיסמה: לפחות 8 תווים, אות גדולה, אות קטנה ומספר'),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const productRules = [
  body('name').trim().notEmpty().isLength({ max: 200 }),
  body('price').isFloat({ min: 0.01, max: 100000 }),
  body('category').isIn(['חתן ומלווים', 'Casual', 'Formal']),
  body('stock').isInt({ min: 0 }),
];
