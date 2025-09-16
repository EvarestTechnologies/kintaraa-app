import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardOverview from '@/dashboards/social/components/DashboardOverview';
import { SocialServicesStats } from '@/dashboards/social';

export default function SocialDashboardScreen() {
  console.log('🤝 SocialDashboardScreen - Social Dashboard Home');

  // Mock stats for Social Services dashboard
  const mockStats: SocialServicesStats = {
    totalClients: 312,
    activeServices: 28,
    completedReferrals: 156,
    pendingAssessments: 23,
    communityPrograms: 12,
    resourcesProvided: 89,
    averageServiceTime: 45,
    clientSatisfactionRate: 4.7,
  };

  const handleNavigate = (screen: string) => {
    console.log('Social Navigate to:', screen);
    // Handle navigation based on screen
  };

  return (
    <View style={styles.container}>
      <DashboardOverview stats={mockStats} onNavigate={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});