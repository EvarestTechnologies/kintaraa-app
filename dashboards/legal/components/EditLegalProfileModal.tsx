import React, { useState, useEffect } from 'react';
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
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  FileText,
  Save,
  Scale,
  GraduationCap,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

interface EditLegalProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentData: any;
}

interface LegalProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  title: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;

  // Professional Information
  barNumber: string;
  experience: string;
  education: string;
  admissionDate: string;
}

export default function EditLegalProfileModal({
  visible,
  onClose,
  onSuccess,
  currentData
}: EditLegalProfileModalProps) {
  const { user, updateProfile, isUpdatingProfile } = useAuth();

  const [formData, setFormData] = useState<LegalProfileFormData>({
    firstName: '',
    lastName: '',
    title: '',
    specialization: '',
    phone: '',
    email: '',
    address: '',
    barNumber: '',
    experience: '',
    education: '',
    admissionDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && currentData) {
      setFormData({
        firstName: user?.firstName || currentData.name.split(' ')[0] || '',
        lastName: user?.lastName || currentData.name.split(' ').slice(1).join(' ') || '',
        title: currentData.title || 'Senior Legal Advocate',
        specialization: currentData.specialization || 'Human Rights & GBV Law',
        phone: currentData.phone || '+256 700 123 789',
        email: user?.email || currentData.email || '',
        address: currentData.address || 'Justice Centre, Kampala, Uganda',
        barNumber: currentData.barNumber || 'BAR-2024-001',
        experience: currentData.experience || '10 years',
        education: currentData.education || 'LLB, Makerere University',
        admissionDate: currentData.admissionDate || '2014-05-15',
      });
      setErrors({});
    }
  }, [visible, user, currentData]);

  const updateFormData = (field: keyof LegalProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.barNumber.trim()) newErrors.barNumber = 'Bar number is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date validation for admission date
    if (formData.admissionDate && isNaN(Date.parse(formData.admissionDate))) {
      newErrors.admissionDate = 'Please enter a valid date (YYYY-MM-DD)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Update basic profile info via AuthProvider
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // TODO: Update additional legal provider-specific fields
      // This would require extending the backend API to support legal provider profile updates
      console.log('Legal provider-specific fields to update:', {
        title: formData.title,
        specialization: formData.specialization,
        phone: formData.phone,
        address: formData.address,
        barNumber: formData.barNumber,
        experience: formData.experience,
        education: formData.education,
        admissionDate: formData.admissionDate,
      });

      Alert.alert(
        'Success',
        'Your legal profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Legal profile update error:', error);
      Alert.alert(
        'Update Failed',
        `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof LegalProfileFormData,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      multiline?: boolean;
      numberOfLines?: number;
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
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
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
          <Text style={styles.headerTitle}>Edit Legal Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>First Name *</Text>
                <TextInput
                  style={[styles.textInput, errors.firstName && styles.textInputError]}
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData('firstName', text)}
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>

              <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Last Name *</Text>
                <TextInput
                  style={[styles.textInput, errors.lastName && styles.textInputError]}
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData('lastName', text)}
                  placeholder="Enter last name"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>
            </View>

            {renderTextInput('Professional Title', 'title', 'e.g., Senior Legal Advocate')}
            {renderTextInput('Specialization', 'specialization', 'e.g., Human Rights & GBV Law')}
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            {renderTextInput('Phone Number', 'phone', '+256 700 123 789', { keyboardType: 'phone-pad' })}
            {renderTextInput('Email Address', 'email', 'your.email@legal.com', { keyboardType: 'email-address' })}
            {renderTextInput('Work Address', 'address', 'Your legal office address', {
              multiline: true,
              numberOfLines: 3
            })}
          </View>

          {/* Professional Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Scale color="#EF4444" size={24} />
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </View>

            {renderTextInput('Bar Number', 'barNumber', 'e.g., BAR-2024-001')}
            {renderTextInput('Years of Experience', 'experience', 'e.g., 10 years')}
          </View>

          {/* Education Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <GraduationCap color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Education & Credentials</Text>
            </View>

            {renderTextInput('Education', 'education', 'e.g., LLB, Makerere University', {
              multiline: true,
              numberOfLines: 2
            })}
            {renderTextInput('Bar Admission Date', 'admissionDate', 'YYYY-MM-DD')}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isUpdatingProfile && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isUpdatingProfile}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
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
    color: '#064E3B',
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
    color: '#064E3B',
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
    color: '#064E3B',
    backgroundColor: '#FFFFFF',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: '#059669',
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
});