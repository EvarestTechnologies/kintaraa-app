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
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Shield,
  Camera,
  Video,
  Mic,
  FileText,
  Eye,
  Calendar,
  MapPin,
  User,
  Tag,
  Save,
  ChevronDown,
  Lock,
  AlertTriangle,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { Evidence, ChainOfCustodyEntry, PoliceCase } from '../index';

interface NewEvidenceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newEvidence: Evidence) => void;
  cases: PoliceCase[];
}

interface EvidenceFormData {
  caseId: string;
  caseNumber: string;
  type: 'physical' | 'digital' | 'document' | 'photo' | 'video' | 'audio' | 'forensic';
  description: string;
  collectedDate: string;
  collectedBy: string;
  location: string;
  tags: string;
  confidential: boolean;
  forensicResults: string;
}

const evidenceTypes = [
  { label: 'Physical Evidence', value: 'physical', icon: Eye, color: '#DC2626', description: 'Tangible items, objects, weapons' },
  { label: 'Photo Evidence', value: 'photo', icon: Camera, color: '#3B82F6', description: 'Digital or physical photographs' },
  { label: 'Video Evidence', value: 'video', icon: Video, color: '#8B5CF6', description: 'Video recordings, surveillance footage' },
  { label: 'Audio Evidence', value: 'audio', icon: Mic, color: '#F59E0B', description: 'Audio recordings, voice messages' },
  { label: 'Digital Evidence', value: 'digital', icon: Shield, color: '#6366F1', description: 'Computer files, digital data' },
  { label: 'Document Evidence', value: 'document', icon: FileText, color: '#10B981', description: 'Papers, contracts, written materials' },
  { label: 'Forensic Evidence', value: 'forensic', icon: Shield, color: '#059669', description: 'DNA, fingerprints, lab samples' },
];

