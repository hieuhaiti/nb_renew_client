import { memo } from 'react';
import { RingLoader } from 'react-spinners';

export function LoadingOverlay() {
  return (
    <div className="bg-background/60 fixed inset-0 z-10000 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
      <RingLoader color="var(--loading-spinner)" size={80} />
    </div>
  );
}

export default memo(LoadingOverlay);
