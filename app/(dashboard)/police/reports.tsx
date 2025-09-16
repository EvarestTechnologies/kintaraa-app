import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReportsList from '@/dashboards/police/components/ReportsList';

export default function PoliceReportsScreen() {
  return (
    <View style={styles.container}>
      <ReportsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});