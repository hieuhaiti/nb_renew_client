import { Suspense } from 'react';
import Header from '@/components/common/Header';
import LoadingInline from '@/components/common/LoadingInline';
import UnSupported from '@/components/common/UnSupported';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * MapLayout — wraps pages that need the main header navigation.
 */
export default function MapLayout({ children }) {
  const isLaptop = useMediaQuery('(min-width: 1024px)');

  if (!isLaptop) {
    return <UnSupported />;
  }

  return (
    <div className="bg-background flex h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 overflow-hidden">
        <Suspense fallback={<LoadingInline position="center" />}>{children}</Suspense>
      </main>
    </div>
  );
}
