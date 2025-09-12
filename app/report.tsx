import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Camera,
  Mic,
  Shield,
} from 'lucide-react-native';

const incidentTypes = [
  { id: 'physical', title: 'Physical Violence', color: '#E53935' },
  { id: 'sexual', title: 'Sexual Violence', color: '#C2185B' },
  { id: 'emotional', title: 'Emotional/Psychological Abuse', color: '#4527A0' },
  { id: 'economic', title: 'Economic Abuse', color: '#FF8F00' },
  { id: 'online', title: 'Online Gender-Based Violence', color: '#1565C0' },
  { id: 'femicide', title: 'Femicide/Attempted Femicide', color: '#B71C1C' },
];

const supportServices = [
  { id: 'medical', title: 'Medical Assistance', icon: '🏥' },
  { id: 'legal', title: 'Legal Support', icon: '⚖️' },
  { id: 'counseling', title: 'Psychological Counseling', icon: '🧠' },
  { id: 'police', title: 'Police Intervention', icon: '👮' },
  { id: 'shelter', title: 'Shelter/Accommodation', icon: '🏠' },
  { id: 'financial', title: 'Financial Assistance', icon: '💰' },
];

export default function ReportScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState({
    type: '',
    date: '',
    location: '',
    description: '',
    severity: '',
    supportServices: [] as string[],
    isAnonymous: false,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    // Generate report ID
    const reportId = `KIN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    Alert.alert(
      'Report Submitted',
      `Your report has been submitted successfully.\n\nReport ID: ${reportId}\n\nYou will receive updates on the progress of your case.`,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/reports'),
        },
      ]
    );
  };

  const updateReportData = (key: string, value: any) => {
    setReportData(prev => ({ ...prev, [key]: value }));
  };

  const toggleSupportService = (serviceId: string) => {
    const services = reportData.supportServices.includes(serviceId)
      ? reportData.supportServices.filter(id => id !== serviceId)
      : [...reportData.supportServices, serviceId];
    
    updateReportData('supportServices', services);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What type of incident occurred?</Text>
            <Text style={styles.stepDescription}>
              Select the category that best describes the incident
            </Text>
            <View style={styles.incidentTypes}>
              {incidentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.incidentType,
                    reportData.type === type.id && styles.incidentTypeSelected,
                  ]}
                  onPress={() => updateReportData('type', type.id)}
                  testID={`incident-type-${type.id}`}
                >
                  <View
                    style={[
                      styles.incidentTypeIndicator,
                      { backgroundColor: type.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.incidentTypeText,
                      reportData.type === type.id && styles.incidentTypeTextSelected,
                    ]}
                  >
                    {type.title}
                  </Text>
                  {reportData.type === type.id && (
                    <Check color="#6A2CB0" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When and where did this happen?</Text>
            <Text style={styles.stepDescription}>
              Provide details about the time and location
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Calendar color="#6A2CB0" size={20} />
                <Text style={styles.dateInputText}>
                  {reportData.date || 'Select date and time'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TouchableOpacity style={styles.locationInput}>
                <MapPin color="#6A2CB0" size={20} />
                <Text style={styles.locationInputText}>
                  {reportData.location || 'Add location (optional)'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textArea}
                value={reportData.description}
                onChangeText={(value) => updateReportData('description', value)}
                placeholder="Describe what happened (optional)"
                placeholderTextColor="#D8CEE8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What support do you need?</Text>
            <Text style={styles.stepDescription}>
              Select all services that you would like to access
            </Text>
            <View style={styles.supportServices}>
              {supportServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.supportService,
                    reportData.supportServices.includes(service.id) && styles.supportServiceSelected,
                  ]}
                  onPress={() => toggleSupportService(service.id)}
                  testID={`support-service-${service.id}`}
                >
                  <Text style={styles.supportServiceIcon}>{service.icon}</Text>
                  <Text
                    style={[
                      styles.supportServiceText,
                      reportData.supportServices.includes(service.id) && styles.supportServiceTextSelected,
                    ]}
                  >
                    {service.title}
                  </Text>
                  {reportData.supportServices.includes(service.id) && (
                    <Check color="#FFFFFF" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepDescription}>
              Review your report before submitting
            </Text>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Incident Type:</Text>
                <Text style={styles.reviewValue}>
                  {incidentTypes.find(t => t.id === reportData.type)?.title || 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Support Services:</Text>
                <Text style={styles.reviewValue}>
                  {reportData.supportServices.length > 0 
                    ? `${reportData.supportServices.length} services selected`
                    : 'None selected'
                  }
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Privacy:</Text>
                <Text style={styles.reviewValue}>
                  {reportData.isAnonymous ? 'Anonymous' : 'Identified'}
                </Text>
              </View>
            </View>

            <View style={styles.privacyOptions}>
              <TouchableOpacity
                style={styles.privacyOption}
                onPress={() => updateReportData('isAnonymous', !reportData.isAnonymous)}
              >
                <View
                  style={[
                    styles.checkbox,
                    reportData.isAnonymous && styles.checkboxActive,
                  ]}
                >
                  {reportData.isAnonymous && <Check color="#FFFFFF" size={16} />}
                </View>
                <Text style={styles.privacyOptionText}>
                  Submit this report anonymously
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityNote}>
              <Shield color="#43A047" size={20} />
              <Text style={styles.securityNoteText}>
                Your report is encrypted and secure. Only authorized personnel will have access.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return reportData.type !== '';
      case 2:
        return true; // All fields are optional in step 2
      case 3:
        return true; // Support services are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          testID="back-button"
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#6A2CB0', '#E24B95']}
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
          testID="next-button"
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Submit Report' : 'Continue'}
          </Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  stepContent: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#49455A',
    lineHeight: 22,
    marginBottom: 32,
  },
  incidentTypes: {
    gap: 12,
  },
  incidentType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  incidentTypeSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  incidentTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  incidentTypeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  incidentTypeTextSelected: {
    color: '#6A2CB0',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    gap: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    gap: 12,
  },
  locationInputText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
    minHeight: 120,
  },
  supportServices: {
    gap: 12,
  },
  supportService: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  supportServiceSelected: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  supportServiceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  supportServiceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  supportServiceTextSelected: {
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#49455A',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: '#341A52',
  },
  privacyOptions: {
    marginBottom: 24,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#6A2CB0',
  },
  privacyOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A2CB0',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});