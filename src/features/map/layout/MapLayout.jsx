import Header from '@/components/common/Header';

/**
 * MapLayout — wraps pages that need the main header navigation.
 */
export default function MapLayout({ children }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="relative w-full flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
