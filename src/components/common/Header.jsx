import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '@/components/common/ThemeSwitch';
import LanguageSwitch from '@/components/common/LanguageSwitch';
import useAuthStore from '@/stores/useAuthStore';
import { toast } from 'react-toastify';
import {
  Home,
  MapPin,
  Map,
  Route,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Settings,
  ChevronDown,
} from 'lucide-react';

/**
 * Header — sticky top navigation bar.
 * Handles desktop nav, user dropdown, mobile side menu.
 * Auth state from useAuthStore; no map/category stores here.
 */
export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpenIdx, setDropdownOpenIdx] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setDropdownOpenIdx(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpenIdx && !isMobileMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('[data-header-interactive]')) {
        setDropdownOpenIdx(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpenIdx, isMobileMenuOpen]);

  const navItems = [
    {
      path: '/',
      label: t('common.home'),
      icon: <Home size={17} />,
    },
    {
      path: '/tourism-point',
      label: t('common.tourism_points'),
      icon: <MapPin size={17} />,
    },
    {
      path: '/tour',
      label: t('common.tourist_route'),
      icon: <Route size={17} />,
    },
    {
      path: '/map',
      label: t('common.map'),
      icon: <Map size={17} />,
    },
  ];

  const handleLogout = async () => {
    try {
      clearAuth();
      toast.success(t('auth.logout_success'));
      navigate('/');
    } catch (err) {
      toast.warn(t('auth.logout_error'));
    } finally {
      setDropdownOpenIdx(null);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 bg-card/90 backdrop-blur-md shadow-sm border-b border-border transition-colors duration-200">
        {/* LOGO */}
        <button
          id="header-logo-btn"
          className="text-lg sm:text-xl font-extrabold text-primary cursor-pointer select-none shrink-0 hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          {t('common.app_name')}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 px-4" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={[
                'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
              ].join(' ')}
              onClick={() => navigate(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* DESKTOP RIGHT: Theme, Lang, User */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeSwitch />
          <LanguageSwitch />

          {isAuthenticated ? (
            <div className="relative" data-header-interactive>
              <button
                id="header-user-btn"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border cursor-pointer hover:bg-accent/40 transition-colors duration-200"
                onClick={() => setDropdownOpenIdx(dropdownOpenIdx === 'user' ? null : 'user')}
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <User size={13} className="text-primary-foreground" />
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate text-foreground">
                  {user?.name || user?.username || user?.email}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    dropdownOpenIdx === 'user' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpenIdx === 'user' && (
                <div className="absolute right-0 top-full mt-2 min-w-[11rem] bg-popover border border-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                  <button
                    id="header-profile-btn"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => { navigate('/profile'); setDropdownOpenIdx(null); }}
                  >
                    <Settings size={14} />
                    {t('common.settings')}
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    id="header-logout-btn"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    {t('common.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              id="header-login-btn"
              size="sm"
              onClick={() => navigate('/login')}
              className="rounded-full px-5 font-semibold"
            >
              <LogIn size={14} className="mr-1.5" />
              {t('common.login')}
            </Button>
          )}
        </div>

        {/* HAMBURGER (mobile/tablet) */}
        <button
          id="header-hamburger-btn"
          className="lg:hidden p-2 rounded-lg hover:bg-accent/40 text-foreground transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label={t('common.open_menu')}
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MOBILE SIDE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute top-0 right-0 h-full w-[82%] max-w-xs bg-card shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card sticky top-0 z-10">
              <span className="text-base font-bold text-primary">
                {t('common.app_name')}
              </span>
              <button
                id="mobile-menu-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-accent/40 text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-3 py-4 border-b border-border" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={[
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-accent/40',
                  ].join(' ')}
                  onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User section */}
            <div className="flex flex-col gap-3 px-4 py-4">
              {isAuthenticated ? (
                <div className="bg-secondary rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User size={18} className="text-primary-foreground" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {user?.name || user?.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    id="mobile-profile-btn"
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-2 py-2 text-sm text-foreground hover:bg-accent/40 rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                    {t('common.settings')}
                  </button>
                  <button
                    id="mobile-logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <Button
                  id="mobile-login-btn"
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full rounded-full"
                >
                  <LogIn size={16} className="mr-2" />
                  {t('common.login')}
                </Button>
              )}

              {/* Theme & Language */}
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-sm text-muted-foreground">
                  {t('common.toggle_theme')}
                </span>
                <ThemeSwitch />
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-sm text-muted-foreground">
                  {t('common.toggle_lang')}
                </span>
                <LanguageSwitch />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
