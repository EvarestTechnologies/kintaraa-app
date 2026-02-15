import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DispatcherProfile } from '@/dashboards/dispatcher';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Dispatcher Profile');

  return (
    <View style={styles.container}>
      <DispatcherProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
