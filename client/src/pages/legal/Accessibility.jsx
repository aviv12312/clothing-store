export default function Accessibility() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20" dir="rtl">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
        <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">הצהרת נגישות</h1>
        <p className="mt-2 font-['Manrope'] text-sm text-[#888]">בהתאם לתקן ישראלי 5568 (WCAG 2.1 רמה AA)</p>

        <div className="mt-10 space-y-8 font-['Manrope'] text-[#333] leading-relaxed">

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">מחויבותנו לנגישות</h2>
            <p className="mt-3 text-sm">
              Dream & Work מחויבת להנגשת האתר לכלל המשתמשים, לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ולתקן הישראלי IS 5568.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">התאמות הנגישות באתר</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>ניווט מלא באמצעות מקלדת בכל חלקי האתר.</li>
              <li>תגיות ARIA סמנטיות לקוראי מסך.</li>
              <li>טקסט חלופי (alt text) לכל התמונות.</li>
              <li>ניגודיות צבעים עומדת בדרישות WCAG AA.</li>
              <li>האתר תומך בהגדלת גופן דרך הדפדפן.</li>
              <li>הודעות שגיאה וטפסים נגישים לקוראי מסך.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">מה עדיין בתהליך</h2>
            <p className="mt-3 text-sm">
              אנו עובדים באופן שוטף על שיפור הנגישות. ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם. אנו מתחייבים לטפל בכל פנייה בנושא נגישות בהקדם.
            </p>
          </section>

          <section className="bg-[#f7f7f7] p-6">
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">רכז הנגישות</h2>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>שם:</strong> <span className="bg-yellow-100 px-1">[שם רכז הנגישות]</span></p>
              <p><strong>דואר אלקטרוני:</strong> <span className="bg-yellow-100 px-1">[מייל רכז נגישות]</span></p>
              <p><strong>טלפון:</strong> <span className="bg-yellow-100 px-1">[מספר טלפון]</span></p>
            </div>
            <p className="mt-4 text-sm text-[#555]">
              נתקלת בבעיית נגישות? פנה אלינו ונטפל בכך בהקדם האפשרי.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">תאריך עדכון</h2>
            <p className="mt-3 text-sm">הצהרה זו עודכנה לאחרונה באפריל 2025.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
