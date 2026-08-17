import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SUPPORTED_LANGUAGES = ['vi', 'en'];
export const DEFAULT_LANGUAGE = 'vi';

function getSupportedLanguage(lang) {
  const value = String(lang || '').toLowerCase();

  if (value.startsWith('en')) return 'en';
  if (value.startsWith('vi')) return 'vi';

  return null;
}

export function normalizeLanguage(lang) {
  return getSupportedLanguage(lang) || DEFAULT_LANGUAGE;
}

export function getBrowserLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const browserLanguages =
    Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

  const matchedLanguage = browserLanguages.map(getSupportedLanguage).find(Boolean);

  return matchedLanguage || DEFAULT_LANGUAGE;
}

/**
 * Language store: browser language on first load, persisted choice after that.
 * Used by LanguageSwitch, i18n sync, and API language params.
 */
export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: getBrowserLanguage(),
      setLang: (lang) => set({ lang: normalizeLanguage(lang) }),
    }),
    { name: 'language-store' }
  )
);
