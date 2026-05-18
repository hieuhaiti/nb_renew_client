import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, Settings, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import {
  COMPARE_LAYER_ENTRIES,
  LAYER_CONFIG,
  COLLECTION_OPTIONS,
  CLOUD_COVER_MIN,
  CLOUD_COVER_MAX,
} from '../constants/satelliteConstants';
import {
  formatDateForInput,
  isValidDateObject,
  parseDateInputValue,
} from '../utils/satelliteUtils';
import { getDefaultSatelliteGeometry } from '../utils/satelliteGeometry.util';

export function SatelliteCompareModePanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  const {
    startDate1,
    endDate1,
    startDate2,
    endDate2,
    collection,
    cloudCover,
    activeLayerTypes,
    autoDetectChange,
    isLoading,
    error,
    setStartDate1,
    setEndDate1,
    setStartDate2,
    setEndDate2,
    setCollection,
    setCloudCover,
    setAutoDetectChange,
    toggleLayerType,
    setIsLoading,
    setError,
    setPeriod1Data,
    setPeriod2Data,
    setIsCompareMode,
    addChangeLayer,
    clearPeriodData,
    clearData,
    resetCompareSettings,
  } = useSatelliteStore();

  const { setLoading } = useLoadingStore();

  useEffect(() => {
    setIsCompareMode(true);
  }, [setIsCompareMode]);

  const handleDateChange = useCallback(
    ({ value, pairDate, isStart, applyDate }) => {
      const parsed = parseDateInputValue(value);
      if (!parsed) {
        setError(t('satellite.errors.invalid_date'));
        return;
      }
      const isOrderValid = isStart ? parsed < pairDate : parsed > pairDate;
      if (!isOrderValid) {
        setError(t('satellite.errors.date_order'));
        return;
      }
      applyDate(parsed);
      setError(null);
    },
    [setError, t]
  );

  const handleAnalyze = useCallback(async () => {
    const geometry = getDefaultSatelliteGeometry();
    if (!geometry) {
      setError(t('satellite.errors.no_roi'));
      return;
    }
    if (activeLayerTypes.size === 0 && !autoDetectChange) {
      setError(t('satellite.errors.no_layer'));
      return;
    }
    if (
      !isValidDateObject(startDate1) ||
      !isValidDateObject(endDate1) ||
      !isValidDateObject(startDate2) ||
      !isValidDateObject(endDate2)
    ) {
      setError(t('satellite.errors.invalid_date'));
      return;
    }
    if (startDate1 >= endDate1 || startDate2 >= endDate2) {
      setError(t('satellite.errors.date_order'));
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setError(null);
    clearPeriodData();

    try {
      const p1 = {
        geometry,
        startDate: startDate1.toISOString().split('T')[0],
        endDate: endDate1.toISOString().split('T')[0],
        collection,
        cloudCover,
      };
      const p2 = {
        geometry,
        startDate: startDate2.toISOString().split('T')[0],
        endDate: endDate2.toISOString().split('T')[0],
        collection,
        cloudCover,
      };

      for (const layerType of activeLayerTypes) {
        try {
          const r1 = await LAYER_CONFIG[layerType].service(p1);
          setPeriod1Data(layerType, r1?.data || r1);
          const r2 = await LAYER_CONFIG[layerType].service(p2);
          setPeriod2Data(layerType, r2?.data || r2);
        } catch (err) {
          console.error(`[${layerType}]`, err);
          setPeriod1Data(layerType, { error: err.message });
          setPeriod2Data(layerType, { error: err.message });
        }
      }

      if (autoDetectChange) {
        try {
          const changeResult = await LAYER_CONFIG.change.service({
            geometry,
            startDate1: p1.startDate,
            endDate1: p1.endDate,
            startDate2: p2.startDate,
            endDate2: p2.endDate,
            collection,
            cloudCover,
          });
          addChangeLayer(changeResult, {
            startDate1,
            endDate1,
            startDate2,
            endDate2,
            collection,
            cloudCover,
          });
        } catch (err) {
          console.error('[auto-detect-change compare]', err);
        }
      }
    } catch (err) {
      setError(err.message || t('satellite.errors.generic'));
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [
    activeLayerTypes,
    autoDetectChange,
    startDate1,
    endDate1,
    startDate2,
    endDate2,
    collection,
    cloudCover,
    setIsLoading,
    setError,
    setPeriod1Data,
    setPeriod2Data,
    addChangeLayer,
    setLoading,
    clearPeriodData,
    t,
  ]);

  const periodDateCard = (label, sd, ed, setSd, setEd) => (
    <div className="bg-muted/30 border-border/50 space-y-2 rounded-lg border p-2.5">
      <h5 className="typo-meta text-foreground/70 font-semibold">{label}</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="typo-meta text-foreground/50 mb-1 block">
            {t('satellite.fields.from')}
          </label>
          <Input
            type="date"
            value={formatDateForInput(sd)}
            onChange={(e) =>
              handleDateChange({
                value: e.target.value,
                pairDate: ed,
                isStart: true,
                applyDate: setSd,
              })
            }
            disabled={isLoading}
            className="typo-meta h-7"
          />
        </div>
        <div>
          <label className="typo-meta text-foreground/50 mb-1 block">
            {t('satellite.fields.to')}
          </label>
          <Input
            type="date"
            value={formatDateForInput(ed)}
            onChange={(e) =>
              handleDateChange({
                value: e.target.value,
                pairDate: sd,
                isStart: false,
                applyDate: setEd,
              })
            }
            disabled={isLoading}
            className="typo-meta h-7"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card">
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="hover:bg-muted/50 flex w-full items-center justify-between px-3 py-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-primary" />
          <span className="typo-body text-foreground font-semibold">
            {t('satellite.fields.config_compare')}
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-foreground/60" />
        ) : (
          <ChevronDown size={16} className="text-foreground/60" />
        )}
      </Button>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 typo-meta text-destructive mx-3 mb-2 rounded border px-3 py-2">
          {error}
        </div>
      )}

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '1400px' : '0px' }}
      >
        <div className="border-border space-y-3 border-t px-3 py-3">
          {/* Period 1 */}
          <div className="space-y-1.5">
            <h4 className="typo-meta text-foreground/80 font-semibold tracking-wide uppercase">
              {t('satellite.fields.compare_periods')}
            </h4>
            {periodDateCard(
              t('satellite.fields.period1'),
              startDate1,
              endDate1,
              setStartDate1,
              setEndDate1
            )}
            {periodDateCard(
              t('satellite.fields.period2'),
              startDate2,
              endDate2,
              setStartDate2,
              setEndDate2
            )}
          </div>

          {/* Layer Types */}
          <div className="space-y-1.5">
            <h4 className="typo-meta text-foreground/80 font-semibold tracking-wide uppercase">
              {t('satellite.fields.layer_types')}
            </h4>
            <div className="space-y-1.5">
              {COMPARE_LAYER_ENTRIES.map(([layerId, cfg]) => (
                <Tooltip key={layerId} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded border p-2 transition-colors ${isLoading ? 'bg-muted cursor-not-allowed opacity-50' : 'hover:bg-muted border-border/50'}`}
                    >
                      <Checkbox
                        checked={activeLayerTypes.has(layerId)}
                        onCheckedChange={() => toggleLayerType(layerId)}
                        disabled={isLoading}
                      />
                      <div className={`h-3 w-3 rounded-full ${cfg.color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="typo-meta text-foreground font-medium">{t(cfg.labelKey)}</p>
                        <p className="text-foreground/50 truncate text-xs">{t(cfg.descKey)}</p>
                      </div>
                    </label>
                  </TooltipTrigger>
                  {isLoading && (
                    <TooltipContent className="typo-meta">
                      {t('satellite.loading.title')}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <h4 className="typo-meta text-foreground/80 font-semibold tracking-wide uppercase">
              {t('satellite.fields.settings')}
            </h4>
            <div className="flex items-center justify-between gap-2">
              <label className="typo-meta text-foreground/60 shrink-0">
                {t('satellite.fields.collection')}
              </label>
              <Select onValueChange={setCollection} value={collection} disabled={isLoading}>
                <SelectTrigger className="typo-meta h-8 w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="typo-meta text-foreground/60">
                  {t('satellite.fields.cloud_cover')}
                </label>
                <span className="typo-badge bg-primary/10 text-primary rounded px-2 py-0.5">
                  {cloudCover}%
                </span>
              </div>
              <Slider
                min={CLOUD_COVER_MIN}
                max={CLOUD_COVER_MAX}
                step={5}
                value={[cloudCover]}
                onValueChange={(v) => setCloudCover(v[0])}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Auto Detect Change */}
          <div className="rounded-lg border border-quinary/20 bg-quinary/5 p-2.5">
            <label
              className={`flex cursor-pointer items-start gap-2.5 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Checkbox
                checked={autoDetectChange}
                onCheckedChange={(v) => setAutoDetectChange(!!v)}
                disabled={isLoading}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={12} className="shrink-0 text-quinary" />
                  <span className="typo-meta text-foreground font-semibold">
                    {t('satellite.fields.auto_detect_change')}
                  </span>
                </div>
                <p className="text-foreground/50 text-xs leading-tight">
                  {t('satellite.fields.auto_detect_change_desc')}
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="default"
              onClick={handleAnalyze}
              disabled={isLoading || (activeLayerTypes.size === 0 && !autoDetectChange)}
              className="h-8 flex-1 gap-2"
            >
              <Play size={14} />
              <span className="typo-button">
                {isLoading ? t('satellite.loading.title') : t('satellite.actions.load_image')}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearData();
                resetCompareSettings();
              }}
              disabled={isLoading}
              className="h-8 flex-1 gap-2"
            >
              <RotateCcw size={14} />
              <span className="typo-button">{t('satellite.actions.reset')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SatelliteCompareModePanel;
