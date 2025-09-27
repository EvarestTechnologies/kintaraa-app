import React from 'react';
import { View, StyleSheet } from 'react-native';
import SocialProfile from '@/dashboards/social/components/SocialProfile';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Social Profile');

  return (
    <View style={styles.container}>
      <SocialProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
