import { env } from '@/config/env';
import apiClient from '@/services/apiClient';

const notificationPath = '/notifications';
let notificationRequestSeq = 0;

function unwrap(response) {
  return response.data;
}

function debugNotificationService(event, payload = {}) {
  if (!env.isDev) return;
  console.info(`[notificationService] ${event}`, {
    at: new Date().toISOString(),
    ...payload,
  });
}

export const notificationQueryKeys = {
  all: ['notifications'],
  me: ({ page = 1, limit = 10, unreadOnly = false, type = '', deliveryStatus = '' } = {}) => [
    ...notificationQueryKeys.all,
    'me',
    page,
    limit,
    unreadOnly,
    type,
    deliveryStatus,
  ],
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'],
};

function buildListParams(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit);
  if (params.unread_only) queryParams.set('unread_only', params.unread_only);
  if (params.type) queryParams.set('type', params.type);
  if (params.delivery_status) queryParams.set('delivery_status', params.delivery_status);
  return queryParams.toString();
}

export const notificationService = {
  async getMy(params = {}) {
    const requestId = ++notificationRequestSeq;
    const queryString = buildListParams(params);
    debugNotificationService('getMy:start', { requestId, params, queryString });
    const response = await apiClient.get(
      `${notificationPath}/me${queryString ? `?${queryString}` : ''}`
    );
    debugNotificationService('getMy:success', {
      requestId,
      count:
        response?.data?.data?.notifications?.length ??
        response?.data?.notifications?.length ??
        null,
      unreadCount:
        response?.data?.data?.unread_count ?? response?.data?.unread_count ?? null,
    });
    return unwrap(response);
  },

  async getUnreadCount() {
    debugNotificationService('getUnreadCount:start');
    const response = await apiClient.get(`${notificationPath}/unread-count`);
    debugNotificationService('getUnreadCount:success', {
      count: response?.data?.data?.count ?? response?.data?.count ?? null,
    });
    return unwrap(response);
  },

  async markAllAsRead() {
    debugNotificationService('markAllAsRead:start');
    const response = await apiClient.patch(`${notificationPath}/read-all`);
    debugNotificationService('markAllAsRead:success', {
      updatedCount:
        response?.data?.data?.updated_count ?? response?.data?.updated_count ?? null,
    });
    return unwrap(response);
  },

  async markAsRead(id) {
    debugNotificationService('markAsRead:start', { id });
    const response = await apiClient.patch(`${notificationPath}/${id}/read`);
    debugNotificationService('markAsRead:success', { id });
    return unwrap(response);
  },

  async delete(id) {
    debugNotificationService('delete:start', { id });
    const response = await apiClient.delete(`${notificationPath}/${id}`);
    debugNotificationService('delete:success', { id });
    return unwrap(response);
  },

  async deleteAll() {
    debugNotificationService('deleteAll:start');
    const response = await apiClient.delete(notificationPath);
    debugNotificationService('deleteAll:success');
    return unwrap(response);
  },
};
