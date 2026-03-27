import express from 'express';
import multer from 'multer';
import { protect, requireAdmin } from '../middleware/auth.js';
import { productRules, validate } from '../middleware/validators.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  requireAdmin,
  upload.array('images', 5),
  validate(productRules),
  createProduct
);
router.put('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

export default router;
