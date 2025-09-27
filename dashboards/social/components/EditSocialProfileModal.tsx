import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Save, User, Phone, Mail, MapPin, GraduationCap, Award, Building } from 'lucide-react-native';

interface SocialProviderData {
  name: string;
  title: string;
  specialization: string;
  license: string;
  experience: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  serviceAreas: string[];
  emergencyHours: string;
}

interface EditSocialProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentData: SocialProviderData;
}

export default function EditSocialProfileModal({
  visible,
  onClose,
  onSuccess,
  currentData
}: EditSocialProfileModalProps) {
  const [formData, setFormData] = useState({
    name: currentData.name,
    title: currentData.title,
    specialization: currentData.specialization,
    license: currentData.license,
    experience: currentData.experience,
    phone: currentData.phone,
    email: currentData.email,
    address: currentData.address,
    workingHours: currentData.workingHours,
    serviceAreas: currentData.serviceAreas.join(', '),
    emergencyHours: currentData.emergencyHours,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.license.trim()) {
      newErrors.license = 'License number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Profile updated successfully!',
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
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: onClose
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professional Title</Text>
              <View style={styles.inputContainer}>
                <Award size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(value) => updateFormData('title', value)}
                  placeholder="e.g., Licensed Social Worker"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialization</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.specialization}
                  onChangeText={(value) => updateFormData('specialization', value)}
                  placeholder="e.g., Community Support & Case Management"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="your.email@kintaraa.org"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Office Address</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  placeholder="Enter your office address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number</Text>
              <View style={styles.inputContainer}>
                <GraduationCap size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.license && styles.inputError]}
                  value={formData.license}
                  onChangeText={(value) => updateFormData('license', value)}
                  placeholder="e.g., LSW-2024-001"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.license && <Text style={styles.errorText}>{errors.license}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years of Experience</Text>
              <View style={styles.inputContainer}>
                <Award size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.experience}
                  onChangeText={(value) => updateFormData('experience', value)}
                  placeholder="e.g., 8 years"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Areas</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.serviceAreas}
                  onChangeText={(value) => updateFormData('serviceAreas', value)}
                  placeholder="e.g., Housing Assistance, Food Security, Emergency Support"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
              </View>
              <Text style={styles.helpText}>Separate multiple areas with commas</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Working Hours</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.workingHours}
                  onChangeText={(value) => updateFormData('workingHours', value)}
                  placeholder="e.g., Monday - Friday, 8:00 AM - 5:00 PM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Support Hours</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.emergencyHours}
                  onChangeText={(value) => updateFormData('emergencyHours', value)}
                  placeholder="e.g., 24/7 Crisis Response Available"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    backgroundColor: '#6A2CB0',
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
});