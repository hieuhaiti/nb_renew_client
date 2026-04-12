import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="bg-background min-h-screen">
        <header className="border-border border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <nav className="flex items-center gap-4 text-sm">
              <Link to={ROUTES.home}>Dashboard</Link>
              <Link to={ROUTES.profile}>Profile</Link>
              <Link to={ROUTES.login}>Login</Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path={ROUTES.home} element={<DashboardPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
