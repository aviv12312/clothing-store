import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // סנכרון עגלה לשרת (לצורך Abandoned Cart)
  const syncCart = useCallback((cartItems) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !cartItems) return;
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    api.post('/cart/save', { items: cartItems, total }).catch(() => {});
  }, []);

  const addItem = (product, size, color, quantity = 1) => {
    const stock = size && product.sizeStock?.[size] !== undefined
      ? product.sizeStock[size]
      : product.stock;

    setItems((prev) => {
      const exists = prev.find((i) => i.productId === product._id && i.size === size);
      const currentQty = exists ? exists.quantity : 0;
      if (currentQty + quantity > stock) return prev;
      const next = exists
        ? prev.map((i) => i.productId === product._id && i.size === size ? { ...i, quantity: i.quantity + quantity, stock } : i)
        : [...prev, { productId: product._id, name: product.name, price: product.salePrice || product.price, image: product.images?.[0], size, color, quantity, stock }];
      syncCart(next);
      return next;
    });
  };

  const removeItem = (productId, size) =>
    setItems((prev) => {
      const next = prev.filter((i) => !(i.productId === productId && i.size === size));
      syncCart(next);
      return next;
    });

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) return removeItem(productId, size);
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId && i.size === size);
      if (item?.stock && quantity > item.stock) return prev;
      const next = prev.map((i) => i.productId === productId && i.size === size ? { ...i, quantity } : i);
      syncCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    api.delete('/cart/clear').catch(() => {});
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
