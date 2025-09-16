import React from 'react';
import { View, StyleSheet } from 'react-native';
import MedicalRecords from '@/dashboards/healthcare/components/MedicalRecords';

export default function RecordsScreen() {
  console.log('📋 RecordsScreen - Healthcare Records');

  return (
    <View style={styles.container}>
      <MedicalRecords />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});