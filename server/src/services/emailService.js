import nodemailer from 'nodemailer';
import Coupon from '../models/Coupon.js';

const STATUS_META = {
  'בטיפול':         { emoji: '⏳', title: 'ההזמנה שלך בטיפול',      color: '#e9c349', msg: 'קיבלנו את הזמנתך ואנחנו מכינים אותה לשליחה.' },
  'נשלח':           { emoji: '🚚', title: 'ההזמנה שלך בדרך אליך!',   color: '#4ecdc4', msg: 'ההזמנה יצאה מהמחסן ובדרך אליך. זמן אספקה: 3–5 ימי עסקים.' },
  'הגיע':           { emoji: '✅', title: 'ההזמנה הגיעה!',            color: '#6bcb77', msg: 'ההזמנה נמסרה. נשמח אם תדרג את החוויה שלך.' },
  'בוטל':           { emoji: '❌', title: 'ההזמנה בוטלה',             color: '#e74c3c', msg: 'ההזמנה בוטלה. לשאלות — צור איתנו קשר.' },
  'ממתין לאישור':   { emoji: '🕐', title: 'ממתינים לאישור הזמנה',    color: '#e9c349', msg: 'הזמנתך התקבלה ואנחנו בודקים את פרטי התשלום.' },
};

const getTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendAdminNewOrderAlert = async (order, customerName, customerEmail) => {
  const transporter = getTransporter();
  const itemsHTML = order.items?.map((item) =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e7e5e5;font-size:13px;">${item.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#767575;font-size:12px;text-align:center;">${item.size || '-'} / ${item.color || '-'}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e9c349;font-size:13px;text-align:left;">x${item.quantity} · ₪${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:32px 0;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:24px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
                <p style="margin:6px 0 0;color:#6bcb77;font-size:11px;letter-spacing:3px;">✦ הזמנה חדשה התקבלה</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 16px;">
                <p style="margin:0;color:#e7e5e5;font-size:15px;">שלום מנהל,</p>
                <p style="margin:10px 0 0;color:#767575;font-size:14px;line-height:1.7;">
                  <strong style="color:#e7e5e5;">${customerName}</strong> (${customerEmail}) ביצע הזמנה חדשה.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">מספר הזמנה</p>
                <p style="margin:6px 0 0;color:#e9c349;font-size:18px;letter-spacing:2px;">#${String(order._id).slice(-6).toUpperCase()}</p>
                <p style="margin:8px 0 0;color:#6bcb77;font-size:13px;">סה"כ: ₪${order.totalPrice?.toFixed(2)}</p>
              </td>
            </tr>
            <tr><td style="padding:8px 0;"></td></tr>
            <tr>
              <td style="padding:20px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0 0 14px;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">פרטי ההזמנה</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHTML}
                  <tr>
                    <td colspan="2" style="padding-top:12px;color:#767575;font-size:12px;">סה"כ</td>
                    <td style="padding-top:12px;text-align:left;color:#e9c349;font-size:16px;font-weight:bold;">₪${order.totalPrice?.toFixed(2)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${order.shippingAddress ? `
            <tr><td style="padding:8px 0;"></td></tr>
            <tr>
              <td style="padding:16px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">כתובת משלוח</p>
                <p style="margin:8px 0 0;color:#b0b0b0;font-size:13px;">
                  ${order.shippingAddress.name} · ${order.shippingAddress.street}, ${order.shippingAddress.city}
                  ${order.shippingAddress.phone ? ` · ${order.shippingAddress.phone}` : ''}
                </p>
              </td>
            </tr>` : ''}
            <tr>
              <td style="padding:28px 0 16px;text-align:center;border-top:1px solid #1e1e1e;margin-top:16px;">
                <p style="margin:0;color:#555;font-size:11px;letter-spacing:2px;">DREAM & WORK Admin · © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `✦ הזמנה חדשה #${String(order._id).slice(-6).toUpperCase()} — ${customerName} · ₪${order.totalPrice?.toFixed(2)}`,
    html,
  });
};

