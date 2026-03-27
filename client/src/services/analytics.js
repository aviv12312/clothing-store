// Google Analytics 4
const gtag = (...args) => window.gtag?.(...args);

// Facebook Pixel
const fbq = (...args) => window.fbq?.(...args);

export const trackViewProduct = (product) => {
  gtag('event', 'view_item', {
    currency: 'ILS',
    value: product.salePrice || product.price,
    items: [{ item_id: product._id, item_name: product.name, item_category: product.category, price: product.salePrice || product.price }],
  });
  fbq('track', 'ViewContent', {
    content_ids: [product._id],
    content_name: product.name,
    content_category: product.category,
    currency: 'ILS',
    value: product.salePrice || product.price,
  });
};

export const trackAddToCart = (product, size, color) => {
  gtag('event', 'add_to_cart', {
    currency: 'ILS',
    value: product.salePrice || product.price,
    items: [{ item_id: product._id, item_name: product.name, item_category: product.category, price: product.salePrice || product.price, item_variant: `${size} / ${color}` }],
  });
  fbq('track', 'AddToCart', {
    content_ids: [product._id],
    content_name: product.name,
    currency: 'ILS',
    value: product.salePrice || product.price,
  });
};

export const trackBeginCheckout = (items, total) => {
  gtag('event', 'begin_checkout', {
    currency: 'ILS',
    value: total,
    items: items.map(i => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  fbq('track', 'InitiateCheckout', {
    currency: 'ILS',
    value: total,
    num_items: items.length,
  });
};

export const trackPurchase = (orderId, total, items) => {
  gtag('event', 'purchase', {
    transaction_id: orderId,
    currency: 'ILS',
    value: total,
    items: items.map(i => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  fbq('track', 'Purchase', {
    currency: 'ILS',
    value: total,
    content_ids: items.map(i => i.productId),
  });
};

export const trackSearch = (term) => {
  gtag('event', 'search', { search_term: term });
  fbq('track', 'Search', { search_string: term });
};
