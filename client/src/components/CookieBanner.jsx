import { useState, useEffect } from 'react';

const COOKIE_KEY = 'dw_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, marketing: true, analytics: true, ts: Date.now() }));
    setVisible(false);
    enableMarketingScripts();
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, marketing: false, analytics: false, ts: Date.now() }));
    setVisible(false);
  };

  const enableMarketingScripts = () => {
    // כאן ניתן להפעיל Google Analytics, Meta Pixel וכו' לאחר הסכמה
    // window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-[#111111] text-white shadow-2xl" dir="rtl">
      <div className="mx-auto max-w-6xl px-6 py-5">
        {!showDetails ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="font-['Manrope'] text-sm leading-relaxed text-[#e7e5e5]">
                אנו משתמשים בעוגיות (Cookies) לצורך תפעול האתר, ניתוח סטטיסטי ושיפור חוויית המשתמש.
                עוגיות שיווקיות יופעלו רק לאחר אישורך.{' '}
                <button onClick={() => setShowDetails(true)} className="underline text-[#e9c349] hover:opacity-80 transition-opacity">
                  מידע נוסף
                </button>
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <button
                onClick={acceptEssentialOnly}
                className="border border-[#555] px-5 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.15rem] text-[#aaa] transition-colors hover:border-white hover:text-white"
              >
                הכרחיות בלבד
              </button>
              <button
                onClick={accept}
                className="bg-[#e9c349] px-6 py-2.5 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.15rem] text-[#111111] transition-opacity hover:opacity-90"
              >
                אישור הכל
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-['Noto_Serif'] text-lg">הגדרות עוגיות</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: 'עוגיות הכרחיות', desc: 'נדרשות לתפעול האתר — כניסה, עגלת קניות, אבטחה.', required: true },
                { title: 'עוגיות אנליטיקה', desc: 'עוזרות לנו להבין כיצד המשתמשים מנווטים באתר.', required: false },
                { title: 'עוגיות שיווקיות', desc: 'מאפשרות פרסום ממוקד ומעקב המרות.', required: false },
              ].map((item) => (
                <div key={item.title} className="bg-[#1e1e1e] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-['Manrope'] text-sm font-semibold">{item.title}</p>
                    {item.required ? (
                      <span className="font-['Manrope'] text-[0.6rem] uppercase tracking-widest text-[#e9c349]">חובה</span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-['Manrope'] text-xs text-[#777] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={acceptEssentialOnly} className="border border-[#555] px-5 py-2 font-['Manrope'] text-xs uppercase tracking-[0.12rem] text-[#aaa] hover:border-white hover:text-white transition-colors">
                הכרחיות בלבד
              </button>
              <button onClick={accept} className="bg-[#e9c349] px-6 py-2 font-['Manrope'] text-xs font-semibold uppercase tracking-[0.12rem] text-[#111111] hover:opacity-90 transition-opacity">
                אישור הכל
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
