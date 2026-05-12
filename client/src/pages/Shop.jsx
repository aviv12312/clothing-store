import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import { useWishlist } from '../context/WishlistContext';
import { trackSearch } from '../services/analytics';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ALL_CATEGORY = 'הכל';
const CATEGORIES = [ALL_CATEGORY, 'חתן ומלווים', 'Casual', 'Formal'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: '', labelKey: 'shop.recommended' },
  { value: 'price_asc', labelKey: 'shop.priceAsc' },
  { value: 'price_desc', labelKey: 'shop.priceDesc' },
  { value: 'newest', labelKey: 'shop.newest' },
  { value: 'sale', labelKey: 'shop.saleFirst' },
];

const CATEGORY_LABEL_KEYS = {
  [ALL_CATEGORY]: 'shop.allCollections',
  'חתן ומלווים': 'nav.groom',
  Casual: 'nav.casual',
  Formal: 'nav.formal',
};

function getColorHex(name) {
  const map = {
    'שחור': '#13243A',
    'לבן': '#EFE7D6',
    'אפור': '#8AA3B8',
    'כחול': '#1B2E4B',
    'נייבי': '#1B2E4B',
    'חאקי': '#C47A5C',
    'בורדו': '#9C5A40',
    'ירוק': '#13243A',
    'בז\'': '#E0D3BC',
    'חום': '#9C5A40',
    'כתום': '#C47A5C',
    'צהוב': '#C47A5C',
  };

  return map[name] || name || '#5A6B7F555';
}

