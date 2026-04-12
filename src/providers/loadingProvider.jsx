import { useLoadingStore } from '@/contexts/LoadingContext/useLoadingStore';
import LoadingOverlay from '@/contexts/LoadingContext/LoadingOverlay';

export function LoadingProvider({ children }) {
  const loading = useLoadingStore((state) => state.loading);

  return (
    <>
      {loading && <LoadingOverlay />}
      {children}
    </>
  );
}
