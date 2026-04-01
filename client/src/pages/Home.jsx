import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import AIChatButton from '../components/AIChatButton';
import heroBg from '../assets/logo.png';


function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f5f5f3] mb-5">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#bbbbbb]" style={{ fontSize: '48px' }}>checkroom</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/70 via-transparent to-transparent">
          <span className="gold-shimmer px-8 py-2.5 text-[0.65rem] uppercase tracking-widest font-['Manrope'] font-semibold">
            צפה במוצר
          </span>
        </div>
      </div>
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="font-['Noto_Serif'] text-base text-[#1a1a1a] mb-0.5">{product.name}</h3>
          <p className="text-[#666666] text-xs font-['Manrope'] uppercase tracking-widest">{product.category}</p>
        </div>
        <div className="text-right">
          {product.salePrice ? (
            <>
              <p className="font-['Manrope'] text-base text-[#1a1a1a]">₪{product.salePrice}</p>
              <p className="text-[#bbbbbb] line-through text-xs font-['Manrope']">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Manrope'] text-base text-[#1a1a1a]">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products', { params: { featured: true } });
        setFeatured(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoadingFeatured(false);
      }
    };
    const fetchNewCollection = async () => {
      try {
        const { data } = await api.get('/products', { params: { collection: 'new' } });
        setNewCollection(data.slice(0, 4));
      } catch {
        // silently fail, show nothing
      }
    };
    fetchFeatured();
    fetchNewCollection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden flex items-end">
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-white/80" />
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        <div className="relative z-20 p-10 lg:p-24 max-w-5xl">
          <span className="font-['Manrope'] text-[0.65rem] tracking-[0.25rem] uppercase text-[#1a1a1a] mb-5 block">
            קולקציית אביב / קיץ 2025
          </span>
          <h1 className="font-['Noto_Serif'] text-6xl md:text-8xl lg:text-9xl leading-[1.05] mb-10 text-[#1a1a1a]">
            שלמות <br /> מדודה.
          </h1>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Link
              to="/shop"
              className="gold-shimmer px-12 py-4 font-['Manrope'] text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
            >
              גלה את הקולקציה
            </Link>
            <p className="text-[#666666] max-w-sm font-['Manrope'] text-sm leading-relaxed">
              אדריכלות בתנועה. גלה את תקני הגברות החדשים לאיש המקצועי השאפתן.
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────── */}
      <section className="px-8 lg:px-16 py-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <h2 className="font-['Noto_Serif'] text-4xl text-[#1a1a1a]">הבולטים</h2>
          <Link
            to="/shop"
            className="font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#1a1a1a] border-b border-[#1a1a1a]/30 pb-0.5 hover:border-[#000000] transition-colors"
          >
            כל המוצרים
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="flex items-center justify-center h-64">
            <span className="material-symbols-outlined text-[#bbbbbb] animate-spin" style={{ fontSize: '36px' }}>progress_activity</span>
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          /* Fallback static cards when API returns nothing */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'The Groom Suit', subtitle: 'Super 150s Merino Wool', price: '₪4,200', id: 1 },
              { title: 'The Formal Blazer', subtitle: 'Egyptian Cotton', price: '₪2,800', id: 2 },
              { title: 'Casual Essential', subtitle: 'Premium Linen', price: '₪680', id: 3 },
            ].map((item) => (
              <Link to="/shop" key={item.id} className="group cursor-pointer block">
                <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f3] mb-5 relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#bbbbbb]" style={{ fontSize: '64px' }}>checkroom</span>
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/70 via-transparent to-transparent">
                    <span className="gold-shimmer px-8 py-2.5 text-[0.65rem] uppercase tracking-widest font-['Manrope'] font-semibold">
                      צפה במוצר
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h3 className="font-['Noto_Serif'] text-base text-[#1a1a1a] mb-0.5">{item.title}</h3>
                    <p className="text-[#666666] text-xs font-['Manrope'] uppercase tracking-widest">{item.subtitle}</p>
                  </div>
                  <p className="font-['Manrope'] text-base text-[#1a1a1a]">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Quote / Editorial ──────────────────────────────────── */}
      <section className="py-28 px-8 bg-[#f5f5f3] flex flex-col items-center text-center gap-6">
        <div className="w-12 h-[1px] bg-[#1a1a1a]" />
        <blockquote className="font-['Noto_Serif'] italic text-2xl md:text-3xl text-[#1a1a1a] max-w-2xl leading-snug" dir="ltr">
          "Dress shabbily and they remember the dress;<br />dress impeccably and they remember the man."
        </blockquote>
        <p className="font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#666666]">— Coco Chanel</p>
        <div className="w-12 h-[1px] bg-[#1a1a1a]" />
      </section>

      {/* ── New Collection ─────────────────────────────────────── */}
      <section className="px-8 lg:px-16 py-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="font-['Noto_Serif'] text-4xl text-[#1a1a1a] mb-2">הקולקציה החדשה</h2>
            <p className="font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#1a1a1a]">AW 2025</p>
          </div>
          <Link
            to="/shop?collection=new"
            className="font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#1a1a1a] border-b border-[#1a1a1a]/30 pb-0.5 hover:border-[#000000] transition-colors"
          >
            גלה הכל
          </Link>
        </div>

        {newCollection.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {newCollection.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'חתן ומלווים', sub: 'Groom & Groomsmen' },
              { name: 'Casual', sub: 'Everyday Essentials' },
              { name: 'Formal', sub: 'Business & Events' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className="group border border-[#e8e8e6]/40 p-10 text-center hover:border-[#000000] transition-colors duration-300 flex flex-col gap-2"
              >
                <span className="font-['Noto_Serif'] text-xl text-[#1a1a1a] group-hover:text-[#000000] transition-colors" dir="ltr">
                  {cat.name}
                </span>
                <span className="font-['Manrope'] text-[0.6rem] tracking-[0.15rem] uppercase text-[#666666]">
                  {cat.sub}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <AIChatButton />
    </div>
  );
}
