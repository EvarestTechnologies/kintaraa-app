import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';

export default function ProvidersScreen() {
  console.log('🗺️ ProvidersScreen - Provider Network');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Provider Network</Text>
          <Text style={styles.headerSubtitle}>View and manage service providers</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.placeholderContainer}>
            <MapPin size={64} color="#D1D5DB" />
            <Text style={styles.placeholderTitle}>Provider Network Map</Text>
            <Text style={styles.placeholderText}>
              View available providers by location and specialty
            </Text>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Features</Text>
            <Text style={styles.infoListItem}>• View all registered providers</Text>
            <Text style={styles.infoListItem}>• Check provider availability</Text>
            <Text style={styles.infoListItem}>• View provider specializations</Text>
            <Text style={styles.infoListItem}>• Geographic proximity mapping</Text>
            <Text style={styles.infoListItem}>• Provider performance metrics</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6A2CB0',
    padding: 24,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 12,
    color: '#6A2CB0',
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F0FF',
    borderRadius: 16,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 12,
  },
  infoListItem: {
    fontSize: 14,
    color: '#1565C0',
    marginTop: 8,
  },
});
