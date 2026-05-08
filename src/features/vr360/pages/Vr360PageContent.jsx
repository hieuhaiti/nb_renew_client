import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllDataPoints } from '@/services/api/tourism-points/tourismPointsApi';
import {
  useGetAframeScenes,
  useGetAframeSceneHotspots,
} from '@/services/api/vr360/aframeSceneService';
import Vr360SpotSelector from '../components/Vr360SpotSelector';
import Vr360SceneList from '../components/Vr360SceneList';
import Vr360SceneViewer from '../components/Vr360SceneViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Map, Volume2 } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  const payload = data?.data ?? data?.results ?? data;
  if (Array.isArray(payload)) return payload;
  return payload?.items || payload?.spots || payload?.scenes || payload?.hotspots || [];
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseGeometryValue(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getCoordinatesFromSpot(spot) {
  if (!spot || typeof spot !== 'object') return null;

  const geometry =
    parseGeometryValue(spot?.geometry_data) ||
    parseGeometryValue(spot?.geometry) ||
    parseGeometryValue(spot?.geojson?.geometry) ||
    null;

  if (geometry?.type === 'Point' && Array.isArray(geometry?.coordinates)) {
    const lng = toNumber(geometry.coordinates[0]);
    const lat = toNumber(geometry.coordinates[1]);
    if (lng != null && lat != null) return [lng, lat];
  }

  const lng = toNumber(spot?.longitude ?? spot?.lng ?? spot?.lon);
  const lat = toNumber(spot?.latitude ?? spot?.lat);
  if (lng != null && lat != null) return [lng, lat];

  return null;
}

export default function Vr360PageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillHandledRef = useRef(false);

  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  const spotsQuery = useGetAllDataPoints({ limit: 100 });
  const spots = useMemo(() => normalizeList(spotsQuery.data), [spotsQuery.data]);

  useEffect(() => {
    if (prefillHandledRef.current) return;
    const spotId = location.state?.spotId;
    if (!spotId) return;
    prefillHandledRef.current = true;
    setSelectedSpotId(spotId);
  }, [location.state]);

  const selectedSpot = useMemo(() => {
    if (selectedSpotId == null) return null;
    return spots.find((spot) => String(spot?.id) === String(selectedSpotId)) ?? null;
  }, [spots, selectedSpotId]);

  const scenesQuery = useGetAframeScenes({ spotId: selectedSpotId });
  const scenes = useMemo(() => normalizeList(scenesQuery.data), [scenesQuery.data]);

  const selectedScene = useMemo(() => {
    if (!scenes.length) return null;
    if (selectedSceneId != null) {
      return scenes.find((s) => String(s.id) === String(selectedSceneId)) ?? scenes[0];
    }
    return scenes.find((s) => s.is_main) ?? scenes[0];
  }, [scenes, selectedSceneId]);

  const hotspotsQuery = useGetAframeSceneHotspots({
    spotId: selectedSpotId,
    sceneId: selectedScene?.id,
  });
  const hotspots = useMemo(() => normalizeList(hotspotsQuery.data), [hotspotsQuery.data]);

  const spotCoordinates = useMemo(() => getCoordinatesFromSpot(selectedSpot), [selectedSpot]);

  useEffect(() => {
    if (!scenes.length) return;
    const selectedIndex = scenes.findIndex((s) => String(s.id) === String(selectedScene?.id));
    const start = Math.max(0, selectedIndex - 1);
    const end = Math.min(scenes.length - 1, selectedIndex + 2);
    for (let i = start; i <= end; i += 1) {
      const raw = scenes[i]?.equirectangular_image_url;
      if (!raw) continue;
      const src = withBaseUrl(raw) || raw;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    }
  }, [scenes, selectedScene?.id]);

  function handleSpotChange(spotId) {
    setSelectedSpotId(spotId);
    setSelectedSceneId(null);
  }

  return (
    <RootLayout>
      <div className="h-full w-full px-4 py-4 xl:h-[calc(100vh-4.5rem)] xl:px-6 xl:py-4">
        <div className="grid h-full grid-cols-1 gap-4 xl:min-h-0 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit gap-1"
                onClick={() => navigate('/map')}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('vr360.back_to_map')}
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{t('vr360.scene_badge')}</Badge>
                <h1 className="typo-card-title">{t('vr360.title')}</h1>
              </div>
              <p className="text-muted-foreground typo-meta">{t('vr360.subtitle')}</p>
            </div>

            <Vr360SpotSelector
              spots={spots}
              selectedSpotId={selectedSpotId}
              onSpotChange={handleSpotChange}
              loading={spotsQuery.isLoading}
            />

            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="typo-badge">
                    {t('vr360.current_scene')}
                  </Badge>
                  <Badge className="typo-badge">360°</Badge>
                </div>
                <CardTitle className="typo-section-title mt-1 line-clamp-2">
                  {selectedScene?.name ?? '—'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground typo-body line-clamp-4">
                  {selectedScene?.description ?? t('vr360.viewer_placeholder')}
                </p>
                <Button variant="outline" size="sm" disabled className="w-fit gap-2">
                  <Volume2 className="h-4 w-4" />
                  {t('vr360.play_narration')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="typo-section-title flex items-center gap-2">
                  <Map className="text-primary h-4 w-4" />
                  {t('vr360.minimap_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {spotCoordinates ? (
                  <>
                    <p className="text-foreground typo-body">
                      {spotCoordinates[1].toFixed(5)}, {spotCoordinates[0].toFixed(5)}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() =>
                        navigate(
                          '/map',
                          selectedSpot?.id ? { state: { spotId: selectedSpot.id } } : undefined
                        )
                      }
                    >
                      <Map className="h-4 w-4" />
                      {t('vr360.back_to_map')}
                    </Button>
                  </>
                ) : (
                  <div className="bg-muted border-muted-foreground/20 flex h-20 items-center justify-center rounded-lg border-2 border-dashed p-2">
                    <p className="text-muted-foreground typo-meta text-center">
                      {t('vr360.minimap_placeholder')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          <section className="flex min-h-0 flex-col gap-4">
            <div className="bg-muted min-h-[320px] overflow-hidden rounded-xl border xl:min-h-0 xl:flex-1">
              <Vr360SceneViewer
                scene={selectedScene}
                hotspots={hotspots}
                className="h-full w-full"
              />
            </div>

            <Vr360SceneList
              scenes={scenes}
              selectedSceneId={selectedScene?.id}
              loading={scenesQuery.isLoading}
              error={scenesQuery.isError}
              spotSelected={!!selectedSpotId}
              onSceneSelect={setSelectedSceneId}
            />
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
