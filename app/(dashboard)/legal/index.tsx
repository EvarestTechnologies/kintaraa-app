import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardOverview from '@/dashboards/legal/components/DashboardOverview';

export default function LegalDashboardScreen() {
  console.log('⚖️ LegalDashboardScreen - Legal Dashboard Home');

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