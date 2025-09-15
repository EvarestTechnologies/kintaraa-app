import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardOverview } from './components/DashboardOverview';
import { CaseManagement } from './components/CaseManagement';
import { SupportServices } from './components/SupportServices';
import { SafetyTools } from './components/SafetyTools';

export { DashboardOverview, CaseManagement, SupportServices, SafetyTools };

export default function SurvivorDashboard() {
  return (
    <View style={styles.container}>
      <DashboardOverview />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
});