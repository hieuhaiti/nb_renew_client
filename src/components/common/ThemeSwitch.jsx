import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

/**
 * ThemeSwitch — toggles dark/light mode via ThemeContext.
 * Uses Radix Tooltip for accessibility.
 */
export default function ThemeSwitch() {
  const { t } = useTranslation();
  const { isDark, toggleDark } = useTheme();

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            id="theme-switch-btn"
            aria-label={t('theme.toggle')}
            className="flex h-8 items-center gap-1.5 rounded-full bg-card px-3 shadow-md transition-colors duration-200 hover:bg-[var(--surface-hover)]"
            onClick={toggleDark}
            type="button"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span className="hidden sm:inline text-xs font-medium text-foreground">
              {isDark ? t('theme.dark') : t('theme.light')}
            </span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={4}
            className="z-50 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs shadow-md border border-border"
          >
            {isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
