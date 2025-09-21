import React from 'react';
import { View, StyleSheet } from 'react-native';
import SurvivorProfile from '@/dashboards/survivor/components/SurvivorProfile';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Survivor Profile');

  return (
    <View style={styles.container}>
      <SurvivorProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',
  },
});