import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

const buildVariantPayload = (payload) => {
  if (Array.isArray(payload.variants) && payload.variants.length) {
    return payload.variants
      .map((variant) => ({
        color: String(variant.color || '').trim(),
        size: String(variant.size || '').trim(),
        stock: Number(variant.stock) || 0,
        sku: variant.sku ? String(variant.sku).trim() : undefined,
        images: Array.isArray(variant.images) ? variant.images.filter(Boolean) : [],
      }))
      .filter((variant) => variant.color && variant.size);
  }

  const colors = Array.isArray(payload.colors) ? payload.colors : [];
  const sizeStock = payload.sizeStock && typeof payload.sizeStock === 'object' ? payload.sizeStock : {};
  const colorImages = payload.colorImages && typeof payload.colorImages === 'object' ? payload.colorImages : {};

  return colors.flatMap((color) => {
    const sizes = Object.keys(sizeStock[color] || {});
    return sizes.map((size) => ({
      color,
      size,
      stock: Number(sizeStock[color]?.[size]) || 0,
      images: Array.isArray(colorImages[color]) ? colorImages[color] : [],
    }));
  });
};

const normalizeProductPayload = (payload) => {
  const variants = buildVariantPayload(payload);
  if (!variants.length) return payload;

  const colors = [...new Set(variants.map((variant) => variant.color))];
  const sizes = [...new Set(variants.map((variant) => variant.size))];
  const sizeStock = colors.reduce((acc, color) => {
    acc[color] = variants
      .filter((variant) => variant.color === color)
      .reduce((sizesAcc, variant) => {
        sizesAcc[variant.size] = Number(variant.stock) || 0;
        return sizesAcc;
      }, {});
    return acc;
  }, {});
  const colorImages = colors.reduce((acc, color) => {
    const match = variants.find((variant) => variant.color === color && variant.images?.length);
    acc[color] = match?.images || payload.colorImages?.[color] || [];
    return acc;
  }, {});
  const stock = variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);

  return {
    ...payload,
    variants,
    colors,
    sizes,
    sizeStock,
    colorImages,
    stock,
  };
};

export const getProducts = async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    size,
    sort = '-createdAt',
    featured,
    sale,
    collection,
  } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (size) query.sizes = size;
  if (featured === 'true') query.featured = true;
  if (sale === 'true') query.salePrice = { $gt: 0 };
  if (minPrice || maxPrice) {
    const priceQuery = {};
    if (minPrice) priceQuery.$gte = Number(minPrice);
    if (maxPrice) priceQuery.$lte = Number(maxPrice);
    query.$or = [{ salePrice: priceQuery }, { price: priceQuery }];
    delete query.salePrice;
  }
  if (search) query.$text = { $search: search };

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    sale: { salePrice: -1, createdAt: -1 },
    '-createdAt': { createdAt: -1 },
  };
  const resolvedSort = collection === 'new' ? { createdAt: -1 } : sortMap[sort] || { createdAt: -1 };
  const products = await Product.find(query).sort(resolvedSort).limit(50);
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

  const payload = normalizeProductPayload({ ...req.body, images: req.body.images?.length ? req.body.images : images });
  const product = await Product.create(payload);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const payload = normalizeProductPayload(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
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
