import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, Settings, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { SINGLE_LAYER_ENTRIES, LAYER_CONFIG, COLLECTION_OPTIONS, CLOUD_COVER_MIN, CLOUD_COVER_MAX } from '../constants/satelliteConstants';
import { formatDateForInput, isValidDateObject, parseDateInputValue, oneYearBefore } from '../utils/satelliteUtils';
import { getDefaultSatelliteGeometry } from '../utils/satelliteGeometry.util';

export function SatelliteSingleModePanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [selectedLayers, setSelectedLayers] = useState(['ndvi']);

  const {
    startDate, endDate, collection, cloudCover, autoDetectChange,
    isLoading, error,
    setStartDate, setEndDate, setCollection, setCloudCover, setAutoDetectChange,
    setIsLoading, setError, setAnalysisData,
    syncSingleImagesFromResults, addChangeLayer,
    setIsCompareMode, clearData, reset,
  } = useSatelliteStore();

  const { setLoading } = useLoadingStore();

  useEffect(() => { setIsCompareMode(false); }, [setIsCompareMode]);

  const handleLayerToggle = (layerId) => {
    setSelectedLayers((prev) =>
      prev.includes(layerId) ? prev.filter((l) => l !== layerId) : [...prev, layerId]
    );
  };

  const handleStartDateChange = (e) => {
    const newDate = parseDateInputValue(e.target.value);
    if (!newDate) { setError(t('satellite.errors.invalid_date')); return; }
    if (newDate < endDate) { setStartDate(newDate); setError(null); }
    else setError(t('satellite.errors.date_order'));
  };

  const handleEndDateChange = (e) => {
    const newDate = parseDateInputValue(e.target.value);
    if (!newDate) { setError(t('satellite.errors.invalid_date')); return; }
    if (newDate > startDate) { setEndDate(newDate); setError(null); }
    else setError(t('satellite.errors.date_order'));
  };

  const handleAnalyze = useCallback(async () => {
    const geometry = getDefaultSatelliteGeometry();
    if (!geometry) { setError(t('satellite.errors.no_roi')); return; }
    if (selectedLayers.length === 0 && !autoDetectChange) { setError(t('satellite.errors.no_layer')); return; }
    if (!isValidDateObject(startDate) || !isValidDateObject(endDate)) { setError(t('satellite.errors.invalid_date')); return; }
    if (startDate >= endDate) { setError(t('satellite.errors.date_order')); return; }

    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const params = {
        geometry,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        collection,
        cloudCover,
      };

      const results = {};
      for (const layerId of selectedLayers) {
        try {
          const result = await LAYER_CONFIG[layerId].service(params);
          results[layerId] = result?.data || result;
        } catch (err) {
          results[layerId] = { error: err.message };
        }
      }

      if (selectedLayers.length > 0) {
        setAnalysisData(results);
        syncSingleImagesFromResults(results, { startDate, endDate, collection, cloudCover });
      }

      if (autoDetectChange) {
        try {
          const p1Start = oneYearBefore(startDate);
          const p1End = oneYearBefore(endDate);
          const changeResult = await LAYER_CONFIG.change.service({
            geometry,
            startDate1: p1Start.toISOString().split('T')[0],
            endDate1: p1End.toISOString().split('T')[0],
            startDate2: params.startDate,
            endDate2: params.endDate,
            collection,
            cloudCover,
          });
          addChangeLayer(changeResult, {
            startDate1: p1Start, endDate1: p1End,
            startDate2: startDate, endDate2: endDate,
            collection, cloudCover,
          });
        } catch (err) {
          console.error('[auto-detect-change single]', err);
        }
      }
    } catch (err) {
      setError(err.message || t('satellite.errors.generic'));
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [
    selectedLayers, autoDetectChange, startDate, endDate, collection, cloudCover,
    setIsLoading, setError, setAnalysisData, syncSingleImagesFromResults, addChangeLayer, setLoading, t,
  ]);

  return (
    <div className="bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-primary" />
          <span className="typo-body font-semibold text-foreground">{t('satellite.fields.config')}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-foreground/60" /> : <ChevronDown size={16} className="text-foreground/60" />}
      </button>

      {error && (
        <div className="mx-3 mb-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? '1200px' : '0px' }}>
        <div className="border-t border-border px-3 py-3 space-y-3">
          {/* Date Range */}
          <div className="space-y-2">
            <h4 className="typo-meta font-semibold text-foreground/80 uppercase tracking-wide">
              {t('satellite.fields.time_range')}
            </h4>
            <div className="space-y-2">
              <div>
                <label className="typo-meta text-foreground/60 mb-1 block">{t('satellite.fields.from')}</label>
                <Input type="date" value={formatDateForInput(startDate)} onChange={handleStartDateChange} disabled={isLoading} className="typo-meta h-8" />
              </div>
              <div>
                <label className="typo-meta text-foreground/60 mb-1 block">{t('satellite.fields.to')}</label>
                <Input type="date" value={formatDateForInput(endDate)} onChange={handleEndDateChange} disabled={isLoading} className="typo-meta h-8" />
              </div>
            </div>
          </div>

          {/* Layer Types */}
          <div className="space-y-2">
            <h4 className="typo-meta font-semibold text-foreground/80 uppercase tracking-wide">
              {t('satellite.fields.layer_types')}
            </h4>
            <div className="space-y-1.5">
              {SINGLE_LAYER_ENTRIES.map(([layerId, cfg]) => (
                <Tooltip key={layerId} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed bg-muted' : 'hover:bg-muted border-border/50'}`}>
                      <Checkbox
                        checked={selectedLayers.includes(layerId)}
                        onCheckedChange={() => handleLayerToggle(layerId)}
                        disabled={isLoading}
                      />
                      <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="typo-meta font-medium text-foreground">{t(cfg.labelKey)}</p>
                        <p className="text-xs text-foreground/50 truncate">{t(cfg.descKey)}</p>
                      </div>
                    </label>
                  </TooltipTrigger>
                  {isLoading && <TooltipContent className="typo-meta">{t('satellite.loading.title')}</TooltipContent>}
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <h4 className="typo-meta font-semibold text-foreground/80 uppercase tracking-wide">
              {t('satellite.fields.settings')}
            </h4>
            <div className="flex items-center justify-between gap-2">
              <label className="typo-meta text-foreground/60 shrink-0">{t('satellite.fields.collection')}</label>
              <Select onValueChange={setCollection} value={collection} disabled={isLoading}>
                <SelectTrigger className="w-[150px] h-8 typo-meta">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="typo-meta text-foreground/60">{t('satellite.fields.cloud_cover')}</label>
                <span className="typo-badge bg-primary/10 text-primary px-2 py-0.5 rounded">{cloudCover}%</span>
              </div>
              <Slider
                min={CLOUD_COVER_MIN} max={CLOUD_COVER_MAX} step={5}
                value={[cloudCover]}
                onValueChange={(vals) => setCloudCover(vals[0])}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Auto Detect Change */}
          <div className="p-2.5 bg-red-500/5 border border-red-500/20 rounded-lg">
            <label className={`flex items-start gap-2.5 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Checkbox
                checked={autoDetectChange}
                onCheckedChange={(checked) => setAutoDetectChange(!!checked)}
                disabled={isLoading}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={12} className="text-red-500 shrink-0" />
                  <span className="typo-meta font-semibold text-foreground">{t('satellite.fields.auto_detect_change')}</span>
                </div>
                <p className="text-xs text-foreground/50 leading-tight">{t('satellite.fields.auto_detect_change_single_desc')}</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || (selectedLayers.length === 0 && !autoDetectChange)}
              className="flex-1 gap-2 h-8"
            >
              <Play size={14} />
              <span className="typo-button">{isLoading ? t('satellite.loading.title') : t('satellite.actions.load_image')}</span>
            </Button>
            <Button
              onClick={() => { clearData(); reset(); }}
              variant="outline"
              disabled={isLoading}
              className="flex-1 gap-2 h-8"
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

export default SatelliteSingleModePanel;
