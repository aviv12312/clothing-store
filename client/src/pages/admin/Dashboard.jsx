import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const CATEGORIES = ['חתן ומלווים', 'Casual', 'Formal'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '44', '46', '48', '50', '52', '54'];
const ORDER_STATUSES = ['בטיפול', 'נשלח', 'הגיע', 'בוטל'];
const CAMPAIGN_SLOTS = [
  { id: 'hero', label: 'Hero', description: 'התמונה הראשית בראש דף הבית', resolution: 'מומלץ: 2400×1600px, יחס 3:2 או 16:10, תמונת קמפיין רחבה ואופקית.' },
{ id: 'lookbookWorkday', label: 'Lookbook - Workday', description: 'תמונות אווירה לכרטיס Workday בלוקבוק', resolution: 'מומלץ: 1600×2000px, יחס 4:5, צילום אנכי.' },
  { id: 'lookbookEvening', label: 'Lookbook - Evening', description: 'תמונות אווירה לכרטיס Evening בלוקבוק', resolution: 'מומלץ: 1600×2000px, יחס 4:5, צילום אנכי.' },
  { id: 'lookbookEvent', label: 'Lookbook - Event', description: 'תמונות אווירה לכרטיס Event בלוקבוק', resolution: 'מומלץ: 1600×2000px, יחס 4:5, צילום אנכי.' },
];
const EMPTY_CAMPAIGN_IMAGES = CAMPAIGN_SLOTS.reduce((acc, slot) => ({ ...acc, [slot.id]: [] }), {});
const PRODUCT_IMAGE_GUIDANCE = 'מומלץ: 1600×2000px, יחס 4:5, JPG/WebP איכותי. להשאיר מעט מרווח סביב הדגם כדי שהחיתוך באתר לא יפגע בבגד.';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'Formal',
  price: '',
  salePrice: '',
  sizes: [],
  colors: '',
  tags: '',
  featured: false,
};

const STATUS_COLORS = {
  'בטיפול': 'text-blue-700 bg-blue-50 border-blue-200',
  'נשלח': 'text-violet-700 bg-violet-50 border-violet-200',
  'הגיע': 'text-green-700 bg-green-50 border-green-200',
  'בוטל': 'text-red-700 bg-red-50 border-red-200',
};

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

const parseColors = (value) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const hasNestedColorStock = (stockMap) =>
  Object.values(stockMap || {}).some((value) => value && typeof value === 'object' && !Array.isArray(value));

const normalizeSizeStock = (rawStock, colors = [], sizes = []) => {
  if (!rawStock || typeof rawStock !== 'object') return {};

  if (hasNestedColorStock(rawStock)) {
    return colors.reduce((acc, color) => {
      const current = rawStock[color] || {};
      acc[color] = sizes.reduce((sizesAcc, size) => {
        sizesAcc[size] = Number(current[size]) || 0;
        return sizesAcc;
      }, {});
      return acc;
    }, {});
  }

  if (!colors.length) return {};

  return {
    [colors[0]]: sizes.reduce((acc, size) => {
      acc[size] = Number(rawStock[size]) || 0;
      return acc;
    }, {}),
  };
};

const pruneSizeStock = (stockMap, colors, sizes) =>
  colors.reduce((acc, color) => {
    acc[color] = sizes.reduce((sizesAcc, size) => {
      sizesAcc[size] = Number(stockMap?.[color]?.[size]) || 0;
      return sizesAcc;
    }, {});
    return acc;
  }, {});

const getTotalStock = (stockMap) =>
  Object.values(stockMap || {}).reduce(
    (sum, sizeMap) => sum + Object.values(sizeMap || {}).reduce((nested, qty) => nested + (Number(qty) || 0), 0),
    0
  );

const buildVariants = (stockMap) =>
  Object.entries(stockMap || {}).flatMap(([color, sizes]) =>
    Object.entries(sizes || {}).map(([size, stock]) => ({
      color,
      size,
      stock: Number(stock) || 0,
      sku: `${color}-${size}`.replace(/\s+/g, '-').toUpperCase(),
    }))
  );


