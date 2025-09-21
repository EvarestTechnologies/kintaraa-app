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
  Phone,
  Mail,
  Save,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

interface EditSurvivorProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentData: any;
}

interface SurvivorProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Privacy Settings
  isAnonymous: boolean;
  shareLocation: boolean;
  allowMessages: boolean;
}

export default function EditSurvivorProfileModal({
  visible,
  onClose,
  onSuccess,
  currentData
}: EditSurvivorProfileModalProps) {
  const { user, updateProfile, isUpdatingProfile } = useAuth();

  const [formData, setFormData] = useState<SurvivorProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isAnonymous: false,
    shareLocation: false,
    allowMessages: true,
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
        email: user?.email || currentData.email || '',
        phone: currentData.phone || '+256 700 000 000',
        isAnonymous: user?.isAnonymous || false,
        shareLocation: false,
        allowMessages: true,
      });
      setErrors({});
    }
  }, [visible, user, currentData]);

  const updateFormData = (field: keyof SurvivorProfileFormData, value: string | boolean) => {
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
    if (!formData.email.trim()) newErrors.email = 'Email is required';

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

      // TODO: Update additional survivor-specific fields
      // This would require extending the backend API to support survivor profile updates
      console.log('Survivor-specific fields to update:', {
        email: formData.email,
        phone: formData.phone,
        isAnonymous: formData.isAnonymous,
        shareLocation: formData.shareLocation,
        allowMessages: formData.allowMessages,
      });

      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
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
      console.error('Survivor profile update error:', error);
      Alert.alert(
        'Update Failed',
        `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    }
  };

  const renderTextInput = (
    label: string,
    field: keyof SurvivorProfileFormData,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      secureTextEntry?: boolean;
    }
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TextInput
        style={[
          styles.textInput,
          errors[field] && styles.textInputError
        ]}
        value={formData[field] as string}
        onChangeText={(text) => updateFormData(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={options?.keyboardType || 'default'}
        secureTextEntry={options?.secureTextEntry}
        autoCapitalize={options?.keyboardType === 'email-address' ? 'none' : 'words'}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderSwitchOption = (
    label: string,
    field: keyof SurvivorProfileFormData,
    description: string
  ) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchInfo}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Text style={styles.switchDescription}>{description}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.switchButton,
          (formData[field] as boolean) && styles.switchButtonActive
        ]}
        onPress={() => updateFormData(field, !(formData[field] as boolean))}
      >
        <View style={[
          styles.switchThumb,
          (formData[field] as boolean) && styles.switchThumbActive
        ]} />
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User color="#DC2626" size={24} />
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
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            {renderTextInput('Email Address', 'email', 'your.email@example.com', { keyboardType: 'email-address' })}
            {renderTextInput('Phone Number', 'phone', '+256 700 000 000', { keyboardType: 'phone-pad' })}
          </View>

          {/* Privacy Settings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
            </View>

            <View style={styles.privacyCard}>
              {renderSwitchOption(
                'Anonymous Mode',
                'isAnonymous',
                'Hide your identity in reports and communications'
              )}

              {renderSwitchOption(
                'Share Location',
                'shareLocation',
                'Allow sharing your location with emergency contacts'
              )}

              {renderSwitchOption(
                'Allow Messages',
                'allowMessages',
                'Allow service providers to send you messages'
              )}
            </View>

            <View style={styles.privacyNote}>
              <Shield color="#DC2626" size={16} />
              <Text style={styles.privacyNoteText}>
                Your privacy and safety are our top priority. These settings help protect your identity.
              </Text>
            </View>
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
    backgroundColor: '#FEF2F2',
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
    color: '#7F1D1D',
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
    color: '#7F1D1D',
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
    color: '#7F1D1D',
    backgroundColor: '#FFFFFF',
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
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  switchButton: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchButtonActive: {
    backgroundColor: '#DC2626',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 24 }],
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  privacyNoteText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
    flex: 1,
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
    backgroundColor: '#DC2626',
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