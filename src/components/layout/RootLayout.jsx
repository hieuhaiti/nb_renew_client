import { useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import FeedbackFloatButton from '@/components/common/FeedbackFloatButton';

const AUTH_PATHS = ['/login', '/signup', '/profile'];

/**
 * RootLayout — full-viewport shell.
 *
 * Structure:
 *   ┌──────────────── Header (sticky, full-width, z-50) ────────────────────────
 *   │  [hamburger · logo]   [nav]   [theme · lang · login]                   │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │ <main> — flex-1, overflow-y-auto (scrollable content)                   │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 * Mobile: hamburger opens an overlay drawer from the header.
 */
export default function RootLayout({ children }) {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth">{children}</main>
      {!isAuthPage && <FeedbackFloatButton />}
    </div>
  );
}
