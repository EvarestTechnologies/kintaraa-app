import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardOverview } from '@/dashboards/dispatcher';

export default function DispatcherDashboardScreen() {
  console.log('📋 DispatcherDashboardScreen - Dispatcher Dashboard Home');

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
