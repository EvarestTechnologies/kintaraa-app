import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  Heart,
  Target,
} from 'lucide-react-native';

interface CHWData {
  name: string;
  title: string;
  level: string;
  id: string;
  experience: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  certification: string;
  coverage: string;
  joinDate: string;
}

interface EditCHWProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentData: CHWData;
}

export default function EditCHWProfileModal({
  visible,
  onClose,
  onSuccess,
  currentData,
}: EditCHWProfileModalProps) {
  const [formData, setFormData] = useState<CHWData>({
    name: '',
    title: '',
    level: '',
    id: '',
    experience: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    certification: '',
    coverage: '',
    joinDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible && currentData) {
      setFormData(currentData);
      setErrors({});
    }
  }, [visible, currentData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.coverage.trim()) {
      newErrors.coverage = 'Coverage area is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors before saving.');
      return;
    }

    // Simulate save operation
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
  };

  const handleInputChange = (field: keyof CHWData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderInputField = (
    label: string,
    field: keyof CHWData,
    Icon: React.ComponentType<any>,
    placeholder: string,
    multiline: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, errors[field] && styles.inputError]}>
        <Icon color="#64748B" size={20} />
        <TextInput
          style={[styles.textInput, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#64748B" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit CHW Profile</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save color="#3B82F6" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {renderInputField(
              'Full Name',
              'name',
              User,
              'Enter your full name'
            )}

            {renderInputField(
              'Job Title',
              'title',
              Award,
              'Enter your job title'
            )}

            {renderInputField(
              'CHW Level',
              'level',
              Target,
              'Enter your CHW level'
            )}

            {renderInputField(
              'Specialization',
              'specialization',
              Heart,
              'Enter your area of specialization'
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            {renderInputField(
              'Phone Number',
              'phone',
              Phone,
              '+256 700 000 000'
            )}

            {renderInputField(
              'Email Address',
              'email',
              Mail,
              'your.email@example.com'
            )}

            {renderInputField(
              'Coverage Area',
              'coverage',
              MapPin,
              'Describe your coverage area',
              true
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Details</Text>

            {renderInputField(
              'CHW ID',
              'id',
              Award,
              'CHW-2024-XXX'
            )}

            {renderInputField(
              'Experience',
              'experience',
              Calendar,
              'e.g., 5 years'
            )}

            {renderInputField(
              'Certification',
              'certification',
              Award,
              'Enter your certification details'
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  saveButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
    padding: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});