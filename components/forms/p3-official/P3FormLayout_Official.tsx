import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { P3FormOfficial } from '@/types/forms/P3Form_Official';
import { P3PartOne_PoliceSection } from './P3PartOne_PoliceSection';
import { P3SectionA_PractitionerConsent } from './P3SectionA_PractitionerConsent';
import { P3SectionA_MedicalHistory } from './P3SectionA_MedicalHistory';
import { P3SectionB_GeneralExamination } from './P3SectionB_GeneralExamination';
import { P3SectionC_SexualOffences } from './P3SectionC_SexualOffences';
import P3ChainOfCustodyComponent from './P3ChainOfCustody';

interface P3FormLayoutOfficialProps {
  form: P3FormOfficial;
  onUpdate: (updates: Partial<P3FormOfficial>) => void;
  onSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
}

type FormSection =
  | 'part_one'
  | 'section_a_consent'
  | 'section_a_history'
  | 'section_b_general'
  | 'section_c_sexual'
  | 'chain_of_custody';

const P3FormLayout_Official: React.FC<P3FormLayoutOfficialProps> = ({
  form,
  onUpdate,
  onSave,
  onSubmit,
  isLoading = false,
}) => {
  const [currentSection, setCurrentSection] = useState<FormSection>('part_one');
  const [isSaving, setIsSaving] = useState(false);

  const sections: Array<{
    id: FormSection;
    title: string;
    shortTitle: string;
    part: 'PART ONE' | 'PART TWO';
    color: string;
  }> = [
    {
      id: 'part_one',
      title: 'Police Officer Section',
      shortTitle: 'Police',
      part: 'PART ONE',
      color: '#1565C0',
    },
    {
      id: 'section_a_consent',
      title: 'Practitioner Details & Consent',
      shortTitle: 'Consent',
      part: 'PART TWO',
      color: '#2E7D32',
    },
    {
      id: 'section_a_history',
      title: 'Medical History',
      shortTitle: 'History',
      part: 'PART TWO',
      color: '#2E7D32',
    },
    {
      id: 'section_b_general',
      title: 'General Examination',
      shortTitle: 'General',
      part: 'PART TWO',
      color: '#2E7D32',
    },
    {
      id: 'section_c_sexual',
      title: 'Sexual Offences Examination',
      shortTitle: 'Sexual',
      part: 'PART TWO',
      color: '#C2185B',
    },
    {
      id: 'chain_of_custody',
      title: 'Chain of Custody',
      shortTitle: 'Custody',
      part: 'PART TWO',
      color: '#FF6F00',
    },
  ];

  const currentSectionIndex = sections.findIndex((s) => s.id === currentSection);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSection(sections[currentSectionIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSection(sections[currentSectionIndex + 1].id);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      Alert.alert('Success', 'Form saved as draft successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.partOne.patientName || !form.partOne.natureOfAllegedOffence) {
      Alert.alert('Validation Error', 'Please complete all required fields in Part One');
      setCurrentSection('part_one');
      return;
    }

    if (!form.partTwo.practitionerDetails.practitionerName || !form.partTwo.patientConsent.consentGiven) {
      Alert.alert('Validation Error', 'Patient consent is required in Section A');
      setCurrentSection('section_a_consent');
      return;
    }

    Alert.alert(
      'Submit Form',
      'Are you sure you want to submit this P3 form? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            try {
              await onSubmit();
              Alert.alert('Success', 'P3 Form submitted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to submit form. Please try again.');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'part_one':
        return (
          <P3PartOne_PoliceSection
            partOneData={form.partOne}
            onUpdate={(updates) =>
              onUpdate({
                partOne: {
                  ...form.partOne,
                  ...updates,
                },
              })
            }
          />
        );

      case 'section_a_consent':
        return (
          <P3SectionA_PractitionerConsent
            practitionerDetails={form.partTwo.practitionerDetails}
            patientConsent={form.partTwo.patientConsent}
            onUpdatePractitioner={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  practitionerDetails: {
                    ...form.partTwo.practitionerDetails,
                    ...updates,
                  },
                },
              })
            }
            onUpdateConsent={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  patientConsent: {
                    ...form.partTwo.patientConsent,
                    ...updates,
                  },
                },
              })
            }
          />
        );

      case 'section_a_history':
        return (
          <P3SectionA_MedicalHistory
            medicalHistory={form.partTwo.medicalHistory}
            onUpdate={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  medicalHistory: {
                    ...form.partTwo.medicalHistory,
                    ...updates,
                  },
                },
              })
            }
          />
        );

      case 'section_b_general':
        return (
          <P3SectionB_GeneralExamination
            generalExamination={form.partTwo.generalExamination}
            physicalExamination={form.partTwo.physicalExamination}
            onUpdateGeneral={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  generalExamination: {
                    ...form.partTwo.generalExamination,
                    ...updates,
                  },
                },
              })
            }
            onUpdatePhysical={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  physicalExamination: {
                    ...form.partTwo.physicalExamination,
                    ...updates,
                  },
                },
              })
            }
          />
        );

      case 'section_c_sexual':
        return (
          <P3SectionC_SexualOffences
            sexualOffencesExam={
              form.partTwo.sexualOffencesExamination || {
                femaleExamination: undefined,
                maleExamination: undefined,
                specimenCollection: {
                  medicalSamples: { blood: false, urine: false },
                  forensicSerologysamples: {
                    referenceSample: { collected: false, type: null },
                    oralSwab: false,
                    biteMarkSwab: false,
                    pubicHair: { collected: false, method: null },
                    lowVaginalSwab: false,
                    highVaginalSwab: false,
                    endoCervicalSwab: false,
                    analSwab: false,
                    rectalSwab: false,
                    fingerNailClippingsScrapings: false,
                  },
                },
                additionalRemarksConclusion: '',
                medicationAdministered: '',
                recommendationsReferrals: '',
              }
            }
            patientSex={form.partOne.sex}
            onUpdate={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  sexualOffencesExamination: {
                    ...form.partTwo.sexualOffencesExamination!,
                    ...updates,
                  },
                },
              })
            }
          />
        );

      case 'chain_of_custody':
        return (
          <P3ChainOfCustodyComponent
            chainOfCustody={form.partTwo.chainOfCustody}
            onUpdate={(updates) =>
              onUpdate({
                partTwo: {
                  ...form.partTwo,
                  chainOfCustody: {
                    ...form.partTwo.chainOfCustody,
                    ...updates,
                  },
                },
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Form Status */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KENYA POLICE P3 FORM</Text>
        <Text style={styles.headerSubtitle}>Medical Examination Report</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {form.status === 'draft' && 'DRAFT'}
            {form.status === 'part_one_complete' && 'PART ONE COMPLETE'}
            {form.status === 'part_two_complete' && 'PART TWO COMPLETE'}
            {form.status === 'completed' && 'COMPLETED'}
            {form.status === 'submitted' && 'SUBMITTED'}
          </Text>
        </View>
      </View>

      {/* Section Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.tab,
                currentSection === section.id && styles.activeTab,
                { borderBottomColor: section.color },
              ]}
              onPress={() => setCurrentSection(section.id)}
            >
              <Text style={styles.tabPart}>{section.part}</Text>
              <Text
                style={[
                  styles.tabTitle,
                  currentSection === section.id && styles.activeTabTitle,
                ]}
              >
                {section.shortTitle}
              </Text>
              {index === 0 && (
                <View style={[styles.tabNumber, { backgroundColor: '#1565C0' }]}>
                  <Text style={styles.tabNumberText}>1</Text>
                </View>
              )}
              {index > 0 && (
                <View style={[styles.tabNumber, { backgroundColor: section.color }]}>
                  <Text style={styles.tabNumberText}>{index}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentSectionIndex + 1) / sections.length) * 100}%`,
                backgroundColor: sections[currentSectionIndex].color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Section {currentSectionIndex + 1} of {sections.length}
        </Text>
      </View>

      {/* Current Section Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1565C0" />
            <Text style={styles.loadingText}>Loading form...</Text>
          </View>
        ) : (
          renderSection()
        )}
      </View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {/* Previous Button */}
          <TouchableOpacity
            style={[styles.navButton, styles.previousButton, isFirstSection && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={isFirstSection}
          >
            <Text style={styles.navButtonText}>
              {isFirstSection ? 'First Section' : '← Previous'}
            </Text>
          </TouchableOpacity>

          {/* Save Draft Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Save Draft</Text>
            )}
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, isLastSection && styles.disabledButton]}
            onPress={handleNext}
            disabled={isLastSection}
          >
            <Text style={styles.navButtonText}>
              {isLastSection ? 'Last Section' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button (only show on last section) */}
        {isLastSection && (
          <TouchableOpacity
            style={[styles.submitButton, isSaving && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            <Text style={styles.submitButtonText}>
              ✓ SUBMIT COMPLETED FORM
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header
  header: {
    padding: 20,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#0D47A1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#FBC02D',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3E2723',
  },

  // Tabs
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    alignItems: 'center',
    minWidth: 120,
  },
  activeTab: {
    backgroundColor: '#F5F5F5',
  },
  tabPart: {
    fontSize: 10,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 2,
  },
  tabTitle: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '600',
  },
  activeTabTitle: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
  tabNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  tabNumberText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Progress
  progressContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Content
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#757575',
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    backgroundColor: '#757575',
  },
  nextButton: {
    backgroundColor: '#1565C0',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitButton: {
    padding: 16,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default P3FormLayout_Official;
