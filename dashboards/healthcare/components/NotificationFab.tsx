import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
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
} from 'lucide-react-native';
import { useProvider, ProviderNotification } from '@/providers/ProviderContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ProviderResponseService } from '@/services/providerResponseService';

const { width } = Dimensions.get('window');

interface NotificationFabProps {
  onNewCasePress?: (incidentId: string) => void;
}

export default function NotificationFab({ onNewCasePress }: NotificationFabProps) {
  const { notifications } = useProvider();
  const [showNotifications, setShowNotifications] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => !n.isRead && n.urgencyLevel === 'immediate').length;

  // Mock notifications for testing (in real app, these come from routing)
  const mockNotifications: ProviderNotification[] = [
    {
      id: '1',
      type: 'new_case',
      title: 'New Emergency Case',
      message: 'Sexual assault case requires immediate medical attention. PEP window: 68 hours remaining.',
      incidentId: 'incident-001',
      urgencyLevel: 'immediate',
      estimatedResponseTime: 15,
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    },
    {
      id: '2',
      type: 'new_case',
      title: 'New GBV Case',
      message: 'Physical violence case - survivor requests medical examination and counseling.',
      incidentId: 'incident-002',
      urgencyLevel: 'urgent',
      estimatedResponseTime: 30,
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    },
    {
      id: '3',
      type: 'message',
      title: 'Case Update',
      message: 'Patient EMG-241210001 has completed initial examination. Follow-up scheduled.',
      incidentId: 'incident-003',
      urgencyLevel: 'routine',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
  ];

  const allNotifications = [...notifications, ...mockNotifications];

  const handlePress = () => {
    // Animate button press
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

  const getNotificationIcon = (notification: ProviderNotification) => {
    switch (notification.type) {
      case 'new_case':
        return notification.urgencyLevel === 'immediate' ?
          <AlertTriangle size={20} color="#EF4444" /> :
          <Users size={20} color="#3B82F6" />;
      case 'message':
        return <MessageSquare size={20} color="#8B5CF6" />;
      case 'status_update':
        return <CheckCircle size={20} color="#10B981" />;
      default:
        return <Bell size={20} color="#6B7280" />;
    }
  };

  const getUrgencyColor = (urgencyLevel?: string) => {
    switch (urgencyLevel) {
      case 'immediate': return '#EF4444';
      case 'urgent': return '#F59E0B';
      case 'routine': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationPress = (notification: ProviderNotification) => {
    if (notification.type === 'new_case' && notification.incidentId && onNewCasePress) {
      onNewCasePress(notification.incidentId);
      setShowNotifications(false);
    }
  };

  const handleAcceptCase = (notification: ProviderNotification) => {
    if (!notification.incidentId) return;

    // Create a mock incident for the response service
    const mockIncident = {
      id: notification.incidentId,
      caseNumber: `Case ${notification.incidentId}`,
      survivorId: 'survivor-1',
      type: 'physical' as const,
      status: 'assigned' as const,
      priority: notification.urgencyLevel === 'immediate' ? 'critical' as const : 'high' as const,
      incidentDate: new Date().toISOString(),
      location: {
        address: 'Location not specified',
        coordinates: { latitude: -1.2921, longitude: 36.8219 },
        description: 'Provider accepted case'
      },
      description: 'Case accepted by healthcare provider',
      severity: 'high' as const,
      supportServices: ['medical'],
      isAnonymous: false,
      evidence: [],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      urgencyLevel: notification.urgencyLevel || 'routine',
      providerPreferences: {
        communicationMethod: 'sms' as const,
        preferredGender: 'no_preference' as const,
        proximityPreference: 'nearest' as const
      }
    };

    // Record provider assignment - this will create a survivor notification
    ProviderResponseService.recordProviderAssignment(
      mockIncident,
      'provider-healthcare-1',
      'Dr. Sarah Johnson',
      'healthcare'
    );

    console.log('Case accepted! Survivor will be notified.');
    setShowNotifications(false);
  };

  const handleContactSurvivor = (notification: ProviderNotification) => {
    if (!notification.incidentId) return;

    // Create a mock incident for the response service
    const mockIncident = {
      id: notification.incidentId,
      caseNumber: `Case ${notification.incidentId}`,
      survivorId: 'survivor-1',
      type: 'physical' as const,
      status: 'assigned' as const,
      priority: notification.urgencyLevel === 'immediate' ? 'critical' as const : 'high' as const,
      incidentDate: new Date().toISOString(),
      location: {
        address: 'Location not specified',
        coordinates: { latitude: -1.2921, longitude: 36.8219 },
        description: 'Provider contacting survivor'
      },
      description: 'Provider attempting to contact survivor',
      severity: 'high' as const,
      supportServices: ['medical'],
      isAnonymous: false,
      evidence: [],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      urgencyLevel: notification.urgencyLevel || 'routine',
      providerPreferences: {
        communicationMethod: 'sms' as const,
        preferredGender: 'no_preference' as const,
        proximityPreference: 'nearest' as const
      }
    };

    // Record contact attempt - this will create a survivor notification
    ProviderResponseService.recordContactAttempt(
      mockIncident,
      'provider-healthcare-1',
      'Dr. Sarah Johnson',
      'healthcare',
      'sms',
      true // successful contact
    );

    console.log('Contacting survivor! Survivor will be notified.');
    setShowNotifications(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handlePress} style={styles.fabTouchable}>
          <LinearGradient
            colors={urgentCount > 0 ? ['#EF4444', '#DC2626'] : ['#6A2CB0', '#9333EA']}
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
            <View>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Text style={styles.modalSubtitle}>
                {unreadCount} unread {urgentCount > 0 && `• ${urgentCount} urgent`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowNotifications(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {allNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>No notifications</Text>
                <Text style={styles.emptyStateText}>
                  You'll receive notifications when new cases are assigned to you.
                </Text>
              </View>
            ) : (
              allNotifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.unreadNotification,
                      notification.urgencyLevel === 'immediate' && styles.urgentNotification,
                    ]}
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
                          {notification.urgencyLevel && (
                            <View style={[
                              styles.urgencyBadge,
                              { backgroundColor: getUrgencyColor(notification.urgencyLevel) }
                            ]}>
                              <Text style={styles.urgencyText}>
                                {notification.urgencyLevel.toUpperCase()}
                              </Text>
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

                      {notification.estimatedResponseTime && (
                        <View style={styles.responseTimeContainer}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.responseTimeText}>
                            Est. response: {notification.estimatedResponseTime} minutes
                          </Text>
                        </View>
                      )}

                      {notification.type === 'new_case' && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={() => handleAcceptCase(notification)}
                          >
                            <CheckCircle size={16} color="#FFFFFF" />
                            <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Accept Case</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleContactSurvivor(notification)}
                          >
                            <Phone size={16} color="#3B82F6" />
                            <Text style={styles.actionButtonText}>Contact</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
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
  unreadNotification: {
    backgroundColor: '#F8FAFC',
  },
  urgentNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
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
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  urgencyText: {
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
  responseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
  acceptButton: {
    backgroundColor: '#10B981',
  },
  acceptButtonText: {
    color: '#FFFFFF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    position: 'absolute',
    top: 20,
    right: 12,
  },
});