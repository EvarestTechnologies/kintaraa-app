import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Bell,
  Save,
  AlertTriangle,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ScheduleHearingModalProps {
  visible: boolean;
  onClose: () => void;
  onSchedule: (hearingData: any) => void;
}

type HearingType = 'hearing' | 'trial' | 'mediation' | 'deposition' | 'conference';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

const hearingTypes: { value: HearingType; label: string }[] = [
  { value: 'hearing', label: 'Hearing' },
  { value: 'trial', label: 'Trial' },
  { value: 'mediation', label: 'Mediation' },
  { value: 'deposition', label: 'Deposition' },
  { value: 'conference', label: 'Conference' },
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6B7280' },
  { value: 'medium', label: 'Medium', color: '#3B82F6' },
  { value: 'high', label: 'High', color: '#F59E0B' },
  { value: 'urgent', label: 'Urgent', color: '#EF4444' },
];

const mockCases = [
  { id: 'case-1', name: 'Johnson vs. Smith', number: 'CASE-2024-001' },
  { id: 'case-2', name: 'Rodriguez vs. State', number: 'CASE-2024-002' },
  { id: 'case-3', name: 'Chen vs. Employer Corp', number: 'CASE-2023-045' },
  { id: 'case-4', name: 'Thompson vs. City', number: 'CASE-2024-003' },
];

const mockJudges = [
  'Hon. Margaret Wilson',
  'Hon. Robert Chen',
  'Hon. Patricia Lee',
  'Hon. David Martinez',
  'Mediator Jane Thompson',
];

const courtLocations = [
  'Family Court Building A',
  'Criminal Court Building B',
  'Civil Court Building C',
  'Employment Court',
  'Appeals Court',
  'Mediation Center',
];

