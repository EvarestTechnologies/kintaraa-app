import React, { useState } from 'react';
import CounselingResources from '@/dashboards/counseling/components/CounselingResources';
import AddResourceModal from '@/dashboards/counseling/components/AddResourceModal';
import { mockCounselingResources } from '@/dashboards/counseling/data/mockResources';
import type { CounselingResource } from '@/dashboards/counseling/index';

export default function ResourcesScreen() {
  console.log('📚 ResourcesScreen - Counseling Resources');

  const [resources, setResources] = useState<CounselingResource[]>(mockCounselingResources);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleResourceSelect = (resource: CounselingResource) => {
    console.log('Selected resource:', resource.title);
    // Handle resource selection - could open details modal, navigate, etc.
  };

  const handleAddResource = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = (newResource: CounselingResource) => {
    setResources(prev => [newResource, ...prev]);
    setShowAddModal(false);
    console.log('New resource added:', newResource.title);
  };

  return (
    <>
      <CounselingResources
        resources={resources}
        onResourceSelect={handleResourceSelect}
        onAddResource={handleAddResource}
      />

      <AddResourceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}