import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import AIChatButton from '../components/AIChatButton';
import Marquee from '../components/Marquee';
import { useScrollReveal } from '../hooks/useScrollReveal';
import heroImage from '../assets/hero.webp';

gsap.registerPlugin(ScrollTrigger, SplitText);

const pickRandomImage = (images, fallback = null) => {
  if (!Array.isArray(images) || images.length === 0) return fallback;
  return images[Math.floor(Math.random() * images.length)] || fallback;
};

const HOUSE_CODES = [
  { num: '01', title: 'New In', description: 'Fresh arrivals that sharpen the collection and give customers a real reason to return.', link: '/shop?collection=new' },
  { num: '02', title: 'Ceremony', description: 'Crisp button-downs for ceremony, work, and clean everyday dressing.', link: '/shop?category=מכופתרת' },
  { num: '03', title: 'Tailoring', description: 'Clean lines, measured proportions, and quiet presence for a sharper wardrobe.', link: '/shop?category=חליפות' },
  { num: '04', title: 'Sale', description: 'A considered sale edit that still feels premium, ordered, and intentional.', link: '/shop?sale=true' },
];

function ProductCard({ product, priority = false }) {
  const { i18n } = useTranslation();
  const t = useMemo(() => i18n.getFixedT('en'), [i18n]);

  return (
    <Link to={`/product/${product._id}`} className={`group block motion-lift ${priority ? 'sm:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-surface ${priority ? 'aspect-[5/4]' : 'aspect-[3/4]'}`}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="motion-image h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '54px' }}>checkroom</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-0 items-center justify-between bg-[linear-gradient(180deg,transparent_0%,rgba(10,15,30,0.7)_100%)] px-4 py-4 opacity-100 transition-all duration-300 md:translate-y-6 md:px-6 md:py-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <span className="font-['Manrope'] text-[0.54rem] uppercase tracking-[0.18rem] text-white md:text-[0.6rem] md:tracking-[0.28rem]">{t('common.viewProduct')}</span>
          <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>north_west</span>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 md:mt-5 md:gap-4">
        <div className="min-w-0">
          <p className="font-['Manrope'] text-[0.5rem] uppercase tracking-[0.18rem] text-on-surface-variant md:text-[0.55rem] md:tracking-[0.32rem]">{product.category}</p>
          <h3 className="mt-2 font-['Noto_Serif'] text-lg tracking-[-0.03em] text-on-surface md:text-xl">{product.name}</h3>
        </div>
        <div className="shrink-0 text-left">
          {product.salePrice ? (
            <>
              <p className="font-['Noto_Serif'] text-base text-on-surface md:text-lg">₪{product.salePrice}</p>
              <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.12rem] text-on-surface-variant line-through md:text-[0.6rem] md:tracking-[0.18rem]">₪{product.price}</p>
            </>
          ) : (
            <p className="font-['Noto_Serif'] text-base text-on-surface md:text-lg">₪{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { i18n } = useTranslation();
  const t = useMemo(() => i18n.getFixedT('en'), [i18n]);
  const [featured, setFeatured]           = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [saleSelection, setSaleSelection] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [campaignImages, setCampaignImages] = useState({});

  // Section refs
  const heroRef  = useRef(null);
  const storyRef = useRef(null);
  const pageRef  = useScrollReveal([loadingFeatured]);

  // Hero GSAP refs
  const heroImgRef          = useRef(null);
  const heroCopyRef         = useRef(null);
  const heroLine1Ref        = useRef(null);
  const heroLine2Ref        = useRef(null);
  const heroKickerRef       = useRef(null);
  const heroBodyRef         = useRef(null);
  const heroHandRef         = useRef(null);
  const heroCtaRef          = useRef(null);
  const momentKickerRef     = useRef(null);
  const momentTitleRef      = useRef(null);
  const momentBodyRef       = useRef(null);
  const momentCtaRef        = useRef(null);
  const scrollProgressRef   = useRef(null);

  const storyVisualRef      = useRef(null);
  const storyImgRefs        = useRef([]);
  const storyCardRefs       = useRef([]);
  const storyProgressBarRef = useRef(null);
  const storyChapterRef     = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, collectionRes, saleRes, campaignRes] = await Promise.all([
          api.get('/products', { params: { featured: true } }),
          api.get('/products', { params: { collection: 'new' } }),
          api.get('/products', { params: { sale: true } }),
          api.get('/homepage-images'),
        ]);
        setFeatured(featuredRes.data.slice(0, 3));
        setNewCollection(collectionRes.data.slice(0, 4));
        setSaleSelection(saleRes.data.slice(0, 3));
        setCampaignImages(campaignRes.data || {});
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
  const storyProducts = useMemo(
    () => [newCollection[0], featured[0], featured[1] || saleSelection[0]].filter(Boolean),
    [featured, newCollection, saleSelection]
  );
  const selectedCampaignImages = useMemo(
    () => ({
      hero: pickRandomImage(campaignImages.hero, heroImage),
      collectionStory: pickRandomImage(campaignImages.collectionStory),
      lookbookWorkday: pickRandomImage(campaignImages.lookbookWorkday),
      lookbookEvening: pickRandomImage(campaignImages.lookbookEvening),
      lookbookEvent: pickRandomImage(campaignImages.lookbookEvent),
    }),
    [campaignImages]
  );
  const storySteps = useMemo(
    () => [
      {
        num: '01',
        title: 'New In',
        hand: t('home.story.newIn.hand'),
        text: t('home.story.newIn.text'),
        link: '/shop?collection=new',
        cta: t('home.story.newIn.cta'),
        product: storyProducts[0],
      },
      {
        num: '02',
        title: 'Ceremony',
        hand: t('home.story.ceremony.hand'),
        text: t('home.story.ceremony.text'),
        link: '/shop?category=מכופתרת',
        cta: t('home.story.ceremony.cta'),
        product: storyProducts[1],
      },
      {
        num: '03',
        title: 'Tailoring',
        hand: t('home.story.tailoring.hand'),
        text: t('home.story.tailoring.text'),
        link: '/shop?category=חליפות',
        cta: t('home.story.tailoring.cta'),
        product: storyProducts[2],
      },
    ],
    [storyProducts, t]
  );

  // ── GSAP: Hero (runs once on mount) ──────────────────────────────────────
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      // Animations fire when each section enters the viewport — works on both
      // desktop (text is visible at load → triggers immediately) and mobile
      // (text is below the image → triggers when user scrolls down).
      const onView = (target, fromState, toState) => {
        if (!target) return;
        const triggerEl = Array.isArray(target) ? target[0] : target;
        if (!triggerEl) return;
        gsap.fromTo(target, fromState, {
          ...toState,
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        });
      };

      // Kicker clip reveal
      onView(
        heroKickerRef.current,
        { yPercent: 105, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
      );

      // Title lines: luxury clip reveal (each line rises from below)
      if (heroLine1Ref.current && heroLine2Ref.current) {
        onView(
          [heroLine1Ref.current, heroLine2Ref.current],
          { yPercent: 108, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: 0.14, ease: 'power4.out' }
        );
      }

      // Body text, hand text, CTA fade up
      const heroExtras = [
        heroBodyRef.current,
        heroHandRef.current,
        heroCtaRef.current,
      ].filter(Boolean);
      if (heroExtras.length) {
        onView(
          heroExtras,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
        );
      }

      // Moment block (lower in the hero on mobile) — separate trigger
      const moments = [
        momentKickerRef.current,
        momentTitleRef.current,
        momentBodyRef.current,
        momentCtaRef.current,
      ].filter(Boolean);
      if (moments.length) {
        onView(
          moments,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
        );
      }
    }

    // No scroll parallax on the img itself — keeps it sharp (no GPU layer)

    if (heroCopyRef.current) {
      gsap.to(heroCopyRef.current, {
        y: -55,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '22% top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }

    // Scroll progress bar
    if (scrollProgressRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          if (scrollProgressRef.current) {
            scrollProgressRef.current.style.transform = `scaleY(${self.progress})`;
          }
        },
      });
    }
  }, { scope: pageRef });

  // ── GSAP: Story pin + product grids (after data loads) ───────────────────
  useGSAP(() => {
    if (loadingFeatured) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disablePinnedStory = true;

    // Story visual: clip-path cinematic reveal as it enters viewport
    if (!reduced && storyVisualRef.current) {
      gsap.fromTo(
        storyVisualRef.current,
        { clipPath: 'inset(18% 7% 12% 7%)', scale: 1.04 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%', once: true },
        }
      );
    }

    // Story pin — desktop only
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      if (disablePinnedStory || reduced) return;
      const imgs  = storyImgRefs.current.filter(Boolean);
      const cards = storyCardRefs.current.filter(Boolean);
      if (imgs.length < 2 || cards.length < 2) return;

      gsap.set(imgs.slice(1), { autoAlpha: 0 });
      gsap.set(cards.slice(1), { autoAlpha: 0.38, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          pin: true,
          start: 'top top',
          end: '+=250%',
          scrub: 1.2,
          onUpdate: (self) => {
            if (storyProgressBarRef.current) {
              storyProgressBarRef.current.style.width = `${self.progress * 100}%`;
            }
            if (storyChapterRef.current) {
              const idx = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
              const prefix = storyChapterRef.current.dataset.prefix || '';
              storyChapterRef.current.textContent = `${prefix} 0${idx + 1}`;
            }
          },
        },
      });

      // Hold step 0
      tl.to({}, { duration: 0.6 });

      // Step 0 → 1
      if (imgs[1] && cards[1]) {
        tl.to(cards[0],  { autoAlpha: 0.38, duration: 0.35 },        0.6)
          .to(imgs[0],   { autoAlpha: 0,    duration: 0.4  },        0.65)
          .to(imgs[1],   { autoAlpha: 1,    duration: 0.4  },        0.78)
          .to(cards[1],  { autoAlpha: 1, y: 0, duration: 0.5 },      0.82);
      }

      // Hold step 1
      tl.to({}, { duration: 0.6 }, 1.4);

      // Step 1 → 2
      if (imgs[2] && cards[2]) {
        tl.to(cards[1],  { autoAlpha: 0.38, duration: 0.35 },        2.0)
          .to(imgs[1],   { autoAlpha: 0,    duration: 0.4  },        2.05)
          .to(imgs[2],   { autoAlpha: 1,    duration: 0.4  },        2.18)
          .to(cards[2],  { autoAlpha: 1, y: 0, duration: 0.5 },      2.22);
      }

      // Hold step 2
      tl.to({}, { duration: 0.4 }, 2.7);
    });

    // Product card batch reveal — only cards well below the fold at load time
    if (!reduced) {
      const allCards = [...document.querySelectorAll('.product-card')];
      const vh = window.innerHeight;
      // Skip cards that are already visible or close to visible (e.g. Lookbook)
      const cardsToAnimate = allCards.filter(
        (el) => el.getBoundingClientRect().top > vh * 1.1
      );
      if (cardsToAnimate.length) {
        gsap.set(cardsToAnimate, { autoAlpha: 0, y: 58, scale: 0.97 });
        ScrollTrigger.batch(cardsToAnimate, {
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              stagger: 0.09,
            }),
          start: 'top 90%',
          once: true,
        });
      }
    }

    ScrollTrigger.refresh();
  }, { scope: pageRef, dependencies: [loadingFeatured] });

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen bg-background">
      <main>


        {/* ── Hero — panel-in-panel: cream outer → navy slab + terracotta accents ── */}
        <section ref={heroRef} className="cinematic-hero relative overflow-hidden bg-background px-4 pb-6 pt-28 text-navy-deep sm:pt-32 md:px-8 lg:min-h-screen lg:px-10 lg:pt-36">
          <div className="mx-auto grid min-h-0 max-w-[1800px] gap-4 lg:min-h-[calc(100vh-10rem)] lg:grid-cols-[1.18fr_0.82fr]">
            <div className="relative min-h-[46vh] overflow-hidden border border-slate/30 bg-sand sm:min-h-[54vh] lg:min-h-0">
              {/* Render only after API responds — prevents flash of stale local image */}
              {!loadingFeatured && (
                <img
                  ref={heroImgRef}
                  key={selectedCampaignImages.hero}
                  src={selectedCampaignImages.hero}
                  alt="Dream and Work Campaign"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              )}
              {/* Subtle dark wash only at the very bottom — for label legibility, image stays clear */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,rgba(19,36,58,0.55)_0%,rgba(19,36,58,0)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 border-t border-white/25 pt-4 text-white/55 md:bottom-6 md:left-6 md:right-6 md:gap-4 md:pt-5">
                <span className="font-['Manrope'] text-[0.48rem] uppercase tracking-[0.18rem] md:text-[0.5rem] md:tracking-[0.32rem]">{t('home.heroKicker')}</span>
                <span className="editorial-hand text-base text-terracotta-soft">Campaign Panel</span>
              </div>
            </div>

            <div ref={heroCopyRef} className="grid gap-4">
              {/* Inner panel: navy slab with depth gradient — inline style forces render
                  regardless of Tailwind JIT class generation on production builds */}
              <div
                className="flex min-h-[28rem] items-center border border-navy-deep/30 px-5 py-8 sm:min-h-[34rem] md:px-10 md:py-10 lg:px-12"
                style={{ background: 'linear-gradient(135deg, #121211 0%, #121211 100%)' }}
              >
                {/* Frame-within-frame: thin taupe-tinted inner border */}
                <div className="px-3 py-3 md:px-5 md:py-5" style={{ border: '1px solid rgba(138,129,117,0.22)' }}>
                  <div className="max-w-xl" style={{ color: '#F3F1ED' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p
                        ref={heroKickerRef}
                        className="font-['Manrope'] text-[0.5rem] uppercase tracking-[0.28rem] sm:text-[0.55rem] sm:tracking-[0.55rem]"
                        style={{ color: '#B8B2A7' }}
                      >
                        {t('home.heroKicker')}
                      </p>
                    </div>
                    {/* Micro-rule between kicker and headline */}
                    <div className="mt-4 h-px w-[64px]" style={{ backgroundColor: 'rgba(138,129,117,0.7)' }} />
                    <h1
                      className="mt-3 font-['Noto_Serif'] leading-[1.0] tracking-[-0.03em]"
                      style={{ fontSize: 'clamp(3rem, 5.4vw, 6.6rem)', color: '#F3F1ED' }}
                    >
                      <span style={{ display: 'block', overflow: 'hidden' }}>
                        <span ref={heroLine1Ref} style={{ display: 'block' }}>{t('home.heroTitleLine1')}</span>
                      </span>
                      <span style={{ display: 'block', overflow: 'hidden' }}>
                        <span ref={heroLine2Ref} style={{ display: 'block' }}>{t('home.heroTitleLine2')}</span>
                      </span>
                    </h1>
                    <p
                      ref={heroBodyRef}
                      className="mt-6 max-w-sm font-['Manrope'] text-sm leading-7"
                      style={{ color: 'rgba(243,241,237,0.88)' }}
                    >
                      {t('home.heroBody')}
                    </p>
                    {/* Soft fade-out rule between body copy and hand line */}
                    <div
                      className="mt-5"
                      style={{
                        height: '1px',
                        width: '120px',
                        background: 'linear-gradient(to right, transparent, rgba(138,129,117,0.7), transparent)',
                      }}
                    />
                    <p
                      ref={heroHandRef}
                      className="editorial-hand mt-3 text-2xl sm:text-3xl md:text-4xl"
                      style={{ color: '#B8B2A7' }}
                    >
                      {t('home.heroHand')}
                    </p>
                    <div ref={heroCtaRef} className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-5">
                      <Link
                        to="/shop?collection=new"
                        className="motion-cta px-7 py-4 font-['Manrope'] text-[0.56rem] uppercase tracking-[0.22rem] transition-all duration-300 sm:px-9 sm:text-[0.6rem] sm:tracking-[0.34rem]"
                        style={{ border: '1px solid #8A8175', color: '#F3F1ED' }}
                      >
                        {t('home.newArrivals')}
                      </Link>
                      <Link
                        to="/shop"
                        className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.34rem] transition-colors duration-300"
                        style={{ color: 'rgba(243,241,237,0.65)' }}
                      >
                        {t('home.discover')} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                {/* Sand panel — taupe top-cap pairs visually with CTA's side stripe */}
                <div
                  className="p-6"
                  style={{
                    backgroundColor: '#FBFAF7',
                    border: '1px solid rgba(154,149,140,0.3)',
                    borderTop: '4px solid rgba(138,129,117,0.5)',
                  }}
                >
                  <p
                    ref={momentKickerRef}
                    className="font-['Manrope'] text-[0.52rem] uppercase tracking-[0.32rem]"
                    style={{ color: '#8A8175' }}
                  >
                    Every moment
                  </p>
                  <h2
                    ref={momentTitleRef}
                    className="mt-4 font-['Noto_Serif'] text-3xl tracking-[-0.05em] md:text-4xl"
                    style={{ color: '#121211' }}
                  >
                    Panels that can change with every campaign.
                  </h2>
                  <p
                    ref={momentBodyRef}
                    className="mt-4 text-sm leading-7"
                    style={{ color: '#6E6A62' }}
                  >
                    Hero and lookbook imagery are now campaign-controlled, while the layout keeps every visual the same size.
                  </p>
                </div>
                {/* Terracotta CTA panel with side stripe + inner cream-tinted frame */}
                <div
                  ref={momentCtaRef}
                  className="flex flex-col justify-between p-6"
                  style={{
                    backgroundColor: '#8A8175',
                    border: '1px solid rgba(98,92,81,0.5)',
                    borderLeft: '4px solid #625C51',
                    color: '#F3F1ED',
                  }}
                >
                  <div className="p-4" style={{ border: '1px solid rgba(243,241,237,0.28)' }}>
                    <p
                      className="font-['Manrope'] text-[0.52rem] uppercase tracking-[0.32rem]"
                      style={{ color: 'rgba(243,241,237,0.9)' }}
                    >
                      Lookbook Ready
                    </p>
                  </div>
                  <Link to="/shop" className="mt-10 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.28rem]">
                    Enter the collection →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 top-0 w-px bg-white/10">
            <div
              ref={scrollProgressRef}
              className="h-full w-full bg-gold"
              style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
            />
          </div>
        </section>

        {/* Editorial section break — magazine-style label between hero and marquee */}
        <div className="px-4 md:px-8 lg:px-10" style={{ backgroundColor: '#F3F1ED' }}>
          <div className="mx-auto flex max-w-[1800px] items-center gap-3 py-3">
            <span className="h-px flex-1" style={{ backgroundColor: 'rgba(138,129,117,0.4)' }} />
            <span
              className="font-['Manrope'] text-[0.5rem] uppercase tracking-[0.3rem]"
              style={{ color: '#625C51' }}
            >
              Monochrome Edit
            </span>
            <span className="h-px flex-1" style={{ backgroundColor: 'rgba(11,11,11,0.18)' }} />
          </div>
        </div>

        <Marquee dark />

        <section className="lookbook-cinema reveal bg-background px-4 py-4 md:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1800px] gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lookbook-copy-panel border border-white/12 bg-[#0F0F0D] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
              <p className="editorial-kicker text-[#8A8175]">{t('home.lookbook.kicker')}</p>
              <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#F3F1ED] md:text-5xl">
                Every Moment
              </h2>
              <p className="editorial-hand mt-2 text-2xl text-[#B8B2A7]">curated for you</p>
              <p className="lookbook-copy mt-4 max-w-sm text-sm leading-7 text-[#B8B2A7]">
                A compact campaign grid for workday, evening, and event dressing.
              </p>
              <Link to="/shop" className="mt-8 inline-flex font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#F3F1ED] link-gold">
                View the lookbook →
              </Link>
            </div>

            <div className="lookbook-card-grid grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Workday', sub: 'Sharp focused tailoring', product: storyProducts[0], image: selectedCampaignImages.lookbookWorkday },
                { label: 'Evening', sub: 'Understated after-dark elegance', product: storyProducts[1], image: selectedCampaignImages.lookbookEvening },
                { label: 'Event', sub: 'Presence. Confidence. Timeless.', product: storyProducts[2], image: selectedCampaignImages.lookbookEvent },
              ].map((item, index) => (
                <Link
                  key={item.label}
                  to={item.product?._id ? `/product/${item.product._id}` : '/shop'}
                  className="lookbook-card reveal-scale group block overflow-hidden border border-outline-variant bg-primary text-white"
                  style={{ '--lookbook-delay': `${index * 160}ms` }}
                >
                  <div className="lookbook-media relative aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image || item.product?.images?.[0] || heroImage}
                      alt={item.product?.name || item.label}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(11,11,11,0.86)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                      <p className="font-['Manrope'] text-[0.52rem] uppercase tracking-[0.3rem] text-white/45">0{index + 1}</p>
                      <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.05em]">{item.label}</h3>
                      <p className="editorial-hand mt-2 text-lg text-white/65">{item.sub}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-4 py-4 md:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1800px] grid-cols-2 border-y border-white/10 text-white/70 md:grid-cols-4">
            {[
              ['Complimentary shipping', 'For qualifying orders'],
              ['Easy returns', 'Clear policy and support'],
              ['Personal styling', 'Fit guidance when needed'],
              ['Secure payments', 'Protected checkout flow'],
            ].map(([title, text]) => (
              <div key={title} className="border-white/10 px-4 py-5 md:border-l md:px-6">
                <p className="editorial-hand text-lg text-gold sm:text-xl">{title}</p>
                <p className="mt-1 text-xs text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="hidden">

        {/* Gradient bridge: cream → story dark */}
        {/* ── Story (pinned on desktop) ── */}
        <section ref={storyRef} className="pinned-story bg-primary px-6 py-24 text-white md:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div className="pinned-story-panel flex items-center">
              <div className="w-full">
                <p className="editorial-kicker text-white/35">{t('home.collectionStory')}</p>
                <div
                  ref={storyVisualRef}
                  className="relative mt-8 overflow-hidden bg-white/5 gallery-frame"
                  style={{ height: '62vh', minHeight: 420 }}
                >
                  {storySteps.map((step, i) => (
                    <img
                      key={i}
                      ref={el => { storyImgRefs.current[i] = el; }}
                      src={selectedCampaignImages.collectionStory || step.product?.images?.[0] || heroImage}
                      alt={step.product?.name || step.title || 'Dream and Work collection'}
                      className={`absolute inset-0 h-full w-full object-cover motion-image ${i === 0 ? '' : 'opacity-0'}`}
                    />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p
                    ref={storyChapterRef}
                    data-prefix={t('home.scrollChapter')}
                    className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.24rem] text-white/35"
                  >
                    {t('home.scrollChapter')} 01
                  </p>
                  <div className="h-px flex-1 bg-white/10">
                    <div ref={storyProgressBarRef} className="h-full bg-white/55" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12 lg:py-20">
              {storySteps.map((step, index) => (
                <article key={step.title} className="story-step flex items-center">
                  <div
                    ref={el => { storyCardRefs.current[index] = el; }}
                    className="story-step-card"
                    style={index === 0 ? { opacity: 1, transform: 'translateY(0)' } : {}}
                  >
                    <p className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.32rem] text-white/35">{step.num}</p>
                    <h2 className="mt-5 font-['Noto_Serif'] text-5xl tracking-[-0.05em] text-white md:text-7xl">
                      {t(`home.story.${index === 0 ? 'newIn' : index === 1 ? 'ceremony' : 'tailoring'}.title`)}
                    </h2>
                    <p className="editorial-hand mt-4 text-4xl text-white/50">{step.hand}</p>
                    <p className="mt-8 max-w-md text-sm leading-8 text-white/60 md:text-base">{step.text}</p>
                    {step.product && (
                      <p className="mt-6 font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-white/35">
                        {t('home.featuring')} {step.product.name}
                      </p>
                    )}
                    <Link
                      to={step.link}
                      className="motion-cta mt-10 inline-flex border border-white/25 px-8 py-4 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.28rem] text-white transition-colors hover:bg-white hover:text-primary"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lookbook ── */}
        <section className="bg-background px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="reveal mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="editorial-kicker text-on-surface-variant">{t('home.lookbook.kicker')}</p>
                <h2 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-6xl">
                  {t('home.lookbook.title')}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-8 text-on-surface-variant md:text-base">
                {t('home.lookbook.text')}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { label: t('home.lookbook.cards.first'), product: storyProducts[0], image: selectedCampaignImages.lookbookWorkday },
                { label: t('home.lookbook.cards.second'), product: storyProducts[1], image: selectedCampaignImages.lookbookEvening },
                { label: t('home.lookbook.cards.third'), product: storyProducts[2], image: selectedCampaignImages.lookbookEvent },
              ].map((item, index) => (
                <Link
                  key={item.label}
                  to={item.product?._id ? `/product/${item.product._id}` : '/shop'}
                  className="product-card group motion-lift block overflow-hidden border border-outline-variant bg-primary text-white"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image || item.product?.images?.[0] || heroImage}
                      alt={item.product?.name || item.label}
                      className="motion-image h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(11,11,11,0.82)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-['Manrope'] text-[0.56rem] uppercase tracking-[0.32rem] text-white/45">0{index + 1}</p>
                      <h3 className="mt-2 font-['Noto_Serif'] text-3xl tracking-[-0.05em]">{item.label}</h3>
                      {item.product && <p className="mt-3 text-xs uppercase tracking-[0.2rem] text-white/50">{item.product.name}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── House Codes ── */}
        <section className="py-24">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="reveal mb-12 flex items-end justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">{t('home.houseCodes')}</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-on-surface md:text-4xl">
                  {t('home.houseTitle')}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4">
            {HOUSE_CODES.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="reveal-scale group relative flex h-56 flex-col justify-between overflow-hidden border border-primary/20 bg-primary px-4 py-5 transition-all duration-500 hover:bg-charcoal sm:h-64 sm:px-6 sm:py-6 md:h-80 md:px-8 md:py-8 motion-lift"
              >
                <span className="font-['Manrope'] text-[0.5rem] uppercase tracking-[0.45rem] text-on-primary/30">{item.num}</span>
                <div>
                  <p className="font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-on-primary md:text-5xl">{item.title}</p>
                  <p className="mt-3 text-xs leading-6 text-on-primary/55 line-clamp-2">{item.description}</p>
                  <span className="mt-5 inline-flex font-['Manrope'] text-[0.55rem] uppercase tracking-[0.3rem] text-on-primary/35 transition-all duration-300 group-hover:text-on-primary/70">
                    {t('home.enter')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Marquee (light) ── */}
        <Marquee />

        {/* ── Spotlight ── */}
        {spotlight && (
          <section className="py-24">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-20">
              <div className="reveal mb-10">
                <p className="editorial-kicker text-on-surface-variant">{t('home.spotlight')}</p>
              </div>
            </div>
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-20">
              <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[600px]">
                  {spotlight.images?.[0] ? (
                    <img src={spotlight.images[0]} alt={spotlight.name} className="motion-image h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline" style={{ fontSize: '72px' }}>checkroom</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center bg-surface px-6 py-10 sm:px-10 sm:py-14 md:px-14">
                  <p className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.4rem] text-on-surface-variant">{t('home.newArrivals')}</p>
                  <h2 className="mt-5 font-['Noto_Serif'] text-4xl leading-tight tracking-[-0.04em] text-on-surface md:text-5xl">{spotlight.name}</h2>
                  <p className="editorial-hand mt-3 text-3xl text-on-surface-variant">{t('home.selectedWithIntent')}</p>
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
                    {spotlight.description || t('home.fallbackDescription')}
                  </p>
                  <div className="mt-10 flex flex-col gap-4">
                    <Link to={`/product/${spotlight._id}`} className="editorial-button motion-cta self-start">{t('common.viewProduct')}</Link>
                    <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.26rem] text-on-surface-variant link-gold">{t('home.viewAllNew')} →</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── The House Edit ── */}
        <section className="px-4 py-20 sm:px-6 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="reveal mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">{t('home.houseEdit')}</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">{t('home.houseEditTitle')}</h2>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <Link to="/shop?category=מכופתרת" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">{t('home.groomLink')} →</Link>
                <Link to="/shop?category=חליפות" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">{t('home.formalLink')} →</Link>
                <Link to="/shop?category=מכנסיים" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-on-surface-variant link-gold">{t('home.casualLink')} →</Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
              {featured.map((product, index) => (
                <div key={product._id} className="product-card">
                  <ProductCard product={product} priority={index === 0} />
                </div>
              ))}
              {!loadingFeatured && featured.length === 0 && (
                <div className="reveal md:col-span-3 bg-surface p-10 text-center">
                  <p className="editorial-kicker text-on-surface-variant">{t('home.emptyFeatured')}</p>
                  <Link to="/shop" className="mt-6 inline-flex font-['Noto_Serif'] text-2xl text-on-surface">{t('home.fullCollection')}</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Editorial Note ── */}
        <section className="px-4 py-20 sm:px-6 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1600px] bg-primary px-6 py-12 sm:px-10 sm:py-16 md:px-16 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div className="reveal-left">
              <p className="editorial-kicker text-white/40">{t('home.editorialNote')}</p>
              <h2 className="mt-5 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-white md:text-5xl">{t('home.editorialTitle')}</h2>
            </div>
            <blockquote className="reveal-right mt-8 font-['Noto_Serif'] text-2xl leading-snug text-white/70 md:text-4xl">{t('home.editorialQuote')}</blockquote>
            <p className="reveal-right editorial-hand mt-8 text-4xl text-white/50">Dream & Work</p>
          </div>
        </section>

        {/* ── New Collection ── */}
        <section className="px-4 py-20 sm:px-6 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="reveal mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker text-on-surface-variant">{t('home.newCollection')}</p>
                <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">{t('home.freshArrivals')}</h2>
              </div>
              <Link to="/shop?collection=new" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.26rem] text-on-surface link-gold">{t('home.viewAllNew')}</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              {newCollection.map((product) => (
                <div key={product._id} className="product-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sale ── */}
        {saleSelection.length > 0 && (
          <section className="px-4 pb-24 sm:px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1600px]">
              <div className="reveal mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="editorial-kicker text-on-surface-variant">{t('home.privateSale')}</p>
                  <h2 className="mt-3 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-on-surface md:text-5xl">{t('home.saleTitle')}</h2>
                </div>
                <Link to="/shop?sale=true" className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.26rem] text-on-surface link-gold">{t('home.viewSale')}</Link>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-6">
                {saleSelection.map((product) => (
                  <div key={product._id} className="product-card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 pb-24 sm:px-6 md:px-12 lg:px-20" dir="rtl" aria-labelledby="service-actions-title">
          <div className="mx-auto grid max-w-[1600px] gap-8 border-y border-outline-variant py-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="editorial-kicker text-on-surface-variant">Customer Care</p>
              <h2 id="service-actions-title" className="mt-3 font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-on-surface">
                צריכים לבטל עסקה או לבדוק מדיניות החזרה?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
                ריכזנו את דרכי הביטול וההחזרה בעמוד מסודר, בלי להעמיס על תהליך הקנייה.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/cancel-order" className="editorial-button motion-cta text-center">ביטול עסקה</Link>
              <Link to="/legal/returns" className="editorial-button-secondary motion-cta text-center">מדיניות מלאה</Link>
            </div>
          </div>
        </section>

        </div>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
}
