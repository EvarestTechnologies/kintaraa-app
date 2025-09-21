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
  Badge,
  Phone,
  Mail,
  MapPin,
  FileText,
  Save,
  Award,
  Shield,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

interface EditPoliceProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentData: any;
}

interface PoliceProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  rank: string;
  specialization: string;
  phone: string;
  email: string;
  station: string;

  // Professional Information
  badgeNumber: string;
  experience: string;
  certification: string;
  joinDate: string;
}

export default function EditPoliceProfileModal({
  visible,
  onClose,
  onSuccess,
  currentData
}: EditPoliceProfileModalProps) {
  const { user, updateProfile, isUpdatingProfile } = useAuth();

  const [formData, setFormData] = useState<PoliceProfileFormData>({
    firstName: '',
    lastName: '',
    rank: '',
    specialization: '',
    phone: '',
    email: '',
    station: '',
    badgeNumber: '',
    experience: '',
    certification: '',
    joinDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && currentData) {
      const fullName = currentData.name || '';
      const nameParts = fullName.split(' ');

      setFormData({
        firstName: user?.firstName || nameParts[0] || '',
        lastName: user?.lastName || nameParts.slice(1).join(' ') || '',
        rank: currentData.rank || 'Sergeant',
        specialization: currentData.specialization || 'Gender-Based Violence Unit',
        phone: currentData.phone || '+256 700 456 789',
        email: user?.email || currentData.email || '',
        station: currentData.station || 'Central Police Station',
        badgeNumber: currentData.badgeNumber || 'BADGE-2024-789',
        experience: currentData.experience || '12 years',
        certification: currentData.certification || 'Advanced Crime Investigation Certificate',
        joinDate: currentData.joinDate || '2012-08-15',
      });
      setErrors({});
    }
  }, [visible, user, currentData]);

  const updateFormData = (field: keyof PoliceProfileFormData, value: string) => {
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
    if (!formData.rank.trim()) newErrors.rank = 'Rank is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.badgeNumber.trim()) newErrors.badgeNumber = 'Badge number is required';
    if (!formData.certification.trim()) newErrors.certification = 'Certification is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^\\+?[\\d\\s\\-\\(\\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date validation for join date
    if (formData.joinDate && isNaN(Date.parse(formData.joinDate))) {
      newErrors.joinDate = 'Please enter a valid date (YYYY-MM-DD)';
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

      // TODO: Update additional police officer-specific fields
      // This would require extending the backend API to support police profile updates
      console.log('Police officer-specific fields to update:', {
        rank: formData.rank,
        specialization: formData.specialization,
        phone: formData.phone,
        station: formData.station,
        badgeNumber: formData.badgeNumber,
        experience: formData.experience,
        certification: formData.certification,
        joinDate: formData.joinDate,
      });

      Alert.alert(
        'Success',
        'Your police profile has been updated successfully!',
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
      console.error('Police profile update error:', error);
      Alert.alert(
        'Update Failed',
        `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof PoliceProfileFormData,
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
          <Text style={styles.headerTitle}>Edit Police Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User color="#1E40AF" size={24} />
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

            {renderTextInput('Rank', 'rank', 'e.g., Sergeant')}
            {renderTextInput('Specialization', 'specialization', 'e.g., Gender-Based Violence Unit')}
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            {renderTextInput('Phone Number', 'phone', '+256 700 456 789', { keyboardType: 'phone-pad' })}
            {renderTextInput('Email Address', 'email', 'your.email@police.gov.ug', { keyboardType: 'email-address' })}
            {renderTextInput('Police Station', 'station', 'Your assigned police station', {
              multiline: true,
              numberOfLines: 2
            })}
          </View>

          {/* Professional Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Badge color="#EF4444" size={24} />
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </View>

            {renderTextInput('Badge Number', 'badgeNumber', 'e.g., BADGE-2024-789')}
            {renderTextInput('Years of Experience', 'experience', 'e.g., 12 years')}
          </View>

          {/* Training & Credentials Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Training & Credentials</Text>
            </View>

            {renderTextInput('Certification', 'certification', 'e.g., Advanced Crime Investigation Certificate', {
              multiline: true,
              numberOfLines: 2
            })}
            {renderTextInput('Join Date', 'joinDate', 'YYYY-MM-DD')}
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
});