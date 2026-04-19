import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { categoriesService } from '@/features/categories/api/categoriesService';
import MapFloatingWeatherCard from '@/features/map/components/MapFloatingWeatherCard';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { Home, MapPin, Map, Route, Newspaper, ShoppingBag, ChevronDown, X } from 'lucide-react';

/**
 * Sidebar — vertical navigation panel.
 * Desktop: fixed left column, w-60, always visible below the topbar.
 * Mobile: overlay drawer triggered by the topbar hamburger button.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = useLanguageStore((state) => state.lang);

  const [mapDropdownOpen, setMapDropdownOpen] = useState(false);

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

  // Sync active category from URL on route change
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

  // Close drawer on route change (mobile)
  useEffect(() => {
    onClose?.();
    setMapDropdownOpen(false);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const categoryDropdown =
    categories.length > 0
      ? categories.map((cat) => ({ id: cat.id, slug: cat.slug, label: cat.name, raw: cat }))
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
      setMapDropdownOpen(false);
    },
    [categorySlugMap, navigate, setCategory, setCurrentTourismPointSettings]
  );

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

  const NavLinks = (
    <nav
      className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        if (item.type === 'map-dropdown') {
          return (
            <div key={item.key} className="space-y-0.5">
              <button
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isMapDropdownActive || mapDropdownOpen
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-(--surface-hover)',
                ].join(' ')}
                onClick={() => setMapDropdownOpen((v) => !v)}
                aria-expanded={mapDropdownOpen}
                aria-haspopup="menu"
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${mapDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {mapDropdownOpen && (
                <div className="border-border/60 ml-4 space-y-1 border-l pl-3">
                  {item.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleCategoryNavigate(sub.raw)}
                      className={[
                        'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        isCategoryActive(sub.id)
                          ? 'bg-primary/10 text-primary font-medium'
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
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
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
  );

  const SidebarContent = (
    <div className="flex min-h-0 flex-1 flex-col justify-between">
      {NavLinks}

      <div className="border-border/60 border-t px-3 py-2">
        <MapFloatingWeatherCard className="w-full" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — fixed below the topbar */}
      <aside className="bg-card border-border fixed top-14 bottom-0 left-0 z-40 hidden w-60 flex-col border-r shadow-sm lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile overlay drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <aside
            className="bg-card absolute inset-y-0 left-0 flex w-72 flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer top bar */}
            <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="text-primary truncate text-sm font-bold">
                {t('common.app_name')}
              </span>
              <button
                onClick={onClose}
                className="text-foreground rounded-lg p-1.5 transition-colors hover:bg-(--surface-hover)"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
