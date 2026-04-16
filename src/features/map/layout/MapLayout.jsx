import Header from '@/components/common/Header';

/**
 * MapLayout — wraps pages that need the main header navigation.
 */
export default function MapLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
