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

  const toneClass = lightMode ? 'text-[#111111]' : 'text-white';
  const logoFilter = lightMode ? '' : 'invert';
  const badgeClass = lightMode ? 'bg-[#111111] text-white' : 'bg-white text-black';

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'px-4 pt-4 md:px-6' : 'px-3 pt-3 md:px-6 md:pt-5'
        } ${!isHomePage && scrolled ? 'pointer-events-none -translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between">
          <div className={`flex items-center gap-4 md:gap-8 transition-colors duration-300 ${toneClass}`}>
            <div className="hidden md:flex md:items-center md:gap-4">
              {user ? (
                <>
                  <button onClick={handleLogout} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Logout</button>
                  {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Admin</Link>}
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] transition-opacity hover:opacity-70">Login</Link>
              )}
            </div>

            <Link to="/profile" onClick={closeMenu} className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70">
              <span className="material-symbols-outlined">person</span>
            </Link>

            <Link to="/cart" onClick={closeMenu} className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70">
              <span className="material-symbols-outlined">shopping_bag</span>
              {count > 0 && <span className={`absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.48rem] font-bold ${badgeClass}`}>{count}</span>}
            </Link>

            <Link to="/wishlist" onClick={closeMenu} className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </Link>
          </div>

          <div className={`hidden items-center gap-8 transition-colors duration-300 md:flex ${toneClass}`}>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={closeMenu} className="font-['Manrope'] text-[0.68rem] uppercase tracking-[0.22rem] transition-opacity hover:opacity-70">{link.label}</Link>
            ))}
          </div>

          <div className={`flex items-center gap-4 transition-colors duration-300 ${toneClass}`}>
            <button onClick={() => setMenuOpen((open) => !open)} className="flex h-10 items-center gap-2 transition-opacity hover:opacity-70 md:hidden" aria-label="menu">
              <span className="material-symbols-outlined">menu</span>
              <span className="font-['Manrope'] text-[0.68rem] uppercase tracking-[0.22rem]">Menu</span>
            </button>

            <Link to="/" className="flex items-center gap-3" dir="ltr">
              <div className="leading-none">
                <p style={{ fontFamily: 'YoungBest, serif' }} className="text-xl tracking-[-0.02em] md:text-3xl">Dream &amp; Work</p>
                <p className="mt-1 font-['Manrope'] text-[0.52rem] uppercase tracking-[0.34rem] opacity-80">Editorial Menswear</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-[rgba(17,17,17,0.32)] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu} />
        <div className={`absolute right-0 top-0 h-full w-[84vw] max-w-sm bg-white px-6 pb-8 pt-24 shadow-[0_24px_60px_rgba(27,28,28,0.08)] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-7">
            {NAV_LINKS.map((link) => <Link key={link.to} to={link.to} onClick={closeMenu} className="font-['Noto_Serif'] text-2xl tracking-[-0.05em] text-[#111111]">{link.label}</Link>)}
          </div>

          <div className="mt-12 space-y-4 bg-[#f7f7f7] p-5">
            <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#6e6667]">Collections</p>
            {SUB_CATEGORIES.map((cat) => <Link key={cat.to} to={cat.to} onClick={closeMenu} className="block font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-[#111111]">{cat.label}</Link>)}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">Admin</Link>}
                <button onClick={handleLogout} className="text-right font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed inset-x-0 top-[72px] z-40 hidden justify-center transition-all duration-500 md:flex ${isHomePage && scrolled ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}>
        <div className={`flex gap-8 transition-colors duration-300 ${toneClass}`}>
          {SUB_CATEGORIES.map((cat) => <Link key={cat.to} to={cat.to} onClick={closeMenu} className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] transition-opacity hover:opacity-70">{cat.label}</Link>)}
        </div>
      </div>
    </>
  );
}
