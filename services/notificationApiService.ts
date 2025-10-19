/**
 * Notification API Service
 * Backend integration for push notifications and notification management
 */

import { apiRequest, API_CONFIG } from './api';
import { APP_CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PushNotification {
  id: string;
  user_id: string;
  type: 'new_case' | 'case_update' | 'message' | 'appointment' | 'system';
  title: string;
  message: string;
  data?: {
    incident_id?: string;
    case_id?: string;
    appointment_id?: string;
    provider_id?: string;
    urgency_level?: 'immediate' | 'urgent' | 'routine';
  };
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationToken {
  token: string;
  device_type: 'ios' | 'android' | 'web';
  device_id: string;
}

export class NotificationApiService {
  /**
   * Register device token for push notifications
   * POST /api/notifications/register-token/
   */
  static async registerPushToken(token: NotificationToken): Promise<void> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Storing push token locally (development)');
      await AsyncStorage.setItem('push_token', JSON.stringify(token));
      return;
    }

    try {
      console.log('📡 Registering push token with API...');
      await apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, {
        method: 'POST',
        body: JSON.stringify(token),
      });
      console.log('✅ Push token registered');
    } catch (error) {
      console.error('⚠️ Failed to register push token:', error);
      // Fallback: store locally
      await AsyncStorage.setItem('push_token', JSON.stringify(token));
    }
  }

  /**
   * Get all notifications for current user
   * GET /api/notifications/
   */
  static async getNotifications(params?: {
    unread_only?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ count: number; results: PushNotification[] }> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Loading notifications from local storage');
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as PushNotification[];
        let filtered = notifications;

        if (params?.unread_only) {
          filtered = filtered.filter(n => !n.is_read);
        }
        if (params?.type) {
          filtered = filtered.filter(n => n.type === params.type);
        }

        return {
          count: filtered.length,
          results: filtered.slice(params?.offset || 0, (params?.offset || 0) + (params?.limit || 20)),
        };
      }
      return { count: 0, results: [] };
    }

    try {
      console.log('📡 Fetching notifications from API...');
      const queryParams = new URLSearchParams();
      if (params?.unread_only) queryParams.append('unread_only', 'true');
      if (params?.type) queryParams.append('type', params.type);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest(endpoint);

      console.log(`✅ Loaded ${response.results.length} notifications`);
      return {
        count: response.count,
        results: response.results.map(this.transformNotificationFromAPI),
      };
    } catch (error) {
      console.warn('⚠️ API fetch failed, loading from local storage:', error);
      const stored = await AsyncStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : { count: 0, results: [] };
    }
  }

  /**
   * Get unread notification count
   * GET /api/notifications/unread-count/
   */
  static async getUnreadCount(): Promise<number> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as PushNotification[];
        return notifications.filter(n => !n.is_read).length;
      }
      return 0;
    }

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return response.count || 0;
    } catch (error) {
      console.warn('⚠️ Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   * PATCH /api/notifications/{id}/read/
   */
  static async markAsRead(notificationId: string): Promise<void> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Marking notification as read locally');
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as PushNotification[];
        const updated = notifications.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        );
        await AsyncStorage.setItem('notifications', JSON.stringify(updated));
      }
      return;
    }

    try {
      const endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.READ.replace('{id}', notificationId);
      await apiRequest(endpoint, {
        method: 'PATCH',
      });
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('⚠️ Failed to mark notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   * PATCH /api/notifications/mark-all-read/
   */
  static async markAllAsRead(): Promise<void> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Marking all notifications as read locally');
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as PushNotification[];
        const updated = notifications.map(n => ({
          ...n,
          is_read: true,
          read_at: n.read_at || new Date().toISOString(),
        }));
        await AsyncStorage.setItem('notifications', JSON.stringify(updated));
      }
      return;
    }

    try {
      await apiRequest('/api/notifications/mark-all-read/', {
        method: 'PATCH',
      });
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('⚠️ Failed to mark all as read:', error);
    }
  }

  /**
   * Send a notification to a user
   * POST /api/notifications/send/
   */
  static async sendNotification(data: {
    recipient_id: string;
    type: PushNotification['type'];
    title: string;
    message: string;
    data?: PushNotification['data'];
  }): Promise<PushNotification> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Creating notification locally');
      const notification: PushNotification = {
        id: Date.now().toString(),
        user_id: data.recipient_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const stored = await AsyncStorage.getItem('notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      notifications.unshift(notification);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));

      return notification;
    }

    try {
      console.log('📡 Sending notification via API...');
      const response = await apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: data.recipient_id,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
        }),
      });

      console.log('✅ Notification sent');
      return this.transformNotificationFromAPI(response);
    } catch (error) {
      console.error('⚠️ Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * DELETE /api/notifications/{id}/
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    if (!APP_CONFIG.API.BASE_URL || APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      console.log('💾 Deleting notification locally');
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as PushNotification[];
        const updated = notifications.filter(n => n.id !== notificationId);
        await AsyncStorage.setItem('notifications', JSON.stringify(updated));
      }
      return;
    }

    try {
      await apiRequest(`/api/notifications/${notificationId}/`, {
        method: 'DELETE',
      });
      console.log('✅ Notification deleted');
    } catch (error) {
      console.error('⚠️ Failed to delete notification:', error);
    }
  }

  /**
   * Transform API response to frontend format
   */
  private static transformNotificationFromAPI(apiData: any): PushNotification {
    return {
      id: apiData.id,
      user_id: apiData.user_id || apiData.user,
      type: apiData.type,
      title: apiData.title,
      message: apiData.message,
      data: apiData.data,
      is_read: apiData.is_read,
      created_at: apiData.created_at,
      read_at: apiData.read_at,
    };
  }
}

/**
 * Query keys for React Query
 */
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (filters?: { unread_only?: boolean; type?: string }) =>
    [...notificationQueryKeys.lists(), filters] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
};
