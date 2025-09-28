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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Save,
  ChevronDown,
  Plus,
  Minus,
  Heart,
  Stethoscope,
  Shield,
  BookOpen,
  UserPlus,
  Megaphone,
  Activity,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { CommunityOutreachEvent } from '../index';

interface AddOutreachEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newEvent: CommunityOutreachEvent) => void;
}

interface EventFormData {
  name: string;
  type: CommunityOutreachEvent['type'];
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  targetPopulation: string[];
  expectedAttendance: string;
  services: string[];
  partners: string[];
  coordinator: string;
  volunteers: string[];
  budget: string;
}

const eventTypes = [
  { label: 'Health Fair', value: 'health_fair', icon: Heart, color: '#DC2626', description: 'Community health fairs with multiple services' },
  { label: 'Screening Event', value: 'screening_event', icon: Stethoscope, color: '#EA580C', description: 'Health screening and assessment events' },
  { label: 'Vaccination Clinic', value: 'vaccination_clinic', icon: Shield, color: '#65A30D', description: 'Immunization and vaccination drives' },
  { label: 'Education Workshop', value: 'education_workshop', icon: BookOpen, color: '#059669', description: 'Health education and training sessions' },
  { label: 'Support Group', value: 'support_group', icon: UserPlus, color: '#7C3AED', description: 'Peer support and counseling groups' },
  { label: 'Awareness Campaign', value: 'awareness_campaign', icon: Megaphone, color: '#BE185D', description: 'Public awareness and advocacy campaigns' },
];

const commonTargetPopulations = [
  'General public', 'Children under 5', 'Pregnant women', 'Elderly (65+)',
  'Adolescents', 'Women of reproductive age', 'Men', 'Families',
  'High-risk individuals', 'Community leaders', 'Youth', 'Adults'
];

const commonServices = [
  'Blood pressure screening', 'Diabetes testing', 'BMI measurement', 'Eye screening',
  'Dental checkup', 'Mental health screening', 'HIV testing', 'TB screening',
  'Health education', 'Vaccination', 'Family planning', 'Nutrition counseling',
  'First aid training', 'Medication adherence support', 'Referral services',
  'Health insurance enrollment', 'Peer support', 'Counseling sessions'
];

const commonPartners = [
  'Ministry of Health', 'Nakawa Health Center', 'Red Cross Uganda', 'UNICEF',
  'WHO', 'USAID', 'Lions Club', 'Rotary Club', 'Local NGOs', 'Community leaders',
  'Schools', 'Religious organizations', 'Private sector partners'
];

