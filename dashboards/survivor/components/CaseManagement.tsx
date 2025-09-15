import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useIncidents } from '@/providers/IncidentProvider';
import { router } from 'expo-router';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
} from 'lucide-react-native';

export function CaseManagement() {
  const { incidents } = useIncidents();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#FF9800';
      case 'assigned': return '#2196F3';
      case 'in_progress': return '#9C27B0';
      case 'completed': return '#4CAF50';
      case 'closed': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return AlertTriangle;
      case 'assigned': return Clock;
      case 'in_progress': return Clock;
      case 'completed': return CheckCircle;
      case 'closed': return CheckCircle;
      default: return FileText;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases</Text>
        <Text style={styles.subtitle}>Track your support cases and progress</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FileText color="#6A2CB0" size={24} />
          <Text style={styles.statNumber}>{incidents.length}</Text>
          <Text style={styles.statLabel}>Total Cases</Text>
        </View>
        <View style={styles.statCard}>
          <Clock color="#FF9800" size={24} />
          <Text style={styles.statNumber}>
            {incidents.filter(i => i.status === 'assigned' || i.status === 'in_progress').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle color="#4CAF50" size={24} />
          <Text style={styles.statNumber}>
            {incidents.filter(i => i.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.casesList}>
        {incidents.map((incident) => {
          const StatusIcon = getStatusIcon(incident.status);
          return (
            <TouchableOpacity
              key={incident.id}
              style={styles.caseCard}
              onPress={() => router.push(`/case-details/${incident.id}`)}
            >
              <View style={styles.caseHeader}>
                <View style={styles.caseInfo}>
                  <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
                  <Text style={styles.caseType}>{incident.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) }]}>
                  <StatusIcon color="#FFFFFF" size={12} />
                  <Text style={styles.statusText}>{incident.status.replace('_', ' ')}</Text>
                </View>
              </View>
              
              <Text style={styles.caseDescription} numberOfLines={2}>
                {incident.description}
              </Text>
              
              <View style={styles.caseFooter}>
                <View style={styles.dateContainer}>
                  <Calendar color="#49455A" size={14} />
                  <Text style={styles.caseDate}>
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Eye color="#6A2CB0" size={16} />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {incidents.length === 0 && (
        <View style={styles.emptyState}>
          <FileText color="#D8CEE8" size={64} />
          <Text style={styles.emptyTitle}>No Cases Yet</Text>
          <Text style={styles.emptyDescription}>
            When you report an incident or request support, your cases will appear here.
          </Text>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push('/report')}
          >
            <Text style={styles.reportButtonText}>Report an Incident</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#49455A',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  casesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caseInfo: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  caseType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  caseDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  caseDate: {
    fontSize: 12,
    color: '#49455A',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  reportButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});