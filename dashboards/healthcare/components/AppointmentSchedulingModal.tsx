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
} from 'react-native';
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
  const [selectedType, setSelectedType] = useState<AppointmentType>('consultation');
  const [selectedMode, setSelectedMode] = useState<AppointmentMode>('in_person');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const resetForm = () => {
    setSelectedType('consultation');
    setSelectedMode('in_person');
    setSelectedPriority('medium');
    setSelectedDate('');
    setSelectedTime('');
    setDuration('60');
    setLocation('');
    setNotes('');
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
        date: selectedDate,
        time: selectedTime,
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
      handleClose();

      Alert.alert(
        'Appointment Scheduled',
        `Appointment with ${patient.name} has been scheduled for ${selectedDate} at ${selectedTime}. The patient will be notified.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule appointment. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
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
                <TextInput
                  style={styles.input}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder={getTomorrowDate()}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={selectedTime}
                  onChangeText={setSelectedTime}
                  placeholder="14:00"
                  placeholderTextColor="#9CA3AF"
                />
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