export default function AddOutreachEventModal({
  visible,
  onClose,
  onSuccess
}: AddOutreachEventModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    type: 'health_fair',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '15:00',
    location: '',
    targetPopulation: [],
    expectedAttendance: '50',
    services: [],
    partners: [],
    coordinator: user ? `${user.firstName} ${user.lastName}` : '',
    volunteers: [],
    budget: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [showTargetPopulationPicker, setShowTargetPopulationPicker] = useState(false);
  const [showServicesPicker, setShowServicesPicker] = useState(false);
  const [showPartnersPicker, setShowPartnersPicker] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState('');

  const updateFormData = (field: keyof EventFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addVolunteer = () => {
    if (newVolunteer.trim() && !formData.volunteers.includes(newVolunteer.trim())) {
      setFormData(prev => ({
        ...prev,
        volunteers: [...prev.volunteers, newVolunteer.trim()]
      }));
      setNewVolunteer('');
    }
  };

  const removeVolunteer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volunteers: prev.volunteers.filter((_, i) => i !== index)
    }));
  };

  const toggleTargetPopulation = (population: string) => {
    setFormData(prev => ({
      ...prev,
      targetPopulation: prev.targetPopulation.includes(population)
        ? prev.targetPopulation.filter(p => p !== population)
        : [...prev.targetPopulation, population]
    }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const togglePartner = (partner: string) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.includes(partner)
        ? prev.partners.filter(p => p !== partner)
        : [...prev.partners, partner]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.coordinator.trim()) newErrors.coordinator = 'Coordinator is required';

    const attendance = parseInt(formData.expectedAttendance);
    if (isNaN(attendance) || attendance < 1) {
      newErrors.expectedAttendance = 'Expected attendance must be at least 1';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.targetPopulation.length === 0) {
      newErrors.targetPopulation = 'At least one target population is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'At least one service is required';
    }

    // Validate time format
    const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
    const endTime = new Date(`1970-01-01T${formData.endTime}:00`);
    if (endTime <= startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newEvent: CommunityOutreachEvent = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        targetPopulation: formData.targetPopulation,
        expectedAttendance: parseInt(formData.expectedAttendance),
        services: formData.services,
        partners: formData.partners,
        coordinator: formData.coordinator,
        volunteers: formData.volunteers,
        status: 'planning',
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      onSuccess(newEvent);
      Alert.alert(
        'Success',
        `Event "${newEvent.name}" has been created successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch {
      Alert.alert(
        'Error',
        'Failed to create event. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof EventFormData,
    placeholder: string,
    options?: {
      multiline?: boolean;
      numberOfLines?: number;
      keyboardType?: 'default' | 'numeric';
    }
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TextInput
        style={[
          styles.textInput,
          options?.multiline && styles.textInputMultiline,
          errors[field] && styles.textInputError
        ]}
        value={formData[field] as string}
        onChangeText={(text) => updateFormData(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        keyboardType={options?.keyboardType || 'default'}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    onPress: () => void,
    displayValue?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TouchableOpacity style={styles.selectInput} onPress={onPress}>
        <Text style={[styles.selectInputText, !displayValue && styles.placeholder]}>
          {displayValue || value}
        </Text>
        <ChevronDown color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const renderTimeInput = (
    label: string,
    value: string,
    onPress: () => void
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TouchableOpacity style={styles.timeInput} onPress={onPress}>
        <Clock color="#6B7280" size={16} />
        <Text style={styles.timeInputText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMultiSelectField = (
    label: string,
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void,
    showPicker: boolean,
    setShowPicker: (show: boolean) => void,
    errorKey: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TouchableOpacity
        style={[styles.selectInput, errors[errorKey] && styles.textInputError]}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={styles.selectInputText}>
          {selectedItems.length > 0
            ? `${selectedItems.length} selected`
            : `Select ${label.toLowerCase()}`}
        </Text>
        <ChevronDown color="#6B7280" />
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.multiSelectContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.multiSelectItem,
                selectedItems.includes(item) && styles.multiSelectItemSelected
              ]}
              onPress={() => onToggle(item)}
            >
              <Text style={[
                styles.multiSelectText,
                selectedItems.includes(item) && styles.multiSelectTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedItems.length > 0 && (
        <View style={styles.selectedItemsContainer}>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
    </View>
  );

  const selectedEventType = eventTypes.find(t => t.value === formData.type);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Outreach Event</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Event Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Event Information</Text>
            </View>

            {renderTextInput('Event Name', 'name', 'Enter a descriptive name for the event')}

            {renderSelectField(
              'Event Type',
              formData.type,
              () => setShowEventTypePicker(true),
              selectedEventType?.label
            )}

            {renderTextInput('Description', 'description', 'Detailed description of the event and its objectives', {
              multiline: true,
              numberOfLines: 4
            })}
          </View>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar color="#3B82F6" size={24} />
              <Text style={styles.sectionTitle}>Date & Time</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Event Date *</Text>
              <TouchableOpacity
                style={[styles.dateInput, errors.date && styles.textInputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : 'Select event date'}
                </Text>
              </TouchableOpacity>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            <View style={styles.timeRow}>
              {renderTimeInput('Start Time', formData.startTime, () => setShowStartTimePicker(true))}
              {renderTimeInput('End Time', formData.endTime, () => setShowEndTimePicker(true))}
            </View>
            {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
          </View>

          {/* Location & Attendance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Location & Attendance</Text>
            </View>

            {renderTextInput('Location', 'location', 'Specific venue or area for the event')}

            {renderTextInput('Expected Attendance', 'expectedAttendance', 'Estimated number of participants', {
              keyboardType: 'numeric'
            })}

            {renderMultiSelectField(
              'Target Population',
              commonTargetPopulations,
              formData.targetPopulation,
              toggleTargetPopulation,
              showTargetPopulationPicker,
              setShowTargetPopulationPicker,
              'targetPopulation'
            )}
          </View>

          {/* Services & Partners Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users color="#F59E0B" size={24} />
              <Text style={styles.sectionTitle}>Services & Partners</Text>
            </View>

            {renderMultiSelectField(
              'Services Offered',
              commonServices,
              formData.services,
              toggleService,
              showServicesPicker,
              setShowServicesPicker,
              'services'
            )}

            {renderMultiSelectField(
              'Partner Organizations',
              commonPartners,
              formData.partners,
              togglePartner,
              showPartnersPicker,
              setShowPartnersPicker,
              'partners'
            )}
          </View>

          {/* Team & Budget Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Team & Budget</Text>
            </View>

            {renderTextInput('Event Coordinator', 'coordinator', 'Person responsible for organizing the event')}

            {/* Volunteers */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Volunteers (Optional)</Text>
              <View style={styles.listInputContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newVolunteer}
                  onChangeText={setNewVolunteer}
                  placeholder="Add volunteer name"
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addVolunteer}
                />
                <TouchableOpacity
                  style={[styles.addButton, !newVolunteer.trim() && styles.addButtonDisabled]}
                  onPress={addVolunteer}
                  disabled={!newVolunteer.trim()}
                >
                  <Plus color={newVolunteer.trim() ? "#FFFFFF" : "#9CA3AF"} size={20} />
                </TouchableOpacity>
              </View>
              {formData.volunteers.map((volunteer, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{volunteer}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeVolunteer(index)}
                  >
                    <Minus color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Budget (Optional)</Text>
              <TextInput
                style={[styles.textInput, errors.budget && styles.textInputError]}
                value={formData.budget}
                onChangeText={(text) => updateFormData('budget', text)}
                placeholder="Enter event budget (USD)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.date ? new Date(formData.date) : new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateFormData('date', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        {/* Start Time Picker */}
        {showStartTimePicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${formData.startTime}:00`)}
            mode="time"
            display="default"
            onChange={(_, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) {
                const hours = selectedTime.getHours().toString().padStart(2, '0');
                const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                updateFormData('startTime', `${hours}:${minutes}`);
              }
            }}
          />
        )}

        {/* End Time Picker */}
        {showEndTimePicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${formData.endTime}:00`)}
            mode="time"
            display="default"
            onChange={(_, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) {
                const hours = selectedTime.getHours().toString().padStart(2, '0');
                const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                updateFormData('endTime', `${hours}:${minutes}`);
              }
            }}
          />
        )}

        {/* Event Type Picker */}
        <Modal
          visible={showEventTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Event Type</Text>
                <TouchableOpacity onPress={() => setShowEventTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {eventTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeOption}
                    onPress={() => {
                      updateFormData('type', type.value);
                      setShowEventTypePicker(false);
                    }}
                  >
                    <View style={[styles.typeIconContainer, { backgroundColor: type.color + '20' }]}>
                      <Icon color={type.color} size={24} />
                    </View>
                    <View style={styles.typeContent}>
                      <Text style={styles.typeLabel}>{type.label}</Text>
                      <Text style={styles.typeDescription}>{type.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectInputText: {
    fontSize: 16,
    color: '#1E293B',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  dateInputText: {
    fontSize: 16,
    color: '#1E293B',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  timeInputText: {
    fontSize: 16,
    color: '#1E293B',
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    maxHeight: 150,
  },
  multiSelectItem: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  multiSelectItemSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  multiSelectText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  multiSelectTextSelected: {
    color: '#FFFFFF',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  selectedItem: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedItemText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  listInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
});