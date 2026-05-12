export const BUSINESS_INFO = {
  brand: 'Dream & Work',
  companyName: '[שם החברה הרשמי]',
  companyId: '[ח.פ / עוסק מורשה]',
  address: '[כתובת פיזית מלאה]',
  phone: '[טלפון שירות לקוחות]',
  email: '[מייל שירות לקוחות]',
  serviceHours: '[שעות שירות]',
  whatsapp: '[WhatsApp לשירות לקוחות]',
  accessibilityCoordinatorName: '[שם רכז הנגישות]',
  accessibilityCoordinatorEmail: '[מייל רכז נגישות]',
  shippingCompany: '[שם חברת המשלוחים]',
  jurisdictionCity: '[עיר סמכות שיפוט]',
  websiteUrl: '[כתובת האתר]',
};

export function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('[') && value.endsWith(']');
}
