import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '@/components/common/ThemeSwitch';
import LanguageSwitch from '@/components/common/LanguageSwitch';
import useAuthStore from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
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
  Newspaper,
  ShoppingBag,
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
  const lang = useLanguageStore((state) => state.lang);
  const setCategory = useCategoriesStore((state) => state.setCategory);
  const selectedCategory = useTourismPointSettingStore(
    (state) => state.currentSettings.selectedCategory
  );
  const setCurrentTourismPointSettings = useTourismPointSettingStore(
    (state) => state.setCurrentSettings
  );

  const { data: categoriesData } = categoriesService({ lang });
  const categories = useMemo(() => categoriesData?.data?.categories || [], [categoriesData]);
  const categorySlugMap = useMemo(
    () =>
      categories.reduce((acc, cat) => {
        if (cat?.id == null || !cat?.slug) return acc;
        acc[Number(cat.id)] = cat.slug;
        return acc;
      }, {}),
    [categories]
  );

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

  const categoryDropdown =
    categories.length > 0
      ? categories.map((cat) => ({
          id: cat.id,
          slug: cat.slug,
          label: cat.name,
          raw: cat,
        }))
      : [];

  const navItems = [
    { path: '/', label: t('common.home'), icon: <Home size={17} /> },
    { path: '/tourism-point', label: t('common.tourism_points'), icon: <MapPin size={17} /> },
    { path: '/tour', label: t('common.tourist_route'), icon: <Route size={17} /> },
    ...(categoryDropdown.length > 0
      ? [
          {
            key: 'map-dropdown',
            type: 'map-dropdown',
            label: t('common.map'),
            icon: <Map size={17} />,
            children: categoryDropdown,
          },
        ]
      : []),
    { path: '/news', label: t('common.news'), icon: <Newspaper size={17} /> },
    { path: '/ocop', label: t('common.ocop_festival'), icon: <ShoppingBag size={17} /> },
  ];

  const handleCategoryNavigate = useCallback(
    (category) => {
      if (!category) return;

      const mapSlug = category.slug || categorySlugMap[Number(category.id)];

      setCategory(category);
      setCurrentTourismPointSettings({
        selectedCategory: Number(category.id) || category.id,
        selectedSubcategory: 0,
        page: 1,
      });

      navigate(mapSlug ? `/${mapSlug}` : '/tourism-point');
      setDropdownOpenIdx(null);
      setIsMobileMenuOpen(false);
    },
    [categorySlugMap, navigate, setCategory, setCurrentTourismPointSettings]
  );

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
  const isCategoryActive = (categoryId) => {
    const matched = categoryDropdown.find((cat) => Number(cat.id) === Number(categoryId));
    if (matched?.slug && location.pathname === `/${matched.slug}`) return true;
    if (location.pathname === '/map' && Number(selectedCategory) === Number(categoryId))
      return true;
    return false;
  };
  const isMapDropdownActive =
    location.pathname === '/map' ||
    categoryDropdown.some((cat) => cat.slug && location.pathname === `/${cat.slug}`);

  return (
    <>
      <header className="bg-background/85 border-border/80 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm backdrop-blur-md transition-colors duration-200 sm:px-6">
        {/* LOGO */}
        <button
          id="header-logo-btn"
          className="text-primary shrink-0 cursor-pointer text-lg font-extrabold transition-opacity select-none hover:opacity-80 sm:text-xl"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          {t('common.app_name')}
        </button>

        {/* DESKTOP NAV */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 px-4 lg:flex"
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
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeSwitch />
          <LanguageSwitch />

          {isAuthenticated ? (
            <div className="relative" data-header-interactive>
              <button
                id="header-user-btn"
                className="bg-card/80 border-border flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-200 hover:bg-(--muted-hover)"
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
              </button>

              {dropdownOpenIdx === 'user' && (
                <div className="bg-popover border-border absolute top-full right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-xl border py-1.5 shadow-xl">
                  <div className="border-border mb-1 border-b px-4 py-2">
                    <p className="text-foreground truncate text-xs font-semibold">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
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
                  </button>
                  <div className="border-border my-1 border-t" />
                  <button
                    id="header-logout-btn"
                    className="text-destructive hover:text-destructive-foreground flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-(--destructive-hover)"
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
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-card absolute top-0 right-0 flex h-full w-[82%] max-w-xs flex-col overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="border-border bg-card sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <span className="text-primary text-base font-bold">{t('common.app_name')}</span>
              <button
                id="mobile-menu-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground rounded-lg p-1.5 transition-colors hover:bg-(--surface-hover)"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
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
                  <button
                    id="mobile-profile-btn"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-foreground flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-(--surface-hover)"
                  >
                    <Settings size={16} />
                    {t('common.settings')}
                  </button>
                  <button
                    id="mobile-logout-btn"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive-foreground flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-(--destructive-hover)"
                  >
                    <LogOut size={16} />
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <Button
                  id="mobile-login-btn"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full"
                >
                  <LogIn size={16} className="mr-2" />
                  {t('common.login')}
                </Button>
              )}

              {/* Theme & Language */}
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-muted-foreground text-sm">{t('common.toggle_theme')}</span>
                <ThemeSwitch />
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-muted-foreground text-sm">{t('common.toggle_lang')}</span>
                <LanguageSwitch />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
