import { MonitorX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UnSupported() {
  const { t } = useTranslation();

  return (
    <section className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="bg-card border-border w-full max-w-md rounded-2xl border p-6 text-center shadow-lg">
        <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <MonitorX className="text-muted-foreground h-7 w-7" />
        </div>
        <h2 className="text-foreground text-lg font-semibold">
          {t('mapPage.layout.unsupportedTitle')}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {t('mapPage.layout.unsupportedMessage')}
        </p>
      </div>
    </section>
  );
}
