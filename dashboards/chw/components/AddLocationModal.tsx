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
  MapPin,
  Home,
  Building2,
  Users,
  Shield,
  Save,
  ChevronDown,
  Phone,
  User,
  Plus,
  Minus,
  Droplets,
  Zap,
  Car,
  UserCheck,
  Baby,
  Heart,
  Activity,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import type { CHWLocation } from '../index';

interface AddLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newLocation: CHWLocation) => void;
}

interface LocationFormData {
  name: string;
  type: CHWLocation['type'];
  category: string;
  address: string;
  zone: string;
  status: CHWLocation['status'];
  population: {
    total: string;
    adults: string;
    children: string;
    elderly: string;
    pregnant: string;
  };
  healthData: {
    vaccinationRate: string;
    chronicConditions: string[];
    riskFactors: string[];
  };
  facilities: {
    waterAccess: boolean;
    sanitationAccess: boolean;
    electricityAccess: boolean;
    roadAccess: 'good' | 'poor' | 'none';
  };
  contacts: {
    householdHead: string;
    phone: string;
    emergencyContact: string;
  };
  assignedCHW: string;
  collaboratingCHWs: string[];
  notes: string;
  tags: string;
}

const locationTypes = [
  { label: 'Household', value: 'household', icon: Home, color: '#059669', description: 'Residential homes and family units' },
  { label: 'Health Facility', value: 'health_facility', icon: Building2, color: '#DC2626', description: 'Clinics, hospitals, and health centers' },
  { label: 'Community Infrastructure', value: 'community_infrastructure', icon: Users, color: '#3B82F6', description: 'Schools, markets, community centers' },
  { label: 'Risk Area', value: 'risk_area', icon: Shield, color: '#EF4444', description: 'High-risk zones requiring monitoring' },
  { label: 'Service Point', value: 'service_point', icon: MapPin, color: '#8B5CF6', description: 'Mobile clinic stops, meeting points' },
];

const statusOptions = [
  { label: 'Active', value: 'active', color: '#10B981' },
  { label: 'Inactive', value: 'inactive', color: '#6B7280' },
  { label: 'Monitoring', value: 'monitoring', color: '#F59E0B' },
  { label: 'High Risk', value: 'high_risk', color: '#EF4444' },
];

const roadAccessOptions = [
  { label: 'Good Road Access', value: 'good' },
  { label: 'Poor Road Access', value: 'poor' },
  { label: 'No Road Access', value: 'none' },
];

const commonChronicConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
  'Mental Health', 'Tuberculosis', 'HIV/AIDS', 'Malaria', 'Malnutrition'
];

const commonRiskFactors = [
  'Poor sanitation', 'No clean water', 'Overcrowding', 'Poor nutrition',
  'Lack of vaccination', 'Substance abuse', 'Domestic violence', 'Poverty',
  'Limited healthcare access', 'Environmental hazards'
];

