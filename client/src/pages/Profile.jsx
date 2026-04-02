import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';

const STATUS_COLORS = {
  'בטיפול': 'text-blue-600 bg-blue-50',
  'נשלח':   'text-purple-600 bg-purple-50',
  'הגיע':   'text-green-600 bg-green-50',
  'בוטל':   'text-red-600 bg-red-50',
};

const STATUS_ICON = {
  'בטיפול': 'manufacturing',
  'נשלח':   'local_shipping',
  'הגיע':   'check_circle',
  'בוטל':   'cancel',
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState('');

  const canCancel = (order) => {
    if (['בוטל', 'נשלח', 'הגיע'].includes(order.orderStatus)) return false;
    const hoursSince = (Date.now() - new Date(order.createdAt)) / 1000 / 60 / 60;
    return hoursSince <= 2;
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('האם אתה בטוח שברצונך לבטל את ההזמנה?')) return;
    try {
      setCancellingId(orderId);
      setCancelError('');
      await api.patch(`/orders/${orderId}/cancel`);
      await fetchOrders();
    } catch (err) {
      setCancelError(err.response?.data?.error || 'שגיאה בביטול ההזמנה');
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'האם אתה בטוח שברצונך למחוק את חשבונך לצמיתות?\nפעולה זו אינה ניתנת לביטול.'
    );
    if (!confirmed) return;
    try {
      await api.delete('/auth/account');
      await logout();
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'שגיאה במחיקת החשבון');
    }
  };

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
      <div className="pt-20 flex flex-1">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col py-10 gap-2 w-64 border-l border-[#eeeeee] sticky top-20 h-[calc(100vh-5rem)]">
          <div className="px-8 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f3] border border-[#e8e8e6] mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#888888]">person</span>
            </div>
            <h2 className="font-headline text-lg">{user?.name}</h2>
            <p className="text-xs text-[#1a1a1a] uppercase tracking-widest font-label mt-0.5">
              {user?.role === 'admin' ? 'מנהל מערכת' : 'חבר'}
            </p>
          </div>

          <nav className="flex flex-col px-4 gap-1">
            {[
              { id: 'profile', icon: 'account_circle', label: 'פרופיל' },
              { id: 'orders',  icon: 'package_2',       label: 'הזמנות שלי' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 font-label text-sm transition-colors text-right ${
                  tab === item.id
                    ? 'bg-[#f5f5f3] text-[#1a1a1a] border-r-2 border-[#1a1a1a]'
                    : 'text-[#888888] hover:text-[#1a1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                {item.label}
              </button>
            ))}

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 px-4 py-3 text-[#1a1a1a] font-label text-sm hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                פאנל ניהול
              </button>
            )}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 md:px-16 py-12 max-w-5xl">

          {/* ── פרופיל ── */}
          {tab === 'profile' && (
            <div>
              <h1 className="font-headline text-4xl font-light mb-10">
                שלום, {user?.name} 👋
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <div className="bg-[#f5f5f3] border border-[#eeeeee] p-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-[#888888]">שם מלא</span>
                  <p className="mt-3 text-xl font-headline">{user?.name}</p>
                </div>
                <div className="bg-[#f5f5f3] border border-[#eeeeee] p-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-[#888888]">אימייל</span>
                  <p className="mt-3 text-sm font-body text-[#666666]">{user?.email}</p>
                </div>
                <div className="bg-[#f5f5f3] border border-[#eeeeee] p-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-[#888888]">סטטוס חשבון</span>
                  <p className="mt-3 text-[#1a1a1a] font-label text-sm uppercase tracking-widest">
                    {user?.role === 'admin' ? '⚡ מנהל מערכת' : '✦ חבר פעיל'}
                  </p>
                </div>
                <div
                  className="bg-[#f5f5f3] border border-[#eeeeee] p-8 cursor-pointer hover:border-[#cccccc] transition-colors"
                  onClick={() => setTab('orders')}
                >
                  <span className="font-label text-[10px] uppercase tracking-widest text-[#888888]">הזמנות</span>
                  <p className="mt-3 font-headline text-2xl">
                    {orders.length || '→'}
                  </p>
                  <p className="text-[#888888] text-xs font-label mt-1">לחץ לצפייה</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="border border-[#e8e8e6] px-8 py-3 font-label text-xs uppercase tracking-widest text-[#888888] hover:text-[#1a1a1a] hover:border-[#888888] transition-colors"
                >
                  התנתקות
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="border border-red-200 px-8 py-3 font-label text-xs uppercase tracking-widest text-red-400 hover:text-red-600 hover:border-red-400 transition-colors"
                >
                  מחיקת חשבון
                </button>
              </div>
            </div>
          )}

          {/* ── הזמנות ── */}
          {tab === 'orders' && (
            <div>
              <h1 className="font-headline text-4xl font-light mb-10">הזמנות שלי</h1>

              {loadingOrders ? (
                <div className="text-center py-24">
                  <div className="inline-block w-8 h-8 border-2 border-[#e8e8e6] border-t-[#1a1a1a] rounded-full animate-spin mb-4" />
                  <p className="text-[#888888] font-label text-xs uppercase tracking-widest">טוען הזמנות...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-[#f5f5f3] border border-[#eeeeee]">
                  <span className="material-symbols-outlined text-5xl text-[#cccccc] block mb-4">inbox</span>
                  <p className="text-[#888888] font-label text-xs uppercase tracking-widest mb-6">אין הזמנות עדיין</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-[#1a1a1a] text-white px-8 py-3 font-label text-xs uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    לחנות
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-[#f5f5f3] border border-[#eeeeee] hover:border-[#e8e8e6] transition-colors">

                      {/* header */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="w-full flex items-center justify-between p-6 text-right"
                      >
                        <div className="flex items-center gap-6">
                          {/* סטטוס */}
                          <span className={`flex items-center gap-1.5 px-3 py-1 font-label text-xs uppercase tracking-widest rounded-sm ${STATUS_COLORS[order.orderStatus] || 'text-[#888888] bg-[#f5f5f3]'}`}>
                            <span className="material-symbols-outlined text-sm">
                              {STATUS_ICON[order.orderStatus] || 'help'}
                            </span>
                            {order.orderStatus}
                          </span>

                          {/* סה"כ */}
                          <span className="text-[#1a1a1a] font-body text-sm">₪{order.totalPrice?.toFixed(2)}</span>

                          {/* תאריך */}
                          <span className="text-[#888888] font-label text-xs hidden md:block">{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[#888888] font-label text-xs">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="material-symbols-outlined text-[#888888] text-sm">
                            {expandedOrder === order._id ? 'expand_less' : 'expand_more'}
                          </span>
                        </div>
                      </button>

                      {/* פירוט */}
                      {expandedOrder === order._id && (
                        <div className="border-t border-[#eeeeee] p-6">

                          {/* מוצרים */}
                          <div className="flex flex-col gap-3 mb-6">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#eeeeee] flex-shrink-0 overflow-hidden">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[#cccccc]">checkroom</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-body text-sm">{item.name}</p>
                                  <p className="text-[#888888] text-xs font-label mt-0.5">
                                    {item.size && `מידה: ${item.size}`}
                                    {item.color && ` · צבע: ${item.color}`}
                                    {` · כמות: ${item.quantity}`}
                                  </p>
                                </div>
                                <p className="font-body text-sm text-[#1a1a1a]">₪{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          {/* כתובת */}
                          {order.shippingAddress && (
                            <div className="bg-white border border-[#eeeeee] p-4 mb-4">
                              <p className="font-label text-[10px] uppercase tracking-widest text-[#888888] mb-2">כתובת משלוח</p>
                              <p className="text-sm font-body text-[#666666]">
                                {order.shippingAddress.name} · {order.shippingAddress.street}, {order.shippingAddress.city}
                                {order.shippingAddress.phone && ` · ${order.shippingAddress.phone}`}
                              </p>
                            </div>
                          )}

                          {/* ביטול הזמנה */}
                          {cancelError && expandedOrder === order._id && (
                            <p className="text-red-500 text-xs font-label mb-3">{cancelError}</p>
                          )}
                          {canCancel(order) && (
                            <button
                              onClick={() => handleCancel(order._id)}
                              disabled={cancellingId === order._id}
                              className="flex items-center gap-2 border border-red-300 text-red-500 hover:border-red-500 hover:text-red-600 px-5 py-2.5 font-label text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              {cancellingId === order._id ? 'מבטל...' : 'ביטול הזמנה'}
                            </button>
                          )}

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
}
