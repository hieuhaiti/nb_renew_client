import { useLoadingStore } from '@/stores/useLoadingStore.js';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export function LoadingProvider({ children }) {
  const loading = useLoadingStore((state) => state.loading);

  return (
    <>
      {loading && <LoadingOverlay />}
      {children}
    </>
  );
}