export const sendAdminCancellationAlert = async (order, customerName, customerEmail) => {
  const transporter = getTransporter();
  const itemsHTML = order.items?.map((item) =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e7e5e5;font-size:13px;">${item.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#767575;font-size:12px;text-align:center;">${item.size || '-'} / ${item.color || '-'}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e9c349;font-size:13px;text-align:left;">x${item.quantity} · ₪${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:32px 0;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:24px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
                <p style="margin:6px 0 0;color:#e74c3c;font-size:11px;letter-spacing:3px;">⚠️ הודעת ביטול הזמנה</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 0 20px;">
                <p style="margin:0;color:#e7e5e5;font-size:15px;">שלום מנהל,</p>
                <p style="margin:10px 0 0;color:#767575;font-size:14px;line-height:1.7;">
                  הלקוח <strong style="color:#e7e5e5;">${customerName}</strong> (${customerEmail}) ביטל את הזמנתו.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;background:#111;border:1px solid #1e1e1e;margin-bottom:16px;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">מספר הזמנה</p>
                <p style="margin:6px 0 0;color:#e9c349;font-size:18px;letter-spacing:2px;">#${String(order._id).slice(-6).toUpperCase()}</p>
                <p style="margin:8px 0 0;color:#555;font-size:12px;">סה"כ: <span style="color:#e74c3c;">₪${order.totalPrice?.toFixed(2)}</span></p>
              </td>
            </tr>
            <tr><td style="padding:8px 0;"></td></tr>
            <tr>
              <td style="padding:20px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0 0 14px;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">פרטי ההזמנה המבוטלת</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHTML}
                </table>
              </td>
            </tr>
            ${order.shippingAddress ? `
            <tr><td style="padding:8px 0;"></td></tr>
            <tr>
              <td style="padding:16px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">כתובת שנרשמה</p>
                <p style="margin:8px 0 0;color:#b0b0b0;font-size:13px;">
                  ${order.shippingAddress.name} · ${order.shippingAddress.street}, ${order.shippingAddress.city}
                </p>
              </td>
            </tr>` : ''}
            <tr>
              <td style="padding:32px 0 20px;text-align:center;border-top:1px solid #1e1e1e;margin-top:16px;">
                <p style="margin:0;color:#555;font-size:11px;letter-spacing:2px;">DREAM & WORK Admin · © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ ביטול הזמנה #${String(order._id).slice(-6).toUpperCase()} — ${customerName}`,
    html,
  });
};

export const sendStatusUpdate = async (order, userEmail, userName, newStatus) => {
  const transporter = getTransporter();
  const meta = STATUS_META[newStatus] || { emoji: '📦', title: `סטטוס הזמנה עודכן: ${newStatus}`, color: '#e9c349', msg: '' };

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 0;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">${meta.emoji}</div>
                <h2 style="margin:0;color:${meta.color};font-size:22px;font-weight:300;letter-spacing:2px;">${meta.title}</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 24px;">
                <p style="margin:0;color:#e7e5e5;font-size:15px;">שלום ${userName},</p>
                <p style="margin:12px 0 0;color:#767575;font-size:14px;line-height:1.7;">${meta.msg}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">מספר הזמנה</p>
                <p style="margin:6px 0 0;color:#e9c349;font-size:18px;letter-spacing:2px;">#${String(order._id).slice(-6).toUpperCase()}</p>
                <p style="margin:12px 0 0;color:#555;font-size:11px;letter-spacing:1px;">סטטוס נוכחי: <span style="color:${meta.color};">${newStatus}</span></p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0 20px;text-align:center;border-top:1px solid #1e1e1e;margin-top:24px;">
                <p style="margin:0;color:#767575;font-size:12px;line-height:1.8;">
                  לשאלות: <a href="mailto:${process.env.EMAIL_USER}" style="color:#e9c349;text-decoration:none;">${process.env.EMAIL_USER}</a>
                </p>
                <p style="margin:12px 0 0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `${meta.emoji} ${meta.title} — Dream & Work`,
    html,
  });
};

