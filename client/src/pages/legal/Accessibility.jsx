import Footer from '../../components/layout/Footer';
import { BUSINESS_INFO, isPlaceholder } from '../../data/businessInfo';

function Mark({ children }) {
  return <span className={isPlaceholder(children) ? 'rounded bg-yellow-100 px-1 text-[#9C5A40]' : ''}>{children}</span>;
}

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="px-6 pb-20 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#5A6B7F]">מסמך משפטי</p>
          <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#13243A]">הצהרת נגישות</h1>
          <p className="mt-2 font-['Manrope'] text-sm text-[#8AA3B8]">יעד הנגשה: תקן ישראלי 5568 ו-WCAG 2.1 ברמה AA</p>

          <div className="mt-10 space-y-8 font-['Manrope'] leading-relaxed text-[#5A6B7F]">
            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#13243A]">מחויבות לנגישות</h2>
              <p className="mt-3 text-sm">
                Dream & Work פועלת לשיפור נגישות האתר עבור כלל המשתמשים, לרבות אנשים עם מוגבלויות. האתר נמצא בתהליך שיפור מתמשך ולא מוצג כאן כאתר שנבדק ואושר באופן מלא על ידי גורם נגישות חיצוני.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#13243A]">התאמות נגישות באתר</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
                <li>שימוש ב-landmarks סמנטיים כמו header, main, nav ו-footer.</li>
                <li>תוויות נגישות לכפתורי אייקון ולפעולות מרכזיות.</li>
                <li>תמיכה בניווט מקלדת בסיסי ובמצבי focus גלויים.</li>
                <li>כיבוד העדפת משתמשים להפחתת תנועה באמצעות prefers-reduced-motion.</li>
                <li>שימוש בטקסט חלופי לתמונות תוכן כאשר הוא זמין.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#13243A]">מה עדיין בתהליך</h2>
              <p className="mt-3 text-sm">
                לפני עלייה לאוויר מומלץ לבצע בדיקת נגישות ידנית מלאה, כולל קורא מסך, ניווט מקלדת, טפסים, עגלת קניות ותהליך checkout.
              </p>
            </section>

            <section className="bg-[#FFFBF2] p-6">
              <h2 className="font-['Noto_Serif'] text-xl text-[#13243A]">רכז נגישות</h2>
              <div className="mt-3 space-y-1 text-sm">
                <p><strong>שם:</strong> <Mark>{BUSINESS_INFO.accessibilityCoordinatorName}</Mark></p>
                <p><strong>דואר אלקטרוני:</strong> <a href={`mailto:${BUSINESS_INFO.accessibilityCoordinatorEmail}`} className="underline"><Mark>{BUSINESS_INFO.accessibilityCoordinatorEmail}</Mark></a></p>
                <p><strong>טלפון:</strong> <a href={`tel:${BUSINESS_INFO.phone}`} className="underline"><Mark>{BUSINESS_INFO.phone}</Mark></a></p>
              </div>
              <p className="mt-4 text-sm text-[#5A6B7F]">
                נתקלת בבעיית נגישות? ניתן לפנות אלינו ונפעל לטפל בפנייה בהקדם האפשרי.
              </p>
            </section>

            <section>
              <h2 className="font-['Noto_Serif'] text-xl text-[#13243A]">תאריך עדכון</h2>
              <p className="mt-3 text-sm">הצהרה זו עודכנה במאי 2026.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
