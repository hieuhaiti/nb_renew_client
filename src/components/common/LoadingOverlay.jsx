import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingOverlay — full-screen spinner overlay.
 * Shown when useLoadingStore.loading === true (via LoadingProvider).
 */
export default function LoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/60 backdrop-blur-sm"
      aria-live="polite"
      aria-label="Đang tải..."
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="w-12 h-12 animate-spin text-primary"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground font-medium animate-pulse">
          Đang tải...
        </span>
      </div>
    </div>
  );
}
