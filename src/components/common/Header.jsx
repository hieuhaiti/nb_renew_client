import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '@/components/common/ThemeSwitch';
import LanguageSwitch from '@/components/common/LanguageSwitch';
import useAuthStore from '@/stores/useAuthStore';
import { tokenManager } from '@/lib/tokenManager';
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
  ShoppingBag,
  Video,
} from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';

/**
 * Header — sticky top navigation bar.
 * Handles desktop nav, user dropdown, and mobile side menu.
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
    { path: '/', label: t('common.home'), icon: <Home size={17} />, authen: false },
    {
      path: '/tourism-point',
      label: t('common.tourism_points'),
      icon: <MapPin size={17} />,
      authen: false,
    },
    { path: '/tour', label: t('common.tourist_route'), icon: <Route size={17} />, authen: false },
    {
      path: '/ocop',
      label: t('common.ocop_festival'),
      icon: <ShoppingBag size={17} />,
      authen: false,
    },
    { path: '/map', label: t('common.map'), icon: <Map size={17} />, authen: false },
    { path: '/vlog', label: t('common.vlog'), icon: <Video size={17} />, authen: false },
  ];
  const visibleNavItems = navItems.filter((item) => !item.authen || isAuthenticated);

  const handleLogout = async () => {
    try {
      tokenManager.clearTokens();
      clearAuth();
      toast.success(t('auth.logout_success'));
      navigate('/');
    } catch {
      toast.warn(t('auth.logout_error'));
    } finally {
      setDropdownOpenIdx(null);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="bg-background/85 border-border/80 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm backdrop-blur-md transition-colors duration-200 sm:px-6">
        {/* LOGO */}
        <Button
          id="header-logo-btn"
          type="button"
          variant="ghost"
          onClick={() => navigate('/')}
          aria-label="Go to home"
          className="text-primary h-auto px-2 text-lg leading-none font-extrabold sm:text-xl"
        >
          {t('common.app_name')}
        </Button>

        {/* DESKTOP NAV */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 px-4 lg:flex"
          aria-label="Main navigation"
        >
          {visibleNavItems.map((item) => (
            <Button
              key={item.path}
              type="button"
              variant={isActive(item.path) ? 'default' : 'ghost'}
              onClick={() => navigate(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* DESKTOP RIGHT: Theme, Lang, User */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeSwitch />
          <LanguageSwitch />

          {isAuthenticated ? (
            <div className="relative" data-header-interactive>
              <Button
                id="header-user-btn"
                type="button"
                variant="outline"
                onClick={() => setDropdownOpenIdx(dropdownOpenIdx === 'user' ? null : 'user')}
              >
                {user?.avatar_url ? (
                  <img
                    src={withBaseUrl(user.avatar_url)}
                    alt="avatar"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                    <User size={13} className="text-primary-foreground" />
                  </div>
                )}
                <span className="text-foreground max-w-25 truncate text-sm font-medium">
                  {user?.full_name || user?.name || user?.username || user?.email}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${dropdownOpenIdx === 'user' ? 'rotate-180' : ''}`}
                />
              </Button>

              {dropdownOpenIdx === 'user' && (
                <div className="bg-popover border-border absolute top-full right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-xl border py-1.5 shadow-xl">
                  <div className="border-border mb-1 border-b px-4 py-2">
                    <p className="text-foreground truncate text-xs font-semibold">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                  </div>
                  <Button
                    id="header-profile-btn"
                    type="button"
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      navigate('/profile');
                      setDropdownOpenIdx(null);
                    }}
                  >
                    <Settings size={14} />
                    {t('common.settings')}
                  </Button>
                  <div className="border-border my-1 border-t" />
                  <Button
                    id="header-logout-btn"
                    type="button"
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    {t('common.logout')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button id="header-login-btn" size="sm" onClick={() => navigate('/login')}>
              <LogIn size={14} className="mr-1.5" />
              {t('common.login')}
            </Button>
          )}
        </div>

        {/* HAMBURGER (mobile/tablet) */}
        <div className="lg:hidden">
          <Button
            id="header-hamburger-btn"
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('common.open_menu')}
          >
            <Menu size={22} />
          </Button>
        </div>
      </header>

      {/* MOBILE SIDE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-60 bg-black/50 backdrop-blur-sm duration-150"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-card animate-in slide-in-from-right absolute top-0 right-0 flex h-full w-[82%] max-w-xs flex-col overflow-y-auto shadow-2xl duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="border-border bg-card sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <span className="text-primary truncate text-lg leading-none font-extrabold">
                {t('common.app_name')}
              </span>
              <Button
                id="mobile-menu-close-btn"
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Nav links */}
            <nav
              className="border-border flex flex-col gap-1 border-b px-3 py-4"
              aria-label="Mobile navigation"
            >
              {visibleNavItems.map((item) => (
                <Button
                  key={item.path}
                  type="button"
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* User section */}
            <div className="flex flex-col gap-3 px-4 py-4">
              {isAuthenticated ? (
                <div className="bg-card border-border space-y-3 rounded-2xl border p-4">
                  <div className="border-border flex items-center gap-3 border-b pb-3">
                    <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      {user?.avatar_url ? (
                        <img
                          src={withBaseUrl(user.avatar_url)}
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-primary-foreground" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {user?.full_name || user?.name || user?.username}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    id="mobile-profile-btn"
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings size={16} />
                    {t('common.settings')}
                  </Button>
                  <Button
                    id="mobile-logout-btn"
                    type="button"
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    {t('common.logout')}
                  </Button>
                </div>
              ) : (
                <Button
                  id="mobile-login-btn"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={16} className="mr-2" />
                  {t('common.login')}
                </Button>
              )}

              {/* Theme & Language */}
              <div className="bg-muted/50 border-border space-y-1 rounded-2xl border p-3">
                <div className="flex items-center justify-between px-1 py-1.5">
                  <span className="text-foreground text-sm font-medium">
                    {t('common.toggle_theme')}
                  </span>
                  <ThemeSwitch />
                </div>
                <div className="border-border border-t" />
                <div className="flex items-center justify-between px-1 py-1.5">
                  <span className="text-foreground text-sm font-medium">
                    {t('common.toggle_lang')}
                  </span>
                  <LanguageSwitch />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
