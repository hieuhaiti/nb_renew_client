import { memo } from 'react';
import { Loader2 } from 'lucide-react';

// size small: w-4 h-4 (center mode: w-8 h-8)
// size large: w-8 h-8 (center mode: w-12 h-12)
// position: 'inline' | 'center'
function LoadingInline({ position = 'inline', size = 'small', color = 'primary' }) {
  // inline mode (mặc định)
  if (position !== 'center') {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2
          className={`${size === 'small' ? 'h-4 w-4' : 'h-8 w-8'} animate-spin text-${color}`}
        />
      </span>
    );
  }

  // center mode (chiếm full width + height của container cha, không fixed)
  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <Loader2
        className={`${size === 'small' ? 'h-8 w-8' : 'h-12 w-12'} animate-spin text-${color}`}
      />
    </div>
  );
}

export default memo(LoadingInline);
