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
            className="bg-card flex h-8 items-center gap-1.5 rounded-full px-3 shadow-md transition-colors duration-200 hover:bg-(--surface-hover)"
            onClick={toggleDark}
            type="button"
          >
            {isDark ? (
              <Moon className="text-primary h-4 w-4" />
            ) : (
              <Sun className="text-warning h-4 w-4" />
            )}
            <span className="text-foreground hidden text-xs font-medium sm:inline">
              {isDark ? t('theme.dark') : t('theme.light')}
            </span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={4}
            className="bg-popover text-popover-foreground border-border z-50 rounded-md border px-2 py-1 text-xs shadow-md"
          >
            {isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
