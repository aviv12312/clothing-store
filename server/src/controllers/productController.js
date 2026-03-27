import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

export const getProducts = async (req, res) => {
  const { category, search, minPrice, maxPrice, size, sort = '-createdAt' } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (size) query.sizes = size;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const products = await Product.find(query).sort(sort).limit(50);
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'מוצר לא נמצא' });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const images = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'clothing-store',
        transformation: [{ width: 800, height: 1000, crop: 'fill' }],
      });
      images.push(result.secure_url);
    }
  }
  const product = await Product.create({ ...req.body, images });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ error: 'מוצר לא נמצא' });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'מוצר הוסר' });
};
