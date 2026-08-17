import { useMemo } from 'react';
import { useApiQuery } from '@/services/useApi';
export function useGetAframeScenes({ spotId, include_inactive } = {}) {
  const queryParams = new URLSearchParams();
  if (include_inactive !== undefined) queryParams.set('include_inactive', String(include_inactive));
  const qs = queryParams.toString();
  const enabled = !!spotId;
  const queryKey = useMemo(
    () => ['aframe-scenes', spotId, include_inactive],
    [spotId, include_inactive]
  );
  const endpoint = `spots/${spotId}/aframe-scenes${qs ? `?${qs}` : ''}`;
  return useApiQuery(
    queryKey,
    endpoint,
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      placeholderData: (prev) => prev,
      enabled,
    },
    false
  );
}
export function useGetAframeSceneHotspots({ spotId, sceneId, include_inactive } = {}) {
  const queryParams = new URLSearchParams();
  if (include_inactive !== undefined) queryParams.set('include_inactive', String(include_inactive));
  const qs = queryParams.toString();
  const enabled = !!spotId && !!sceneId;
  const queryKey = useMemo(
    () => ['aframe-hotspots', spotId, sceneId, include_inactive],
    [spotId, sceneId, include_inactive]
  );
  const endpoint = `spots/${spotId}/aframe-scenes/${sceneId}/hotspots${qs ? `?${qs}` : ''}`;
  return useApiQuery(
    queryKey,
    endpoint,
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      placeholderData: (prev) => prev,
      enabled,
    },
    false
  );
}