export const sendNewsletterWelcome = async (email) => {
  const transporter = getTransporter();
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 0 24px;text-align:center;">
                <h2 style="margin:0;color:#e7e5e5;font-size:22px;font-weight:300;letter-spacing:2px;">ברוכים הבאים למשפחה ✦</h2>
                <p style="margin:16px 0 0;color:#767575;font-size:14px;line-height:1.8;">
                  הצטרפת לרשימת הלקוחות המיוחדים שלנו.<br>
                  תהיה הראשון לדעת על קולקציות חדשות, מבצעים בלעדיים ואירועים מיוחדים.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;background:#111;border:1px solid #1e1e1e;text-align:center;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">מה מחכה לך</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align:center;padding:12px;">
                      <p style="margin:0;font-size:24px;">👔</p>
                      <p style="margin:8px 0 0;color:#e7e5e5;font-size:12px;letter-spacing:1px;">קולקציות חדשות</p>
                    </td>
                    <td style="text-align:center;padding:12px;">
                      <p style="margin:0;font-size:24px;">🏷️</p>
                      <p style="margin:8px 0 0;color:#e7e5e5;font-size:12px;letter-spacing:1px;">מבצעים בלעדיים</p>
                    </td>
                    <td style="text-align:center;padding:12px;">
                      <p style="margin:0;font-size:24px;">✦</p>
                      <p style="margin:8px 0 0;color:#e7e5e5;font-size:12px;letter-spacing:1px;">Early Access</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0;text-align:center;border-top:1px solid #1e1e1e;margin-top:24px;">
                <p style="margin:0;color:#555;font-size:11px;line-height:1.8;">
                  לביטול הרשמה: <a href="${process.env.CLIENT_URL}/unsubscribe/${email}" style="color:#767575;text-decoration:none;">לחץ כאן</a>
                </p>
                <p style="margin:8px 0 0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✦ ברוכים הבאים ל-Dream & Work',
    html,
  });
};

export const sendOrderConfirmation = async (order, userEmail, userName) => {
  const transporter = getTransporter();

  const itemsHTML = order.items?.map((item) => `
    <tr>
      <td style="padding:12px 0; border-bottom:1px solid #1e1e1e; font-size:14px; color:#e7e5e5;">
        ${item.name}
        ${item.size ? `<br><span style="color:#767575;font-size:12px;">מידה: ${item.size}</span>` : ''}
        ${item.color ? `<span style="color:#767575;font-size:12px;"> · צבע: ${item.color}</span>` : ''}
      </td>
      <td style="padding:12px 0; border-bottom:1px solid #1e1e1e; text-align:center; color:#767575; font-size:14px;">x${item.quantity}</td>
      <td style="padding:12px 0; border-bottom:1px solid #1e1e1e; text-align:left; color:#e9c349; font-size:14px;">₪${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
                <p style="margin:8px 0 0;color:#767575;font-size:11px;letter-spacing:3px;text-transform:uppercase;">אישור הזמנה</p>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:32px 0 24px;">
                <p style="margin:0;color:#e7e5e5;font-size:16px;">שלום ${userName},</p>
                <p style="margin:12px 0 0;color:#767575;font-size:14px;line-height:1.6;">
                  תודה על הזמנתך! קיבלנו את ההזמנה ואנחנו מטפלים בה כעת.
                </p>
              </td>
            </tr>

            <!-- Order ID -->
            <tr>
              <td style="padding:16px 24px;background:#111;border:1px solid #1e1e1e;margin-bottom:24px;">
                <p style="margin:0;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">מספר הזמנה</p>
                <p style="margin:6px 0 0;color:#e9c349;font-size:18px;letter-spacing:2px;">#${String(order._id).slice(-6).toUpperCase()}</p>
              </td>
            </tr>

            <tr><td style="padding:8px 0;"></td></tr>

            <!-- Items -->
            <tr>
              <td style="padding:24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0 0 16px;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">פרטי ההזמנה</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th style="text-align:right;color:#555;font-size:11px;letter-spacing:1px;font-weight:normal;padding-bottom:12px;border-bottom:1px solid #1e1e1e;">מוצר</th>
                      <th style="text-align:center;color:#555;font-size:11px;letter-spacing:1px;font-weight:normal;padding-bottom:12px;border-bottom:1px solid #1e1e1e;">כמות</th>
                      <th style="text-align:left;color:#555;font-size:11px;letter-spacing:1px;font-weight:normal;padding-bottom:12px;border-bottom:1px solid #1e1e1e;">מחיר</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHTML}</tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding-top:16px;color:#767575;font-size:12px;">סה"כ לתשלום</td>
                      <td style="padding-top:16px;text-align:left;color:#e9c349;font-size:18px;font-weight:bold;">₪${order.totalPrice?.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <tr><td style="padding:8px 0;"></td></tr>

            <!-- Shipping -->
            ${order.shippingAddress ? `
            <tr>
              <td style="padding:20px 24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0 0 10px;color:#767575;font-size:11px;letter-spacing:2px;text-transform:uppercase;">כתובת משלוח</p>
                <p style="margin:0;color:#e7e5e5;font-size:14px;line-height:1.6;">
                  ${order.shippingAddress.name}<br>
                  ${order.shippingAddress.street}, ${order.shippingAddress.city}<br>
                  ${order.shippingAddress.phone || ''}
                </p>
              </td>
            </tr>
            ` : ''}

            <!-- Footer -->
            <tr>
              <td style="padding:40px 0 20px;text-align:center;border-top:1px solid #1e1e1e;margin-top:24px;">
                <p style="margin:0;color:#767575;font-size:12px;line-height:1.8;">
                  זמן אספקה: 3–5 ימי עסקים<br>
                  לשאלות: <a href="mailto:${process.env.EMAIL_USER}" style="color:#e9c349;text-decoration:none;">${process.env.EMAIL_USER}</a>
                </p>
                <p style="margin:16px 0 0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✦ אישור הזמנה #${String(order._id).slice(-6).toUpperCase()} — Dream & Work`,
    html,
  });
};

