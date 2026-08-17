import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Circle,
  CloudOff,
  Inbox,
  Loader2,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import { getAlertSeverityMeta } from '@/features/weather/helpers/weatherLevelHelpers';
import { defaultLatLong } from '@/features/map/constant/mapConstant';
import { tokenManager } from '@/lib/tokenManager';
import {
  notificationQueryKeys,
  notificationService,
} from '@/services/api/notifications/notificationService';
import { useNotificationWebSocket } from '@/hooks/useNotificationWebSocket';

const DEFAULT_NOTIFICATION_LIMIT = 10;

function getResponseData(response) {
  return response?.data ?? response ?? {};
}

function getNotifications(response) {
  const data = getResponseData(response);
  return Array.isArray(data.notifications) ? data.notifications : [];
}

function getPagination(response) {
  const data = getResponseData(response);
  return data.pagination ?? null;
}

function getUnreadCount(response, notifications) {
  const data = getResponseData(response);
  const apiCount = Number(data.unread_count ?? data.count);

  if (Number.isFinite(apiCount)) {
    return Math.max(0, apiCount);
  }

  return notifications.filter((item) => !item.is_read).length;
}

function getPayload(notification) {
  const payload = notification?.payload;
  if (!payload) return null;
  if (typeof payload === 'object') return payload;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getNotificationHref(notification) {
  const payload = getPayload(notification);
  return payload?.url || payload?.path || payload?.href || payload?.link || null;
}

function getNotificationText(notification, language, t) {
  const isVietnamese = String(language || '').startsWith('vi');
  const title = isVietnamese
    ? notification.title_vi || notification.title
    : notification.title || notification.title_vi;
  const body = isVietnamese
    ? notification.body_vi || notification.body || notification.message
    : notification.body || notification.message || notification.body_vi;

  return {
    title: title || t('notifications.fallback_title'),
    body: body || '',
  };
}

function formatNotificationTime(value, language) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';

  const locale = String(language || '').startsWith('en') ? 'en-US' : 'vi-VN';
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  try {
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (absSeconds < 60) return formatter.format(diffSeconds, 'second');
    if (absSeconds < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute');
    if (absSeconds < 86400) return formatter.format(Math.round(diffSeconds / 3600), 'hour');
    if (absSeconds < 604800) return formatter.format(Math.round(diffSeconds / 86400), 'day');
  } catch {
    // Fall through to date format.
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export default function WeatherAlertBell({ isAuthenticated = false, userId }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const wrapperRef = useRef(null);
  const accessToken = tokenManager.getAccessToken();
  const renderCountRef = useRef(0);
  const bellToggleCountRef = useRef(0);
  const debugFetchCountRef = useRef(0);

  const { data, isLoading, isError } = useWeatherOverview({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    lang: i18n.language,
  });

  const notificationParams = useMemo(() => ({ page, limit: DEFAULT_NOTIFICATION_LIMIT }), [page]);
  const notificationsQuery = useQuery({
    queryKey: [...notificationQueryKeys.me(notificationParams), userId || 'current-user'],
    queryFn: () => notificationService.getMy(notificationParams),
    enabled: isAuthenticated,
    staleTime: 30000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { isStale, refetch } = notificationsQuery;

  const alert = data?.alert ?? null;
  const severityMeta = alert ? getAlertSeverityMeta(alert.severity) : null;
  const notifications = isAuthenticated ? getNotifications(notificationsQuery.data) : [];
  const pagination = isAuthenticated ? getPagination(notificationsQuery.data) : null;
  const totalNotifications = pagination?.total ?? notifications.length;
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? pagination?.pages ?? 1));
  const currentPage = Math.max(1, Number(pagination?.page ?? page));
  const unreadCount = isAuthenticated ? getUnreadCount(notificationsQuery.data, notifications) : 0;
  const hasUnread = unreadCount > 0;
  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount);

  renderCountRef.current += 1;

  useNotificationWebSocket({
    enabled: isAuthenticated && Boolean(accessToken),
    token: accessToken,
    onMessage: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setPage(1);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    if (!isStale) return;
    refetch();
  }, [open, isAuthenticated, isStale, refetch]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!notificationsQuery.isFetching) return;
    debugFetchCountRef.current += 1;
  }, [notificationsQuery.isFetching, notificationParams, page, userId]);

  useEffect(() => {
    if (!notificationsQuery.dataUpdatedAt) return;
  }, [notificationsQuery.dataUpdatedAt, currentPage, totalNotifications, unreadCount, totalPages]);

  useEffect(() => {
    if (!notificationsQuery.errorUpdatedAt) return;
  }, [notificationsQuery.errorUpdatedAt, notificationsQuery.error, page]);

  const invalidateNotifications = (reason) => {
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      invalidateNotifications('mark-as-read');
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      invalidateNotifications('mark-all-as-read');
    },
  });

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    if (!notification.is_read && notification.id) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch {
        // Navigation should still work if the read state update fails.
      }
    }

    const href = getNotificationHref(notification);
    if (!href) return;

    setOpen(false);
    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href);
      return;
    }

    navigate(href);
  };

  const dotColor =
    alert?.severity === 'high'
      ? 'bg-destructive'
      : alert?.severity === 'medium'
        ? 'bg-warning'
        : 'bg-primary';

  const bellClass = alert
    ? (severityMeta?.color ?? 'text-foreground')
    : hasUnread
      ? 'text-[var(--notification-dot)]'
      : 'text-foreground';

  return (
    <div ref={wrapperRef} className="relative" data-header-interactive>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`${t('mapPage.layout.weatherAlert')} / ${t('notifications.title')}`}
        onClick={() =>
          setOpen((v) => {
            const nextOpen = !v;
            bellToggleCountRef.current += 1;
            return nextOpen;
          })
        }
        className="relative"
      >
        {alert || hasUnread ? (
          <BellRing size={18} className={`${bellClass} animate-[ring_1.2s_ease-in-out_2]`} />
        ) : (
          <Bell size={18} className="text-foreground" />
        )}

        {alert && (
          <span
            className={`absolute top-1 right-1 h-2 w-2 rounded-full ${dotColor} ring-background ring-2`}
          />
        )}

        {!alert && hasUnread && (
          <span className="ring-background absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--notification-dot)] ring-2" />
        )}

        {hasUnread && (
          <span className="ring-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--notification-badge)] px-1 text-[10px] leading-none font-bold text-[var(--notification-badge-foreground)] ring-2">
            {badgeLabel}
          </span>
        )}
      </Button>

      {open && (
        <div className="bg-popover border-border absolute top-full right-0 z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-xl">
          <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
            <Bell size={14} className="text-muted-foreground shrink-0" />
            <span className="text-foreground text-sm font-semibold">
              {t('mapPage.layout.weatherAlert')} / {t('notifications.title')}
            </span>
          </div>

          <div className="px-4 py-3">
            {isLoading && (
              <p className="text-muted-foreground text-sm">{t('home.weather_card.loading_text')}</p>
            )}

            {isError && !isLoading && (
              <div className="flex items-center gap-2">
                <CloudOff size={15} className="text-muted-foreground shrink-0" />
                <p className="text-muted-foreground text-sm">
                  {t('mapPage.layout.weatherUnavailable')}
                </p>
              </div>
            )}

            {!isLoading && !isError && alert && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2.5 ${severityMeta?.bg ?? 'bg-muted/40'}`}
              >
                {severityMeta?.icon && (
                  <severityMeta.icon
                    size={15}
                    className={`${severityMeta.color} mt-0.5 shrink-0`}
                  />
                )}
                <p className={`text-sm font-medium ${severityMeta?.color ?? ''}`}>
                  {t(alert.labelKey)}
                </p>
              </div>
            )}

            {!isLoading && !isError && !alert && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-secondary shrink-0" />
                <p className="text-secondary text-sm font-medium">
                  {t('mapPage.layout.weatherNoAlert')}
                </p>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <>
              <hr className="border-[var(--notification-divider)]" />

              <div className="p-1">
                <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Bell size={14} className="shrink-0 text-[var(--notification-dot)]" />
                    <span className="text-foreground truncate text-sm font-semibold">
                      {t('notifications.title')}
                    </span>
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--notification-unread-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--notification-dot)]">
                      {unreadCount}/{totalNotifications}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasUnread && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        disabled={markAllAsReadMutation.isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          markAllAsReadMutation.mutate();
                        }}
                        className="shrink-0 text-[var(--notification-dot)]"
                      >
                        <CheckCheck size={13} />
                        {t('notifications.mark_all_read')}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto pb-1.5">
                  {notificationsQuery.isLoading && (
                    <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
                      <Loader2 size={15} className="animate-spin" />
                      {t('notifications.loading')}
                    </div>
                  )}

                  {notificationsQuery.isError && !notificationsQuery.isLoading && (
                    <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
                      <WifiOff size={15} className="shrink-0" />
                      {t('notifications.error')}
                    </div>
                  )}

                  {!notificationsQuery.isLoading &&
                    !notificationsQuery.isError &&
                    notifications.length === 0 && (
                      <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
                        <Inbox size={15} className="shrink-0" />
                        {t('notifications.empty')}
                      </div>
                    )}

                  {!notificationsQuery.isLoading &&
                    !notificationsQuery.isError &&
                    notifications.map((notification) => {
                      const text = getNotificationText(notification, i18n.language, t);
                      const timeLabel = formatNotificationTime(
                        notification.created_at,
                        i18n.language
                      );
                      const unread = !notification.is_read;

                      return (
                        <div
                          key={notification.id}
                          className={`hover:bg-muted/70 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                            unread ? 'bg-[var(--notification-unread-bg)]' : ''
                          }`}
                        >
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                            {unread ? (
                              <Circle
                                size={8}
                                className="fill-[var(--notification-dot)] text-[var(--notification-dot)]"
                              />
                            ) : (
                              <Bell size={13} className="text-muted-foreground" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleNotificationClick(notification)}
                              className="h-auto w-full justify-start rounded-none px-0 py-0 text-left whitespace-normal"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="text-foreground line-clamp-2 block text-sm font-semibold">
                                  {text.title}
                                </span>
                                {text.body && (
                                  <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-sm">
                                    {text.body}
                                  </span>
                                )}
                                {timeLabel && (
                                  <span className="text-muted-foreground/80 mt-1 block text-xs">
                                    {timeLabel}
                                  </span>
                                )}
                              </span>
                            </Button>

                            {unread && (
                              <div className="mt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  disabled={markAsReadMutation.isPending}
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    markAsReadMutation.mutate(notification.id);
                                  }}
                                  className="text-[var(--notification-dot)]"
                                >
                                  {t('notifications.mark_read')}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {totalPages > 1 && (
                  <div className="border-border flex items-center justify-between gap-2 border-t px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={currentPage <= 1 || notificationsQuery.isFetching}
                      onClick={() => {
                        const nextPage = Math.max(1, currentPage - 1);
                        setPage(nextPage);
                      }}
                    >
                      <ChevronLeft size={14} />
                      {t('notifications.prev')}
                    </Button>

                    <span className="text-muted-foreground text-xs font-medium">
                      {t('notifications.page', { current: currentPage, total: totalPages })}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={currentPage >= totalPages || notificationsQuery.isFetching}
                      onClick={() => {
                        const nextPage = Math.min(totalPages, currentPage + 1);
                        setPage(nextPage);
                      }}
                    >
                      {t('notifications.next')}
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
