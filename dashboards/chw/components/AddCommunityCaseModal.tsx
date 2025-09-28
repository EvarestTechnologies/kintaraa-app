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
  MapPin,
  Calendar,
  AlertTriangle,
  Save,
  ChevronDown,
  Home,
  Users,
  Thermometer,
  BookOpen,
  Target,
  Plus,
  Minus,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { CommunityCase } from '../index';

interface AddCommunityCaseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newCase: CommunityCase) => void;
}

interface CaseFormData {
  caseType: 'outbreak' | 'household' | 'program' | 'referral' | 'environmental' | 'emergency';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  area: string;
  affectedHouseholds: string;
  affectedIndividuals: string;
  assignedCHW: string;
  collaboratingCHWs: string[];
  tags: string;
  resources: string[];
  estimatedResolution: string;
  followUpDate: string;
  households: string[];
}

const caseTypes = [
  { label: 'Disease Outbreak', value: 'outbreak', icon: Thermometer, color: '#DC2626', description: 'Disease outbreaks requiring immediate intervention' },
  { label: 'Household Case', value: 'household', icon: Home, color: '#059669', description: 'Individual household health needs' },
  { label: 'Community Program', value: 'program', icon: BookOpen, color: '#3B82F6', description: 'Health education and prevention programs' },
  { label: 'Referral Follow-up', value: 'referral', icon: Target, color: '#7C3AED', description: 'Following up on medical referrals' },
  { label: 'Environmental Issue', value: 'environmental', icon: Shield, color: '#F59E0B', description: 'Environmental health concerns' },
  { label: 'Emergency Response', value: 'emergency', icon: AlertTriangle, color: '#EF4444', description: 'Emergency health situations' },
];

const priorityOptions = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Urgent', value: 'urgent', color: '#DC2626' },
];

const commonResources = [
  'bed-nets', 'rapid-tests', 'medication', 'nutritional-supplements',
  'vaccines', 'water-testing-kits', 'purification-tablets', 'counseling-materials',
  'educational-materials', 'first-aid-supplies', 'thermometers', 'blood-pressure-monitors'
];