export const sendAbandonedCart = async (email, name, items, total) => {
  const transporter = getTransporter();

  const itemsHTML = items.slice(0, 3).map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
        ${item.image ? `<img src="${item.image}" width="60" height="60" style="object-fit:cover;display:block;" />` : ''}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;">
        <p style="margin:0;color:#e7e5e5;font-size:14px;">${item.name}</p>
        ${item.size ? `<p style="margin:4px 0 0;color:#767575;font-size:12px;">מידה: ${item.size}${item.color ? ` · ${item.color}` : ''}</p>` : ''}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;text-align:left;color:#e9c349;font-size:14px;">
        ₪${item.price}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 0 24px;text-align:center;">
                <h2 style="margin:0;color:#e7e5e5;font-size:22px;font-weight:300;">שכחת משהו? 🛒</h2>
                <p style="margin:12px 0 0;color:#767575;font-size:14px;line-height:1.7;">
                  שלום ${name}, ראינו שהשארת פריטים בעגלה.<br>
                  הם עדיין מחכים לך — אבל המלאי מוגבל.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;background:#111;border:1px solid #1e1e1e;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHTML}
                  <tr>
                    <td colspan="2" style="padding-top:16px;color:#767575;font-size:12px;">סה"כ</td>
                    <td style="padding-top:16px;text-align:left;color:#e9c349;font-size:18px;font-weight:bold;">₪${total?.toFixed(2)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0;text-align:center;">
                <a href="${process.env.CLIENT_URL}/cart"
                   style="display:inline-block;background:#e9c349;color:#131313;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
                  השלם את הרכישה ←
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0;text-align:center;border-top:1px solid #1e1e1e;">
                <p style="margin:0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🛒 שכחת משהו? הפריטים שלך מחכים — Dream & Work',
    html,
  });
};

