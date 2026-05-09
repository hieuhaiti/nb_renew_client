import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
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
      <div className="bg-muted flex h-20 w-full items-center justify-center rounded-md border">
        <ImageOff className="text-muted-foreground/40 h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-full overflow-hidden rounded-md border">
      {isImageLoading && (
        <LoadingInline
          position="center"
          size="small"
          color="muted"
          className="bg-background/70 absolute inset-0 z-10 py-0"
        />
      )}
      <img
        src={imageUrl}
        alt={sceneName || 'VR scene'}
        loading="lazy"
        decoding="async"
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

function SceneCard({ scene, isSelected, onSelect, t }) {
  const rawImageUrl = scene?.thumbnail_url || scene?.equirectangular_image_url || '';
  const imageUrl = rawImageUrl ? withBaseUrl(rawImageUrl) || rawImageUrl : '';

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect(scene.id)}
      className={cn(
        'group h-auto w-full flex-col items-start justify-start rounded-xl border p-2 text-left whitespace-normal transition-all duration-200',
        isSelected
          ? 'border-primary/70 bg-primary/10 ring-primary/40 hover:bg-primary/15 shadow-sm ring-1'
          : 'border-border bg-card hover:border-primary/35 hover:bg-accent/60 hover:shadow-sm'
      )}
    >
      <ScenePreviewImage sceneName={scene?.name} imageUrl={imageUrl} />
      <div className="mt-1.5 flex w-full items-start gap-1">
        <p
          className={cn(
            'line-clamp-2 flex-1 text-sm leading-5 font-medium',
            isSelected ? 'text-primary' : 'text-foreground'
          )}
        >
          {scene.name}
        </p>
        {scene.is_main && (
          <Badge
            variant="outline"
            className={cn(
              'typo-badge w-fit flex-shrink-0',
              isSelected ? 'border-primary/50 text-primary' : 'text-muted-foreground'
            )}
          >
            {t('vr360.main_badge')}
          </Badge>
        )}
      </div>
    </Button>
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
      <CardContent className="px-3 pb-3">
        {loading ? (
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive typo-body">{t('vr360.error_scenes')}</p>
        ) : !spotSelected ? (
          <p className="text-muted-foreground typo-body">{t('vr360.no_scenes_select')}</p>
        ) : scenes.length === 0 ? (
          <p className="text-muted-foreground typo-body">{t('vr360.no_scenes')}</p>
        ) : (
          <Carousel opts={{ align: 'start' }} className="w-full px-8">
            <CarouselContent className="-ml-3">
              {scenes.map((scene) => (
                <CarouselItem key={scene.id} className="basis-1/4 pl-3">
                  <SceneCard
                    scene={scene}
                    isSelected={String(selectedSceneId) === String(scene.id)}
                    onSelect={onSceneSelect}
                    t={t}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
}
