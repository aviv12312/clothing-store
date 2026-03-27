import { useState, useEffect } from 'react';
import api from '../../services/api';

const CATEGORIES = ['חתן ומלווים', 'Casual', 'Formal'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '44', '46', '48', '50', '52', '54'];
const EMPTY_FORM = {
  name: '', price: '', salePrice: '', category: 'Formal',
  description: '', stock: '0', sizes: [], colors: '', images: '', tags: '', featured: false,
};

// העלאת תמונות ל-Cloudinary
async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    urls.push(res.data.url);
  }
  return urls;
}

const ORDER_STATUSES = ['בטיפול', 'נשלח', 'הגיע', 'בוטל'];

const STATUS_COLORS = {
  'בטיפול': 'text-blue-400 bg-blue-400/10',
  'נשלח':   'text-purple-400 bg-purple-400/10',
  'הגיע':   'text-green-400 bg-green-400/10',
  'בוטל':   'text-red-400 bg-red-400/10',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');

  // ── Products state ──
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [colorImages, setColorImages] = useState({});
  const [uploadingColor, setUploadingColor] = useState(null);
  const [sizeStock, setSizeStock] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null); // id של מוצר למחיקה

  // ── Orders state ──
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('הכל');

  // ── Toast ──
  const [message, setMessage] = useState({ text: '', type: '' });
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // ── Fetch ──
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setOrdersLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { if (tab === 'orders') fetchOrders(); }, [tab]);

  // ── Products handlers ──
  const handleToggleSize = (size) =>
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        images: uploadedImages,
        colorImages,
        sizeStock,
        stock: Object.values(sizeStock).reduce((sum, v) => sum + (Number(v) || 0), 0),
        colors: form.colors ? form.colors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        showMessage('✅ מוצר עודכן בהצלחה');
        setEditId(null);
      } else {
        await api.post('/products', payload);
        showMessage('✅ מוצר נוסף בהצלחה');
      }
      setForm(EMPTY_FORM);
      setUploadedImages([]);
      setColorImages({});
      setSizeStock({});
      setTab('products');
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.error || '❌ שגיאה בשמירה', 'error');
    } finally { setProductLoading(false); }
  };

  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      setUploadedImages((prev) => [...prev, ...urls]);
      showMessage(`✅ ${urls.length} תמונות הועלו`);
    } catch {
      showMessage('❌ שגיאה בהעלאת תמונות', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedImage = (url) =>
    setUploadedImages((prev) => prev.filter((u) => u !== url));

  const handleEdit = (p) => {
    setForm({
      name: p.name, price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      category: p.category, description: p.description || '',
      stock: String(p.stock), sizes: p.sizes || [],
      colors: (p.colors || []).join(', '),
      images: (p.images || []).join(', '),
      tags: (p.tags || []).join(', '),
      featured: p.featured || false,
    });
    setUploadedImages(p.images || []);
    setColorImages(p.colorImages || {});
    setSizeStock(p.sizeStock || {});
    setEditId(p._id);
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    await api.delete(`/products/${confirmDelete}`);
    setConfirmDelete(null);
    showMessage('🗑️ מוצר הוסר');
    fetchProducts();
  };

  const handleColorImageFiles = async (color, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingColor(color);
    try {
      const urls = await uploadImages(files);
      setColorImages((prev) => ({ ...prev, [color]: [...(prev[color] || []), ...urls] }));
      showMessage(`✅ תמונות הועלו עבור ${color}`);
    } catch {
      showMessage('❌ שגיאה בהעלאת תמונות', 'error');
    } finally { setUploadingColor(null); }
  };

  const removeColorImage = (color, url) =>
    setColorImages((prev) => ({ ...prev, [color]: prev[color].filter((u) => u !== url) }));

  const handleCancel = () => { setForm(EMPTY_FORM); setUploadedImages([]); setColorImages({}); setSizeStock({}); setEditId(null); setTab('products'); };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // ── Orders handlers ──
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdating(orderId);
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
      );
      showMessage('✅ סטטוס עודכן');
    } catch {
      showMessage('❌ שגיאה בעדכון', 'error');
    } finally { setStatusUpdating(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e7e5e5] pt-20">

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-[#333] p-8 max-w-sm w-full mx-4 text-center">
            <span className="material-symbols-outlined text-red-400 text-4xl mb-4 block">warning</span>
            <h3 className="font-headline text-lg mb-2">למחוק את המוצר?</h3>
            <p className="text-[#767575] text-sm font-label mb-6">פעולה זו לא ניתנת לביטול</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)}
                className="px-6 py-2 border border-[#333] text-[#767575] font-label text-xs uppercase tracking-widest hover:border-[#555] transition-colors">
                ביטול
              </button>
              <button onClick={confirmDeleteProduct}
                className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 font-label text-xs uppercase tracking-widest hover:bg-red-500/30 transition-colors">
                מחק
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#222] px-10 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl tracking-tight">פאנל ניהול</h1>
          <p className="text-[#767575] text-xs uppercase tracking-widest font-label mt-1">Dream & Work — Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#767575] text-sm font-label">{products.length} מוצרים · {orders.length} הזמנות</span>
          <button
            onClick={() => { setEditId(null); setForm(EMPTY_FORM); setTab('add'); }}
            className="flex items-center gap-2 bg-[#e7e5e5] text-[#0a0a0a] px-5 py-2.5 font-label text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            מוצר חדש
          </button>
        </div>
      </div>

      {/* Toast */}
      {message.text && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-8 py-3 text-sm font-label tracking-wide shadow-xl ${
          message.type === 'error' ? 'bg-red-900 text-red-200' : 'bg-[#1a2a1a] text-green-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#222] px-10">
        {[
          { id: 'products', label: 'כל המוצרים' },
          { id: 'orders',   label: 'הזמנות' },
          { id: 'add',      label: editId ? 'עריכת מוצר' : 'הוספת מוצר' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-4 font-label text-xs uppercase tracking-widest border-b-2 transition-colors ${
              tab === t.id ? 'border-[#e7e5e5] text-[#e7e5e5]' : 'border-transparent text-[#767575] hover:text-[#e7e5e5]'
            }`}
          >
            {t.label}
            {t.id === 'orders' && orders.filter(o => o.orderStatus === 'ממתין לאישור').length > 0 && (
              <span className="mr-2 bg-yellow-500 text-[#0a0a0a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {orders.filter(o => o.orderStatus === 'ממתין לאישור').length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-10 py-10 max-w-6xl">

        {/* ── טאב מוצרים ── */}
        {tab === 'products' && (
          <div>
            <div className="mb-8 relative">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#767575] text-sm">search</span>
              <input
                type="text"
                placeholder="חיפוש לפי שם או קטגוריה..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#222] text-[#e7e5e5] pr-12 pl-4 py-3 text-sm font-label placeholder-[#767575] focus:outline-none focus:border-[#767575]"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-5xl text-[#333] block mb-4">inventory_2</span>
                <p className="text-[#767575] font-label text-xs uppercase tracking-widest">אין מוצרים</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((p) => (
                  <div key={p._id} className="flex items-center gap-5 bg-[#111] border border-[#1e1e1e] p-4 hover:border-[#333] transition-colors group">
                    <div className="w-14 flex-shrink-0 overflow-hidden" style={{ height: '3.5rem' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl text-[#333]">checkroom</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-headline text-base truncate">{p.name}</p>
                        {p.featured && <span className="text-[0.6rem] font-label uppercase tracking-widest bg-[#2a2a1a] text-yellow-500 px-2 py-0.5">Featured</span>}
                        {p.salePrice && <span className="text-[0.6rem] font-label uppercase tracking-widest bg-[#1a2a1a] text-green-400 px-2 py-0.5">Sale</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[#767575] text-xs font-label">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>מלאי: {p.stock}</span>
                        {p.sizes?.length > 0 && <><span>·</span><span>{p.sizes.join(', ')}</span></>}
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      {p.salePrice ? (
                        <div>
                          <p className="text-green-400 font-body text-sm">₪{p.salePrice}</p>
                          <p className="text-[#767575] line-through text-xs">₪{p.price}</p>
                        </div>
                      ) : (
                        <p className="font-body text-sm">₪{p.price}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => handleEdit(p)} className="flex items-center gap-1.5 text-[#767575] hover:text-[#e7e5e5] transition-colors font-label text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        עריכה
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1.5 text-[#767575] hover:text-red-400 transition-colors font-label text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">delete</span>
                        מחיקה
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── טאב הזמנות ── */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-xl">כל ההזמנות</h2>
              <button onClick={fetchOrders} className="text-[#767575] hover:text-[#e7e5e5] font-label text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-sm">refresh</span>
                רענן
              </button>
            </div>

            {/* חיפוש + פילטר */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="חיפוש לפי שם לקוח או מספר הזמנה..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="flex-1 bg-[#111] border border-[#222] text-[#e7e5e5] px-4 py-2.5 font-body text-sm focus:outline-none focus:border-[#767575] placeholder-[#444]"
              />
              <div className="flex gap-2 flex-wrap">
                {['הכל', ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    className={`px-3 py-2 font-label text-xs uppercase tracking-widest transition-colors ${
                      orderFilter === s
                        ? 'bg-[#e9c349] text-[#0a0a0a]'
                        : 'border border-[#333] text-[#767575] hover:border-[#767575]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="text-center py-24">
                <div className="inline-block w-8 h-8 border-2 border-[#333] border-t-[#e9c349] rounded-full animate-spin mb-4" />
                <p className="text-[#767575] font-label text-xs uppercase tracking-widest">טוען הזמנות...</p>
              </div>
            ) : (() => {
              const filteredOrders = orders.filter((o) => {
                const matchStatus = orderFilter === 'הכל' || o.orderStatus === orderFilter;
                const matchSearch = !orderSearch ||
                  o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o.user?.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o._id.slice(-6).toUpperCase().includes(orderSearch.toUpperCase());
                return matchStatus && matchSearch;
              });
              return filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#111] border border-[#1e1e1e]">
                  <span className="material-symbols-outlined text-4xl text-[#333] block mb-3">search_off</span>
                  <p className="text-[#767575] font-label text-xs uppercase tracking-widest">לא נמצאו הזמנות</p>
                </div>
              ) : (
                <>
                  <p className="text-[#555] font-label text-xs uppercase tracking-widest mb-4">
                    {filteredOrders.length} הזמנות {orderFilter !== 'הכל' ? `· ${orderFilter}` : ''}
                  </p>
                  <div className="flex flex-col gap-3">
                    {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors">

                    {/* שורה ראשית */}
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="w-full flex items-center justify-between p-5 text-right"
                    >
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className={`px-3 py-1 font-label text-xs uppercase tracking-widest rounded-sm ${STATUS_COLORS[order.orderStatus] || 'text-[#767575] bg-[#767575]/10'}`}>
                          {order.orderStatus}
                        </span>
                        <span className="text-[#e9c349] font-body text-sm">₪{order.totalPrice?.toFixed(2)}</span>
                        <span className="text-[#767575] font-label text-xs hidden md:block">{formatDate(order.createdAt)}</span>
                        {order.user && (
                          <span className="text-[#b0b0b0] font-label text-xs">
                            {order.user.name} · {order.user.email}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#767575] font-label text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="material-symbols-outlined text-[#767575] text-sm">
                          {expandedOrder === order._id ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </button>

                    {/* פירוט */}
                    {expandedOrder === order._id && (
                      <div className="border-t border-[#1e1e1e] p-5 space-y-5">

                        {/* מוצרים */}
                        <div className="flex flex-col gap-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                                {item.image
                                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-[#333]">checkroom</span></div>
                                }
                              </div>
                              <div className="flex-1">
                                <p className="font-body text-sm">{item.name}</p>
                                <p className="text-[#767575] text-xs font-label">
                                  {item.size && `מידה: ${item.size}`}{item.color && ` · ${item.color}`} · כמות: {item.quantity}
                                </p>
                              </div>
                              <p className="text-[#e9c349] font-body text-sm">₪{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* כתובת + עדכון סטטוס */}
                        <div className="flex flex-col md:flex-row gap-4">
                          {order.shippingAddress && (
                            <div className="flex-1 bg-[#0d0d0d] border border-[#1a1a1a] p-4">
                              <p className="font-label text-[10px] uppercase tracking-widest text-[#767575] mb-2">כתובת משלוח</p>
                              <p className="text-sm font-body text-[#b0b0b0]">
                                {order.shippingAddress.name} · {order.shippingAddress.street}, {order.shippingAddress.city}
                                {order.shippingAddress.phone && ` · ${order.shippingAddress.phone}`}
                              </p>
                            </div>
                          )}

                          {/* עדכון סטטוס */}
                          <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-4">
                            <p className="font-label text-[10px] uppercase tracking-widest text-[#767575] mb-2">עדכון סטטוס</p>
                            <div className="flex flex-wrap gap-2">
                              {ORDER_STATUSES.map((status) => (
                                <button
                                  key={status}
                                  disabled={statusUpdating === order._id || order.orderStatus === status}
                                  onClick={() => handleStatusChange(order._id, status)}
                                  className={`px-3 py-1.5 font-label text-xs transition-colors disabled:opacity-40 ${
                                    order.orderStatus === status
                                      ? 'bg-[#e9c349] text-[#0a0a0a]'
                                      : 'border border-[#333] text-[#767575] hover:border-[#767575] hover:text-[#e7e5e5]'
                                  }`}
                                >
                                  {statusUpdating === order._id ? '...' : status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ── טאב הוספה/עריכה ── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
            <h2 className="font-headline text-xl tracking-tight">{editId ? 'עריכת מוצר' : 'מוצר חדש'}</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">שם המוצר *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#333] text-[#e7e5e5] py-3 font-body text-sm focus:outline-none focus:border-[#767575] placeholder-[#444]"
                  placeholder="לדוגמה: חליפת חתן קלאסית" />
              </div>
              <div>
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">קטגוריה *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] text-[#e7e5e5] px-3 py-3 font-body text-sm focus:outline-none focus:border-[#767575]">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-yellow-500 w-4 h-4" />
                <label htmlFor="featured" className="font-label text-sm text-[#767575] cursor-pointer">Featured (מוצג בדף הבית)</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[['מחיר ₪ *', 'price', true], ['מחיר מבצע ₪', 'salePrice', false]].map(([label, field, req]) => (
                <div key={field}>
                  <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">{label}</label>
                  <input required={req} type="number" min="1"
                    value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full bg-transparent border-b border-[#333] text-[#e7e5e5] py-3 font-body text-sm focus:outline-none focus:border-[#767575]"
                    placeholder={field === 'salePrice' ? 'ריק = אין מבצע' : '0'} />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">תיאור</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full bg-[#111] border border-[#333] text-[#e7e5e5] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#767575] resize-none placeholder-[#444]"
                placeholder="תיאור המוצר..." />
            </div>

            <div>
              <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-3">מידות</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size} type="button" onClick={() => handleToggleSize(size)}
                    className={`px-3 py-1.5 font-label text-xs border transition-colors ${
                      form.sizes.includes(size) ? 'bg-[#e7e5e5] text-[#0a0a0a] border-[#e7e5e5]' : 'bg-transparent text-[#767575] border-[#333] hover:border-[#767575]'
                    }`}>{size}</button>
                ))}
              </div>
            </div>

            {/* מלאי לפי מידה */}
            {form.sizes?.length > 0 && (
              <div>
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-3">
                  מלאי לפי מידה
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {form.sizes.map((size) => (
                    <div key={size} className="flex items-center gap-2 bg-[#111] border border-[#222] px-3 py-2">
                      <span className="font-label text-xs text-[#e9c349] w-8 flex-shrink-0">{size}</span>
                      <input
                        type="number" min="0"
                        value={sizeStock[size] ?? ''}
                        onChange={(e) => setSizeStock((prev) => ({ ...prev, [size]: Number(e.target.value) }))}
                        className="flex-1 bg-transparent text-[#e7e5e5] text-sm font-body focus:outline-none text-center"
                        placeholder="0"
                      />
                      <span className="text-[#555] text-xs font-label">יח'</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#555] text-xs font-label mt-2">
                  סה"כ במלאי: {Object.values(sizeStock).reduce((s, v) => s + (Number(v) || 0), 0)} יחידות
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">צבעים</label>
                <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className="w-full bg-transparent border-b border-[#333] text-[#e7e5e5] py-3 font-body text-sm focus:outline-none focus:border-[#767575] placeholder-[#444]"
                  placeholder="שחור, לבן, אפור (מופרד בפסיקים)" />
              </div>
              <div>
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-2">תגיות</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-transparent border-b border-[#333] text-[#e7e5e5] py-3 font-body text-sm focus:outline-none focus:border-[#767575] placeholder-[#444]"
                  placeholder="חתן, חליפה, קיץ (מופרד בפסיקים)" />
              </div>
            </div>

            {/* תמונות לפי צבע */}
            {form.colors && (
              <div>
                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-3">
                  תמונות לפי צבע <span className="text-[#555] normal-case">(אופציונלי — אם לא הועלו, יוצגו התמונות הכלליות)</span>
                </label>
                <div className="flex flex-col gap-4">
                  {form.colors.split(',').map(s => s.trim()).filter(Boolean).map((color) => (
                    <div key={color} className="bg-[#0d0d0d] border border-[#1a1a1a] p-4">
                      <p className="font-label text-xs text-[#e7e5e5] mb-3">{color}</p>

                      {/* תצוגה מקדימה */}
                      {colorImages[color]?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {colorImages[color].map((url) => (
                            <div key={url} className="relative w-16 h-16 group">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeColorImage(color, url)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className={`flex items-center gap-2 border border-dashed border-[#333] px-4 py-3 cursor-pointer hover:border-[#767575] transition-colors text-sm ${uploadingColor === color ? 'opacity-50 pointer-events-none' : ''}`}>
                        <span className="material-symbols-outlined text-[#767575] text-base">
                          {uploadingColor === color ? 'hourglass_empty' : 'add_photo_alternate'}
                        </span>
                        <span className="font-label text-xs text-[#767575]">
                          {uploadingColor === color ? 'מעלה...' : `העלה תמונות עבור ${color}`}
                        </span>
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={(e) => handleColorImageFiles(color, e)}
                          disabled={uploadingColor === color} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* העלאת תמונות */}
            <div>
              <label className="block font-label text-[0.65rem] uppercase tracking-widest text-[#767575] mb-3">תמונות המוצר</label>

              {/* תצוגה מקדימה */}
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {uploadedImages.map((url) => (
                    <div key={url} className="relative w-20 h-20 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(url)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* כפתור העלאה */}
              <label className={`flex items-center gap-3 border border-dashed border-[#333] px-5 py-4 cursor-pointer hover:border-[#767575] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="material-symbols-outlined text-[#767575] text-xl">
                  {uploading ? 'hourglass_empty' : 'upload'}
                </span>
                <span className="font-label text-xs text-[#767575] uppercase tracking-widest">
                  {uploading ? 'מעלה תמונות...' : 'בחר תמונות מהמחשב'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageFiles}
                  disabled={uploading}
                />
              </label>
              <p className="text-[#555] text-xs font-label mt-1">עד 5 תמונות · מקסימום 5MB כל אחת</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#1e1e1e]">
              <button type="submit" disabled={productLoading}
                className="bg-[#e7e5e5] text-[#0a0a0a] px-10 py-3.5 font-label text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">
                {productLoading ? 'שומר...' : editId ? 'שמור שינויים' : 'הוסף מוצר'}
              </button>
              <button type="button" onClick={handleCancel}
                className="text-[#767575] hover:text-[#e7e5e5] font-label text-xs uppercase tracking-widest transition-colors">
                ביטול
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
