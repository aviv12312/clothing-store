import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { he } from './locales/he';
import { en } from './locales/en';

const LANGUAGE_KEY = 'dw_language';
const supportedLngs = ['he', 'en'];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return supportedLngs.includes(saved) ? saved : 'en';
};

export const applyDocumentLanguage = (lng) => {
  const language = supportedLngs.includes(lng) ? lng : 'he';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', (lng) => {
  window.localStorage.setItem(LANGUAGE_KEY, lng);
  applyDocumentLanguage(lng);
});

export default i18n;
