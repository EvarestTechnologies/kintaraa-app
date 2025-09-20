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
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  User,
  Heart,
  Calendar,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
} from 'lucide-react-native';
import { useIncidents } from '@/providers/IncidentProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useProvider } from '@/providers/ProviderContext';


interface RegisterPatientModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PatientFormData {
  // Personal Information
  fullName: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  // Address Information
  address: string;
  city: string;
  region: string;

  // Medical Information
  primaryCondition: string;
  status: 'active' | 'recovering' | 'stable' | 'critical';
  allergies: string;
  currentMedications: string;
  assistanceType: string;

  // Case Information
  priority: 'low' | 'medium' | 'high' | 'urgent';
  referralSource: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;

  // Consent
  consentData: boolean;
  consentTreatment: boolean;
  consentPhoto: boolean;
  consentEmergencyContact: boolean;
}

const genderOptions = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

const statusOptions = [
  { label: 'Active', value: 'active', color: '#10B981' },
  { label: 'Recovering', value: 'recovering', color: '#F59E0B' },
  { label: 'Stable', value: 'stable', color: '#3B82F6' },
  { label: 'Critical', value: 'critical', color: '#EF4444' },
];

const priorityOptions = [
  { label: 'Low', value: 'low', color: '#6B7280' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Urgent', value: 'urgent', color: '#DC2626' },
];

const assistanceTypes = [
  'Medical Examination',
  'Emergency Care',
  'Trauma Counseling',
  'Follow-up Treatment',
  'Documentation',
  'Referral Services',
];

const referralSources = [
  'Police Department',
  'Legal Aid',
  'Self-referral',
  'Community Health Worker',
  'Social Services',
  'GBV Rescue Center',
  'Other Healthcare Provider',
];

export default function RegisterPatientModal({ visible, onClose, onSuccess }: RegisterPatientModalProps) {
  const { createIncident } = useIncidents();
  const { user } = useAuth();
  const { providerProfile } = useProvider();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date/Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAppointmentDatePicker, setShowAppointmentDatePicker] = useState(false);
  const [showAppointmentTimePicker, setShowAppointmentTimePicker] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());

  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
    city: '',
    region: '',
    primaryCondition: '',
    status: 'active',
    allergies: '',
    currentMedications: '',
    assistanceType: '',
    priority: 'medium',
    referralSource: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    consentData: false,
    consentTreatment: false,
    consentPhoto: false,
    consentEmergencyContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof PatientFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.age.trim()) newErrors.age = 'Age is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        break;

      case 2: // Medical Information
        if (!formData.primaryCondition.trim()) newErrors.primaryCondition = 'Primary condition is required';
        if (!formData.assistanceType) newErrors.assistanceType = 'Assistance type is required';
        break;

      case 3: // Case Details
        if (!formData.referralSource) newErrors.referralSource = 'Referral source is required';
        break;

      case 4: // Consent
        if (!formData.consentData) newErrors.consentData = 'Data collection consent is required';
        if (!formData.consentTreatment) newErrors.consentTreatment = 'Treatment consent is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // Calculate age from date of birth if provided
      const calculatedAge = formData.dateOfBirth
        ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
        : parseInt(formData.age) || 0;

      // Format dates
      const dobString = dateOfBirth.toLocaleDateString();
      const appointmentDateString = appointmentDate.toLocaleDateString();
      const appointmentTimeString = appointmentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create new incident/patient record using the proper Incident structure
      const newIncident = {
        caseNumber: `KIN-${Date.now()}`,
        survivorId: `survivor-${Date.now()}`,
        type: 'medical' as const, // Changed to medical for healthcare
        status: 'assigned' as const,
        priority: formData.priority as 'low' | 'medium' | 'high' | 'critical',
        incidentDate: new Date().toISOString().split('T')[0], // Today's date
        location: {
          address: `${formData.address}, ${formData.city}`.trim(),
          description: `Patient residence in ${formData.city}`,
        },
        description: formData.primaryCondition,
        severity: formData.priority === 'urgent' || formData.priority === 'high' ? 'high' as const : 'medium' as const,
        supportServices: ['medical'],
        isAnonymous: false,
        evidence: [],
        messages: [],
        assignedProviderId: providerProfile?.id,
        survivorName: formData.fullName,
        survivorPhone: formData.phone,
        survivorAge: calculatedAge,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          patientInfo: {
            age: calculatedAge.toString(),
            dateOfBirth: dobString,
            gender: formData.gender,
            phone: formData.phone,
            emergencyContact: {
              name: formData.emergencyContactName,
              phone: formData.emergencyContactPhone,
            },
            address: {
              street: formData.address,
              city: formData.city,
              region: formData.region,
            },
            medicalInfo: {
              condition: formData.primaryCondition,
              status: formData.status,
              allergies: formData.allergies,
              medications: formData.currentMedications,
              assistanceType: formData.assistanceType,
            },
            caseDetails: {
              referralSource: formData.referralSource,
              appointmentDate: appointmentDateString,
              appointmentTime: appointmentTimeString,
              notes: formData.notes,
              priority: formData.priority,
            },
            consent: {
              data: formData.consentData,
              treatment: formData.consentTreatment,
              photo: formData.consentPhoto,
              emergencyContact: formData.consentEmergencyContact,
            },
            registeredAt: new Date().toISOString(),
            registeredBy: user?.fullName || 'Healthcare Provider',
          },
        },
      };

      console.log('Registering patient with data:', newIncident);

      // Validate provider profile
      if (!providerProfile?.id) {
        throw new Error('Provider profile not available. Please ensure you are logged in as a healthcare provider.');
      }

      // Add the incident to the system using createIncident
      if (createIncident) {
        createIncident(newIncident);
        console.log('Patient added successfully to incident system with providerId:', providerProfile.id);
      } else {
        throw new Error('createIncident function not available');
      }

      Alert.alert(
        'Success',
        `Patient ${formData.fullName} has been registered successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
              resetForm();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Patient registration error:', error);
      Alert.alert(
        'Registration Failed',
        `Failed to register patient: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      fullName: '',
      age: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      address: '',
      city: '',
      region: '',
      primaryCondition: '',
      status: 'active',
      allergies: '',
      currentMedications: '',
      assistanceType: '',
      priority: 'medium',
      referralSource: '',
      appointmentDate: '',
      appointmentTime: '',
      notes: '',
      consentData: false,
      consentTreatment: false,
      consentPhoto: false,
      consentEmergencyContact: false,
    });
    setDateOfBirth(new Date());
    setAppointmentDate(new Date());
    setAppointmentTime(new Date());
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep === step && styles.stepCircleCurrent,
          ]}>
            <Text style={[
              styles.stepNumber,
              currentStep >= step && styles.stepNumberActive,
            ]}>
              {step}
            </Text>
          </View>
          {step < 4 && <View style={[
            styles.stepLine,
            currentStep > step && styles.stepLineActive,
          ]} />}
        </View>
      ))}
    </View>
  );

  const renderDropdown = (
    label: string,
    value: string,
    options: { label: string; value: string; color?: string }[],
    onSelect: (value: string) => void,
    error?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonSelected,
              option.color && value === option.value && { backgroundColor: option.color },
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              value === option.value && styles.optionTextSelected,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderListSelection = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    error?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label} *</Text>
      <View style={styles.listContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.listItem,
              value === option && styles.listItemSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <View style={[
              styles.radioButton,
              value === option && styles.radioButtonSelected,
            ]}>
              {value === option && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[
              styles.listItemText,
              value === option && styles.listItemTextSelected,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderCheckbox = (
    label: string,
    value: boolean,
    onToggle: () => void,
    required: boolean = false,
    error?: string
  ) => (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity style={styles.checkboxRow} onPress={onToggle}>
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
          {value && <CheckCircle color="#FFFFFF" size={16} />}
        </View>
        <Text style={styles.checkboxLabel}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderDatePicker = (
    label: string,
    _value: Date,
    onPress: () => void,
    displayValue: string,
    error?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={[styles.datePickerButton, error && styles.textInputError]} onPress={onPress}>
        <Calendar color="#6B7280" size={20} />
        <Text style={[styles.datePickerText, !displayValue && styles.datePickerPlaceholder]}>
          {displayValue || `Select ${label.toLowerCase()}`}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderTimePicker = (
    label: string,
    _value: Date,
    onPress: () => void,
    displayValue: string,
    error?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={[styles.datePickerButton, error && styles.textInputError]} onPress={onPress}>
        <Clock color="#6B7280" size={20} />
        <Text style={[styles.datePickerText, !displayValue && styles.datePickerPlaceholder]}>
          {displayValue || `Select ${label.toLowerCase()}`}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <User color="#6366F1" size={24} />
        <Text style={styles.stepTitle}>Personal Information</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Full Name *</Text>
        <TextInput
          style={[styles.textInput, errors.fullName && styles.textInputError]}
          value={formData.fullName}
          onChangeText={(text) => updateFormData('fullName', text)}
          placeholder="Enter patient's full name"
          placeholderTextColor="#9CA3AF"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.fieldLabel}>Age *</Text>
          <TextInput
            style={[styles.textInput, errors.age && styles.textInputError]}
            value={formData.age}
            onChangeText={(text) => updateFormData('age', text)}
            placeholder="Age"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={[styles.fieldContainer, { flex: 2, marginLeft: 8 }]}>
          {renderDatePicker(
            'Date of Birth',
            dateOfBirth,
            () => setShowDatePicker(true),
            dateOfBirth.toLocaleDateString()
          )}
        </View>
      </View>

      {renderDropdown(
        'Gender',
        formData.gender,
        genderOptions,
        (value) => updateFormData('gender', value),
        errors.gender
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Phone Number *</Text>
        <TextInput
          style={[styles.textInput, errors.phone && styles.textInputError]}
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Emergency Contact Name</Text>
        <TextInput
          style={styles.textInput}
          value={formData.emergencyContactName}
          onChangeText={(text) => updateFormData('emergencyContactName', text)}
          placeholder="Enter emergency contact name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Emergency Contact Phone</Text>
        <TextInput
          style={styles.textInput}
          value={formData.emergencyContactPhone}
          onChangeText={(text) => updateFormData('emergencyContactPhone', text)}
          placeholder="Enter emergency contact phone"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Address *</Text>
        <TextInput
          style={[styles.textInput, errors.address && styles.textInputError]}
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
          placeholder="Enter full address"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.textInput}
            value={formData.city}
            onChangeText={(text) => updateFormData('city', text)}
            placeholder="City"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.fieldLabel}>Region</Text>
          <TextInput
            style={styles.textInput}
            value={formData.region}
            onChangeText={(text) => updateFormData('region', text)}
            placeholder="Region"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Heart color="#EF4444" size={24} />
        <Text style={styles.stepTitle}>Medical Information</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Primary Condition *</Text>
        <TextInput
          style={[styles.textInput, errors.primaryCondition && styles.textInputError]}
          value={formData.primaryCondition}
          onChangeText={(text) => updateFormData('primaryCondition', text)}
          placeholder="Describe the primary condition or reason for visit"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
        {errors.primaryCondition && <Text style={styles.errorText}>{errors.primaryCondition}</Text>}
      </View>

      {renderDropdown(
        'Current Status',
        formData.status,
        statusOptions,
        (value) => updateFormData('status', value as any)
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Known Allergies</Text>
        <TextInput
          style={styles.textInput}
          value={formData.allergies}
          onChangeText={(text) => updateFormData('allergies', text)}
          placeholder="List any known allergies (medication, food, etc.)"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Current Medications</Text>
        <TextInput
          style={styles.textInput}
          value={formData.currentMedications}
          onChangeText={(text) => updateFormData('currentMedications', text)}
          placeholder="List current medications and dosages"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
        />
      </View>

      {renderListSelection(
        'Type of Assistance Needed',
        formData.assistanceType,
        assistanceTypes,
        (value) => updateFormData('assistanceType', value),
        errors.assistanceType
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <FileText color="#8B5CF6" size={24} />
        <Text style={styles.stepTitle}>Case Details</Text>
      </View>

      {renderDropdown(
        'Priority Level',
        formData.priority,
        priorityOptions,
        (value) => updateFormData('priority', value as any)
      )}

      {renderListSelection(
        'Referral Source',
        formData.referralSource,
        referralSources,
        (value) => updateFormData('referralSource', value),
        errors.referralSource
      )}

      <View style={styles.rowContainer}>
        <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
          {renderDatePicker(
            'Initial Appointment Date',
            appointmentDate,
            () => setShowAppointmentDatePicker(true),
            appointmentDate.toLocaleDateString()
          )}
        </View>

        <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
          {renderTimePicker(
            'Time',
            appointmentTime,
            () => setShowAppointmentTimePicker(true),
            appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Additional Notes</Text>
        <TextInput
          style={styles.textInput}
          value={formData.notes}
          onChangeText={(text) => updateFormData('notes', text)}
          placeholder="Any additional notes or special considerations"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Shield color="#10B981" size={24} />
        <Text style={styles.stepTitle}>Consent & Privacy</Text>
      </View>

      <Text style={styles.consentDescription}>
        Please review and confirm the following consents before registering the patient:
      </Text>

      {renderCheckbox(
        'I consent to the collection and processing of personal and medical data for healthcare services',
        formData.consentData,
        () => updateFormData('consentData', !formData.consentData),
        true,
        errors.consentData
      )}

      {renderCheckbox(
        'I consent to medical treatment and healthcare services',
        formData.consentTreatment,
        () => updateFormData('consentTreatment', !formData.consentTreatment),
        true,
        errors.consentTreatment
      )}

      {renderCheckbox(
        'I consent to photography/documentation for medical purposes (optional)',
        formData.consentPhoto,
        () => updateFormData('consentPhoto', !formData.consentPhoto)
      )}

      {renderCheckbox(
        'I authorize the use of emergency contact information when necessary',
        formData.consentEmergencyContact,
        () => updateFormData('consentEmergencyContact', !formData.consentEmergencyContact)
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Registration Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Patient Name:</Text>
          <Text style={styles.summaryValue}>{formData.fullName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Age:</Text>
          <Text style={styles.summaryValue}>{formData.age}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Condition:</Text>
          <Text style={styles.summaryValue}>{formData.primaryCondition}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Priority:</Text>
          <Text style={styles.summaryValue}>{formData.priority.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

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
          <Text style={styles.headerTitle}>Register New Patient</Text>
          <View style={styles.placeholder} />
        </View>

        {renderStepIndicator()}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={prevStep}
            >
              <ChevronLeft color="#6B7280" size={20} />
              <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              currentStep === 1 && styles.nextButtonFull,
              isSubmitting && styles.nextButtonDisabled,
            ]}
            onPress={currentStep === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.nextButtonText}>Registering...</Text>
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 4 ? 'Register Patient' : 'Next'}
                </Text>
                {currentStep < 4 && <ChevronRight color="#FFFFFF" size={20} />}
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDateOfBirth(selectedDate);
                // Calculate age automatically
                const age = new Date().getFullYear() - selectedDate.getFullYear();
                updateFormData('age', age.toString());
                updateFormData('dateOfBirth', selectedDate.toLocaleDateString());
              }
            }}
            maximumDate={new Date()}
          />
        )}

        {showAppointmentDatePicker && (
          <DateTimePicker
            value={appointmentDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, selectedDate) => {
              setShowAppointmentDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setAppointmentDate(selectedDate);
                updateFormData('appointmentDate', selectedDate.toLocaleDateString());
              }
            }}
            minimumDate={new Date()}
          />
        )}

        {showAppointmentTimePicker && (
          <DateTimePicker
            value={appointmentTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedTime) => {
              setShowAppointmentTimePicker(Platform.OS === 'ios');
              if (selectedTime) {
                setAppointmentTime(selectedTime);
                updateFormData('appointmentTime', selectedTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                }));
              }
            }}
          />
        )}
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
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#6366F1',
  },
  stepCircleCurrent: {
    backgroundColor: '#4F46E5',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#6366F1',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  listItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  listItemTextSelected: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  consentDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  prevButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: '#6366F1',
    marginLeft: 8,
  },
  nextButtonFull: {
    marginLeft: 0,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  datePickerPlaceholder: {
    color: '#9CA3AF',
  },
});