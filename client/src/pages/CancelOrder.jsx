import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CancelOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [status, setStatus] = useState(null); // null | loading | success | error
  const [msg, setMsg] = useState('');

  const REASONS = [
    'שיניתי את דעתי',
    'הזמנתי בטעות',
    'מצאתי מחיר טוב יותר',
    'המוצר לא מתאים לציפיות',
    'אחר',
  ];

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my')
      .then(({ data }) => {
        const cancellable = data.filter(o =>
          o.orderStatus !== 'בוטל' && !o.cancellationRequest?.requestedAt
        );
        setOrders(cancellable);
      })
      .catch(() => {});
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setStatus('loading');
    const finalReason = reason === 'אחר' ? customReason : reason;
    try {
      const { data } = await api.post(`/orders/${selectedOrder}/cancellation-request`, { reason: finalReason });
      setStatus('success');
      setMsg(data.message);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.error || 'שגיאה בשליחת הבקשה');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6" dir="rtl">
      <div className="mx-auto max-w-xl">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">שירות לקוחות</p>
        <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111]">ביטול עסקה</h1>
        <p className="mt-2 font-['Manrope'] text-sm text-[#888]">
          בהתאם לחוק הגנת הצרכן ניתן לבטל עסקה תוך 14 ימים מיום קבלת המוצר.
        </p>

        {status === 'success' ? (
          <div className="mt-10 bg-[#f7f7f7] p-8 text-center">
            <p className="text-3xl mb-4">✦</p>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">הבקשה התקבלה</h2>
            <p className="mt-3 font-['Manrope'] text-sm text-[#555]">{msg}</p>
            <p className="mt-2 font-['Manrope'] text-xs text-[#888]">
              אישור נשלח לכתובת המייל שלך. נחזור אליך תוך 2 ימי עסקים.
            </p>
            <button onClick={() => navigate('/profile')} className="mt-6 font-['Manrope'] text-xs uppercase tracking-[0.2rem] border border-[#111] px-6 py-3 hover:bg-[#111] hover:text-white transition-colors">
              חזרה לפרופיל
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            {/* בחירת הזמנה */}
            <div>
              <label className="block font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#333] mb-2">
                בחר הזמנה לביטול
              </label>
              {orders.length === 0 ? (
                <p className="font-['Manrope'] text-sm text-[#888] bg-[#f7f7f7] p-4">
                  אין הזמנות זכאיות לביטול. ייתכן שחלפו 14 הימים, ההזמנה כבר בוטלה, או שכבר הגשת בקשת ביטול.
                </p>
              ) : (
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  required
                  className="w-full border border-[#ddd] px-4 py-3 font-['Manrope'] text-sm focus:outline-none focus:border-[#111]"
                >
                  <option value="">-- בחר הזמנה --</option>
                  {orders.map((o) => (
                    <option key={o._id} value={o._id}>
                      #{o._id.slice(-6).toUpperCase()} · ₪{o.totalPrice} · {new Date(o.createdAt).toLocaleDateString('he-IL')}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* סיבת ביטול */}
            <div>
              <label className="block font-['Manrope'] text-xs uppercase tracking-[0.2rem] text-[#333] mb-2">
                סיבת הביטול
              </label>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-[#111]"
                      required
                    />
                    <span className="font-['Manrope'] text-sm text-[#333]">{r}</span>
                  </label>
                ))}
              </div>
              {reason === 'אחר' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="פרט את הסיבה..."
                  required
                  rows={3}
                  className="mt-3 w-full border border-[#ddd] px-4 py-3 font-['Manrope'] text-sm focus:outline-none focus:border-[#111] resize-none"
                />
              )}
            </div>

            {/* הצהרה */}
            <div className="bg-[#f7f7f7] p-4 font-['Manrope'] text-xs text-[#666] leading-relaxed">
              <p>⚠️ <strong>לתשומת לבך:</strong></p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>ביטול אפשרי תוך 14 ימים מיום קבלת המוצר.</li>
                <li>תיגבה עמלת ביטול של עד 5% ממחיר הקנייה (לא יותר מ-100 ₪) לשינוי דעה.</li>
                <li>המוצר יש להחזיר ללא שימוש, עם תגיות ובאריזה מקורית.</li>
                <li>ההחזר הכספי יבוצע תוך 14 ימי עסקים.</li>
              </ul>
            </div>

            {status === 'error' && (
              <p className="font-['Manrope'] text-sm text-red-500">{msg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || orders.length === 0}
              className="w-full bg-[#111] text-white font-['Manrope'] text-xs uppercase tracking-[0.2rem] py-4 hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'שולח...' : 'שלח בקשת ביטול'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
