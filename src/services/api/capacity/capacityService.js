import { useEffect, useRef, useState } from 'react';
import { useApiQuery, useApiMutation } from '@/services/useApi';
import { env } from '@/config/env';

// GET /capacity/current
export function useGetCurrentCapacity(options = {}) {
  return useApiQuery(['capacity', 'current'], 'capacity/current', {
    staleTime: 60 * 1000,
    ...options,
  });
}

// GET /capacity/current/geojson
export function useGetCapacityGeoJson(options = {}) {
  return useApiQuery(['capacity', 'current', 'geojson'], 'capacity/current/geojson', {
    staleTime: 60 * 1000,
    ...options,
  });
}

// GET /capacity/spots/:spotId/history
export function useGetCapacityHistory(spotId, options = {}) {
  return useApiQuery(
    ['capacity', 'history', spotId],
    `capacity/spots/${spotId}/history`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spotId) && (options.enabled ?? true),
      ...options,
    }
  );
}

// GET /capacity/spots/:spotId/stats
export function useGetCapacityStats(spotId, options = {}) {
  return useApiQuery(
    ['capacity', 'stats', spotId],
    `capacity/spots/${spotId}/stats`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spotId) && (options.enabled ?? true),
      ...options,
    }
  );
}

// GET /capacity/spots/:spotId/alternatives
export function useGetCapacityAlternatives(spotId, options = {}) {
  return useApiQuery(
    ['capacity', 'alternatives', spotId],
    `capacity/spots/${spotId}/alternatives`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spotId) && (options.enabled ?? true),
      ...options,
    }
  );
}

// POST /capacity/spots/:spotId/log — invalidates current capacity cache on success
export function useLogCapacity(spotId, options = {}) {
  return useApiMutation(
    ['capacity', 'current'],
    `capacity/spots/${spotId}/log`,
    'POST',
    options
  );
}

// GET /capacity/configs
export function useGetCapacityConfigs(options = {}) {
  return useApiQuery(['capacity', 'configs'], 'capacity/configs', {
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// POST /capacity/configs — invalidates configs cache on success
export function useCreateCapacityConfig(options = {}) {
  return useApiMutation(['capacity', 'configs'], 'capacity/configs', 'POST', options);
}

/**
 * useCapacityStream — connects to /capacity/stream via Server-Sent Events (SSE).
 * Returns { data, status, error, close }.
 * - status: 'connecting' | 'open' | 'error' | 'closed'
 * - data: latest message parsed as JSON (or raw string on parse failure)
 */
export function useCapacityStream({ enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('closed');
  const [error, setError] = useState(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const base = (env.apiBaseUrlBE || '').replace(/\/$/, '');
    const source = new EventSource(`${base}/capacity/stream`);
    sourceRef.current = source;
    setStatus('connecting');
    setError(null);

    source.onopen = () => setStatus('open');

    source.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data));
      } catch {
        setData(event.data);
      }
    };

    source.onerror = (event) => {
      setStatus('error');
      setError(event);
      source.close();
    };

    return () => {
      source.close();
      sourceRef.current = null;
      setStatus('closed');
    };
  }, [enabled]);

  const close = () => {
    sourceRef.current?.close();
    setStatus('closed');
  };

  return { data, status, error, close };
}
