import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProviderProfile from '@/dashboards/healthcare/components/ProviderProfile';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Healthcare Profile');

  return (
    <View style={styles.container}>
      <ProviderProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});