import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Footer from '../components/layout/Footer';
import { trackBeginCheckout, trackPurchase } from '../services/analytics';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const FIELDS = [
  { name: 'name',    placeholder: 'שם מלא',     type: 'text' },
  { name: 'street',  placeholder: 'רחוב ומספר', type: 'text' },
  { name: 'city',    placeholder: 'עיר',         type: 'text' },
  { name: 'zipCode', placeholder: 'מיקוד',       type: 'text' },
  { name: 'phone',   placeholder: 'טלפון',       type: 'tel'  },
];

let paypalPromise = null;
function loadPaypalSdk() {
  if (paypalPromise) return paypalPromise;
  paypalPromise = new Promise((resolve, reject) => {
    if (window.paypal) { resolve(window.paypal); return; }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=ILS`;
    script.onload = () => window.paypal ? resolve(window.paypal) : reject(new Error('PayPal undefined'));
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.head.appendChild(script);
  });
  return paypalPromise;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const btnRef = useRef(null);

  const [address, setAddress] = useState({ name: '', street: '', city: '', zipCode: '', phone: '' });
  const [step, setStep] = useState('address');
  const [error, setError] = useState('');
  const [sdkStatus, setSdkStatus] = useState('idle');

  // קופון
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | 'loading' | 'valid' | 'error'
  const [couponData, setCouponData] = useState(null); // { discount, discountAmount, newTotal }
  const [couponMsg, setCouponMsg] = useState('');

  const finalTotal = couponData ? parseFloat(couponData.newTotal) : total;
  const addressFilled = FIELDS.every((f) => address[f.name].trim() !== '');

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponStatus('loading');
    setCouponMsg('');
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, total });
      setCouponData(data);
      setCouponStatus('valid');
      setCouponMsg(`✓ הנחה של ${data.discount}% הופעלה!`);
    } catch (err) {
      setCouponStatus('error');
      setCouponData(null);
      setCouponMsg(err.response?.data?.error || 'קוד לא תקין');
    }
  };

  useEffect(() => {
    if (step !== 'payment') return;
    let cancelled = false;

    async function initPaypal() {
      try {
        setSdkStatus('loading');
        const paypal = await loadPaypalSdk();
        if (cancelled || !btnRef.current) return;
        setSdkStatus('ready');
        btnRef.current.innerHTML = '';

        paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },

          createOrder: async () => {
            const { data } = await api.post('/payment/paypal/create-order', {
              cartItems: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                size: i.size,
                color: i.color,
              })),
              shippingAddress: address,
              couponCode: couponData ? couponCode.toUpperCase() : null,
            });
            return data.paypalOrderId;
          },

          onApprove: async (data) => {
            const res = await api.post('/payment/paypal/capture-order', {
              paypalOrderId: data.orderID,
              couponCode: couponData ? couponCode.toUpperCase() : null,
            });
            trackPurchase(res.data?.orderId || data.orderID, finalTotal, items);
            clearCart();
            navigate('/profile');
          },

          onError: (err) => {
            console.error('PayPal error:', err);
            setError('שגיאה ב-PayPal — נסה שוב');
          },
        }).render(btnRef.current);

      } catch (err) {
        console.error('PayPal SDK load error:', err);
        if (!cancelled) {
          setSdkStatus('error');
          setError('לא ניתן לטעון את PayPal. בדוק חיבור אינטרנט ונסה שוב.');
        }
      }
    }

    initPaypal();
    return () => { cancelled = true; };
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-28 pb-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* ── טופס ── */}
          <div className="lg:col-span-7 space-y-14">

            {/* שלב 1 — כתובת */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-label uppercase tracking-widest text-outline">01</span>
                <h2 className="font-headline text-2xl text-on-surface">כתובת למשלוח</h2>
              </div>
              {step === 'address' ? (
                <>
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {FIELDS.map((f) => (
                      <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder}
                        value={address[f.name]}
                        onChange={(e) => setAddress((p) => ({ ...p, [e.target.name]: e.target.value }))}
                        className="w-full bg-transparent border-b border-outline-variant py-3 text-on-surface placeholder-outline font-label text-sm focus:outline-none focus:border-[#e9c349] uppercase tracking-wider transition-colors"
                      />
                    ))}
                  </div>
                  <button onClick={() => addressFilled && (setStep('payment'), trackBeginCheckout(items, total))}
                    disabled={!addressFilled}
                    className="w-full py-5 bg-[#e9c349] text-[#0a0a0a] font-label text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-40 hover:brightness-110 transition-all">
                    המשך לתשלום ←
                  </button>
                </>
              ) : (
                <div className="space-y-1 text-sm font-label text-outline">
                  <p>{address.name}</p>
                  <p>{address.street}, {address.city} {address.zipCode}</p>
                  <p>{address.phone}</p>
                  <button onClick={() => setStep('address')} className="text-[#e9c349] text-xs uppercase tracking-widest mt-2 border-b border-[#e9c349]/30">ערוך</button>
                </div>
              )}
            </section>

            {/* שלב 2 — תשלום */}
            {step === 'payment' && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-label uppercase tracking-widest text-outline">02</span>
                  <h2 className="font-headline text-2xl text-on-surface">תשלום</h2>
                </div>
                {sdkStatus === 'loading' && (
                  <p className="text-outline text-sm font-label text-center py-4">טוען PayPal...</p>
                )}
                <div dir="ltr" ref={btnRef} className="min-h-[50px]" />
                {error && <p className="mt-4 text-red-400 text-sm font-label text-center">{error}</p>}
              </section>
            )}
          </div>

          {/* ── סיכום הזמנה ── */}
          <aside className="lg:col-span-5">
            <div className="bg-surface-container p-8 sticky top-28 border border-outline-variant/10">
              <h2 className="font-headline text-xl mb-8 pb-4 border-b border-outline-variant/20">סיכום הזמנה</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between items-start text-sm font-label gap-4">
                    <div>
                      <p className="text-on-surface">{item.name}</p>
                      <p className="text-outline text-xs mt-0.5">
                        {item.size && `מידה: ${item.size}`}{item.color && ` · ${item.color}`}{` · כמות: ${item.quantity}`}
                      </p>
                    </div>
                    <span className="flex-shrink-0">₪{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* שדה קוד הנחה */}
              <div className="border-t border-outline-variant/20 pt-4 mb-4">
                <p className="font-label text-[0.65rem] uppercase tracking-widest text-outline mb-3">קוד הנחה</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus(null); setCouponData(null); setCouponMsg(''); }}
                    placeholder="הכנס קוד..."
                    disabled={couponStatus === 'valid'}
                    className="flex-1 bg-transparent border-b border-outline-variant py-2 text-on-surface placeholder-outline font-label text-xs uppercase tracking-wider focus:outline-none focus:border-[#e9c349] transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode || couponStatus === 'valid' || couponStatus === 'loading'}
                    className="font-label text-[0.6rem] uppercase tracking-widest text-[#e9c349] border border-[#e9c349]/40 px-3 py-1 hover:bg-[#e9c349]/10 transition-colors disabled:opacity-40"
                  >
                    {couponStatus === 'loading' ? '...' : 'החל'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs font-label mt-2 ${couponStatus === 'valid' ? 'text-green-400' : 'text-red-400'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              <div className="border-t border-outline-variant/20 pt-4">
                <div className="flex justify-between text-sm font-label text-outline mb-2">
                  <span>משלוח</span>
                  <span className="text-[#e9c349]">חינם</span>
                </div>
                {couponData && (
                  <div className="flex justify-between text-sm font-label text-green-400 mb-2">
                    <span>הנחה ({couponData.discount}%)</span>
                    <span>-₪{couponData.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-headline text-xl mt-4">
                  <span>סה"כ</span>
                  <div className="text-left">
                    {couponData && <p className="text-outline line-through text-sm">₪{total.toFixed(2)}</p>}
                    <span className="text-[#e9c349]">₪{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {items.length === 0 && <p className="text-outline text-sm font-label text-center mt-6">העגלה ריקה</p>}
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
