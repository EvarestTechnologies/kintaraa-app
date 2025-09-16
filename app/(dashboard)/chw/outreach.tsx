import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserPlus } from 'lucide-react-native';

export default function CHWOutreachScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Outreach</Text>
        <Text style={styles.subtitle}>Outreach programs and community engagement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoon}>
          <UserPlus color="#10B981" size={64} />
          <Text style={styles.comingSoonTitle}>Outreach Programs</Text>
          <Text style={styles.comingSoonText}>
            Community outreach activities, education programs, and engagement tracking coming soon.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});