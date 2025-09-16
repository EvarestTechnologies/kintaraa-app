import React from 'react';
import { View, StyleSheet } from 'react-native';
import ResourceDirectory from '@/dashboards/social/components/ResourceDirectory';
import { CommunityResource } from '@/dashboards/social';

export default function ResourcesScreen() {
  console.log('📚 ResourcesScreen - Social Resources');

  // Mock resources for Resource Directory
  const mockResources: CommunityResource[] = [
    {
      id: '1',
      name: 'Community Food Bank',
      category: 'food',
      description: 'Emergency food assistance for families in need',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@foodbank.org',
      website: 'https://foodbank.org',
      hours: 'Mon-Fri 9AM-5PM',
      eligibility: ['Income below 200% of poverty level', 'Valid ID required'],
      services: ['Food packages', 'Fresh produce', 'Nutrition education'],
      capacity: 500,
      currentAvailability: 120,
      waitingList: 0,
      lastUpdated: '2024-12-15',
      isActive: true,
      contactPerson: 'Maria Rodriguez'
    }
  ];

  const handleResourceSelect = (resource: CommunityResource) => {
    console.log('Selected resource:', resource.name);
  };

  const handleAddResource = () => {
    console.log('Add new resource');
  };

  return (
    <View style={styles.container}>
      <ResourceDirectory
        resources={mockResources}
        onResourceSelect={handleResourceSelect}
        onAddResource={handleAddResource}
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