export default function ScheduleHearingModal({ visible, onClose, onSchedule }: ScheduleHearingModalProps) {
  const [selectedCase, setSelectedCase] = useState('');
  const [hearingType, setHearingType] = useState<HearingType>('hearing');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [judge, setJudge] = useState('');
  const [attendees, setAttendees] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');
  const [notifyClient, setNotifyClient] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const resetForm = () => {
    setSelectedCase('');
    setHearingType('hearing');
    setTitle('');
    setDate(new Date());
    setTime(new Date());
    setDuration('60');
    setLocation('');
    setRoomNumber('');
    setJudge('');
    setAttendees('');
    setPriority('medium');
    setNotes('');
    setNotifyClient(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!selectedCase) {
      Alert.alert('Validation Error', 'Please select a case.');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a hearing title.');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please select a location.');
      return false;
    }
    if (!judge.trim()) {
      Alert.alert('Validation Error', 'Please select a judge.');
      return false;
    }
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration.');
      return false;
    }
    return true;
  };

  const handleSchedule = () => {
    if (!validateForm()) return;

    const hearingData = {
      id: `hearing-${Date.now()}`,
      caseId: selectedCase,
      caseName: mockCases.find(c => c.id === selectedCase)?.name || '',
      caseNumber: mockCases.find(c => c.id === selectedCase)?.number || '',
      type: hearingType,
      title,
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().slice(0, 5),
      duration: parseInt(duration),
      location: roomNumber ? `${location}, Room ${roomNumber}` : location,
      judge,
      status: 'scheduled',
      priority,
      notes,
      attendees: attendees.split(',').map(a => a.trim()).filter(a => a),
      notifyClient,
      createdAt: new Date().toISOString(),
    };

    onSchedule(hearingData);
    Alert.alert('Success', 'Hearing scheduled successfully!');
    handleClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          <View style={styles.headerLeft}>
            <Calendar color="#3B82F6" size={24} />
            <Text style={styles.headerTitle}>Schedule Hearing</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Case Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Case Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Case *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.caseSelector}>
                {mockCases.map((case_) => (
                  <TouchableOpacity
                    key={case_.id}
                    style={[
                      styles.caseChip,
                      selectedCase === case_.id && styles.caseChipActive,
                    ]}
                    onPress={() => setSelectedCase(case_.id)}
                  >
                    <Text style={[
                      styles.caseChipText,
                      selectedCase === case_.id && styles.caseChipTextActive,
                    ]}>
                      {case_.number}
                    </Text>
                    <Text style={[
                      styles.caseChipSubtext,
                      selectedCase === case_.id && styles.caseChipSubtextActive,
                    ]}>
                      {case_.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hearing Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hearingTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeChip,
                      hearingType === type.value && styles.typeChipActive,
                    ]}
                    onPress={() => setHearingType(type.value)}
                  >
                    <Text style={[
                      styles.typeChipText,
                      hearingType === type.value && styles.typeChipTextActive,
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hearing Title/Subject *</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Motion for Summary Judgment"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar color="#6B7280" size={20} />
                  <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Time *</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock color="#6B7280" size={20} />
                  <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (minutes) *</Text>
              <TextInput
                style={styles.textInput}
                value={duration}
                onChangeText={setDuration}
                placeholder="60"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Location & Participants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Participants</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Court Location *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {courtLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.locationChip,
                      location === loc && styles.locationChipActive,
                    ]}
                    onPress={() => setLocation(loc)}
                  >
                    <Text style={[
                      styles.locationChipText,
                      location === loc && styles.locationChipTextActive,
                    ]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Number (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={roomNumber}
                onChangeText={setRoomNumber}
                placeholder="e.g., 201, A-105"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Judge/Mediator *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mockJudges.map((judgeOption) => (
                  <TouchableOpacity
                    key={judgeOption}
                    style={[
                      styles.judgeChip,
                      judge === judgeOption && styles.judgeChipActive,
                    ]}
                    onPress={() => setJudge(judgeOption)}
                  >
                    <Text style={[
                      styles.judgeChipText,
                      judge === judgeOption && styles.judgeChipTextActive,
                    ]}>
                      {judgeOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attendees (comma-separated)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={attendees}
                onChangeText={setAttendees}
                placeholder="e.g., Client Name, Attorney Name, Witness Name"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Priority & Additional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority & Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority Level</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((priorityOption) => (
                  <TouchableOpacity
                    key={priorityOption.value}
                    style={[
                      styles.priorityChip,
                      { borderColor: priorityOption.color },
                      priority === priorityOption.value && { backgroundColor: priorityOption.color },
                    ]}
                    onPress={() => setPriority(priorityOption.value)}
                  >
                    {priorityOption.value === 'urgent' && (
                      <AlertTriangle
                        color={priority === priorityOption.value ? '#FFFFFF' : priorityOption.color}
                        size={16}
                      />
                    )}
                    <Text style={[
                      styles.priorityChipText,
                      { color: priority === priorityOption.value ? '#FFFFFF' : priorityOption.color },
                    ]}>
                      {priorityOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes/Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Additional notes, preparation requirements, special instructions..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Bell color="#6B7280" size={20} />
                <Text style={styles.switchText}>Notify client about this hearing</Text>
              </View>
              <Switch
                value={notifyClient}
                onValueChange={setNotifyClient}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={notifyClient ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.scheduleButtonText}>Schedule Hearing</Text>
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#374151',
  },
  caseSelector: {
    marginBottom: 8,
  },
  caseChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    minWidth: 120,
  },
  caseChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  caseChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  caseChipTextActive: {
    color: '#FFFFFF',
  },
  caseChipSubtext: {
    fontSize: 10,
    color: '#6B7280',
  },
  caseChipSubtextActive: {
    color: '#E5E7EB',
  },
  typeChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  locationChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  locationChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  locationChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  locationChipTextActive: {
    color: '#FFFFFF',
  },
  judgeChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  judgeChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  judgeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  judgeChipTextActive: {
    color: '#FFFFFF',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  switchText: {
    fontSize: 16,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  scheduleButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});