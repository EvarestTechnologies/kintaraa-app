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
import {
  X,
  Brain,
  FileText,
  Phone,
  Users,
  Heart,
  BookOpen,
  Stethoscope,
  Scale,
  Pill,
  Globe,
  Mail,
  MapPin,
  Tag,
  Save,
  ChevronDown,
  Shield,
  GraduationCap,
  AlertCircle,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { CounselingResource } from '../index';

interface AddResourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newResource: CounselingResource) => void;
}

interface ResourceFormData {
  title: string;
  description: string;
  category: CounselingResource['category'];
  type: CounselingResource['type'];
  url: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  cost: CounselingResource['cost'];
  downloadUrl: string;
  fileName: string;
  tags: string;
  contactPerson: string;
  languages: string;
  accessibility: string;
  featured: boolean;
  isActive: boolean;
}

const resourceCategories = [
  { label: 'Mental Health Tools', value: 'mental_health', icon: Brain, color: '#8B5CF6', description: 'Assessment tools and therapeutic resources' },
  { label: 'Assessments & Forms', value: 'assessments', icon: FileText, color: '#3B82F6', description: 'Clinical forms and evaluation tools' },
  { label: 'Crisis Intervention', value: 'crisis', icon: AlertCircle, color: '#EF4444', description: 'Emergency support and crisis resources' },
  { label: 'Group Therapy', value: 'group_therapy', icon: Users, color: '#10B981', description: 'Group therapy materials and curricula' },
  { label: 'Referral Network', value: 'referrals', icon: Stethoscope, color: '#F59E0B', description: 'Professional referral contacts' },
  { label: 'Educational Materials', value: 'education', icon: GraduationCap, color: '#06B6D4', description: 'Patient education and learning resources' },
  { label: 'Community Support', value: 'community', icon: Heart, color: '#EC4899', description: 'Community services and support programs' },
  { label: 'Professional Development', value: 'professional', icon: Shield, color: '#84CC16', description: 'Training and professional resources' },
  { label: 'Medication Resources', value: 'medication', icon: Pill, color: '#F97316', description: 'Medication guides and pharmacy resources' },
  { label: 'Legal & Ethics', value: 'legal', icon: Scale, color: '#6366F1', description: 'Legal compliance and ethical guidelines' },
];

const resourceTypes = [
  { label: 'Form', value: 'form', icon: FileText, description: 'Downloadable forms and templates' },
  { label: 'Guide', value: 'guide', icon: BookOpen, description: 'Instructional guides and manuals' },
  { label: 'Contact', value: 'contact', icon: Phone, description: 'Professional contact information' },
  { label: 'Website', value: 'website', icon: Globe, description: 'Online resources and websites' },
  { label: 'Document', value: 'document', icon: FileText, description: 'Reference documents and materials' },
  { label: 'Assessment', value: 'assessment', icon: FileText, description: 'Clinical assessment tools' },
  { label: 'Hotline', value: 'hotline', icon: Phone, description: 'Crisis and support phone lines' },
  { label: 'Video', value: 'video', icon: Globe, description: 'Video resources and training' },
  { label: 'Article', value: 'article', icon: BookOpen, description: 'Articles and written resources' },
];

const costOptions = [
  { label: 'Free', value: 'free', color: '#10B981' },
  { label: 'Low Cost', value: 'low_cost', color: '#F59E0B' },
  { label: 'Insurance', value: 'insurance', color: '#3B82F6' },
  { label: 'Paid', value: 'paid', color: '#EF4444' },
];

