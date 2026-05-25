import Header from '@/components/common/Header';
import FeedbackFloatButton from '@/components/common/FeedbackFloatButton';

/**
 * RootLayout — full-viewport shell.
 *
 * Structure:
 *   ┌──────────────── Header (sticky, full-width, z-50) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 *   │  [hamburger · logo]   [nav]   [theme · lang · login]                   │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ <main> — flex-1, overflow-y-auto (scrollable content)                   │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 * Mobile: hamburger opens an overlay drawer from the header.
 */
export default function RootLayout({ children }) {
  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth">{children}</main>
      <FeedbackFloatButton />
    </div>
  );
}
