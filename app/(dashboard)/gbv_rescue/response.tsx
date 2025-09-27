import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResponseTeam from '@/dashboards/gbv_rescue/components/ResponseTeam';

export default function GBVRescueResponseScreen() {
  console.log('🚨 ResponseScreen - GBV Response Operations');

  return (
    <SafeAreaView style={styles.container}>
      <ResponseTeam />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});