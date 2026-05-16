import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import {
  useGetAllDataPoints,
  useGetDataPointById,
  useGetNearbyPoints,
} from '@/services/api/tourism-points/tourismPointsApi';
import {
  useGetAframeScenes,
  useGetAframeSceneHotspots,
} from '@/services/api/vr360/aframeSceneService';
import Vr360SceneViewer from '../components/Vr360SceneViewer';
import MiniMap from '../components/MiniMap';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Layers,
  Info,
  Bookmark,
  Map,
  Volume2,
  MousePointer2,
  ArrowRightFromLine,
  MapPin,
  Box,
  Star,
  Clock,
  Users,
} from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';

const SCENE_PREVIEW =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80';

const C = {
  primary: '#0f9f8f',
  primaryDark: '#05796d',
  secondary: '#ffb703',
  blue: '#219ebc',
  text: '#15324f',
  muted: '#64748b',
  light: '#f5fbff',
  border: '#e2edf5',
};

const panelStyle = {
  background: 'rgba(255,255,255,0.96)',
  border: `1px solid ${C.border}`,
  borderRadius: '26px',
  boxShadow: '0 18px 45px rgba(15,47,73,.12)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const panelHeadStyle = {
  padding: '16px 18px',
  borderBottom: `1px solid ${C.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
};

// ─── helpers ────────────────────────────────────────────────────────────────

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

// ─── sub-components ─────────────────────────────────────────────────────────

function SceneCard({ scene, index, isSelected, onClick }) {
  const { t } = useTranslation();
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: '86px 1fr',
        gap: '12px',
        padding: '10px',
        border: `1px solid ${isSelected ? '#8de2d7' : C.border}`,
        borderRadius: '18px',
        background: isSelected ? '#f0fffc' : '#fff',
        cursor: 'pointer',
        transition: '0.25s',
        transform: isSelected ? 'translateY(-2px)' : 'none',
        outline: 'none',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: '74px',
            borderRadius: '14px',
            backgroundImage: `url('${SCENE_PREVIEW}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {scene.is_main && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              fontSize: '10px',
              fontWeight: 900,
              background: C.secondary,
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '999px',
            }}
          >
            {t('vr360.main_badge')}
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: '11px',
            color: C.primary,
            fontWeight: 900,
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {String(index + 1).padStart(2, '0')} · {isSelected ? t('vr360.current_scene') : t('vr360.scene_label')}
        </span>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.3,
            marginBottom: '4px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {scene.name}
        </h4>
        <p
          style={{
            fontSize: '12px',
            color: C.muted,
            lineHeight: 1.45,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {scene.description || t('vr360.scene_default_desc')}
        </p>
      </div>
    </article>
  );
}

function SceneCardSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '86px 1fr',
        gap: '12px',
        padding: '10px',
        border: `1px solid ${C.border}`,
        borderRadius: '18px',
      }}
    >
      <Skeleton style={{ height: '74px', borderRadius: '14px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
        <Skeleton style={{ height: '12px', width: '60px', borderRadius: '6px' }} />
        <Skeleton style={{ height: '16px', width: '100%', borderRadius: '6px' }} />
        <Skeleton style={{ height: '12px', width: '80%', borderRadius: '6px' }} />
      </div>
    </div>
  );
}

