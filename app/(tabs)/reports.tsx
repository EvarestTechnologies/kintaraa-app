import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react-native';
import { useIncidents } from '@/providers/IncidentProvider';

const incidentTypeLabels = {
  physical: 'Physical Violence',
  sexual: 'Sexual Violence',
  emotional: 'Emotional/Psychological Abuse',
  economic: 'Economic Abuse',
  online: 'Online Gender-Based Violence',
  femicide: 'Femicide/Attempted Femicide',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle color="#43A047" size={20} />;
    case 'in_progress':
      return <Clock color="#FF9800" size={20} />;
    case 'assigned':
      return <AlertCircle color="#6A2CB0" size={20} />;
    case 'new':
      return <FileText color="#49455A" size={20} />;
    case 'closed':
      return <CheckCircle color="#757575" size={20} />;
    default:
      return <FileText color="#49455A" size={20} />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'assigned':
      return 'Assigned';
    case 'new':
      return 'New';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return '#E53935';
    case 'medium':
      return '#FF9800';
    case 'low':
      return '#43A047';
    default:
      return '#49455A';
  }
};

export default function ReportsScreen() {
  const { incidents, isLoading } = useIncidents();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Reports</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => router.push('/report')}
          testID="new-report-button"
        >
          <Plus color="#FFFFFF" size={20} />
          <Text style={styles.newReportButtonText}>New Report</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {incidents.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#D8CEE8" size={64} />
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptyDescription}>
              When you submit incident reports, they will appear here for tracking and follow-up.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/report')}
            >
              <Text style={styles.emptyButtonText}>Create First Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsList}>
            {incidents.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                style={styles.reportCard}
                testID={`report-${incident.id}`}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportId}>{incident.caseNumber}</Text>
                    <Text style={styles.reportType}>
                      {incidentTypeLabels[incident.type] || incident.type}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(incident.severity || 'medium') },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {(incident.severity || 'medium').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportDetails}>
                  <View style={styles.reportStatus}>
                    {getStatusIcon(incident.status)}
                    <Text style={styles.statusText}>
                      {getStatusText(incident.status)}
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    {new Date(incident.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>

                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  {incident.messages.length > 0 && (
                    <TouchableOpacity style={styles.messageButton}>
                      <MessageCircle color="#6A2CB0" size={16} />
                      <Text style={styles.messageButtonText}>
                        {incident.messages.length} message{incident.messages.length !== 1 ? 's' : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {incident.assignedProviderId && (
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerText}>
                      Assigned to case worker
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpDescription}>
            Our support team is here to assist you with your reports and connect you with appropriate services.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  newReportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reportsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  reportDate: {
    fontSize: 14,
    color: '#49455A',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F0FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#49455A',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  messageButtonText: {
    color: '#6A2CB0',
    fontSize: 12,
    fontWeight: '600',
  },
  providerInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  providerText: {
    fontSize: 12,
    color: '#43A047',
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  helpDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#E24B95',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});