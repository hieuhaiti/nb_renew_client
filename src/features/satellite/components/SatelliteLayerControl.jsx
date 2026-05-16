import { useState } from 'react';
import { Eye, EyeOff, Cloud, Download, TriangleAlert, Image, FileJson } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { formatDateRange } from '../utils/satelliteUtils';

const slugify = (s) =>
  (s || '')
    .trim()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^0-9a-zA-Z]+/g, '_')
    .replace(/^_+|_+$/g, '');

const toCompactDate = (d) => (d || '').replace(/\D/g, '').slice(0, 8);

const parseDateRange = (s) => {
  const raw = (s || '').trim();
  if (!raw) return { from: '', to: '' };
  const parts = raw.split(/\s+[-–—]\s+/);
  return { from: parts[0] || '', to: parts[1] || '' };
};

const buildDownloadFilename = (layer, config, extension = 'tif') => {
  const label = slugify(config?.label || layer.layerType) || 'satellite';
  const { from, to } = parseDateRange(layer.date);
  const f = toCompactDate(from);
  const t2 = toCompactDate(to);
  const datePart = f && t2 ? `${f}-${t2}` : f;
  return `${label}${datePart ? `_${datePart}` : ''}.${extension}`;
};

/**
 * @param {{ layer, index, config, opacity, onOpacityChange, visible, onVisibilityChange, accentClass?, compact? }} props
 */
export function SatelliteLayerControl({
  layer,
  index,
  config,
  opacity,
  onOpacityChange,
  visible,
  onVisibilityChange,
  accentClass = 'text-primary bg-primary/10',
  compact = false,
}) {
  const { t } = useTranslation();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState('raster');
  const rasterUrl = layer?.downloadUrls?.raster || layer?.downloadUrl || null;
  const hasRasterDownload = !!rasterUrl;
  const iconSize = compact ? 13 : 14;
  const dotClass = compact ? 'w-2.5 h-2.5' : 'w-3 h-3';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      if (downloadType === 'raster' && rasterUrl) {
        const res = await fetch(rasterUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = buildDownloadFilename(layer, config, 'tif');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      if (rasterUrl) window.open(rasterUrl, '_blank');
    } finally {
      setIsDownloading(false);
      setDownloadDialogOpen(false);
    }
  };

  return (
    <Card className="p-2 bg-surface-muted/50 border-border/50 hover:border-border transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`${dotClass} rounded-full shrink-0 ${config?.color || 'bg-gray-400'}`} />
            {compact ? (
              <p className="typo-meta font-medium text-foreground truncate">
                {config ? t(config.labelKey) : layer.layerType}
              </p>
            ) : (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="typo-meta font-medium text-foreground truncate">
                    {config ? t(config.labelKey) : `Layer ${index + 1}`}
                  </p>
                  {layer.cloudCover != null && (
                    <span className="inline-flex items-center gap-0.5 typo-badge px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-500 shrink-0">
                      <Cloud size={10} />
                      {layer.cloudCover}%
                    </span>
                  )}
                </div>
                <p className="typo-meta text-foreground/50 truncate">{formatDateRange(layer.date)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button variant="ghost"
                  onClick={() => onVisibilityChange(!visible)}
                  className="p-0.5 hover:bg-surface rounded transition-colors"
                >
                  {visible ? (
                    <Eye size={iconSize} className="text-primary" />
                  ) : (
                    <EyeOff size={iconSize} className="text-foreground/40" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="typo-meta">
                {visible ? t('satellite.actions.hide') : t('satellite.actions.show')}
              </TooltipContent>
            </Tooltip>

            {hasRasterDownload && (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button variant="ghost"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => { setDownloadType('raster'); setDownloadDialogOpen(true); }}
                    className="text-primary"
                  >
                    <Image size={iconSize} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="typo-meta">{t('satellite.actions.download_raster')}</TooltipContent>
              </Tooltip>
            )}

            <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
              <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TriangleAlert size={18} className="text-warning shrink-0" />
                    {t('satellite.actions.confirm_download')}
                  </DialogTitle>
                  <DialogDescription className="typo-body text-foreground/70">
                    {t('satellite.actions.download_note')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2">
                  <Button variant="ghost" variant="outline" onClick={() => setDownloadDialogOpen(false)}>
                    {t('satellite.actions.cancel')}
                  </Button>
                  <Button variant="ghost" disabled={isDownloading} onClick={handleDownload}>
                    {isDownloading ? t('satellite.loading.downloading') : (
                      <><Download size={iconSize} /> {t('satellite.actions.download')}</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {compact && (
          <div className="flex items-center justify-between gap-1">
            <p className="typo-meta text-foreground/50 truncate leading-tight">
              {formatDateRange(layer.date)}
            </p>
            {layer.cloudCover != null && (
              <span className="inline-flex items-center gap-0.5 typo-badge px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-500 shrink-0">
                <Cloud size={10} />
                {layer.cloudCover}%
              </span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="typo-meta text-foreground/60">{t('satellite.fields.opacity')}</label>
            <span className={`typo-badge px-1.5 py-0.5 rounded ${accentClass}`}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <Slider
            min={0} max={1} step={0.05}
            value={[opacity]}
            onValueChange={(val) => onOpacityChange(val[0])}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}

export default SatelliteLayerControl;


