import React from 'react';
import { View, StyleSheet } from 'react-native';
import EmergencyCases from '@/dashboards/gbv_rescue/components/EmergencyCases';

export default function EmergencyScreen() {
  console.log('🚨 EmergencyScreen - GBV Emergency Cases');

  return (
    <View style={styles.container}>
      <EmergencyCases />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});