import React from 'react';
import { View, StyleSheet } from 'react-native';
import CasesList from '@/dashboards/police/components/CasesList';

export default function PoliceCasesScreen() {
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