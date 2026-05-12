import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import { trackViewProduct, trackAddToCart } from '../services/analytics';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollProgress } from '../hooks/useScrollProgress';

const TRUST_ITEMS = [
  { titleKey: 'product.trust.deliveryTitle', textKey: 'product.trust.deliveryText' },
  { titleKey: 'product.trust.returnsTitle', textKey: 'product.trust.returnsText' },
  { titleKey: 'product.trust.stylingTitle', textKey: 'product.trust.stylingText' },
];

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#FFFBF2] px-6 py-5 md:px-8">
      <button onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between text-right">
        <span className="font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-[#13243A]">{title}</span>
        <span className="material-symbols-outlined text-[#5A6B7F] transition-transform duration-300" aria-hidden="true" style={{ fontSize: '18px', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>add</span>
      </button>
      {open && <div className="motion-fade-up pt-5 text-sm leading-7 text-[#5A6B7F]">{children}</div>}
    </div>
  );
}

function RelatedCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="group block motion-lift">
      <div className="aspect-[3/4] overflow-hidden bg-[#FFFBF2]">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="motion-image h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-[#CDBFA1]" style={{ fontSize: '42px' }}>checkroom</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{product.category}</p>
          <p className="mt-2 font-['Noto_Serif'] text-lg tracking-[-0.04em] text-[#13243A]">{product.name}</p>
        </div>
        <div className="text-left">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-base text-[#13243A]">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.16rem] text-[#8AA3B8] line-through">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-base text-[#13243A]">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { t } = useTranslation();
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
  const galleryRef = useRef(null);
  const galleryProgress = useScrollProgress(galleryRef);

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
  const pageRef = useScrollReveal([product, images.length, related.length]);
  const galleryStyle = {
    '--story-scale': `${1.04 - galleryProgress * 0.025}`,
    '--scroll-progress': galleryProgress,
  };

  if (!product) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-[#8AA3B8]" style={{ fontSize: '38px' }}>progress_activity</span></div>;
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
    <div ref={pageRef} className="editorial-shell min-h-screen bg-white">
      <main className="px-6 pb-24 pt-28 md:px-12 lg:px-20 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="reveal mb-8 flex items-center gap-2 font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">
            <Link to="/">{t('product.home')}</Link>
            <span>/</span>
            <Link to="/shop">{t('product.shop')}</Link>
            <span>/</span>
            <span className="text-[#13243A]">{product.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] xl:gap-16">
            <div ref={galleryRef} className="reveal-left grid gap-4 md:grid-cols-[6rem_1fr] xl:grid-cols-[7rem_1fr]" style={galleryStyle}>
              <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
                {images.slice(0, 5).map((image, index) => (
                  <button key={image + index} onClick={() => setActiveImage(index)} aria-label={`הצגת תמונה ${index + 1} של ${product.name}`} className={`group aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#FFFBF2] transition-all duration-500 hover:scale-[1.04] md:w-full ${activeImage === index ? 'opacity-100 ring-1 ring-[#13243A]' : 'opacity-55 hover:opacity-100'}`}>
                    <img src={image} alt="" className="motion-image h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="gallery-frame order-1 relative overflow-hidden bg-[#FFFBF2] md:order-2">
                {images.length > 0 ? (
                  <>
                    <img key={images[activeImage] || images[0]} src={images[activeImage] || images[0]} alt={product.name} className="story-visual mask-reveal h-full w-full object-cover" />
                    <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-[#13243A]/10">
                      <div className="scroll-progress h-full w-full bg-[#13243A]/60" />
                    </div>
                  </>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center"><span className="material-symbols-outlined text-[#CDBFA1]" style={{ fontSize: '60px' }}>checkroom</span></div>
                )}
              </div>
            </div>

            <div className="reveal-right lg:sticky lg:top-28 lg:self-start">
              <div className="motion-lift bg-[#FFFBF2] p-7 md:p-10 xl:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#5A6B7F]">{product.category}</p>
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{t('product.privateSelection')}</p>
                </div>

                <h1 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#13243A] md:text-5xl xl:text-6xl">{product.name}</h1>
                <p className="editorial-hand mt-4 text-3xl text-gold-dark">{t('product.signaturePiece')}</p>

                <div className="mt-6 flex items-baseline gap-4">
                  {product.salePrice ? (
                    <>
                      <span className="font-['Noto_Serif'] text-3xl text-[#13243A]">₪{product.salePrice}</span>
                      <span className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#8AA3B8] line-through">₪{product.price}</span>
                    </>
                  ) : (
                    <span className="font-['Noto_Serif'] text-3xl text-[#13243A]">₪{product.price}</span>
                  )}
                </div>

                {product.description && <p className="mt-8 max-w-2xl text-sm leading-7 text-[#5A6B7F]">{product.description}</p>}

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {TRUST_ITEMS.map((item) => (
                    <div key={item.titleKey} className="motion-lift bg-white px-4 py-4">
                      <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{t(item.titleKey)}</p>
                      <p className="mt-3 text-sm leading-6 text-[#5A6B7F]">{t(item.textKey)}</p>
                    </div>
                  ))}
                </div>

                {product.colors?.length > 0 && (
                  <div className="mt-10">
                    <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#5A6B7F]">{t('common.color')} <span className="text-[#13243A]">{selectedColor}</span></p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button key={color} onClick={() => { setSelectedColor(color); setActiveImage(0); }} className={`px-4 py-3 text-xs uppercase tracking-[0.18rem] transition-all hover:-translate-y-0.5 ${selectedColor === color ? 'bg-[#13243A] text-white' : 'bg-white text-[#13243A] hover:bg-[#EFE7D6]'}`}>{color}</button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#5A6B7F]">{t('common.size')} <span className="text-[#13243A]">{selectedSize}</span></p>
                      <span className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">{t('product.sizeGuide')}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
                      {product.sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-4 text-xs uppercase tracking-[0.18rem] transition-all hover:-translate-y-0.5 ${selectedSize === size ? 'bg-[#13243A] text-white' : 'bg-white text-[#13243A] hover:bg-[#EFE7D6]'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3 border-t border-[rgba(17,17,17,0.08)] pt-8">
                  {currentStock === 0 && selectedSize && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#9C5A40]">{t('product.unavailableSize', { size: selectedSize })}</p>}
                  {currentStock > 0 && isAdmin && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#13243A]">{t('product.unitsLeft', { count: currentStock, size: selectedSize })}</p>}
                  {currentStock > 0 && !isAdmin && currentStock < 10 && <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#13243A]">{t('product.lowStock')}</p>}
                  <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">{t('product.estimatedDelivery')}</p>
                  <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">{t('product.exchangeSupport')}</p>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                  <button onClick={handleAddToCart} disabled={!canAdd} className={`motion-cta py-5 text-center font-['Manrope'] text-[0.66rem] uppercase tracking-[0.28rem] transition-all ${!canAdd ? 'bg-[#EFE7D6] text-[#8AA3B8] cursor-not-allowed' : addedToCart ? 'bg-[#1B2E4B] text-white scale-[1.01]' : 'gold-shimmer hover:opacity-95'}`}>
                    {currentStock === 0 ? t('common.outOfStock') : !canAdd ? t('common.stockLimitReached') : addedToCart ? t('common.addedToCart') : t('common.addToCart')}
                  </button>
                  <Link to="/cart" className="editorial-button-secondary motion-cta w-full">{t('common.viewCart')}</Link>
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <div className="motion-lift bg-background px-6 py-6">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{t('product.fitNotes')}</p>
                  <p className="mt-4 text-sm leading-7 text-[#5A6B7F]">{fitNote}</p>
                </div>
                <div className="motion-lift bg-background px-6 py-6">
                  <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{t('product.styleAdvice')}</p>
                  <p className="mt-4 text-sm leading-7 text-[#5A6B7F]">{t('product.styleText')}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <AccordionItem title={t('product.sizeGuide')}>
                  <div className="overflow-x-auto" dir="rtl">
                    <table className="w-full text-xs font-['Manrope'] border-collapse">
                      <thead>
                        <tr className="bg-[#FFFBF2]">
                          <th className="border border-[#EFE7D6] px-3 py-2 text-right font-semibold">מידה</th>
                          <th className="border border-[#EFE7D6] px-3 py-2 text-right font-semibold">היקף חזה (ס"מ)</th>
                          <th className="border border-[#EFE7D6] px-3 py-2 text-right font-semibold">היקף מותן (ס"מ)</th>
                          <th className="border border-[#EFE7D6] px-3 py-2 text-right font-semibold">גובה מומלץ (ס"מ)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { size: 'XS', chest: '82–87', waist: '72–77', height: '162–167' },
                          { size: 'S',  chest: '88–93', waist: '78–83', height: '168–172' },
                          { size: 'M',  chest: '94–99', waist: '84–89', height: '173–177' },
                          { size: 'L',  chest: '100–105', waist: '90–95', height: '178–182' },
                          { size: 'XL', chest: '106–111', waist: '96–101', height: '183–187' },
                          { size: 'XXL',chest: '112–117', waist: '102–107', height: '188–192' },
                        ].map((row) => (
                          <tr key={row.size} className="hover:bg-[#FFFBF2]">
                            <td className="border border-[#EFE7D6] px-3 py-2 font-semibold">{row.size}</td>
                            <td className="border border-[#EFE7D6] px-3 py-2">{row.chest}</td>
                            <td className="border border-[#EFE7D6] px-3 py-2">{row.waist}</td>
                            <td className="border border-[#EFE7D6] px-3 py-2">{row.height}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-3 text-xs text-[#8AA3B8]">💡 אם אתה מתלבט בין שתי מידות — בחר במידה הגדולה לנוחות מיטבית.</p>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('product.materialCare')}>
                  <div dir="rtl">
                    {product.material ? (
                      <p className="mb-3"><strong>הרכב:</strong> {product.material}</p>
                    ) : (
                      <p className="mb-3 text-[#8AA3B8]">פרטי הרכב הבד יצוינו בתווית המוצר.</p>
                    )}
                    <ul className="space-y-1 text-xs text-[#5A6B7F]">
                      {product.careInstructions ? (
                        product.careInstructions.split('\n').map((line, i) => <li key={i}>• {line}</li>)
                      ) : (
                        <>
                          <li>• כביסה עד 30° בלבד</li>
                          <li>• אין לייבש במייבש</li>
                          <li>• גיהוץ בחום נמוך</li>
                          <li>• ניקוי יבש מומלץ לחליפות פורמליות</li>
                        </>
                      )}
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('product.shippingReturns')}>
                  <div dir="rtl" className="text-xs text-[#5A6B7F] space-y-2">
                    <p>• זמן אספקה: 3–7 ימי עסקים.</p>
                    <p>• ניתן לבטל עסקה תוך <strong>14 יום</strong> מיום קבלת המוצר.</p>
                    <p>• המוצר יש להחזיר ללא שימוש, עם תגיות ובאריזה מקורית.</p>
                    <p>• <a href="/legal/returns" className="underline hover:text-[#13243A]">למדיניות המלאה לחץ כאן</a></p>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('product.privateStyling')}><p>{t('product.privateStylingText')}</p></AccordionItem>
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
                <p className="editorial-kicker text-[#5A6B7F]">{t('product.related')}</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#13243A]">{t('product.relatedTitle')}</h2>
              </div>
              <Link to={`/shop?category=${product.category}`} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#13243A]">{t('product.fullCategory')}</Link>
            </div>
            <div className="motion-grid grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => <RelatedCard key={item._id} product={item} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
