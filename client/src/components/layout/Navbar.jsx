import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const NAV_LINKS = [
  { label: 'New Collection', to: '/shop?collection=new' },
  { label: 'Sale', to: '/shop?sale=true' },
  { label: 'Shop', to: '/shop' },
];

const SUB_CATEGORIES = [
  { label: 'חתן ומלווים', to: '/shop?category=חתן ומלווים' },
  { label: 'Casual', to: '/shop?category=Casual' },
  { label: 'Formal', to: '/shop?category=Formal' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 48;
      setScrolled(nextScrolled);

      if (!isHomePage) {
        setLightMode(true);
        return;
      }

      setLightMode(window.scrollY > window.innerHeight * 0.72);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

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

  const toneClass = lightMode ? 'text-on-surface' : 'text-white';
  const badgeClass = lightMode ? 'bg-primary text-on-primary' : 'bg-white text-primary';

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'px-3 pt-3 sm:px-4 lg:px-6 lg:pt-4' : 'px-3 pt-3 sm:px-4 lg:px-6 lg:pt-5'
        } ${!isHomePage && scrolled ? 'pointer-events-none -translate-y-6 opacity-0' : 'translate-y-0 opacity-100'} ${
          lightMode ? 'bg-background/95 backdrop-blur-sm border-b border-outline-variant/40' : ''
        }`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-2 sm:gap-4">
          <div className={`flex shrink-0 items-center gap-1.5 transition-colors duration-300 sm:gap-2 lg:gap-6 ${toneClass}`}>
            <div className="hidden lg:flex lg:items-center lg:gap-4">
              {user ? (
                <>
                  <button onClick={handleLogout} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Logout</button>
                  {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Admin</Link>}
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Login</Link>
              )}
            </div>

            <Link to="/profile" onClick={closeMenu} className="flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:h-10 sm:w-10">
              <span className="material-symbols-outlined">person</span>
            </Link>

            <Link to="/cart" onClick={closeMenu} className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:h-10 sm:w-10">
              <span className="material-symbols-outlined">shopping_bag</span>
              {count > 0 && <span className={`absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.48rem] font-bold ${badgeClass}`}>{count}</span>}
            </Link>

            <Link to="/wishlist" onClick={closeMenu} className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:h-10 sm:w-10">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </Link>
          </div>

          <div className={`hidden items-center gap-6 transition-colors duration-300 lg:flex xl:gap-8 ${toneClass}`}>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={closeMenu} className="font-['Manrope'] text-[0.68rem] uppercase tracking-[0.22rem] transition-opacity hover:opacity-70">{link.label}</Link>
            ))}
          </div>

          <div className={`flex min-w-0 items-center justify-end gap-2 transition-colors duration-300 sm:gap-4 ${toneClass}`}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:h-10 sm:w-auto sm:gap-2 lg:hidden"
              aria-label={menuOpen ? 'close menu' : 'menu'}
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
              <span className="hidden font-['Manrope'] text-[0.68rem] uppercase tracking-[0.22rem] sm:inline">Menu</span>
            </button>

            <Link
              to="/"
              onClick={(e) => { if (isHomePage) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              className="flex min-w-0 items-center gap-3"
              dir="ltr"
            >
              <div className="min-w-0 text-left leading-none">
                <p style={{ fontFamily: 'Olondona, serif' }} className="truncate text-lg tracking-[0.02em] sm:text-xl md:text-2xl lg:text-3xl">Dream &amp; Work</p>
                <p className="mt-1 hidden truncate font-['Manrope'] text-[0.48rem] uppercase tracking-[0.22rem] opacity-80 sm:block md:text-[0.52rem] md:tracking-[0.34rem]">Editorial Menswear</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-[rgba(27,46,75,0.35)] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu} />
        <div className={`absolute right-0 top-0 h-full w-[min(84vw,24rem)] overflow-y-auto bg-background px-6 pb-8 pt-24 shadow-[0_24px_60px_rgba(27,46,75,0.12)] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-7">
            {NAV_LINKS.map((link) => <Link key={link.to} to={link.to} onClick={closeMenu} className="font-['Noto_Serif'] text-2xl tracking-[-0.05em] text-on-surface">{link.label}</Link>)}
          </div>

          <div className="mt-12 space-y-4 bg-surface p-5">
            <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-on-surface-variant">Collections</p>
            {SUB_CATEGORIES.map((cat) => <Link key={cat.to} to={cat.to} onClick={closeMenu} className="block font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-on-surface">{cat.label}</Link>)}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">Admin</Link>}
                <button onClick={handleLogout} className="text-right font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-on-surface">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed inset-x-0 top-[72px] z-40 hidden justify-center transition-all duration-500 lg:flex ${isHomePage && scrolled ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}>
        <div className={`flex gap-8 transition-colors duration-300 ${toneClass}`}>
          {SUB_CATEGORIES.map((cat) => <Link key={cat.to} to={cat.to} onClick={closeMenu} className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] transition-opacity hover:opacity-70">{cat.label}</Link>)}
        </div>
      </div>
    </>
  );
}

