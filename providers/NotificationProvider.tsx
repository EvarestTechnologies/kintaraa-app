/**
 * Notification Provider
 * Manages push notifications and notification state across the app
 */

import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { PushNotificationService } from '@/services/pushNotificationService';
import { NotificationApiService, notificationQueryKeys, type PushNotification } from '@/services/notificationApiService';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  console.log('NotificationProvider initializing...');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  /**
   * Register for push notifications on mount
   */
  useEffect(() => {
    if (!user || isRegistered) return;

    const registerPushNotifications = async () => {
      try {
        const token = await PushNotificationService.registerForPushNotifications();
        if (token) {
          setPushToken(token);
          setIsRegistered(true);
          console.log('✅ Push notifications registered');
        }
      } catch (error) {
        console.error('❌ Failed to register push notifications:', error);
      }
    };

    registerPushNotifications();
  }, [user, isRegistered]);

  /**
   * Setup notification listeners
   */
  useEffect(() => {
    if (!user) return;

    const handleNotificationReceived = (notification: Notifications.Notification) => {
      console.log('📬 Notification received in app:', notification.request.content.title);

      // Update badge count
      updateBadgeCount();

      // Invalidate notifications query to refresh list
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
    };

    const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
      console.log('👆 User tapped notification');

      const data = response.notification.request.content.data;

      // Navigate based on notification data
      if (typeof data.incident_id === 'string') {
        router.push(`/(dashboard)/incident/${data.incident_id}` as any);
      } else if (typeof data.case_id === 'string') {
        router.push(`/(dashboard)/case/${data.case_id}` as any);
      }

      // Mark notification as read
      if (typeof data.notification_id === 'string') {
        markAsRead(data.notification_id);
      }
    };

    PushNotificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationResponse
    );

    // Cleanup listeners on unmount
    return () => {
      PushNotificationService.removeNotificationListeners();
    };
  }, [user]);

  /**
   * Fetch notifications from API
   */
  const notificationsQuery = useQuery({
    queryKey: notificationQueryKeys.list({ unread_only: false }),
    queryFn: async () => {
      if (!user) return [];

      const response = await NotificationApiService.getNotifications({
        limit: 50,
      });

      return response.results;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  /**
   * Fetch unread count
   */
  const unreadCountQuery = useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () => {
      if (!user) return 0;
      return await NotificationApiService.getUnreadCount();
    },
    enabled: !!user,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  /**
   * Mark notification as read
   */
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await NotificationApiService.markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
      updateBadgeCount();
    },
  });

  /**
   * Mark all as read
   */
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await NotificationApiService.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
      PushNotificationService.clearBadge();
    },
  });

  /**
   * Delete notification
   */
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await NotificationApiService.deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
      updateBadgeCount();
    },
  });

  /**
   * Send notification (for testing)
   */
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: {
      recipient_id: string;
      type: PushNotification['type'];
      title: string;
      message: string;
      data?: PushNotification['data'];
    }) => {
      return await NotificationApiService.sendNotification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() });
    },
  });

  /**
   * Update app badge count
   */
  const updateBadgeCount = async () => {
    const count = unreadCountQuery.data || 0;
    await PushNotificationService.setBadgeCount(count);
  };

  /**
   * Helper: Mark notification as read
   */
  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  /**
   * Helper: Mark all as read
   */
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  /**
   * Helper: Delete notification
   */
  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  /**
   * Helper: Send local notification (for testing)
   */
  const sendLocalNotification = async (
    title: string,
    body: string,
    data?: any
  ) => {
    await PushNotificationService.sendLocalNotification(title, body, data);
  };

  /**
   * Get unread notifications
   */
  const unreadNotifications = (notificationsQuery.data || []).filter(n => !n.is_read);

  /**
   * Get notifications by type
   */
  const getNotificationsByType = (type: PushNotification['type']) => {
    return (notificationsQuery.data || []).filter(n => n.type === type);
  };

  const result = {
    notifications: notificationsQuery.data || [],
    unreadNotifications,
    unreadCount: unreadCountQuery.data || 0,
    isLoading: notificationsQuery.isLoading || unreadCountQuery.isLoading,
    error: notificationsQuery.error || unreadCountQuery.error,
    pushToken,
    isRegistered,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendLocalNotification,
    getNotificationsByType,

    // Mutation states
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
    isSending: sendNotificationMutation.isPending,
  };

  console.log('NotificationProvider returning:', {
    notificationsCount: result.notifications.length,
    unreadCount: result.unreadCount,
    isRegistered: result.isRegistered,
  });

  return result;
});

/**
 * Helper hooks
 */

// Get notification by ID
export const useNotificationById = (notificationId: string) => {
  const { notifications } = useNotifications();
  return notifications.find(n => n.id === notificationId);
};

// Get urgent notifications
export const useUrgentNotifications = () => {
  const { notifications } = useNotifications();
  return notifications.filter(n =>
    !n.is_read &&
    n.data?.urgency_level === 'immediate'
  );
};

// Get new case notifications
export const useNewCaseNotifications = () => {
  const { getNotificationsByType } = useNotifications();
  return getNotificationsByType('new_case').filter(n => !n.is_read);
};
