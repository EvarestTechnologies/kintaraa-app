import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ResourcesScreen() {
  console.log('📚 ResourcesScreen - Counseling Resources');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Counseling Resources</Text>
        <Text style={styles.subtitle}>Therapeutic resources and materials coming soon...</Text>
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