import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@/locales/en/translation.json';
import viTranslation from '@/locales/vi/translation.json';

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
  },
  showSupportNotice: false,
  fallbackLng: 'vi',
  defaultNS: 'translation',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});

export default i18n;
