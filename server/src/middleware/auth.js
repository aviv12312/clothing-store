import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'נדרשת התחברות' });

  const token = auth.split(' ')[1];
  try {
    const { id } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'משתמש לא קיים' });
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'פג תוקף', code: 'TOKEN_EXPIRED' });
    res.status(401).json({ error: 'טוקן לא תקין' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'אין הרשאות מנהל' });
  next();
};
