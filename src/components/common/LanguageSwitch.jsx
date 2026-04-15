import React from 'react';
import i18n from '@/i18n';
import viFlag from '@/assets/icons/frags/vietnam-flag-round-circle-icon.svg';
import enFlag from '@/assets/icons/frags/uk-flag-round-circle-icon.svg';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { Button } from '@/components/ui/button';

/**
 * LanguageSwitch — toggles between Vietnamese and English.
 * Syncs with i18n and useLanguageStore (persisted).
 */
export default function LanguageSwitch() {
  const lang = useLanguageStore((state) => state.lang);
  const setLang = useLanguageStore((state) => state.setLang);

  const handleToggle = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    i18n.changeLanguage(next);
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            id="language-switch-btn"
            aria-label="Toggle language"
            className="flex h-8 items-center gap-1.5 rounded-full bg-card px-3 shadow-md transition-colors duration-200 hover:bg-[var(--surface-hover)]"
            onClick={handleToggle}
            type="button"
          >
            {lang === 'vi' ? (
              <img
                src={viFlag}
                alt="VN"
                className="w-5 h-5 object-cover rounded-full"
              />
            ) : (
              <img
                src={enFlag}
                alt="EN"
                className="w-5 h-5 object-cover rounded-full"
              />
            )}
            <span className="hidden sm:inline text-xs font-medium">
              {lang === 'vi' ? 'VI' : 'EN'}
            </span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={4}
            className="z-50 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs shadow-md border border-border"
          >
            {lang === 'vi'
              ? 'Chuyển sang English'
              : 'Switch to Vietnamese'}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
