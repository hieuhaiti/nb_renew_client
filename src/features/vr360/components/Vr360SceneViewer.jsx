import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, withBaseUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingInline from '@/components/common/LoadingInline';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFovStore } from '../store/useFovStore';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

const AFRAME_CDN = 'https://aframe.io/releases/1.5.0/aframe.min.js';
const AFRAME_TEXT_FONT = 'https://cdn.aframe.io/fonts/Roboto-msdf.json';
const AFRAME_TEXT_FONT_IMAGE = 'https://cdn.aframe.io/fonts/Roboto-msdf.png';
const DEFAULT_CAMERA_POSITION = { x: 0, y: 1.6, z: 0 };
const DEFAULT_CAMERA_ROTATION = { x: 0, y: 0, z: 0 };
const DEFAULT_FOV = 80;

const LABEL_MAX_WIDTH = 720;
const LABEL_FONT_SIZE = 50;
const LABEL_MAX_LINES = 3;
const LABEL_PADDING_X = 36;
const LABEL_PADDING_Y = 24;
const LABEL_LINE_HEIGHT = Math.round(LABEL_FONT_SIZE * 1.25);
const LABEL_BORDER_RADIUS = 20;
const LABEL_TEXT_COLOR = '#ffffff';
const LABEL_BG_COLOR = 'rgba(15, 23, 42, 0.72)';
const LABEL_PLANE_BASE_WIDTH = 2.4;
const LABEL_Y_OFFSET = 0.38;

