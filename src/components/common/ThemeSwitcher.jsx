import { useTranslation } from 'react-i18next';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, isDark, setTheme, toggleDark } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {isDark ? '🌙' : '☀️'} {t('common.theme')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-semibold">{t('common.theme')}</div>

        <DropdownMenuSeparator />

        {THEMES.map((themeName) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setTheme(themeName)}
            className="capitalize"
          >
            <input
              type="radio"
              checked={theme === themeName}
              onChange={() => setTheme(themeName)}
              className="mr-2"
            />
            {themeName.replace('-', ' ')}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem checked={isDark} onCheckedChange={toggleDark}>
          {isDark ? '🌙' : '☀️'} {t('common.darkMode')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