function ProductCard({ product }) {
  const { t } = useTranslation();
  const { toggle, isLiked } = useWishlist();
  const liked = isLiked(product._id);

  return (
    <article className="group relative motion-lift">
      <button
        onClick={() => toggle(product)}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-white shadow-[0_8px_24px_rgba(17,17,17,0.06)] transition-all hover:scale-110 hover:bg-[#FFFBF2]"
      >
        <span
          className={`material-symbols-outlined ${liked ? 'text-[#13243A]' : 'text-[#5A6B7F]'}`}
          aria-hidden="true"
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}
        >
          favorite
        </span>
      </button>

      {product.salePrice && (
        <div className="absolute right-4 top-4 z-10 bg-[#13243A] px-3 py-1 font-['Manrope'] text-[0.55rem] uppercase tracking-[0.22rem] text-white">
          {t('common.sale')}
        </div>
      )}

      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden bg-[#FFFBF2] aspect-[3/4]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="motion-image h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-[#CDBFA1]" style={{ fontSize: '54px' }}>checkroom</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex translate-y-8 items-center justify-center bg-[linear-gradient(180deg,transparent_0%,rgba(17,17,17,0.84)_100%)] px-5 py-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.25rem] text-white">{t('common.viewProduct')}</span>
          </div>
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#5A6B7F]">{product.category}</p>
          <Link to={`/product/${product._id}`}>
            <h3 className="mt-2 font-['Noto_Serif'] text-xl tracking-[-0.04em] text-[#13243A]">{product.name}</h3>
          </Link>
          {product.colors?.length > 0 && (
            <div className="mt-3 flex gap-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="inline-block h-3 w-3 border border-[rgba(27,28,28,0.08)]"
                  style={{ backgroundColor: color.startsWith('#') ? color : getColorHex(color) }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-left">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-lg text-[#13243A]">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-xs uppercase tracking-[0.15rem] text-[#8AA3B8] line-through">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-lg text-[#13243A]">₪{product.price}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Shop() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(() => searchParams.get('category') || ALL_CATEGORY);
  const [search, setSearch] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [sort, setSort] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilter, setMobileFilter] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    const collection = searchParams.get('collection');
    const sale = searchParams.get('sale');

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== ALL_CATEGORY) params.category = category;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        if (collection) params.collection = collection;
        if (sale) params.sale = true;

        const { data } = await api.get('/products', { params });
        setProducts(data);
        const colors = [...new Set(data.flatMap((entry) => entry.colors || []))].filter(Boolean);
        setAllColors(colors);
        const nextMax = Math.max(...data.map((entry) => entry.salePrice || entry.price || 0), 1000);
        setMaxPrice(nextMax);
        setPriceRange((prev) => [Math.min(prev[0], nextMax), Math.max(Math.min(prev[1], nextMax), 0)]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, searchParams, sort]);

  const handleSearch = (value) => {
    setDraftSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
      if (value) trackSearch(value);
    }, 350);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const displayedProducts = useMemo(
    () =>
      products.filter((product) => {
        const price = product.salePrice || product.price || 0;
        if (price < priceRange[0] || price > priceRange[1]) return false;
        if (selectedSize && (!product.sizes || !product.sizes.includes(selectedSize))) return false;
        if (selectedColor && (!product.colors || !product.colors.includes(selectedColor))) return false;
        return true;
      }),
    [priceRange, products, selectedColor, selectedSize]
  );
  const pageRef = useScrollReveal([loading, displayedProducts.length, mobileFilter]);

  const activeFilters = [
    category !== ALL_CATEGORY && { key: 'category', label: t(CATEGORY_LABEL_KEYS[category] || category), clear: () => setCategory(ALL_CATEGORY) },
    selectedSize && { key: 'size', label: `Size ${selectedSize}`, clear: () => setSelectedSize('') },
    selectedColor && { key: 'color', label: selectedColor, clear: () => setSelectedColor('') },
    (priceRange[0] > 0 || priceRange[1] < maxPrice) && {
      key: 'price',
      label: `₪${priceRange[0]} - ₪${priceRange[1]}`,
      clear: () => setPriceRange([0, maxPrice]),
    },
  ].filter(Boolean);

  const resetAll = () => {
    setCategory(ALL_CATEGORY);
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange([0, maxPrice]);
    setSearch('');
    setDraftSearch('');
    setSort('');
  };

  const collectionLabel = searchParams.get('collection') === 'new' ? t('shop.newArrivals') : t(CATEGORY_LABEL_KEYS[category] || 'shop.curatedWardrobe');

  const Sidebar = () => (
    <div className="flex flex-col gap-10 p-7 md:p-8">
      <div>
        <p className="editorial-kicker text-[#5A6B7F]">{t('shop.search')}</p>
        <input type="text" value={draftSearch} onChange={(event) => handleSearch(event.target.value)} placeholder={t('shop.searchPlaceholder')} className="editorial-input mt-3" />
      </div>

      <div>
        <p className="editorial-kicker text-[#5A6B7F]">{t('shop.category')}</p>
        <div className="mt-4 flex flex-col gap-3">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`flex items-center justify-between text-sm uppercase tracking-[0.18rem] transition-colors ${category === item ? 'text-[#13243A]' : 'text-[#5A6B7F] hover:text-[#13243A]'}`}
            >
              <span>{t(CATEGORY_LABEL_KEYS[item] || item)}</span>
              {category === item && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>north_west</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="editorial-kicker text-[#5A6B7F]">{t('common.size')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button key={size} onClick={() => setSelectedSize(selectedSize === size ? '' : size)} className={`px-3 py-3 text-xs uppercase tracking-[0.18rem] transition-colors ${selectedSize === size ? 'bg-[#13243A] text-white' : 'bg-white text-[#13243A] hover:bg-[#EFE7D6]'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {allColors.length > 0 && (
        <div>
          <p className="editorial-kicker text-[#5A6B7F]">{t('common.color')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {allColors.map((color) => (
              <button key={color} onClick={() => setSelectedColor(selectedColor === color ? '' : color)} title={color} aria-label={`סינון לפי צבע ${color}`} className={`h-7 w-7 transition-transform ${selectedColor === color ? 'scale-110 ring-1 ring-[#13243A] ring-offset-2' : ''}`} style={{ backgroundColor: color.startsWith('#') ? color : getColorHex(color) }} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="editorial-kicker text-[#5A6B7F]">{t('shop.price')}</p>
        <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.18rem] text-[#13243A]">
          <span>₪{priceRange[0]}</span>
          <span>₪{priceRange[1]}</span>
        </div>
        <div className="mt-4 space-y-3">
          <input type="range" min={0} max={maxPrice} value={priceRange[0]} onChange={(event) => setPriceRange([Math.min(Number(event.target.value), priceRange[1]), priceRange[1]])} className="w-full accent-[#13243A]" />
          <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={(event) => setPriceRange([priceRange[0], Math.max(Number(event.target.value), priceRange[0])])} className="w-full accent-[#13243A]" />
        </div>
      </div>

      <div>
        <p className="editorial-kicker text-[#5A6B7F]">{t('shop.sort')}</p>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="editorial-select mt-3 bg-transparent">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between bg-white px-5 py-4">
        <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.28rem] text-[#5A6B7F]">{loading ? t('common.loading') : `${displayedProducts.length} ${t('common.products')}`}</p>
        <button onClick={resetAll} className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#13243A]">{t('shop.reset')}</button>
      </div>
    </div>
  );

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen bg-white">
      <div className="px-6 pb-10 pt-32 md:px-12 lg:px-20 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <p className="reveal editorial-kicker text-[#5A6B7F]">{t('shop.catalog')}</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="reveal">
              <h1 className="font-['Noto_Serif'] text-5xl tracking-[-0.06em] text-[#13243A] md:text-7xl">{collectionLabel}</h1>
              <p className="editorial-hand mt-4 text-3xl text-gold-dark md:text-4xl">{t('shop.hand')}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5A6B7F] md:text-base">{t('shop.intro')}</p>
            </div>
            <button onClick={() => setMobileFilter(true)} className="editorial-button-secondary motion-cta lg:hidden">{t('shop.filters')}</button>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {activeFilters.map((filter) => (
                <button key={filter.key} onClick={filter.clear} className="bg-[#FFFBF2] px-4 py-2 font-['Manrope'] text-[0.58rem] uppercase tracking-[0.22rem] text-[#13243A]">{filter.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1600px] gap-10">
          <aside className="hidden w-[18rem] shrink-0 bg-[#FFFBF2] lg:block lg:sticky lg:top-28 lg:self-start">
            <Sidebar />
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="motion-fade-up flex h-72 items-center justify-center bg-[#FFFBF2]">
                <span className="material-symbols-outlined animate-spin text-[#8AA3B8]" style={{ fontSize: '38px' }}>progress_activity</span>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="motion-fade-up bg-[#FFFBF2] px-8 py-20 text-center">
                <p className="editorial-kicker text-[#5A6B7F]">{t('shop.nothingMatched')}</p>
                <button onClick={resetAll} className="editorial-button motion-cta mt-8">{t('shop.clearFilters')}</button>
              </div>
            ) : (
              <div className="motion-grid grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
                {displayedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFilter && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[rgba(17,17,17,0.24)]" onClick={() => setMobileFilter(false)} />
          <div className="motion-drawer absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white shadow-[0_24px_60px_rgba(27,28,28,0.08)]">
            <div className="flex items-center justify-between px-6 pt-24">
              <p className="editorial-kicker text-[#5A6B7F]">{t('shop.filters')}</p>
              <button onClick={() => setMobileFilter(false)} aria-label="סגירת סינון" className="flex h-10 w-10 items-center justify-center bg-[#FFFBF2]">
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

