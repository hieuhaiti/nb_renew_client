import { useApiQuery } from '@/services/useApi';

export function useGetAframeScenes({ spotId, include_inactive } = {}) {
  const queryParams = new URLSearchParams();
  if (include_inactive !== undefined) queryParams.set('include_inactive', String(include_inactive));
  const qs = queryParams.toString();

  return useApiQuery(
    ['aframe-scenes', spotId, include_inactive],
    `spots/${spotId}/aframe-scenes${qs ? `?${qs}` : ''}`,
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      placeholderData: (prev) => prev,
      enabled: !!spotId,
    },
    false
  );
}

export function useGetAframeSceneHotspots({ spotId, sceneId, include_inactive } = {}) {
  const queryParams = new URLSearchParams();
  if (include_inactive !== undefined) queryParams.set('include_inactive', String(include_inactive));
  const qs = queryParams.toString();

  return useApiQuery(
    ['aframe-hotspots', spotId, sceneId, include_inactive],
    `spots/${spotId}/aframe-scenes/${sceneId}/hotspots${qs ? `?${qs}` : ''}`,
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      placeholderData: (prev) => prev,
      enabled: !!spotId && !!sceneId,
    },
    false
  );
}
