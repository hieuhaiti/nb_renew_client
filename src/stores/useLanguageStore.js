import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Language store — persists the selected UI language.
 * Used by LanguageSwitch and i18n sync.
 */
export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: 'vi',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'language-store' }
  )
);
