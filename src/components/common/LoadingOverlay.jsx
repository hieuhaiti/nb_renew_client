import { memo } from 'react';
import LoadingInline from '@/components/common/LoadingInline';

function LoadingOverlay() {
  return (
    <div
      className="bg-background/85 fixed inset-0 z-10000 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingInline position="center" size="large" className="py-0" />
    </div>
  );
}

export default memo(LoadingOverlay);
