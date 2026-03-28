import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';

const CONCIERGE_SERVICES = [
  { icon: 'local_shipping', title: 'משלוח מהיר', desc: 'מגיע תוך 2-3 ימי עסקים' },
  { icon: 'autorenew', title: 'החזרה חינם', desc: 'עד 14 יום ממועד הרכישה' },
  { icon: 'support_agent', title: 'שירות אישי', desc: 'ייעוץ מידות ואופנה' },
];

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#131313]">
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-6">
          <span className="material-symbols-outlined text-[#444748]" style={{ fontSize: '64px' }}>shopping_bag</span>
          <p className="text-[#c8c6c5] font-['Manrope'] uppercase tracking-widest text-xs">התיק ריק</p>
          <Link
            to="/shop"
            className="gold-shimmer text-[#131313] px-12 py-4 font-['Manrope'] text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
          >
            המשך לקניות
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#131313]">
      <main className="flex-1 pt-28 pb-24 px-8 md:px-16 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 border-b border-[#444748]/30 pb-8">
          <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.25rem] text-[#e9c349] mb-2">Dream &amp; Work</p>
          <h1 className="font-['Noto_Serif'] text-4xl md:text-5xl text-[#e2e2e2]">תיק הקניות</h1>
          <p className="mt-2 text-[#c8c6c5] font-['Manrope'] tracking-widest uppercase text-xs">
            {items.length} פריטים בבחירתך
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Cart Items ────────────────────────────────────────── */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-0">
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}`}
                className={`flex gap-6 py-8 ${idx < items.length - 1 ? 'border-b border-[#444748]/25' : ''}`}
              >
                {/* Image — grayscale reveal */}
                <div className="w-24 md:w-32 aspect-[3/4] bg-[#1f1f1f] overflow-hidden flex-shrink-0 group">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#444748]" style={{ fontSize: '32px' }}>checkroom</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-['Noto_Serif'] text-lg text-[#e2e2e2] mb-1">{item.name}</h3>
                      <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#c8c6c5]">
                        {item.color && `${item.color} / `}מידה {item.size}
                      </p>
                    </div>
                    <span className="font-['Noto_Serif'] text-lg text-[#e9c349] flex-shrink-0">
                      ₪{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#444748]/50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#c8c6c5] hover:text-[#e9c349] transition-colors font-['Manrope']"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                      </button>
                      <span className="w-10 text-center font-['Manrope'] text-sm text-[#e2e2e2]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        disabled={item.stock && item.quantity >= item.stock}
                        className={`w-8 h-8 flex items-center justify-center transition-colors font-['Manrope'] ${item.stock && item.quantity >= item.stock ? 'text-[#333] cursor-not-allowed' : 'text-[#c8c6c5] hover:text-[#e9c349]'}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="font-['Manrope'] text-[0.65rem] uppercase tracking-widest text-[#444748] hover:text-[#e2e2e2] transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                      הסר
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ── Order Summary ─────────────────────────────────────── */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="bg-[#0e0e0e] p-8 sticky top-28 border border-[#444748]/25">
              <h2 className="font-['Noto_Serif'] text-xl text-[#e2e2e2] mb-8 pb-5 border-b border-[#444748]/25">
                סיכום הזמנה
              </h2>

              <div className="space-y-4 font-['Manrope'] text-xs">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[#c8c6c5]">סכום ביניים</span>
                  <span className="text-[#e2e2e2]">₪{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[#c8c6c5]">משלוח</span>
                  <span className="text-[#e9c349]">חינם</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[#c8c6c5]">מע"מ (17%)</span>
                  <span className="text-[#e2e2e2]">כלול</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#444748]/25 flex justify-between items-baseline">
                <span className="font-['Noto_Serif'] text-base uppercase tracking-widest text-[#e2e2e2]">סה"כ</span>
                <span className="font-['Noto_Serif'] text-2xl text-[#e9c349]">₪{total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="gold-shimmer w-full mt-8 py-4 px-8 text-xs uppercase tracking-[0.2em] font-bold font-['Manrope'] text-[#131313] hover:opacity-90 transition-opacity flex items-center justify-center gap-3 block text-center"
              >
                עבור לתשלום
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              </Link>

              <Link
                to="/shop"
                className="w-full mt-3 py-3 px-8 text-[0.65rem] uppercase tracking-widest font-['Manrope'] text-[#c8c6c5] hover:text-[#e2e2e2] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                המשך לקניות
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Concierge Services ────────────────────────────────── */}
        <div className="mt-20 pt-12 border-t border-[#444748]/25">
          <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.3rem] text-[#e9c349] mb-8 text-center">
            שירות Concierge
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONCIERGE_SERVICES.map((service) => (
              <div key={service.title} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#e9c349] flex-shrink-0" style={{ fontSize: '24px' }}>
                  {service.icon}
                </span>
                <div>
                  <p className="font-['Noto_Serif'] text-sm text-[#e2e2e2] mb-1">{service.title}</p>
                  <p className="font-['Manrope'] text-xs text-[#c8c6c5]">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
