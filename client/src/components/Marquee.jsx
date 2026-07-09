import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ITEMS = [
  'DREAM & WORK', '*', 'SPRING SUMMER 2026', '*',
  'EDITORIAL MENSWEAR', '*', 'NEW COLLECTION', '*',
  'QUIET LUXURY', '*', 'MADE WITH INTENTION', '*', 'TEL-AVIV','*',
];

const GROUP_ITEMS = [...ITEMS, ...ITEMS];
const GROUPS = [0, 1, 2];

export default function Marquee({ dark = false }) {
  const wrapRef  = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !trackRef.current) return;

    gsap.killTweensOf(trackRef.current);
    gsap.fromTo(
      trackRef.current,
      { xPercent: 0 },
      {
        xPercent: -33.3333,
        repeat: -1,
        duration: 32.5,
        ease: 'none',
        overwrite: true,
      }
    );
  }, { scope: wrapRef });

  const itemClass = `inline-flex shrink-0 px-7 font-['Manrope'] text-[0.75rem] font-medium uppercase tracking-[0.4em] whitespace-nowrap ${
    dark ? 'text-white/30' : 'text-on-surface-variant'
  }`;

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden border-y py-5 ${dark ? 'bg-primary border-white/10' : 'bg-background border-outline-variant'}`}
      dir="ltr"
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{ willChange: 'transform' }}
      >
        {GROUPS.map((group) => (
          <div key={group} className="flex shrink-0 items-center" style={{ minWidth: '100vw' }}>
            {GROUP_ITEMS.map((item, i) => (
              <span key={`${group}-${item}-${i}`} className={itemClass}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