export default function NewEvidenceModal({
  visible,
  onClose,
  onSuccess,
  cases
}: NewEvidenceModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<EvidenceFormData>({
    caseId: '',
    caseNumber: '',
    type: 'physical',
    description: '',
    collectedDate: new Date().toISOString().split('T')[0],
    collectedBy: user ? `${user.firstName} ${user.lastName}` : '',
    location: '',
    tags: '',
    confidential: true,
    forensicResults: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCasePicker, setShowCasePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const updateFormData = (field: keyof EvidenceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectCase = (selectedCase: PoliceCase) => {
    setFormData(prev => ({
      ...prev,
      caseId: selectedCase.id,
      caseNumber: selectedCase.caseNumber,
      location: selectedCase.location // Auto-fill location from case
    }));
    setShowCasePicker(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.caseId) newErrors.caseId = 'Case selection is required';
    if (!formData.description.trim()) newErrors.description = 'Evidence description is required';
    if (!formData.collectedBy.trim()) newErrors.collectedBy = 'Collecting officer is required';
    if (!formData.location.trim()) newErrors.location = 'Collection location is required';

    if (formData.collectedDate && isNaN(Date.parse(formData.collectedDate))) {
      newErrors.collectedDate = 'Please enter a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

      // Create initial chain of custody entry
      const initialChainEntry: ChainOfCustodyEntry = {
        id: '1',
        officer: formData.collectedBy,
        action: 'collected',
        date: formData.collectedDate,
        time: currentTime,
        location: formData.location,
        notes: 'Initial evidence collection'
      };

      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newEvidence: Evidence = {
        id: Date.now().toString(),
        caseId: formData.caseId,
        caseNumber: formData.caseNumber,
        type: formData.type,
        description: formData.description,
        collectedDate: formData.collectedDate,
        collectedBy: formData.collectedBy,
        location: formData.location,
        chainOfCustody: [initialChainEntry],
        status: 'collected',
        tags: tagsArray,
        confidential: formData.confidential,
        forensicResults: formData.forensicResults || undefined,
      };

      onSuccess(newEvidence);
      Alert.alert(
        'Success',
        `Evidence has been added to case ${newEvidence.caseNumber} successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add evidence. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof EvidenceFormData,
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
    displayValue?: string,
    required: boolean = true
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} {required && '*'}</Text>
      <TouchableOpacity style={[styles.selectInput, errors[label.toLowerCase().replace(' ', '')] && styles.textInputError]} onPress={onPress}>
        <Text style={[styles.selectInputText, !displayValue && styles.placeholder]}>
          {displayValue || value || `Select ${label.toLowerCase()}`}
        </Text>
        <ChevronDown color="#6B7280" />
      </TouchableOpacity>
      {errors[label.toLowerCase().replace(' ', '')] && <Text style={styles.errorText}>{errors[label.toLowerCase().replace(' ', '')]}</Text>}
    </View>
  );

  const selectedEvidenceType = evidenceTypes.find(t => t.value === formData.type);
  const selectedCase = cases.find(c => c.id === formData.caseId);

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
          <Text style={styles.headerTitle}>Add Evidence</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Case Selection Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#1E40AF" size={24} />
              <Text style={styles.sectionTitle}>Case Information</Text>
            </View>

            {renderSelectField(
              'Associated Case',
              formData.caseNumber,
              () => setShowCasePicker(true),
              selectedCase ? `${selectedCase.caseNumber} - ${selectedCase.incidentType.replace('_', ' ').toUpperCase()}` : undefined
            )}
          </View>

          {/* Evidence Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Evidence Details</Text>
            </View>

            {renderSelectField(
              'Evidence Type',
              formData.type,
              () => setShowTypePicker(true),
              selectedEvidenceType ? selectedEvidenceType.label : undefined
            )}

            {renderTextInput('Description', 'description', 'Detailed description of the evidence item', {
              multiline: true,
              numberOfLines: 3
            })}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tags (comma-separated)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.tags}
                onChangeText={(text) => updateFormData('tags', text)}
                placeholder="e.g., weapon, DNA, fingerprint, clothing"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.helpText}>Separate multiple tags with commas</Text>
            </View>
          </View>

          {/* Collection Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Collection Information</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Collection Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {new Date(formData.collectedDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            {renderTextInput('Collected By', 'collectedBy', 'Officer name who collected the evidence')}
            {renderTextInput('Collection Location', 'location', 'Specific location where evidence was found')}
          </View>

          {/* Security & Additional Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock color="#EF4444" size={24} />
              <Text style={styles.sectionTitle}>Security & Additional Information</Text>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <Lock color="#EF4444" size={20} />
                  <Text style={styles.switchLabel}>Confidential Evidence</Text>
                </View>
                <Switch
                  value={formData.confidential}
                  onValueChange={(value) => updateFormData('confidential', value)}
                  trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  thumbColor={formData.confidential ? '#1E40AF' : '#9CA3AF'}
                />
              </View>
              <Text style={styles.helpText}>Mark as confidential for sensitive evidence</Text>
            </View>

            {(formData.type === 'forensic' || formData.type === 'digital') && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Forensic/Technical Results</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={formData.forensicResults}
                  onChangeText={(text) => updateFormData('forensicResults', text)}
                  placeholder="Enter any forensic analysis results or technical specifications"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
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
              {isSubmitting ? 'Adding Evidence...' : 'Add Evidence'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={new Date(formData.collectedDate)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateFormData('collectedDate', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={new Date(formData.collectedDate)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === 'set' && selectedDate) {
                updateFormData('collectedDate', selectedDate.toISOString().split('T')[0]);
              }
            }}
            onTouchCancel={() => setShowDatePicker(false)}
          />
        )}

        {/* Case Picker */}
        <Modal
          visible={showCasePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Case</Text>
                <TouchableOpacity onPress={() => setShowCasePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerContent}>
                {cases.map((caseItem) => (
                  <TouchableOpacity
                    key={caseItem.id}
                    style={styles.caseOption}
                    onPress={() => selectCase(caseItem)}
                  >
                    <View style={styles.caseOptionContent}>
                      <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
                      <Text style={styles.caseType}>{caseItem.incidentType.replace('_', ' ').toUpperCase()}</Text>
                      <Text style={styles.caseVictim}>Victim: {caseItem.victimName}</Text>
                      <Text style={styles.caseLocation}>Location: {caseItem.location}</Text>
                    </View>
                    <View style={[styles.priorityIndicator, { backgroundColor:
                      caseItem.priority === 'urgent' ? '#DC2626' :
                      caseItem.priority === 'high' ? '#EF4444' :
                      caseItem.priority === 'medium' ? '#F59E0B' : '#10B981'
                    }]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Evidence Type Picker */}
        <Modal
          visible={showTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Evidence Type</Text>
                <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {evidenceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeOption}
                    onPress={() => {
                      updateFormData('type', type.value as any);
                      setShowTypePicker(false);
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
    height: 80,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
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
    maxHeight: '70%',
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
  pickerContent: {
    paddingBottom: 34,
  },
  caseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  caseOptionContent: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  caseType: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  caseVictim: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 1,
  },
  caseLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  priorityIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginLeft: 12,
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