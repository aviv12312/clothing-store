import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import AIChatButton from '../components/AIChatButton';
import heroBg from '../assets/logo.png';

function ProductCard({ product, priority = false }) {
  return (
    <Link to={`/product/${product._id}`} className={`group block ${priority ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-[#f5f3f2] ${priority ? 'aspect-[5/4]' : 'aspect-[3/4]'}`}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
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
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, collectionRes] = await Promise.all([
          api.get('/products', { params: { featured: true } }),
          api.get('/products', { params: { collection: 'new' } }),
        ]);
        setFeatured(featuredRes.data.slice(0, 3));
        setNewCollection(collectionRes.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load home products', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="editorial-shell min-h-screen bg-[#fbf9f8]">
      <main>
        <section className="relative min-h-screen overflow-hidden px-6 pb-16 pt-32 md:px-12 lg:px-20 lg:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(58,100,114,0.14),transparent_28%),linear-gradient(180deg,rgba(251,249,248,0.2)_0%,rgba(251,249,248,0.72)_68%,#fbf9f8_100%)]" />
          <div className="relative mx-auto grid max-w-[1680px] items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden bg-[#f5f3f2] min-h-[34rem] md:min-h-[44rem]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.2)_0%,rgba(17,17,17,0)_40%)]" />
              <img src={heroBg} alt="Dream and Work" className="h-full w-full object-cover opacity-80" />
            </div>

            <div className="relative z-10 pb-2 lg:-mr-24 lg:max-w-[36rem]">
              <p className="editorial-kicker text-[#6e6667]">Spring Summer 2026</p>
              <h1 className="editorial-title mt-6 text-5xl text-[#111111] md:text-7xl lg:text-[6.25rem]">
                Tailoring with
                <br />
                presence.
              </h1>
              <p className="mt-8 max-w-md text-sm leading-7 text-[#5c5556] md:text-base">
                A quieter luxury for modern menswear. Structured silhouettes, clean ceremony dressing,
                and editorial essentials designed to feel collected rather than mass-produced.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/shop" className="editorial-button">
                  Explore the Collection
                </Link>
                <Link to="/shop?collection=new" className="editorial-button-secondary">
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="bg-[#f5f3f2] p-8 md:p-12 lg:sticky lg:top-28 lg:h-fit">
              <p className="editorial-kicker text-[#6e6667]">The House Edit</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">
                Ceremony, everyday, and the space between.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#5d5657]">
                We shaped the landing page around wide breathing room, soft tonal depth, and the same
                editorial rhythm from the Stitch references so the store feels curated from the first scroll.
              </p>
              <div className="mt-10 flex flex-col gap-4 text-sm text-[#111111]">
                <Link to="/shop?category=חתן ומלווים" className="flex items-center justify-between bg-[#fbf9f8] px-5 py-4">
                  <span className="font-['Manrope'] uppercase tracking-[0.2rem]">Groom &amp; Groomsmen</span>
                  <span className="material-symbols-outlined">north_west</span>
                </Link>
                <Link to="/shop?category=Formal" className="flex items-center justify-between bg-[#fbf9f8] px-5 py-4">
                  <span className="font-['Manrope'] uppercase tracking-[0.2rem]">Formal Wardrobe</span>
                  <span className="material-symbols-outlined">north_west</span>
                </Link>
                <Link to="/shop?category=Casual" className="flex items-center justify-between bg-[#fbf9f8] px-5 py-4">
                  <span className="font-['Manrope'] uppercase tracking-[0.2rem]">Casual Essentials</span>
                  <span className="material-symbols-outlined">north_west</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index === 0} />
              ))}
              {!loadingFeatured && featured.length === 0 && (
                <div className="md:col-span-2 bg-[#f5f3f2] p-10 text-center">
                  <p className="editorial-kicker text-[#6e6667]">No featured items yet</p>
                  <Link to="/shop" className="mt-6 inline-flex font-['Noto_Serif'] text-2xl text-[#111111]">
                    Enter the full collection
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1680px] bg-[#f5f3f2] px-8 py-16 md:px-14 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <p className="editorial-kicker text-[#6e6667]">Editorial Note</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">
                Clothing that lands like architecture.
              </h2>
            </div>
            <blockquote className="mt-8 max-w-3xl font-['Noto_Serif'] text-2xl leading-snug text-[#111111] md:text-4xl">
              Dress impeccably and the room remembers the man, not the noise around him.
            </blockquote>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1680px]">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-[#6e6667]">New Collection</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#111111] md:text-5xl">
                  Fresh arrivals in an editorial grid.
                </h2>
              </div>
              <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.66rem] uppercase tracking-[0.24rem] text-[#111111]">
                View all new arrivals
              </Link>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {newCollection.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
}
