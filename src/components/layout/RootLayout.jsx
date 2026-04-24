import Header from '@/components/common/Header';

/**
 * RootLayout — full-viewport shell.
 *
 * Structure:
 *   ┌──────────────── Header (h-14, sticky, full-width, z-50) ───────────────┐
 *   │  [hamburger · logo]   [search — flex-1]   [theme · lang · login]       │
 *   ├──────────┬─────────────────────────────────────────────────────────────┤
 *   │ Sidebar  │  <main> — flex-1, overflow-y-auto (scrollable content)       │
 *   │ (w-60,   │                                                              │
 *   │  fixed   │                                                              │
 *   │  desktop)│                                                              │
 *   └──────────┴─────────────────────────────────────────────────────────────┘
 *
 * Mobile: sidebar is hidden; hamburger opens an overlay drawer.
 */
export default function RootLayout({ children }) {
  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth lg:ml-60">{children}</main>
    </div>
  );
}
