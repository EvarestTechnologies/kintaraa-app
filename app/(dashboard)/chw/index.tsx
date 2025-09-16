import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import CHWDashboard from '@/dashboards/chw/components/DashboardOverview';
import { CHWStats } from '@/dashboards/chw';

export default function CHWDashboardScreen() {
  // Mock stats for CHW dashboard
  const mockStats: CHWStats = {
    totalPatients: 145,
    activePatients: 98,
    completedScreenings: 67,
    pendingReferrals: 12,
    educationSessions: 8,
    communityEvents: 3,
    averageFollowUpTime: 24,
    patientSatisfactionRate: 4.6,
  };

  const handleNavigate = (section: string) => {
    console.log('CHW Navigate to:', section);
    // Handle navigation based on section
  };

  return (
    <View style={styles.container}>
      <CHWDashboard stats={mockStats} onNavigate={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});