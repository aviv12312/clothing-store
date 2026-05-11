const ITEMS = [
  'DREAM & WORK',
  '✦',
  'SPRING SUMMER 2026',
  '✦',
  'EDITORIAL MENSWEAR',
  '✦',
  'NEW COLLECTION',
  '✦',
  'QUIET LUXURY',
  '✦',
  'MADE WITH INTENTION',
  '✦',
];

export default function Marquee({ dark = false }) {
  const text = [...ITEMS, ...ITEMS]; // כפול כדי שיראה רציף

  return (
    <div className={`marquee-wrap border-y py-4 ${dark ? 'bg-primary border-primary/80 text-on-primary' : 'bg-background border-outline-variant text-on-surface'}`}>
      <div className="marquee-track">
        {text.map((item, i) => (
          <span
            key={i}
            className="mx-8 font-['Manrope'] text-[0.6rem] uppercase tracking-[0.35rem]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
