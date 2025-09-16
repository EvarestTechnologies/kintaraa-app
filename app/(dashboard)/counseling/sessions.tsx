import React from 'react';
import { View, StyleSheet } from 'react-native';
import SessionsList from '@/dashboards/counseling/components/SessionsList';

export default function SessionsScreen() {
  console.log('📅 SessionsScreen - Counseling Sessions');

  return (
    <View style={styles.container}>
      <SessionsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});