export const sendAbandonedCartDiscount = async (email, name, items, total) => {
  const transporter = getTransporter();

  // יצירת קוד ייחודי
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const discountCode = `BACK10-${randomPart}`;

  // שמירה ב-DB — תקף 48 שעות
  await Coupon.create({
    code: discountCode,
    discount: 10,
    email,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  const discountedTotal = (total * 0.9).toFixed(2);

  const itemsHTML = items.slice(0, 3).map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
        ${item.image ? `<img src="${item.image}" width="50" height="50" style="object-fit:cover;" />` : ''}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e1e1e;">
        <p style="margin:0;color:#e7e5e5;font-size:13px;">${item.name}</p>
        ${item.size ? `<p style="margin:3px 0 0;color:#767575;font-size:11px;">מידה: ${item.size}</p>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;text-align:left;color:#e9c349;font-size:13px;">₪${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 0 24px;text-align:center;">
                <h2 style="margin:0;color:#e7e5e5;font-size:22px;font-weight:300;">מתנה בשבילך 🎁</h2>
                <p style="margin:12px 0 0;color:#767575;font-size:14px;line-height:1.7;">
                  שלום ${name}, הפריטים שלך עדיין בעגלה.<br>
                  כמחווה מיוחדת — הנה קוד הנחה של <strong style="color:#e9c349;">10%</strong> על ההזמנה שלך.
                </p>
              </td>
            </tr>

            <!-- קוד הנחה -->
            <tr>
              <td style="padding:24px;text-align:center;">
                <div style="display:inline-block;border:2px dashed #e9c349;padding:16px 40px;background:#111;">
                  <p style="margin:0;color:#767575;font-size:10px;letter-spacing:3px;text-transform:uppercase;">קוד הנחה</p>
                  <p style="margin:8px 0 0;color:#e9c349;font-size:28px;font-weight:bold;letter-spacing:6px;">${discountCode}</p>
                  <p style="margin:8px 0 0;color:#555;font-size:11px;">תקף ל-48 שעות בלבד</p>
                </div>
              </td>
            </tr>

            <!-- מוצרים -->
            <tr>
              <td style="padding:0 24px 24px;background:#111;border:1px solid #1e1e1e;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHTML}
                  <tr>
                    <td colspan="2" style="padding-top:12px;color:#767575;font-size:12px;">
                      <span style="text-decoration:line-through;color:#444;">₪${total?.toFixed(2)}</span>
                      &nbsp;→ אחרי הנחה:
                    </td>
                    <td style="padding-top:12px;text-align:left;color:#e9c349;font-size:18px;font-weight:bold;">₪${discountedTotal}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 0;text-align:center;">
                <a href="${process.env.CLIENT_URL}/cart"
                   style="display:inline-block;background:#e9c349;color:#131313;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
                  מימוש ההנחה ←
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0;text-align:center;border-top:1px solid #1e1e1e;">
                <p style="margin:0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎁 10% הנחה מיוחדת רק בשבילך — Dream & Work',
    html,
  });
};

export const sendPasswordReset = async (email, userName, resetUrl) => {
  const transporter = getTransporter();
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 0 30px;text-align:center;border-bottom:1px solid #1e1e1e;">
                <h1 style="margin:0;color:#e9c349;font-size:28px;font-weight:300;letter-spacing:4px;">DREAM & WORK</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 0 24px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">🔑</div>
                <h2 style="margin:0;color:#e2e2e2;font-size:22px;font-weight:300;">איפוס סיסמה</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 32px;">
                <p style="margin:0 0 12px;color:#e7e5e5;font-size:15px;">שלום ${userName},</p>
                <p style="margin:0;color:#767575;font-size:14px;line-height:1.6;">
                  קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הכפתור למטה תוך <strong style="color:#e9c349;">30 דקות</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 32px;text-align:center;">
                <a href="${resetUrl}" style="display:inline-block;background:#e9c349;color:#131313;padding:16px 40px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">
                  איפוס סיסמה
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;background:#111;border:1px solid #1e1e1e;">
                <p style="margin:0;color:#555;font-size:12px;line-height:1.6;">
                  אם לא ביקשת לאפס סיסמה — התעלם מאימייל זה. הסיסמה שלך לא תשתנה.<br>
                  הקישור תקף ל-30 דקות בלבד.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0 0;text-align:center;border-top:1px solid #1e1e1e;margin-top:24px;">
                <p style="margin:0;color:#333;font-size:11px;letter-spacing:2px;">DREAM & WORK © 2025</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
  await transporter.sendMail({
    from: `"Dream & Work" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔑 איפוס סיסמה — Dream & Work',
    html,
  });
};

