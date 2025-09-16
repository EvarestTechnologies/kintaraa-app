import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardOverview as SurvivorDashboard } from '@/dashboards/survivor/components/DashboardOverview';

export default function SurvivorHomeScreen() {
  return (
    <View style={styles.container}>
      <SurvivorDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
});