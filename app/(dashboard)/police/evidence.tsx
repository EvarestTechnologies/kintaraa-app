import React from 'react';
import { View, StyleSheet } from 'react-native';
import EvidenceManager from '@/dashboards/police/components/EvidenceManager';

export default function PoliceEvidenceScreen() {
  return (
    <View style={styles.container}>
      <EvidenceManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});