import React, { useState } from 'react';
import { Alert } from 'react-native';
import { LocationManagement } from '@/dashboards/chw';
import AddLocationModal from '@/dashboards/chw/components/AddLocationModal';
import type { CHWLocation, LocationStats } from '@/dashboards/chw';

export default function CHWLocationsScreen() {
  // Mock location stats
  const [stats] = useState<LocationStats>({
    totalLocations: 48,
    activeHouseholds: 35,
    totalPopulation: 156,
    highRiskAreas: 3,
    healthFacilities: 2,
    recentVisits: 12,
    pendingVisits: 8,
    vaccinationCoverage: 78,
  });

  // Mock locations data
  const [locations, setLocations] = useState<CHWLocation[]>([
    {
      id: 'HH-2024-001',
      name: 'Wamala Family Compound',
      type: 'household',
      category: 'Multi-family household',
      address: 'Plot 47, Zone 7, Nakawa Division, Kampala',
      zone: 'Zone 7',
      status: 'active',
      population: {
        total: 12,
        adults: 6,
        children: 4,
        elderly: 2,
        pregnant: 1,
      },
      healthData: {
        vaccinationRate: 85,
        chronicConditions: ['Diabetes', 'Hypertension'],
        riskFactors: ['Poor sanitation', 'Overcrowding'],
        lastVisit: '2024-01-15',
        nextVisit: '2024-01-29',
      },
      facilities: {
        waterAccess: true,
        sanitationAccess: false,
        electricityAccess: true,
        roadAccess: 'good',
      },
      contacts: {
        householdHead: 'Moses Wamala',
        phone: '+256 704 123 456',
        emergencyContact: '+256 704 123 457',
      },
      assignedCHW: 'Mary Nakato',
      collaboratingCHWs: ['John Mukasa'],
      notes: 'Family needs sanitation improvement. Grandmother has diabetes requiring regular monitoring.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-20',
      tags: ['diabetes-care', 'elderly-monitoring', 'sanitation-priority'],
    },
    {
      id: 'HF-2024-001',
      name: 'Nakawa Health Center III',
      type: 'health_facility',
      category: 'Primary Healthcare',
      address: 'Nakawa Road, Zone 5, Nakawa Division',
      zone: 'Zone 5',
      status: 'active',
      facilities: {
        waterAccess: true,
        sanitationAccess: true,
        electricityAccess: true,
        roadAccess: 'good',
      },
      contacts: {
        householdHead: 'Dr. Sarah Nalwoga',
        phone: '+256 704 111 222',
      },
      healthData: {
        vaccinationRate: 95,
        chronicConditions: [],
        riskFactors: [],
      },
      assignedCHW: 'Mary Nakato',
      notes: 'Main referral center for Zone 7. Good partnership for community outreach.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-18',
      tags: ['referral-center', 'vaccination-site', 'partnership'],
    },
    {
      id: 'HH-2024-002',
      name: 'Ssemakula Household',
      type: 'household',
      category: 'Single family',
      address: 'House 23B, Zone 6, Nakawa Division',
      zone: 'Zone 6',
      status: 'monitoring',
      population: {
        total: 8,
        adults: 4,
        children: 3,
        elderly: 1,
        pregnant: 0,
      },
      healthData: {
        vaccinationRate: 60,
        chronicConditions: ['Malnutrition'],
        riskFactors: ['Food insecurity', 'Limited healthcare access'],
        lastVisit: '2024-01-10',
        nextVisit: '2024-01-24',
      },
      facilities: {
        waterAccess: false,
        sanitationAccess: false,
        electricityAccess: false,
        roadAccess: 'poor',
      },
      contacts: {
        householdHead: 'Peter Ssemakula',
        phone: '+256 704 333 444',
      },
      assignedCHW: 'Mary Nakato',
      notes: 'High priority for nutrition intervention. Water source is 500m away.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-19',
      tags: ['nutrition-support', 'water-access', 'high-priority'],
    },
    {
      id: 'CI-2024-001',
      name: 'Zone 7 Primary School',
      type: 'community_infrastructure',
      category: 'Educational facility',
      address: 'Zone 7, Nakawa Division',
      zone: 'Zone 7',
      status: 'active',
      population: {
        total: 450,
        adults: 25,
        children: 425,
        elderly: 0,
        pregnant: 0,
      },
      healthData: {
        vaccinationRate: 92,
        chronicConditions: [],
        riskFactors: ['Overcrowding during outbreaks'],
      },
      facilities: {
        waterAccess: true,
        sanitationAccess: true,
        electricityAccess: true,
        roadAccess: 'good',
      },
      contacts: {
        householdHead: 'Grace Namuli (Head Teacher)',
        phone: '+256 704 555 666',
      },
      assignedCHW: 'Mary Nakato',
      collaboratingCHWs: ['John Mukasa', 'Grace Namuli'],
      notes: 'Excellent venue for health education sessions. Monthly immunization outreach.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-17',
      tags: ['education-venue', 'immunization-site', 'community-gathering'],
    },
    {
      id: 'RA-2024-001',
      name: 'Contaminated Water Source',
      type: 'risk_area',
      category: 'Environmental health risk',
      address: 'Swamp area, Zone 8, Nakawa Division',
      zone: 'Zone 8',
      status: 'high_risk',
      healthData: {
        vaccinationRate: 0,
        chronicConditions: [],
        riskFactors: ['Water contamination', 'Vector breeding', 'Infectious disease risk'],
      },
      facilities: {
        waterAccess: false,
        sanitationAccess: false,
        electricityAccess: false,
        roadAccess: 'none',
      },
      assignedCHW: 'Mary Nakato',
      notes: 'Major malaria breeding site. Requires regular monitoring and community education.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-21',
      tags: ['malaria-risk', 'water-contamination', 'monitoring-required'],
    },
    {
      id: 'SP-2024-001',
      name: 'Mobile Clinic Stop - Market',
      type: 'service_point',
      category: 'Temporary service location',
      address: 'Nakawa Market Square, Zone 5',
      zone: 'Zone 5',
      status: 'active',
      healthData: {
        vaccinationRate: 0,
        chronicConditions: [],
        riskFactors: [],
      },
      facilities: {
        waterAccess: true,
        sanitationAccess: true,
        electricityAccess: true,
        roadAccess: 'good',
      },
      contacts: {
        householdHead: 'Market Chairman',
        phone: '+256 704 777 888',
      },
      assignedCHW: 'Mary Nakato',
      notes: 'Weekly mobile clinic every Friday 9am-3pm. High foot traffic location.',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-16',
      tags: ['mobile-clinic', 'weekly-service', 'high-traffic'],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleLocationSelect = (location: CHWLocation) => {
    Alert.alert(
      location.name,
      `Type: ${location.type.replace('_', ' ').toUpperCase()}\nZone: ${location.zone}\nStatus: ${location.status}\n\n${location.notes || 'No additional notes'}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddLocation = () => {
    setShowAddModal(true);
  };

  const handleLocationAdded = (newLocation: CHWLocation) => {
    setLocations(prev => [newLocation, ...prev]);
    setShowAddModal(false);
  };

  return (
    <>
      <LocationManagement
        locations={locations}
        stats={stats}
        onLocationSelect={handleLocationSelect}
        onAddLocation={handleAddLocation}
      />

      <AddLocationModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleLocationAdded}
      />
    </>
  );
}