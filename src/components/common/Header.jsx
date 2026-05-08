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
  Newspaper,
  RectangleGoggles,
  CalendarDays,
  Gift,
} from 'lucide-react';

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
      path: '/festival',
      label: t('common.festival'),
      icon: <CalendarDays size={17} />,
      authen: false,
    },
    {
      path: '/ocop',
      label: t('common.ocop'),
      icon: <Gift size={17} />,
      authen: false,
    },
    {
      path: '/news',
      label: t('common.news'),
      icon: <Newspaper size={17} />,
      authen: false,
    },
    { path: '/map', label: t('common.map'), icon: <Map size={17} />, authen: false },
    {
      path: '/vr360',
      label: t('common.vr360'),
      icon: <RectangleGoggles size={17} />,
      authen: false,
    },
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
      <header className="bg-background/90 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-colors duration-200 sm:px-6">
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
          className="hidden flex-1 items-center justify-center gap-1 px-4 2xl:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            if (item.type === 'map-dropdown') {
              return (
                <div key={item.key} className="relative" data-header-interactive>
                  <button
                    className={[
                      'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      isMapDropdownActive || dropdownOpenIdx === 'map'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-(--surface-hover)',
                    ].join(' ')}
                    onClick={() => setDropdownOpenIdx(dropdownOpenIdx === 'map' ? null : 'map')}
                    aria-expanded={dropdownOpenIdx === 'map'}
                    aria-haspopup="menu"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${dropdownOpenIdx === 'map' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpenIdx === 'map' && (
                    <div className="bg-popover border-border absolute top-full left-1/2 z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border p-1.5 shadow-xl">
                      {item.children.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategoryNavigate(sub.raw)}
                          className={[
                            'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors',
                            isCategoryActive(sub.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-(--surface-hover)',
                          ].join(' ')}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.path}
                className={[
                  'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-(--surface-hover)',
                ].join(' ')}
                onClick={() => navigate(item.path)}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* DESKTOP RIGHT: Theme, Lang, User */}
        <div className="hidden items-center gap-2 2xl:flex">
          {!isAuthenticated && (
            <>
              <ThemeSwitch />
              <LanguageSwitch />
            </>
          )}

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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImg;
                    }}
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
                <div className="bg-popover border-border absolute top-full right-0 z-50 mt-2 min-w-56 overflow-hidden rounded-xl border py-1.5 shadow-xl">
                  <div className="border-border mb-1 border-b px-4 py-2">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-muted-foreground truncate text-sm">{user?.email}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <ThemeSwitch />
                    <LanguageSwitch />
                  </div>
                  <button
                    id="header-profile-btn"
                    className="text-foreground flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-(--surface-hover)"
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
                    className="text-destructive hover:text-destructive-foreground flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-(--destructive-hover)"
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
        <button
          id="header-hamburger-btn"
          className="text-foreground rounded-lg p-2 transition-colors hover:bg-(--surface-hover) lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label={t('common.open_menu')}
        >
          <Menu size={22} />
        </button>
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
              <span className="text-primary text-base font-bold">{t('common.app_name')}</span>
              <button
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
              {navItems.map((item) => {
                if (item.type === 'map-dropdown') {
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-3 px-4 py-2 text-sm font-semibold">
                        {item.icon}
                        {item.label}
                      </div>
                      <div className="border-border ml-6 border-l pl-2">
                        {item.children.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleCategoryNavigate(sub.raw)}
                            className={[
                              'mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors',
                              isCategoryActive(sub.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-(--surface-hover)',
                            ].join(' ')}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.path}
                    className={[
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-(--surface-hover)',
                    ].join(' ')}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImg;
                          }}
                        />
                      ) : (
                        <User size={18} className="text-primary-foreground" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {user?.full_name || user?.name || user?.username}
                      </p>
                      <p className="text-muted-foreground truncate text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    id="mobile-profile-btn"
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
