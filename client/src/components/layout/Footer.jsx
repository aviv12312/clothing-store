import { Link } from 'react-router-dom';

// Each link in the footer has its own purpose; no two links share both label AND
// destination. Items routed to /contact are placeholders (pages not yet built).
const SITEMAP_LINKS = [
  { label: 'חנות',              to: '/shop' },
  { label: 'מעקב הזמנות',       to: '/profile' },
  { label: 'ביטול עסקה',        to: '/cancel-order' },
  { label: 'צור קשר',           to: '/contact' },
];

const SERVICE_LINKS = [
  { label: 'משלוחים והחזרות',   to: '/legal/returns' },
  { label: 'תקנון החנות',       to: '/legal/terms' },
  { label: 'מדיניות פרטיות',    to: '/legal/privacy' },
  { label: 'הצהרת נגישות',      to: '/legal/accessibility' },
];

const ATELIER_LINKS = [
  { label: 'פגישה אישית',       to: '/contact' },
  { label: 'שאלות נפוצות',      to: '/contact' },
  { label: 'מדריך מידות',       to: '/contact' },
  { label: 'Instagram',         to: '#' },
];

const LEGAL_LINKS = [
  { label: 'תקנון',   to: '/legal/terms' },
  { label: 'פרטיות',  to: '/legal/privacy' },
  { label: 'נגישות',  to: '/legal/accessibility' },
];

const LINK_CLASS =
  "block font-['Manrope'] text-[0.82rem] leading-[2.1] text-[#F4EDE0]/50 transition-colors duration-200 hover:text-[#F4EDE0]/90";

const HEADING_CLASS =
  "font-['Manrope'] text-[0.52rem] uppercase tracking-[0.34rem] text-[#C47A5C]/85 mb-4";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      style={{ backgroundColor: '#13243A' }}
      aria-labelledby="footer-brand"
    >
      {/* ── Main columns ── */}
      <div className="mx-auto grid max-w-[1600px] gap-10 px-8 pt-12 pb-8 md:px-12 lg:px-20
                      md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

        {/* Brand block */}
        <div>
          <h2
            id="footer-brand"
            style={{ fontFamily: 'Olondona, serif', letterSpacing: '0.08em', lineHeight: 1 }}
            className="text-[1.9rem] text-[#F4EDE0]"
            dir="ltr"
          >
            Dream &amp; Work
          </h2>
          <p className="mt-4 font-['Manrope'] text-[0.8rem] leading-6 text-[#F4EDE0]/45 max-w-[18rem]" dir="rtl">
            בית אופנה ישראלי המתמחה בלבוש מחויט לחתנים, מלווים וגברים שאוהבים את הפרטים.
          </p>
        </div>

        {/* מפת אתר */}
        <nav aria-labelledby="footer-col-sitemap">
          <h3 id="footer-col-sitemap" className={HEADING_CLASS}>מפת אתר</h3>
          <ul className="space-y-0">
            {SITEMAP_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className={LINK_CLASS}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* מידע ותקנון */}
        <nav aria-labelledby="footer-col-policy">
          <h3 id="footer-col-policy" className={HEADING_CLASS}>מידע ותקנון</h3>
          <ul className="space-y-0">
            {SERVICE_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className={LINK_CLASS}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* שירות לקוחות */}
        <nav aria-labelledby="footer-col-service">
          <h3 id="footer-col-service" className={HEADING_CLASS}>שירות לקוחות</h3>
          <ul className="space-y-0">
            {ATELIER_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className={LINK_CLASS}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Legal bar ── */}
      <div style={{ borderTop: '1px solid rgba(244,237,224,0.1)' }}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-8 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((item, i) => (
              <span key={item.to} className="flex items-center gap-4">
                <Link
                  to={item.to}
                  className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.2rem] text-[#F4EDE0]/25 hover:text-[#F4EDE0]/55 transition-colors"
                >
                  {item.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-[#F4EDE0]/15 text-[0.5rem]">·</span>
                )}
              </span>
            ))}
          </div>
          <p
            className="font-['Manrope'] text-[0.55rem] uppercase tracking-[0.22rem] text-[#F4EDE0]/22"
            dir="ltr"
          >
            DREAM AND WORK &nbsp;·&nbsp; TEL AVIV 2026 &nbsp;&copy;
          </p>
        </div>
      </div>
    </footer>
  );
}
