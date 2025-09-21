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
  Shield,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  Save,
  ChevronDown,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { PoliceCase } from '../index';

interface NewCaseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newCase: PoliceCase) => void;
}

interface CaseFormData {
  incidentType: 'domestic_violence' | 'sexual_assault' | 'harassment' | 'theft' | 'assault' | 'fraud' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  incidentDate: string;
  location: string;
  victimName: string;
  victimId: string;
  suspectName: string;
  description: string;
  reportingOfficer: string;
  assignedDetective: string;
}

const incidentTypes = [
  { label: 'Domestic Violence', value: 'domestic_violence', icon: '🏠' },
  { label: 'Sexual Assault', value: 'sexual_assault', icon: '⚠️' },
  { label: 'Harassment', value: 'harassment', icon: '📢' },
  { label: 'Theft', value: 'theft', icon: '💰' },
  { label: 'Assault', value: 'assault', icon: '✊' },
  { label: 'Fraud', value: 'fraud', icon: '💳' },
  { label: 'Other', value: 'other', icon: '📝' },
];

const priorityOptions = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Urgent', value: 'urgent', color: '#DC2626' },
];

export default function NewCaseModal({
  visible,
  onClose,
  onSuccess
}: NewCaseModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<CaseFormData>({
    incidentType: 'domestic_violence',
    priority: 'medium',
    incidentDate: new Date().toISOString().split('T')[0],
    location: '',
    victimName: '',
    victimId: '',
    suspectName: '',
    description: '',
    reportingOfficer: user ? `${user.firstName} ${user.lastName}` : '',
    assignedDetective: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIncidentTypePicker, setShowIncidentTypePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const updateFormData = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.victimName.trim()) newErrors.victimName = 'Victim name is required';
    if (!formData.victimId.trim()) newErrors.victimId = 'Victim ID is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.reportingOfficer.trim()) newErrors.reportingOfficer = 'Reporting officer is required';

    if (formData.incidentDate && isNaN(Date.parse(formData.incidentDate))) {
      newErrors.incidentDate = 'Please enter a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCaseNumber = (): string => {
    const typePrefix = formData.incidentType === 'domestic_violence' ? 'DV' :
                      formData.incidentType === 'sexual_assault' ? 'SA' :
                      formData.incidentType === 'harassment' ? 'HR' :
                      formData.incidentType === 'theft' ? 'TH' :
                      formData.incidentType === 'assault' ? 'AS' :
                      formData.incidentType === 'fraud' ? 'FR' : 'OT';

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${typePrefix}-${year}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const newCase: PoliceCase = {
        id: Date.now().toString(),
        caseNumber: generateCaseNumber(),
        incidentType: formData.incidentType,
        status: 'open',
        priority: formData.priority,
        reportedDate: now.split('T')[0],
        incidentDate: formData.incidentDate,
        location: formData.location,
        reportingOfficer: formData.reportingOfficer,
        assignedDetective: formData.assignedDetective || undefined,
        victimName: formData.victimName,
        victimId: formData.victimId,
        suspectName: formData.suspectName || undefined,
        description: formData.description,
        lastActivity: now,
        evidenceCount: 0,
        witnessCount: 0,
      };

      onSuccess(newCase);
      Alert.alert(
        'Success',
        `New case ${newCase.caseNumber} has been created successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create new case. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof CaseFormData,
    placeholder: string,
    options?: {
      multiline?: boolean;
      numberOfLines?: number;
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
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
        value={formData[field]}
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
          <Text style={styles.headerTitle}>New Case</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Case Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#1E40AF" size={24} />
              <Text style={styles.sectionTitle}>Case Information</Text>
            </View>

            {renderSelectField(
              'Incident Type',
              formData.incidentType,
              () => setShowIncidentTypePicker(true),
              incidentTypes.find(t => t.value === formData.incidentType)?.label
            )}

            {renderSelectField(
              'Priority',
              formData.priority,
              () => setShowPriorityPicker(true),
              priorityOptions.find(p => p.value === formData.priority)?.label
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Incident Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {new Date(formData.incidentDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location & People Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Location & Involved Parties</Text>
            </View>

            {renderTextInput('Location', 'location', 'Enter incident location')}
            {renderTextInput('Victim Name', 'victimName', 'Enter victim full name')}
            {renderTextInput('Victim ID', 'victimId', 'Enter victim ID or reference')}
            {renderTextInput('Suspect Name (Optional)', 'suspectName', 'Enter suspect name if known')}
          </View>

          {/* Case Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Case Details</Text>
            </View>

            {renderTextInput('Description', 'description', 'Provide detailed description of the incident', {
              multiline: true,
              numberOfLines: 4
            })}

            {renderTextInput('Reporting Officer', 'reportingOfficer', 'Officer reporting this case')}
            {renderTextInput('Assigned Detective (Optional)', 'assignedDetective', 'Detective assigned to this case')}
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
              {isSubmitting ? 'Creating Case...' : 'Create Case'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.incidentDate)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateFormData('incidentDate', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        {/* Incident Type Picker */}
        <Modal
          visible={showIncidentTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Incident Type</Text>
                <TouchableOpacity onPress={() => setShowIncidentTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {incidentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('incidentType', type.value as any);
                    setShowIncidentTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerEmoji}>{type.icon}</Text>
                  <Text style={styles.pickerOptionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Priority Picker */}
        <Modal
          visible={showPriorityPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Priority</Text>
                <TouchableOpacity onPress={() => setShowPriorityPicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {priorityOptions.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('priority', priority.value as any);
                    setShowPriorityPicker(false);
                  }}
                >
                  <View
                    style={[styles.priorityDot, { backgroundColor: priority.color }]}
                  />
                  <Text style={styles.pickerOptionText}>{priority.label}</Text>
                </TouchableOpacity>
              ))}
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
  placeholder: {
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
    backgroundColor: '#1E40AF',
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
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  pickerEmoji: {
    fontSize: 24,
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1E293B',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});