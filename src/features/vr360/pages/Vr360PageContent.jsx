import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import {
  useGetAllDataPoints,
  useGetDataPointById,
} from '@/services/api/tourism-points/tourismPointsApi';
import {
  useGetAframeScenes,
  useGetAframeSceneHotspots,
} from '@/services/api/vr360/aframeSceneService';
import Vr360SceneList from '../components/Vr360SceneList';
import Vr360SceneViewer from '../components/Vr360SceneViewer';
import MiniMap from '../components/MiniMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Map } from 'lucide-react';
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
    parseGeometryValue(spot?.geojson) ||
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
  const entrySpotId = useMemo(
    () => location.state?.spotId ?? location.state?.spot?.id ?? location.state?.spot?.spot_id,
    [location.state]
  );

  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [isSceneListOpen, setIsSceneListOpen] = useState(true);

  const spotsQuery = useGetAllDataPoints({ limit: 100 });
  const spots = useMemo(() => normalizeList(spotsQuery.data), [spotsQuery.data]);
  const entrySpotQuery = useGetDataPointById({ point_id: entrySpotId });
  const entrySpot = useMemo(() => {
    const payload = entrySpotQuery.data?.data ?? entrySpotQuery.data;
    return payload?.spot ?? payload ?? null;
  }, [entrySpotQuery.data]);

  useEffect(() => {
    if (prefillHandledRef.current) return;
    const spotId = entrySpotId;

    if (!spotId) return;
    prefillHandledRef.current = true;
    setSelectedSpotId(String(spotId));
  }, [entrySpotId]);

  const selectedSpot = useMemo(() => {
    if (selectedSpotId == null) return null;
    return (
      spots.find(
        (spot) => String(spot?.id ?? spot?.spot_id ?? spot?.point_id) === String(selectedSpotId)
      ) ?? null
    );
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

  const selectedSceneIndex = useMemo(() => {
    if (!selectedScene?.id) return -1;
    return scenes.findIndex((scene) => String(scene.id) === String(selectedScene.id));
  }, [scenes, selectedScene?.id]);

  const canGoPrevScene = selectedSceneIndex > 0;
  const canGoNextScene = selectedSceneIndex > -1 && selectedSceneIndex < scenes.length - 1;

  const hotspotsQuery = useGetAframeSceneHotspots({
    spotId: selectedSpotId,
    sceneId: selectedScene?.id,
  });
  const hotspots = useMemo(() => normalizeList(hotspotsQuery.data), [hotspotsQuery.data]);

  const spotCoordinates = useMemo(() => getCoordinatesFromSpot(selectedSpot), [selectedSpot]);
  const miniMapScenes = useMemo(
    () =>
      scenes.map((scene) => ({
        ...scene,
        coordinates: scene?.coordinates || spotCoordinates || undefined,
      })),
    [scenes, spotCoordinates]
  );
  const currentSpot = useMemo(() => {
    if (entrySpot) return entrySpot;
    if (selectedSpot) return selectedSpot;
    return null;
  }, [entrySpot, selectedSpot]);

  useEffect(() => {
    if (!scenes.length) return;
    const start = Math.max(0, selectedSceneIndex - 1);
    const end = Math.min(scenes.length - 1, selectedSceneIndex + 2);

    for (let i = start; i <= end; i += 1) {
      const raw = scenes[i]?.equirectangular_image_url;
      if (!raw) continue;
      const src = withBaseUrl(raw) || raw;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    }
  }, [scenes, selectedSceneIndex]);

  const handleGoPrevScene = useCallback(() => {
    if (!canGoPrevScene) return;
    setSelectedSceneId(scenes[selectedSceneIndex - 1]?.id ?? null);
  }, [canGoPrevScene, scenes, selectedSceneIndex]);

  const handleGoNextScene = useCallback(() => {
    if (!canGoNextScene) return;
    setSelectedSceneId(scenes[selectedSceneIndex + 1]?.id ?? null);
  }, [canGoNextScene, scenes, selectedSceneIndex]);

  const handleHotspotClick = useCallback(
    (hotspot) => {
      const targetSceneId = hotspot?.target_scene_id || hotspot?.linked_scene_id;
      const targetSpotId = hotspot?.target_spot_id;
      const targetSpotSlug = hotspot?.target_spot_slug;

      if (targetSpotId) {
        setSelectedSpotId(String(targetSpotId));
        setSelectedSceneId(null);
        return;
      }

      if (targetSpotSlug) {
        const targetSpot = spots.find((s) => s.slug === targetSpotSlug);
        if (targetSpot?.id) {
          setSelectedSpotId(String(targetSpot.id));
          setSelectedSceneId(null);
          return;
        }
      }

      if (targetSceneId) {
        setSelectedSceneId(String(targetSceneId));
      }
    },
    [spots]
  );

  return (
    <RootLayout>
      <div className="h-full w-full px-4 py-4 xl:h-[calc(100vh-4.5rem)] xl:px-6 xl:py-4">
        <div className="grid h-full grid-cols-1 gap-4 xl:min-h-0 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4 xl:min-h-0 xl:overflow-hidden xl:pr-1">
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="typo-badge">
                    {t('vr360.current_scene')}
                  </Badge>
                  <Badge className="typo-badge">{t('vr360.scene_badge')}</Badge>
                </div>
                <CardTitle className="typo-section-title mt-1 line-clamp-2">
                  {selectedScene?.name ?? '-'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground typo-body line-clamp-4">
                  {selectedScene?.description ?? t('vr360.viewer_placeholder')}
                </p>
              </CardContent>
            </Card>

            <Card className="xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="typo-section-title flex items-center gap-2">
                  <Map className="text-primary h-4 w-4" />
                  {t('vr360.minimap_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="h-36 overflow-hidden rounded-lg xl:h-auto xl:min-h-0 xl:flex-1">
                  <MiniMap
                    scenes={miniMapScenes}
                    spots={spots}
                    currentSpot={currentSpot}
                    currentSceneIndex={Math.max(0, selectedSceneIndex)}
                    onSelectScene={(nextScene) => {
                      if (!nextScene?.id) return;
                      setSelectedSceneId(nextScene.id);
                    }}
                    onSelectSpot={(spot) => {
                      if (!spot?.id) return;
                      setSelectedSpotId(String(spot.id));
                      setSelectedSceneId(null);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="flex min-h-0 flex-col xl:relative">
            <div className="bg-muted min-h-[480px] overflow-hidden rounded-xl border xl:min-h-0 xl:flex-1">
              <Vr360SceneViewer
                scene={selectedScene}
                hotspots={hotspots}
                onPrevScene={handleGoPrevScene}
                onNextScene={handleGoNextScene}
                canGoPrevScene={canGoPrevScene}
                canGoNextScene={canGoNextScene}
                onHotspotClick={handleHotspotClick}
                className="h-full w-full"
              />
            </div>

            <div className="mt-4 xl:pointer-events-none xl:absolute xl:inset-y-0 xl:right-2 xl:z-10 xl:mt-0 xl:flex xl:items-center">
              <div className="xl:pointer-events-auto">
                {isSceneListOpen ? (
                  <Vr360SceneList
                    scenes={scenes}
                    selectedSceneId={selectedScene?.id}
                    loading={scenesQuery.isLoading}
                    error={scenesQuery.isError}
                    spotSelected={!!selectedSpotId}
                    onSceneSelect={setSelectedSceneId}
                    onClose={() => setIsSceneListOpen(false)}
                  />
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full shadow-lg"
                    onClick={() => setIsSceneListOpen(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
