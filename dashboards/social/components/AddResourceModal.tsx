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
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  DollarSign,
} from 'lucide-react-native';
import type { CommunityResource } from '../index';

interface AddResourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newResource: CommunityResource) => void;
}

interface ResourceFormData {
  name: string;
  category: CommunityResource['category'];
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  eligibility: string;
  services: string;
  capacity: string;
  contactPerson: string;
  notes: string;
}

export default function AddResourceModal({
  visible,
  onClose,
  onSuccess,
}: AddResourceModalProps) {
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ResourceFormData>({
    name: '',
    category: 'housing',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    hours: '',
    eligibility: '',
    services: '',
    capacity: '',
    contactPerson: '',
    notes: '',
  });

  const categoryOptions: { value: CommunityResource['category']; label: string; icon: string }[] = [
    { value: 'housing', label: 'Housing', icon: '🏠' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'employment', label: 'Employment', icon: '💼' },
    { value: 'legal', label: 'Legal', icon: '⚖️' },
    { value: 'childcare', label: 'Childcare', icon: '👶' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
    { value: 'financial', label: 'Financial', icon: '💰' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.services.trim()) {
      newErrors.services = 'Services offered are required';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    const capacity = parseInt(formData.capacity);
    const newResource: CommunityResource = {
      id: `resource-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      address: formData.address,
      phone: formData.phone,
      email: formData.email || undefined,
      website: formData.website || undefined,
      hours: formData.hours || 'Contact for hours',
      eligibility: formData.eligibility.split(',').map(s => s.trim()).filter(Boolean),
      services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
      capacity,
      currentAvailability: capacity, // New resources start with full availability
      waitingList: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      isActive: true,
      contactPerson: formData.contactPerson,
      notes: formData.notes || undefined,
    };

    Alert.alert(
      'Resource Added',
      'The new community resource has been added successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            onSuccess(newResource);
            resetForm();
            onClose();
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'housing',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      hours: '',
      eligibility: '',
      services: '',
      capacity: '',
      contactPerson: '',
      notes: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard this resource?',
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

  const updateFormData = (field: keyof ResourceFormData, value: string) => {
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
          <Text style={styles.headerTitle}>Add Resource</Text>
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
              <Text style={styles.label}>Resource Name *</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="Enter resource name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Building size={20} color="#6B7280" />
                <Text style={styles.pickerText}>
                  {categoryOptions.find(c => c.value === formData.category)?.icon} {categoryOptions.find(c => c.value === formData.category)?.label}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {categoryOptions.map((category) => (
                      <TouchableOpacity
                        key={category.value}
                        style={[
                          styles.pickerOption,
                          formData.category === category.value && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          updateFormData('category', category.value);
                          setShowCategoryPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          formData.category === category.value && styles.pickerOptionTextSelected
                        ]}>
                          {category.icon} {category.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="Describe the resource and what it offers..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.address && styles.inputError]}
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  placeholder="Enter full address"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
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
              <Text style={styles.label}>Email (Optional)</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="contact@resource.org"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website (Optional)</Text>
              <View style={styles.inputContainer}>
                <Globe size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.website}
                  onChangeText={(value) => updateFormData('website', value)}
                  placeholder="https://www.resource.org"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person *</Text>
              <View style={styles.inputContainer}>
                <Users size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.contactPerson && styles.inputError]}
                  value={formData.contactPerson}
                  onChangeText={(value) => updateFormData('contactPerson', value)}
                  placeholder="Primary contact person"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.contactPerson && <Text style={styles.errorText}>{errors.contactPerson}</Text>}
            </View>
          </View>

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Operating Hours</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.hours}
                  onChangeText={(value) => updateFormData('hours', value)}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Services Offered *</Text>
              <TextInput
                style={[styles.textArea, errors.services && styles.inputError]}
                value={formData.services}
                onChangeText={(value) => updateFormData('services', value)}
                placeholder="List services offered (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              {errors.services && <Text style={styles.errorText}>{errors.services}</Text>}
              <Text style={styles.helpText}>Separate multiple services with commas</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity *</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={[styles.input, errors.capacity && styles.inputError]}
                  value={formData.capacity}
                  onChangeText={(value) => updateFormData('capacity', value)}
                  placeholder="Maximum capacity (number)"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Eligibility Requirements</Text>
              <TextInput
                style={styles.textArea}
                value={formData.eligibility}
                onChangeText={(value) => updateFormData('eligibility', value)}
                placeholder="List eligibility requirements (comma separated)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helpText}>Separate multiple requirements with commas</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={styles.textArea}
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                placeholder="Any additional information..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
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
});