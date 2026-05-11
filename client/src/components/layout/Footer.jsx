import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FOOTER_LINKS = [
  { label: 'מדיניות פרטיות', to: '/legal/privacy' },
  { label: 'תנאי שימוש', to: '/legal/terms' },
  { label: 'ביטולים והחזרות', to: '/legal/returns' },
  { label: 'הצהרת נגישות', to: '/legal/accessibility' },
];

const BUSINESS_INFO = {
  name: '[שם החברה הרשמי]',
  cn: '[ח.פ / עוסק מורשה]',
  address: '[כתובת פיזית]',
  phone: '[טלפון]',
  email: '[מייל שירות לקוחות]',
};

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user?.email) {
      api.get(`/newsletter/check/${user.email}`)
        .then(({ data }) => setIsSubscribed(data.subscribed))
        .catch(() => {});
    }
  }, [user]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const { data } = await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setMsg(data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.error || 'שגיאה, נסה שוב');
    }
  };

  return (
    <footer className="bg-surface w-full border-t border-outline-variant">
      {/* Newsletter Bar — נסתר אם כבר נרשם */}
      {!isSubscribed && <div className="border-b border-outline-variant py-14 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.25em] text-on-surface-variant mb-2">
            רשימת תפוצה
          </p>
          <h3 className="font-['Noto_Serif'] text-xl text-on-surface font-light">
            קבל עדכונים ראשון
          </h3>
          <p className="font-['Manrope'] text-xs text-on-surface-variant mt-1">
            קולקציות חדשות · מבצעים בלעדיים · Early Access
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-3">
            <span className="text-gold text-lg">✦</span>
            <p className="font-['Manrope'] text-sm text-on-surface">{msg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto md:min-w-[380px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת האימייל שלך"
              required
              className="flex-1 bg-background border border-outline-variant text-on-surface text-sm font-['Manrope'] px-5 py-3 focus:outline-none focus:border-primary/50 placeholder-outline transition-colors"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="gold-shimmer font-['Manrope'] text-[0.65rem] uppercase tracking-[0.15em] font-bold px-6 py-3 hover:opacity-80 transition-opacity whitespace-nowrap disabled:opacity-50 flex-shrink-0"
            >
              {status === 'loading' ? '...' : 'הצטרף'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-xs font-['Manrope'] mt-1">{msg}</p>
        )}
      </div>}

      {/* Business Info */}
      <div className="border-t border-outline-variant px-8 md:px-16 py-8 flex flex-col md:flex-row gap-6 md:gap-16 text-on-surface-variant">
        <div className="space-y-1 font-['Manrope'] text-xs" dir="rtl">
          <p className="font-semibold text-on-surface">{BUSINESS_INFO.name}</p>
          <p>ח.פ: {BUSINESS_INFO.cn}</p>
          <p>{BUSINESS_INFO.address}</p>
        </div>
        <div className="space-y-1 font-['Manrope'] text-xs" dir="rtl">
          <p>טלפון: <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-on-surface transition-colors">{BUSINESS_INFO.phone}</a></p>
          <p>מייל: <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-on-surface transition-colors">{BUSINESS_INFO.email}</a></p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant py-8 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-lg font-['Noto_Serif'] text-on-surface" dir="ltr">
          Dream &amp; Work
        </span>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-['Manrope'] text-[0.65rem] tracking-[0.15rem] uppercase text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="font-['Manrope'] text-[10px] tracking-widest uppercase text-outline" dir="ltr">
          &copy; 2026 DREAM &amp; WORK. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
