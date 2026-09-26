import { Suspense } from 'react';
import Header from '@/components/common/Header';
import LoadingInline from '@/components/common/LoadingInline';

/**
 * MapLayout — wraps pages that need the main header navigation.
 */
export default function MapLayout({ children }) {
  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="relative flex-1 overflow-hidden">
        <Suspense fallback={<LoadingInline position="center" />}>{children}</Suspense>
      </main>
    </div>
  );
}
