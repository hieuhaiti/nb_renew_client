import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSwitch from '@/components/common/ThemeSwitch';
import LanguageSwitch from '@/components/common/LanguageSwitch';
import useAuthStore from '@/stores/useAuthStore';
import { tokenManager } from '@/lib/tokenManager';
import { toast } from 'react-toastify';
import { Search, LogIn, LogOut, User, Menu, Settings, ChevronDown, X } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Header — sticky topbar spanning the full width above the sidebar + main area.
 * Layout: [hamburger? + logo] | [search — flex-1] | [theme · lang · login/user]
 * Nav links have moved to Sidebar.
 */
export default function Header({ onMenuClick }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const debouncedSearch = useDebouncedCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/tourism-point?q=${encodeURIComponent(trimmed)}`);
  }, 400);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.flush();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    navigate(`/tourism-point?q=${encodeURIComponent(trimmed)}`);
    setSearchValue('');
  };

  const handleClearSearch = () => {
    setSearchValue('');
    debouncedSearch.cancel();
  };

  const handleLogout = async () => {
    try {
      tokenManager.clearTokens();
      clearAuth();
      toast.success(t('auth.logout_success'));
      navigate('/');
    } catch {
      toast.warn(t('auth.logout_error'));
    } finally {
      setUserDropdownOpen(false);
    }
  };

  const handleDropdownBlur = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setUserDropdownOpen(false);
    }
  }, []);

  return (
    <header className="bg-background border-border/80 sticky top-0 z-50 flex h-14 w-full shrink-0 items-center border-b px-4 shadow-sm backdrop-blur-md sm:px-5">
      {/* ── LEFT: hamburger (mobile) + logo ── */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          id="header-hamburger-btn"
          className="text-foreground rounded-lg p-1.5 transition-colors hover:bg-(--surface-hover) lg:hidden"
          onClick={onMenuClick}
          aria-label={t('common.open_menu')}
        >
          <Menu size={20} />
        </button>

        <button
          id="header-logo-btn"
          className="text-primary cursor-pointer text-base font-extrabold tracking-tight transition-opacity select-none hover:opacity-80 sm:text-lg"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          {t('common.app_name')}
        </button>
      </div>

      {/* ── CENTER: search bar ── */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        className="mx-4 flex flex-1 items-center justify-center"
      >
        <div className="relative w-full max-w-lg">
          <Search
            size={14}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            id="topbar-search-input"
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t('common.search_placeholder')}
            className="border-border/60 bg-muted/40 focus-visible:ring-primary/50 h-9 rounded-full pr-8 pl-9 text-sm focus-visible:ring-1"
            aria-label={t('common.search_placeholder')}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </form>

      {/* ── RIGHT: theme · lang · login/user ── */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeSwitch />
        <LanguageSwitch />

        {isAuthenticated ? (
          <div className="relative" onBlur={handleDropdownBlur}>
            <button
              id="header-user-btn"
              className="bg-card/80 border-border flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors duration-200 hover:bg-(--muted-hover)"
              onClick={() => setUserDropdownOpen((v) => !v)}
              aria-expanded={userDropdownOpen}
              aria-haspopup="menu"
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
              <span className="text-foreground hidden max-w-28 truncate text-sm font-medium sm:inline">
                {user?.full_name || user?.name || user?.username || user?.email}
              </span>
              <ChevronDown
                size={13}
                className={`text-muted-foreground transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userDropdownOpen && (
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
                    setUserDropdownOpen(false);
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
            className="rounded-full px-4 font-semibold"
          >
            <LogIn size={14} className="mr-1.5" />
            {t('common.login')}
          </Button>
        )}
      </div>
    </header>
  );
}
