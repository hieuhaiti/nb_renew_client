import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { env } from '@/config/env';
import { defaultLatLong, defaultZoom } from '@/features/map/constant/mapConstant';

mapboxgl.accessToken = env.mapboxToken;

const SPOT_ZOOM = 14;
const STYLE = env.minimapMapboxStyle_Satellite || env.minimapMapboxStyle_Street || env.mapboxStyle_Street;

export default function Vr360MiniMap({ coordinates }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const center = coordinates
      ? [coordinates[0], coordinates[1]]
      : [defaultLatLong.lng, defaultLatLong.lat];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE,
      center,
      zoom: coordinates ? SPOT_ZOOM : defaultZoom,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current?.remove();
    markerRef.current = null;

    const center = coordinates
      ? [coordinates[0], coordinates[1]]
      : [defaultLatLong.lng, defaultLatLong.lat];
    const zoom = coordinates ? SPOT_ZOOM : defaultZoom;

    if (coordinates) {
      const addMarker = () => {
        markerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(center)
          .addTo(map);
      };
      if (map.isStyleLoaded()) addMarker();
      else map.once('load', addMarker);
    }

    map.flyTo({ center, zoom });
  }, [coordinates]);

  return <div ref={containerRef} className="h-full w-full" />;
}