export default function AddResourceModal({
  visible,
  onClose,
  onSuccess,
}: AddResourceModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    category: 'mental_health',
    type: 'guide',
    url: '',
    phone: '',
    email: '',
    address: '',
    hours: '',
    cost: 'free',
    downloadUrl: '',
    fileName: '',
    tags: '',
    contactPerson: '',
    languages: 'English',
    accessibility: '',
    featured: false,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCostPicker, setShowCostPicker] = useState(false);

  const updateFormData = (field: keyof ResourceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    // Validate based on resource type
    if (formData.type === 'contact' || formData.type === 'hotline') {
      if (!formData.phone.trim() && !formData.email.trim()) {
        newErrors.phone = 'Phone or email is required for contact resources';
      }
    }

    if (formData.type === 'website' && !formData.url.trim()) {
      newErrors.url = 'URL is required for website resources';
    }

    if (formData.type === 'form' || formData.type === 'document') {
      if (!formData.downloadUrl.trim()) {
        newErrors.downloadUrl = 'Download URL is required for downloadable resources';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newResource: CounselingResource = {
        id: `resource-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        url: formData.url.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
        hours: formData.hours.trim() || undefined,
        cost: formData.cost,
        downloadUrl: formData.downloadUrl.trim() || undefined,
        fileName: formData.fileName.trim() || undefined,
        isLocal: false,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        rating: undefined,
        featured: formData.featured,
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: formData.isActive,
        contactPerson: formData.contactPerson.trim() || undefined,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
        accessibility: formData.accessibility.split(',').map(acc => acc.trim()).filter(acc => acc.length > 0),
      };

      onSuccess(newResource);

      Alert.alert(
        'Success',
        'Resource has been added successfully!',
        [{ text: 'OK' }]
      );

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'mental_health',
        type: 'guide',
        url: '',
        phone: '',
        email: '',
        address: '',
        hours: '',
        cost: 'free',
        downloadUrl: '',
        fileName: '',
        tags: '',
        contactPerson: '',
        languages: 'English',
        accessibility: '',
        featured: false,
        isActive: true,
      });
      setErrors({});

    } catch (error) {
      console.error('Error adding resource:', error);
      Alert.alert(
        'Error',
        'Failed to add resource. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
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

  const selectedCategory = resourceCategories.find(cat => cat.value === formData.category);
  const selectedType = resourceTypes.find(type => type.value === formData.type);
  const selectedCost = costOptions.find(cost => cost.value === formData.cost);

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    multiline = false,
    keyboardType = 'default',
    error,
    required = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: any;
    multiline?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
    error?: string;
    required?: boolean;
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelContainer}>
        <Icon color="#6B7280" size={16} />
        <Text style={styles.inputLabel}>
          {label}{required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
          <Text style={styles.headerTitle}>Add New Resource</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.saveButton}
            disabled={isSubmitting}
          >
            <Save color="#059669" size={20} />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <InputField
              label="Resource Title"
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              placeholder="Enter resource title"
              icon={FileText}
              error={errors.title}
              required
            />

            <InputField
              label="Description"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              placeholder="Enter detailed description of the resource"
              icon={BookOpen}
              multiline
              error={errors.description}
              required
            />

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Tag color="#6B7280" size={16} />
                <Text style={styles.inputLabel}>Category *</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <View style={styles.pickerContent}>
                  {selectedCategory && (
                    <selectedCategory.icon color={selectedCategory.color} size={20} />
                  )}
                  <Text style={styles.pickerText}>{selectedCategory?.label}</Text>
                </View>
                <ChevronDown color="#6B7280" size={20} />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.pickerOptions}>
                  {resourceCategories.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateFormData('category', category.value);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <category.icon color={category.color} size={20} />
                      <View style={styles.pickerOptionText}>
                        <Text style={styles.pickerOptionLabel}>{category.label}</Text>
                        <Text style={styles.pickerOptionDescription}>{category.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Type Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <FileText color="#6B7280" size={16} />
                <Text style={styles.inputLabel}>Resource Type *</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowTypePicker(!showTypePicker)}
              >
                <View style={styles.pickerContent}>
                  {selectedType && (
                    <selectedType.icon color="#6B7280" size={20} />
                  )}
                  <Text style={styles.pickerText}>{selectedType?.label}</Text>
                </View>
                <ChevronDown color="#6B7280" size={20} />
              </TouchableOpacity>

              {showTypePicker && (
                <View style={styles.pickerOptions}>
                  {resourceTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateFormData('type', type.value);
                        setShowTypePicker(false);
                      }}
                    >
                      <type.icon color="#6B7280" size={20} />
                      <View style={styles.pickerOptionText}>
                        <Text style={styles.pickerOptionLabel}>{type.label}</Text>
                        <Text style={styles.pickerOptionDescription}>{type.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact & Access Information</Text>

            <InputField
              label="Website URL"
              value={formData.url}
              onChangeText={(text) => updateFormData('url', text)}
              placeholder="https://example.com"
              icon={Globe}
              keyboardType="url"
              error={errors.url}
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="(555) 123-4567"
              icon={Phone}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="contact@example.com"
              icon={Mail}
              keyboardType="email-address"
            />

            <InputField
              label="Physical Address"
              value={formData.address}
              onChangeText={(text) => updateFormData('address', text)}
              placeholder="123 Main St, City, State 12345"
              icon={MapPin}
            />

            <InputField
              label="Hours of Operation"
              value={formData.hours}
              onChangeText={(text) => updateFormData('hours', text)}
              placeholder="Monday-Friday 9AM-5PM"
              icon={Brain}
            />

            <InputField
              label="Contact Person"
              value={formData.contactPerson}
              onChangeText={(text) => updateFormData('contactPerson', text)}
              placeholder="Dr. John Smith, MD"
              icon={Users}
            />
          </View>

          {/* Resource Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resource Details</Text>

            <InputField
              label="Download URL"
              value={formData.downloadUrl}
              onChangeText={(text) => updateFormData('downloadUrl', text)}
              placeholder="https://example.com/document.pdf"
              icon={Globe}
              keyboardType="url"
              error={errors.downloadUrl}
            />

            <InputField
              label="File Name"
              value={formData.fileName}
              onChangeText={(text) => updateFormData('fileName', text)}
              placeholder="Assessment_Form.pdf"
              icon={FileText}
            />

            {/* Cost Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Tag color="#6B7280" size={16} />
                <Text style={styles.inputLabel}>Cost</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCostPicker(!showCostPicker)}
              >
                <View style={styles.pickerContent}>
                  <View style={[styles.costIndicator, { backgroundColor: selectedCost?.color + '20' }]}>
                    <Text style={[styles.costIndicatorText, { color: selectedCost?.color }]}>
                      {selectedCost?.label}
                    </Text>
                  </View>
                </View>
                <ChevronDown color="#6B7280" size={20} />
              </TouchableOpacity>

              {showCostPicker && (
                <View style={styles.pickerOptions}>
                  {costOptions.map((cost) => (
                    <TouchableOpacity
                      key={cost.value}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateFormData('cost', cost.value);
                        setShowCostPicker(false);
                      }}
                    >
                      <View style={[styles.costIndicator, { backgroundColor: cost.color + '20' }]}>
                        <Text style={[styles.costIndicatorText, { color: cost.color }]}>
                          {cost.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <InputField
              label="Tags"
              value={formData.tags}
              onChangeText={(text) => updateFormData('tags', text)}
              placeholder="assessment, depression, screening (comma separated)"
              icon={Tag}
            />

            <InputField
              label="Languages"
              value={formData.languages}
              onChangeText={(text) => updateFormData('languages', text)}
              placeholder="English, Spanish, French (comma separated)"
              icon={Globe}
            />

            <InputField
              label="Accessibility Features"
              value={formData.accessibility}
              onChangeText={(text) => updateFormData('accessibility', text)}
              placeholder="Wheelchair accessible, ASL interpreter (comma separated)"
              icon={Users}
            />
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <Heart color="#6B7280" size={16} />
                <View style={styles.switchText}>
                  <Text style={styles.switchLabel}>Featured Resource</Text>
                  <Text style={styles.switchDescription}>Display this resource prominently</Text>
                </View>
              </View>
              <Switch
                value={formData.featured}
                onValueChange={(value) => updateFormData('featured', value)}
                trackColor={{ false: '#D1D5DB', true: '#059669' }}
                thumbColor={formData.featured ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <AlertCircle color="#6B7280" size={16} />
                <View style={styles.switchText}>
                  <Text style={styles.switchLabel}>Active Resource</Text>
                  <Text style={styles.switchDescription}>Make this resource available to users</Text>
                </View>
              </View>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => updateFormData('isActive', value)}
                trackColor={{ false: '#D1D5DB', true: '#059669' }}
                thumbColor={formData.isActive ? '#FFFFFF' : '#F3F4F6'}
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
  requiredStar: {
    color: '#EF4444',
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
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  pickerButton: {
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
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  pickerOptions: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  pickerOptionLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#111827',
  },
  pickerOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  costIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  costIndicatorText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#111827',
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});