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

  useEffect(() => {
    if (!categories.length) return;

    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length !== 1) return;

    const currentPath = pathParts[0];
    let matchedCategory = null;

    if (currentPath === 'map') {
      matchedCategory =
        categories.find((cat) => Number(cat?.id) === Number(selectedCategory)) || categories[0];
    } else {
      matchedCategory = categories.find((cat) => cat?.slug === currentPath) || null;
    }

    if (!matchedCategory) return;

    setCategory(matchedCategory);
    setCurrentTourismPointSettings({
      selectedCategory: Number(matchedCategory.id) || matchedCategory.id,
      selectedSubcategory: 0,
      page: 1,
    });
  }, [
    categories,
    location.pathname,
    selectedCategory,
    setCategory,
    setCurrentTourismPointSettings,
  ]);

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
        <Button
          id="header-logo-btn"
          type="button"
          variant="ghost"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          {t('common.app_name')}
        </Button>

        {/* DESKTOP NAV */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 px-4 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            if (item.type === 'map-dropdown') {
              return (
                <div key={item.key} className="relative" data-header-interactive>
                  <Button
                    type="button"
                    variant={isMapDropdownActive || dropdownOpenIdx === 'map' ? 'default' : 'ghost'}
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
                  </Button>

                  {dropdownOpenIdx === 'map' && (
                    <div className="bg-popover border-border absolute top-full left-1/2 z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border p-1.5 shadow-xl">
                      {item.children.map((sub) => (
                        <Button
                          key={sub.id}
                          type="button"
                          variant={isCategoryActive(sub.id) ? 'default' : 'ghost'}
                          onClick={() => handleCategoryNavigate(sub.raw)}
                        >
                          {sub.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
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
            );
          })}
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
                          <Button
                            key={sub.id}
                            type="button"
                            variant={isCategoryActive(sub.id) ? 'default' : 'ghost'}
                            onClick={() => handleCategoryNavigate(sub.raw)}
                          >
                            {sub.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Button
                    key={item.path}
                    type="button"
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
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
                  <Button
                    id="mobile-profile-btn"
                    type="button"
                    variant="ghost"
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
