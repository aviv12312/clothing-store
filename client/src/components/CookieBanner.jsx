import { useState } from 'react';

const COOKIE_KEY = 'dw_cookie_consent';

const buildConsentPayload = ({ analytics, marketing }) => ({
  essential: true,
  analytics,
  marketing,
  ts: new Date().toISOString(),
});

const shouldShowBanner = () => !localStorage.getItem(COOKIE_KEY);

export default function CookieBanner() {
  const [visible, setVisible] = useState(shouldShowBanner);
  const [showDetails, setShowDetails] = useState(false);
  const [choices, setChoices] = useState({ analytics: false, marketing: false });

  const applyConsent = ({ analytics, marketing }) => {
    window.gtag?.('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
    });

    window.fbq?.('consent', marketing ? 'grant' : 'revoke');

    document.querySelectorAll('script[data-consent-required]').forEach((el) => {
      const category = el.getAttribute('data-consent-category') || 'marketing';
      if ((category === 'analytics' && !analytics) || (category === 'marketing' && !marketing)) return;

      const src = el.getAttribute('data-src');
      if (!src || document.querySelector(`script[src="${src}"]`)) return;

      const script = document.createElement('script');
      script.src = src;
      document.head.appendChild(script);
    });
  };

  const saveConsent = (nextChoices) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(buildConsentPayload(nextChoices)));
    applyConsent(nextChoices);
    window.dispatchEvent(new Event('dw-cookie-consent-change'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-[#13243A] text-white shadow-2xl" dir="rtl">
      <div className="mx-auto max-w-6xl px-6 py-5">
        {!showDetails ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="flex-1 font-['Manrope'] text-sm leading-relaxed text-[#EFE7D6]">
              אנו משתמשים בעוגיות הכרחיות לתפעול האתר. אנליטיקה ושיווק יופעלו רק לאחר אישורך.{' '}
              <button onClick={() => setShowDetails(true)} className="underline text-[#C47A5C] hover:opacity-80">
                מידע נוסף
              </button>
            </p>

            <div className="flex flex-shrink-0 flex-wrap gap-3">
              <button onClick={() => setShowDetails(true)} className="border border-[#5A6B7F] px-5 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.15rem] text-[#CDBFA1] transition-colors hover:border-white hover:text-white">
                התאמה אישית
              </button>
              <button onClick={() => saveConsent({ analytics: false, marketing: false })} className="border border-[#5A6B7F] px-5 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.15rem] text-[#CDBFA1] transition-colors hover:border-white hover:text-white">
                הכרחיות בלבד
              </button>
              <button onClick={() => saveConsent({ analytics: true, marketing: true })} className="bg-[#C47A5C] px-6 py-2.5 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.15rem] text-[#13243A] transition-opacity hover:opacity-90">
                אישור הכל
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-['Noto_Serif'] text-lg">הגדרות עוגיות</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <CookieCard title="עוגיות הכרחיות" desc="נדרשות לתפעול האתר - כניסה, עגלת קניות ואבטחה." required />
              <CookieCard
                title="עוגיות אנליטיקה"
                desc="עוזרות לנו להבין כיצד המשתמשים מנווטים באתר."
                checked={choices.analytics}
                onChange={(checked) => setChoices((prev) => ({ ...prev, analytics: checked }))}
              />
              <CookieCard
                title="עוגיות שיווקיות"
                desc="מאפשרות פרסום ממוקד ומעקב המרות."
                checked={choices.marketing}
                onChange={(checked) => setChoices((prev) => ({ ...prev, marketing: checked }))}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => saveConsent({ analytics: false, marketing: false })} className="border border-[#5A6B7F] px-5 py-2 font-['Manrope'] text-xs uppercase tracking-[0.12rem] text-[#CDBFA1] transition-colors hover:border-white hover:text-white">
                הכרחיות בלבד
              </button>
              <button onClick={() => saveConsent(choices)} className="border border-[#C47A5C] px-5 py-2 font-['Manrope'] text-xs uppercase tracking-[0.12rem] text-[#C47A5C] transition-colors hover:bg-[#C47A5C] hover:text-[#13243A]">
                שמירת בחירה
              </button>
              <button onClick={() => saveConsent({ analytics: true, marketing: true })} className="bg-[#C47A5C] px-6 py-2 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.12rem] text-[#13243A] transition-opacity hover:opacity-90">
                אישור הכל
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieCard({ title, desc, required = false, checked = false, onChange }) {
  return (
    <div className="bg-[#13243A] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-['Manrope'] text-sm font-semibold">{title}</p>
        {required ? (
          <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-widest text-[#C47A5C]">חובה</span>
        ) : (
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
            <span className="h-5 w-9 bg-[#5A6B7F] transition-colors peer-checked:bg-[#C47A5C]" />
            <span className="absolute right-0.5 h-4 w-4 bg-white transition-transform peer-checked:-translate-x-4" />
          </label>
        )}
      </div>
      <p className="mt-1 font-['Manrope'] text-xs leading-relaxed text-[#5A6B7F]">{desc}</p>
    </div>
  );
}
