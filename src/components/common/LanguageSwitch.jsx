import React from 'react';
import i18n from '@/i18n';
import viFlag from '@/assets/icons/frags/vietnam-flag-round-circle-icon.svg';
import enFlag from '@/assets/icons/frags/uk-flag-round-circle-icon.svg';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
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
            className="bg-card hover:bg-muted flex h-8 items-center gap-1.5 rounded-full px-3 shadow-md transition-colors duration-200"
            onClick={handleToggle}
            type="button"
          >
            {lang === 'vi' ? (
              <img src={viFlag} alt="VN" className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <img src={enFlag} alt="EN" className="h-5 w-5 rounded-full object-cover" />
            )}
            <span className="typo-meta hidden sm:inline">{lang === 'vi' ? 'VI' : 'EN'}</span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={4}
            className="bg-popover text-popover-foreground border-border z-50 rounded-md border px-2 py-1 text-sm shadow-md"
          >
            {lang === 'vi' ? 'Chuyển sang English' : 'Switch to Vietnamese'}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
