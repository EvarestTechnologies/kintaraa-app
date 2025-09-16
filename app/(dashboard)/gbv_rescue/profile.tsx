import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GBVRescueProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GBV Rescue Profile</Text>
      <Text style={styles.subtitle}>GBV Rescue Center Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
});