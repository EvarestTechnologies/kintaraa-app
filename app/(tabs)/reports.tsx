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
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';

// Mock data for reports
const mockReports = [
  {
    id: 'KIN-241201001',
    type: 'Physical Violence',
    status: 'under_review',
    date: '2024-12-01',
    severity: 'high',
  },
  {
    id: 'KIN-241128002',
    type: 'Emotional Abuse',
    status: 'completed',
    date: '2024-11-28',
    severity: 'medium',
  },
  {
    id: 'KIN-241125003',
    type: 'Economic Abuse',
    status: 'in_progress',
    date: '2024-11-25',
    severity: 'low',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle color="#43A047" size={20} />;
    case 'in_progress':
      return <Clock color="#FF9800" size={20} />;
    case 'under_review':
      return <AlertCircle color="#6A2CB0" size={20} />;
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
    case 'under_review':
      return 'Under Review';
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
        {mockReports.length === 0 ? (
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
            {mockReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                testID={`report-${report.id}`}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportId}>{report.id}</Text>
                    <Text style={styles.reportType}>{report.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(report.severity) },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {report.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportDetails}>
                  <View style={styles.reportStatus}>
                    {getStatusIcon(report.status)}
                    <Text style={styles.statusText}>
                      {getStatusText(report.status)}
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    {new Date(report.date).toLocaleDateString('en-US', {
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
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
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