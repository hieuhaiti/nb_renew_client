import apiClient from '@/services/apiClient';

const notificationPath = '/notifications';
let notificationRequestSeq = 0;

function unwrap(response) {
  return response.data;
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
    const response = await apiClient.get(
      `${notificationPath}/me${queryString ? `?${queryString}` : ''}`
    );

    return unwrap(response);
  },

  async getUnreadCount() {
    const response = await apiClient.get(`${notificationPath}/unread-count`);
    return unwrap(response);
  },

  async markAllAsRead() {
    const response = await apiClient.patch(`${notificationPath}/read-all`);
    return unwrap(response);
  },

  async markAsRead(id) {
    const response = await apiClient.patch(`${notificationPath}/${id}/read`);
    return unwrap(response);
  },

  async delete(id) {
    const response = await apiClient.delete(`${notificationPath}/${id}`);
    return unwrap(response);
  },

  async deleteAll() {
    const response = await apiClient.delete(notificationPath);
    return unwrap(response);
  },
};
