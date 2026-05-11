import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import AIChatButton from '../components/AIChatButton';
import Marquee from '../components/Marquee';
import { useScrollReveal } from '../hooks/useScrollReveal';
import heroImage from '../assets/hero.png';

const HOUSE_CODES = [
  { num: '01', title: 'New In',    description: 'כניסות חדשות שמחדדות את הקולקציה ונותנות סיבה אמיתית לחזור לאתר.', link: '/shop?collection=new' },
  { num: '02', title: 'Ceremony',  description: 'עריכה מחויטת שמתאימה לחתן, למלווה וללבוש formal מדויק.',              link: '/shop?category=חתן ומלווים' },
  { num: '03', title: 'Tailoring', description: 'פריטים שנשענים על קווים נקיים, מידות מדויקות ונוכחות שקטה.',          link: '/shop?category=Formal' },
  { num: '04', title: 'Sale',      description: 'הנחות מסודרות עם היררכיה נכונה, בלי להרגיש אתר discount.',            link: '/shop?sale=true' },
];

function ProductCard({ product, priority = false }) {
  return (
    <Link to={`/product/${product._id}`} className={`group block ${priority ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-surface ${priority ? 'aspect-[5/4]' : 'aspect-[3/4]'}`}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '54px' }}>checkroom</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-6 items-center justify-between bg-[linear-gradient(180deg,transparent_0%,rgba(10,15,30,0.7)_100%)] px-6 py-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.28rem] text-white">View Product</span>
          <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>north_west</span>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.32rem] text-on-surface-variant">{product.category}</p>
          <h3 className="mt-2 font-['Noto_Serif'] text-xl tracking-[-0.03em] text-on-surface">{product.name}</h3>
        </div>
        <div className="text-left shrink-0">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-lg text-on-surface">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.18rem] text-on-surface-variant line-through">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-lg text-on-surface">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, setFeatured]           = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [saleSelection, setSaleSelection] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const pageRef = useScrollReveal([loadingFeatured]);

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

  const spotlight = useMemo(
    () => newCollection[0] || featured[0] || saleSelection[0] || null,
    [featured, newCollection, saleSelection]
  );

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen bg-background">
      <main>

        {/* ── Hero — full-bleed photo + editorial text (Tigha style) ── */}
        <section className="relative h-screen overflow-hidden bg-primary">
          <img
            src={heroImage}
            alt="Dream and Work Campaign"
            className="hero-zoom absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Gradient darkens the RIGHT side (RTL text side) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(8,13,26,0.92)_0%,rgba(8,13,26,0.45)_50%,rgba(8,13,26,0.05)_100%)]" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,13,26,0.5)_0%,transparent_35%)]" />

          {/* Text — right side in RTL (justify-start = RTL right) */}
          <div className="relative z-10 flex h-full items-center px-6 md:px-14 lg:px-24">
            <div className="max-w-xl text-white">
              <p className="reveal font-['Manrope'] text-[0.55rem] uppercase tracking-[0.55rem] text-white/45">
                New Collection — SS 2026
              </p>
              <h1
                className="reveal mt-6 font-['Noto_Serif'] leading-[1.0] tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(3.2rem, 6.5vw, 7.5rem)', transitionDelay: '120ms' }}
              >
                Dressed<br />with Intent.
              </h1>
              <p
                className="reveal mt-6 max-w-sm font-['Manrope'] text-sm leading-7 text-white/60"
                style={{ transitionDelay: '240ms' }}
              >
                A quieter luxury wardrobe for ceremony, tailoring, and everyday precision.
              </p>
              <div className="reveal mt-10 flex items-center gap-6" style={{ transitionDelay: '360ms' }}>
                <Link
                  to="/shop?collection=new"
                  className="border border-white/35 px-10 py-4 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.34rem] text-white transition-all duration-300 hover:bg-white hover:text-primary"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/shop"
                  className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.34rem] text-white/50 transition-colors duration-300 hover:text-white"
                >
                  Discover →
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
            <span className="font-['Manrope'] text-[0.48rem] uppercase tracking-[0.4rem]">Scroll</span>
            <div className="h-8 w-px bg-white/20" />
          </div>
        </section>

        {/* ── Marquee ── */}
        <Marquee dark />

        {/* ── House Codes — editorial blocks (tall, navy) ── */}
        <section className="py-24">
          <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
            <div className="reveal mb-12 flex items-end justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">House Codes</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-on-surface md:text-4xl">
                  The four pillars of Dream &amp; Work.
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4">
            {HOUSE_CODES.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="reveal group relative flex h-72 flex-col justify-between bg-primary px-8 py-8 transition-all duration-500 hover:bg-[#0d1f3c] border border-primary/20 md:h-80"
              >
                <span className="font-['Manrope'] text-[0.5rem] uppercase tracking-[0.45rem] text-on-primary/30">
                  {item.num}
                </span>
                <div>
                  <p className="font-['Noto_Serif'] text-4xl tracking-[-0.04em] text-on-primary md:text-5xl">
                    {item.title}
                  </p>
                  <p className="mt-3 text-xs leading-6 text-on-primary/55 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex font-['Manrope'] text-[0.55rem] uppercase tracking-[0.3rem] text-on-primary/35 transition-all duration-300 group-hover:text-on-primary/70">
                    Enter →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Marquee (light) ── */}
        <Marquee />

        {/* ── Spotlight — Street Beauty style (large image + text) ── */}
        {spotlight && (
          <section className="py-24">
            <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
              <div className="reveal mb-10">
                <p className="editorial-kicker text-on-surface-variant">Spotlight</p>
              </div>
            </div>
            <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
              <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
                {/* Image — large, right in RTL */}
                <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[600px]">
                  {spotlight.images?.[0] ? (
                    <img
                      src={spotlight.images[0]}
                      alt={spotlight.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline" style={{ fontSize: '72px' }}>checkroom</span>
                    </div>
                  )}
                </div>

                {/* Text — left side in RTL */}
                <div className="flex flex-col justify-center bg-surface px-10 py-14 md:px-14">
                  <p className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.4rem] text-on-surface-variant">
                    New Arrivals
                  </p>
                  <h2 className="mt-5 font-['Noto_Serif'] text-4xl leading-tight tracking-[-0.04em] text-on-surface md:text-5xl">
                    {spotlight.name}
                  </h2>
                  {spotlight.salePrice ? (
                    <div className="mt-4 flex items-baseline gap-3">
                      <p className="font-['Noto_Serif'] text-2xl text-on-surface">₪{spotlight.salePrice}</p>
                      <p className="font-['Manrope'] text-sm text-on-surface-variant line-through">₪{spotlight.price}</p>
                    </div>
                  ) : (
                    <p className="mt-4 font-['Noto_Serif'] text-2xl text-on-surface">₪{spotlight.price}</p>
                  )}
                  <div className="my-8 h-px w-full bg-outline-variant" />
                  <p className="text-sm leading-7 text-on-surface-variant max-w-xs">
                    {spotlight.description || 'פריט נבחר מהקולקציה הנוכחית.'}
                  </p>
                  <div className="mt-10 flex flex-col gap-4">
                    <Link to={`/product/${spotlight._id}`} className="editorial-button self-start">
                      View Product
                    </Link>
                    <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.26rem] text-on-surface-variant link-gold">
                      View all new arrivals →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── The House Edit — featured products ── */}
        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="reveal mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">The House Edit</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">
                  Ceremony, everyday,<br className="hidden md:block" /> and the space between.
                </h2>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <Link to="/shop?category=חתן ומלווים" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">
                  Groom &amp; Groomsmen →
                </Link>
                <Link to="/shop?category=Formal" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">
                  Formal Wardrobe →
                </Link>
                <Link to="/shop?category=Casual" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">
                  Casual Essentials →
                </Link>
              </div>
            </div>

            <div className="stagger grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((product, index) => (
                <div key={product._id} className="reveal">
                  <ProductCard product={product} priority={index === 0} />
                </div>
              ))}
              {!loadingFeatured && featured.length === 0 && (
                <div className="reveal md:col-span-3 bg-surface p-10 text-center">
                  <p className="editorial-kicker text-on-surface-variant">No featured items yet</p>
                  <Link to="/shop" className="mt-6 inline-flex font-['Noto_Serif'] text-2xl text-on-surface">
                    Enter the full collection
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Editorial Note ── */}
        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px] bg-primary px-10 py-16 md:px-16 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div className="reveal-left">
              <p className="editorial-kicker text-white/40">Editorial Note</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-white md:text-5xl">
                Clothing that lands with clarity.
              </h2>
            </div>
            <blockquote className="reveal-right mt-8 font-['Noto_Serif'] text-2xl leading-snug text-white/70 md:text-4xl">
              Dress impeccably and the room remembers the man, not the noise around him.
            </blockquote>
          </div>
        </section>

        {/* ── New Collection ── */}
        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="reveal mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">New Collection</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">
                  Fresh arrivals.
                </h2>
              </div>
              <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.26rem] text-on-surface link-gold">
                View all new arrivals
              </Link>
            </div>

            <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {newCollection.map((product) => (
                <div key={product._id} className="reveal">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sale ── */}
        {saleSelection.length > 0 && (
          <section className="px-6 pb-24 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1600px]">
              <div className="reveal mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="editorial-kicker text-on-surface-variant">Private Sale</p>
                  <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">
                    Sale should still feel considered.
                  </h2>
                </div>
                <Link to="/shop?sale=true" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.26rem] text-on-surface link-gold">
                  View sale edit
                </Link>
              </div>
              <div className="stagger grid gap-6 md:grid-cols-3">
                {saleSelection.map((product) => (
                  <div key={product._id} className="reveal">
                    <ProductCard product={product} />
                  </div>
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
