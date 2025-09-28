import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import {
  Bell,
  X,
  Clock,
  AlertTriangle,
  Users,
  MessageSquare,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  User,
  Activity,
  Trash2,
  MoreHorizontal,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SurvivorNotification, NotificationService } from '@/services/notificationService';
import { ProviderResponseService } from '@/services/providerResponseService';

const { width } = Dimensions.get('window');

interface SurvivorNotificationFabProps {
  onNotificationPress?: (notification: SurvivorNotification) => void;
}

export default function SurvivorNotificationFab({
  onNotificationPress
}: SurvivorNotificationFabProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [notifications, setNotifications] = useState<SurvivorNotification[]>([]);
  const [clearedNotifications, setClearedNotifications] = useState<string[]>([]);

  // Get live notifications from ProviderResponseService
  useEffect(() => {
    const liveNotifications = ProviderResponseService.getAllSurvivorNotifications();
    setNotifications(liveNotifications);

    // Poll for new notifications every 5 seconds
    const interval = setInterval(() => {
      const updatedNotifications = ProviderResponseService.getAllSurvivorNotifications();
      setNotifications(updatedNotifications);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock notifications for testing (will be replaced by live notifications)
  const mockNotifications: SurvivorNotification[] = [
    {
      id: '1',
      type: 'provider_response',
      title: 'Healthcare Provider Assigned',
      message: 'Dr. Sarah Johnson has been assigned to your case. She will contact you via SMS within the next 30 minutes.',
      incidentId: 'incident-001',
      providerId: 'provider-001',
      providerName: 'Dr. Sarah Johnson',
      providerType: 'healthcare',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      actionRequired: false,
    },
    {
      id: '2',
      type: 'appointment',
      title: 'New Appointment Scheduled',
      message: 'Dr. Sarah Johnson has scheduled a medical examination for tomorrow at 2:00 PM. Location: Kenyatta National Hospital. Please confirm your attendance.',
      incidentId: 'incident-001',
      providerName: 'Dr. Sarah Johnson',
      providerType: 'healthcare',
      isRead: false,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      actionRequired: true,
    },
    {
      id: '3',
      type: 'case_update',
      title: 'Case Status Updated',
      message: 'Your case has been assigned to multiple support services. A counselor and legal advocate will also be in touch soon.',
      incidentId: 'incident-001',
      providerName: 'Case Coordinator',
      isRead: true,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      actionRequired: false,
    },
  ];

  // Filter out cleared notifications
  const activeNotifications = [...notifications, ...mockNotifications].filter(n =>
    !clearedNotifications.includes(n.id)
  );

  // Count unread notifications from active notifications
  const unreadCount = activeNotifications.filter(n => !n.isRead).length;
  const actionRequiredCount = activeNotifications.filter(n => !n.isRead && n.actionRequired).length;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowNotifications(true);
  };

  const getNotificationIcon = (notification: SurvivorNotification) => {
    switch (notification.type) {
      case 'provider_response':
        return <Users size={20} color="#10B981" />;
      case 'appointment':
        return <Calendar size={20} color="#3B82F6" />;
      case 'case_update':
        return <Activity size={20} color="#8B5CF6" />;
      case 'message':
        return <MessageSquare size={20} color="#F59E0B" />;
      default:
        return <Bell size={20} color="#6B7280" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    return NotificationService.formatSurvivorNotificationTime(dateString);
  };

  const handleNotificationPress = (notification: SurvivorNotification) => {
    // Mark as read
    ProviderResponseService.markSurvivorNotificationRead(notification.id);

    if (onNotificationPress) {
      onNotificationPress(notification);
    }
    setShowNotifications(false);
  };

  const handleClearNotification = (notificationId: string) => {
    Alert.alert(
      'Clear Notification',
      'Are you sure you want to clear this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setClearedNotifications(prev => [...prev, notificationId]);
          }
        }
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    activeNotifications.forEach(notification => {
      if (!notification.isRead) {
        ProviderResponseService.markSurvivorNotificationRead(notification.id);
      }
    });
  };

  const handleCall = (notification: SurvivorNotification) => {
    // Mock phone number - in real app this would come from provider data
    const phoneNumber = '+254712345001'; // Default healthcare provider number

    Alert.alert(
      'Call Provider',
      `Call ${notification.providerName || 'Provider'} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(err => {
              Alert.alert('Error', 'Unable to make phone call. Please check your device settings.');
            });
          }
        }
      ]
    );
  };

  const handleSMS = (notification: SurvivorNotification) => {
    // Mock phone number - in real app this would come from provider data
    const phoneNumber = '+254712345001'; // Default healthcare provider number
    const message = `Hi ${notification.providerName || 'Provider'}, I received your notification about my case. I would like to discuss next steps.`;

    Alert.alert(
      'Send Message',
      `Send SMS to ${notification.providerName || 'Provider'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`).catch(err => {
              Alert.alert('Error', 'Unable to send SMS. Please check your device settings.');
            });
          }
        }
      ]
    );
  };

  const sortedNotifications = activeNotifications
    .sort((a, b) => NotificationService.getSurvivorNotificationPriority(b) - NotificationService.getSurvivorNotificationPriority(a));

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handlePress} style={styles.fabTouchable}>
          <LinearGradient
            colors={actionRequiredCount > 0 ? ['#E24B95', '#C53984'] : ['#8B5CF6', '#7C3AED']}
            style={styles.fabGradient}
          >
            <Bell color="#FFFFFF" size={24} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>Updates</Text>
              <Text style={styles.modalSubtitle}>
                {unreadCount} unread {actionRequiredCount > 0 && `• ${actionRequiredCount} need action`}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  style={styles.markAllButton}
                >
                  <CheckCircle size={18} color="#10B981" />
                  <Text style={styles.markAllText}>Mark All Read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {sortedNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>No updates yet</Text>
                <Text style={styles.emptyStateText}>
                  You'll receive updates here when providers respond to your case or schedule appointments.
                </Text>
              </View>
            ) : (
              sortedNotifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadNotification,
                    notification.actionRequired && styles.actionRequiredNotification,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.notificationMainContent}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={styles.notificationIcon}>
                      {getNotificationIcon(notification)}
                    </View>

                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={[
                          styles.notificationTitle,
                          !notification.isRead && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </Text>
                        <View style={styles.notificationMeta}>
                          {notification.actionRequired && (
                            <View style={styles.actionBadge}>
                              <Text style={styles.actionText}>ACTION</Text>
                            </View>
                          )}
                          <Text style={styles.timeText}>
                            {formatTimeAgo(notification.createdAt)}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>

                      {notification.providerName && (
                        <View style={styles.providerInfo}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.providerText}>
                            {notification.providerName}
                          </Text>
                        </View>
                      )}

                      {(notification.type === 'provider_response' || notification.type === 'appointment') && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleCall(notification)}
                          >
                            <Phone size={16} color="#10B981" />
                            <Text style={styles.actionButtonText}>Call</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleSMS(notification)}
                          >
                            <MessageSquare size={16} color="#3B82F6" />
                            <Text style={styles.actionButtonText}>Message</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </TouchableOpacity>

                  {/* Clear button */}
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => handleClearNotification(notification.id)}
                  >
                    <Trash2 size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fabTouchable: {
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
    marginLeft: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  notificationMainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  unreadNotification: {
    backgroundColor: '#F8FAFC',
  },
  actionRequiredNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#E24B95',
    backgroundColor: '#FDF2F8',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  notificationMeta: {
    alignItems: 'flex-end',
  },
  actionBadge: {
    backgroundColor: '#E24B95',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E24B95',
    position: 'absolute',
    top: 20,
    right: 12,
  },
});