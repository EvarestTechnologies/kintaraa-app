import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ResourceDirectory from '@/dashboards/social/components/ResourceDirectory';
import AddResourceModal from '@/dashboards/social/components/AddResourceModal';
import { CommunityResource } from '@/dashboards/social';

export default function ResourcesScreen() {
  console.log('📚 ResourcesScreen - Social Resources');
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [resources, setResources] = useState<CommunityResource[]>([
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
  ]);

  const handleResourceSelect = (resource: CommunityResource) => {
    console.log('Selected resource:', resource.name);
  };

  const handleAddResource = () => {
    setIsAddModalVisible(true);
  };

  const handleAddSuccess = (newResource: CommunityResource) => {
    setResources(prev => [newResource, ...prev]);
  };

  return (
    <View style={styles.container}>
      <ResourceDirectory
        resources={resources}
        onResourceSelect={handleResourceSelect}
        onAddResource={handleAddResource}
      />

      <AddResourceModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={handleAddSuccess}
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