import Footer from '../../components/layout/Footer';
import { BUSINESS_INFO, isPlaceholder } from '../../data/businessInfo';

function Mark({ children }) {
  return <span className={isPlaceholder(children) ? 'rounded bg-yellow-100 px-1 text-[#5f4b00]' : ''}>{children}</span>;
}

export default function Returns() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="px-6 pb-20 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
          <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">מדיניות ביטולים והחזרות</h1>
          <p className="mt-2 font-['Manrope'] text-sm text-[#888]">בהתאם לדיני הגנת הצרכן בישראל</p>

          <div className="mt-10 space-y-8 font-['Manrope'] leading-relaxed text-[#333]">
            <section className="bg-[#f7f7f7] p-6">
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">ביטול עסקה - עיקרי הדברים</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li>ניתן לבטל עסקת מכר מרחוק בתוך 14 ימים ממועד קבלת המוצר או ממועד קבלת מסמך פרטי העסקה, לפי המאוחר.</li>
                <li>אוכלוסיות הזכאיות לתקופה ארוכה יותר לפי דין יקבלו את הזכויות הקבועות בחוק.</li>
                <li>לא ניתן להחזיר מוצרים שנעשה בהם שימוש, מוצרים שהאריזה שלהם נפתחה מטעמי היגיינה, או מוצרים שיוצרו בהתאמה אישית, בכפוף לדין.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">תנאים להחזרה</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>המוצר צריך להיות במצבו המקורי, ללא שימוש וללא נזק.</li>
                <li>התגיות והאריזה המקורית צריכות להישמר ככל האפשר.</li>
                <li>הודעת ביטול צריכה להישלח בכתב בתוך המועד הקבוע בדין.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">דמי ביטול והחזר כספי</h2>
              <p className="mt-3 text-sm">
                במקרה של ביטול שאינו עקב פגם, ייתכן שייגבו דמי ביטול בהתאם לדין. במקרה של פגם או אי התאמה, הטיפול יבוצע בהתאם להוראות החוק.
              </p>
              <p className="mt-3 text-sm">
                החזר כספי יבוצע לאמצעי התשלום המקורי, בכפוף לקבלת המוצר ובדיקתו.
              </p>
            </section>

            <section className="bg-background p-6">
              <h2 className="font-['Noto_Serif'] text-xl text-[#111]">איך מבטלים עסקה?</h2>
              <p className="mt-3 text-sm">ניתן לשלוח הודעת ביטול באחת מהדרכים הבאות:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>דואר אלקטרוני: <a href={`mailto:${BUSINESS_INFO.email}`} className="underline"><Mark>{BUSINESS_INFO.email}</Mark></a></li>
                <li>טלפון: <a href={`tel:${BUSINESS_INFO.phone}`} className="underline"><Mark>{BUSINESS_INFO.phone}</Mark></a>, בימים ובשעות <Mark>{BUSINESS_INFO.serviceHours}</Mark></li>
                <li>דרך פרופיל המשתמש באתר: <a href="/cancel-order" className="underline">ביטול עסקה</a></li>
              </ul>
            </section>

            <section className="border border-[#eee] p-5 text-sm text-[#555]">
              <p>
                מדיניות זו נועדה לשקף את עיקרי הדין, אך אינה מהווה ייעוץ משפטי. במקרה של סתירה, הוראות הדין יחולו.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
