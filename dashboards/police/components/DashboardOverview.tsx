import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, FileText, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';
import NewCaseModal from './NewCaseModal';
import NewEvidenceModal from './NewEvidenceModal';
import NewReportModal from './NewReportModal';
import type { PoliceStats, PoliceCase } from '../index';

const mockPoliceStats: PoliceStats = {
  totalCases: 156,
  activeCases: 23,
  evidenceItems: 89,
  reportsGenerated: 45,
  casesResolved: 12,
  averageResponseTime: 8.5
};

const mockCases: PoliceCase[] = [
  {
    id: '1',
    caseNumber: 'DV-2025-001',
    incidentType: 'domestic_violence',
    status: 'open',
    priority: 'high',
    reportedDate: '2025-01-15',
    incidentDate: '2025-01-15',
    location: '123 Main St, Springfield',
    reportingOfficer: 'Officer Smith',
    assignedDetective: 'Officer Johnson',
    victimName: 'Jane Doe',
    victimId: 'V001',
    suspectName: 'John Doe',
    description: 'Domestic violence incident reported',
    lastActivity: '2025-01-16',
    evidenceCount: 3,
    witnessCount: 2
  },
  {
    id: '2',
    caseNumber: 'SA-2025-003',
    incidentType: 'sexual_assault',
    status: 'under_investigation',
    priority: 'urgent',
    reportedDate: '2025-01-14',
    incidentDate: '2025-01-14',
    location: 'Downtown Area',
    reportingOfficer: 'Hotline Officer',
    assignedDetective: 'Detective Brown',
    victimName: 'Anonymous',
    victimId: 'V002',
    description: 'Sexual assault case under investigation',
    lastActivity: '2025-01-16',
    evidenceCount: 5,
    witnessCount: 1
  }
];

const DashboardOverview: React.FC = () => {
  const stats = mockPoliceStats;
  const router = useRouter();

  // Modal states
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showNewEvidenceModal, setShowNewEvidenceModal] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // Quick action handlers
  const handleNewCase = () => {
    setShowNewCaseModal(true);
  };

  const handleAddEvidence = () => {
    setShowNewEvidenceModal(true);
  };

  const handleGenerateReport = () => {
    setShowNewReportModal(true);
  };

  const handleEmergencyAlert = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to send an emergency alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Alert Sent', 'Emergency alert has been sent to all units.');
          }
        }
      ]
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const QuickAction: React.FC<{
    title: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
  }> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Police Dashboard</Text>
        <Text style={styles.subtitle}>Case Management & Evidence Tracking</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<Shield color="#3B82F6" />}
          color="#3B82F6"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={<Search color="#F59E0B" />}
          color="#F59E0B"
        />
        <StatCard
          title="Evidence Items"
          value={stats.evidenceItems}
          icon={<FileText color="#8B5CF6" />}
          color="#8B5CF6"
        />
        <StatCard
          title="Reports Generated"
          value={stats.reportsGenerated}
          icon={<FileText color="#10B981" />}
          color="#10B981"
          subtitle="This month"
        />
        <StatCard
          title="Cases Resolved"
          value={stats.casesResolved}
          icon={<CheckCircle color="#059669" />}
          color="#059669"
          subtitle="This month"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime} min`}
          icon={<Clock color="#DC2626" />}
          color="#DC2626"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="New Case"
            icon={<Shield color="white" />}
            color="#3B82F6"
            onPress={handleNewCase}
          />
          <QuickAction
            title="Add Evidence"
            icon={<FileText color="white" />}
            color="#8B5CF6"
            onPress={handleAddEvidence}
          />
          <QuickAction
            title="Generate Report"
            icon={<FileText color="white" />}
            color="#10B981"
            onPress={handleGenerateReport}
          />
          <QuickAction
            title="Emergency Alert"
            icon={<AlertTriangle color="white" />}
            color="#DC2626"
            onPress={handleEmergencyAlert}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#3B82F620' }]}>
              <Shield color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New case assigned: DV-2025-001</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#8B5CF620' }]}>
              <FileText color="#8B5CF6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Evidence collected for case SA-2025-003</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#10B98120' }]}>
              <CheckCircle color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Case closed: HR-2025-002</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>

      {/* Modals */}
      <NewCaseModal
        visible={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={(newCase) => {
          setShowNewCaseModal(false);
          Alert.alert('Success', 'New case created successfully!');
        }}
      />

      <NewEvidenceModal
        visible={showNewEvidenceModal}
        onClose={() => setShowNewEvidenceModal(false)}
        onSuccess={(newEvidence) => {
          setShowNewEvidenceModal(false);
          Alert.alert('Success', 'Evidence added successfully!');
        }}
        cases={mockCases}
      />

      <NewReportModal
        visible={showNewReportModal}
        onClose={() => setShowNewReportModal(false)}
        onSuccess={(newReport) => {
          setShowNewReportModal(false);
          Alert.alert('Success', 'Report generated successfully!');
        }}
        cases={mockCases}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1E293B',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1E293B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default DashboardOverview;