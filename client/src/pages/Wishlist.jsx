import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Wishlist() {
  const { t } = useTranslation();
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const pageRef = useScrollReveal([items.length]);

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen flex flex-col bg-white">
      <main className="flex-1 pt-32 pb-24 px-8 md:px-16 max-w-7xl mx-auto w-full">
        <header className="reveal mb-16">
          <p className="editorial-kicker text-outline">{t('wishlist.privateEdit')}</p>
          <h1 className="mt-4 font-headline text-5xl md:text-6xl tracking-tighter text-on-surface">
            {t('wishlist.title')}
          </h1>
          <p className="mt-3 text-outline font-label text-xs uppercase tracking-widest">
            {items.length === 0 ? t('wishlist.empty') : t('wishlist.saved', { count: items.length })}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="reveal-scale flex flex-col items-center justify-center py-32 gap-6 text-center">
            <span className="material-symbols-outlined text-7xl text-outline">favorite</span>
            <p className="font-label text-sm uppercase tracking-widest text-outline">
              {t('wishlist.noItems')}
            </p>
            <Link to="/shop" className="editorial-button motion-cta">
              {t('wishlist.discover')}
            </Link>
          </div>
        ) : (
          <div className="motion-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
            {items.map((p) => (
              <div key={p._id} className="group relative motion-lift">
                <button
                  onClick={() => toggle(p)}
                  aria-label={t('wishlist.removeTitle')}
                  className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-110"
                  title={t('wishlist.removeTitle')}
                >
                  <span className="material-symbols-outlined text-red-400 text-xl" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </button>

                <Link to={`/product/${p._id}`}>
                  <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-5">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="motion-image w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FFFBF2]">
                        <span className="material-symbols-outlined text-5xl text-outline">checkroom</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-headline text-lg text-on-surface">{p.name}</p>
                    <p className="text-outline text-sm font-body">{p.category}</p>
                  </div>
                  <div className="text-left">
                    {p.salePrice ? (
                      <>
                        <p className="font-body text-lg text-on-surface">₪{p.salePrice}</p>
                        <p className="text-outline line-through text-sm">₪{p.price}</p>
                      </>
                    ) : (
                      <p className="font-body text-lg text-on-surface">₪{p.price}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addItem(p, p.sizes?.[0] || 'M', p.colors?.[0] || '')}
                  className="motion-cta w-full mt-4 bg-[#13243A] text-white py-3 font-label text-xs uppercase tracking-widest hover:bg-black transition-all opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  {t('common.addToCart')}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
