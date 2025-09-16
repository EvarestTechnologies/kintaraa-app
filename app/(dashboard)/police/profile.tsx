import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PoliceProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Police Profile</Text>
      <Text style={styles.subText}>Profile management for police officers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});