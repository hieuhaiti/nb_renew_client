import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorClassMap = {
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};

function LoadingInline({ position = 'inline', size = 'small', color = 'primary', className }) {
  const iconClass = cn(
    position === 'center'
      ? size === 'small'
        ? 'h-8 w-8'
        : 'h-12 w-12'
      : size === 'small'
        ? 'h-4 w-4'
        : 'h-8 w-8',
    colorClassMap[color] ?? colorClassMap.primary,
    'animate-spin'
  );

  if (position !== 'center') {
    return (
      <span className={cn('inline-flex items-center gap-2', className)} role="status">
        <Loader2 className={iconClass} aria-hidden="true" />
      </span>
    );
  }

  return (
    <div className={cn('flex h-full w-full items-center justify-center py-10', className)} role="status">
      <Loader2 className={iconClass} aria-hidden="true" />
    </div>
  );
}

export default memo(LoadingInline);
