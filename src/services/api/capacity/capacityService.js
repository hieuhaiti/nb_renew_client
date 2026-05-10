import { useEffect, useRef, useState } from 'react';
import { useApiQuery, useApiMutation } from '@/services/useApi';
import { env } from '@/config/env';
import { tokenManager } from '@/lib/tokenManager';

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
  return useApiQuery(['capacity', 'history', spotId], `capacity/spots/${spotId}/history`, {
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(spotId) && (options.enabled ?? true),
    ...options,
  });
}

// GET /capacity/spots/:spotId/stats
export function useGetCapacityStats(spotId, options = {}) {
  return useApiQuery(['capacity', 'stats', spotId], `capacity/spots/${spotId}/stats`, {
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(spotId) && (options.enabled ?? true),
    ...options,
  });
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
  return useApiMutation(['capacity', 'current'], `capacity/spots/${spotId}/log`, 'POST', options);
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
 * - data: latest capacity_update / capacity_alert payload or raw string on parse failure
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
        const payload = JSON.parse(event.data);
        if (payload.type === 'capacity_update' || payload.type === 'capacity_alert') {
          setData(payload);
        }
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

/**
 * useCapacityWebSocket — connects to /ws?token=<access_token> and subscribes to
 * the "capacity" channel. Auto-reconnects with exponential backoff.
 * Returns { data, status, error, close }.
 * - status: 'closed' | 'connecting' | 'open' | 'error'
 * - data: latest capacity_update / capacity_alert payload (message.data field)
 * Requires a valid access token; does nothing when no token is present.
 */
export function useCapacityWebSocket({ enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('closed');
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectDelayRef = useRef(1_000);
  const unmountedRef = useRef(false);
  const intentionalCloseRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;
    intentionalCloseRef.current = false;

    if (!enabled) return;

    function connect() {
      if (unmountedRef.current || intentionalCloseRef.current) return;

      const token = tokenManager.getAccessToken();
      if (!token) {
        setStatus('closed');
        return;
      }

      const base = env.wsUrl;
      const socket = new WebSocket(`${base}?token=${token}`);

      socketRef.current = socket;

      if (!unmountedRef.current) setStatus('connecting');

      socket.onopen = () => {
        if (unmountedRef.current) {
          socket.close();
          return;
        }
        reconnectDelayRef.current = 1_000;
        setStatus('open');
        setError(null);
        socket.send(JSON.stringify({ action: 'subscribe', channels: ['capacity'] }));
      };

      socket.onmessage = (event) => {
        if (unmountedRef.current) return;
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'capacity_update' || message.event === 'capacity_alert') {
            setData(message.data);
          }
        } catch {
          // non-JSON frames ignored
        }
      };

      socket.onerror = () => {
        if (!unmountedRef.current) setError(new Error('WebSocket error'));
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (unmountedRef.current || intentionalCloseRef.current) {
          if (!unmountedRef.current) setStatus('closed');
          return;
        }
        setStatus('error');
        reconnectTimerRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30_000);
          connect();
        }, reconnectDelayRef.current);
      };
    }

    connect();

    return () => {
      unmountedRef.current = true;
      clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [enabled]);

  const close = () => {
    intentionalCloseRef.current = true;
    clearTimeout(reconnectTimerRef.current);
    socketRef.current?.close();
    setStatus('closed');
  };

  return { data, status, error, close };
}
