import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

export default function Vr360SceneList({
  scenes,
  selectedSceneId,
  loading,
  error,
  spotSelected,
  onSceneSelect,
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="typo-section-title flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            {t('vr360.scene_list_title')}
          </span>
          {scenes.length > 0 && (
            <Badge variant="secondary">{scenes.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-1 px-3 pb-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive typo-body px-4 pb-4">{t('vr360.error_scenes')}</p>
        ) : !spotSelected ? (
          <p className="text-muted-foreground typo-body px-4 pb-4">{t('vr360.no_scenes_select')}</p>
        ) : scenes.length === 0 ? (
          <p className="text-muted-foreground typo-body px-4 pb-4">{t('vr360.no_scenes')}</p>
        ) : (
          <div className="divide-y max-h-110 overflow-y-auto overscroll-contain">
            {scenes.map((scene) => {
              const isSelected = String(selectedSceneId) === String(scene.id);
              return (
                <button
                  key={scene.id}
                  onClick={() => onSceneSelect(scene.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-accent transition-colors',
                    isSelected && 'bg-accent'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn('typo-body truncate', isSelected && 'font-semibold')}>
                      {scene.name}
                    </p>
                  </div>
                  {scene.is_main && (
                    <Badge variant="outline" className="typo-badge shrink-0">
                      {t('vr360.main_badge')}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
