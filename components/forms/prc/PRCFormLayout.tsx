/**
 * PRC Form Layout Component
 * Main container for MOH 363 PRC Form
 * Handles form state and navigation between sections
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PRCFormMOH363 } from '@/types/forms';
import { PRCFormHeader } from './PRCFormHeader';
import { PRCSection1_Demographics } from './sections/PRCSection1_Demographics';
import { PRCSection2_IncidentDetails } from './sections/PRCSection2_IncidentDetails';
import { PRCSection3_Forensic } from './sections/PRCSection3_Forensic';
import { PRCSection4_OBGYNHistory } from './sections/PRCSection4_OBGYNHistory';
import { PRCSection5_PhysicalExam } from './sections/PRCSection5_PhysicalExam';
import { PRCSection6_GenitalExam } from './sections/PRCSection6_GenitalExam';
import { PRCSection7_ImmediateManagement } from './sections/PRCSection7_ImmediateManagement';
import { PRCSection8_Referrals } from './sections/PRCSection8_Referrals';
import { PRCSection9_LabSamples } from './sections/PRCSection9_LabSamples';
import { TimeCriticalAlerts } from './TimeCriticalAlerts';
import { PRCPartB_PsychologicalAssessment } from './PRCPartB_PsychologicalAssessment';

interface PRCFormLayoutProps {
  formData: PRCFormMOH363;
  onUpdate: (data: Partial<PRCFormMOH363>) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const PRCFormLayout: React.FC<PRCFormLayoutProps> = ({
  formData,
  onUpdate,
  onSaveDraft,
  onSubmit,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'partA' | 'partB'>('partA');

  // Update specific sections
  const updateHeader = (headerData: Partial<typeof formData.header>) => {
    onUpdate({ header: { ...formData.header, ...headerData } });
  };

  const updateDemographics = (demographicsData: Partial<typeof formData.partA.patientDemographics>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        patientDemographics: { ...formData.partA.patientDemographics, ...demographicsData },
      },
    });
  };

  const updateIncidentDetails = (incidentData: Partial<typeof formData.partA.incidentDetails>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        incidentDetails: { ...formData.partA.incidentDetails, ...incidentData },
      },
    });
  };

  const updateForensic = (forensicData: Partial<typeof formData.partA.forensicInformation>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        forensicInformation: { ...formData.partA.forensicInformation, ...forensicData },
      },
    });
  };

  const updateOBGYN = (obgynData: Partial<typeof formData.partA.obgynHistory>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        obgynHistory: { ...formData.partA.obgynHistory, ...obgynData },
      },
    });
  };

  const updatePhysicalExam = (physicalData: Partial<typeof formData.partA.generalPhysicalExamination>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        generalPhysicalExamination: { ...formData.partA.generalPhysicalExamination, ...physicalData },
      },
    });
  };

  const updateGenitalExam = (genitalData: Partial<typeof formData.partA.genitalExamination>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        genitalExamination: { ...formData.partA.genitalExamination, ...genitalData },
      },
    });
  };

  const updateImmediateManagement = (managementData: Partial<typeof formData.partA.immediateManagement>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        immediateManagement: { ...formData.partA.immediateManagement, ...managementData },
      },
    });
  };

  const updateReferrals = (referralsData: Partial<typeof formData.partA.referrals>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        referrals: { ...formData.partA.referrals, ...referralsData },
      },
    });
  };

  const updateLabSamples = (labData: Partial<typeof formData.partA.laboratorySamples>) => {
    onUpdate({
      partA: {
        ...formData.partA,
        laboratorySamples: { ...formData.partA.laboratorySamples, ...labData },
      },
    });
  };

  const updatePartB = (partBData: Partial<typeof formData.partB>) => {
    onUpdate({
      partB: { ...formData.partB, ...partBData },
    });
  };

  return (
    <View style={styles.container}>
      {/* Form Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.formTitle}>POST RAPE CARE FORM (PRC)</Text>
        <Text style={styles.formSubtitle}>MOH 363 - PART A & B</Text>
        <Text style={styles.ministryText}>MINISTRY OF HEALTH</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'partA' && styles.tabActive]}
          onPress={() => setActiveTab('partA')}
        >
          <Text style={[styles.tabText, activeTab === 'partA' && styles.tabTextActive]}>
            PART A - Medical/Forensic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'partB' && styles.tabActive]}
          onPress={() => setActiveTab('partB')}
        >
          <Text style={[styles.tabText, activeTab === 'partB' && styles.tabTextActive]}>
            PART B - Psychological
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'partA' && (
          <>
            {/* Form Header */}
            <PRCFormHeader headerData={formData.header} onUpdate={updateHeader} />

            {/* Section 1: Patient Demographics */}
            <PRCSection1_Demographics
              demographicsData={formData.partA.patientDemographics}
              onUpdate={updateDemographics}
            />

            {/* Section 2: Incident Details */}
            <PRCSection2_IncidentDetails
              incidentData={formData.partA.incidentDetails}
              onUpdate={updateIncidentDetails}
            />

            {/* Section 3: Forensic Information */}
            <PRCSection3_Forensic
              forensicData={formData.partA.forensicInformation}
              onUpdate={updateForensic}
            />

            {/* Section 4: OB/GYN History */}
            <PRCSection4_OBGYNHistory
              obgynData={formData.partA.obgynHistory}
              onUpdate={updateOBGYN}
            />

            {/* Section 5: General Physical Examination */}
            <PRCSection5_PhysicalExam
              physicalExamData={formData.partA.generalPhysicalExamination}
              onUpdate={updatePhysicalExam}
            />

            {/* Section 6: Genital Examination */}
            <PRCSection6_GenitalExam
              genitalExamData={formData.partA.genitalExamination}
              onUpdate={updateGenitalExam}
            />

            {/* Section 7: Immediate Management */}
            <PRCSection7_ImmediateManagement
              managementData={formData.partA.immediateManagement}
              onUpdate={updateImmediateManagement}
            />

            {/* Time-Critical Alerts */}
            {formData.partA.incidentDetails.incidentDate.day &&
             formData.partA.incidentDetails.incidentDate.month &&
             formData.partA.incidentDetails.incidentDate.year && (
              <TimeCriticalAlerts
                incidentDate={`${formData.partA.incidentDetails.incidentDate.year}-${formData.partA.incidentDetails.incidentDate.month.padStart(2, '0')}-${formData.partA.incidentDetails.incidentDate.day.padStart(2, '0')}`}
                incidentTime={formData.partA.incidentDetails.incidentTime.hour && formData.partA.incidentDetails.incidentTime.minute ?
                  `${formData.partA.incidentDetails.incidentTime.hour.padStart(2, '0')}:${formData.partA.incidentDetails.incidentTime.minute.padStart(2, '0')}` :
                  undefined
                }
                pepAdministered={formData.partA.immediateManagement.pepFirstDose}
                ecAdministered={formData.partA.immediateManagement.ecpGiven}
              />
            )}

            {/* Section 8: Referrals */}
            <PRCSection8_Referrals
              referralsData={formData.partA.referrals}
              onUpdate={updateReferrals}
            />

            {/* Section 9: Laboratory Samples & Chain of Custody */}
            <PRCSection9_LabSamples
              labSamplesData={formData.partA.laboratorySamples}
              onUpdate={updateLabSamples}
            />
          </>
        )}

        {activeTab === 'partB' && (
          <PRCPartB_PsychologicalAssessment
            assessmentData={formData.partB}
            onUpdate={updatePartB}
          />
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.draftButton}
          onPress={onSaveDraft}
          disabled={isLoading}
        >
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Submitting...' : 'Submit Form'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ministryText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6A2CB0',
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  tabTextActive: {
    color: '#6A2CB0',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  placeholderSection: {
    margin: 16,
    padding: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  draftButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
