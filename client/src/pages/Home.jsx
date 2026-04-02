import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import AIChatButton from '../components/AIChatButton';
import heroImage from '../assets/hero.png';

const HOUSE_CODES = [
  { title: 'New In', description: 'כניסות חדשות שמחדדות את הקולקציה ונותנות סיבה אמיתית לחזור לאתר.' , link: '/shop?collection=new' },
  { title: 'Ceremony', description: 'עריכה מחויטת שמתאימה לחתן, למלווה וללבוש formal מדויק.', link: '/shop?category=חתן ומלווים' },
  { title: 'Tailoring', description: 'פריטים שנשענים על קווים נקיים, מידות מדויקות ונוכחות שקטה.', link: '/shop?category=Formal' },
  { title: 'Sale', description: 'הנחות מסודרות עם היררכיה נכונה, בלי להרגיש אתר discount.', link: '/shop?sale=true' },
];

function ProductCard({ product, priority = false }) {
  return (
    <Link to={`/product/${product._id}`} className={`group block ${priority ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-[#f6f6f6] ${priority ? 'aspect-[5/4]' : 'aspect-[3/4]'}`}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-[#b8b1b2]" style={{ fontSize: '54px' }}>checkroom</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-8 items-center justify-between bg-[linear-gradient(180deg,transparent_0%,rgba(17,17,17,0.74)_100%)] px-6 py-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.26rem] text-white">View Product</span>
          <span className="material-symbols-outlined text-white">north_west</span>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.3rem] text-[#6e6667]">{product.category}</p>
          <h3 className="mt-2 font-['Noto_Serif'] text-xl tracking-[-0.04em] text-[#111111]">{product.name}</h3>
        </div>
        <div className="text-left">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-lg text-[#111111]">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-xs uppercase tracking-[0.18rem] text-[#9d9596] line-through">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-lg text-[#111111]">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [saleSelection, setSaleSelection] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, collectionRes, saleRes] = await Promise.all([
          api.get('/products', { params: { featured: true } }),
          api.get('/products', { params: { collection: 'new' } }),
          api.get('/products', { params: { sale: true } }),
        ]);
        setFeatured(featuredRes.data.slice(0, 3));
        setNewCollection(collectionRes.data.slice(0, 4));
        setSaleSelection(saleRes.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home products', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchData();
  }, []);

  const spotlight = useMemo(() => newCollection[0] || featured[0] || saleSelection[0] || null, [featured, newCollection, saleSelection]);

  return (
    <div className="editorial-shell min-h-screen bg-white">
      <main>
        <section className="relative h-screen overflow-hidden bg-black">
          <img src={heroImage} alt="Dream and Work Campaign" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.10)_50%,rgba(0,0,0,0.0)_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 text-center text-white">
            <p className="mb-5 font-['Manrope'] text-[0.65rem] uppercase tracking-[0.5rem] text-white/70">Spring Summer 2026</p>
            <h1 className="font-['Noto_Serif'] text-6xl leading-none tracking-[-0.02em] text-white md:text-8xl xl:text-[9rem]">Dream &amp; Work</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 md:text-lg">A quieter luxury wardrobe for ceremony, tailoring, and everyday precision.</p>
            <div className="mt-10 flex items-center gap-4">
              <Link to="/shop?collection=new" className="bg-[#1b1c1c] px-10 py-4 font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-white transition-opacity hover:opacity-80">New Arrivals</Link>
              <Link to="/shop" className="bg-white px-10 py-4 font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#1b1c1c] transition-opacity hover:opacity-80">Shop Now</Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-[#6e6667]">House Codes</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">A stronger merchandising layer for the brand.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#5d5657]">אתרי מותגי יוקרה לא נשענים רק על קטגוריות. הם בונים עריכות, עולמות, ורגעים מסחריים ברורים.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {HOUSE_CODES.map((item) => (
                <Link key={item.title} to={item.link} className="group bg-[#f7f6f2] px-6 py-8 transition-colors hover:bg-[#f1efea]">
                  <p className="font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-[#111111]">{item.title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#5d5657]">{item.description}</p>
                  <span className="mt-8 inline-flex font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#111111]">Enter Edit</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="bg-[#f6f6f6] p-8 md:p-12 lg:sticky lg:top-28 lg:h-fit">
              <p className="editorial-kicker text-[#6e6667]">The House Edit</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">Ceremony, everyday, and the space between.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#5d5657]">Clean white surfaces, balanced spacing, and a calmer layout that keeps the focus on the brand and the products.</p>
              <div className="mt-10 flex flex-col gap-4 text-sm text-[#111111]">
                <Link to="/shop?category=חתן ומלווים" className="flex items-center justify-between bg-white px-5 py-4"><span className="font-['Manrope'] uppercase tracking-[0.2rem]">Groom &amp; Groomsmen</span><span className="material-symbols-outlined">north_west</span></Link>
                <Link to="/shop?category=Formal" className="flex items-center justify-between bg-white px-5 py-4"><span className="font-['Manrope'] uppercase tracking-[0.2rem]">Formal Wardrobe</span><span className="material-symbols-outlined">north_west</span></Link>
                <Link to="/shop?category=Casual" className="flex items-center justify-between bg-white px-5 py-4"><span className="font-['Manrope'] uppercase tracking-[0.2rem]">Casual Essentials</span><span className="material-symbols-outlined">north_west</span></Link>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index === 0} />
              ))}
              {!loadingFeatured && featured.length === 0 && (
                <div className="md:col-span-2 bg-[#f6f6f6] p-10 text-center">
                  <p className="editorial-kicker text-[#6e6667]">No featured items yet</p>
                  <Link to="/shop" className="mt-6 inline-flex font-['Noto_Serif'] text-2xl text-[#111111]">Enter the full collection</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {spotlight && (
          <section className="px-6 py-24 md:px-12 lg:px-20">
            <div className="mx-auto grid max-w-[1600px] gap-10 bg-[#f7f6f2] p-8 md:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="editorial-kicker text-[#6e6667]">Spotlight Product</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">A product-led moment that gives the homepage a luxury retail rhythm.</h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-[#5d5657]">באתרי אופנה גדולים תמיד יש רגע אחד שמקבל פוקוס חזק יותר. זה עוזר לכוון את הלקוח ולא רק להציג עוד גריד.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to={`/product/${spotlight._id}`} className="bg-[#111111] px-8 py-4 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-white">Shop Spotlight</Link>
                  <Link to="/shop?collection=new" className="border border-[#111111] px-8 py-4 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#111111]">View New In</Link>
                </div>
              </div>
              <ProductCard product={spotlight} priority />
            </div>
          </section>
        )}

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px] bg-[#f6f6f6] px-8 py-16 md:px-14 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <p className="editorial-kicker text-[#6e6667]">Editorial Note</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">Clothing that lands with clarity.</h2>
            </div>
            <blockquote className="mt-8 max-w-3xl font-['Noto_Serif'] text-2xl leading-snug text-[#111111] md:text-4xl">Dress impeccably and the room remembers the man, not the noise around him.</blockquote>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-[#6e6667]">New Collection</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">Fresh arrivals in a cleaner grid.</h2>
              </div>
              <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.66rem] uppercase tracking-[0.24rem] text-[#111111]">View all new arrivals</Link>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {newCollection.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {saleSelection.length > 0 && (
          <section className="px-6 py-24 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="editorial-kicker text-[#6e6667]">Private Sale Selection</p>
                  <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">Sale should still feel considered.</h2>
                </div>
                <Link to="/shop?sale=true" className="font-['Manrope'] text-[0.66rem] uppercase tracking-[0.24rem] text-[#111111]">View sale edit</Link>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {saleSelection.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
}