function MetaBox({ label, value }) {
  return (
    <div
      style={{
        background: C.light,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '12px',
      }}
    >
      <b
        style={{
          display: 'block',
          color: C.primary,
          fontSize: '17px',
          marginBottom: '3px',
          fontWeight: 800,
        }}
      >
        {value ?? '-'}
      </b>
      <span style={{ fontSize: '12px', color: C.muted, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function LegendBadge({ children }) {
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 900,
        background: '#eefaf9',
        color: C.primaryDark,
        padding: '8px 10px',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function ActionBtn({ primary, onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: '999px',
        padding: '12px 10px',
        fontWeight: 900,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        background: primary ? `linear-gradient(135deg,${C.primary},${C.blue})` : '#eefaf9',
        color: primary ? '#fff' : C.primaryDark,
        boxShadow: primary ? '0 12px 26px rgba(33,158,188,.22)' : 'none',
        fontSize: '12px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.88';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── empty state ─────────────────────────────────────────────────────────────

function NoSpotEmptyState({ onBack }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '20px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(135deg,${C.primary}20,${C.blue}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box style={{ width: '36px', height: '36px', color: C.primary, opacity: 0.5 }} />
      </div>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.text, marginBottom: '8px' }}>
          {t('vr360.no_spot_title')}
        </h2>
        <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.6, maxWidth: '340px' }}>
          {t('vr360.no_spot_desc')}
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '999px',
          padding: '12px 24px',
          background: `linear-gradient(135deg,${C.primary},${C.blue})`,
          color: '#fff',
          fontWeight: 900,
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 12px 26px rgba(15,159,143,.25)',
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        {t('vr360.back_to_map')}
      </button>
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function Vr360PageContent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillHandledRef = useRef(false);
  const narrationToggleRef = useRef(null);

  const entrySpotId = useMemo(
    () => location.state?.spotId ?? location.state?.spot?.id ?? location.state?.spot?.spot_id,
    [location.state]
  );

  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Prefill from navigation state
  useEffect(() => {
    if (prefillHandledRef.current) return;
    if (!entrySpotId) return;
    prefillHandledRef.current = true;
    setSelectedSpotId(String(entrySpotId));
  }, [entrySpotId]);

  // ── data queries ────────────────────────────────────────────────────────────
  const activeSpotId = selectedSpotId || entrySpotId;

  const spotsQuery = useGetAllDataPoints({ limit: 100 });
  const spots = useMemo(() => normalizeList(spotsQuery.data), [spotsQuery.data]);

  const spotInfoQuery = useGetDataPointById({ point_id: activeSpotId });
  const spotInfo = useMemo(() => {
    const payload = spotInfoQuery.data?.data ?? spotInfoQuery.data;
    return payload?.spot ?? payload ?? null;
  }, [spotInfoQuery.data]);

  const scenesQuery = useGetAframeScenes({ spotId: selectedSpotId });
  const scenes = useMemo(() => normalizeList(scenesQuery.data), [scenesQuery.data]);

  const selectedSpot = useMemo(() => {
    if (selectedSpotId == null) return null;
    return (
      spots.find((s) => String(s?.id ?? s?.spot_id ?? s?.point_id) === String(selectedSpotId)) ??
      null
    );
  }, [spots, selectedSpotId]);

  const selectedScene = useMemo(() => {
    if (!scenes.length) return null;
    if (selectedSceneId != null) {
      return scenes.find((s) => String(s.id) === String(selectedSceneId)) ?? scenes[0];
    }
    return scenes.find((s) => s.is_main) ?? scenes[0];
  }, [scenes, selectedSceneId]);

  const selectedSceneIndex = useMemo(() => {
    if (!selectedScene?.id) return -1;
    return scenes.findIndex((s) => String(s.id) === String(selectedScene.id));
  }, [scenes, selectedScene?.id]);

  const canGoPrevScene = selectedSceneIndex > 0;
  const canGoNextScene = selectedSceneIndex > -1 && selectedSceneIndex < scenes.length - 1;

  const hotspotsQuery = useGetAframeSceneHotspots({
    spotId: selectedSpotId,
    sceneId: selectedScene?.id,
  });
  const hotspots = useMemo(() => normalizeList(hotspotsQuery.data), [hotspotsQuery.data]);

  const spotCoordinates = useMemo(
    () => getCoordinatesFromSpot(spotInfo) || getCoordinatesFromSpot(selectedSpot),
    [spotInfo, selectedSpot]
  );

  const nearbyQuery = useGetNearbyPoints({
    lat: spotCoordinates?.[1] ?? null,
    lng: spotCoordinates?.[0] ?? null,
    radius_km: 1,
  });
  const nearbySpots = useMemo(() => {
    const raw = nearbyQuery.data;
    if (!raw) return [];
    const list = raw?.data?.points ?? raw?.data ?? raw?.results ?? raw;
    return (Array.isArray(list) ? list : []).filter(
      (pt) => String(pt?.id ?? pt?.spot_id) !== String(selectedSpotId)
    );
  }, [nearbyQuery.data, selectedSpotId]);

  const miniMapScenes = useMemo(
    () =>
      scenes.map((scene) => ({
        ...scene,
        coordinates: scene?.coordinates || spotCoordinates || undefined,
      })),
    [scenes, spotCoordinates]
  );

  const currentSpot = spotInfo || selectedSpot;

  // ── prefetch adjacent scenes ─────────────────────────────────────────────
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

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleGoPrevScene = useCallback(() => {
    if (!canGoPrevScene) return;
    setSelectedSceneId(scenes[selectedSceneIndex - 1]?.id ?? null);
  }, [canGoPrevScene, scenes, selectedSceneIndex]);

  const handleGoNextScene = useCallback(() => {
    if (!canGoNextScene) return;
    setSelectedSceneId(scenes[selectedSceneIndex + 1]?.id ?? null);
  }, [canGoNextScene, scenes, selectedSceneIndex]);

  const handleNearbySpotClick = useCallback((spot) => {
    const id = spot?.id ?? spot?.spot_id;
    if (!id) return;
    setSelectedSpotId(String(id));
    setSelectedSceneId(null);
  }, []);

  const handleHotspotClick = useCallback(
    (hotspot) => {
      const targetSceneId = hotspot?.target_scene_id || hotspot?.linked_scene_id;
      const targetSpotId = hotspot?.linked_spot_id ?? hotspot?.target_spot_id;
      const targetSpotSlug = hotspot?.target_spot_slug;

      if (targetSpotId) {
        setSelectedSpotId(String(targetSpotId));
        setSelectedSceneId(null);
        return;
      }
      if (targetSpotSlug) {
        const target = spots.find((s) => s.slug === targetSpotSlug);
        if (target?.id) {
          setSelectedSpotId(String(target.id));
          setSelectedSceneId(null);
          return;
        }
      }
      if (targetSceneId) setSelectedSceneId(String(targetSceneId));
    },
    [spots]
  );

  const handleOpenMap = useCallback(() => {
    navigate('/map', { state: { spotId: spotInfo?.id ?? selectedSpotId } });
  }, [navigate, spotInfo?.id, selectedSpotId]);

  // ── derived display values ───────────────────────────────────────────────
  const ratingDisplay = spotInfo?.rating_avg ? `${Number(spotInfo.rating_avg).toFixed(1)}/5` : '-';
  const openingHours = spotInfo?.opening_hours?.default ?? '-';
  const capacityDisplay =
    spotInfo?.current_capacity_pct != null
      ? `${Math.round(Number(spotInfo.current_capacity_pct))}%`
      : '-';
  const maxCapacityDisplay =
    spotInfo?.max_capacity != null
      ? Number(spotInfo.max_capacity).toLocaleString(i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US')
      : '-';

  // ── empty state ─────────────────────────────────────────────────────────────
  if (!activeSpotId) {
    return (
      <RootLayout>
        <NoSpotEmptyState onBack={() => navigate('/map')} />
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div
        className="xl:overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          padding: '16px',
          background: 'linear-gradient(180deg,#f5fbff,#edf8fb)',
          minHeight: '100%',
        }}
      >
        {/* ── 3-col wrapper (xl only) ─────────────────────────────────────── */}
        <div className="xl:contents" style={{ display: 'contents' }} />

        {/* We use a single grid that becomes 3-col on xl */}
        <style>{`
          @media (min-width: 1280px) {
            .vr360-grid {
              grid-template-columns: 320px minmax(0,1fr) 360px !important;
              height: calc(100vh - 4.5rem) !important;
              overflow: hidden !important;
            }
          }
        `}</style>

        <div
          className="vr360-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            height: '100%',
          }}
        >
          {/* ══ LEFT: scene list ══════════════════════════════════════════════ */}
          <aside style={panelStyle}>
            <div style={panelHeadStyle}>
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: C.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Layers style={{ width: '18px', height: '18px', color: C.primary }} />
                {t('vr360.scene_list_title')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: C.muted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderRadius: '999px',
                  padding: '6px 10px',
                }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                {t('vr360.back_to_map')}
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Tour title card */}
              {spotInfoQuery.isLoading ? (
                <div
                  style={{
                    borderRadius: '22px',
                    background: 'linear-gradient(135deg,#083d4d,#0f9f8f)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Skeleton
                    style={{
                      height: '24px',
                      width: '120px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <Skeleton
                    style={{
                      height: '28px',
                      width: '100%',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <Skeleton
                    style={{
                      height: '36px',
                      width: '100%',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.15)',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: '22px',
                    background: 'linear-gradient(135deg,#083d4d,#0f9f8f)',
                    color: 'white',
                    padding: '18px',
                  }}
                >
                  <small
                    style={{
                      display: 'inline-flex',
                      gap: '7px',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,.17)',
                      padding: '7px 10px',
                      borderRadius: '999px',
                      fontWeight: 800,
                      marginBottom: '12px',
                      fontSize: '12px',
                    }}
                  >
                    ✦ {t('vr360.tour_badge')}
                  </small>
                  <h2
                    style={{
                      fontSize: '20px',
                      lineHeight: 1.25,
                      marginBottom: '8px',
                      fontWeight: 800,
                    }}
                  >
                    {spotInfo?.name ?? t('vr360.loading')}
                  </h2>
                  {spotInfo?.category_name && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        background: 'rgba(255,255,255,.17)',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        display: 'inline-block',
                        marginBottom: '8px',
                      }}
                    >
                      {spotInfo.category_name}
                    </span>
                  )}
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: '#dff8f5',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {spotInfo?.description ??
                      t('vr360.no_desc_fallback')}
                  </p>
                </div>
              )}

              {/* Scene cards */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {scenesQuery.isLoading ? (
                  [1, 2, 3].map((i) => <SceneCardSkeleton key={i} />)
                ) : scenes.length === 0 ? (
                  <p
                    style={{
                      fontSize: '13px',
                      color: C.muted,
                      textAlign: 'center',
                      padding: '24px 0',
                    }}
                  >
                    {t('vr360.no_scenes')}
                  </p>
                ) : (
                  scenes.map((scene, index) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      index={index}
                      isSelected={String(selectedScene?.id) === String(scene.id)}
                      onClick={() => setSelectedSceneId(String(scene.id))}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* ══ CENTER: viewer ═══════════════════════════════════════════════ */}
          <section
            style={{
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 18px 45px rgba(15,47,73,.12)',
              border: '1px solid rgba(255,255,255,.8)',
              background: '#101820',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '480px',
            }}
          >
            <div style={{ flex: 1, minHeight: 0 }}>
              <Vr360SceneViewer
                scene={selectedScene}
                hotspots={hotspots}
                nearbySpots={nearbySpots}
                spotCoordinates={spotCoordinates}
                onPrevScene={handleGoPrevScene}
                onNextScene={handleGoNextScene}
                canGoPrevScene={canGoPrevScene}
                canGoNextScene={canGoNextScene}
                onHotspotClick={handleHotspotClick}
                onNearbySpotClick={handleNearbySpotClick}
                narrationToggleRef={narrationToggleRef}
                className="h-full w-full"
              />
            </div>

            {/* Bottom guide bar */}
            <div
              style={{
                background: 'rgba(255,255,255,.95)',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px',
                flexShrink: 0,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MousePointer2 style={{ width: '14px', height: '14px', color: C.primary }} />
                  {t('vr360.drag_hint')}
                </h3>
                <p style={{ fontSize: '12px', color: C.muted }}>
                  {t('vr360.hotspot_hint')}
                </p>
              </div>
            </div>
          </section>

          {/* ══ RIGHT: spot info ══════════════════════════════════════════════ */}
          <aside style={panelStyle}>
            <div style={panelHeadStyle}>
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: C.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Info style={{ width: '18px', height: '18px', color: C.primary }} />
                {t('vr360.spot_info_title')}
              </h3>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Info hero */}
              {spotInfoQuery.isLoading ? (
                <Skeleton style={{ height: '120px', borderRadius: '22px' }} />
              ) : (
                <div
                  style={{
                    borderRadius: '22px',
                    background:
                      'linear-gradient(180deg,rgba(8,61,77,.55),rgba(15,159,143,.78)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '16px',
                    color: 'white',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  {spotInfo?.category_name && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        background: 'rgba(255,255,255,.2)',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        display: 'inline-block',
                        marginBottom: '6px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {spotInfo.category_name}
                    </span>
                  )}
                  <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.25 }}>
                    {spotInfo?.name ?? selectedScene?.name ?? t('vr360.loading')}
                  </h2>
                </div>
              )}

              {/* Meta grid */}
              {spotInfoQuery.isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} style={{ height: '60px', borderRadius: '16px' }} />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                  <MetaBox
                    label={t('vr360.rating_label')}
                    value={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star
                          style={{
                            width: '14px',
                            height: '14px',
                            fill: C.secondary,
                            color: C.secondary,
                          }}
                        />
                        {ratingDisplay}
                      </span>
                    }
                  />
                  <MetaBox
                    label={t('vr360.opening_hours_label')}
                    value={
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                        }}
                      >
                        <Clock style={{ width: '13px', height: '13px' }} />
                        {openingHours}
                      </span>
                    }
                  />
                  <MetaBox
                    label={t('vr360.current_capacity_label')}
                    value={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users style={{ width: '14px', height: '14px' }} />
                        {capacityDisplay}
                      </span>
                    }
                  />
                  <MetaBox label={t('vr360.max_capacity_label')} value={maxCapacityDisplay} />
                </div>
              )}

              {/* Description */}
              {spotInfo?.description && (
                <p
                  style={{
                    fontSize: '13px',
                    color: C.muted,
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {spotInfo.description}
                </p>
              )}

              {/* MiniMap */}
              <div
                style={{ borderRadius: '22px', overflow: 'hidden', height: '180px', flexShrink: 0 }}
              >
                <MiniMap
                  scenes={miniMapScenes}
                  spots={spots}
                  currentSpot={currentSpot}
                  currentSceneIndex={Math.max(0, selectedSceneIndex)}
                  onSelectScene={(nextScene) => {
                    if (nextScene?.id) setSelectedSceneId(nextScene.id);
                  }}
                  onSelectSpot={(spot) => {
                    if (!spot?.id) return;
                    setSelectedSpotId(String(spot.id));
                    setSelectedSceneId(null);
                  }}
                  showFovControls={false}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                <ActionBtn
                  primary
                  onClick={handleOpenMap}
                  icon={<Map style={{ width: '15px', height: '15px' }} />}
                >
                  {t('vr360.open_map')}
                </ActionBtn>
                <ActionBtn
                  onClick={() => narrationToggleRef.current?.()}
                  icon={<Volume2 style={{ width: '15px', height: '15px' }} />}
                >
                  {t('vr360.narration')}
                </ActionBtn>
              </div>

              {/* Address note */}
              {spotInfo?.address && (
                <div
                  style={{
                    padding: '13px',
                    borderRadius: '16px',
                    background: '#fff8e6',
                    color: '#9a5b00',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    border: '1px solid #ffe2a6',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start',
                  }}
                >
                  <MapPin
                    style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px' }}
                  />
                  {spotInfo.address}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </RootLayout>
  );
}
