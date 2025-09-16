import React from 'react';
import { View, StyleSheet } from 'react-native';
import CasesList from '@/dashboards/legal/components/CasesList';

export default function CasesScreen() {
  console.log('📋 CasesScreen - Legal Cases');

  return (
    <View style={styles.container}>
      <CasesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});