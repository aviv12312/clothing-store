import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CookieBanner from './components/CookieBanner';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Returns from './pages/legal/Returns';
import Accessibility from './pages/legal/Accessibility';
import Unsubscribe from './pages/Unsubscribe';
import CancelOrder from './pages/CancelOrder';
import Contact from './pages/Contact';

// Register this tab in the open-tab counter immediately (module-level, runs once).
const _tabCount = Number(localStorage.getItem('dw_tabs') || '0') + 1;
localStorage.setItem('dw_tabs', String(_tabCount));

export default function App() {
  const glowRef = useRef(null);

  const [showSplash, setShowSplash] = useState(() => {
    // Already seen in this exact tab (F5 refresh)
    if (sessionStorage.getItem('dw_splash')) return false;
    // Another tab in this session already saw it
    if (localStorage.getItem('dw_splash')) {
      sessionStorage.setItem('dw_splash', '1');
      return false;
    }
    // First view — mark immediately so any new tab opened right now won't show it
    sessionStorage.setItem('dw_splash', '1');
    localStorage.setItem('dw_splash', '1');
    return true;
  });

  const handleSplashDone = () => setShowSplash(false);

  useEffect(() => {
    // When this tab closes (not bfcache), decrement counter.
    // When the last tab closes, clear the splash flag so the next
    // fresh browser session sees the splash again.
    const onPageHide = (e) => {
      if (e.persisted) return; // tab is entering bfcache — still alive
      const remaining = Math.max(0, Number(localStorage.getItem('dw_tabs') || '1') - 1);
      if (remaining === 0) {
        localStorage.removeItem('dw_splash');
        localStorage.removeItem('dw_tabs');
      } else {
        localStorage.setItem('dw_tabs', String(remaining));
      }
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashDone} />}
      <div ref={glowRef} className="cursor-glow" />
      <AuthProvider>
      <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <AnimatedRoutes />
          <CookieBanner />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
    </AuthProvider>
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="motion-page">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/returns" element={<Returns />} />
        <Route path="/legal/accessibility" element={<Accessibility />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/cancel-order" element={<ProtectedRoute><CancelOrder /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
