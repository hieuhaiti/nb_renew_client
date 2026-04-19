import { Suspense, useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import LoadingInline from '@/components/common/LoadingInline';
import UnSupported from '@/components/common/UnSupported';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * MapLayout — wraps pages that need the main header navigation.
 */
export default function MapLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLaptop = useMediaQuery('(min-width: 1024px)');

  if (!isLaptop) {
    return <UnSupported />;
  }

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="border-border/50 flex flex-1 overflow-hidden border-t">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="relative flex-1 overflow-hidden lg:ml-60">
          <Suspense fallback={<LoadingInline position="center" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