export default function AddLocationModal({
  visible,
  onClose,
  onSuccess
}: AddLocationModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    type: 'household',
    category: '',
    address: '',
    zone: '',
    status: 'active',
    population: {
      total: '',
      adults: '',
      children: '',
      elderly: '',
      pregnant: '',
    },
    healthData: {
      vaccinationRate: '',
      chronicConditions: [],
      riskFactors: [],
    },
    facilities: {
      waterAccess: false,
      sanitationAccess: false,
      electricityAccess: false,
      roadAccess: 'good',
    },
    contacts: {
      householdHead: '',
      phone: '',
      emergencyContact: '',
    },
    assignedCHW: user ? `${user.firstName} ${user.lastName}` : '',
    collaboratingCHWs: [],
    notes: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationTypePicker, setShowLocationTypePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showRoadAccessPicker, setShowRoadAccessPicker] = useState(false);
  const [showChronicConditionsPicker, setShowChronicConditionsPicker] = useState(false);
  const [showRiskFactorsPicker, setShowRiskFactorsPicker] = useState(false);
  const [newCHW, setNewCHW] = useState('');

  const updateFormData = (field: keyof LocationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateNestedFormData = (parentField: keyof LocationFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value }
    }));
  };

  const addCollaboratingCHW = () => {
    if (newCHW.trim() && !formData.collaboratingCHWs.includes(newCHW.trim())) {
      setFormData(prev => ({
        ...prev,
        collaboratingCHWs: [...prev.collaboratingCHWs, newCHW.trim()]
      }));
      setNewCHW('');
    }
  };

  const removeCollaboratingCHW = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaboratingCHWs: prev.collaboratingCHWs.filter((_, i) => i !== index)
    }));
  };

  const toggleChronicCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthData: {
        ...prev.healthData,
        chronicConditions: prev.healthData.chronicConditions.includes(condition)
          ? prev.healthData.chronicConditions.filter(c => c !== condition)
          : [...prev.healthData.chronicConditions, condition]
      }
    }));
  };

  const toggleRiskFactor = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      healthData: {
        ...prev.healthData,
        riskFactors: prev.healthData.riskFactors.includes(factor)
          ? prev.healthData.riskFactors.filter(f => f !== factor)
          : [...prev.healthData.riskFactors, factor]
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Location name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zone.trim()) newErrors.zone = 'Zone is required';
    if (!formData.assignedCHW.trim()) newErrors.assignedCHW = 'Assigned CHW is required';

    // Validate population numbers if provided
    if (formData.population.total && isNaN(parseInt(formData.population.total))) {
      newErrors.populationTotal = 'Total population must be a number';
    }
    if (formData.population.adults && isNaN(parseInt(formData.population.adults))) {
      newErrors.populationAdults = 'Adults count must be a number';
    }
    if (formData.population.children && isNaN(parseInt(formData.population.children))) {
      newErrors.populationChildren = 'Children count must be a number';
    }

    // Validate vaccination rate if provided
    if (formData.healthData.vaccinationRate) {
      const rate = parseFloat(formData.healthData.vaccinationRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        newErrors.vaccinationRate = 'Vaccination rate must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateLocationId = (): string => {
    const typePrefix = {
      household: 'HH',
      health_facility: 'HF',
      community_infrastructure: 'CI',
      risk_area: 'RA',
      service_point: 'SP'
    }[formData.type];

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${typePrefix}-${year}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const newLocation: CHWLocation = {
        id: generateLocationId(),
        name: formData.name,
        type: formData.type,
        category: formData.category || formData.type.replace('_', ' '),
        address: formData.address,
        zone: formData.zone,
        status: formData.status,
        population: formData.population.total ? {
          total: parseInt(formData.population.total) || 0,
          adults: parseInt(formData.population.adults) || 0,
          children: parseInt(formData.population.children) || 0,
          elderly: parseInt(formData.population.elderly) || 0,
          pregnant: parseInt(formData.population.pregnant) || 0,
        } : undefined,
        healthData: {
          vaccinationRate: parseFloat(formData.healthData.vaccinationRate) || 0,
          chronicConditions: formData.healthData.chronicConditions,
          riskFactors: formData.healthData.riskFactors,
        },
        facilities: formData.facilities,
        contacts: {
          householdHead: formData.contacts.householdHead || undefined,
          phone: formData.contacts.phone || undefined,
          emergencyContact: formData.contacts.emergencyContact || undefined,
        },
        assignedCHW: formData.assignedCHW,
        collaboratingCHWs: formData.collaboratingCHWs.length > 0 ? formData.collaboratingCHWs : undefined,
        notes: formData.notes || undefined,
        createdDate: now.split('T')[0],
        lastUpdated: now.split('T')[0],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      onSuccess(newLocation);
      Alert.alert(
        'Success',
        `Location "${newLocation.name}" has been added successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch {
      Alert.alert(
        'Error',
        'Failed to add location. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    options?: {
      multiline?: boolean;
      numberOfLines?: number;
      keyboardType?: 'default' | 'numeric' | 'phone-pad';
    },
    errorKey?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TextInput
        style={[
          styles.textInput,
          options?.multiline && styles.textInputMultiline,
          errorKey && errors[errorKey] && styles.textInputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        keyboardType={options?.keyboardType || 'default'}
      />
      {errorKey && errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    onPress: () => void,
    displayValue?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <TouchableOpacity style={styles.selectInput} onPress={onPress}>
        <Text style={[styles.selectInputText, !displayValue && styles.placeholder]}>
          {displayValue || value}
        </Text>
        <ChevronDown color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const renderSwitchField = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchLabelContainer}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description && <Text style={styles.switchDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#059669' }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
      />
    </View>
  );

  const renderMultiSelectField = (
    label: string,
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void,
    showPicker: boolean,
    setShowPicker: (show: boolean) => void
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectInput}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={styles.selectInputText}>
          {selectedItems.length > 0
            ? `${selectedItems.length} selected`
            : `Select ${label.toLowerCase()}`}
        </Text>
        <ChevronDown color="#6B7280" />
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.multiSelectContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.multiSelectItem,
                selectedItems.includes(item) && styles.multiSelectItemSelected
              ]}
              onPress={() => onToggle(item)}
            >
              <Text style={[
                styles.multiSelectText,
                selectedItems.includes(item) && styles.multiSelectTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedItems.length > 0 && (
        <View style={styles.selectedItemsContainer}>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const selectedLocationType = locationTypes.find(t => t.value === formData.type);

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
          <Text style={styles.headerTitle}>Add New Location</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            {renderTextInput(
              'Location Name',
              formData.name,
              (text) => updateFormData('name', text),
              'Enter location name (e.g., Wamala Household, Zone 7 Health Center)',
              undefined,
              'name'
            )}

            {renderSelectField(
              'Location Type',
              formData.type,
              () => setShowLocationTypePicker(true),
              selectedLocationType?.label
            )}

            {renderTextInput(
              'Category',
              formData.category,
              (text) => updateFormData('category', text),
              'Optional category (e.g., Primary Healthcare, Community Market)'
            )}

            {renderTextInput(
              'Address',
              formData.address,
              (text) => updateFormData('address', text),
              'Full address or description of location',
              undefined,
              'address'
            )}

            {renderTextInput(
              'Zone/Area',
              formData.zone,
              (text) => updateFormData('zone', text),
              'Zone or administrative area (e.g., Zone 7, Nakawa Division)',
              undefined,
              'zone'
            )}

            {renderSelectField(
              'Status',
              formData.status,
              () => setShowStatusPicker(true),
              statusOptions.find(s => s.value === formData.status)?.label
            )}
          </View>

          {/* Population Data Section */}
          {formData.type === 'household' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users color="#3B82F6" size={24} />
                <Text style={styles.sectionTitle}>Population Data</Text>
              </View>

              {renderTextInput(
                'Total Population',
                formData.population.total,
                (text) => updateNestedFormData('population', 'total', text),
                'Total number of people',
                { keyboardType: 'numeric' },
                'populationTotal'
              )}

              <View style={styles.populationRow}>
                {renderTextInput(
                  'Adults',
                  formData.population.adults,
                  (text) => updateNestedFormData('population', 'adults', text),
                  'Adults (18+)',
                  { keyboardType: 'numeric' },
                  'populationAdults'
                )}
                {renderTextInput(
                  'Children',
                  formData.population.children,
                  (text) => updateNestedFormData('population', 'children', text),
                  'Children (0-17)',
                  { keyboardType: 'numeric' },
                  'populationChildren'
                )}
              </View>

              <View style={styles.populationRow}>
                {renderTextInput(
                  'Elderly',
                  formData.population.elderly,
                  (text) => updateNestedFormData('population', 'elderly', text),
                  'Elderly (65+)',
                  { keyboardType: 'numeric' }
                )}
                {renderTextInput(
                  'Pregnant Women',
                  formData.population.pregnant,
                  (text) => updateNestedFormData('population', 'pregnant', text),
                  'Pregnant women',
                  { keyboardType: 'numeric' }
                )}
              </View>
            </View>
          )}

          {/* Health Data Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity color="#10B981" size={24} />
              <Text style={styles.sectionTitle}>Health Data</Text>
            </View>

            {renderTextInput(
              'Vaccination Rate (%)',
              formData.healthData.vaccinationRate,
              (text) => updateNestedFormData('healthData', 'vaccinationRate', text),
              'Vaccination coverage percentage (0-100)',
              { keyboardType: 'numeric' },
              'vaccinationRate'
            )}

            {renderMultiSelectField(
              'Chronic Conditions',
              commonChronicConditions,
              formData.healthData.chronicConditions,
              toggleChronicCondition,
              showChronicConditionsPicker,
              setShowChronicConditionsPicker
            )}

            {renderMultiSelectField(
              'Risk Factors',
              commonRiskFactors,
              formData.healthData.riskFactors,
              toggleRiskFactor,
              showRiskFactorsPicker,
              setShowRiskFactorsPicker
            )}
          </View>

          {/* Facilities & Infrastructure Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Building2 color="#F59E0B" size={24} />
              <Text style={styles.sectionTitle}>Facilities & Infrastructure</Text>
            </View>

            {renderSwitchField(
              'Water Access',
              formData.facilities.waterAccess,
              (value) => updateNestedFormData('facilities', 'waterAccess', value),
              'Clean water source available'
            )}

            {renderSwitchField(
              'Sanitation Access',
              formData.facilities.sanitationAccess,
              (value) => updateNestedFormData('facilities', 'sanitationAccess', value),
              'Proper sanitation facilities'
            )}

            {renderSwitchField(
              'Electricity Access',
              formData.facilities.electricityAccess,
              (value) => updateNestedFormData('facilities', 'electricityAccess', value),
              'Electrical power available'
            )}

            {renderSelectField(
              'Road Access',
              formData.facilities.roadAccess,
              () => setShowRoadAccessPicker(true),
              roadAccessOptions.find(r => r.value === formData.facilities.roadAccess)?.label
            )}
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone color="#8B5CF6" size={24} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            {renderTextInput(
              'Household Head/Contact Person',
              formData.contacts.householdHead,
              (text) => updateNestedFormData('contacts', 'householdHead', text),
              'Name of primary contact person'
            )}

            {renderTextInput(
              'Phone Number',
              formData.contacts.phone,
              (text) => updateNestedFormData('contacts', 'phone', text),
              'Primary phone number',
              { keyboardType: 'phone-pad' }
            )}

            {renderTextInput(
              'Emergency Contact',
              formData.contacts.emergencyContact,
              (text) => updateNestedFormData('contacts', 'emergencyContact', text),
              'Emergency contact person and number'
            )}
          </View>

          {/* Assignment & Collaboration Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserCheck color="#DC2626" size={24} />
              <Text style={styles.sectionTitle}>CHW Assignment</Text>
            </View>

            {renderTextInput(
              'Assigned CHW',
              formData.assignedCHW,
              (text) => updateFormData('assignedCHW', text),
              'Primary CHW responsible for this location',
              undefined,
              'assignedCHW'
            )}

            {/* Collaborating CHWs */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Collaborating CHWs (Optional)</Text>
              <View style={styles.listInputContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newCHW}
                  onChangeText={setNewCHW}
                  placeholder="Add collaborating CHW name"
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addCollaboratingCHW}
                />
                <TouchableOpacity
                  style={[styles.addButton, !newCHW.trim() && styles.addButtonDisabled]}
                  onPress={addCollaboratingCHW}
                  disabled={!newCHW.trim()}
                >
                  <Plus color={newCHW.trim() ? "#FFFFFF" : "#9CA3AF"} size={20} />
                </TouchableOpacity>
              </View>
              {formData.collaboratingCHWs.map((chw, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{chw}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCollaboratingCHW(index)}
                  >
                    <Minus color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {renderTextInput(
              'Tags',
              formData.tags,
              (text) => updateFormData('tags', text),
              'Add tags separated by commas (e.g., high-priority, malaria-prone, elderly-care)'
            )}

            {renderTextInput(
              'Notes',
              formData.notes,
              (text) => updateFormData('notes', text),
              'Additional notes or observations about this location',
              { multiline: true, numberOfLines: 3 }
            )}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Adding Location...' : 'Add Location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location Type Picker */}
        <Modal
          visible={showLocationTypePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Location Type</Text>
                <TouchableOpacity onPress={() => setShowLocationTypePicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {locationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeOption}
                    onPress={() => {
                      updateFormData('type', type.value);
                      setShowLocationTypePicker(false);
                    }}
                  >
                    <View style={[styles.typeIconContainer, { backgroundColor: type.color + '20' }]}>
                      <Icon color={type.color} size={24} />
                    </View>
                    <View style={styles.typeContent}>
                      <Text style={styles.typeLabel}>{type.label}</Text>
                      <Text style={styles.typeDescription}>{type.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Modal>

        {/* Status Picker */}
        <Modal
          visible={showStatusPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Status</Text>
                <TouchableOpacity onPress={() => setShowStatusPicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('status', status.value);
                    setShowStatusPicker(false);
                  }}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: status.color }]}
                  />
                  <Text style={styles.pickerOptionText}>{status.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Road Access Picker */}
        <Modal
          visible={showRoadAccessPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Road Access</Text>
                <TouchableOpacity onPress={() => setShowRoadAccessPicker(false)}>
                  <X color="#6B7280" />
                </TouchableOpacity>
              </View>
              {roadAccessOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateNestedFormData('facilities', 'roadAccess', option.value);
                    setShowRoadAccessPicker(false);
                  }}
                >
                  <Car color="#6B7280" size={16} />
                  <Text style={styles.pickerOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
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
  headerPlaceholder: {
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
  selectInput: {
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
  selectInputText: {
    fontSize: 16,
    color: '#1E293B',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  populationRow: {
    flexDirection: 'row',
    gap: 12,
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
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    maxHeight: 150,
  },
  multiSelectItem: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  multiSelectItemSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  multiSelectText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  multiSelectTextSelected: {
    color: '#FFFFFF',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  selectedItem: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedItemText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  listInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
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
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1E293B',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});