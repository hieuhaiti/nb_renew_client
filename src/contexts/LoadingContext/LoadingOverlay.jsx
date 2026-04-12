import { RingLoader } from 'react-spinners';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--bg-tertiary)]/60 backdrop-blur-sm transition-all duration-300">
      <RingLoader color="var(--loading-spinner)" size={80} />
    </div>
  );
}
