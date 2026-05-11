import { Satellite } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SatelliteEmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
      <Satellite size={36} className="text-muted-foreground/40" />
      <p className="typo-body text-muted-foreground">{t('satellite.empty.title')}</p>
      <p className="typo-meta text-muted-foreground/60">{t('satellite.empty.description')}</p>
    </div>
  );
}

export default SatelliteEmptyState;