export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaignImages, setCampaignImages] = useState(EMPTY_CAMPAIGN_IMAGES);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sizeStock, setSizeStock] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('הכל');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCampaignImages, setLoadingCampaignImages] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCampaignSlot, setSavingCampaignSlot] = useState('');
  const [uploadingGeneral, setUploadingGeneral] = useState(false);
  const [uploadingCampaignSlot, setUploadingCampaignSlot] = useState('');
  const [uploadingColor, setUploadingColor] = useState('');
  const [statusUpdating, setStatusUpdating] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => setMessage({ text: '', type: '' }), 3200);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בטעינת המוצרים', 'error');
    } finally {
      setLoadingProducts(false);
    }
  }, [showMessage]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בטעינת ההזמנות', 'error');
    } finally {
      setLoadingOrders(false);
    }
  }, [showMessage]);

  const fetchCampaignImages = useCallback(async () => {
    try {
      setLoadingCampaignImages(true);
      const { data } = await api.get('/homepage-images/admin');
      setCampaignImages({ ...EMPTY_CAMPAIGN_IMAGES, ...(data || {}) });
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בטעינת תמונות דף הבית', 'error');
    } finally {
      setLoadingCampaignImages(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
    if (tab === 'campaign') fetchCampaignImages();
  }, [fetchCampaignImages, fetchOrders, tab]);

  const colorList = useMemo(() => parseColors(form.colors), [form.colors]);

  useEffect(() => {
    setSizeStock((prev) => pruneSizeStock(prev, colorList, form.sizes));
    setColorImages((prev) => Object.fromEntries(Object.entries(prev).filter(([color]) => colorList.includes(color))));
  }, [colorList, form.sizes]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSizeStock({});
    setUploadedImages([]);
    setColorImages({});
    setEditId(null);
  };

  const openCreateTab = () => {
    resetForm();
    setTab('add');
  };

  const handleToggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((entry) => entry !== size) : [...prev.sizes, size],
    }));
  };

  const setColorStockValue = (color, size, value) => {
    setSizeStock((prev) => ({
      ...prev,
      [color]: {
        ...(prev[color] || {}),
        [size]: Math.max(0, Number(value) || 0),
      },
    }));
  };

  const handleImageFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setUploadingGeneral(true);
      const urls = await uploadImages(files);
      setUploadedImages((prev) => [...prev, ...urls]);
      showMessage(`${urls.length} תמונות כלליות הועלו`);
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בהעלאת תמונות כלליות', 'error');
    } finally {
      setUploadingGeneral(false);
      event.target.value = '';
    }
  };

  const handleColorImageFiles = async (color, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setUploadingColor(color);
      const urls = await uploadImages(files);
      setColorImages((prev) => ({ ...prev, [color]: [...(prev[color] || []), ...urls] }));
      showMessage(`תמונות עבור ${color} הועלו`);
    } catch (error) {
      console.error(error);
      showMessage(`שגיאה בהעלאת תמונות עבור ${color}`, 'error');
    } finally {
      setUploadingColor('');
      event.target.value = '';
    }
  };

  const handleCampaignImageFiles = async (slot, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setUploadingCampaignSlot(slot);
      const urls = await uploadImages(files);
      setCampaignImages((prev) => ({ ...prev, [slot]: [...(prev[slot] || []), ...urls] }));
      showMessage(`${urls.length} תמונות קמפיין הועלו`);
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בהעלאת תמונות קמפיין', 'error');
    } finally {
      setUploadingCampaignSlot('');
      event.target.value = '';
    }
  };

  const removeUploadedImage = (url) => {
    setUploadedImages((prev) => prev.filter((entry) => entry !== url));
  };

  const removeColorImage = (color, url) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: (prev[color] || []).filter((entry) => entry !== url),
    }));
  };

  const removeCampaignImage = (slot, url) => {
    setCampaignImages((prev) => ({
      ...prev,
      [slot]: (prev[slot] || []).filter((entry) => entry !== url),
    }));
  };

  const saveCampaignSlot = async (slot) => {
    try {
      setSavingCampaignSlot(slot);
      await api.put(`/homepage-images/${slot}`, { images: campaignImages[slot] || [] });
      showMessage('תמונות הקמפיין נשמרו');
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בשמירת תמונות הקמפיין', 'error');
    } finally {
      setSavingCampaignSlot('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const colors = parseColors(form.colors);
    const normalizedStock = pruneSizeStock(sizeStock, colors, form.sizes);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      sizes: form.sizes,
      colors,
      tags: form.tags
        ? form.tags.split(',').map((entry) => entry.trim()).filter(Boolean)
        : [],
      featured: form.featured,
      images: uploadedImages,
      colorImages,
      sizeStock: normalizedStock,
      variants: buildVariants(normalizedStock),
      stock: getTotalStock(normalizedStock),
    };

    try {
      setSavingProduct(true);
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        showMessage('המוצר עודכן בהצלחה');
      } else {
        await api.post('/products', payload);
        showMessage('המוצר נוסף בהצלחה');
      }
      resetForm();
      setTab('products');
      fetchProducts();
    } catch (error) {
      console.error(error);
      const details = error.response?.data?.details?.map((entry) => entry.message).join(', ');
      showMessage(error.response?.data?.error || details || 'שגיאה בשמירת המוצר', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEdit = (product) => {
    const colors = product.colors || [];

    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Formal',
      price: String(product.price || ''),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      sizes: product.sizes || [],
      colors: colors.join(', '),
      tags: (product.tags || []).join(', '),
      featured: !!product.featured,
    });
    setUploadedImages(product.images || []);
    setColorImages(product.colorImages || {});
    setSizeStock(normalizeSizeStock(product.sizeStock || {}, colors, product.sizes || []));
    setEditId(product._id);
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${confirmDelete}`);
      setConfirmDelete(null);
      showMessage('המוצר הוסר');
      fetchProducts();
    } catch (error) {
      console.error(error);
      showMessage('שגיאה במחיקת מוצר', 'error');
    }
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setStatusUpdating(orderId);
      await api.patch(`/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, orderStatus } : order)));
      showMessage('סטטוס ההזמנה עודכן');
    } catch (error) {
      console.error(error);
      showMessage('שגיאה בעדכון סטטוס', 'error');
    } finally {
      setStatusUpdating('');
    }
  };

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return products;

    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(value) ||
        product.category?.toLowerCase().includes(value) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(value))
    );
  }, [products, search]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const byStatus = orderFilter === 'הכל' || order.orderStatus === orderFilter;
      const query = orderSearch.trim().toLowerCase();
      if (!query) return byStatus;

      const haystack = [
        order.user?.name,
        order.user?.email,
        order._id?.slice(-6),
        order.shippingAddress?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return byStatus && haystack.includes(query);
    });
  }, [orderFilter, orderSearch, orders]);

  const formatDate = (value) =>
    new Date(value).toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-white pt-24 text-[#13243A]">
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border border-[#EFE7D6] bg-white p-8 text-center shadow-[0_24px_70px_rgba(17,17,17,0.12)]">
            <h3 className="font-['Noto_Serif'] text-2xl">למחוק את המוצר?</h3>
            <p className="mt-3 text-sm text-[#5A6B7F]">הפעולה תסיר את המוצר מהחנות. ניתן להוסיף אותו שוב בהמשך אם צריך.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={() => setConfirmDelete(null)} className="border border-[#E0D3BC] px-5 py-3 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.22rem] text-[#13243A]">ביטול</button>
              <button onClick={handleDelete} className="bg-[#13243A] px-5 py-3 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.22rem] text-white">מחיקה</button>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`fixed left-1/2 top-24 z-50 -translate-x-1/2 border px-6 py-3 text-sm shadow-lg ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="border-b border-[#EFE7D6] px-6 py-6 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">Dream & Work Admin</p>
            <h1 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.04em]">ניהול קטלוג והזמנות</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#FFFBF2] px-4 py-3 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{products.length} מוצרים</div>
            <div className="bg-[#FFFBF2] px-4 py-3 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{orders.length} הזמנות</div>
            <button onClick={openCreateTab} className="bg-[#13243A] px-5 py-3 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-white">מוצר חדש</button>
          </div>
        </div>
      </div>

      <div className="border-b border-[#EFE7D6] px-6 md:px-10">
        <div className="flex flex-wrap gap-6">
          {[
            { id: 'products', label: 'מוצרים' },
            { id: 'orders', label: 'הזמנות' },
            { id: 'campaign', label: 'תמונות דף הבית' },
            { id: 'add', label: editId ? 'עריכת מוצר' : 'הוספת מוצר' },
          ].map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`border-b-2 py-4 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] ${tab === item.id ? 'border-[#13243A] text-[#13243A]' : 'border-transparent text-[#8AA3B8]'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-10 md:px-10">
        {tab === 'products' && (
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="חיפוש לפי שם, קטגוריה או תגית" className="w-full max-w-lg border border-[#E0D3BC] bg-[#FFFBF2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#13243A]" />
              <button onClick={fetchProducts} className="self-start border border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A]">רענן רשימה</button>
            </div>

            {loadingProducts ? (
              <div className="flex h-40 items-center justify-center bg-[#EFE7D6]">טוען מוצרים...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-dashed border-[#E0D3BC9d0] bg-[#FFFBF2] px-6 py-16 text-center text-[#5A6B7F]">אין מוצרים להצגה</div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="grid gap-4 border border-[#EFE7D6] bg-white p-4 md:grid-cols-[88px_1fr_auto_auto] md:items-center">
                    <div className="aspect-[3/4] overflow-hidden bg-[#FFFBF2]">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#CDBFA1]">ללא תמונה</div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Noto_Serif'] text-2xl tracking-[-0.03em]">{product.name}</h3>
                        {product.featured && <span className="bg-amber-50 px-2 py-1 text-[0.55rem] uppercase tracking-[0.18rem] text-amber-700">Featured</span>}
                        {product.salePrice && <span className="bg-emerald-50 px-2 py-1 text-[0.55rem] uppercase tracking-[0.18rem] text-emerald-700">Sale</span>}
                      </div>
                      <p className="mt-2 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.2rem] text-[#5A6B7F]">{product.category} · מלאי כולל {product.stock}</p>
                      <p className="mt-3 text-sm text-[#5A6B7F]">{product.colors?.join(', ') || 'ללא צבעים'}{product.sizes?.length ? ` · ${product.sizes.join(', ')}` : ''}</p>
                    </div>
                    <div className="text-left">
                      {product.salePrice ? (
                        <>
                          <p className="font-['Noto_Serif'] text-xl">₪{product.salePrice}</p>
                          <p className="text-sm text-[#8AA3B8] line-through">₪{product.price}</p>
                        </>
                      ) : (
                        <p className="font-['Noto_Serif'] text-xl">₪{product.price}</p>
                      )}
                    </div>
                    <div className="flex gap-3 md:justify-end">
                      <button onClick={() => handleEdit(product)} className="border border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A]">עריכה</button>
                      <button onClick={() => setConfirmDelete(product._id)} className="border border-red-200 px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-red-700">מחיקה</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="חיפוש לפי לקוח, אימייל או מספר הזמנה" className="w-full max-w-lg border border-[#E0D3BC] bg-[#FFFBF2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#13243A]" />
              <div className="flex flex-wrap gap-2">
                {['הכל', ...ORDER_STATUSES].map((status) => (
                  <button key={status} onClick={() => setOrderFilter(status)} className={`px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] ${orderFilter === status ? 'bg-[#13243A] text-white' : 'border border-[#E0D3BC] text-[#13243A]'}`}>
                    {status}
                  </button>
                ))}
                <button onClick={fetchOrders} className="border border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A]">רענן</button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex h-40 items-center justify-center bg-[#EFE7D6]">טוען הזמנות...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="border border-dashed border-[#E0D3BC9d0] bg-[#FFFBF2] px-6 py-16 text-center text-[#5A6B7F]">אין הזמנות להצגה</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="overflow-hidden border border-[#EFE7D6] bg-white">
                    <button onClick={() => setExpandedOrder((prev) => (prev === order._id ? null : order._id))} className="flex w-full flex-col gap-3 px-5 py-5 text-right md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`border px-3 py-1 font-['Manrope'] text-[0.58rem] uppercase tracking-[0.2rem] ${STATUS_COLORS[order.orderStatus] || 'border-[#E0D3BC] bg-[#FFFBF2] text-[#5A6B7F]'}`}>
                          {order.orderStatus}
                        </span>
                        <span className="font-['Noto_Serif'] text-xl">₪{order.totalPrice?.toFixed(2)}</span>
                        <span className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.18rem] text-[#5A6B7F]">#{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.2rem] text-[#5A6B7F]">{order.user?.name || order.shippingAddress?.name || 'לקוח'} · {formatDate(order.createdAt)}</div>
                    </button>

                    {expandedOrder === order._id && (
                      <div className="border-t border-[#EFE7D6] px-5 py-5">
                        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                          <div>
                            <h3 className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">פריטי ההזמנה</h3>
                            <div className="mt-4 space-y-3">
                              {order.items?.map((item, index) => (
                                <div key={`${item.product}-${index}`} className="flex items-center gap-4 border border-[#EFE7D6] bg-[#FFFBF2] p-3">
                                  <div className="h-16 w-14 overflow-hidden bg-[#EFE7D6]">
                                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : null}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-[#13243A]">{item.name}</p>
                                    <p className="mt-1 text-sm text-[#5A6B7F]">{item.color || 'ללא צבע'} · {item.size || 'ללא מידה'} · כמות {item.quantity}</p>
                                  </div>
                                  <p className="font-['Noto_Serif'] text-lg">₪{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="border border-[#EFE7D6] bg-[#FFFBF2] p-4">
                              <h3 className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">כתובת למשלוח</h3>
                              <p className="mt-3 text-sm leading-7 text-[#5A6B7F]">{order.shippingAddress?.name}<br />{order.shippingAddress?.street}, {order.shippingAddress?.city}<br />{order.shippingAddress?.zipCode} · {order.shippingAddress?.phone}</p>
                            </div>

                            <div className="border border-[#EFE7D6] bg-[#FFFBF2] p-4">
                              <h3 className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">עדכון סטטוס</h3>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {ORDER_STATUSES.map((status) => (
                                  <button key={status} disabled={statusUpdating === order._id || status === order.orderStatus} onClick={() => handleStatusChange(order._id, status)} className={`px-3 py-2 font-['Manrope'] text-[0.58rem] uppercase tracking-[0.18rem] ${status === order.orderStatus ? 'bg-[#13243A] text-white' : 'border border-[#E0D3BC] text-[#13243A]'} disabled:opacity-40`}>
                                    {statusUpdating === order._id ? '...' : status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'campaign' && (
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">Homepage Campaign Images</p>
              <h2 className="mt-2 font-['Noto_Serif'] text-4xl tracking-[-0.04em]">תמונות אווירה לדף הבית</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A6B7F]">
                ניהול תמונות בלבד. האתר בוחר תמונה אחת אקראית מכל אזור בזמן טעינת דף הבית. אם אזור ריק, האתר משתמש בתמונת ברירת המחדל או בתמונת מוצר קיימת.
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5A6B7F]">
                כדאי להעלות תמונות חדות בגודל המקורי המומלץ לכל אזור. האתר חותך את התמונות לפי המסגרת, לכן חשוב להשאיר מרווח סביב הדגם ולא להצמיד פנים או פרטים חשובים לקצוות.
              </p>
            </div>

            {loadingCampaignImages ? (
              <div className="flex h-40 items-center justify-center bg-[#EFE7D6]">טוען תמונות דף הבית...</div>
            ) : (
              <div className="space-y-5">
                {CAMPAIGN_SLOTS.map((slot) => (
                  <section key={slot.id} className="border border-[#EFE7D6] bg-white p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{slot.label}</p>
                        <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.03em]">{slot.description}</h3>
                        <p className="mt-2 text-sm font-medium text-[#13243A]">{slot.resolution}</p>
                        <p className="mt-2 text-sm text-[#5A6B7F]">{campaignImages[slot.id]?.length || 0} תמונות זמינות לאזור זה</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <label className={`cursor-pointer border border-dashed border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A] ${uploadingCampaignSlot === slot.id ? 'pointer-events-none opacity-50' : ''}`}>
                          {uploadingCampaignSlot === slot.id ? 'מעלה...' : 'העלה תמונות'}
                          <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleCampaignImageFiles(slot.id, event)} />
                        </label>
                        <button
                          type="button"
                          onClick={() => saveCampaignSlot(slot.id)}
                          disabled={savingCampaignSlot === slot.id}
                          className="bg-[#13243A] px-5 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-white disabled:opacity-50"
                        >
                          {savingCampaignSlot === slot.id ? 'שומר...' : 'שמור אזור'}
                        </button>
                      </div>
                    </div>

                    {campaignImages[slot.id]?.length > 0 ? (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                        {campaignImages[slot.id].map((url) => (
                          <div key={url} className="group relative aspect-[4/3] overflow-hidden bg-[#EFE7D6]">
                            <img src={url} alt={slot.label} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeCampaignImage(slot.id, url)}
                              className="absolute inset-0 bg-black/55 font-['Manrope'] text-xs uppercase tracking-[0.18rem] text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              הסר
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-6 border border-dashed border-[#E0D3BC9d0] bg-[#FFFBF2] px-6 py-10 text-center text-sm text-[#5A6B7F]">
                        אין עדיין תמונות באזור זה.
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-10">
            <div>
              <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#5A6B7F]">Catalog Builder</p>
              <h2 className="mt-2 font-['Noto_Serif'] text-4xl tracking-[-0.04em]">{editId ? 'עריכת מוצר קיים' : 'הוספת מוצר חדש'}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A6B7F]">הטופס בנוי לפי זרימת עבודה של וריאנטים: קודם מגדירים צבעים, אחר כך מידות, ואז מלאי נפרד לכל צבע ולכל מידה.</p>
            </div>

            <section className="grid gap-6 border border-[#EFE7D6] bg-[#FFFBF2] p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">שם מוצר</label>
                <input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="לדוגמה: חליפת טוקסידו קלאסית" />
              </div>

              <div>
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">קטגוריה</label>
                <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]">
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 border border-[#E0D3BC] bg-white px-4 py-3 text-sm text-[#5A6B7F]">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} className="h-4 w-4 accent-[#13243A]" />
                  הצג את המוצר בדף הבית
                </label>
              </div>

              <div>
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">מחיר רגיל</label>
                <input required type="number" min="1" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="0" />
              </div>

              <div>
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">מחיר מבצע</label>
                <input type="number" min="0" value={form.salePrice} onChange={(event) => setForm((prev) => ({ ...prev, salePrice: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="ריק אם אין מבצע" />
              </div>

              <div className="md:col-span-2">
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">תיאור</label>
                <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} className="mt-2 w-full resize-none border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="תיאור קצר, איכותי וברור של המוצר" />
              </div>

              <div>
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">צבעים</label>
                <input value={form.colors} onChange={(event) => setForm((prev) => ({ ...prev, colors: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="שחור, לבן, כחול" />
                <p className="mt-2 text-xs text-[#5A6B7F]">מפרידים צבעים באמצעות פסיקים. לכל צבע יופיע מלאי נפרד לפי מידה.</p>
              </div>

              <div>
                <label className="block font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">תגיות</label>
                <input value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} className="mt-2 w-full border border-[#E0D3BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#13243A]" placeholder="טוקסידו, חתן, ערב" />
              </div>
            </section>

            <section className="border border-[#EFE7D6] bg-white p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">מידות זמינות</p>
                  <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.03em]">בחר את כל המידות הרלוונטיות</h3>
                </div>
                <div className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">{form.sizes.length} מידות נבחרו</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size} type="button" onClick={() => handleToggleSize(size)} className={`px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.18rem] ${form.sizes.includes(size) ? 'bg-[#13243A] text-white' : 'border border-[#E0D3BC] text-[#13243A]'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {colorList.length > 0 && form.sizes.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">Variant Stock</p>
                    <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.03em]">מלאי נפרד לפי צבע ומידה</h3>
                  </div>
                  <div className="bg-[#FFFBF2] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A]">סה"כ מלאי: {getTotalStock(sizeStock)} יחידות</div>
                </div>

                {colorList.map((color) => (
                  <div key={color} className="border border-[#EFE7D6] bg-white p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">צבע</p>
                        <h4 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.03em]">{color}</h4>
                      </div>
                      <div className="bg-[#FFFBF2] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A]">{Object.values(sizeStock[color] || {}).reduce((sum, qty) => sum + (Number(qty) || 0), 0)} יחידות לצבע זה</div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {form.sizes.map((size) => (
                        <div key={`${color}-${size}`} className="flex items-center justify-between border border-[#EFE7D6] bg-[#FFFBF2] px-4 py-3">
                          <span className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.18rem] text-[#13243A]">{size}</span>
                          <input type="number" min="0" value={sizeStock[color]?.[size] ?? ''} onChange={(event) => setColorStockValue(color, size, event.target.value)} className="w-20 border border-[#E0D3BC] bg-white px-3 py-2 text-center text-sm outline-none focus:border-[#13243A]" placeholder="0" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">תמונות ייעודיות עבור {color}</p>
                          <p className="mt-2 text-xs leading-6 text-[#5A6B7F]">{PRODUCT_IMAGE_GUIDANCE}</p>
                        </div>
                        <label className={`cursor-pointer border border-dashed border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A] ${uploadingColor === color ? 'pointer-events-none opacity-50' : ''}`}>
                          {uploadingColor === color ? 'מעלה...' : 'העלה תמונות'}
                          <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleColorImageFiles(color, event)} />
                        </label>
                      </div>
                      {colorImages[color]?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {colorImages[color].map((url) => (
                            <div key={url} className="relative h-20 w-20 overflow-hidden bg-[#EFE7D6]">
                              <img src={url} alt={color} className="h-full w-full object-cover" />
                              <button type="button" onClick={() => removeColorImage(color, url)} className="absolute inset-0 bg-black/55 text-white opacity-0 transition-opacity hover:opacity-100">הסר</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="border border-[#EFE7D6] bg-white p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#5A6B7F]">General Gallery</p>
                  <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.03em]">תמונות כלליות של המוצר</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5A6B7F]">{PRODUCT_IMAGE_GUIDANCE}</p>
                </div>
                <label className={`cursor-pointer border border-dashed border-[#E0D3BC] px-4 py-3 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#13243A] ${uploadingGeneral ? 'pointer-events-none opacity-50' : ''}`}>
                  {uploadingGeneral ? 'מעלה...' : 'העלה תמונות'}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageFiles} />
                </label>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {uploadedImages.map((url) => (
                    <div key={url} className="relative h-24 w-24 overflow-hidden bg-[#EFE7D6]">
                      <img src={url} alt="product" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeUploadedImage(url)} className="absolute inset-0 bg-black/55 text-white opacity-0 transition-opacity hover:opacity-100">הסר</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="flex flex-wrap items-center gap-4 border-t border-[#EFE7D6] pt-8">
              <button type="submit" disabled={savingProduct} className="bg-[#13243A] px-8 py-4 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-white disabled:opacity-50">
                {savingProduct ? 'שומר...' : editId ? 'שמור שינויים' : 'הוסף מוצר'}
              </button>
              <button type="button" onClick={() => { resetForm(); setTab('products'); }} className="border border-[#E0D3BC] px-8 py-4 font-['Manrope'] text-[0.64rem] uppercase tracking-[0.24rem] text-[#13243A]">
                ביטול
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}







