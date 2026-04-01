import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
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

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'px-3 md:px-6 pt-3' : 'px-0 pt-0'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1920px] items-center justify-between transition-all duration-500 ${
            scrolled
              ? 'bg-[rgba(255,255,255,0.94)] backdrop-blur-[20px] px-5 py-4 md:px-10 shadow-[0_12px_36px_rgba(17,17,17,0.05)]'
              : 'bg-[rgba(255,255,255,0.88)] backdrop-blur-[16px] px-5 py-5 md:px-12 md:py-6'
          }`}
        >
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center gap-3" dir="ltr">
              <img src="/logo.png" alt="Dream and Work" className="h-9 w-9 object-contain md:h-11 md:w-11" />
              <div className="leading-none">
                <p className="font-['Noto_Serif'] text-xl tracking-[-0.08em] text-[#111111] md:text-3xl">
                  Dream &amp; Work
                </p>
                <p className="mt-1 font-['Manrope'] text-[0.52rem] uppercase tracking-[0.34rem] text-[#6e6667]">
                  Editorial Menswear
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="font-['Manrope'] text-[0.68rem] uppercase tracking-[0.22rem] text-[#5d5657] transition-colors hover:text-[#111111]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-[#111111]">
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="relative flex h-10 w-10 items-center justify-center bg-white transition-colors hover:bg-[#f6f6f6]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[0.5rem] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative flex h-10 w-10 items-center justify-center bg-white transition-colors hover:bg-[#f6f6f6]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>shopping_bag</span>
              {count > 0 && (
                <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[0.5rem] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <div className="hidden md:flex md:items-center md:gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex h-10 w-10 items-center justify-center bg-white transition-colors hover:bg-[#f6f6f6]"
                  >
                    <span className="material-symbols-outlined">person</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-[#111111]"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#5d5657] transition-colors hover:text-[#111111]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-[#111111]"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="menu"
            >
              <span className={`block h-px w-5 bg-[#111111] transition-all ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-[#111111] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-[#111111] transition-all ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-[rgba(17,17,17,0.22)] transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[84vw] max-w-sm bg-white px-6 pb-8 pt-24 shadow-[0_24px_60px_rgba(27,28,28,0.08)] transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="font-['Noto_Serif'] text-2xl tracking-[-0.05em] text-[#111111]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-12 space-y-4 bg-[#f7f7f7] p-5">
            <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#6e6667]">Collections</p>
            {SUB_CATEGORIES.map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
                onClick={closeMenu}
                className="block font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-[#111111]"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-right font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="font-['Manrope'] text-sm uppercase tracking-[0.18rem] text-[#111111]">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-[72px] z-40 hidden justify-center transition-all duration-500 md:flex ${
          scrolled ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex gap-8 bg-[rgba(255,255,255,0.96)] px-8 py-3 backdrop-blur-[18px] shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
          {SUB_CATEGORIES.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              onClick={closeMenu}
              className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] text-[#5d5657] transition-colors hover:text-[#111111]"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
