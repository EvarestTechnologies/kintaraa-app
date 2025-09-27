import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardOverview from '@/dashboards/gbv_rescue/components/DashboardOverview';

export default function GbvRescueDashboardScreen() {
  console.log('🚨 GbvRescueDashboardScreen - GBV Rescue Dashboard Home');

  return (
    <SafeAreaView style={styles.container}>
      <DashboardOverview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});