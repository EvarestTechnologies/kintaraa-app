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
  Brain,
  GraduationCap,
  Award,
  Clock,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

interface EditCounselingProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  title: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  // Professional Information
  license: string;
  experience: string;
  workingHours: string;
  sessionRate: string;
  emergencyHours: string;
  bio: string;
}

export default function EditCounselingProfileModal({
  visible,
  onClose,
  onSuccess,
}: EditCounselingProfileModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    title: '',
    specialization: '',
    phone: '',
    email: '',
    address: '',
    license: '',
    experience: '',
    workingHours: '',
    sessionRate: '',
    emergencyHours: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      // Initialize with current user data or mock data
      setFormData({
        firstName: user?.firstName || 'Sarah',
        lastName: user?.lastName || 'Johnson',
        title: 'Licensed Clinical Social Worker',
        specialization: 'Trauma & PTSD Therapy',
        phone: '+1 (555) 123-4567',
        email: user?.email || 'dr.sarah.johnson@kintaraa.org',
        address: '789 Wellness Center, Mental Health District',
        license: 'LCSW-2024-001',
        experience: '12 years',
        workingHours: 'Monday - Friday, 9:00 AM - 6:00 PM',
        sessionRate: '$150/hour',
        emergencyHours: '24/7 Crisis Support Available',
        bio: 'Dedicated mental health professional specializing in trauma recovery and PTSD treatment. Committed to providing compassionate, evidence-based care to support survivors on their healing journey.',
      });
    }
  }, [visible, user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ProfileFormData)[] = [
      'firstName',
      'lastName',
      'title',
      'specialization',
      'phone',
      'email',
      'license',
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert(
          'Validation Error',
          `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          [{ text: 'OK' }]
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.', [{ text: 'OK' }]);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Updating counseling profile:', formData);

      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onClose },
      ]
    );
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    multiline = false,
    keyboardType = 'default',
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: any;
    multiline?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelContainer}>
        <Icon color="#6B7280" size={16} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            disabled={isLoading}
          >
            <Save color="#059669" size={20} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <InputField
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              placeholder="Enter your first name"
              icon={User}
            />

            <InputField
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              placeholder="Enter your last name"
              icon={User}
            />

            <InputField
              label="Professional Title"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="e.g., Licensed Clinical Social Worker"
              icon={Briefcase}
            />

            <InputField
              label="Specialization"
              value={formData.specialization}
              onChangeText={(text) => handleInputChange('specialization', text)}
              placeholder="e.g., Trauma & PTSD Therapy"
              icon={Brain}
            />
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <InputField
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter your phone number"
              icon={Phone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Enter your email address"
              icon={Mail}
              keyboardType="email-address"
            />

            <InputField
              label="Address"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Enter your work address"
              icon={MapPin}
            />
          </View>

          {/* Professional Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <InputField
              label="License Number"
              value={formData.license}
              onChangeText={(text) => handleInputChange('license', text)}
              placeholder="e.g., LCSW-2024-001"
              icon={GraduationCap}
            />

            <InputField
              label="Years of Experience"
              value={formData.experience}
              onChangeText={(text) => handleInputChange('experience', text)}
              placeholder="e.g., 12 years"
              icon={Award}
            />

            <InputField
              label="Working Hours"
              value={formData.workingHours}
              onChangeText={(text) => handleInputChange('workingHours', text)}
              placeholder="e.g., Monday - Friday, 9:00 AM - 6:00 PM"
              icon={Clock}
            />

            <InputField
              label="Session Rate"
              value={formData.sessionRate}
              onChangeText={(text) => handleInputChange('sessionRate', text)}
              placeholder="e.g., $150/hour"
              icon={FileText}
            />

            <InputField
              label="Emergency Hours"
              value={formData.emergencyHours}
              onChangeText={(text) => handleInputChange('emergencyHours', text)}
              placeholder="e.g., 24/7 Crisis Support Available"
              icon={Clock}
            />

            <InputField
              label="Professional Bio"
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder="Brief description of your background and approach"
              icon={FileText}
              multiline={true}
            />
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#059669',
    marginLeft: 4,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#374151',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});