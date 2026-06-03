import { useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { LANGUAGE_SWITCH_LOADING_KEY, useLoadingStore } from '@/stores/useLoadingStore.js';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export function LoadingProvider({ children }) {
  const loading = useLoadingStore((state) => state.loading);
  const isLanguageSwitchLoading = useLoadingStore((state) =>
    Boolean(state.loadingKeys[LANGUAGE_SWITCH_LOADING_KEY])
  );
  const setLoadingByKey = useLoadingStore((state) => state.setLoadingByKey);
  const fetchingCount = useIsFetching();

  useEffect(() => {
    if (!isLanguageSwitchLoading || fetchingCount > 0) return undefined;

    const timer = window.setTimeout(() => {
      setLoadingByKey(LANGUAGE_SWITCH_LOADING_KEY, false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [fetchingCount, isLanguageSwitchLoading, setLoadingByKey]);

  return (
    <>
      {loading && <LoadingOverlay />}
      {children}
    </>
  );
}
