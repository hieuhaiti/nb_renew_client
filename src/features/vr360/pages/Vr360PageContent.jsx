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

  // Preload selected + neighboring panorama images to make scene switch smoother.
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
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2 gap-1"
            onClick={() => navigate('/map')}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('vr360.back_to_map')}
          </Button>
          <Badge className="mb-2">{t('vr360.scene_badge')}</Badge>
          <h1 className="typo-hero">{t('vr360.title')}</h1>
          <p className="text-muted-foreground typo-body mt-1">{t('vr360.subtitle')}</p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-4">
            <Vr360SpotSelector
              spots={spots}
              selectedSpotId={selectedSpotId}
              onSpotChange={handleSpotChange}
              loading={spotsQuery.isLoading}
            />
            <Vr360SceneList
              scenes={scenes}
              selectedSceneId={selectedScene?.id}
              loading={scenesQuery.isLoading}
              error={scenesQuery.isError}
              spotSelected={!!selectedSpotId}
              onSceneSelect={setSelectedSceneId}
            />
          </div>

          {/* Right: viewer + info + minimap */}
          <div className="flex flex-col gap-4">
            <div className="bg-muted h-120 overflow-hidden rounded-xl border md:h-140">
              <Vr360SceneViewer scene={selectedScene} hotspots={hotspots} />
            </div>

            {/* Info row below viewer */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Scene info / thuyết minh */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="typo-badge">
                      {t('vr360.current_scene')}
                    </Badge>
                    <Badge className="typo-badge">360°</Badge>
                  </div>
                  <CardTitle className="typo-card-title mt-2">
                    {selectedScene?.name ?? '—'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-muted-foreground typo-body line-clamp-3">
                    {selectedScene?.description ?? t('vr360.viewer_placeholder')}
                  </p>
                  <Button variant="outline" size="sm" disabled className="w-fit gap-2">
                    <Volume2 className="h-4 w-4" />
                    {t('vr360.play_narration')}
                  </Button>
                </CardContent>
              </Card>

              {/* Minimap placeholder */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="typo-section-title flex items-center gap-2">
                    <Map className="text-primary h-4 w-4" />
                    {t('vr360.minimap_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted border-muted-foreground/20 flex h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed">
                    <Map className="text-muted-foreground/30 h-8 w-8" />
                    <p className="text-muted-foreground/50 typo-meta text-center">
                      {t('vr360.minimap_placeholder')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
