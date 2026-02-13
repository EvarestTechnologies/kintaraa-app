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
  Video,
  Phone,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Patient, Appointment } from '../index';
import { NotificationService } from '@/services/notificationService';
import { AppointmentReminderService } from '@/services/appointmentReminderService';
import { useProvider } from '@/providers/ProviderContext';
import { useIncidents } from '@/providers/IncidentProvider';

interface AppointmentSchedulingModalProps {
  visible: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSchedule: (appointment: Omit<Appointment, 'id'>) => void;
}

type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'therapy';
type AppointmentMode = 'in_person' | 'video_call' | 'phone_call';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

const appointmentTypes: { value: AppointmentType; label: string; color: string }[] = [
  { value: 'consultation', label: 'Initial Consultation', color: '#3B82F6' },
  { value: 'follow_up', label: 'Follow-up Visit', color: '#10B981' },
  { value: 'emergency', label: 'Emergency Consultation', color: '#EF4444' },
  { value: 'therapy', label: 'Therapy Session', color: '#8B5CF6' },
];

const appointmentModes: { value: AppointmentMode; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { value: 'in_person', label: 'In-Person', icon: MapPin, color: '#059669' },
  { value: 'video_call', label: 'Video Call', icon: Video, color: '#3B82F6' },
  { value: 'phone_call', label: 'Phone Call', icon: Phone, color: '#8B5CF6' },
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low Priority', color: '#6B7280' },
  { value: 'medium', label: 'Medium Priority', color: '#F59E0B' },
  { value: 'high', label: 'High Priority', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent', color: '#DC2626' },
];

export default function AppointmentSchedulingModal({
  visible,
  patient,
  onClose,
  onSchedule,
}: AppointmentSchedulingModalProps) {
  const { providerProfile } = useProvider();
  const { incidents } = useIncidents();
  const [selectedType, setSelectedType] = useState<AppointmentType>('consultation');
  const [selectedMode, setSelectedMode] = useState<AppointmentMode>('in_person');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const resetForm = () => {
    setSelectedType('consultation');
    setSelectedMode('in_person');
    setSelectedPriority('medium');
    setSelectedDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
    setSelectedTime(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
    setDuration('60');
    setLocation('');
    setNotes('');
  };

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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSchedule = async () => {
    if (!patient || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsScheduling(true);

    try {
      const appointmentData: Omit<Appointment, 'id'> = {
        patientName: patient.name,
        patientId: patient.id,
        type: selectedType,
        mode: selectedMode,
        date: selectedDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        time: formatTime(selectedTime), // Convert to HH:MM format
        duration: parseInt(duration),
        status: 'scheduled',
        location: selectedMode === 'in_person' ? location : undefined,
        notes,
        priority: selectedPriority,
        caseId: patient.caseId,
      };

      // Simulate scheduling delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSchedule(appointmentData);

      // Create survivor notification if we have provider info and can find the incident
      if (providerProfile && patient.caseId) {
        const incident = incidents.find(inc => inc.id === patient.caseId);
        if (incident) {
          const survivorNotification = NotificationService.createSurvivorAppointmentNotification(
            incident,
            providerProfile.name,
            'healthcare', // Default to healthcare since this is the healthcare dashboard
            {
              date: selectedDate.toISOString().split('T')[0],
              time: formatTime(selectedTime),
              location: selectedMode === 'in_person' ? location : `${selectedMode === 'video_call' ? 'Video Call' : 'Phone Call'}`,
              type: selectedType === 'consultation' ? 'consultation' :
                    selectedType === 'follow_up' ? 'follow_up' :
                    selectedType === 'therapy' ? 'counseling' : 'examination'
            }
          );

          // Store notification for survivor to see
          NotificationService.storeSurvivorNotification(survivorNotification);

          // Schedule appointment reminders
          const appointmentId = `${patient.caseId}-apt-${Date.now()}`;
          AppointmentReminderService.scheduleAppointmentReminders(
            appointmentId,
            selectedDate.toISOString().split('T')[0],
            formatTime(selectedTime),
            'survivor-1', // This would be the actual survivor ID from the incident
            providerProfile.id || 'provider-1', // Provider ID
            {
              patientName: patient.name,
              providerName: providerProfile.name,
              location: selectedMode === 'in_person' ? location : `${selectedMode === 'video_call' ? 'Video Call' : 'Phone Call'}`,
              type: selectedType,
            }
          );
        }
      }

      handleClose();

      Alert.alert(
        'Appointment Scheduled',
        `Appointment with ${patient.name} has been scheduled for ${formatDate(selectedDate)} at ${formatTime(selectedTime)}. The patient will be notified.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule appointment. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };


  if (!patient) return null;

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
            <Text style={styles.title}>Schedule Appointment</Text>
            <Text style={styles.subtitle}>Patient: {patient.name}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Appointment Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Type</Text>
            <View style={styles.typeGrid}>
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeCard,
                    selectedType === type.value && { borderColor: type.color, backgroundColor: `${type.color}10` }
                  ]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.value && { color: type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Appointment Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Consultation Mode</Text>
            <View style={styles.modeGrid}>
              {appointmentModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <TouchableOpacity
                    key={mode.value}
                    style={[
                      styles.modeCard,
                      selectedMode === mode.value && { borderColor: mode.color, backgroundColor: `${mode.color}10` }
                    ]}
                    onPress={() => setSelectedMode(mode.value)}
                  >
                    <IconComponent
                      size={20}
                      color={selectedMode === mode.value ? mode.color : '#6B7280'}
                    />
                    <Text style={[
                      styles.modeLabel,
                      selectedMode === mode.value && { color: mode.color }
                    ]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.pickerButtonText}>
                    {formatDate(selectedDate)}
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
                    {formatTime(selectedTime)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.durationInput}>
                <Text style={styles.inputLabel}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

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

          {/* Location (if in-person) */}
          {selectedMode === 'in_person' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TextInput
                style={styles.textArea}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter appointment location..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>
          )}

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityGrid}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityCard,
                    selectedPriority === priority.value && { borderColor: priority.color, backgroundColor: `${priority.color}10` }
                  ]}
                  onPress={() => setSelectedPriority(priority.value)}
                >
                  <Text style={[
                    styles.priorityLabel,
                    selectedPriority === priority.value && { color: priority.color }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes for this appointment..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scheduleButton, isScheduling && styles.disabledButton]}
            onPress={handleSchedule}
            disabled={isScheduling}
          >
            <LinearGradient
              colors={isScheduling ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1E40AF']}
              style={styles.scheduleGradient}
            >
              {isScheduling ? (
                <>
                  <Clock size={16} color="#FFFFFF" />
                  <Text style={styles.scheduleButtonText}>Scheduling...</Text>
                </>
              ) : (
                <>
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1.5,
  },
  durationInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  priorityCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scheduleButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scheduleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.7,
  },
});