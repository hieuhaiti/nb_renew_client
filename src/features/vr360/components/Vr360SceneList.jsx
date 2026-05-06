import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { ImageOff, Video } from 'lucide-react';

function ScenePreviewImage({ sceneName, imageUrl }) {
  const [isImageLoading, setIsImageLoading] = useState(Boolean(imageUrl));

  useEffect(() => {
    setIsImageLoading(Boolean(imageUrl));
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className="bg-muted flex h-20 w-32 shrink-0 items-center justify-center rounded-md border">
        <ImageOff className="text-muted-foreground/40 h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md border">
      {isImageLoading ? (
        <LoadingInline
          position="center"
          size="small"
          color="muted"
          className="bg-background/70 absolute inset-0 z-10 py-0"
        />
      ) : null}
      <img
        src={imageUrl}
        alt={sceneName || 'VR scene'}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-200',
          isImageLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsImageLoading(false)}
        onError={(event) => {
          event.target.onerror = null;
          event.target.src = placeholderImg;
          setIsImageLoading(false);
        }}
      />
    </div>
  );
}

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
            <Video className="text-primary h-4 w-4" />
            {t('vr360.scene_list_title')}
          </span>
          {scenes.length > 0 && <Badge variant="secondary">{scenes.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-3">
        {loading ? (
          <div className="overflow-x-auto px-3 pb-1">
            <div className="flex min-w-max gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-20 w-32 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <p className="text-destructive typo-body px-4">{t('vr360.error_scenes')}</p>
        ) : !spotSelected ? (
          <p className="text-muted-foreground typo-body px-4">{t('vr360.no_scenes_select')}</p>
        ) : scenes.length === 0 ? (
          <p className="text-muted-foreground typo-body px-4">{t('vr360.no_scenes')}</p>
        ) : (
          <div className="overflow-x-auto px-3 pb-1">
            <div className="flex min-w-max gap-2">
              {scenes.map((scene) => {
                const isSelected = String(selectedSceneId) === String(scene.id);
                const rawImageUrl = scene?.thumbnail_url || scene?.equirectangular_image_url || '';
                const imageUrl = rawImageUrl ? withBaseUrl(rawImageUrl) || rawImageUrl : '';

                return (
                  <Button
                    key={scene.id}
                    type="button"
                    variant={isSelected ? 'secondary' : 'outline'}
                    onClick={() => onSceneSelect(scene.id)}
                    className={cn(
                      'flex h-auto min-w-[220px] items-start gap-2 rounded-lg p-2 text-left',
                      !isSelected && 'hover:bg-accent'
                    )}
                  >
                    <ScenePreviewImage sceneName={scene?.name} imageUrl={imageUrl} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="typo-body line-clamp-2 text-left">{scene.name}</p>
                      {scene.is_main && (
                        <Badge variant="secondary" className="typo-badge w-fit">
                          {t('vr360.main_badge')}
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
