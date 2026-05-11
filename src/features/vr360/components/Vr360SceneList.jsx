import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Layers, X } from 'lucide-react';

function SceneItem({ scene, index, isSelected, onSelect, t }) {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onSelect(scene.id)}
            className={cn(
              'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150',
              isSelected
                ? 'from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r shadow-md'
                : 'text-foreground/75 hover:bg-accent/80 hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors',
                isSelected
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10'
              )}
            >
              {index + 1}
            </span>

            <span className="min-w-0 flex-1 truncate text-sm leading-5 font-medium">
              {scene.name}
            </span>

            {scene.is_main && (
              <Badge
                variant={isSelected ? 'secondary' : 'outline'}
                className={cn(
                  'typo-badge flex-shrink-0 px-1.5',
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground border-transparent'
                    : 'text-muted-foreground'
                )}
              >
                {t('vr360.main_badge')}
              </Badge>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10} className="max-w-[200px]">
          <p className="text-xs">{scene.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Vr360SceneList({
  scenes,
  selectedSceneId,
  loading,
  error,
  spotSelected,
  onSceneSelect,
  onClose,
}) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current || !Array.isArray(scenes) || scenes.length === 0) return;
    if (!selectedSceneId) return;

    const selectedIndex = scenes.findIndex((s) => String(s.id) === String(selectedSceneId));
    if (selectedIndex < 0) return;

    const container = scrollRef.current;
    const item = container.children[selectedIndex];
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [scenes, selectedSceneId]);

  return (
    <div className="bg-background/92 border-border/50 flex w-60 flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="border-border/40 bg-muted/30 flex items-center gap-2 border-b px-3 py-2.5">
        <div className="bg-primary/10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md">
          <Layers className="text-primary h-3.5 w-3.5" />
        </div>
        <span className="text-foreground flex-1 truncate text-xs font-semibold tracking-wide uppercase">
          {t('vr360.scene_list_title')}
        </span>
        {scenes.length > 0 && (
          <Badge variant="secondary" className="h-5 flex-shrink-0 px-1.5 text-[10px] tabular-nums">
            {scenes.length}
          </Badge>
        )}
        {typeof onClose === 'function' && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="p-1.5">
        {loading ? (
          <div className="space-y-1.5 p-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive typo-body px-2 py-2">{t('vr360.error_scenes')}</p>
        ) : !spotSelected ? (
          <p className="text-muted-foreground typo-body px-2 py-2">{t('vr360.no_scenes_select')}</p>
        ) : scenes.length === 0 ? (
          <p className="text-muted-foreground typo-body px-2 py-2">{t('vr360.no_scenes')}</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex max-h-[272px] flex-col gap-0.5 overflow-y-auto [scrollbar-width:thin]"
          >
            {scenes.map((scene, index) => (
              <SceneItem
                key={scene.id}
                scene={scene}
                index={index}
                isSelected={String(selectedSceneId) === String(scene.id)}
                onSelect={onSceneSelect}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
