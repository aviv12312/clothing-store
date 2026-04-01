import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';

const CONCIERGE_SERVICES = [
  { icon: 'package_2', title: 'Fast Delivery', desc: 'Delivered within 2-3 business days.' },
  { icon: 'autorenew', title: 'Easy Returns', desc: 'Returns available within 14 days.' },
  { icon: 'support_agent', title: 'Personal Styling', desc: 'Size and outfit guidance whenever you need it.' },
];

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="editorial-shell min-h-screen bg-white">
        <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center md:px-12">
          <p className="editorial-kicker text-[#6e6667]">Your Bag</p>
          <h1 className="mt-6 font-['Noto_Serif'] text-5xl tracking-[-0.05em] text-[#111111] md:text-7xl">Nothing selected yet.</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#5d5657]">The cart is ready. Once pieces are added, this page will show the same clean white layout and checkout summary.</p>
          <Link to="/shop" className="editorial-button mt-10">Continue Shopping</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="editorial-shell min-h-screen bg-white">
      <main className="px-6 pb-24 pt-28 md:px-12 lg:px-20 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker text-[#6e6667]">Curated Bag</p>
              <h1 className="mt-4 font-['Noto_Serif'] text-5xl tracking-[-0.06em] text-[#111111] md:text-7xl">Your Selection</h1>
            </div>
            <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#6e6667]">{items.length} item{items.length > 1 ? 's' : ''} in cart</p>
          </header>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article key={`--`} className="bg-[#f7f7f7] p-5 md:p-8">
                  <div className="grid gap-6 md:grid-cols-[10rem_1fr] xl:grid-cols-[12rem_1fr]">
                    <div className="aspect-[3/4] overflow-hidden bg-[#ececec]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><span className="material-symbols-outlined text-[#b8b1b2]" style={{ fontSize: '44px' }}>checkroom</span></div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between gap-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-['Noto_Serif'] text-2xl tracking-[-0.04em] text-[#111111]">{item.name}</p>
                          <p className="mt-2 font-['Manrope'] text-[0.58rem] uppercase tracking-[0.24rem] text-[#6e6667]">{item.color ? `${item.color} / ` : ''}Size {item.size || 'Standard'}</p>
                        </div>
                        <p className="font-['Noto_Serif'] text-2xl text-[#111111]">₪{(item.price * item.quantity).toFixed(0)}</p>
                      </div>

                      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex w-fit items-center bg-white px-3 py-2">
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center text-[#6e6667] hover:text-[#111111]"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span></button>
                          <span className="w-10 text-center font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-[#111111]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} disabled={item.stock && item.quantity >= item.stock} className={`flex h-9 w-9 items-center justify-center ${item.stock && item.quantity >= item.stock ? 'text-[#c6c0c1] cursor-not-allowed' : 'text-[#6e6667] hover:text-[#111111]'}`}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span></button>
                        </div>

                        <button onClick={() => removeItem(item.productId, item.size, item.color)} className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.24rem] text-[#6e6667] transition-colors hover:text-[#111111]">Remove Item</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-[#f7f7f7] p-7 md:p-9">
                <h2 className="font-['Noto_Serif'] text-3xl tracking-[-0.04em] text-[#111111]">Order Summary</h2>

                <div className="mt-8 space-y-4 font-['Manrope'] text-[0.68rem] uppercase tracking-[0.2rem] text-[#5d5657]">
                  <div className="flex items-center justify-between"><span>Subtotal</span><span className="text-[#111111]">₪{total.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between"><span>Shipping</span><span className="text-[#111111]">Free</span></div>
                  <div className="flex items-center justify-between"><span>VAT</span><span className="text-[#111111]">Included</span></div>
                </div>

                <div className="mt-8 bg-white px-4 py-3">
                  <label className="block font-['Manrope'] text-[0.56rem] uppercase tracking-[0.24rem] text-[#6e6667]">Promo Code</label>
                  <input type="text" placeholder="Enter code" className="editorial-input mt-2" />
                </div>

                <div className="mt-8 flex items-end justify-between">
                  <span className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#6e6667]">Total</span>
                  <span className="font-['Noto_Serif'] text-4xl text-[#111111]">₪{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="editorial-button mt-8 w-full">Proceed to Checkout</Link>
                <Link to="/shop" className="editorial-button-secondary mt-3 w-full">Continue Shopping</Link>

                <div className="mt-8 space-y-3">
                  {CONCIERGE_SERVICES.map((service) => (
                    <div key={service.title} className="flex items-start gap-3 bg-white p-4">
                      <span className="material-symbols-outlined text-[#111111]">{service.icon}</span>
                      <div>
                        <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] text-[#111111]">{service.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#5d5657]">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

