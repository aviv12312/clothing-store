export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20" dir="rtl">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-['Manrope'] text-[0.65rem] uppercase tracking-[0.3rem] text-[#6e6667]">מסמך משפטי</p>
        <h1 className="mt-3 font-['Noto_Serif'] text-4xl text-[#111111]">מדיניות פרטיות</h1>
        <p className="mt-2 font-['Manrope'] text-sm text-[#888]">עדכון אחרון: אפריל 2025</p>

        <div className="mt-10 space-y-8 font-['Manrope'] text-[#333] leading-relaxed">

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">1. מי אנחנו</h2>
            <p className="mt-3 text-sm">
              Dream & Work (להלן: "החברה", "אנחנו") היא חברה המפעילה חנות אינטרנטית לממכר ביגוד גברי בכתובת{' '}
              <span className="bg-yellow-100 px-1">[כתובת האתר]</span>.
              לפרטי יצירת קשר: <span className="bg-yellow-100 px-1">[מייל שירות לקוחות]</span>.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">2. מידע שאנו אוספים</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li><strong>פרטי זיהוי:</strong> שם, כתובת דואר אלקטרוני, כתובת למשלוח, מספר טלפון.</li>
              <li><strong>פרטי עסקה:</strong> פרטי הזמנות, היסטוריית קניות, שיטת תשלום (לא נשמרים פרטי כרטיס אשראי).</li>
              <li><strong>מידע טכני:</strong> כתובת IP, סוג הדפדפן, עמודים שנצפו, זמן שהייה.</li>
              <li><strong>עוגיות:</strong> כמפורט במדיניות העוגיות שלנו.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">3. כיצד אנו משתמשים במידע</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>עיבוד הזמנות ומשלוחן.</li>
              <li>שירות לקוחות וטיפול בפניות.</li>
              <li>שליחת עדכונים על הזמנות וחשבונות.</li>
              <li>שליחת ניוזלטר שיווקי — רק אם נתת הסכמה מפורשת.</li>
              <li>שיפור חוויית המשתמש ואבטחת האתר.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">4. שיתוף מידע עם צדדים שלישיים</h2>
            <p className="mt-3 text-sm">
              המידע מועבר לצדדים שלישיים אך ורק לצורך אספקת השירות: ספקי תשלום (PayPal), ספקי משלוח, ספקי דוא"ל (Brevo), ושרתי אחסון (MongoDB Atlas, Cloudinary).
              לא נמכור, נשכיר, או נשתף מידע אישי למטרות שיווקיות ללא הסכמתך.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">5. זכויותיך (תיקון 13 לחוק הגנת הפרטיות)</h2>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li><strong>עיון:</strong> זכות לקבל עותק של המידע שנשמר עליך.</li>
              <li><strong>תיקון:</strong> זכות לתקן מידע שגוי.</li>
              <li><strong>מחיקה:</strong> זכות למחיקת כל המידע האישי שלך מהמערכת.</li>
              <li><strong>ביטול הסכמה:</strong> ניתן לבטל הסכמה לדיוור בכל עת.</li>
            </ul>
            <p className="mt-3 text-sm">
              לממש את זכויותיך: <span className="bg-yellow-100 px-1">[מייל שירות לקוחות]</span>
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">6. אבטחת מידע</h2>
            <p className="mt-3 text-sm">
              האתר פועל תחת HTTPS. פרטי כרטיסי אשראי אינם נשמרים בשרתינו. הגישה למסד הנתונים מוגבלת ומאובטחת.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">7. שמירת מידע</h2>
            <p className="mt-3 text-sm">
              מידע על עסקאות נשמר 7 שנים בהתאם לדין הישראלי. מידע חשבון נשמר כל עוד החשבון פעיל. לאחר מחיקת החשבון — המידע נמחק תוך 30 יום.
            </p>
          </section>

          <section>
            <h2 className="font-['Noto_Serif'] text-xl text-[#111]">8. יצירת קשר</h2>
            <p className="mt-3 text-sm">
              לכל שאלה בנוגע לפרטיות: <span className="bg-yellow-100 px-1">[מייל שירות לקוחות]</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
