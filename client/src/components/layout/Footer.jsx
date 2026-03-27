import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FOOTER_LINKS = [
  { label: 'פרטיות', href: '#' },
  { label: 'תנאים', href: '#' },
  { label: 'משלוח', href: '#' },
  { label: 'צור קשר', href: '#' },
];

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
    <footer className="bg-[#0e0e0e] w-full border-t border-[#444748]/20">
      {/* Newsletter Bar — נסתר אם כבר נרשם */}
      {!isSubscribed && <div className="border-b border-[#1e1e1e] py-14 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.25em] text-[#767575] mb-2">
            רשימת תפוצה
          </p>
          <h3 className="font-['Noto_Serif'] text-xl text-[#e7e5e5] font-light">
            קבל עדכונים ראשון
          </h3>
          <p className="font-['Manrope'] text-xs text-[#555] mt-1">
            קולקציות חדשות · מבצעים בלעדיים · Early Access
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-3">
            <span className="text-[#e9c349] text-lg">✦</span>
            <p className="font-['Manrope'] text-sm text-[#e7e5e5]">{msg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto md:min-w-[380px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת האימייל שלך"
              required
              className="flex-1 bg-[#111] border border-[#333] text-[#e7e5e5] text-sm font-['Manrope'] px-5 py-3 focus:outline-none focus:border-[#e9c349]/50 placeholder-[#444] transition-colors"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="gold-shimmer text-[#131313] font-['Manrope'] text-[0.65rem] uppercase tracking-[0.15em] font-bold px-6 py-3 hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50 flex-shrink-0"
            >
              {status === 'loading' ? '...' : 'הצטרף'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs font-['Manrope'] mt-1">{msg}</p>
        )}
      </div>}

      {/* Bottom Bar */}
      <div className="py-10 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-lg font-['Noto_Serif'] text-[#e9c349]" dir="ltr">
          Dream &amp; Work
        </span>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-['Manrope'] text-[0.65rem] tracking-[0.15rem] uppercase text-[#c8c6c5] hover:text-[#e9c349] transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        <p className="font-['Manrope'] text-[10px] tracking-widest uppercase text-[#c4c7c7]/60" dir="ltr">
          &copy; 2025 DREAM &amp; WORK. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
