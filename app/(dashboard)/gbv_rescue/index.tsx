import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardOverview from '@/dashboards/gbv_rescue/components/DashboardOverview';

export default function GbvRescueDashboardScreen() {
  console.log('🚨 GbvRescueDashboardScreen - GBV Rescue Dashboard Home');

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