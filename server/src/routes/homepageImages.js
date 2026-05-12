import express from 'express';
import HomepageImageSet from '../models/HomepageImageSet.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_SLOTS = ['hero', 'collectionStory', 'lookbookWorkday', 'lookbookEvening', 'lookbookEvent'];

const normalizeSets = (sets) =>
  ALLOWED_SLOTS.reduce((acc, slot) => {
    const set = sets.find((entry) => entry.slot === slot);
    acc[slot] = set?.isActive === false ? [] : set?.images || [];
    return acc;
  }, {});

router.get('/', async (req, res, next) => {
  try {
    const sets = await HomepageImageSet.find({}).lean();
    res.json(normalizeSets(sets));
  } catch (error) {
    next(error);
  }
});

router.get('/admin', protect, requireAdmin, async (req, res, next) => {
  try {
    const sets = await HomepageImageSet.find({}).lean();
    res.json(normalizeSets(sets));
  } catch (error) {
    next(error);
  }
});

router.put('/:slot', protect, requireAdmin, async (req, res, next) => {
  try {
    const { slot } = req.params;
    if (!ALLOWED_SLOTS.includes(slot)) {
      return res.status(400).json({ error: 'Invalid homepage image slot' });
    }

    const images = Array.isArray(req.body.images)
      ? req.body.images.map((url) => String(url).trim()).filter(Boolean)
      : [];

    const set = await HomepageImageSet.findOneAndUpdate(
      { slot },
      { slot, images, isActive: true },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(set);
  } catch (error) {
    next(error);
  }
});

export default router;
