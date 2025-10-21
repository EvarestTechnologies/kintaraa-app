/**
 * PRC Form Route - MOH 363
 * Dynamic route for creating/editing PRC forms
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRCFormLayout } from '@/components/forms/prc';
import { PRCFormMOH363, PRCPatientDemographics, PRCIncidentDetails, PRCForensicInformation, PRCOBGYNHistory, PRCGeneralPhysicalExamination, PRCGenitalExamination, PRCImmediateManagement, PRCReferrals, PRCLaboratorySamples, PRCPsychologicalAssessment } from '@/types/forms';
import { useAuth } from '@/providers/AuthProvider';

export default function PRCFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<PRCFormMOH363 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    loadFormData();
  }, [id]);

  const loadFormData = async () => {
    try {
      setIsLoading(true);

      // Check if this is a new form or editing existing
      if (id === 'new') {
        // Create new form with properly initialized structure matching PRCFormMOH363 type
        const newForm: PRCFormMOH363 = {
          id: Date.now().toString(),
          caseId: '',
          incidentId: '',
          header: {
            county: '',
            subCounty: '',
            facility: '',
            facilityMFLCode: '',
            startDate: '',
            endDate: '',
          },
          partA: {
            patientDemographics: {
              names: '',
              dateOfBirth: { day: '', month: '', year: '' },
              gender: 'female',
              countyCode: '',
              subCountyCode: '',
              opIpNumber: '',
              residenceAndPhone: '',
              citizenship: '',
              maritalStatus: '',
              disabilities: '',
              orphanedVulnerableChild: false,
            },
            incidentDetails: {
              examinationDate: { day: '', month: '', year: '' },
              examinationTime: { hour: '', minute: '', period: 'AM' },
              incidentDate: { day: '', month: '', year: '' },
              incidentTime: { hour: '', minute: '', period: 'AM' },
              reportDate: { day: '', month: '', year: '' },
              reportTime: { hour: '', minute: '', period: 'AM' },
              perpetratorStatus: 'unknown',
              perpetratorRelationship: '',
              numberOfPerpetrators: 1,
              perpetratorGender: 'male',
              perpetratorEstimatedAge: '',
              incidentLocation: {
                county: '',
                subCounty: '',
                landmark: '',
              },
              chiefComplaintsObserved: '',
              chiefComplaintsReported: '',
              circumstancesSurroundingIncident: '',
              typeOfSexualViolence: {
                oral: false,
                vaginal: false,
                anal: false,
                other: false,
              },
              useOfCondom: 'unknown',
              incidentReportedToPolice: false,
              attendedHealthFacilityBefore: false,
              previouslyTreated: false,
              givenReferralNotes: false,
              significantMedicalSurgicalHistory: '',
            },
            forensicInformation: {
              survivorChangedClothes: false,
              clothesHandedToPolice: false,
              survivorHadBath: false,
              survivorWentToToilet: false,
              survivorLeftMarksOnPerpetrator: false,
            },
            obgynHistory: {
              parity: 0,
              contraceptionType: '',
              lastMenstrualPeriod: { day: '', month: '', year: '' },
              knownPregnancy: false,
              dateOfLastConsensualIntercourse: { day: '', month: '', year: '' },
            },
            generalPhysicalExamination: {
              generalCondition: '',
              bloodPressure: '',
              pulseRate: 0,
              respiratoryRate: 0,
              temperature: 0,
              demeanorLevelOfAnxiety: 'calm',
            },
            genitalExamination: {
              physicalStatusDescription: '',
              physicalInjuries: [],
              outerGenitalia: '',
              vagina: '',
              hymen: '',
              anus: '',
              otherSignificantOrifices: '',
              comments: '',
            },
            immediateManagement: {
              pepFirstDose: false,
              ecpGiven: false,
              stitchingSurgicalToiletDone: false,
              stiTreatmentGiven: false,
              comments: '',
            },
            referrals: {
              policeStation: false,
              hivTest: false,
              laboratory: false,
              legal: false,
              traumaCounseling: false,
              safeShelter: false,
              opdCccHivClinic: false,
              other: false,
            },
            laboratorySamples: {
              samples: {
                outerGenitalSwab: null,
                highVaginalSwab: null,
                analSwab: null,
                skinSwab: null,
                oralSwab: null,
                urine: null,
                blood: null,
                pubicHair: null,
                nailClippings: null,
                foreignBodies: null,
                other: null,
              },
              chainOfCustody: {
                samplesPackedAndIssued: 'all',
                examiningOfficerName: '',
                examiningOfficerDate: { day: '', month: '', year: '' },
                policeOfficerName: '',
                policeOfficerDate: { day: '', month: '', year: '' },
              },
            },
          },
          partB: {
            generalAppearanceAndBehavior: '',
            rapport: '',
            mood: '',
            affect: '',
            speech: '',
            perception: '',
            thoughtContent: '',
            thoughtProcess: '',
            cognitiveFunction: {
              memory: '',
              orientation: '',
              concentration: '',
              intelligence: '',
              judgment: '',
            },
            insightLevel: '',
            recommendationFollowingAssessment: '',
            referralPoints: '',
            referralUptakeSinceLastVisit: '',
            partBExaminingOfficer: {
              name: '',
              date: { day: '', month: '', year: '' },
            },
            partBPoliceOfficer: {
              name: '',
              date: { day: '', month: '', year: '' },
            },
          },
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setFormData(newForm);
      } else {
        // Load existing form from AsyncStorage
        const storedForm = await AsyncStorage.getItem(`prc_form_${id}`);
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

  const handleUpdate = (updates: Partial<PRCFormMOH363>) => {
    if (!formData) return;

    const updatedForm = {
      ...formData,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setFormData(updatedForm);
  };

  const handleSaveDraft = async () => {
    if (!formData) return;

    try {
      setIsSaving(true);

      // Save to AsyncStorage
      await AsyncStorage.setItem(`prc_form_${formData.id}`, JSON.stringify(formData));

      // Also save to a list of all forms
      const allFormsKey = `prc_forms_list_${user?.id || 'guest'}`;
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

      Alert.alert('Success', 'Draft saved successfully', [
        { text: 'OK' }
      ]);
    } catch (error) {
      console.error('Error saving draft:', error);
      Alert.alert('Error', 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setIsSubmitting(true);

      // Update form status
      const submittedForm = {
        ...formData,
        status: 'submitted' as const,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(`prc_form_${formData.id}`, JSON.stringify(submittedForm));

      // Update list
      const allFormsKey = `prc_forms_list_${user?.id || 'guest'}`;
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

      Alert.alert(
        'Success',
        'PRC Form submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PRCFormLayout
        formData={formData}
        onUpdate={handleUpdate}
        onSaveDraft={handleSaveDraft}
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
