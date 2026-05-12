import Footer from '../../components/layout/Footer';
import { BUSINESS_INFO, isPlaceholder } from '../../data/businessInfo';

function Mark({ children }) {
  return <span className={isPlaceholder(children) ? 'rounded bg-yellow-100 px-1 text-[#5f4b00]' : ''}>{children}</span>;
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="px-6 pb-20 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
          <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">מדיניות פרטיות</h1>
          <p className="mt-2 font-['Manrope'] text-sm text-[#888]">עדכון אחרון: מאי 2026</p>

          <div className="mt-10 space-y-8 font-['Manrope'] leading-relaxed text-[#333]">
            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">1. מי אנחנו</h2>
              <p className="mt-3 text-sm">
                Dream & Work מופעלת על ידי <Mark>{BUSINESS_INFO.companyName}</Mark>. ליצירת קשר בנושא פרטיות ניתן לפנות אל <a href={`mailto:${BUSINESS_INFO.email}`} className="underline"><Mark>{BUSINESS_INFO.email}</Mark></a>.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">2. איזה מידע נאסף</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>פרטי זיהוי ויצירת קשר: שם, דואר אלקטרוני, טלפון וכתובת למשלוח.</li>
                <li>פרטי עסקה: מוצרים שנרכשו, סכומים, סטטוס הזמנה וחשבוניות.</li>
                <li>מידע טכני: כתובת IP, סוג דפדפן, עמודים שנצפו ונתוני שימוש בסיסיים.</li>
                <li>העדפות דיוור ושיווק, רק כאשר ניתנה הסכמה לכך.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">3. מטרות השימוש במידע</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>עיבוד הזמנות, משלוחים, ביטולים והחזרות.</li>
                <li>שירות לקוחות ומענה לפניות.</li>
                <li>שיפור חוויית המשתמש ואבטחת האתר.</li>
                <li>דיוור שיווקי בכפוף להסכמה וליכולת הסרה בכל עת.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">4. שיתוף מידע עם צדדים שלישיים</h2>
              <p className="mt-3 text-sm">
                מידע עשוי להימסר לספקי שירות הנדרשים להפעלת האתר, כגון ספקי תשלום, חברות משלוחים, שירותי דיוור, אחסון ענן וכלים אנליטיים, אך רק לצורך מתן השירות.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">5. זכויות המשתמש</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>זכות לעיין במידע אישי שנשמר, ככל שהדין מאפשר.</li>
                <li>זכות לבקש תיקון מידע שגוי.</li>
                <li>זכות לבקש מחיקה או הגבלה של שימוש במידע, בכפוף לחובות שמירה לפי דין.</li>
                <li>זכות להסיר הסכמה לדיוור שיווקי בכל עת.</li>
              </ul>
              <p className="mt-3 text-sm">
                למימוש זכויות ניתן לפנות אל <a href={`mailto:${BUSINESS_INFO.email}`} className="underline"><Mark>{BUSINESS_INFO.email}</Mark></a>.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">6. אבטחת מידע ושמירת מידע</h2>
              <p className="mt-3 text-sm">
                האתר פועל תחת HTTPS ונוקט באמצעי אבטחה סבירים. פרטי אשראי אינם נשמרים בשרתי האתר. מידע נשמר לפי הצורך התפעולי והחובות הקבועות בדין.
              </p>
            </section>

            <section className="border border-[#eee] p-5 text-sm text-[#555]">
              <p>מדיניות זו אינה מהווה ייעוץ משפטי. לפני עלייה לאוויר מומלץ להעביר את המדיניות לאישור משפטי מקצועי.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
