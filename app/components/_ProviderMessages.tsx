/**
 * Shared Messages screen for all provider dashboards.
 * Shows accepted/in-progress cases with a link to the chat for each.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MessageCircle, ChevronRight, Clock } from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { Incident } from '@/providers/IncidentProvider';

export default function ProviderMessages() {
  const { assignedCases, isLoading } = useProvider();

  // Only cases where a conversation can exist (provider accepted)
  const activeCases = (assignedCases as Incident[]).filter(
    (c) => c.status === 'assigned' || c.status === 'in_progress'
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6A2CB0" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Communicate with survivors on your active cases</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {activeCases.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle color="#D8CEE8" size={64} />
            <Text style={styles.emptyTitle}>No active cases</Text>
            <Text style={styles.emptyDescription}>
              Messages will appear here once you accept a case assignment.
            </Text>
          </View>
        ) : (
          activeCases.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={styles.caseCard}
              onPress={() => router.push(`/messages/${incident.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.caseIcon}>
                <MessageCircle color="#6A2CB0" size={22} />
              </View>
              <View style={styles.caseInfo}>
                <Text style={styles.caseNumber}>{incident.case_number}</Text>
                <Text style={styles.caseType}>
                  {(incident as any).type_display ?? incident.type}
                </Text>
                <View style={styles.caseFooter}>
                  <Clock color="#49455A80" size={11} />
                  <Text style={styles.caseDate}>
                    {new Date(incident.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      incident.status === 'in_progress' && styles.statusBadgeActive,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {incident.status === 'in_progress' ? 'In Progress' : 'Assigned'}
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight color="#D8CEE8" size={20} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FF' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#341A52' },
  subtitle: { fontSize: 13, color: '#49455A', marginTop: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { flex: 1, padding: 16 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#341A52', marginTop: 16, marginBottom: 8 },
  emptyDescription: { fontSize: 14, color: '#49455A', textAlign: 'center', lineHeight: 20 },
  caseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  caseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  caseInfo: { flex: 1 },
  caseNumber: { fontSize: 16, fontWeight: '700', color: '#341A52', marginBottom: 2 },
  caseType: { fontSize: 13, color: '#49455A', marginBottom: 6 },
  caseFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  caseDate: { fontSize: 11, color: '#49455A80', marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#E8E0F5' },
  statusBadgeActive: { backgroundColor: '#D1FAE5' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#341A52' },
});
