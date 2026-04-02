export default function Returns() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20" dir="rtl">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
        <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">מדיניות ביטולים והחזרות</h1>
        <p className="mt-2 font-['Manrope'] text-sm text-[#888]">בהתאם לחוק הגנת הצרכן, תשמ"א-1981</p>

        <div className="mt-10 space-y-8 font-['Manrope'] text-[#333] leading-relaxed">

          <section className="bg-[#f7f7f7] p-6">
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">ביטול עסקה — עיקרי הדברים</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3"><span className="text-green-600 font-bold">✓</span><span><strong>14 ימים</strong> לביטול מיום קבלת המוצר — לרכישות אינטרנטיות.</span></li>
              <li className="flex gap-3"><span className="text-green-600 font-bold">✓</span><span><strong>4 חודשים</strong> לביטול לקשישים מעל 65, עולים חדשים (עד 5 שנים), ואנשים עם מוגבלות.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">✗</span><span><strong>לא ניתן להחזיר:</strong> תחתונים, בגדי ים, ופריטים שנפתחה האריזה שלהם מטעמי היגיינה.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">✗</span><span><strong>לא ניתן להחזיר:</strong> פריטים שיוצרו לפי הזמנה אישית / בהתאמה אישית.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">תנאים להחזרה</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>המוצר חייב להיות במצבו המקורי — לא נלבש, לא נוקה.</li>
              <li>התגים והאריזה המקורית שלמים.</li>
              <li>ביטול יתקבל בתנאי שנשלחה הודעת ביטול בכתב תוך המועד הקבוע.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">דמי ביטול</h2>
            <p className="mt-3 text-sm">
              במקרה של ביטול שאינו עקב פגם — תיגבה עמלת ביטול של <strong>5% ממחיר הקנייה, לא יותר מ-100 ₪</strong>.
              במקרה של ביטול עקב פגם במוצר — אין עמלת ביטול והמשלוח חזרה על חשבוננו.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">זיכוי / החזר כספי</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>ההחזר הכספי יבוצע תוך <strong>14 ימי עסקים</strong> מקבלת המוצר חזרה.</li>
              <li>ההחזר יתבצע לאמצעי התשלום המקורי.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">כיצד לבטל עסקה</h2>
            <p className="mt-3 text-sm">
              ניתן לבטל עסקה בדרכים הבאות:
            </p>
            <ul className="mt-2 space-y-2 text-sm list-disc list-inside">
              <li>דוא"ל: <span className="bg-yellow-100 px-1">[מייל שירות לקוחות]</span></li>
              <li>טלפון: <span className="bg-yellow-100 px-1">[מספר טלפון]</span> — ימים א'-ה' בשעות <span className="bg-yellow-100 px-1">[שעות שירות]</span></li>
              <li>דרך פרופיל המשתמש באתר — עמוד ההזמנות שלי</li>
            </ul>
          </section>

          <section className="border border-[#eee] p-5 text-sm text-[#555]">
            <p>
              מדיניות זו נכתבה בהתאם לחוק הגנת הצרכן, תשמ"א-1981, ותקנות הגנת הצרכן (ביטול עסקה), תשע"א-2010.
              בכל מקרה של סתירה — הוראות החוק יגברו.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
