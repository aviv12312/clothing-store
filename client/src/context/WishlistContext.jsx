import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      return exists ? prev.filter((i) => i._id !== product._id) : [...prev, product];
    });
  };

  const isLiked = (productId) => items.some((i) => i._id === productId);

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked, count }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
