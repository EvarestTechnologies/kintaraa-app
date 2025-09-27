import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmergencyCases from '@/dashboards/gbv_rescue/components/EmergencyCases';

export default function EmergencyScreen() {
  console.log('🚨 EmergencyScreen - GBV Emergency Cases');

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyCases />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});