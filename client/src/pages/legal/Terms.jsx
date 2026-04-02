export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20" dir="rtl">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
        <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">תקנון ותנאי שימוש</h1>
        <p className="mt-2 font-['Manrope'] text-sm text-[#888]">עדכון אחרון: אפריל 2025</p>

        <div className="mt-10 space-y-8 font-['Manrope'] text-[#333] leading-relaxed">

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">1. פרטי העסק</h2>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>שם החברה:</strong> <span className="bg-yellow-100 px-1">[שם החברה הרשמי]</span></p>
              <p><strong>ח.פ / עוסק מורשה:</strong> <span className="bg-yellow-100 px-1">[מספר עוסק מורשה]</span></p>
              <p><strong>כתובת:</strong> <span className="bg-yellow-100 px-1">[כתובת פיזית מלאה]</span></p>
              <p><strong>טלפון:</strong> <span className="bg-yellow-100 px-1">[מספר טלפון]</span></p>
              <p><strong>דואר אלקטרוני:</strong> <span className="bg-yellow-100 px-1">[מייל שירות לקוחות]</span></p>
            </div>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">2. כללי</h2>
            <p className="mt-3 text-sm">
              השימוש באתר מהווה הסכמה לתנאי שימוש אלה. האתר מיועד לרכישת ביגוד גברי. הנהלת האתר שומרת לעצמה את הזכות לשנות את תנאי השימוש בכל עת.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">3. הזמנות ותשלום</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>כל המחירים כוללים מע"מ (18%) אלא אם צוין אחרת.</li>
              <li>אישור הזמנה ישלח לדוא"ל תוך מספר דקות מסיום הרכישה.</li>
              <li>החברה שומרת לעצמה זכות לבטל הזמנה במקרה של תקלה טכנית או שגיאת מחיר מהותית.</li>
              <li>אמצעי תשלום: PayPal וכרטיסי אשראי דרך מעבד תשלום מאובטח.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">4. משלוחים</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>זמן אספקה משוער: 3–7 ימי עסקים.</li>
              <li>המשלוח מתבצע על ידי <span className="bg-yellow-100 px-1">[שם חברת המשלוחים]</span>.</li>
              <li>עלויות משלוח מוצגות בעגלת הקניות לפני השלמת הרכישה.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">5. ביטולים והחזרות</h2>
            <p className="mt-3 text-sm">
              ראה <a href="/legal/returns" className="underline text-[#111]">מדיניות ביטולים והחזרות</a> המלאה.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">6. קניין רוחני</h2>
            <p className="mt-3 text-sm">
              כל התכנים באתר — תמונות, טקסטים, עיצוב — הם רכוש החברה. אין להעתיק, לשכפל או לעשות שימוש מסחרי ללא אישור בכתב.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">7. הגבלת אחריות</h2>
            <p className="mt-3 text-sm">
              החברה לא תישא באחריות לנזקים עקיפים הנובעים משימוש באתר. אחריות החברה מוגבלת לסכום העסקה הספציפית.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">8. סמכות שיפוט</h2>
            <p className="mt-3 text-sm">
              על תנאים אלה חלים דיני מדינת ישראל. סמכות השיפוט הבלעדית לבתי המשפט ב<span className="bg-yellow-100 px-1">[עיר]</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
