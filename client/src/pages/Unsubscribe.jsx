import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token'), [searchParams]);
  const [status, setStatus] = useState(() => (token ? 'loading' : 'error'));
  const [msg, setMsg] = useState(() => (token ? '' : 'קישור לא תקין - לא נמצא טוקן הסרה.'));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    api.get(`/newsletter/unsubscribe?token=${token}`)
      .then(() => {
        if (cancelled) return;
        setStatus('success');
        setMsg('הוסרת בהצלחה מרשימת התפוצה של Dream & Work.');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setMsg(err.response?.data?.error || 'הקישור אינו תקין או שכבר בוצעה הסרה.');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" dir="rtl">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <p className="font-['Manrope'] text-[#888]">מעבד את הבקשה...</p>
        )}

        {status === 'success' && (
          <>
            <p className="text-4xl mb-6">✦</p>
            <h1 className="font-['Noto_Serif'] text-2xl text-[#111]">הוסרת בהצלחה</h1>
            <p className="mt-3 font-['Manrope'] text-sm text-[#666]">{msg}</p>
            <p className="mt-2 font-['Manrope'] text-xs text-[#999]">לא תקבל יותר עדכונים שיווקיים. עדכונים על הזמנות ימשיכו להישלח.</p>
            <Link to="/" className="mt-8 inline-block font-['Manrope'] text-xs uppercase tracking-[0.2rem] border border-[#111] px-6 py-3 hover:bg-[#111] hover:text-white transition-colors">
              חזרה לאתר
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-4xl mb-6">✕</p>
            <h1 className="font-['Noto_Serif'] text-2xl text-[#111]">שגיאה בהסרה</h1>
            <p className="mt-3 font-['Manrope'] text-sm text-[#666]">{msg}</p>
            <Link to="/" className="mt-8 inline-block font-['Manrope'] text-xs uppercase tracking-[0.2rem] border border-[#111] px-6 py-3 hover:bg-[#111] hover:text-white transition-colors">
              חזרה לאתר
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
