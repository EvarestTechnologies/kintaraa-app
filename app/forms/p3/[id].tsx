/**
 * P3 Form Route - Kenya Police Medical Examination (Official 11-Page Form)
 * Dynamic route for creating/editing official P3 forms
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import P3FormLayout_Official from '@/components/forms/p3-official/P3FormLayout_Official';
import { P3FormOfficial } from '@/types/forms/P3Form_Official';
import { useAuth } from '@/providers/AuthProvider';

export default function P3FormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<P3FormOfficial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form data
  useEffect(() => {
    loadFormData();
  }, [id]);

  const loadFormData = async () => {
    try {
      setIsLoading(true);

      // Check if this is a new form or editing existing
      if (id === 'new') {
        // Create new form with official structure matching 11-page PDF
        const newForm: P3FormOfficial = {
          id: Date.now().toString(),
          caseId: '', // Should be passed from previous screen
          incidentId: '', // Should be passed from previous screen

          // PART ONE: Police Officer Section (Pages 1-2)
          partOne: {
            natureOfAllegedOffence: '',
            dateAndTimeOfAllegedOffence: '',
            dateAndTimeReportedToPolice: '',
            dateOfIssueOfPoliceForm: new Date().toISOString().split('T')[0],
            policeOccurrenceBookNumber: '',
            policeStation: '',
            investigatingOfficer: {
              serviceNumber: '',
              name: user?.fullName || user?.email || '',
              signature: undefined,
            },
            medicalFacilityName: '',
            examinationType: 'complainant',
            patientName: '',
            age: 0,
            sex: 'female',
            idOrBirthCertificateNumber: '',
            contactMobileNumber: '',
            placeOfResidence: '',
            dateSentToMedicalFacility: new Date().toISOString().split('T')[0],
            escortedBy: {
              policeOfficer: undefined,
              authorizedGuardian1: undefined,
              authorizedGuardian2: undefined,
            },
            briefDetailsOfAllegedOffence: '',
            purposeOfExamination: '',
            commandingOfficer: {
              name: '',
              signature: undefined,
            },
          },

          // PART TWO: Medical Practitioner Section
          partTwo: {
            // Section A: Practitioner Details
            practitionerDetails: {
              practitionerName: '',
              registrationNumber: '',
              qualifications: '',
              telephoneContact: '',
              medicalFacilityName: '',
              patientRecordNumber: '',
              facilityTelephoneContact: '',
              facilityPhysicalAddress: '',
              medicalForensicFacilityReferenceNumber: '',
            },

            // Section B: Patient Consent
            patientConsent: {
              consentGiven: false,
              patientFullNames: '',
              authorizedGuardianFullNames: '',
              patientSignature: undefined,
              guardianSignature: undefined,
              consentDate: new Date().toISOString().split('T')[0],
              consentNotGivenReason: '',
              dateOfBirth: '',
              age: 0,
              sex: 'female',
              patientAccompaniedBy: '',
              personsPresent: [],
            },

            // Section A: Medical History
            medicalHistory: {
              relevantMedicalHistory: '',
              sexualOffenceHistory: {
                changedClothes: false,
                condomUsed: 'unknown',
                bathedWashedShowered: false,
                urinated: false,
                defecated: false,
                wiped: false,
                currentlyPregnant: 'unknown',
                currentlyMenstruating: false,
                notes: '',
              },
              historyGivenBy: {
                name: '',
                relationship: '',
                signature: undefined,
              },
            },

            // Section B: General Examination
            generalExamination: {
              vitalSigns: {
                heartRate: '',
                respiratoryRate: '',
                bloodPressure: '',
                temperature: '',
                oedema: '',
                lymphNodes: '',
              },
              stateOfClothing: {
                description: '',
                stainsDebrisDescription: '',
                clothingCollectedForForensicAnalysis: false,
                reasonIfNotCollected: '',
              },
              physicalAppearanceAndBehavior: '',
              height: '',
              weight: '',
              generalBodyBuild: 'normal',
              generalBodyBuildOther: '',
              percentiles: '',
              otherRelevantInformation: '',
              clinicalEvidenceOfIntoxication: '',
              toxicologySamples: {
                blood: false,
                urine: false,
              },
            },

            // Section B: Physical Examination
            physicalExamination: {
              headAndNeck: '',
              oral: '',
              eyeOrbit: '',
              scalp: '',
              ent: '',
              cns: '',
              chest: '',
              abdomen: '',
              upperLimbs: '',
              lowerLimbs: '',
              estimateAgeOfInjuries: '',
              probableMechanismOfInjuries: '',
              degreeOfInjury: null,
              additionalNotes: '',
              treatmentReferralPlan: '',
              examinationDate: new Date().toISOString().split('T')[0],
              medicalPractitionerName: '',
              medicalPractitionerSignature: undefined,
            },

            // Section C: Sexual Offences Examination
            sexualOffencesExamination: {
              femaleExamination: undefined,
              maleExamination: undefined,
              specimenCollection: {
                medicalSamples: {
                  blood: false,
                  urine: false,
                },
                forensicSerologysamples: {
                  referenceSample: {
                    collected: false,
                    type: null,
                  },
                  oralSwab: false,
                  biteMarkSwab: false,
                  pubicHair: {
                    collected: false,
                    method: null,
                  },
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
            },

            // Chain of Custody
            chainOfCustody: {
              entries: [
                {
                  serialNumber: 1,
                  evidenceItemDescription: '',
                  evidenceReceivedFrom: '',
                  evidenceDeliveredTo: '',
                  date: '',
                  commentsRemarks: '',
                },
              ],
              collectedBy: {
                fullName: '',
                collectionDate: '',
                collectionTime: '',
                facilityStamp: undefined,
              },
              receivedBy: {
                fullNameServiceNumber: '',
                receivedDate: '',
                receivedTime: '',
                facilityStamp: undefined,
              },
              practitionerSignature: undefined,
              policeOfficerSignature: undefined,
            },
          },

          // Body Chart (Appendix 1)
          bodyChart: {
            patientType: 'adult',
            sex: 'female',
            injuries: [],
          },

          // Form Status
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setFormData(newForm);
      } else {
        // Load existing form from AsyncStorage
        const storedForm = await AsyncStorage.getItem(`p3_form_official_${id}`);
        if (storedForm) {
          setFormData(JSON.parse(storedForm));
        } else {
          Alert.alert('Error', 'Form not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading form:', error);
      Alert.alert('Error', 'Failed to load form data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (updates: Partial<P3FormOfficial>) => {
    if (!formData) return;

    const updatedForm = {
      ...formData,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setFormData(updatedForm);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `p3_form_official_${formData.id}`,
        JSON.stringify(formData)
      );

      // Also save to a list of all forms
      const allFormsKey = `p3_forms_official_list_${user?.id || 'guest'}`;
      const allFormsJson = await AsyncStorage.getItem(allFormsKey);
      const allForms = allFormsJson ? JSON.parse(allFormsJson) : [];

      const existingIndex = allForms.findIndex((f: any) => f.id === formData.id);
      if (existingIndex >= 0) {
        allForms[existingIndex] = {
          id: formData.id,
          caseId: formData.caseId,
          status: formData.status,
          updatedAt: formData.updatedAt,
        };
      } else {
        allForms.push({
          id: formData.id,
          caseId: formData.caseId,
          status: formData.status,
          updatedAt: formData.updatedAt,
        });
      }
      await AsyncStorage.setItem(allFormsKey, JSON.stringify(allForms));
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      // Update form status
      const submittedForm = {
        ...formData,
        status: 'submitted' as const,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `p3_form_official_${formData.id}`,
        JSON.stringify(submittedForm)
      );

      // Update list
      const allFormsKey = `p3_forms_official_list_${user?.id || 'guest'}`;
      const allFormsJson = await AsyncStorage.getItem(allFormsKey);
      const allForms = allFormsJson ? JSON.parse(allFormsJson) : [];

      const existingIndex = allForms.findIndex((f: any) => f.id === formData.id);
      if (existingIndex >= 0) {
        allForms[existingIndex] = {
          id: submittedForm.id,
          caseId: submittedForm.caseId,
          status: submittedForm.status,
          updatedAt: submittedForm.updatedAt,
          submittedAt: submittedForm.submittedAt,
        };
      }
      await AsyncStorage.setItem(allFormsKey, JSON.stringify(allForms));

      // Navigate back after successful submission
      router.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  if (isLoading || !formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <P3FormLayout_Official
        form={formData}
        onUpdate={handleUpdate}
        onSave={handleSave}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
