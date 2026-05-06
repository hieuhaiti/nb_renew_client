import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, withBaseUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingInline from '@/components/common/LoadingInline';
import { Box } from 'lucide-react';

const AFRAME_CDN = 'https://aframe.io/releases/1.5.0/aframe.min.js';

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

export default function Vr360SceneViewer({ scene, hotspots = [], className }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const aSceneRef = useRef(null);
  const aSkyRef = useRef(null);
  const aCameraRef = useRef(null);
  const hotspotsRootRef = useRef(null);
  const [aframeReady, setAframeReady] = useState(!!window.AFRAME);
  const [isSceneImageLoading, setIsSceneImageLoading] = useState(false);

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
    aScene.appendChild(aCamera);

    aSkyRef.current = aSky;
    hotspotsRootRef.current = hotspotsRoot;
    aCameraRef.current = aCamera;
    aSceneRef.current = aScene;
    container.appendChild(aScene);

    return () => {
      try {
        container.removeChild(aScene);
      } catch {}
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
    if (!scene || !aCameraRef.current) return;
    const camPos = scene.camera_position || { x: 0, y: 1.6, z: 0 };
    aCameraRef.current.setAttribute(
      'position',
      `${camPos.x ?? 0} ${camPos.y ?? 1.6} ${camPos.z ?? 0}`
    );
    aCameraRef.current.setAttribute('fov', String(scene.camera_fov ?? 80));
  }, [
    scene?.id,
    scene?.camera_fov,
    scene?.camera_position?.x,
    scene?.camera_position?.y,
    scene?.camera_position?.z,
  ]);

  useEffect(() => {
    const root = hotspotsRootRef.current;
    if (!root) return;

    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }

    hotspots
      .filter((h) => h.is_active !== false && h.visible !== false)
      .forEach((h) => {
        const pos = h.position || { x: 0, y: 1.6, z: -3 };
        const entity = document.createElement('a-entity');
        entity.setAttribute('position', `${pos.x ?? 0} ${pos.y ?? 1.6} ${pos.z ?? -3}`);

        const text = document.createElement('a-text');
        text.setAttribute('value', String(h.name || ''));
        text.setAttribute('color', '#ffffff');
        text.setAttribute('align', 'center');
        text.setAttribute('scale', '2 2 2');
        text.setAttribute('look-at', '[camera]');
        entity.appendChild(text);

        root.appendChild(entity);
      });
  }, [hotspots]);

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
      {isSceneImageLoading ? (
        <div className="bg-background/30 pointer-events-none absolute inset-0">
          <LoadingInline position="center" size="small" color="muted" className="h-full py-0" />
        </div>
      ) : null}
    </div>
  );
}
