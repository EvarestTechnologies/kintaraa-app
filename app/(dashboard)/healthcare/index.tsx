import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardOverview from '@/dashboards/healthcare/components/DashboardOverview';

export default function HealthcareDashboardScreen() {
  console.log('🏥 HealthcareDashboardScreen - Healthcare Dashboard Home');

  return (
    <View style={styles.container}>
      <DashboardOverview />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});