import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SurvivorNotification } from '@/services/notificationService';

interface AppointmentDetails {
  id: string;
  providerName: string;
  providerType: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
  mode: 'in_person' | 'video_call' | 'phone_call';
  notes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'reschedule_requested';
}

interface AppointmentConfirmationModalProps {
  visible: boolean;
  notification: SurvivorNotification | null;
  onClose: () => void;
  onConfirm: (appointmentId: string) => void;
  onDecline: (appointmentId: string, reason: string) => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string, reason: string) => void;
}

type ActionType = 'confirm' | 'decline' | 'reschedule' | null;

export default function AppointmentConfirmationModal({
  visible,
  notification,
  onClose,
  onConfirm,
  onDecline,
  onReschedule,
}: AppointmentConfirmationModalProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [newDate, setNewDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [newTime, setNewTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse appointment details from notification
  const appointmentDetails: AppointmentDetails | null = notification ? {
    id: notification.id,
    providerName: notification.providerName || 'Healthcare Provider',
    providerType: notification.providerType || 'healthcare',
    appointmentType: 'consultation', // Would parse from notification message
    date: new Date().toISOString().split('T')[0], // Would parse from notification
    time: '14:00', // Would parse from notification
    duration: 60,
    location: 'Kenyatta National Hospital', // Would parse from notification
    mode: 'in_person', // Would parse from notification
    status: 'pending'
  } : null;

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setNewDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setNewTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatOriginalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirm = async () => {
    if (!appointmentDetails) return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onConfirm(appointmentDetails.id);
      Alert.alert(
        'Appointment Confirmed',
        `Your appointment with ${appointmentDetails.providerName} has been confirmed. You will receive a reminder 24 hours before the appointment.`
      );
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm appointment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!appointmentDetails || !declineReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for declining the appointment.');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onDecline(appointmentDetails.id, declineReason);
      Alert.alert(
        'Appointment Declined',
        'The appointment has been declined. The provider will be notified and may reach out to reschedule.'
      );
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to decline appointment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRescheduleRequest = async () => {
    if (!appointmentDetails || !rescheduleReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for requesting to reschedule.');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onReschedule(
        appointmentDetails.id,
        newDate.toISOString().split('T')[0],
        formatTime(newTime),
        rescheduleReason
      );
      Alert.alert(
        'Reschedule Requested',
        'Your reschedule request has been sent to the provider. They will contact you to confirm the new time.'
      );
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to request reschedule. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedAction(null);
    setDeclineReason('');
    setRescheduleReason('');
    setNewDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    setNewTime(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getModeIcon = () => {
    if (!appointmentDetails) return null;
    switch (appointmentDetails.mode) {
      case 'video_call':
        return <Video size={20} color="#3B82F6" />;
      case 'phone_call':
        return <Phone size={20} color="#8B5CF6" />;
      default:
        return <MapPin size={20} color="#059669" />;
    }
  };

  const getModeText = () => {
    if (!appointmentDetails) return '';
    switch (appointmentDetails.mode) {
      case 'video_call':
        return 'Video Call';
      case 'phone_call':
        return 'Phone Call';
      default:
        return 'In-Person';
    }
  };

  if (!notification || !appointmentDetails) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Appointment Details</Text>
            <Text style={styles.subtitle}>Please confirm your availability</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Appointment Info Card */}
          <View style={styles.appointmentCard}>
            <View style={styles.providerSection}>
              <View style={styles.providerIcon}>
                <User size={24} color="#FFFFFF" />
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{appointmentDetails.providerName}</Text>
                <Text style={styles.providerType}>
                  {appointmentDetails.providerType === 'healthcare' ? 'Healthcare Provider' :
                   appointmentDetails.providerType === 'counseling' ? 'Counselor' :
                   'Support Provider'}
                </Text>
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>
                    {formatOriginalDate(appointmentDetails.date)} at {appointmentDetails.time}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Clock size={20} color="#6B7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{appointmentDetails.duration} minutes</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                {getModeIcon()}
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Mode</Text>
                  <Text style={styles.detailValue}>
                    {getModeText()}
                    {appointmentDetails.location && appointmentDetails.mode === 'in_person' &&
                      ` - ${appointmentDetails.location}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Selection */}
          {!selectedAction && (
            <View style={styles.actionSection}>
              <Text style={styles.sectionTitle}>Choose Your Response</Text>

              <TouchableOpacity
                style={[styles.actionCard, styles.confirmCard]}
                onPress={() => setSelectedAction('confirm')}
              >
                <CheckCircle size={24} color="#10B981" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Confirm Appointment</Text>
                  <Text style={styles.actionDescription}>
                    I can attend at the scheduled time
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, styles.rescheduleCard]}
                onPress={() => setSelectedAction('reschedule')}
              >
                <RotateCcw size={24} color="#F59E0B" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Request Reschedule</Text>
                  <Text style={styles.actionDescription}>
                    I need to change the date or time
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, styles.declineCard]}
                onPress={() => setSelectedAction('decline')}
              >
                <XCircle size={24} color="#EF4444" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Decline Appointment</Text>
                  <Text style={styles.actionDescription}>
                    I cannot attend this appointment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Confirm Action */}
          {selectedAction === 'confirm' && (
            <View style={styles.confirmSection}>
              <View style={styles.confirmHeader}>
                <CheckCircle size={24} color="#10B981" />
                <Text style={styles.confirmTitle}>Confirm Appointment</Text>
              </View>
              <Text style={styles.confirmText}>
                By confirming, you agree to attend the appointment at the scheduled time.
                You will receive reminders before the appointment.
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedAction(null)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, isProcessing && styles.disabledButton]}
                  onPress={handleConfirm}
                  disabled={isProcessing}
                >
                  <LinearGradient
                    colors={isProcessing ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                    style={styles.confirmGradient}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isProcessing ? 'Confirming...' : 'Confirm Appointment'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Decline Action */}
          {selectedAction === 'decline' && (
            <View style={styles.declineSection}>
              <View style={styles.declineHeader}>
                <XCircle size={24} color="#EF4444" />
                <Text style={styles.declineTitle}>Decline Appointment</Text>
              </View>
              <Text style={styles.sectionLabel}>Reason for declining (required)</Text>
              <TextInput
                style={styles.textArea}
                value={declineReason}
                onChangeText={setDeclineReason}
                placeholder="Please let us know why you need to decline this appointment..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedAction(null)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.declineButton, isProcessing && styles.disabledButton]}
                  onPress={handleDecline}
                  disabled={isProcessing}
                >
                  <Text style={styles.declineButtonText}>
                    {isProcessing ? 'Declining...' : 'Decline Appointment'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Reschedule Action */}
          {selectedAction === 'reschedule' && (
            <View style={styles.rescheduleSection}>
              <View style={styles.rescheduleHeader}>
                <RotateCcw size={24} color="#F59E0B" />
                <Text style={styles.rescheduleTitle}>Request Reschedule</Text>
              </View>

              <Text style={styles.sectionLabel}>Preferred New Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.pickerButtonText}>
                      {formatDate(newDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeInput}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.pickerButtonText}>
                      {formatTime(newTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker */}
              {showTimePicker && (
                <DateTimePicker
                  value={newTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}

              <Text style={styles.sectionLabel}>Reason for rescheduling (required)</Text>
              <TextInput
                style={styles.textArea}
                value={rescheduleReason}
                onChangeText={setRescheduleReason}
                placeholder="Please explain why you need to reschedule..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedAction(null)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rescheduleButton, isProcessing && styles.disabledButton]}
                  onPress={handleRescheduleRequest}
                  disabled={isProcessing}
                >
                  <Text style={styles.rescheduleButtonText}>
                    {isProcessing ? 'Sending Request...' : 'Request Reschedule'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  appointmentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  providerType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  appointmentDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  actionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  confirmCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  rescheduleCard: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  declineCard: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  actionContent: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  confirmText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  declineSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  declineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  declineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  rescheduleSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  rescheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rescheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  declineButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rescheduleButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.7,
  },
});