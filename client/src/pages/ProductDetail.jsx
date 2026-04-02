import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import { trackViewProduct, trackAddToCart } from '../services/analytics';

const TRUST_ITEMS = [
  { title: 'Delivery', text: 'משלוח מהיר לכל הארץ ואריזה מוקפדת שמרגישה כמו קנייה של מותג פרימיום.' },
  { title: 'Returns', text: 'החלפה או החזרה בהתאם למדיניות, כל עוד הפריט נשאר חדש ובמצבו המקורי.' },
  { title: 'Styling', text: 'בחנות יוקרה הלקוח צריך הכוונה. הטקסטים כאן נותנים ביטחון לפני רכישה.' },
];

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f7f7f7] px-6 py-5 md:px-8">
      <button onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-right">
        <span className="font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-[#111111]">{title}</span>
        <span className="material-symbols-outlined text-[#6e6667] transition-transform duration-300" style={{ fontSize: '18px', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>add</span>
      </button>
      {open && <div className="pt-5 text-sm leading-7 text-[#5d5657]">{children}</div>}
    </div>
  );
}

function RelatedCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-[#b8b1b2]" style={{ fontSize: '42px' }}>checkroom</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#6e6667]">{product.category}</p>
          <p className="mt-2 font-['Noto_Serif'] text-lg tracking-[-0.04em] text-[#111111]">{product.name}</p>
        </div>
        <div className="text-left">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-base text-[#111111]">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.16rem] text-[#9d9596] line-through">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-base text-[#111111]">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      trackViewProduct(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);

      api.get('/products', { params: { category: data.category, limit: 4 } })
        .then(({ data: relatedData }) => setRelated(relatedData.filter((entry) => entry._id !== id).slice(0, 4)))
        .catch(() => {});
    };

    fetchProduct();
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    return (product.colorImages?.[selectedColor]?.length ? product.colorImages[selectedColor] : product.images) || [];
  }, [product, selectedColor]);

  if (!product) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-[#8f8889]" style={{ fontSize: '38px' }}>progress_activity</span></div>;
  }

  const getProductStock = (currentProduct, size, color) => {
    if (color && size && currentProduct.sizeStock?.[color]?.[size] !== undefined) {
      return Number(currentProduct.sizeStock[color][size]) || 0;
    }

    if (size && currentProduct.sizeStock?.[size] !== undefined) {
      return Number(currentProduct.sizeStock[size]) || 0;
    }

    return Number(currentProduct.stock) || 0;
  };

  const currentStock = getProductStock(product, selectedSize, selectedColor);
  const cartItem = items.find((entry) => entry.productId === product._id && entry.size === selectedSize && entry.color === selectedColor);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const canAdd = currentStock > 0 && cartQty < currentStock;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem(product, selectedSize, selectedColor);
    trackAddToCart(product, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const fitNote = product.category === 'Formal'
    ? 'גזרה מדויקת יותר שמתאימה למראה מחויט. אם אתה בין מידות, בדרך כלל עדיף לעלות מידה.'
    : 'גזרה נינוחה יותר שמתאימה ללבישה יומיומית ולשכבות קלות.';

  return (
    <div className="editorial-shell min-h-screen bg-white">
      <main className="px-6 pb-24 pt-28 md:px-12 lg:px-20 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex items-center gap-2 font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#6e6667]">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span className="text-[#111111]">{product.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] xl:gap-16">
            <div className="grid gap-4 md:grid-cols-[6rem_1fr] xl:grid-cols-[7rem_1fr]">
              <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
                {images.slice(0, 5).map((image, index) => (
                  <button key={image + index} onClick={() => setActiveImage(index)} className={`aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#f7f7f7] transition-opacity md:w-full ${activeImage === index ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}>
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="order-1 bg-[#f7f7f7] md:order-2">
                {images.length > 0 ? (
                  <img src={images[activeImage] || images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center"><span className="material-symbols-outlined text-[#b8b1b2]" style={{ fontSize: '60px' }}>checkroom</span></div>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-[#f7f7f7] p-7 md:p-10 xl:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#6e6667]">{product.category}</p>
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#6e6667]">Private Client Selection</p>
                </div>

                <h1 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl xl:text-6xl">{product.name}</h1>

                <div className="mt-6 flex items-baseline gap-4">
                  {product.salePrice ? (
                    <>
                      <span className="font-['Noto_Serif'] text-3xl text-[#111111]">₪{product.salePrice}</span>
                      <span className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#9d9596] line-through">₪{product.price}</span>
                    </>
                  ) : (
                    <span className="font-['Noto_Serif'] text-3xl text-[#111111]">₪{product.price}</span>
                  )}
                </div>

                {product.description && <p className="mt-8 max-w-2xl text-sm leading-7 text-[#5d5657]">{product.description}</p>}

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {TRUST_ITEMS.map((item) => (
                    <div key={item.title} className="bg-white px-4 py-4">
                      <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#6e6667]">{item.title}</p>
                      <p className="mt-3 text-sm leading-6 text-[#4e4748]">{item.text}</p>
                    </div>
                  ))}
                </div>

                {product.colors?.length > 0 && (
                  <div className="mt-10">
                    <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#6e6667]">Color <span className="text-[#111111]">{selectedColor}</span></p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button key={color} onClick={() => { setSelectedColor(color); setActiveImage(0); }} className={`px-4 py-3 text-xs uppercase tracking-[0.18rem] transition-colors ${selectedColor === color ? 'bg-[#111111] text-white' : 'bg-white text-[#111111] hover:bg-[#f1f1f1]'}`}>{color}</button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#6e6667]">Size <span className="text-[#111111]">{selectedSize}</span></p>
                      <span className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.24rem] text-[#6e6667]">Size Guide Available</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
                      {product.sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-4 text-xs uppercase tracking-[0.18rem] transition-colors ${selectedSize === size ? 'bg-[#111111] text-white' : 'bg-white text-[#111111] hover:bg-[#f1f1f1]'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3 border-t border-[rgba(17,17,17,0.08)] pt-8">
                  {currentStock === 0 && selectedSize && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#9b2c2c]">Size {selectedSize} is currently unavailable</p>}
                  {currentStock > 0 && isAdmin && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#111111]">{currentStock} units left in size {selectedSize}</p>}
                  {currentStock > 0 && !isAdmin && currentStock < 10 && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#111111]">Low stock available</p>}
                  <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#6e6667]">Estimated Delivery: 2-5 business days</p>
                  <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#6e6667]">Complimentary exchange support for sizing adjustments</p>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                  <button onClick={handleAddToCart} disabled={!canAdd} className={`py-5 text-center font-['Manrope'] text-[0.66rem] uppercase tracking-[0.28rem] transition-all ${!canAdd ? 'bg-[#ececec] text-[#9d9596] cursor-not-allowed' : addedToCart ? 'bg-[#3a6472] text-white' : 'gold-shimmer hover:opacity-95'}`}>
                    {currentStock === 0 ? 'Out of Stock' : !canAdd ? 'Stock Limit Reached' : addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <Link to="/cart" className="editorial-button-secondary w-full">View Cart</Link>
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <div className="bg-[#fbfaf8] px-6 py-6">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#6e6667]">Fit Notes</p>
                  <p className="mt-4 text-sm leading-7 text-[#4f4a4a]">{fitNote}</p>
                </div>
                <div className="bg-[#fbfaf8] px-6 py-6">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#6e6667]">Style Advice</p>
                  <p className="mt-4 text-sm leading-7 text-[#4f4a4a]">שלב את הפריט עם נעל מחויטת, חגורה מינימליסטית ושכבת tailoring נקייה כדי לשמור על מראה מדויק ויוקרתי.</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <AccordionItem title="Size Guide"><p>מדוד היקף חזה, מותן ואורך שרוול. אם אתה מתלבט בין שתי מידות, בחר במידה הגדולה יותר להתאמה נוחה יותר.</p></AccordionItem>
                <AccordionItem title="Fabric & Care"><p>Premium construction for occasionwear and formal dressing. Dry clean only and store on a structured hanger to preserve the silhouette.</p></AccordionItem>
                <AccordionItem title="Shipping & Returns"><p>משלוח מהיר, עדכוני סטטוס מסודרים, והחלפה או החזרה בהתאם למדיניות כל עוד הפריט חדש וללא שימוש.</p></AccordionItem>
                <AccordionItem title="Private Styling"><p>באתרי יוקרה המוצר לא רק נמכר, הוא גם מקבל הקשר. כאן אפשר להוסיף בעתיד WhatsApp, concierge או ייעוץ מידות אישי.</p></AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </main>

      {related.length > 0 && (
        <section className="px-6 pb-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-[#6e6667]">You May Also Like</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111]">Related pieces from the same edit.</h2>
              </div>
              <Link to={`/shop?category=${product.category}`} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#111111]">View full category</Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => <RelatedCard key={item._id} product={item} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
