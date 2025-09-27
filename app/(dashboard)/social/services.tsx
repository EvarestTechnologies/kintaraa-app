import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ServicesList from '@/dashboards/social/components/ServicesList';
import AddServiceModal from '@/dashboards/social/components/AddServiceModal';
import { SocialService } from '@/dashboards/social';

export default function ServicesScreen() {
  console.log('🔧 ServicesScreen - Social Services');
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [services, setServices] = useState<SocialService[]>([
    {
      id: '1',
      clientId: 'client-001',
      clientName: 'Jane Smith',
      serviceType: 'housing',
      status: 'in_progress',
      priority: 'high',
      requestDate: '2024-12-10',
      approvalDate: '2024-12-12',
      description: 'Emergency housing assistance needed',
      eligibilityCriteria: ['Income verification', 'Proof of emergency'],
      documentsRequired: ['ID', 'Income statement', 'Eviction notice'],
      documentsSubmitted: ['ID', 'Income statement'],
      provider: 'City Housing Authority',
      cost: 0,
      notes: 'Client facing eviction, needs immediate assistance',
      caseId: 'case-001'
    }
  ]);

  const handleServiceSelect = (service: SocialService) => {
    console.log('Selected service:', service.id);
  };

  const handleAddService = () => {
    setIsAddModalVisible(true);
  };

  const handleAddSuccess = (newService: SocialService) => {
    setServices(prev => [newService, ...prev]);
  };

  return (
    <View style={styles.container}>
      <ServicesList
        services={services}
        onServiceSelect={handleServiceSelect}
        onAddService={handleAddService}
      />

      <AddServiceModal
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