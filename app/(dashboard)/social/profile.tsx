import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ProfileScreen() {
  console.log('👤 ProfileScreen - Social Profile');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Social Worker Profile</Text>
        <Text style={styles.subtitle}>Profile management coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});