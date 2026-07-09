import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from 'react-i18next';

const CATEGORY_LINKS = [
  { labelKey: 'nav.suits', to: '/shop?category=חליפות' },
  { labelKey: 'nav.shirts', to: '/shop?category=מכופתרת' },
  { labelKey: 'nav.pants', to: '/shop?category=מכנסיים' },
];

const SALE_LINK = { label: 'SALE', to: '/shop?sale=true' };

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 48;
      setScrolled(nextScrolled);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/');
  };
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'he' ? 'en' : 'he');

  const badgeClass = 'bg-on-primary text-primary';

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-primary/95 px-3 text-on-primary shadow-[0_18px_60px_rgba(17,24,39,0.18)] backdrop-blur-md transition-all duration-500 sm:px-4 lg:px-8 ${
          scrolled ? 'py-2' : 'py-2.5'
        }`}
      >
        <div className="mx-auto hidden max-w-[1920px] items-center justify-between border-b border-white/10 pb-2 font-['Manrope'] text-[0.54rem] uppercase tracking-[0.18rem] text-white/60 lg:flex">
          <div className="flex items-center gap-4">
            <Link to="/cart" onClick={closeMenu} aria-label={`Cart, ${count} items`} className="relative flex items-center gap-1 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '15px' }}>shopping_bag</span>
              <span>({count})</span>
            </Link>
            <Link to="/profile" onClick={closeMenu} aria-label={t('nav.profile')} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '15px' }}>person</span>
            </Link>
            <Link to="/wishlist" onClick={closeMenu} aria-label={`Wishlist, ${wishlistCount} items`} className="relative transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '15px', fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </Link>
            <button onClick={() => setMenuOpen((open) => !open)} aria-label={t('nav.menu')} aria-expanded={menuOpen} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '16px' }}>search</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={toggleLanguage} aria-label="Switch language" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              HE / EN
            </button>
            <Link to="/contact" onClick={closeMenu} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              {i18n.language === 'he' ? 'שירות לקוחות' : 'Customer Care'}
            </Link>
            {user ? (
              <button onClick={handleLogout} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">{t('nav.logout')}</button>
            ) : (
              <Link to="/login" onClick={closeMenu} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">{t('nav.login')}</Link>
            )}
            {user?.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">{t('nav.admin')}</Link>}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-2 pt-2 sm:gap-4 lg:pt-3">
          <div className="hidden min-w-0 items-center justify-start gap-5 lg:flex xl:gap-7">
            {CATEGORY_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={closeMenu} className="whitespace-nowrap font-['Manrope'] text-[0.58rem] uppercase tracking-[0.2rem] text-white/76 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">{t(link.labelKey)}</Link>
            ))}
            <Link to={SALE_LINK.to} onClick={closeMenu} className="whitespace-nowrap font-['Manrope'] text-[0.58rem] font-semibold uppercase tracking-[0.2rem] text-sale transition-colors hover:text-sale-dark focus:outline-none focus:ring-2 focus:ring-sale/30">{SALE_LINK.label}</Link>
          </div>

          <Link
            to="/"
            onClick={(e) => { if (isHomePage) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            className="flex min-w-0 flex-col items-center justify-center text-center"
            dir="ltr"
          >
            <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="truncate text-[1.35rem] tracking-[0.04em] text-[#F3F1ED] sm:text-3xl lg:text-[2rem]">Dream &amp; Work</span>
            <span className="editorial-hand mt-0.5 hidden text-base text-white/45 sm:block">Dressed for the room</span>
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-1.5 text-white sm:gap-2 lg:hidden">
            <Link to="/cart" onClick={closeMenu} aria-label={`Cart, ${count} items`} className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-gold/30 sm:h-10 sm:w-10">
              <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
              {count > 0 && <span className={`absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.48rem] font-bold ${badgeClass}`}>{count}</span>}
            </Link>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:h-10 sm:w-auto sm:gap-2 lg:hidden"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          <div className="hidden items-center justify-end gap-4 text-white/72 lg:flex">
            <Link to="/profile" onClick={closeMenu} aria-label={t('nav.profile')} className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
            </Link>

            <Link to="/cart" onClick={closeMenu} aria-label={`Cart, ${count} items`} className="relative transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
              {count > 0 && <span className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[0.48rem] font-bold ${badgeClass}`}>{count}</span>}
            </Link>

            <Link to="/wishlist" onClick={closeMenu} aria-label={`Wishlist, ${wishlistCount} items`} className="relative transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-[rgba(11,11,11,0.35)] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu} />
        <div className={`absolute right-0 top-0 h-full w-[min(84vw,24rem)] overflow-y-auto bg-background px-6 pb-8 pt-24 shadow-[0_24px_60px_rgba(11,11,11,0.12)] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-7">
            {CATEGORY_LINKS.map((link) => <Link key={link.to} to={link.to} onClick={closeMenu} className="font-['Noto_Serif'] text-2xl tracking-[-0.05em] text-on-surface">{t(link.labelKey)}</Link>)}
            <Link to={SALE_LINK.to} onClick={closeMenu} className="font-['Noto_Serif'] text-2xl font-semibold tracking-[-0.05em] text-sale">{SALE_LINK.label}</Link>
            <Link to="/shop" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-on-surface-variant">{t('nav.shop')}</Link>
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <button onClick={toggleLanguage} className="text-right font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">{t('nav.language')}</button>
            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">{t('nav.profile')}</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">{t('nav.admin')}</Link>}
                <button onClick={handleLogout} className="text-right font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">{t('nav.logout')}</button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">{t('nav.loginRegister')}</Link>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
