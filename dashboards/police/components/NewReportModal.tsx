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
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  FileText,
  Shield,
  AlertTriangle,
  Eye,
  Car,
  User,
  Clock,
  Calendar,
  MapPin,
  Users,
  Save,
  ChevronDown,
  Plus,
  Minus,
  Paperclip,
  Upload,
  Image,
  FileIcon,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { PoliceReport, PoliceCase } from '../index';

interface AttachmentItem {
  id: string;
  name: string;
  type: 'file' | 'text';
  uri?: string;
  size?: number;
  mimeType?: string;
}

interface NewReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newReport: PoliceReport) => void;
  cases: PoliceCase[];
}

interface ReportFormData {
  caseId: string;
  type: 'incident' | 'arrest' | 'investigation' | 'patrol' | 'traffic' | 'evidence' | 'witness';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  involvedParties: string[];
  location: string;
  incidentTime: string;
  supervisorReview: boolean;
  attachments: AttachmentItem[];
  createdBy: string;
}

const reportTypes = [
  { label: 'Incident Report', value: 'incident', icon: AlertTriangle, color: '#DC2626', description: 'Initial incident documentation' },
  { label: 'Investigation Report', value: 'investigation', icon: Eye, color: '#3B82F6', description: 'Detailed investigation findings' },
  { label: 'Arrest Report', value: 'arrest', icon: Shield, color: '#EF4444', description: 'Arrest documentation and details' },
  { label: 'Patrol Report', value: 'patrol', icon: Car, color: '#10B981', description: 'Routine patrol activities' },
  { label: 'Traffic Report', value: 'traffic', icon: Car, color: '#6366F1', description: 'Traffic incidents and violations' },
  { label: 'Evidence Report', value: 'evidence', icon: FileText, color: '#8B5CF6', description: 'Evidence collection and analysis' },
  { label: 'Witness Statement', value: 'witness', icon: User, color: '#059669', description: 'Witness testimonies and statements' },
];

const priorityOptions = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Urgent', value: 'urgent', color: '#DC2626' },
];

