import Header from '@/components/common/Header';

/**
 * RootLayout — wraps pages that need the main header navigation.
 */
export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