export default function AddCommunityCaseModal({
  visible,
  onClose,
  onSuccess
}: AddCommunityCaseModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<CaseFormData>({
    caseType: 'household',
    title: '',
    description: '',
    priority: 'medium',
    area: '',
    affectedHouseholds: '1',
    affectedIndividuals: '1',
    assignedCHW: user ? `${user.firstName} ${user.lastName}` : '',
    collaboratingCHWs: [],
    tags: '',
    resources: [],
    estimatedResolution: '',
    followUpDate: '',
    households: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'resolution' | 'followup' | null>(null);
  const [showCaseTypePicker, setShowCaseTypePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showResourcesPicker, setShowResourcesPicker] = useState(false);
  const [newCHW, setNewCHW] = useState('');
  const [newHousehold, setNewHousehold] = useState('');

  const updateFormData = (field: keyof CaseFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addCollaboratingCHW = () => {
    if (newCHW.trim() && !formData.collaboratingCHWs.includes(newCHW.trim())) {
      setFormData(prev => ({
        ...prev,
        collaboratingCHWs: [...prev.collaboratingCHWs, newCHW.trim()]
      }));
      setNewCHW('');
    }
  };

  const removeCollaboratingCHW = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaboratingCHWs: prev.collaboratingCHWs.filter((_, i) => i !== index)
    }));
  };

  const addHousehold = () => {
    if (newHousehold.trim() && !formData.households.includes(newHousehold.trim())) {
      setFormData(prev => ({
        ...prev,
        households: [...prev.households, newHousehold.trim()]
      }));
      setNewHousehold('');
    }
  };

  const removeHousehold = (index: number) => {
    setFormData(prev => ({
      ...prev,
      households: prev.households.filter((_, i) => i !== index)
    }));
  };

  const toggleResource = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter(r => r !== resource)
        : [...prev.resources, resource]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Case title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.area.trim()) newErrors.area = 'Location area is required';
    if (!formData.assignedCHW.trim()) newErrors.assignedCHW = 'Assigned CHW is required';

    const households = parseInt(formData.affectedHouseholds);
    const individuals = parseInt(formData.affectedIndividuals);

    if (isNaN(households) || households < 1) {
      newErrors.affectedHouseholds = 'Must be at least 1 household';
    }
    if (isNaN(individuals) || individuals < 1) {
      newErrors.affectedIndividuals = 'Must be at least 1 individual';
    }

    if (formData.estimatedResolution && isNaN(Date.parse(formData.estimatedResolution))) {
      newErrors.estimatedResolution = 'Please enter a valid date';
    }
    if (formData.followUpDate && isNaN(Date.parse(formData.followUpDate))) {
      newErrors.followUpDate = 'Please enter a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCaseNumber = (): string => {
    const typePrefix = {
      outbreak: 'OUT',
      household: 'HH',
      program: 'PGM',
      referral: 'REF',
      environmental: 'ENV',
      emergency: 'EMG'
    }[formData.caseType];

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CC-${typePrefix}-${year}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const newCase: CommunityCase = {
        id: Date.now().toString(),
        caseNumber: generateCaseNumber(),
        caseType: formData.caseType,
        title: formData.title,
        description: formData.description,
        status: 'active',
        priority: formData.priority,
        affectedHouseholds: parseInt(formData.affectedHouseholds),
        affectedIndividuals: parseInt(formData.affectedIndividuals),
        location: {
          area: formData.area,
          households: formData.households,
        },
        reportedDate: now.split('T')[0],
        lastUpdate: now.split('T')[0],
        assignedCHW: formData.assignedCHW,
        collaboratingCHWs: formData.collaboratingCHWs.length > 0 ? formData.collaboratingCHWs : undefined,
        interventions: [],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        resources: formData.resources,
        followUpDate: formData.followUpDate || undefined,
        estimatedResolution: formData.estimatedResolution || undefined,
      };

      onSuccess(newCase);
      Alert.alert(
        'Success',
        `Community case ${newCase.caseNumber} has been created successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch {
      Alert.alert(
        'Error',
        'Failed to create community case. Please try again.'
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

  const selectedCaseType = caseTypes.find(t => t.value === formData.caseType);

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
          <Text style={styles.headerTitle}>New Community Case</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Case Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#1E40AF" size={24} />
              <Text style={styles.sectionTitle}>Case Information</Text>
            </View>

            {renderSelectField(
              'Case Type',
              formData.caseType,
              () => setShowCaseTypePicker(true),
              selectedCaseType?.label
            )}

            {renderSelectField(
              'Priority',
              formData.priority,
              () => setShowPriorityPicker(true),
              priorityOptions.find(p => p.value === formData.priority)?.label
            )}

            {renderTextInput('Case Title', 'title', 'Brief descriptive title for the case')}

            {renderTextInput('Description', 'description', 'Detailed description of the community health issue', {
              multiline: true,
              numberOfLines: 4
            })}
          </View>

          {/* Location & Impact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Location & Impact</Text>
            </View>

            {renderTextInput('Area/Location', 'area', 'Zone, Division, or specific community area')}

            {renderTextInput('Affected Households', 'affectedHouseholds', 'Number of households affected', {
              keyboardType: 'numeric'
            })}

            {renderTextInput('Affected Individuals', 'affectedIndividuals', 'Total number of individuals affected', {
              keyboardType: 'numeric'
            })}

            {/* Household IDs */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Household IDs (Optional)</Text>
              <View style={styles.listInputContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newHousehold}
                  onChangeText={setNewHousehold}
                  placeholder="e.g., HH-001, HH-002"
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addHousehold}
                />
                <TouchableOpacity
                  style={[styles.addButton, !newHousehold.trim() && styles.addButtonDisabled]}
                  onPress={addHousehold}
                  disabled={!newHousehold.trim()}
                >
                  <Plus color={newHousehold.trim() ? "#FFFFFF" : "#9CA3AF"} size={20} />
                </TouchableOpacity>
              </View>
              {formData.households.map((household, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{household}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeHousehold(index)}
                  >
                    <Minus color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Team & Resources Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Team & Resources</Text>
            </View>

            {renderTextInput('Assigned CHW', 'assignedCHW', 'Primary CHW responsible for this case')}

            {/* Collaborating CHWs */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Collaborating CHWs (Optional)</Text>
              <View style={styles.listInputContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newCHW}
                  onChangeText={setNewCHW}
                  placeholder="Add collaborating CHW name"
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addCollaboratingCHW}
                />
                <TouchableOpacity
                  style={[styles.addButton, !newCHW.trim() && styles.addButtonDisabled]}
                  onPress={addCollaboratingCHW}
                  disabled={!newCHW.trim()}
                >
                  <Plus color={newCHW.trim() ? "#FFFFFF" : "#9CA3AF"} size={20} />
                </TouchableOpacity>
              </View>
              {formData.collaboratingCHWs.map((chw, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{chw}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCollaboratingCHW(index)}
                  >
                    <Minus color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Resources */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Required Resources</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowResourcesPicker(!showResourcesPicker)}
              >
                <Text style={styles.selectInputText}>
                  {formData.resources.length > 0
                    ? `${formData.resources.length} resources selected`
                    : 'Select resources needed'}
                </Text>
                <ChevronDown color="#6B7280" />
              </TouchableOpacity>

              {showResourcesPicker && (
                <View style={styles.resourcesContainer}>
                  {commonResources.map((resource) => (
                    <TouchableOpacity
                      key={resource}
                      style={[
                        styles.resourceChip,
                        formData.resources.includes(resource) && styles.resourceChipSelected
                      ]}
                      onPress={() => toggleResource(resource)}
                    >
                      <Text style={[
                        styles.resourceChipText,
                        formData.resources.includes(resource) && styles.resourceChipTextSelected
                      ]}>
                        {resource.replace('-', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Timeline & Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar color="#F59E0B" size={24} />
              <Text style={styles.sectionTitle}>Timeline & Details</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Follow-up Date (Optional)</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker('followup')}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {formData.followUpDate
                    ? new Date(formData.followUpDate).toLocaleDateString()
                    : 'Select follow-up date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Estimated Resolution (Optional)</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker('resolution')}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {formData.estimatedResolution
                    ? new Date(formData.estimatedResolution).toLocaleDateString()
                    : 'Select estimated resolution date'}
                </Text>
              </TouchableOpacity>
            </View>

            {renderTextInput('Tags', 'tags', 'Add tags separated by commas (e.g., malaria, prevention, urgent)')}
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
              {isSubmitting ? 'Creating Case...' : 'Create Community Case'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(null);
              if (selectedDate) {
                const dateString = selectedDate.toISOString().split('T')[0];
                if (showDatePicker === 'followup') {
                  updateFormData('followUpDate', dateString);
                } else if (showDatePicker === 'resolution') {
                  updateFormData('estimatedResolution', dateString);
                }
              }
            }}
          />
        )}

        {/* Case Type Picker */}
        <Modal
          visible={showCaseTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Case Type</Text>
                <TouchableOpacity onPress={() => setShowCaseTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {caseTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeOption}
                    onPress={() => {
                      updateFormData('caseType', type.value);
                      setShowCaseTypePicker(false);
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
                    updateFormData('priority', priority.value);
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
  resourcesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  resourceChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resourceChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  resourceChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  resourceChipTextSelected: {
    color: '#FFFFFF',
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
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
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