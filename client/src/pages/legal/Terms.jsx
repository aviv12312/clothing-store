import Footer from '../../components/layout/Footer';
import { BUSINESS_INFO, isPlaceholder } from '../../data/businessInfo';

function Field({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong>{' '}
      <span className={isPlaceholder(value) ? 'rounded bg-yellow-100 px-1 text-[#625C51]' : ''}>{value}</span>
    </p>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="px-6 pb-20 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6E6A62]">מסמך משפטי</p>
          <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#121211]">תקנון ותנאי שימוש</h1>
          <p className="mt-2 font-['Manrope'] text-sm text-[#9A958C]">עדכון אחרון: מאי 2026</p>

          <div className="mt-10 space-y-8 font-['Manrope'] leading-relaxed text-[#6E6A62]">
            <section className="bg-[#FBFAF7] p-6">
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">1. פרטי העסק</h2>
              <div className="mt-3 space-y-1 text-sm">
                <Field label="שם החברה" value={BUSINESS_INFO.companyName} />
                <Field label="ח.פ / עוסק מורשה" value={BUSINESS_INFO.companyId} />
                <Field label="כתובת" value={BUSINESS_INFO.address} />
                <Field label="טלפון" value={BUSINESS_INFO.phone} />
                <Field label="דואר אלקטרוני" value={BUSINESS_INFO.email} />
              </div>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">2. כללי</h2>
              <p className="mt-3 text-sm">
                השימוש באתר מהווה הסכמה לתנאי שימוש אלה. האתר מיועד לרכישת ביגוד ואביזרי אופנה לגברים. הנהלת האתר רשאית לעדכן את תנאי השימוש מעת לעת.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">3. הזמנות ותשלום</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>המחירים באתר כוללים מע״מ, אלא אם צוין אחרת.</li>
                <li>אישור הזמנה יישלח לכתובת הדואר האלקטרוני לאחר השלמת הרכישה.</li>
                <li>החברה רשאית לבטל הזמנה במקרה של תקלה טכנית, טעות מחיר מהותית או חוסר מלאי.</li>
                <li>אמצעי התשלום מופעלים באמצעות ספקי תשלום מאובטחים; פרטי אשראי אינם נשמרים בשרתי האתר.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">4. משלוחים</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>זמן אספקה משוער: 3-7 ימי עסקים, אלא אם צוין אחרת.</li>
                <li>המשלוח מתבצע על ידי <span className="rounded bg-yellow-100 px-1 text-[#625C51]">{BUSINESS_INFO.shippingCompany}</span>.</li>
                <li>עלויות משלוח, אם קיימות, יוצגו לפני השלמת הרכישה.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">5. ביטולים והחזרות</h2>
              <p className="mt-3 text-sm">
                מדיניות הביטולים וההחזרות המלאה זמינה בעמוד <a href="/legal/returns" className="underline text-[#121211]">ביטולים והחזרות</a>.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">6. קניין רוחני</h2>
              <p className="mt-3 text-sm">
                כל התכנים באתר, לרבות תמונות, טקסטים, עיצוב, סימני מסחר וקוד, הם רכוש החברה או מי מטעמה. אין להעתיק, לשכפל או לעשות בהם שימוש מסחרי ללא אישור מראש ובכתב.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">7. אחריות</h2>
              <p className="mt-3 text-sm">
                החברה עושה מאמץ להציג מידע מדויק וזמין, אך אינה מתחייבת שהאתר יהיה נקי מתקלות בכל עת. אחריות החברה מוגבלת בהתאם לדין ולסכום העסקה הרלוונטית.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#121211]">8. סמכות שיפוט</h2>
              <p className="mt-3 text-sm">
                על תנאים אלה יחולו דיני מדינת ישראל. סמכות השיפוט המקומית תהיה לבתי המשפט בעיר <span className="rounded bg-yellow-100 px-1 text-[#625C51]">{BUSINESS_INFO.jurisdictionCity}</span>.
              </p>
            </section>

            <section className="border border-[#ECE9E3] p-5 text-sm text-[#6E6A62]">
              <p>המסמך אינו מהווה ייעוץ משפטי. לפני עלייה לאוויר מומלץ להעביר את התקנון לאישור משפטי מקצועי.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
