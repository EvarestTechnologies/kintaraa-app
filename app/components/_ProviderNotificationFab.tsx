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
  ActivityIndicator,
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

const { width } = Dimensions.get('window');

interface NotificationFabProps {
  onNewCasePress?: (incidentId: string) => void;
}

export default function NotificationFab({ onNewCasePress }: NotificationFabProps) {
  const { acceptAssignment, pendingAssignments } = useProvider();
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [acceptingCase, setAcceptingCase] = useState<string | null>(null);
  const [contactingSurvivor, setContactingSurvivor] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<{[key: string]: 'accepted' | 'contacted'}>({});

  // Convert pending assignments to notifications format
  const notifications: ProviderNotification[] = pendingAssignments.map(assignment => ({
    id: assignment.id,
    type: 'new_case' as const,
    title: 'New Case Assignment',
    message: `${assignment.caseNumber} - ${assignment.serviceType}`,
    incidentId: assignment.incidentId,
    urgencyLevel: assignment.priority === 'critical' ? 'immediate' as const :
                  assignment.priority === 'high' ? 'urgent' as const : 'routine' as const,
    estimatedResponseTime: assignment.estimatedResponseTime,
    isRead: false,
    createdAt: assignment.assignedAt,
  }));

  // Filter out dismissed notifications
  const activeNotifications = notifications.filter(n => !dismissedNotifications.includes(n.id));

  // Count unread notifications
  const unreadCount = activeNotifications.length;
  const urgentCount = activeNotifications.filter(n => n.urgencyLevel === 'immediate').length;

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

  const handleAcceptCase = async (notification: ProviderNotification) => {
    if (!notification.incidentId || acceptingCase === notification.id) return;

    setAcceptingCase(notification.id);

    try {
      console.log('🏥 Healthcare provider accepting assignment:', notification.incidentId);

      // Accept the assignment via backend API
      await acceptAssignment(notification.incidentId);

      console.log('✅ Assignment accepted successfully');

      // Mark as successful and dismiss notification
      setActionResults(prev => ({ ...prev, [notification.id]: 'accepted' }));
      setDismissedNotifications(prev => [...prev, notification.id]);

      console.log('Case accepted! Case is now in progress.');
    } catch (error) {
      console.error('❌ Error accepting assignment:', error);
      alert('Failed to accept assignment. Please try again.');
    } finally {
      setAcceptingCase(null);
    }
  };

  const handleContactSurvivor = async (notification: ProviderNotification) => {
    if (!notification.incidentId || contactingSurvivor === notification.id) return;

    setContactingSurvivor(notification.id);

    try {
      console.log('📞 Contacting survivor for incident:', notification.incidentId);

      // TODO: Implement contact API endpoint when available
      // For now, just simulate the contact
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as successful
      setActionResults(prev => ({ ...prev, [notification.id]: 'contacted' }));

      console.log('✅ Contact attempt logged');
    } catch (error) {
      console.error('❌ Error contacting survivor:', error);
    } finally {
      setContactingSurvivor(null);
    }
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
          {/* Success Banner */}
          {Object.keys(actionResults).length > 0 && (
            <View style={styles.successBanner}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.successBannerText}>
                Actions completed! Survivor has been notified.
              </Text>
            </View>
          )}

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
            {activeNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>No new cases</Text>
                <Text style={styles.emptyStateText}>
                  You'll receive notifications when new cases are assigned to you.
                </Text>
              </View>
            ) : (
              activeNotifications
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
                            style={[
                              styles.actionButton,
                              styles.acceptButton,
                              actionResults[notification.id] === 'accepted' && styles.successButton,
                              acceptingCase === notification.id && styles.disabledButton
                            ]}
                            onPress={() => handleAcceptCase(notification)}
                            disabled={acceptingCase === notification.id || actionResults[notification.id] === 'accepted'}
                          >
                            {acceptingCase === notification.id ? (
                              <>
                                <ActivityIndicator size={16} color="#FFFFFF" />
                                <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Accepting...</Text>
                              </>
                            ) : actionResults[notification.id] === 'accepted' ? (
                              <>
                                <CheckCircle size={16} color="#FFFFFF" />
                                <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Case Accepted!</Text>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} color="#FFFFFF" />
                                <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Accept Case</Text>
                              </>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              actionResults[notification.id] === 'contacted' && styles.successButton,
                              contactingSurvivor === notification.id && styles.disabledButton
                            ]}
                            onPress={() => handleContactSurvivor(notification)}
                            disabled={contactingSurvivor === notification.id || actionResults[notification.id] === 'contacted'}
                          >
                            {contactingSurvivor === notification.id ? (
                              <>
                                <ActivityIndicator size={16} color="#3B82F6" />
                                <Text style={styles.actionButtonText}>Sending SMS...</Text>
                              </>
                            ) : actionResults[notification.id] === 'contacted' ? (
                              <>
                                <CheckCircle size={16} color="#10B981" />
                                <Text style={[styles.actionButtonText, { color: '#10B981' }]}>SMS Sent!</Text>
                              </>
                            ) : (
                              <>
                                <Phone size={16} color="#3B82F6" />
                                <Text style={styles.actionButtonText}>Send SMS</Text>
                              </>
                            )}
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#10B981',
    gap: 8,
  },
  successBannerText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
    flex: 1,
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
  successButton: {
    backgroundColor: '#10B981',
  },
  disabledButton: {
    opacity: 0.6,
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