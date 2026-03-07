import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyCases from '@/app/components/_MyCases';

export default function CHWCommunityCasesScreen() {
  console.log('👥 CHWCommunityCasesScreen - CHW My Cases');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MyCases />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

/*
// Previous community management code commented out
// Real cases now come from ProviderContext via MyCases component
export function CHWCommunityCasesScreenOld() {
  const [communityCases, setCommunityCases] = useState<any[]>([
    {
      id: '1',
      caseNumber: 'CC-2024-001',
      caseType: 'outbreak',
      title: 'Malaria Outbreak - Zone 7',
      description: 'Increased malaria cases reported in households near the swamp area. 15 confirmed cases in the past week.',
      status: 'active',
      priority: 'high',
      affectedHouseholds: 12,
      affectedIndividuals: 34,
      location: {
        area: 'Zone 7, Nakawa Division',
        households: ['HH-001', 'HH-002', 'HH-005', 'HH-008'],
      },
      reportedDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      assignedCHW: 'Mary Nakato',
      collaboratingCHWs: ['John Mukasa', 'Sarah Nalwoga'],
      interventions: [
        {
          id: 'int-1',
          type: 'education',
          description: 'Community education on malaria prevention',
          date: '2024-01-16',
          duration: 120,
          participantsCount: 45,
          materials: ['Nets', 'Educational flyers'],
          outcome: 'Good engagement, distributed 20 nets',
          followUpRequired: true,
          followUpDate: '2024-01-23',
          conductedBy: 'Mary Nakato',
          location: 'Community Center',
        },
      ],
      outcomes: ['20 bed nets distributed', '15 households screened'],
      tags: ['malaria', 'prevention', 'nets', 'urgent'],
      resources: ['bed-nets', 'rapid-tests', 'medication'],
      followUpDate: '2024-01-25',
      estimatedResolution: '2024-02-01',
    },
    {
      id: '2',
      caseNumber: 'CC-2024-002',
      caseType: 'household',
      title: 'Nutritional Support - Wamala Family',
      description: 'Family of 6 with 3 children showing signs of malnutrition. Need nutritional counseling and food assistance.',
      status: 'monitoring',
      priority: 'medium',
      affectedHouseholds: 1,
      affectedIndividuals: 6,
      location: {
        area: 'Zone 5, Nakawa Division',
        households: ['HH-156'],
      },
      reportedDate: '2024-01-10',
      lastUpdate: '2024-01-18',
      assignedCHW: 'Mary Nakato',
      interventions: [
        {
          id: 'int-2',
          type: 'screening',
          description: 'Nutritional assessment for all family members',
          date: '2024-01-12',
          duration: 90,
          participantsCount: 6,
          materials: ['Growth charts', 'MUAC tapes'],
          outcome: '2 children moderately malnourished, 1 at risk',
          followUpRequired: true,
          followUpDate: '2024-01-26',
          conductedBy: 'Mary Nakato',
          location: 'Home visit',
        },
      ],
      tags: ['nutrition', 'children', 'food-security'],
      resources: ['nutritional-supplements', 'counseling-materials'],
      followUpDate: '2024-01-26',
    },
    {
      id: '3',
      caseNumber: 'CC-2024-003',
      caseType: 'program',
      title: 'Child Immunization Campaign',
      description: 'Community-wide immunization campaign for children under 5. Target: 150 children in Zone 7.',
      status: 'active',
      priority: 'medium',
      affectedHouseholds: 45,
      affectedIndividuals: 150,
      location: {
        area: 'Zone 7, Nakawa Division',
        households: [],
      },
      reportedDate: '2024-01-08',
      lastUpdate: '2024-01-19',
      assignedCHW: 'Mary Nakato',
      collaboratingCHWs: ['John Mukasa', 'Grace Namuli'],
      interventions: [
        {
          id: 'int-3',
          type: 'prevention',
          description: 'Door-to-door immunization awareness',
          date: '2024-01-10',
          duration: 480,
          participantsCount: 120,
          materials: ['Immunization cards', 'Information leaflets'],
          outcome: '95 children registered for vaccination',
          followUpRequired: true,
          followUpDate: '2024-01-22',
          conductedBy: 'Team effort',
          location: 'Door-to-door',
        },
      ],
      tags: ['immunization', 'children', 'prevention', 'campaign'],
      resources: ['vaccines', 'cold-chain', 'registration-forms'],
      followUpDate: '2024-01-22',
      estimatedResolution: '2024-01-30',
    },
    {
      id: '4',
      caseNumber: 'CC-2024-004',
      caseType: 'environmental',
      title: 'Water Source Contamination',
      description: 'Community borehole showing signs of contamination. Several diarrhea cases reported.',
      status: 'escalated',
      priority: 'urgent',
      affectedHouseholds: 25,
      affectedIndividuals: 89,
      location: {
        area: 'Zone 6, Nakawa Division',
        households: [],
      },
      reportedDate: '2024-01-14',
      lastUpdate: '2024-01-20',
      assignedCHW: 'Mary Nakato',
      interventions: [
        {
          id: 'int-4',
          type: 'emergency_response',
          description: 'Water testing and temporary alternative sources',
          date: '2024-01-15',
          duration: 240,
          participantsCount: 89,
          materials: ['Water testing kits', 'Water purification tablets'],
          outcome: 'Contamination confirmed, alternative sources provided',
          followUpRequired: true,
          followUpDate: '2024-01-21',
          conductedBy: 'Mary Nakato with Health Inspector',
          location: 'Community borehole',
        },
      ],
      tags: ['water', 'contamination', 'diarrhea', 'emergency'],
      resources: ['water-testing-kits', 'purification-tablets', 'jerrycans'],
      followUpDate: '2024-01-21',
    },
    {
      id: '5',
      caseNumber: 'CC-2024-005',
      caseType: 'referral',
      title: 'Mental Health Support Follow-up',
      description: 'Following up on 3 community members referred for mental health services last month.',
      status: 'monitoring',
      priority: 'low',
      affectedHouseholds: 3,
      affectedIndividuals: 3,
      location: {
        area: 'Zone 7, Nakawa Division',
        households: ['HH-234', 'HH-245', 'HH-267'],
      },
      reportedDate: '2024-01-05',
      lastUpdate: '2024-01-17',
      assignedCHW: 'Mary Nakato',
      interventions: [
        {
          id: 'int-5',
          type: 'follow_up',
          description: 'Home visits to check on mental health progress',
          date: '2024-01-17',
          duration: 180,
          participantsCount: 3,
          materials: ['Mental health assessment forms'],
          outcome: '2 showing improvement, 1 needs continued support',
          followUpRequired: true,
          followUpDate: '2024-01-31',
          conductedBy: 'Mary Nakato',
          location: 'Home visits',
        },
      ],
      tags: ['mental-health', 'referral', 'follow-up'],
      resources: ['counseling-materials', 'assessment-forms'],
      followUpDate: '2024-01-31',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleCaseSelect = (communityCase: CommunityCase) => {
    Alert.alert(
      communityCase.title,
      `Case: ${communityCase.caseNumber}\nStatus: ${communityCase.status}\nPriority: ${communityCase.priority}\n\n${communityCase.description}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddCase = () => {
    setShowAddModal(true);
  };

  const handleCaseAdded = (newCase: CommunityCase) => {
    setCommunityCases(prev => [newCase, ...prev]);
    setShowAddModal(false);
  };

  return (
    <>
      <CommunityManagement
        cases={communityCases}
        onCaseSelect={handleCaseSelect}
        onAddCase={handleAddCase}
      />

      <AddCommunityCaseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleCaseAdded}
      />
    </>
  );
}
*/