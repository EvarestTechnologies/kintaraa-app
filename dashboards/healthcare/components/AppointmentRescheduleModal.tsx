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
  CheckCircle,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppointmentStatusService } from '@/services/appointmentStatusService';
import { AppointmentReminderService } from '@/services/appointmentReminderService';
import type { Appointment } from '../index';

interface AppointmentRescheduleModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string, reason?: string) => void;
}

export default function AppointmentRescheduleModal({
  visible,
  appointment,
  onClose,
  onReschedule
}: AppointmentRescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with current appointment date/time when modal opens
  React.useEffect(() => {
    if (appointment && visible) {
      const currentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.time.split(':');
      const currentTime = new Date();
      currentTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
      setNotes('');
    }
  }, [appointment, visible]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
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
      hour12: true
    });
  };

  const handleConfirmReschedule = async () => {
    if (!appointment) return;

    // Validate that the new date/time is in the future
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

    if (newDateTime <= new Date()) {
      Alert.alert(
        'Invalid Date/Time',
        'Please select a future date and time for the appointment.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    try {
      const newDateStr = selectedDate.toISOString().split('T')[0];
      const newTimeStr = formatTime(selectedTime);

      // Update appointment status in the service
      AppointmentStatusService.updateAppointmentStatus(
        appointment.id,
        'rescheduled',
        'provider',
        notes || 'Appointment rescheduled by provider',
        { newDate: newDateStr, newTime: newTimeStr }
      );

      // Reschedule appointment reminders
      AppointmentReminderService.rescheduleAppointmentReminders(
        appointment.id,
        newDateStr,
        newTimeStr,
        {
          patientName: appointment.patientName,
          providerName: 'Dr. Provider', // This would come from provider context
          location: appointment.location || 'Location TBD',
          type: appointment.type,
        }
      );

      // Call the callback to update the parent component
      onReschedule(appointment.id, newDateStr, newTimeStr, notes);

      Alert.alert(
        'Appointment Rescheduled',
        `The appointment has been rescheduled to ${formatDate(selectedDate)} at ${newTimeStr}. The patient will be notified.`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to reschedule appointment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusUpdates = () => {
    if (!appointment) return [];
    return AppointmentStatusService.getAppointmentStatusHistory(appointment.id)
      .filter(update => update.newStatus === 'reschedule_requested');
  };

  const getOriginalRescheduleRequest = () => {
    const updates = getStatusUpdates();
    return updates.length > 0 ? updates[0] : null;
  };

  if (!appointment) return null;

  const originalRequest = getOriginalRescheduleRequest();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <RotateCcw size={24} color="#6A2CB0" />
            <View style={styles.headerText}>
              <Text style={styles.title}>Reschedule Appointment</Text>
              <Text style={styles.subtitle}>
                {appointment.patientName} • {appointment.type}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Appointment Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Appointment</Text>
            <View style={styles.currentAppointmentCard}>
              <View style={styles.appointmentRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.appointmentText}>
                  {formatDate(new Date(appointment.date))}
                </Text>
              </View>
              <View style={styles.appointmentRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.appointmentText}>
                  {appointment.time} ({appointment.duration} minutes)
                </Text>
              </View>
              {appointment.location && (
                <View style={styles.appointmentRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.appointmentText}>
                    {appointment.location}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Reschedule Request Details */}
          {originalRequest && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient's Reschedule Request</Text>
              <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <AlertTriangle size={16} color="#F59E0B" />
                  <Text style={styles.requestTitle}>
                    Requested recently
                  </Text>
                </View>
                {originalRequest.reason && (
                  <View style={styles.reasonContainer}>
                    <Text style={styles.reasonLabel}>Reason:</Text>
                    <Text style={styles.reasonText}>{originalRequest.reason}</Text>
                  </View>
                )}
                {originalRequest.rescheduleDetails && (
                  <View style={styles.preferredContainer}>
                    <Text style={styles.preferredLabel}>Patient's preferred time:</Text>
                    <Text style={styles.preferredText}>
                      {originalRequest.rescheduleDetails.newDate} at {originalRequest.rescheduleDetails.newTime}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* New Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select New Date</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#6A2CB0" />
              <Text style={styles.dateTimeButtonText}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* New Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select New Time</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color="#6A2CB0" />
              <Text style={styles.dateTimeButtonText}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about the rescheduling..."
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
              onPress={handleConfirmReschedule}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#6A2CB0', '#553C9A']}
                style={styles.confirmButtonGradient}
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>
                  {isLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
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
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  currentAppointmentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  appointmentText: {
    fontSize: 14,
    color: '#374151',
  },
  requestCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
  reasonContainer: {
    marginBottom: 12,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  preferredContainer: {
    marginTop: 8,
  },
  preferredLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  preferredText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});