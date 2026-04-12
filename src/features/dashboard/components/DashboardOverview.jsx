import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ComponentShowcase } from '@/components/common/ComponentShowcase';
import { ColorPalette } from '@/components/common/ColorPalette';
import { Button } from '@/components/ui/button';

export function DashboardOverview() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('components');

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="border-border bg-card rounded-2xl border-2  p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{t('hero.title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('hero.description')}</p>
      </section>

      <div className="space-y-4">
        <div className="border-border flex gap-2 border-b">
          <Button
            variant={activeTab === 'components' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('components')}
            className="rounded-b-none"
          >
            Components
          </Button>
          <Button
            variant={activeTab === 'colors' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('colors')}
            className="rounded-b-none"
          >
            Colors
          </Button>
        </div>

        {activeTab === 'components' && (
          <div className="border-border rounded-lg border p-6">
            <ComponentShowcase />
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="border-border rounded-lg border p-6">
            <ColorPalette />
          </div>
        )}
      </div>
    </div>
  );
}
