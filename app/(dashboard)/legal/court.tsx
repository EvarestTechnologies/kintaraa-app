import React from 'react';
import { View, StyleSheet } from 'react-native';
import CourtSchedule from '@/dashboards/legal/components/CourtSchedule';

export default function CourtScreen() {
  console.log('🏛️ CourtScreen - Legal Court Schedule');

  return (
    <View style={styles.container}>
      <CourtSchedule />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});