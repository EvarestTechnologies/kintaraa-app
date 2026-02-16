import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyCases from '@/app/components/_MyCases';

export default function CasesScreen() {
  console.log('📋 CasesScreen - Social Services My Cases');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MyCases />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});