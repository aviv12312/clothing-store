import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  }),
});

const setRefreshCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(409).json({ error: 'אימייל כבר קיים' });
  }
  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
  }
  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);
  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'לא מחובר' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'נא להתחבר מחדש' });
  }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'התנתקות בהצלחה' });
};
