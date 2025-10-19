/**
 * Push Notification Service
 * Handles Expo push notifications for iOS, Android, and Web
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NotificationApiService } from './notificationApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationData {
  incidentId?: string;
  caseId?: string;
  providerId?: string;
  urgencyLevel?: 'immediate' | 'urgent' | 'routine';
  type?: 'new_case' | 'case_update' | 'message' | 'appointment';
}

export class PushNotificationService {
  private static notificationListener: Notifications.Subscription | null = null;
  private static responseListener: Notifications.Subscription | null = null;

  /**
   * Request notification permissions and register device token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    // Check if running on a physical device (required for push notifications)
    if (!Device.isDevice) {
      console.log('⚠️ Push notifications require a physical device');
      return null;
    }

    try {
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not granted
      if (existingStatus !== 'granted') {
        console.log('📱 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Notification permission denied');
        return null;
      }

      // Get push notification token
      console.log('📡 Getting push notification token...');
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // TODO: Replace with actual Expo project ID
      });
      token = tokenData.data;

      console.log('✅ Push token obtained:', token.substring(0, 20) + '...');

      // Register token with backend
      if (token) {
        await this.registerTokenWithBackend(token);
      }

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidNotificationChannels();
      }

      return token;
    } catch (error) {
      console.error('❌ Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Register device token with backend API
   */
  private static async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const deviceType = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
      const deviceId = await this.getDeviceId();

      await NotificationApiService.registerPushToken({
        token,
        device_type: deviceType,
        device_id: deviceId,
      });

      // Store token locally for reference
      await AsyncStorage.setItem('expo_push_token', token);
      console.log('✅ Token registered with backend');
    } catch (error) {
      console.error('⚠️ Failed to register token with backend:', error);
    }
  }

  /**
   * Get unique device identifier
   */
  private static async getDeviceId(): Promise<string> {
    // Try to get stored device ID
    let deviceId = await AsyncStorage.getItem('device_id');

    if (!deviceId) {
      // Generate new device ID
      deviceId = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await AsyncStorage.setItem('device_id', deviceId);
    }

    return deviceId;
  }

  /**
   * Setup Android notification channels
   * Required for Android 8.0+ to show notifications properly
   */
  private static async setupAndroidNotificationChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      // Urgent notifications (high priority)
      await Notifications.setNotificationChannelAsync('urgent', {
        name: 'Urgent Cases',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF0000',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      // New cases (default priority)
      await Notifications.setNotificationChannelAsync('new_case', {
        name: 'New Cases',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250],
        lightColor: '#FF6B35',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
      });

      // Messages (normal priority)
      await Notifications.setNotificationChannelAsync('messages', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        sound: 'default',
        enableVibrate: true,
      });

      // Updates (low priority)
      await Notifications.setNotificationChannelAsync('updates', {
        name: 'Case Updates',
        importance: Notifications.AndroidImportance.LOW,
        sound: null,
      });

      console.log('✅ Android notification channels configured');
    } catch (error) {
      console.error('⚠️ Failed to setup Android channels:', error);
    }
  }

  /**
   * Add notification listeners
   * Handles incoming notifications and user responses
   */
  static setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void
  ): void {
    // Handle notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📬 Notification received:', notification.request.content.title);

      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Handle user tapping on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response.notification.request.content.title);

      if (onNotificationResponse) {
        onNotificationResponse(response);
      }

      // Extract data and handle navigation
      const data = response.notification.request.content.data as PushNotificationData;
      this.handleNotificationTap(data);
    });

    console.log('✅ Notification listeners setup');
  }

  /**
   * Handle notification tap - navigate to relevant screen
   */
  private static handleNotificationTap(data: PushNotificationData): void {
    console.log('🔔 Handling notification tap with data:', data);

    // Navigation will be handled by the component that sets up listeners
    // This data can be used to navigate to specific screens
    if (data.incidentId) {
      console.log(`Navigate to incident: ${data.incidentId}`);
    } else if (data.caseId) {
      console.log(`Navigate to case: ${data.caseId}`);
    }
  }

  /**
   * Remove notification listeners
   */
  static removeNotificationListeners(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }

    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }

    console.log('🔇 Notification listeners removed');
  }

  /**
   * Send a local notification (for testing or offline scenarios)
   */
  static async sendLocalNotification(
    title: string,
    body: string,
    data?: PushNotificationData,
    urgencyLevel: 'immediate' | 'urgent' | 'routine' = 'routine'
  ): Promise<string> {
    try {
      // Determine channel based on urgency
      let channelId = 'updates';
      if (urgencyLevel === 'immediate') channelId = 'urgent';
      else if (data?.type === 'new_case') channelId = 'new_case';
      else if (data?.type === 'message') channelId = 'messages';

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: (data || {}) as Record<string, unknown>,
          sound: urgencyLevel === 'immediate' ? 'default' : undefined,
          priority: urgencyLevel === 'immediate'
            ? Notifications.AndroidNotificationPriority.MAX
            : Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: null, // Send immediately
      });

      console.log('📤 Local notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Failed to send local notification:', error);
      throw error;
    }
  }

  /**
   * Get badge count
   */
  static async getBadgeCount(): Promise<number> {
    try {
      const count = await Notifications.getBadgeCountAsync();
      return count;
    } catch (error) {
      console.error('⚠️ Failed to get badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log(`🔢 Badge count set to: ${count}`);
    } catch (error) {
      console.error('⚠️ Failed to set badge count:', error);
    }
  }

  /**
   * Clear badge count
   */
  static async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  /**
   * Dismiss a notification by ID
   */
  static async dismissNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
      console.log(`🗑️ Dismissed notification: ${notificationId}`);
    } catch (error) {
      console.error('⚠️ Failed to dismiss notification:', error);
    }
  }

  /**
   * Dismiss all notifications
   */
  static async dismissAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('🗑️ All notifications dismissed');
    } catch (error) {
      console.error('⚠️ Failed to dismiss all notifications:', error);
    }
  }

  /**
   * Get delivered notifications
   */
  static async getPresentedNotifications(): Promise<Notifications.Notification[]> {
    try {
      const notifications = await Notifications.getPresentedNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('⚠️ Failed to get presented notifications:', error);
      return [];
    }
  }

  /**
   * Cancel scheduled notification
   */
  static async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`❌ Cancelled scheduled notification: ${notificationId}`);
    } catch (error) {
      console.error('⚠️ Failed to cancel notification:', error);
    }
  }

  /**
   * Check if notifications are enabled
   */
  static async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('⚠️ Failed to check notification status:', error);
      return false;
    }
  }
}
