import React, { useState } from 'react';
import { Alert } from 'react-native';
import { CommunityOutreach } from '@/dashboards/chw';
import AddOutreachEventModal from '@/dashboards/chw/components/AddOutreachEventModal';
import type { CommunityOutreachEvent } from '@/dashboards/chw';

export default function CHWOutreachScreen() {
  // Mock community outreach events data
  const [outreachEvents, setOutreachEvents] = useState<CommunityOutreachEvent[]>([
    {
      id: '1',
      name: 'World Health Day Community Fair',
      type: 'health_fair',
      description: 'Annual community health fair with free screenings, health education, and wellness activities for all ages.',
      date: '2024-04-07',
      startTime: '08:00',
      endTime: '16:00',
      location: 'Nakawa Community Center',
      targetPopulation: ['Families', 'Elderly', 'Children under 5'],
      expectedAttendance: 300,
      actualAttendance: 275,
      services: ['Blood pressure screening', 'Diabetes testing', 'BMI measurement', 'Health education', 'Vaccination', 'Eye screening'],
      partners: ['Nakawa Health Center', 'Red Cross Uganda', 'Lions Club'],
      coordinator: 'Mary Nakato',
      volunteers: ['John Mukasa', 'Sarah Nalwoga', 'Grace Namuli', 'Peter Ssali'],
      status: 'completed',
      budget: 2500,
      outcomes: {
        screeningsCompleted: 245,
        referralsMade: 32,
        educationMaterialsDistributed: 180,
        newPatientRegistrations: 28,
      },
      feedback: {
        rating: 4.6,
        comments: ['Very well organized', 'Great health education sessions', 'Need more diabetes screening'],
      },
    },
    {
      id: '2',
      name: 'Malaria Prevention Workshop',
      type: 'education_workshop',
      description: 'Community education workshop on malaria prevention, net distribution, and early detection in Zone 7.',
      date: '2024-02-15',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Zone 7 Primary School',
      targetPopulation: ['Households in Zone 7', 'Parents', 'Pregnant women'],
      expectedAttendance: 80,
      actualAttendance: 92,
      services: ['Malaria education', 'Net distribution', 'Home visit training', 'Symptom recognition'],
      partners: ['Ministry of Health', 'Malaria Consortium'],
      coordinator: 'Mary Nakato',
      volunteers: ['John Mukasa', 'Grace Namuli'],
      status: 'completed',
      budget: 800,
      outcomes: {
        screeningsCompleted: 0,
        referralsMade: 3,
        educationMaterialsDistributed: 92,
        newPatientRegistrations: 15,
      },
      feedback: {
        rating: 4.8,
        comments: ['Very informative', 'Practical demonstrations were helpful'],
      },
    },
    {
      id: '3',
      name: 'Child Immunization Drive',
      type: 'vaccination_clinic',
      description: 'Mobile immunization clinic targeting children under 5 years in underserved areas of Nakawa Division.',
      date: '2024-03-22',
      startTime: '09:00',
      endTime: '15:00',
      location: 'Mobile clinic - Multiple stops',
      targetPopulation: ['Children under 5', 'Pregnant women'],
      expectedAttendance: 120,
      actualAttendance: 134,
      services: ['Routine immunizations', 'Vitamin A supplements', 'Deworming', 'Growth monitoring'],
      partners: ['UNICEF', 'Gavi Alliance', 'Ministry of Health'],
      coordinator: 'Mary Nakato',
      volunteers: ['John Mukasa', 'Sarah Nalwoga', 'Dr. Kiwanuka'],
      status: 'completed',
      budget: 1200,
      outcomes: {
        screeningsCompleted: 134,
        referralsMade: 8,
        educationMaterialsDistributed: 100,
        newPatientRegistrations: 22,
      },
      feedback: {
        rating: 4.7,
        comments: ['Great mobile service', 'Reached many unreached children'],
      },
    },
    {
      id: '4',
      name: 'Mental Health Awareness Campaign',
      type: 'awareness_campaign',
      description: 'Community campaign to reduce mental health stigma and promote mental wellness in the community.',
      date: '2024-05-10',
      startTime: '10:00',
      endTime: '14:00',
      location: 'Nakawa Market Square',
      targetPopulation: ['General public', 'Youth', 'Community leaders'],
      expectedAttendance: 200,
      services: ['Mental health screening', 'Counseling sessions', 'Support group information', 'Resource distribution'],
      partners: ['Butabika Hospital', 'Mental Health Uganda', 'Community leaders'],
      coordinator: 'Mary Nakato',
      volunteers: ['Grace Namuli', 'Peter Ssali', 'Dr. Namuli'],
      status: 'planning',
      budget: 1500,
    },
    {
      id: '5',
      name: 'Maternal Health Support Group',
      type: 'support_group',
      description: 'Monthly support group meeting for pregnant women and new mothers in the community.',
      date: '2024-04-25',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Nakawa Health Center',
      targetPopulation: ['Pregnant women', 'New mothers', 'Women of reproductive age'],
      expectedAttendance: 25,
      actualAttendance: 28,
      services: ['Peer support', 'Health education', 'Nutrition counseling', 'Birth planning'],
      partners: ['Nakawa Health Center', 'USAID RHITES'],
      coordinator: 'Mary Nakato',
      volunteers: ['Sarah Nalwoga'],
      status: 'completed',
      outcomes: {
        screeningsCompleted: 28,
        referralsMade: 5,
        educationMaterialsDistributed: 30,
        newPatientRegistrations: 8,
      },
      feedback: {
        rating: 4.9,
        comments: ['Very supportive environment', 'Great peer learning'],
      },
    },
    {
      id: '6',
      name: 'Hypertension Screening Drive',
      type: 'screening_event',
      description: 'Community-wide blood pressure screening and hypertension awareness event targeting adults over 40.',
      date: '2024-06-01',
      startTime: '08:00',
      endTime: '12:00',
      location: 'Various community points',
      targetPopulation: ['Adults over 40', 'High-risk individuals'],
      expectedAttendance: 150,
      services: ['Blood pressure measurement', 'Risk assessment', 'Lifestyle counseling', 'Medication adherence support'],
      partners: ['Heart Foundation Uganda', 'Nakawa Health Center'],
      coordinator: 'Mary Nakato',
      volunteers: ['John Mukasa', 'Grace Namuli'],
      status: 'active',
      budget: 600,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleEventSelect = (event: CommunityOutreachEvent) => {
    Alert.alert(
      event.name,
      `Type: ${event.type.replace('_', ' ').toUpperCase()}\nDate: ${event.date}\nStatus: ${event.status}\n\n${event.description}`,
      [{ text: 'OK' }]
    );
  };

  const handleCreateEvent = () => {
    setShowAddModal(true);
  };

  const handleEventAdded = (newEvent: CommunityOutreachEvent) => {
    setOutreachEvents(prev => [newEvent, ...prev]);
    setShowAddModal(false);
  };

  return (
    <>
      <CommunityOutreach
        events={outreachEvents}
        onEventSelect={handleEventSelect}
        onCreateEvent={handleCreateEvent}
      />

      <AddOutreachEventModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleEventAdded}
      />
    </>
  );
}