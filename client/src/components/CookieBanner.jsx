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
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-[#121211] text-white shadow-2xl" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        {!showDetails ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="flex-1 font-['Manrope'] text-sm leading-relaxed text-[#ECE9E3]">
              אנו משתמשים בעוגיות הכרחיות לתפעול האתר. אנליטיקה ושיווק יופעלו רק לאחר אישורך.{' '}
              <button onClick={() => setShowDetails(true)} className="underline text-[#8A8175] hover:opacity-80">
                מידע נוסף
              </button>
            </p>

            <div className="grid flex-shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:flex-wrap">
              <button onClick={() => setShowDetails(true)} className="border border-[#6E6A62] px-4 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.1rem] text-[#CFCAC0] transition-colors hover:border-white hover:text-white sm:px-5 sm:tracking-[0.15rem]">
                התאמה אישית
              </button>
              <button onClick={() => saveConsent({ analytics: false, marketing: false })} className="border border-[#6E6A62] px-4 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.1rem] text-[#CFCAC0] transition-colors hover:border-white hover:text-white sm:px-5 sm:tracking-[0.15rem]">
                הכרחיות בלבד
              </button>
              <button onClick={() => saveConsent({ analytics: true, marketing: true })} className="bg-[#8A8175] px-4 py-2.5 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.1rem] text-[#121211] transition-opacity hover:opacity-90 sm:px-6 sm:tracking-[0.15rem]">
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

            <div className="grid grid-cols-1 gap-3 pt-2 sm:flex sm:flex-wrap">
              <button onClick={() => saveConsent({ analytics: false, marketing: false })} className="border border-[#6E6A62] px-5 py-2 font-['Manrope'] text-xs uppercase tracking-[0.12rem] text-[#CFCAC0] transition-colors hover:border-white hover:text-white">
                הכרחיות בלבד
              </button>
              <button onClick={() => saveConsent(choices)} className="border border-[#8A8175] px-5 py-2 font-['Manrope'] text-xs uppercase tracking-[0.12rem] text-[#8A8175] transition-colors hover:bg-[#8A8175] hover:text-[#121211]">
                שמירת בחירה
              </button>
              <button onClick={() => saveConsent({ analytics: true, marketing: true })} className="bg-[#8A8175] px-6 py-2 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.12rem] text-[#121211] transition-opacity hover:opacity-90">
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
    <div className="bg-[#121211] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-['Manrope'] text-sm font-semibold">{title}</p>
        {required ? (
          <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-widest text-[#8A8175]">חובה</span>
        ) : (
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
            <span className="h-5 w-9 bg-[#6E6A62] transition-colors peer-checked:bg-[#8A8175]" />
            <span className="absolute right-0.5 h-4 w-4 bg-white transition-transform peer-checked:-translate-x-4" />
          </label>
        )}
      </div>
      <p className="mt-1 font-['Manrope'] text-xs leading-relaxed text-[#6E6A62]">{desc}</p>
    </div>
  );
}
