import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const NAV_LINKS = [
  { label: 'New Collection', to: '/shop?collection=new' },
  { label: 'Sale', to: '/shop?sale=true' },
  { label: 'About', to: '/about' },
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // סגור תפריט בניווט
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 flex justify-between items-center px-5 md:px-12 py-4 md:py-5 transition-all duration-500"
        style={{ background: 'rgba(19,19,19,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Right: Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer" dir="ltr">
          <img
            src="/logo.jpeg"
            alt="D"
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
            style={{ filter: 'contrast(50) invert(1) sepia(1) saturate(3) hue-rotate(355deg) brightness(0.85)', mixBlendMode: 'screen' }}
          />
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-['Noto_Serif'] tracking-tighter text-[#e9c349] whitespace-nowrap leading-none">
              Dream &amp; Work
            </span>
            <div className="relative w-full flex justify-center mt-0.5">
              <span className="font-['Manrope'] text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.2em] text-[#e9c349] relative z-10 bg-[#131313] px-1 leading-none">
                Line
              </span>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#e9c349]/40 z-0"></div>
            </div>
          </div>
        </Link>

        {/* Center: nav links — desktop only */}
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}
              className="font-['Noto_Serif'] uppercase tracking-[0.1rem] text-xs text-[#c8c6c5] hover:text-[#e2e2e2] transition-colors duration-200">
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin"
              className="font-['Manrope'] uppercase tracking-[0.1rem] text-xs text-[#e9c349] hover:text-white transition-colors duration-200 font-semibold">
              ADMIN
            </Link>
          )}
        </div>

        {/* Left: icons */}
        <div className="flex items-center gap-3 md:gap-5 text-[#e9c349]">
          {/* Search — desktop only */}
          <button className="hidden md:block text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e9c349] text-[#131313] text-[0.5rem] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold font-['Manrope']">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>shopping_bag</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e9c349] text-[#131313] text-[0.5rem] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold font-['Manrope']">
                {count}
              </span>
            )}
          </Link>

          {/* User icon — desktop only */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
                  <span className="material-symbols-outlined">person</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-[#c8c6c5] hover:text-[#e2e2e2] transition-colors font-['Manrope'] text-[0.65rem] uppercase tracking-widest">
                  יציאה
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
                <span className="material-symbols-outlined">person</span>
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="תפריט"
          >
            <span className={`block w-5 h-0.5 bg-[#e9c349] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#e9c349] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#e9c349] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div className={`absolute top-0 left-0 h-full w-72 bg-[#0e0e0e] border-l border-[#1e1e1e] flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e]">
            <span className="font-['Noto_Serif'] text-lg text-[#e9c349] tracking-widest">MENU</span>
            <button onClick={() => setMenuOpen(false)} className="text-[#767575] hover:text-[#e2e2e2]">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className="block py-4 font-['Noto_Serif'] text-sm uppercase tracking-widest text-[#c8c6c5] hover:text-[#e9c349] border-b border-[#1e1e1e] transition-colors">
                {link.label}
              </Link>
            ))}

            <div className="pt-4 pb-2">
              <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.2em] text-[#555] mb-3">קטגוריות</p>
              {SUB_CATEGORIES.map((cat) => (
                <Link key={cat.to} to={cat.to}
                  className="block py-3 font-['Manrope'] text-xs uppercase tracking-widest text-[#767575] hover:text-[#e9c349] border-b border-[#1e1e1e]/50 transition-colors">
                  {cat.label}
                </Link>
              ))}
            </div>

            {user?.role === 'admin' && (
              <Link to="/admin"
                className="block py-4 font-['Manrope'] text-sm uppercase tracking-widest text-[#e9c349] font-semibold border-b border-[#1e1e1e] transition-colors">
                ADMIN
              </Link>
            )}
          </div>

          {/* Bottom: user actions */}
          <div className="px-6 py-6 border-t border-[#1e1e1e] space-y-3">
            {user ? (
              <>
                <Link to="/profile"
                  className="flex items-center gap-3 text-[#c8c6c5] hover:text-[#e9c349] transition-colors font-['Manrope'] text-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                  פרופיל
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 text-[#c8c6c5] hover:text-red-400 transition-colors font-['Manrope'] text-sm w-full">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                  יציאה
                </button>
              </>
            ) : (
              <Link to="/login"
                className="flex items-center gap-3 text-[#c8c6c5] hover:text-[#e9c349] transition-colors font-['Manrope'] text-sm">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                התחבר / הירשם
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sub-nav: category bar on scroll — desktop only */}
      <div
        className={`hidden md:flex fixed top-[72px] w-full z-40 justify-center gap-12 py-2.5 transition-all duration-500 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ background: 'rgba(19,19,19,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(68,71,72,0.4)' }}
      >
        {SUB_CATEGORIES.map((cat) => (
          <Link key={cat.to} to={cat.to}
            className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.15rem] text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200">
            {cat.label}
          </Link>
        ))}
      </div>
    </>
  );
}
