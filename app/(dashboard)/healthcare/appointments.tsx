import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppointmentsList from '@/dashboards/healthcare/components/AppointmentsList';

export default function AppointmentsScreen() {
  console.log('📅 AppointmentsScreen - Healthcare Appointments');

  return (
    <View style={styles.container}>
      <AppointmentsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});