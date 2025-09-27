import React from 'react';
import { View, StyleSheet } from 'react-native';
import GBVProfile from '@/dashboards/gbv_rescue/components/GBVProfile';

export default function GBVRescueProfileScreen() {
  console.log('👤 ProfileScreen - GBV Rescue Profile');

  return (
    <View style={styles.container}>
      <GBVProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});
