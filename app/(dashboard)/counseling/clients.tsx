import React from 'react';
import { View, StyleSheet } from 'react-native';
import ClientsList from '@/dashboards/counseling/components/ClientsList';

export default function ClientsScreen() {
  console.log('👥 ClientsScreen - Counseling Clients');

  return (
    <View style={styles.container}>
      <ClientsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});