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
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Target,
  Clock,
  ChevronDown,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { ServiceAssessment } from '../index';

interface AddAssessmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newAssessment: ServiceAssessment) => void;
}

interface AssessmentFormData {
  clientName: string;
  assessmentType: ServiceAssessment['assessmentType'];
  assessmentDate: string;
  strengths: string;
  needs: string;
  risks: string;
  resources: string;
  recommendations: string;
  goals: string;
  interventions: string;
  timeline: string;
  reviewDate: string;
}

export default function AddAssessmentModal({
  visible,
  onClose,
  onSuccess,
}: AddAssessmentModalProps) {
  const { user } = useAuth();
  const [showTypePicker, setShowTypePicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<AssessmentFormData>({
    clientName: '',
    assessmentType: 'initial',
    assessmentDate: new Date().toISOString().split('T')[0],
    strengths: '',
    needs: '',
    risks: '',
    resources: '',
    recommendations: '',
    goals: '',
    interventions: '',
    timeline: '3 months',
    reviewDate: '',
  });

  const assessmentTypes: { value: ServiceAssessment['assessmentType']; label: string }[] = [
    { value: 'initial', label: 'Initial Assessment' },
    { value: 'follow_up', label: 'Follow-up Assessment' },
    { value: 'crisis', label: 'Crisis Assessment' },
    { value: 'closure', label: 'Closure Assessment' },
    { value: 'risk_assessment', label: 'Risk Assessment' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.assessmentDate) {
      newErrors.assessmentDate = 'Assessment date is required';
    }

    if (!formData.needs.trim()) {
      newErrors.needs = 'Identified needs are required';
    }

    if (!formData.goals.trim()) {
      newErrors.goals = 'Service goals are required';
    }

    if (!formData.interventions.trim()) {
      newErrors.interventions = 'Planned interventions are required';
    }

    if (!formData.reviewDate) {
      newErrors.reviewDate = 'Review date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newAssessment: ServiceAssessment = {
      id: `assessment-${Date.now()}`,
      clientId: `client-${Date.now()}`,
      clientName: formData.clientName,
      assessmentType: formData.assessmentType,
      assessmentDate: formData.assessmentDate,
      assessor: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Current User',
      findings: {
        strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
        needs: formData.needs.split(',').map(s => s.trim()).filter(Boolean),
        risks: formData.risks.split(',').map(s => s.trim()).filter(Boolean),
        resources: formData.resources.split(',').map(s => s.trim()).filter(Boolean),
      },
      recommendations: formData.recommendations.split(',').map(s => s.trim()).filter(Boolean),
      servicePlan: {
        goals: formData.goals.split(',').map(s => s.trim()).filter(Boolean),
        interventions: formData.interventions.split(',').map(s => s.trim()).filter(Boolean),
        timeline: formData.timeline,
        reviewDate: formData.reviewDate,
      },
      status: 'draft',
      caseId: `case-${Date.now()}`,
    };

    Alert.alert(
      'Assessment Created',
      'The new assessment has been created successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            onSuccess(newAssessment);
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
      assessmentType: 'initial',
      assessmentDate: new Date().toISOString().split('T')[0],
      strengths: '',
      needs: '',
      risks: '',
      resources: '',
      recommendations: '',
      goals: '',
      interventions: '',
      timeline: '3 months',
      reviewDate: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard this assessment?',
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

  const updateFormData = (field: keyof AssessmentFormData, value: string) => {
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
          <Text style={styles.headerTitle}>New Assessment</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assessment Type *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowTypePicker(!showTypePicker)}
              >
                <FileText size={20} color="#6B7280" />
                <Text style={styles.pickerText}>
                  {assessmentTypes.find(t => t.value === formData.assessmentType)?.label}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showTypePicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {assessmentTypes.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.pickerOption,
                          formData.assessmentType === type.value && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          updateFormData('assessmentType', type.value);
                          setShowTypePicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          formData.assessmentType === type.value && styles.pickerOptionTextSelected
                        ]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assessment Date *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.assessmentDate && styles.inputError]}
                  value={formData.assessmentDate}
                  onChangeText={(value) => updateFormData('assessmentDate', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.assessmentDate && <Text style={styles.errorText}>{errors.assessmentDate}</Text>}
            </View>
          </View>

          {/* Assessment Findings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assessment Findings</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Strengths</Text>
              <TextInput
                style={styles.textArea}
                value={formData.strengths}
                onChangeText={(value) => updateFormData('strengths', value)}
                placeholder="List client strengths (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Identified Needs *</Text>
              <TextInput
                style={[styles.textArea, errors.needs && styles.inputError]}
                value={formData.needs}
                onChangeText={(value) => updateFormData('needs', value)}
                placeholder="List identified needs (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.needs && <Text style={styles.errorText}>{errors.needs}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Risk Factors</Text>
              <TextInput
                style={styles.textArea}
                value={formData.risks}
                onChangeText={(value) => updateFormData('risks', value)}
                placeholder="List risk factors (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available Resources</Text>
              <TextInput
                style={styles.textArea}
                value={formData.resources}
                onChangeText={(value) => updateFormData('resources', value)}
                placeholder="List available resources (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Service Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Plan</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Goals *</Text>
              <TextInput
                style={[styles.textArea, errors.goals && styles.inputError]}
                value={formData.goals}
                onChangeText={(value) => updateFormData('goals', value)}
                placeholder="List service goals (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.goals && <Text style={styles.errorText}>{errors.goals}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Planned Interventions *</Text>
              <TextInput
                style={[styles.textArea, errors.interventions && styles.inputError]}
                value={formData.interventions}
                onChangeText={(value) => updateFormData('interventions', value)}
                placeholder="List planned interventions (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.interventions && <Text style={styles.errorText}>{errors.interventions}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Timeline</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.timeline}
                  onChangeText={(value) => updateFormData('timeline', value)}
                  placeholder="e.g., 3 months, 6 months"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Review Date *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.reviewDate && styles.inputError]}
                  value={formData.reviewDate}
                  onChangeText={(value) => updateFormData('reviewDate', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.reviewDate && <Text style={styles.errorText}>{errors.reviewDate}</Text>}
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assessment Recommendations</Text>
              <TextInput
                style={styles.textArea}
                value={formData.recommendations}
                onChangeText={(value) => updateFormData('recommendations', value)}
                placeholder="List recommendations (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
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
});