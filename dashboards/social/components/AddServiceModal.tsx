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
import {
  X,
  Save,
  User,
  DollarSign,
  Building,
  ChevronDown,
  AlertTriangle,
  Home,
} from 'lucide-react-native';
import type { SocialService } from '../index';

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newService: SocialService) => void;
}

interface ServiceFormData {
  clientName: string;
  serviceType: SocialService['serviceType'];
  priority: SocialService['priority'];
  description: string;
  provider: string;
  cost: string;
  fundingSource: string;
  eligibilityCriteria: string;
  documentsRequired: string;
}

export default function AddServiceModal({
  visible,
  onClose,
  onSuccess,
}: AddServiceModalProps) {
  const [showServiceTypePicker, setShowServiceTypePicker] = useState<boolean>(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ServiceFormData>({
    clientName: '',
    serviceType: 'housing',
    priority: 'medium',
    description: '',
    provider: '',
    cost: '',
    fundingSource: '',
    eligibilityCriteria: '',
    documentsRequired: '',
  });

  const serviceTypes: { value: SocialService['serviceType']; label: string; icon: string }[] = [
    { value: 'housing', label: 'Housing Assistance', icon: '🏠' },
    { value: 'food_assistance', label: 'Food Assistance', icon: '🍽️' },
    { value: 'financial_aid', label: 'Financial Aid', icon: '💰' },
    { value: 'childcare', label: 'Childcare', icon: '👶' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
    { value: 'job_training', label: 'Job Training', icon: '💼' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'healthcare_referral', label: 'Healthcare Referral', icon: '🏥' },
    { value: 'legal_aid', label: 'Legal Aid', icon: '⚖️' },
    { value: 'counseling_referral', label: 'Counseling Referral', icon: '🧠' },
    { value: 'emergency_assistance', label: 'Emergency Assistance', icon: '🚨' },
  ];

  const priorityOptions: { value: SocialService['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low Priority', color: '#10B981' },
    { value: 'medium', label: 'Medium Priority', color: '#F59E0B' },
    { value: 'high', label: 'High Priority', color: '#F97316' },
    { value: 'urgent', label: 'Urgent', color: '#EF4444' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    }

    if (!formData.provider.trim()) {
      newErrors.provider = 'Service provider is required';
    }

    if (!formData.eligibilityCriteria.trim()) {
      newErrors.eligibilityCriteria = 'Eligibility criteria are required';
    }

    if (!formData.documentsRequired.trim()) {
      newErrors.documentsRequired = 'Required documents must be specified';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newService: SocialService = {
      id: `service-${Date.now()}`,
      clientId: `client-${Date.now()}`,
      clientName: formData.clientName,
      serviceType: formData.serviceType,
      status: 'requested',
      priority: formData.priority,
      requestDate: new Date().toISOString().split('T')[0],
      description: formData.description,
      eligibilityCriteria: formData.eligibilityCriteria.split(',').map(s => s.trim()).filter(Boolean),
      documentsRequired: formData.documentsRequired.split(',').map(s => s.trim()).filter(Boolean),
      documentsSubmitted: [],
      provider: formData.provider,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      fundingSource: formData.fundingSource || undefined,
      caseId: `case-${Date.now()}`,
    };

    Alert.alert(
      'Service Request Created',
      'The new service request has been created successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            onSuccess(newService);
            resetForm();
            onClose();
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      serviceType: 'housing',
      priority: 'medium',
      description: '',
      provider: '',
      cost: '',
      fundingSource: '',
      eligibilityCriteria: '',
      documentsRequired: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard this service request?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetForm();
            onClose();
          }
        }
      ]
    );
  };

  const updateFormData = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Service Request</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Client Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Name *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.clientName && styles.inputError]}
                  value={formData.clientName}
                  onChangeText={(value) => updateFormData('clientName', value)}
                  placeholder="Enter client's full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
            </View>
          </View>

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Type *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowServiceTypePicker(!showServiceTypePicker)}
              >
                <Home size={20} color="#6B7280" />
                <Text style={styles.pickerText}>
                  {serviceTypes.find(t => t.value === formData.serviceType)?.icon} {serviceTypes.find(t => t.value === formData.serviceType)?.label}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showServiceTypePicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {serviceTypes.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.pickerOption,
                          formData.serviceType === type.value && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          updateFormData('serviceType', type.value);
                          setShowServiceTypePicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          formData.serviceType === type.value && styles.pickerOptionTextSelected
                        ]}>
                          {type.icon} {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority Level *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowPriorityPicker(!showPriorityPicker)}
              >
                <AlertTriangle size={20} color="#6B7280" />
                <Text style={styles.pickerText}>
                  {priorityOptions.find(p => p.value === formData.priority)?.label}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showPriorityPicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {priorityOptions.map((priority) => (
                      <TouchableOpacity
                        key={priority.value}
                        style={[
                          styles.pickerOption,
                          formData.priority === priority.value && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          updateFormData('priority', priority.value);
                          setShowPriorityPicker(false);
                        }}
                      >
                        <View style={styles.priorityOption}>
                          <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
                          <Text style={[
                            styles.pickerOptionText,
                            formData.priority === priority.value && styles.pickerOptionTextSelected
                          ]}>
                            {priority.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Description *</Text>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="Describe the service needed..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>

          {/* Provider Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provider Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Provider *</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.provider && styles.inputError]}
                  value={formData.provider}
                  onChangeText={(value) => updateFormData('provider', value)}
                  placeholder="Enter provider name/organization"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.provider && <Text style={styles.errorText}>{errors.provider}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost (Optional)</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.cost}
                  onChangeText={(value) => updateFormData('cost', value)}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Funding Source (Optional)</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.fundingSource}
                  onChangeText={(value) => updateFormData('fundingSource', value)}
                  placeholder="e.g., Government Grant, Private Foundation"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Eligibility Criteria *</Text>
              <TextInput
                style={[styles.textArea, errors.eligibilityCriteria && styles.inputError]}
                value={formData.eligibilityCriteria}
                onChangeText={(value) => updateFormData('eligibilityCriteria', value)}
                placeholder="List eligibility requirements (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.eligibilityCriteria && <Text style={styles.errorText}>{errors.eligibilityCriteria}</Text>}
              <Text style={styles.helpText}>Separate multiple criteria with commas</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Required Documents *</Text>
              <TextInput
                style={[styles.textArea, errors.documentsRequired && styles.inputError]}
                value={formData.documentsRequired}
                onChangeText={(value) => updateFormData('documentsRequired', value)}
                placeholder="List required documents (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.documentsRequired && <Text style={styles.errorText}>{errors.documentsRequired}</Text>}
              <Text style={styles.helpText}>Separate multiple documents with commas</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  pickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionSelected: {
    backgroundColor: '#EBF4FF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  pickerOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});