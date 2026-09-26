import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all active:scale-[0.98] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:active:scale-100 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active focus-visible:ring-destructive/20 dark:bg-destructive dark:focus-visible:ring-destructive/40',
        success: 'bg-success text-success-foreground hover:bg-success-hover active:bg-success-active',
        warning: 'bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-active',
        info: 'bg-info text-info-foreground hover:bg-info-hover active:bg-info-active',
        tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover',
        quaternary: 'bg-quaternary text-quaternary-foreground hover:bg-quaternary-hover',
        quinary: 'bg-quinary text-quinary-foreground hover:bg-quinary-hover',
        gold: 'bg-gold text-gold-foreground hover:bg-gold-hover',
        outline:
          'border bg-background text-foreground shadow-xs hover:bg-(--surface-hover) hover:text-primary active:bg-(--surface-active) dark:border-input dark:bg-input/30 dark:hover:bg-(--surface-hover)',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active',
        ghost: 'hover:bg-(--surface-hover) hover:text-foreground active:bg-(--surface-active) dark:hover:bg-(--surface-hover)',
        link: 'text-primary underline-offset-4 hover:underline active:opacity-80',
        gradient_primary:
          'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90',
        gradient_hero:
          'bg-[image:var(--gradient-hero)] text-primary-foreground hover:opacity-95 shadow-md',
        gradient_accent:
          'bg-[image:var(--gradient-accent)] text-tertiary-foreground hover:opacity-95 shadow-sm',
        gradient_destructive:
          'bg-gradient-to-r from-destructive to-primary text-destructive-foreground hover:from-destructive/90 hover:to-primary/90',
        soft_primary:
          'bg-(--primary-soft) text-(--primary-soft-foreground) hover:bg-(--primary-soft)/80',
        soft_secondary:
          'bg-(--secondary-soft) text-(--secondary-soft-foreground) hover:bg-(--secondary-soft)/80',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-sm has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  onClick,
  ...props
}) {
  const isDisabled = Boolean(disabled || loading);

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        aria-busy={loading ? 'true' : undefined}
        aria-disabled={isDisabled ? 'true' : undefined}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.(e);
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && <Loader2 className="animate-spin size-4" />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