function normalizeLabel(value) {
  const safe = String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/;/g, ',')
    .trim();
  return safe || '-';
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function splitLabelLines(ctx, label, maxWidth, maxLines) {
  const words = normalizeLabel(label).split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = ctx.measureText(candidate).width;

    if (candidateWidth <= maxWidth || !currentLine) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;

    if (lines.length >= maxLines - 1) break;
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    let last = lines[maxLines - 1];
    while (last.length > 1 && ctx.measureText(`${last}...`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last}...`;
  }

  return lines;
}

function createVietnameseLabelTexture(label) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;

  const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const logicalWidth = LABEL_MAX_WIDTH;

  context.font = `600 ${LABEL_FONT_SIZE}px "Be Vietnam Pro", "Noto Sans", Arial, sans-serif`;
  const maxTextWidth = logicalWidth - LABEL_PADDING_X * 2;
  const lines = splitLabelLines(context, label, maxTextWidth, LABEL_MAX_LINES);
  const logicalHeight = LABEL_PADDING_Y * 2 + lines.length * LABEL_LINE_HEIGHT;

  canvas.width = Math.ceil(logicalWidth * pixelRatio);
  canvas.height = Math.ceil(logicalHeight * pixelRatio);

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, logicalWidth, logicalHeight);

  roundRectPath(context, 0, 0, logicalWidth, logicalHeight, LABEL_BORDER_RADIUS);
  context.fillStyle = LABEL_BG_COLOR;
  context.fill();

  context.font = `600 ${LABEL_FONT_SIZE}px "Be Vietnam Pro", "Noto Sans", Arial, sans-serif`;
  context.fillStyle = LABEL_TEXT_COLOR;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const centerX = logicalWidth / 2;
  const contentHeight = lines.length * LABEL_LINE_HEIGHT;
  const startY = (logicalHeight - contentHeight) / 2 + LABEL_LINE_HEIGHT / 2;

  lines.forEach((line, lineIndex) => {
    context.fillText(line, centerX, startY + lineIndex * LABEL_LINE_HEIGHT);
  });

  return {
    canvas,
    width: logicalWidth,
    height: logicalHeight,
  };
}

function createHotspotLabel(label) {
  const THREE = window.AFRAME?.THREE || window.THREE;
  if (!THREE) return null;

  const texturePayload = createVietnameseLabelTexture(label);
  if (!texturePayload) return null;

  const texture = new THREE.CanvasTexture(texturePayload.canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const planeWidth = LABEL_PLANE_BASE_WIDTH;
  const planeHeight = (texturePayload.height / texturePayload.width) * planeWidth;

  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, LABEL_Y_OFFSET, 0);
  mesh.renderOrder = 1000;
  mesh.userData.disposeLabel = () => {
    geometry.dispose();
    material.map?.dispose();
    material.dispose();
  };

  return mesh;
}

function disposeLabelObject(entity) {
  const labelObject = entity?.getObject3D?.('hotspot-label');
  if (labelObject?.userData?.disposeLabel) {
    labelObject.userData.disposeLabel();
  }
  if (labelObject) {
    entity.removeObject3D('hotspot-label');
  }
}

function disposeHotspotEntity(entity) {
  if (!entity) return;
  const labelEntity = entity.firstElementChild;
  if (labelEntity) {
    disposeLabelObject(labelEntity);
  }
}

function loadAFrame() {
  return new Promise((resolve) => {
    if (window.AFRAME) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${AFRAME_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = AFRAME_CDN;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function clampVolume(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return 50;
  return Math.min(100, Math.max(0, next));
}

function toRadians(degree) {
  return (Number(degree) * Math.PI) / 180;
}

function toDegrees(radian) {
  return (Number(radian) * 180) / Math.PI;
}

function normalizeBearing(degree) {
  const safe = Number.isFinite(Number(degree)) ? Number(degree) : 0;
  return ((safe % 360) + 360) % 360;
}

const RESET_NORTH_EVENT = 'vr360-reset-north';

function getNarrationRawUrl(scene) {
  if (!scene) return '';
  return scene.narration_audio_url || scene.ambient_sound_url || '';
}

export default function Vr360SceneViewer({
  scene,
  hotspots = [],
  onPrevScene,
  onNextScene,
  canGoPrevScene = false,
  canGoNextScene = false,
  onHotspotClick,
  className,
}) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const aSceneRef = useRef(null);
  const aSkyRef = useRef(null);
  const aCameraRef = useRef(null);
  const hotspotsRootRef = useRef(null);
  const narrationAudioRef = useRef(null);
  const volumeControlRef = useRef(null);
  const headingRafRef = useRef(null);
  const lastHeadingRef = useRef(null);

  const [aframeReady, setAframeReady] = useState(!!window.AFRAME);
  const [isSceneImageLoading, setIsSceneImageLoading] = useState(false);
  const [narrationVolume, setNarrationVolume] = useState(50);
  const [isNarrationMuted, setIsNarrationMuted] = useState(false);
  const [isNarrationAutoPlay, setIsNarrationAutoPlay] = useState(true);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);
  const fovAngle = useFovStore((state) => state.fovAngle);
  const setFovAngle = useFovStore((state) => state.setFovAngle);

  const onHotspotClickRef = useRef(onHotspotClick);
  useEffect(() => {
    onHotspotClickRef.current = onHotspotClick;
  }, [onHotspotClick]);

  const narrationRawUrl = getNarrationRawUrl(scene);
  const narrationUrl = useMemo(
    () => (narrationRawUrl ? withBaseUrl(narrationRawUrl) || narrationRawUrl : ''),
    [narrationRawUrl]
  );

  const hasNarration = Boolean(narrationUrl);

  const applySceneCamera = useCallback(() => {
    if (!scene || !aCameraRef.current) return;

    const camera = aCameraRef.current;
    const camPos = scene.camera_position || DEFAULT_CAMERA_POSITION;
    const camRot = scene.camera_rotation || DEFAULT_CAMERA_ROTATION;
    const cameraFov = Number(fovAngle) || Number(scene.camera_fov) || DEFAULT_FOV;

    camera.setAttribute('position', `${camPos.x ?? 0} ${camPos.y ?? 1.6} ${camPos.z ?? 0}`);
    camera.setAttribute('rotation', `${camRot.x ?? 0} ${camRot.y ?? 0} ${camRot.z ?? 0}`);
    camera.setAttribute('fov', String(cameraFov));

    const lookControls = camera.components?.['look-controls'];
    if (lookControls?.yawObject && lookControls?.pitchObject) {
      lookControls.yawObject.rotation.y = toRadians(camRot.y ?? 0);
      lookControls.pitchObject.rotation.x = toRadians(camRot.x ?? 0);
      if (lookControls.pitchObject.rotation.z !== undefined) {
        lookControls.pitchObject.rotation.z = toRadians(camRot.z ?? 0);
      }
    }

    const cameraObj = camera.getObject3D('camera');
    if (cameraObj) {
      cameraObj.fov = cameraFov;
      cameraObj.updateProjectionMatrix();
    }
  }, [scene, fovAngle]);

  useEffect(() => {
    loadAFrame().then(() => setAframeReady(true));
  }, []);

  useEffect(() => {
    if (!aframeReady || !containerRef.current || !scene) return;
    if (aSceneRef.current) return;

    const container = containerRef.current;
    const aScene = document.createElement('a-scene');
    aScene.setAttribute('embedded', '');
    aScene.setAttribute('vr-mode-ui', 'enabled: false');
    aScene.setAttribute('loading-screen', 'enabled: false');
    aScene.setAttribute(
      'renderer',
      'antialias: false; precision: mediump; colorManagement: true; sortObjects: true; physicallyCorrectLights: false;'
    );
    aScene.style.height = '100%';
    aScene.style.width = '100%';

    const aSky = document.createElement('a-sky');
    aSky.setAttribute('crossorigin', 'anonymous');
    aSky.setAttribute('segments-width', '32');
    aSky.setAttribute('segments-height', '16');
    aScene.appendChild(aSky);

    const hotspotsRoot = document.createElement('a-entity');
    aScene.appendChild(hotspotsRoot);

    const aCamera = document.createElement('a-camera');
    aCamera.setAttribute('look-controls', 'enabled: true');
    aCamera.setAttribute('cursor', 'rayOrigin: mouse');
    aCamera.setAttribute('raycaster', 'objects: .hs-click-target; recursive: false');
    aScene.appendChild(aCamera);

    aSkyRef.current = aSky;
    hotspotsRootRef.current = hotspotsRoot;
    aCameraRef.current = aCamera;
    aSceneRef.current = aScene;
    container.appendChild(aScene);

    return () => {
      try {
        container.removeChild(aScene);
      } catch {
        // no-op
      }
      aSceneRef.current = null;
      aSkyRef.current = null;
      hotspotsRootRef.current = null;
      aCameraRef.current = null;
    };
  }, [aframeReady, scene]);

  useEffect(() => {
    if (!scene || !aSkyRef.current) return;

    const rawUrl = scene.equirectangular_image_url;
    const imageUrl = rawUrl ? withBaseUrl(rawUrl) || rawUrl : '';

    if (imageUrl) {
      setIsSceneImageLoading(true);
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';

      image.onload = () => {
        if (!aSkyRef.current) return;
        aSkyRef.current.setAttribute('src', imageUrl);
        aSkyRef.current.setAttribute('color', '#ffffff');
        setIsSceneImageLoading(false);
      };

      image.onerror = () => {
        setIsSceneImageLoading(false);
      };

      image.src = imageUrl;

      return () => {
        image.onload = null;
        image.onerror = null;
      };
    }

    setIsSceneImageLoading(false);
    aSkyRef.current.removeAttribute('src');
    aSkyRef.current.setAttribute('color', '#1a1a2e');
  }, [scene?.id, scene?.equirectangular_image_url]);

  useEffect(() => {
    applySceneCamera();
  }, [applySceneCamera]);

  useEffect(() => {
    const sceneFov = Number(scene?.camera_fov);
    if (!Number.isFinite(sceneFov)) return;
    setFovAngle(sceneFov);
  }, [scene?.id, scene?.camera_fov, setFovAngle]);

  useEffect(() => {
    const cameraEl = aCameraRef.current;
    if (!cameraEl) return;

    const currentFov = Number(fovAngle) || Number(scene?.camera_fov) || DEFAULT_FOV;
    cameraEl.setAttribute('animation__fov', {
      property: 'fov',
      to: currentFov,
      dur: 300,
      easing: 'easeInOutQuad',
    });
    cameraEl.setAttribute('fov', currentFov);

    const cameraObj = cameraEl.getObject3D('camera');
    if (cameraObj) {
      cameraObj.fov = currentFov;
      cameraObj.updateProjectionMatrix();
    }
  }, [fovAngle, scene?.id, scene?.camera_fov]);

  useEffect(() => {
    const root = hotspotsRootRef.current;
    if (!root) return;

    while (root.firstChild) {
      disposeHotspotEntity(root.firstChild);
      root.removeChild(root.firstChild);
    }

    hotspots
      .filter((hotspot) => hotspot.is_active !== false && hotspot.visible !== false)
      .forEach((hotspot) => {
        const pos = hotspot.position || { x: 0, y: 1.6, z: -3 };
        const entity = document.createElement('a-entity');
        entity.setAttribute('position', `${pos.x ?? 0} ${pos.y ?? 1.6} ${pos.z ?? -3}`);

        const labelEntity = document.createElement('a-entity');
        const label = normalizeLabel(hotspot.name);
        const labelMesh = createHotspotLabel(label);

        if (labelMesh) {
          labelEntity.setObject3D('hotspot-label', labelMesh);
        } else {
          labelEntity.setAttribute('text', {
            value: label,
            font: AFRAME_TEXT_FONT,
            fontImage: AFRAME_TEXT_FONT_IMAGE,
            color: '#ffffff',
            align: 'center',
            width: 4,
            wrapCount: 24,
            shader: 'msdf',
            negate: false,
          });
        }

        labelEntity.setAttribute('look-at', '[camera]');

        const isNavigate = hotspot.hotspot_type === 'navigate';
        const targetSceneId = hotspot.target_scene_id || hotspot.linked_scene_id;
        const targetSpotId = hotspot.target_spot_id;
        const targetSpotSlug = hotspot.target_spot_slug;
        const hasNavigation = isNavigate && Boolean(targetSceneId || targetSpotId || targetSpotSlug);

        // eslint-disable-next-line no-console
        console.debug('[VR360 hotspot]', {
          id: hotspot.id,
          name: hotspot.name,
          hotspot_type: hotspot.hotspot_type,
          target_scene_id: hotspot.target_scene_id,
          target_spot_id: hotspot.target_spot_id,
          hasNavigation,
        });

        if (hasNavigation) {
          const dot = document.createElement('a-entity');
          dot.setAttribute('geometry', 'primitive: sphere; radius: 0.1');
          dot.setAttribute(
            'material',
            'color: #f59e0b; opacity: 0.9; transparent: true; depthTest: false'
          );

          const clickSphere = document.createElement('a-entity');
          clickSphere.setAttribute('geometry', 'primitive: sphere; radius: 0.22');
          clickSphere.setAttribute(
            'material',
            'transparent: true; opacity: 0; depthTest: false; depthWrite: false'
          );
          clickSphere.classList.add('hs-click-target');
          clickSphere.addEventListener('click', () => {
            // eslint-disable-next-line no-console
            console.debug('[VR360 hotspot] click fired', { hotspot, targetSceneId, targetSpotId });
            onHotspotClickRef.current?.(hotspot);
          });

          entity.appendChild(dot);
          entity.appendChild(clickSphere);
        }

        entity.appendChild(labelEntity);
        root.appendChild(entity);
      });

    return () => {
      while (root.firstChild) {
        disposeHotspotEntity(root.firstChild);
        root.removeChild(root.firstChild);
      }
    };
  }, [hotspots]);

  useEffect(() => {
    const sceneVolume = Number(scene?.ambient_sound_volume);
    if (Number.isFinite(sceneVolume)) {
      setNarrationVolume(clampVolume(sceneVolume * 100));
    }
    setIsNarrationAutoPlay(scene?.auto_play_narration ?? true);
    setIsNarrationMuted(false);
  }, [scene?.id]);

  useEffect(() => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
      narrationAudioRef.current.src = '';
      narrationAudioRef.current = null;
    }

    if (!narrationUrl) {
      setIsNarrationPlaying(false);
      return;
    }

    const audio = new Audio(narrationUrl);
    audio.preload = 'auto';
    audio.loop = !scene?.narration_audio_url && Boolean(scene?.ambient_sound_loop);
    audio.volume = clampVolume(narrationVolume) / 100;
    audio.muted = isNarrationMuted;

    const handlePlay = () => setIsNarrationPlaying(true);
    const handlePause = () => setIsNarrationPlaying(false);
    const handleEnd = () => setIsNarrationPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnd);

    narrationAudioRef.current = audio;

    if (isNarrationAutoPlay) {
      audio.play().catch(() => {
        setIsNarrationPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
      audio.src = '';
      if (narrationAudioRef.current === audio) {
        narrationAudioRef.current = null;
      }
    };
  }, [
    narrationUrl,
    scene?.id,
    scene?.ambient_sound_loop,
    scene?.narration_audio_url,
    isNarrationAutoPlay,
  ]);

  useEffect(() => {
    const audio = narrationAudioRef.current;
    if (!audio) return;
    audio.volume = clampVolume(narrationVolume) / 100;
    audio.muted = isNarrationMuted;
  }, [narrationVolume, isNarrationMuted]);

  const handleTogglePlay = useCallback(() => {
    const audio = narrationAudioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {
        setIsNarrationPlaying(false);
      });
      return;
    }

    audio.pause();
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsNarrationMuted((prev) => !prev);
  }, []);

  const handleResetView = useCallback(() => {
    const cameraEl = aCameraRef.current;
    if (!cameraEl) return;

    cameraEl.setAttribute('rotation', '0 0 0');
    const lookControls = cameraEl.components?.['look-controls'];
    if (lookControls?.yawObject?.rotation) {
      lookControls.yawObject.rotation.y = 0;
    }
    if (lookControls?.pitchObject?.rotation) {
      lookControls.pitchObject.rotation.x = 0;
      if (lookControls.pitchObject.rotation.z !== undefined) {
        lookControls.pitchObject.rotation.z = 0;
      }
    }

    lastHeadingRef.current = 0;
    window.dispatchEvent(new CustomEvent('smooth-fov-update', { detail: { bearing: 0 } }));
  }, []);

  useEffect(() => {
    if (!scene || !aCameraRef.current) return undefined;

    let isAlive = true;

    const emitHeading = () => {
      if (!isAlive) return;
      const cameraEl = aCameraRef.current;
      if (!cameraEl) return;

      const lookControls = cameraEl.components?.['look-controls'];
      let nextHeading = null;

      if (lookControls?.yawObject?.rotation) {
        nextHeading = normalizeBearing(toDegrees(lookControls.yawObject.rotation.y));
      } else {
        const rotY = Number(cameraEl.getAttribute('rotation')?.y);
        if (Number.isFinite(rotY)) nextHeading = normalizeBearing(rotY);
      }

      if (nextHeading != null) {
        const prevHeading = lastHeadingRef.current;
        if (prevHeading == null || Math.abs(prevHeading - nextHeading) > 0.2) {
          lastHeadingRef.current = nextHeading;
          window.dispatchEvent(
            new CustomEvent('smooth-fov-update', {
              detail: { bearing: nextHeading },
            })
          );
        }
      }

      headingRafRef.current = window.requestAnimationFrame(emitHeading);
    };

    headingRafRef.current = window.requestAnimationFrame(emitHeading);

    return () => {
      isAlive = false;
      if (headingRafRef.current) {
        window.cancelAnimationFrame(headingRafRef.current);
        headingRafRef.current = null;
      }
      lastHeadingRef.current = null;
    };
  }, [scene?.id]);

  useEffect(() => {
    const handleResetNorthRequest = () => {
      handleResetView();
    };

    window.addEventListener(RESET_NORTH_EVENT, handleResetNorthRequest);
    return () => {
      window.removeEventListener(RESET_NORTH_EVENT, handleResetNorthRequest);
    };
  }, [handleResetView]);

  if (!aframeReady) {
    return <Skeleton className={cn('h-full w-full', className)} />;
  }

  if (!scene) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center',
          className
        )}
      >
        <Box className="text-muted-foreground/40 h-12 w-12" />
        <p className="text-muted-foreground typo-body max-w-xs">{t('vr360.viewer_placeholder')}</p>
      </div>
    );
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div ref={containerRef} className="h-full w-full" />

      <TooltipProvider>
        <div className="pointer-events-none absolute top-3 right-3 left-3 z-20 flex items-start justify-between gap-2">
          <div className="bg-background/85 pointer-events-auto flex items-center gap-2 rounded-lg border p-1 shadow-sm backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onPrevScene}
                  disabled={!canGoPrevScene}
                  aria-label={t('vr360.scene_prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="typo-button">{t('common.prev')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {t('vr360.scene_prev')}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onNextScene}
                  disabled={!canGoNextScene}
                  aria-label={t('vr360.scene_next')}
                >
                  <span className="typo-button">{t('common.next')}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {t('vr360.scene_next')}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={handleResetView}
                  aria-label={t('vr360.reset_view')}
                >
                  <span className="typo-button">{t('common.reset')}</span>
                  <Compass className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {t('vr360.reset_view')}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-background/85 pointer-events-auto flex items-center gap-2 rounded-lg border p-2 shadow-sm backdrop-blur-sm">
            <div
              ref={volumeControlRef}
              className="group flex items-center"
              onMouseEnter={() => setIsVolumeControlOpen(true)}
              onMouseLeave={() => setIsVolumeControlOpen(false)}
              onFocusCapture={() => setIsVolumeControlOpen(true)}
              onBlurCapture={(event) => {
                const nextFocusTarget = event.relatedTarget;
                if (volumeControlRef.current?.contains(nextFocusTarget)) return;
                setIsVolumeControlOpen(false);
              }}
            >
              <div
                className={cn(
                  'flex items-center overflow-hidden pr-0 transition-all duration-200',
                  isVolumeControlOpen ? 'w-44 pr-2 opacity-100' : 'w-0 opacity-0'
                )}
              >
                <div className="bg-background/90 border-border/70 flex h-8 w-full items-center gap-2 rounded-full border px-2 shadow-inner">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[narrationVolume]}
                    onValueChange={(values) => setNarrationVolume(clampVolume(values?.[0]))}
                    disabled={!hasNarration}
                    className="w-full"
                    trackClassName="bg-muted/70 h-1.5"
                    rangeClassName="from-primary to-tertiary bg-gradient-to-r"
                    thumbClassName="size-3.5 border-border bg-white ring-2 ring-white/20 hover:ring-3 focus-visible:ring-3"
                    aria-label={t('vr360.narration_volume')}
                  />
                  <span className="text-foreground/90 w-8 text-right text-xs font-semibold tabular-nums">
                    {narrationVolume}
                  </span>
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={handleToggleMute}
                    disabled={!hasNarration}
                    aria-label={
                      isNarrationMuted ? t('vr360.narration_unmute') : t('vr360.narration_mute')
                    }
                  >
                    {isNarrationMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6}>
                  {isNarrationMuted ? t('vr360.narration_unmute') : t('vr360.narration_mute')}
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={handleTogglePlay}
                  disabled={!hasNarration}
                  aria-label={
                    isNarrationPlaying ? t('vr360.narration_pause') : t('vr360.narration_play')
                  }
                >
                  {isNarrationPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {isNarrationPlaying ? t('vr360.narration_pause') : t('vr360.narration_play')}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant={isNarrationAutoPlay ? 'default' : 'outline'}
                  onClick={() => setIsNarrationAutoPlay((prev) => !prev)}
                  aria-label={t('vr360.narration_autoplay')}
                >
                  {t('vr360.narration_autoplay')}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {isNarrationAutoPlay
                  ? t('vr360.narration_autoplay_on')
                  : t('vr360.narration_autoplay_off')}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      {isSceneImageLoading ? (
        <div className="bg-background/30 pointer-events-none absolute inset-0">
          <LoadingInline position="center" size="small" color="muted" className="h-full py-0" />
        </div>
      ) : null}
    </div>
  );
}
