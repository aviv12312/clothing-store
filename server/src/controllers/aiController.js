import Groq from 'groq-sdk';
import Product from '../models/Product.js';

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'הודעה ריקה' });
    }

    // שלוף מוצרים פעילים מהדאטהבייס לתת לבוט הקשר
    const allProducts = await Product.find({ isActive: true })
      .select('name description price salePrice category sizes colors stock')
      .limit(30);

    const productList = allProducts.map(p =>
      `- ${p.name} | קטגוריה: ${p.category} | מחיר: ₪${p.salePrice || p.price} | מידות: ${p.sizes?.join(', ') || 'לא צוין'} | צבעים: ${p.colors?.join(', ') || 'לא צוין'} | במלאי: ${p.stock > 0 ? 'כן' : 'אזל'}`
    ).join('\n');

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `אתה עוזר חכם ומקצועי של חנות הבגדים Dream & Work — חנות גברים אלגנטית.

המוצרים הזמינים כרגע בחנות:
${productList || 'אין מוצרים זמינים כרגע'}

אתה יכול לעזור עם:
🛍️ מוצרים — מחירים, מידות, צבעים, זמינות במלאי
👔 סגנון — המלצות לאירועים (חתונה, עבודה, יציאה, קז'ואל)
📏 מידות — השוואה בין מידות, איך לבחור מידה נכונה
🚚 משלוחים — 3-5 ימי עסקים, משלוח חינם מעל ₪300
↩️ החזרות — ניתן להחזיר עד 14 יום מהקבלה, בתנאי שהבגד לא נלבש
💳 תשלום — PayPal, כרטיס אשראי
📞 שירות לקוחות — זמינים בימים א׳-ה׳ 9:00-18:00

כללים:
- ענה תמיד בעברית, בסגנון ידידותי וחם
- אם שואלים על מוצר ספציפי — בדוק אם הוא קיים ברשימה למעלה
- אם שואלים שאלות שאינן קשורות לחנות או לאופנה — סרב בנימוס
- כשממליץ על מוצר — ציין את שמו המדויק כפי שמופיע ברשימה

החזר JSON בלבד, ללא markdown, בפורמט הזה:
{
  "categories": ["קטגוריות רלוונטיות מ: חתן ומלווים, Casual, Formal — או מערך ריק"],
  "productNames": ["שמות מוצרים ספציפיים שהמלצת עליהם — או מערך ריק"],
  "reply": "תשובה ידידותית בעברית"
}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content?.trim() || '';

    let parsed;
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { categories: [], productNames: [], reply: text || 'אשמח לעזור! תוכל לפרט יותר?' };
    }

    // חיפוש מוצרים לפי מה שהבוט המליץ
    let products = [];

    if (parsed.productNames?.length) {
      // חפש לפי שמות ספציפיים שהבוט ציין
      products = await Product.find({
        isActive: true,
        name: { $in: parsed.productNames.map(n => new RegExp(n, 'i')) },
      }).limit(4).select('name price salePrice category images sizes colors stock');
    }

    if (!products.length && parsed.categories?.length) {
      // נפול בחזרה לחיפוש לפי קטגוריה
      products = await Product.find({
        isActive: true,
        category: { $in: parsed.categories },
      }).limit(4).select('name price salePrice category images sizes colors stock');
    }

    res.json({ reply: parsed.reply, products });

  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ error: 'שגיאה בשרת ה-AI' });
  }
};
