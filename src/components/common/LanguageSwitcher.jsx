import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
      <span className="text-muted-foreground">{t('common.language')}:</span>
      <button
        className="cursor-pointer rounded-md border border-border px-2 py-1"
        type="button"
        onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
      >
        {i18n.language.toUpperCase()}
      </button>
    </div>
  );
}