export default function NewReportModal({
  visible,
  onClose,
  onSuccess,
  cases
}: NewReportModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ReportFormData>({
    caseId: '',
    type: 'incident',
    title: '',
    description: '',
    priority: 'medium',
    involvedParties: [''],
    location: '',
    incidentTime: new Date().toISOString(),
    supervisorReview: false,
    attachments: [],
    createdBy: user ? `${user.firstName} ${user.lastName}` : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCasePicker, setShowCasePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [newAttachment, setNewAttachment] = useState('');

  const updateFormData = (field: keyof ReportFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectCase = (selectedCase: PoliceCase) => {
    setFormData(prev => ({
      ...prev,
      caseId: selectedCase.id,
      location: selectedCase.location, // Auto-fill location from case
      involvedParties: [selectedCase.victimName, selectedCase.suspectName || ''].filter(party => party.length > 0)
    }));
    setShowCasePicker(false);
  };

  const addInvolvedParty = () => {
    setFormData(prev => ({
      ...prev,
      involvedParties: [...prev.involvedParties, '']
    }));
  };

  const removeInvolvedParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      involvedParties: prev.involvedParties.filter((_, i) => i !== index)
    }));
  };

  const updateInvolvedParty = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      involvedParties: prev.involvedParties.map((party, i) => i === index ? value : party)
    }));
  };

  const addTextAttachment = () => {
    if (newAttachment.trim()) {
      const textAttachment: AttachmentItem = {
        id: Date.now().toString(),
        name: newAttachment.trim(),
        type: 'text'
      };
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, textAttachment]
      }));
      setNewAttachment('');
    }
  };

  const pickFile = async () => {
    try {
      // Request permission for media library access
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileAttachment: AttachmentItem = {
          id: Date.now().toString(),
          name: asset.fileName || `file_${Date.now()}`,
          type: 'file',
          uri: asset.uri,
          size: asset.fileSize,
          mimeType: asset.type
        };

        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, fileAttachment]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.caseId && formData.type !== 'patrol') {
      newErrors.caseId = 'Case selection is required (except for patrol reports)';
    }
    if (!formData.title.trim()) newErrors.title = 'Report title is required';
    if (!formData.description.trim()) newErrors.description = 'Report description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Report author is required';

    if (formData.incidentTime && isNaN(Date.parse(formData.incidentTime))) {
      newErrors.incidentTime = 'Please enter a valid date and time';
    }

    // Validate involved parties (at least one non-empty)
    const validParties = formData.involvedParties.filter(party => party.trim().length > 0);
    if (validParties.length === 0 && formData.type !== 'patrol') {
      newErrors.involvedParties = 'At least one involved party is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateReportNumber = (): string => {
    const typePrefix = formData.type === 'incident' ? 'INC' :
                      formData.type === 'investigation' ? 'INV' :
                      formData.type === 'arrest' ? 'ARR' :
                      formData.type === 'patrol' ? 'PAT' :
                      formData.type === 'traffic' ? 'TRA' :
                      formData.type === 'evidence' ? 'EVD' : 'WIT';

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${typePrefix}-${year}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const validParties = formData.involvedParties.filter(party => party.trim().length > 0);

      const newReport: PoliceReport = {
        id: Date.now().toString(),
        caseId: formData.caseId,
        reportNumber: generateReportNumber(),
        type: formData.type,
        title: formData.title,
        description: formData.description,
        createdDate: now.split('T')[0],
        createdBy: formData.createdBy,
        status: 'draft',
        priority: formData.priority,
        involvedParties: validParties,
        location: formData.location,
        incidentTime: formData.incidentTime,
        supervisorReview: formData.supervisorReview,
        attachments: formData.attachments.length > 0 ? formData.attachments.map(att =>
          att.type === 'file' ? `${att.name} (${att.uri})` : att.name
        ) : undefined,
      };

      onSuccess(newReport);
      Alert.alert(
        'Success',
        `Report ${newReport.reportNumber} has been created successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof ReportFormData,
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

  const selectedReportType = reportTypes.find(t => t.value === formData.type);
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
          <Text style={styles.headerTitle}>New Report</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Report Type & Case Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Report Information</Text>
            </View>

            {renderSelectField(
              'Report Type',
              formData.type,
              () => setShowTypePicker(true),
              selectedReportType ? selectedReportType.label : undefined
            )}

            {formData.type !== 'patrol' && renderSelectField(
              'Associated Case',
              formData.caseId,
              () => setShowCasePicker(true),
              selectedCase ? `${selectedCase.caseNumber} - ${selectedCase.incidentType.replace('_', ' ').toUpperCase()}` : undefined,
              false
            )}

            {renderSelectField(
              'Priority',
              formData.priority,
              () => setShowPriorityPicker(true),
              priorityOptions.find(p => p.value === formData.priority)?.label
            )}
          </View>

          {/* Report Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText color="#3B82F6" size={24} />
              <Text style={styles.sectionTitle}>Report Details</Text>
            </View>

            {renderTextInput('Report Title', 'title', 'Brief descriptive title for the report')}

            {renderTextInput('Description', 'description', 'Detailed description of the incident/activity', {
              multiline: true,
              numberOfLines: 4
            })}

            {renderTextInput('Created By', 'createdBy', 'Officer creating this report')}
          </View>

          {/* Location & Time Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Location & Time</Text>
            </View>

            {renderTextInput('Location', 'location', 'Specific location where incident occurred')}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Incident Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {new Date(formData.incidentTime).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Incident Time</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Calendar color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {new Date(formData.incidentTime).toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Involved Parties Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users color="#F59E0B" size={24} />
              <Text style={styles.sectionTitle}>Involved Parties</Text>
            </View>

            {formData.involvedParties.map((party, index) => (
              <View key={index} style={styles.partyContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={party}
                  onChangeText={(text) => updateInvolvedParty(index, text)}
                  placeholder={`Person ${index + 1} (name, role, etc.)`}
                  placeholderTextColor="#9CA3AF"
                />
                {formData.involvedParties.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeInvolvedParty(index)}
                  >
                    <Minus color="#EF4444" size={20} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addInvolvedParty}>
              <Plus color="#10B981" size={20} />
              <Text style={styles.addButtonText}>Add Another Person</Text>
            </TouchableOpacity>

            {errors.involvedParties && <Text style={styles.errorText}>{errors.involvedParties}</Text>}
          </View>

          {/* Attachments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Paperclip color="#6366F1" size={24} />
              <Text style={styles.sectionTitle}>Attachments</Text>
            </View>

            {/* File Upload Options */}
            <View style={styles.uploadOptionsContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
                <Upload color="#6366F1" size={20} />
                <Text style={styles.uploadButtonText}>Upload File</Text>
              </TouchableOpacity>

              <View style={styles.textAttachmentContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newAttachment}
                  onChangeText={setNewAttachment}
                  placeholder="Add text reference"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={[styles.addAttachmentButton, !newAttachment.trim() && styles.disabledButton]}
                  onPress={addTextAttachment}
                  disabled={!newAttachment.trim()}
                >
                  <Plus color={newAttachment.trim() ? "#FFFFFF" : "#9CA3AF"} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Attachments List */}
            {formData.attachments.map((attachment) => (
              <View key={attachment.id} style={styles.attachmentItem}>
                {attachment.type === 'file' ? (
                  <FileIcon color="#6366F1" size={16} />
                ) : (
                  <Paperclip color="#6366F1" size={16} />
                )}
                <View style={styles.attachmentInfo}>
                  <Text style={styles.attachmentText}>{attachment.name}</Text>
                  {attachment.type === 'file' && attachment.size && (
                    <Text style={styles.attachmentMeta}>
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.removeAttachmentButton}
                  onPress={() => removeAttachment(attachment.id)}
                >
                  <X color="#EF4444" size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Review Settings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Review Settings</Text>
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <Eye color="#059669" size={20} />
                <Text style={styles.switchLabel}>Request Supervisor Review</Text>
              </View>
              <Switch
                value={formData.supervisorReview}
                onValueChange={(value) => updateFormData('supervisorReview', value)}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={formData.supervisorReview ? '#10B981' : '#9CA3AF'}
              />
            </View>
            <Text style={styles.helpText}>Enable if this report requires supervisor approval</Text>
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
              {isSubmitting ? 'Creating Report...' : 'Create Report'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={new Date(formData.incidentTime)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const currentTime = new Date(formData.incidentTime);
                const newDateTime = new Date(selectedDate);
                newDateTime.setHours(currentTime.getHours());
                newDateTime.setMinutes(currentTime.getMinutes());
                updateFormData('incidentTime', newDateTime.toISOString());
              }
            }}
          />
        )}

        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={new Date(formData.incidentTime)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === 'set' && selectedDate) {
                const currentTime = new Date(formData.incidentTime);
                const newDateTime = new Date(selectedDate);
                newDateTime.setHours(currentTime.getHours());
                newDateTime.setMinutes(currentTime.getMinutes());
                updateFormData('incidentTime', newDateTime.toISOString());
              }
            }}
            onTouchCancel={() => setShowDatePicker(false)}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={new Date(formData.incidentTime)}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const currentDate = new Date(formData.incidentTime);
                const newDateTime = new Date(currentDate);
                newDateTime.setHours(selectedTime.getHours());
                newDateTime.setMinutes(selectedTime.getMinutes());
                updateFormData('incidentTime', newDateTime.toISOString());
              }
            }}
          />
        )}

        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={new Date(formData.incidentTime)}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (event.type === 'set' && selectedTime) {
                const currentDate = new Date(formData.incidentTime);
                const newDateTime = new Date(currentDate);
                newDateTime.setHours(selectedTime.getHours());
                newDateTime.setMinutes(selectedTime.getMinutes());
                updateFormData('incidentTime', newDateTime.toISOString());
              }
            }}
            onTouchCancel={() => setShowTimePicker(false)}
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

        {/* Report Type Picker */}
        <Modal
          visible={showTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Report Type</Text>
                <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {reportTypes.map((type) => {
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
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  addButtonText: {
    color: '#10B981',
    fontWeight: '500',
  },
  attachmentInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  uploadOptionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  textAttachmentContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addAttachmentButton: {
    padding: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  attachmentMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  removeAttachmentButton: {
    padding: 4,
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
    backgroundColor: '#10B981',
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
    color: '#10B981',
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