import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CONCIERGE_SERVICES = [
  { icon: 'package_2', titleKey: 'cart.services.delivery', descKey: 'cart.services.deliveryText' },
  { icon: 'autorenew', titleKey: 'cart.services.returns', descKey: 'cart.services.returnsText' },
  { icon: 'support_agent', titleKey: 'cart.services.styling', descKey: 'cart.services.stylingText' },
];

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, total } = useCart();
  const pageRef = useScrollReveal([items.length]);

  if (items.length === 0) {
    return (
      <div ref={pageRef} className="editorial-shell min-h-screen bg-white">
        <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center md:px-12">
          <p className="reveal editorial-kicker text-[#6E6A62]">{t('cart.bag')}</p>
          <h1 className="reveal mt-6 font-['Noto_Serif'] text-4xl tracking-[-0.05em] text-[#121211] sm:text-5xl md:text-7xl">{t('cart.emptyTitle')}</h1>
          <p className="reveal mt-6 max-w-xl text-sm leading-7 text-[#6E6A62]">{t('cart.emptyText')}</p>
          <Link to="/shop" className="editorial-button motion-cta mt-10">{t('common.continueShopping')}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen bg-white">
      <main className="px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:px-12 lg:px-20 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <header className="reveal mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker text-[#6E6A62]">{t('cart.curatedBag')}</p>
              <h1 className="mt-4 font-['Noto_Serif'] text-4xl tracking-[-0.06em] text-[#121211] sm:text-5xl md:text-7xl">{t('cart.selection')}</h1>
            </div>
            <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.24rem] text-[#6E6A62]">{t('cart.itemCount', { count: items.length })}</p>
          </header>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
            <section className="motion-grid space-y-4">
              {items.map((item) => (
                <article key={`${item.productId}-${item.size}-${item.color}`} className="motion-lift bg-[#FBFAF7] p-4 sm:p-5 md:p-8">
                  <div className="grid grid-cols-[6rem_1fr] gap-4 sm:grid-cols-[8rem_1fr] sm:gap-6 md:grid-cols-[10rem_1fr] xl:grid-cols-[12rem_1fr]">
                    <div className="aspect-[3/4] overflow-hidden bg-[#ECE9E3]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="motion-image h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><span className="material-symbols-outlined text-[#CFCAC0]" style={{ fontSize: '44px' }}>checkroom</span></div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5 md:gap-6">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="font-['Noto_Serif'] text-xl leading-tight tracking-[-0.04em] text-[#121211] md:text-2xl">{item.name}</p>
                          <p className="mt-2 font-['Manrope'] text-[0.58rem] uppercase tracking-[0.24rem] text-[#6E6A62]">
                            {item.color ? `${item.color} / ` : ''}{t('common.size')} {item.size || 'Standard'}
                          </p>
                        </div>
                        <p className="font-['Noto_Serif'] text-xl text-[#121211] md:text-2xl">₪{(item.price * item.quantity).toFixed(0)}</p>
                      </div>

                      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="flex w-fit items-center bg-white px-3 py-2">
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} aria-label={`הפחתת כמות עבור ${item.name}`} className="flex h-9 w-9 items-center justify-center text-[#6E6A62] transition-transform hover:scale-110 hover:text-[#121211]"><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>remove</span></button>
                          <span className="w-10 text-center font-['Manrope'] text-sm uppercase tracking-[0.16rem] text-[#121211]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} disabled={item.stock && item.quantity >= item.stock} aria-label={`הגדלת כמות עבור ${item.name}`} className={`flex h-9 w-9 items-center justify-center transition-transform ${item.stock && item.quantity >= item.stock ? 'text-[#CFCAC0] cursor-not-allowed' : 'text-[#6E6A62] hover:scale-110 hover:text-[#121211]'}`}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>add</span></button>
                        </div>

                        <button onClick={() => removeItem(item.productId, item.size, item.color)} className="font-['Manrope'] text-[0.58rem] uppercase tracking-[0.24rem] text-[#6E6A62] transition-colors hover:text-[#121211]">{t('cart.remove')}</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="reveal-right motion-lift bg-[#FBFAF7] p-7 md:p-9">
                <h2 className="font-['Noto_Serif'] text-2xl tracking-[-0.04em] text-[#121211] sm:text-3xl">{t('cart.orderSummary')}</h2>

                <div className="mt-8 space-y-4 font-['Manrope'] text-[0.68rem] uppercase tracking-[0.2rem] text-[#6E6A62]">
                  <div className="flex items-center justify-between"><span>{t('cart.subtotal')}</span><span className="text-[#121211]">₪{total.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between"><span>{t('cart.shipping')}</span><span className="text-[#121211]">{t('common.free')}</span></div>
                  <div className="flex items-center justify-between"><span>{t('cart.vat')}</span><span className="text-[#121211]">{t('common.included')}</span></div>
                </div>

                <div className="mt-8 bg-white px-4 py-3">
                  <label className="block font-['Manrope'] text-[0.56rem] uppercase tracking-[0.24rem] text-[#6E6A62]">{t('cart.promoCode')}</label>
                  <input type="text" placeholder={t('cart.promoPlaceholder')} className="editorial-input mt-2" />
                </div>

                <div className="mt-8 flex items-end justify-between">
                  <span className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.24rem] text-[#6E6A62]">{t('cart.total')}</span>
                  <span className="font-['Noto_Serif'] text-3xl text-[#121211] sm:text-4xl">₪{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="editorial-button motion-cta mt-8 w-full">{t('cart.checkout')}</Link>
                <Link to="/shop" className="editorial-button-secondary motion-cta mt-3 w-full">{t('common.continueShopping')}</Link>

                <div className="mt-8 space-y-3">
                  {CONCIERGE_SERVICES.map((service) => (
                    <div key={service.titleKey} className="motion-lift flex items-start gap-3 bg-white p-4">
                      <span className="material-symbols-outlined text-[#121211]">{service.icon}</span>
                      <div>
                        <p className="font-['Manrope'] text-[0.6rem] uppercase tracking-[0.22rem] text-[#121211]">{t(service.titleKey)}</p>
                        <p className="mt-1 text-sm leading-6 text-[#6E6A62]">{t(service.descKey)}</p>
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
