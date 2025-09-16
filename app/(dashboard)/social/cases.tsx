import React from 'react';
import { View, StyleSheet } from 'react-native';
import CaseManagement from '@/dashboards/social/components/CaseManagement';
import { ServiceAssessment } from '@/dashboards/social';

export default function CasesScreen() {
  console.log('📋 CasesScreen - Social Cases');

  // Mock assessments for Social Cases
  const mockAssessments: ServiceAssessment[] = [
    {
      id: '1',
      clientId: 'client-001',
      clientName: 'Jane Smith',
      assessmentType: 'initial',
      assessmentDate: '2024-12-15',
      assessor: 'Sarah Johnson',
      findings: {
        strengths: ['Strong family support', 'Motivated to change'],
        needs: ['Housing assistance', 'Job training'],
        risks: ['Financial instability'],
        resources: ['Community center', 'Local job program']
      },
      recommendations: ['Apply for housing assistance', 'Enroll in job training'],
      servicePlan: {
        goals: ['Secure stable housing', 'Gain employment'],
        interventions: ['Weekly counseling', 'Job search support'],
        timeline: '6 months',
        reviewDate: '2025-03-15'
      },
      status: 'completed',
      caseId: 'case-001'
    }
  ];

  const handleAssessmentSelect = (assessment: ServiceAssessment) => {
    console.log('Selected assessment:', assessment.id);
  };

  const handleAddAssessment = () => {
    console.log('Add new assessment');
  };

  return (
    <View style={styles.container}>
      <CaseManagement
        assessments={mockAssessments}
        onAssessmentSelect={handleAssessmentSelect}
        onAddAssessment={handleAddAssessment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});