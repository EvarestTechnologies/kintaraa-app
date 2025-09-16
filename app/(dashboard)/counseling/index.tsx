import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardOverview from '@/dashboards/counseling/components/DashboardOverview';

export default function CounselingDashboardScreen() {
  console.log('🧠 CounselingDashboardScreen - Counseling Dashboard Home');

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