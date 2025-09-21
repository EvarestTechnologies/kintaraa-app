import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoliceProfile from '@/dashboards/police/components/PoliceProfile';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Police Profile');

  return (
    <View style={styles.container}>
      <PoliceProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});