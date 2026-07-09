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
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-32 md:px-16">
        <header className="reveal mb-12 md:mb-16">
          <p className="editorial-kicker text-outline">{t('wishlist.privateEdit')}</p>
          <h1 className="mt-4 font-headline text-4xl tracking-tighter text-on-surface sm:text-5xl md:text-6xl">
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
          <div className="motion-grid grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-2 md:gap-x-10 md:gap-y-16 xl:grid-cols-3">
            {items.map((p) => (
              <div key={p._id} className="group relative motion-lift">
                <button
                  onClick={() => toggle(p)}
                  aria-label={t('wishlist.removeTitle')}
                  className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white md:left-4 md:top-4"
                  title={t('wishlist.removeTitle')}
                >
                  <span className="material-symbols-outlined text-red-400 text-xl" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </button>

                <Link to={`/product/${p._id}`}>
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-surface-container md:mb-5">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="motion-image w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FBFAF7]">
                        <span className="material-symbols-outlined text-5xl text-outline">checkroom</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-headline text-base leading-tight text-on-surface md:text-lg">{p.name}</p>
                    <p className="mt-1 font-body text-xs text-outline md:text-sm">{p.category}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    {p.salePrice ? (
                      <>
                        <p className="font-body text-base text-on-surface md:text-lg">₪{p.salePrice}</p>
                        <p className="text-xs text-outline line-through md:text-sm">₪{p.price}</p>
                      </>
                    ) : (
                      <p className="font-body text-base text-on-surface md:text-lg">₪{p.price}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addItem(p, p.sizes?.[0] || 'M', p.colors?.[0] || '')}
                  className="motion-cta mt-4 w-full translate-y-0 bg-[#121211] py-3 font-label text-[0.62rem] uppercase tracking-[0.16rem] text-white opacity-100 transition-all hover:bg-black md:translate-y-3 md:text-xs md:tracking-widest md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
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
