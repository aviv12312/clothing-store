import Footer from '../components/layout/Footer';
import { BUSINESS_INFO, isPlaceholder } from '../data/businessInfo';

function Detail({ label, value, href }) {
  const content = (
    <span className={isPlaceholder(value) ? 'rounded bg-yellow-100 px-1 text-[#625C51]' : ''}>
      {value}
    </span>
  );

  return (
    <div className="border-b border-[#ECE9E3] py-5">
      <dt className="font-['Manrope'] text-[0.62rem] uppercase tracking-[0.22rem] text-[#6E6A62]">{label}</dt>
      <dd className="mt-2 text-lg text-[#121211]">
        {href ? <a href={href} className="underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[#121211]/20">{content}</a> : content}
      </dd>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="px-6 pb-20 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6E6A62]">שירות לקוחות</p>
          <h1 className="mt-4 font-['Noto_Serif'] text-5xl tracking-[-0.05em] text-[#121211] md:text-7xl">צור קשר</h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#6E6A62]">
            כאן ירוכזו פרטי השירות הרשמיים של Dream & Work. פרטים שמסומנים בצהוב הם placeholders עד לקבלת פרטי העסק האמיתיים.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="bg-[#FBFAF7] p-8 md:p-10" aria-labelledby="contact-help-title">
              <h2 id="contact-help-title" className="font-['Noto_Serif'] text-3xl text-[#121211]">איך אפשר לעזור?</h2>
              <p className="mt-5 text-sm leading-8 text-[#6E6A62]">
                לפניות בנושא הזמנות, ביטול עסקה, החזרות, נגישות או פרטיות, מומלץ לציין מספר הזמנה ופרטי יצירת קשר.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a href="/legal/returns" className="editorial-button-secondary motion-cta text-center">מדיניות ביטולים והחזרות</a>
                <a href="/cancel-order" className="editorial-button motion-cta text-center">ביטול עסקה</a>
              </div>
            </section>

            <section aria-labelledby="contact-details-title">
              <h2 id="contact-details-title" className="sr-only">פרטי יצירת קשר</h2>
              <dl>
                <Detail label="טלפון" value={BUSINESS_INFO.phone} href={`tel:${BUSINESS_INFO.phone}`} />
                <Detail label="דואר אלקטרוני" value={BUSINESS_INFO.email} href={`mailto:${BUSINESS_INFO.email}`} />
                <Detail label="שעות שירות" value={BUSINESS_INFO.serviceHours} />
                <Detail label="כתובת" value={BUSINESS_INFO.address} />
                <Detail label="WhatsApp" value={BUSINESS_INFO.whatsapp} />
              </dl>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
