import React from 'react';
import { View, StyleSheet } from 'react-native';
import PatientsList from '@/dashboards/healthcare/components/PatientsList';

export default function PatientsScreen() {
  console.log('👥 PatientsScreen - Healthcare Patients');

  return (
    <View style={styles.container}>
      <PatientsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});