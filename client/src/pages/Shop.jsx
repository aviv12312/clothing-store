import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { trackSearch } from '../services/analytics';

const CATEGORIES = ['הכל', 'חתן ומלווים', 'Casual', 'Formal'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: '',           label: 'ברירת מחדל'       },
  { value: 'price_asc',  label: 'מחיר: נמוך לגבוה' },
  { value: 'price_desc', label: 'מחיר: גבוה לנמוך' },
  { value: 'newest',     label: 'החדשים ביותר'     },
  { value: 'sale',       label: 'מבצע קודם'        },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts]       = useState([]);
  const [category, setCategory]       = useState(() => searchParams.get('category') || 'הכל');
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange]   = useState([0, 5000]);
  const [maxPrice, setMaxPrice]       = useState(5000);
  const [loading, setLoading]         = useState(true);
  const [mobileFilter, setMobileFilter] = useState(false);
  const searchTimer = useRef(null);

  // צבעים ייחודיים מכל המוצרים
  const [allColors, setAllColors] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'הכל') params.category = category;
        if (search)              params.search = search;
        if (sort)                params.sort = sort;
        if (searchParams.get('collection')) params.collection = searchParams.get('collection');
        if (searchParams.get('sale'))       params.sale = true;

        const { data } = await api.get('/products', { params });
        setProducts(data);

        // חלץ צבעים ייחודיים
        const colors = [...new Set(data.flatMap((p) => p.colors || []))].filter(Boolean);
        setAllColors(colors);

        // קבע מחיר מקסימום
        const max = Math.max(...data.map((p) => p.salePrice || p.price || 0), 1000);
        setMaxPrice(max);
        setPriceRange((prev) => [prev[0], Math.max(prev[1], max)]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort]);

  // חיפוש עם debounce
  const handleSearch = (val) => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      if (val) trackSearch(val);
    }, 400);
  };

  // פילטור בצד לקוח (מחיר, מידה, צבע)
  const displayedProducts = products.filter((p) => {
    const price = p.salePrice || p.price || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    if (selectedSize  && (!p.sizes  || !p.sizes.includes(selectedSize)))   return false;
    if (selectedColor && (!p.colors || !p.colors.includes(selectedColor))) return false;
    return true;
  });

  // פילטרים פעילים
  const activeFilters = [
    category !== 'הכל'   && { key: 'category', label: category,        clear: () => setCategory('הכל') },
    selectedSize         && { key: 'size',     label: `מידה: ${selectedSize}`,  clear: () => setSelectedSize('') },
    selectedColor        && { key: 'color',    label: selectedColor,    clear: () => setSelectedColor('') },
    (priceRange[0] > 0 || priceRange[1] < maxPrice) && {
      key: 'price', label: `₪${priceRange[0]}–₪${priceRange[1]}`,
      clear: () => setPriceRange([0, maxPrice]),
    },
  ].filter(Boolean);

  const resetAll = () => {
    setCategory('הכל');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange([0, maxPrice]);
    setSearch('');
    setSort('');
  };

  const categoryLabel =
    category === 'הכל' ? 'All Collections' :
    category === 'חתן ומלווים' ? 'Groom & Groomsmen' : category;

  const Sidebar = () => (
    <div className="flex flex-col gap-8 py-10 px-8">
      {/* Search */}
      <div>
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-3">חיפוש</p>
        <div className="relative">
          <input
            type="text"
            placeholder="חפש מוצר..."
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white border border-[#e8e8e6]/50 text-[#1a1a1a] px-3 py-2 pr-8 text-xs font-['Manrope'] placeholder-[#bbbbbb] focus:outline-none focus:border-[#1a1a1a]/60 transition-colors"
          />
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#bbbbbb]" style={{ fontSize: '16px' }}>search</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-4">קטגוריה</p>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-right text-xs tracking-wider uppercase font-['Manrope'] transition-colors flex items-center gap-2 group ${category === cat ? 'text-[#1a1a1a]' : 'text-[#666666] hover:text-[#1a1a1a]'}`}>
              <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-all ${category === cat ? 'bg-[#1a1a1a]' : 'bg-transparent group-hover:bg-[#bbbbbb]'}`} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-4">מידה</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button key={size} onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
              className={`w-9 h-9 text-[0.65rem] font-['Manrope'] uppercase tracking-wide border transition-all ${selectedSize === size ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#1a1a1a]/5' : 'border-[#e8e8e6]/50 text-[#666666] hover:border-[#1a1a1a]/50'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      {allColors.length > 0 && (
        <div>
          <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-4">צבע</p>
          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => (
              <button key={color} onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                title={color}
                className={`relative w-7 h-7 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#1a1a1a] scale-110' : 'border-transparent hover:border-[#888888]'}`}
                style={{ backgroundColor: color.startsWith('#') ? color : getColorHex(color) }}>
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-4">טווח מחיר</p>
        <div className="flex justify-between text-xs font-['Manrope'] text-[#1a1a1a] mb-3">
          <span>₪{priceRange[0]}</span>
          <span>₪{priceRange[1]}</span>
        </div>
        <input type="range" min={0} max={maxPrice} value={priceRange[0]}
          onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])}
          className="w-full accent-[#1a1a1a] mb-2" />
        <input type="range" min={0} max={maxPrice} value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])}
          className="w-full accent-[#1a1a1a]" />
      </div>

      {/* Sort */}
      <div>
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.2rem] uppercase text-[#666666] mb-3">מיון</p>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="w-full bg-white border border-[#e8e8e6]/50 text-[#1a1a1a] px-3 py-2 text-xs font-['Manrope'] focus:outline-none focus:border-[#1a1a1a]/60 appearance-none cursor-pointer">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-auto pt-6 border-t border-[#e8e8e6]/30 flex justify-between items-center">
        <p className="font-['Manrope'] text-[0.6rem] tracking-[0.15rem] uppercase text-[#bbbbbb]">
          {loading ? 'טוען...' : `${displayedProducts.length} מוצרים`}
        </p>
        {activeFilters.length > 0 && (
          <button onClick={resetAll} className="font-['Manrope'] text-[0.6rem] uppercase tracking-widest text-[#1a1a1a] hover:text-[#000000] transition-colors">
            נקה הכל
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="pt-32 pb-10 px-8 md:px-16 border-b border-[#e8e8e6]/30">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.25rem] text-[#1a1a1a] mb-3">
          Dream &amp; Work — Catalog
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-['Noto_Serif'] text-5xl md:text-7xl tracking-tight text-[#1a1a1a]" dir="ltr">
            MENSWEAR<br />
            <em className="text-[#1a1a1a] not-italic">{categoryLabel}</em>
          </h1>
          {/* Mobile filter button */}
          <button onClick={() => setMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 font-['Manrope'] text-xs uppercase tracking-widest text-[#666666] border border-[#e8e8e6]/50 px-4 py-2 hover:border-[#1a1a1a]/50 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
            פילטר
            {activeFilters.length > 0 && (
              <span className="bg-[#1a1a1a] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">{activeFilters.length}</span>
            )}
          </button>
        </div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {activeFilters.map((f) => (
              <button key={f.key} onClick={f.clear}
                className="flex items-center gap-1.5 font-['Manrope'] text-[0.65rem] uppercase tracking-wider border border-[#1a1a1a]/50 text-[#1a1a1a] px-3 py-1 hover:bg-[#1a1a1a]/5 transition-colors">
                {f.label}
                <span style={{ fontSize: '14px' }} className="material-symbols-outlined">close</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#f5f5f3] border-l border-[#e8e8e6]/30 sticky top-[72px] self-start max-h-[calc(100vh-72px)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileFilter && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/20" onClick={() => setMobileFilter(false)} />
            <div className="relative mr-auto w-80 max-w-full bg-white h-full overflow-y-auto">
              <div className="flex justify-between items-center px-6 pt-6">
                <p className="font-['Manrope'] text-xs uppercase tracking-widest text-[#1a1a1a]">פילטרים</p>
                <button onClick={() => setMobileFilter(false)}>
                  <span className="material-symbols-outlined text-[#666666]">close</span>
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <main className="flex-1 px-6 md:px-12 py-12">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <span className="material-symbols-outlined text-[#bbbbbb] animate-spin" style={{ fontSize: '36px' }}>progress_activity</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-32">
              <span className="material-symbols-outlined text-[#bbbbbb] mb-6 block" style={{ fontSize: '64px' }}>search_off</span>
              <p className="text-[#666666] font-['Manrope'] uppercase tracking-widest text-xs mb-4">לא נמצאו מוצרים</p>
              {activeFilters.length > 0 && (
                <button onClick={resetAll} className="font-['Manrope'] text-xs uppercase tracking-widest text-[#1a1a1a] border border-[#1a1a1a]/40 px-6 py-2 hover:bg-[#1a1a1a]/5 transition-colors">
                  נקה פילטרים
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {displayedProducts.map((p) => (
                <ProductCard key={p._id} product={p}
                  isLiked={useWishlistStatus(p._id)}
                  onToggleLike={(e) => { e.preventDefault(); }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

// helper — hex לצבעים נפוצים בעברית
function getColorHex(name) {
  const map = { 'שחור': '#1a1a1a', 'לבן': '#f5f5f5', 'אפור': '#888', 'כחול': '#2563eb', 'נייבי': '#1e3a5f', 'חאקי': '#8b7355', 'בורדו': '#7c1d1d', 'ירוק': '#166534', 'בז\'': '#d4b896', 'חום': '#6b4226', 'כתום': '#ea580c', 'צהוב': '#ca8a04' };
  return map[name] || '#555';
}

function useWishlistStatus(id) {
  const { isLiked } = useWishlist();
  return isLiked(id);
}

function ProductCard({ product: p, isLiked, onToggleLike }) {
  const { toggle } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="group cursor-pointer relative">
      <button onClick={(e) => { e.preventDefault(); toggle(p); }}
        className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100">
        <span className={`material-symbols-outlined transition-colors ${isLiked ? 'text-[#1a1a1a]' : 'text-[#666666]'}`}
          style={{ fontSize: '18px', fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </span>
      </button>

      {/* Sale Badge */}
      {p.salePrice && (
        <div className="absolute top-3 right-3 z-10 bg-[#1a1a1a] text-white px-2 py-0.5 text-[0.6rem] font-['Manrope'] font-bold uppercase tracking-widest">
          SALE
        </div>
      )}

      <Link to={`/product/${p._id}`}>
        <div className="relative overflow-hidden aspect-[3/4] bg-[#f5f5f3] mb-5">
          {p.images?.[0] ? (
            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#bbbbbb]" style={{ fontSize: '48px' }}>checkroom</span>
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/75 via-white/10 to-transparent">
            <button onClick={(e) => { e.preventDefault(); addItem(p, p.sizes?.[0] || '', p.colors?.[0] || ''); }}
              className="gold-shimmer px-8 py-2.5 text-[0.65rem] uppercase tracking-widest font-['Manrope'] font-semibold hover:opacity-80 transition-opacity">
              הוסף לעגלה
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start px-0.5">
          <div>
            <p className="font-['Noto_Serif'] text-base text-[#1a1a1a] mb-0.5">{p.name}</p>
            <p className="text-[#666666] text-[0.65rem] font-['Manrope'] uppercase tracking-widest">{p.category}</p>
            {p.colors?.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {p.colors.slice(0, 4).map((color) => (
                  <span key={color} title={color}
                    className="w-3 h-3 rounded-full border border-[#e8e8e6]/60 inline-block"
                    style={{ backgroundColor: color.startsWith('#') ? color : getColorHex(color) }} />
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            {p.salePrice ? (
              <>
                <p className="font-['Manrope'] text-base text-[#1a1a1a]">₪{p.salePrice}</p>
                <p className="text-[#bbbbbb] line-through text-xs font-['Manrope']">₪{p.price}</p>
              </>
            ) : (
              <p className="font-['Manrope'] text-base text-[#1a1a1a]">₪{p.price}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
