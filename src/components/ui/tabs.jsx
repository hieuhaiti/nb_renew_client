import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = ({ defaultValue, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div {...props}>
      {React.Children.map(children, (child) => {
        if (child?.type === TabsList || child?.type === TabsContent) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ className, children, ...props }) => (
  <div
    className={cn(
      'bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1',
      className
    )}
    role="tablist"
    {...props}
  >
    {children}
  </div>
);

export const TabsTrigger = ({ value, className, children, activeTab, setActiveTab, ...props }) => (
  <button
    role="tab"
    aria-selected={activeTab === value}
    onClick={() => setActiveTab?.(value)}
    className={cn(
      'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      activeTab === value && 'bg-background text-foreground shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, className, children, activeTab, ...props }) => {
  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
