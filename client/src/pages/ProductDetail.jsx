import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import { trackViewProduct, trackAddToCart } from '../services/analytics';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#e8e8e6]/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <span className="font-['Noto_Serif'] text-sm text-[#1a1a1a] uppercase tracking-widest">{title}</span>
        <span
          className="material-symbols-outlined text-[#666666] transition-transform duration-300"
          style={{ fontSize: '18px', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          add
        </span>
      </button>
      {open && (
        <div className="pb-6 font-['Manrope'] text-sm text-[#666666] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      trackViewProduct(data);
      if (data.sizes?.length)  setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);

      // טען מוצרים דומים — אותה קטגוריה, ללא המוצר הנוכחי
      api.get('/products', { params: { category: data.category, limit: 4 } })
        .then(({ data: rel }) => setRelated(rel.filter((p) => p._id !== id).slice(0, 4)))
        .catch(() => {});
    });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="material-symbols-outlined text-[#bbbbbb] animate-spin" style={{ fontSize: '36px' }}>progress_activity</span>
      </div>
    );
  }

  // מלאי לפי מידה נבחרת
  const currentStock = selectedSize && product.sizeStock?.[selectedSize] !== undefined
    ? product.sizeStock[selectedSize]
    : product.stock;

  const cartItem = items.find((i) => i.productId === product._id && i.size === selectedSize);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const canAdd = currentStock > 0 && cartQty < currentStock;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem(product, selectedSize, selectedColor);
    trackAddToCart(product, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // תמונות לפי צבע נבחר — נפילה לתמונות כלליות
  const images = (product.colorImages?.[selectedColor]?.length
    ? product.colorImages[selectedColor]
    : product.images) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="px-8 md:px-16 mb-8">
          <div className="flex items-center gap-2 font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#666666]">
            <Link to="/" className="hover:text-[#000000] transition-colors">בית</Link>
            <span className="text-[#bbbbbb]">/</span>
            <Link to="/shop" className="hover:text-[#000000] transition-colors">חנות</Link>
            <span className="text-[#bbbbbb]">/</span>
            <span className="text-[#1a1a1a]">{product.name}</span>
          </div>
        </div>

        <div className="px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ── Left: Image Grid ─────────────────────────────────── */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3 w-16 flex-shrink-0">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-[3/4] overflow-hidden border transition-all ${
                      activeImage === i ? 'border-[#1a1a1a]' : 'border-[#e8e8e6]/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f3] w-full relative">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage] || images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#bbbbbb]" style={{ fontSize: '64px' }}>checkroom</span>
                  </div>
                )}
                {product.salePrice && (
                  <div className="absolute top-4 right-4 gold-shimmer text-[0.6rem] uppercase tracking-widest font-['Manrope'] font-bold px-3 py-1">
                    Sale
                  </div>
                )}
              </div>

              {/* Secondary images below */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {images.slice(1, 3).map((img, i) => (
                    <div key={i} className="aspect-[3/4] overflow-hidden bg-[#f5f5f3] cursor-pointer" onClick={() => setActiveImage(i + 1)}>
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info (sticky) ──────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-7">
            {/* Collection label */}
            <div className="flex items-center gap-3">
              <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.25rem] text-[#1a1a1a]">AW25 Collection</span>
              <span className="text-[#bbbbbb]">—</span>
              <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.15rem] text-[#666666]">{product.category}</span>
            </div>

            {/* Name */}
            <h1 className="font-['Noto_Serif'] text-4xl md:text-5xl text-[#1a1a1a] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {product.salePrice ? (
                <>
                  <span className="font-['Noto_Serif'] text-3xl text-[#1a1a1a]">₪{product.salePrice}</span>
                  <span className="font-['Manrope'] text-lg text-[#bbbbbb] line-through">₪{product.price}</span>
                </>
              ) : (
                <span className="font-['Noto_Serif'] text-3xl text-[#1a1a1a]">₪{product.price}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-['Manrope'] text-sm text-[#666666] leading-relaxed border-t border-[#e8e8e6]/30 pt-5">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.2rem] text-[#666666] mb-3">
                  צבע: <span className="text-[#1a1a1a]">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedColor(c); setActiveImage(0); }}
                      className={`px-4 py-1.5 border text-xs font-['Manrope'] uppercase tracking-wider transition-all ${
                        selectedColor === c
                          ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#1a1a1a]/5'
                          : 'border-[#e8e8e6]/50 text-[#666666] hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.2rem] text-[#666666]">
                    מידה: <span className="text-[#1a1a1a]">{selectedSize}</span>
                  </p>
                  <button className="font-['Manrope'] text-[0.6rem] uppercase tracking-wider text-[#1a1a1a] hover:text-[#000000] transition-colors">
                    מדריך מידות
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 border text-xs font-['Manrope'] uppercase tracking-wide transition-all ${
                        selectedSize === s
                          ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#1a1a1a]/5'
                          : 'border-[#e8e8e6]/50 text-[#666666] hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock warning לפי מידה */}
            {currentStock === 0 && selectedSize && (
              <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-wider text-red-500">
                מידה {selectedSize} — אזלה מהמלאי
              </p>
            )}
            {currentStock > 0 && isAdmin && (
              <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-wider text-[#1a1a1a]">
                נותרו {currentStock} פריטים במידה {selectedSize}
              </p>
            )}
            {currentStock > 0 && !isAdmin && currentStock < 10 && (
              <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-wider text-[#1a1a1a]">
                כמות מלאי נמוכה
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className={`w-full py-4 text-xs font-['Manrope'] uppercase tracking-[0.2em] font-bold transition-all ${
                  !canAdd
                    ? 'bg-[#f5f5f3] text-[#bbbbbb] cursor-not-allowed border border-[#e8e8e6]/40'
                    : addedToCart
                    ? 'bg-[#f5f5f3] text-[#1a1a1a] border border-[#1a1a1a]/60'
                    : 'gold-shimmer hover:opacity-80'
                }`}
              >
                {currentStock === 0 ? 'אזל המלאי' : !canAdd ? 'הגעת למקסימום המלאי' : addedToCart ? 'נוסף לעגלה ✓' : 'הוסף לעגלה'}
              </button>
              <button className="w-full py-4 text-xs font-['Manrope'] uppercase tracking-[0.2em] font-semibold border border-[#e8e8e6]/60 text-[#666666] hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all">
                שאלה על מידה מותאמת
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-4">
              <AccordionItem title="הרכב וטיפול">
                <p>100% צמר מרינו Super 150s. ניקוי יבש בלבד. אחסן בשקית אריג. אל תחשוף לאור שמש ישיר.</p>
              </AccordionItem>
              <AccordionItem title="משלוח והחזרות">
                <p>משלוח חינם לכל הארץ בהזמנות מעל ₪500. החזרה תוך 14 יום. המוצר חייב להיות במצב המקורי עם תגיות.</p>
              </AccordionItem>
              <AccordionItem title="מידות ומדריך">
                <p>המוצר מיוצר לפי מידות סטנדרטיות ישראליות. במקרה של ספק, פנה לצוות שירות הלקוחות שלנו לייעוץ מידה אישי.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* ── Philosophy Section ────────────────────────────────── */}
        <div className="mt-24 px-8 md:px-16 py-20 bg-[#f5f5f3]">
          <div className="max-w-3xl">
            <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.3rem] text-[#1a1a1a] mb-6">Philosophy</p>
            <h2 className="font-['Noto_Serif'] text-3xl md:text-4xl text-[#1a1a1a] leading-snug mb-6">
              כל פריט הוא הצהרה שקטה של זהות
            </h2>
            <p className="font-['Manrope'] text-sm text-[#666666] leading-relaxed max-w-xl">
              אנחנו מאמינים שלבוש טוב אינו אמירה, הוא מהות. Dream &amp; Work מתמחה בלבוש גברים שמשלב מסורת תפירה אירופאית עם חינה ים-תיכונית מודרנית.
            </p>
          </div>
        </div>
      </main>

      {/* ── נצפה גם ── */}
      {related.length > 0 && (
        <section className="px-8 md:px-16 py-20 border-t border-[#e8e8e6]/20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.3rem] text-[#1a1a1a] mb-2">You May Also Like</p>
              <h2 className="font-['Noto_Serif'] text-3xl text-[#1a1a1a]">נצפה גם</h2>
            </div>
            <Link to={`/shop?category=${product.category}`}
              className="font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#666666] hover:text-[#000000] transition-colors border-b border-[#e8e8e6]/40 pb-0.5">
              לכל הקולקציה ←
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {related.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="group">
                <div className="relative overflow-hidden aspect-[3/4] bg-[#f5f5f3] mb-4">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#bbbbbb]" style={{ fontSize: '36px' }}>checkroom</span>
                    </div>
                  )}
                  {p.salePrice && (
                    <div className="absolute top-2 right-2 bg-[#1a1a1a] text-white px-2 py-0.5 text-[0.55rem] font-['Manrope'] font-bold uppercase tracking-widest">
                      SALE
                    </div>
                  )}
                </div>
                <p className="font-['Noto_Serif'] text-sm text-[#1a1a1a] mb-1 group-hover:text-[#000000] transition-colors">{p.name}</p>
                <div className="flex items-center gap-2">
                  {p.salePrice ? (
                    <>
                      <span className="font-['Manrope'] text-sm text-[#1a1a1a]">₪{p.salePrice}</span>
                      <span className="font-['Manrope'] text-xs text-[#bbbbbb] line-through">₪{p.price}</span>
                    </>
                  ) : (
                    <span className="font-['Manrope'] text-sm text-[#1a1a1a]">₪{p.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
