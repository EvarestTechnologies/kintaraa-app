import React from 'react';
import { View, StyleSheet } from 'react-native';
import LegalProfile from '@/dashboards/legal/components/LegalProfile';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Legal Profile');

  return (
    <View style={styles.container}>
      <LegalProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
});