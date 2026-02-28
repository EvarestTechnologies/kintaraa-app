import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  Search,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProvider } from '@/providers/ProviderContext';
import { AppointmentStatusService } from '@/services/appointmentStatusService';
import { AppointmentReminderService } from '@/services/appointmentReminderService';
import AppointmentCalendarView from './AppointmentCalendarView';
import AppointmentAnalytics from './AppointmentAnalytics';

const { width } = Dimensions.get('window');

type ViewMode = 'overview' | 'calendar' | 'analytics' | 'management';

const viewModes = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'analytics', label: 'Analytics', icon: TrendingUp },
  { key: 'management', label: 'Management', icon: Users },
] as const;

export default function AppointmentManagementDashboard() {
  const { assignedCases } = useProvider();
  const [selectedView, setSelectedView] = useState<ViewMode>('overview');

  // Get statistics from services
  const statusSummary = useMemo(() => AppointmentStatusService.getStatusSummary(), []);
  const reminderStats = useMemo(() => AppointmentReminderService.getReminderStatistics(), []);
  const recentStatusUpdates = useMemo(() => AppointmentStatusService.getRecentStatusUpdates(5), []);

  // Calculate key metrics
  const totalAppointments = Object.values(statusSummary).reduce((sum, count) => sum + count, 0);
  const completionRate = totalAppointments > 0 ? (statusSummary.completed / totalAppointments * 100) : 0;
  const cancellationRate = totalAppointments > 0 ? ((statusSummary.cancelled + statusSummary.declined) / totalAppointments * 100) : 0;
  const reminderSuccessRate = reminderStats.total > 0 ? (reminderStats.sent / reminderStats.total * 100) : 0;

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Key Metrics Cards */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.metricGradient}>
            <Users size={24} color="#FFFFFF" />
            <Text style={styles.metricValue}>{totalAppointments}</Text>
            <Text style={styles.metricLabel}>Total Appointments</Text>
          </LinearGradient>
        </View>

        <View style={styles.metricCard}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.metricGradient}>
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.metricValue}>{completionRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Completion Rate</Text>
          </LinearGradient>
        </View>

        <View style={styles.metricCard}>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.metricGradient}>
            <XCircle size={24} color="#FFFFFF" />
            <Text style={styles.metricValue}>{cancellationRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Cancellation Rate</Text>
          </LinearGradient>
        </View>

        <View style={styles.metricCard}>
          <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.metricGradient}>
            <Clock size={24} color="#FFFFFF" />
            <Text style={styles.metricValue}>{reminderSuccessRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Reminder Success</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Status Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Status Breakdown</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.statusLabel}>Pending</Text>
            <Text style={styles.statusValue}>{statusSummary.pending}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusLabel}>Confirmed</Text>
            <Text style={styles.statusValue}>{statusSummary.confirmed}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.statusLabel}>Declined</Text>
            <Text style={styles.statusValue}>{statusSummary.declined}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.statusLabel}>Rescheduled</Text>
            <Text style={styles.statusValue}>{statusSummary.rescheduleRequested}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#059669' }]} />
            <Text style={styles.statusLabel}>Completed</Text>
            <Text style={styles.statusValue}>{statusSummary.completed}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.statusLabel}>Cancelled</Text>
            <Text style={styles.statusValue}>{statusSummary.cancelled}</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Status Updates</Text>
        {recentStatusUpdates.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={32} color="#9CA3AF" />
            <Text style={styles.emptyText}>No recent status updates</Text>
          </View>
        ) : (
          <View style={styles.activityList}>
            {recentStatusUpdates.map((update, index) => (
              <View key={update.appointmentId + index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  {update.newStatus === 'completed' && <CheckCircle size={16} color="#10B981" />}
                  {update.newStatus === 'cancelled' && <XCircle size={16} color="#EF4444" />}
                  {update.newStatus === 'confirmed' && <CheckCircle size={16} color="#3B82F6" />}
                  {update.newStatus === 'declined' && <XCircle size={16} color="#F59E0B" />}
                  {update.newStatus === 'reschedule_requested' && <Clock size={16} color="#8B5CF6" />}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Appointment {update.newStatus.replace('_', ' ')}
                  </Text>
                  <Text style={styles.activityDescription}>
                    {update.appointmentId} • Updated by {update.updatedBy}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(update.updatedAt).toLocaleDateString()} at{' '}
                    {new Date(update.updatedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#6A2CB0" />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={20} color="#6A2CB0" />
            <Text style={styles.actionButtonText}>Advanced Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Search size={20} color="#6A2CB0" />
            <Text style={styles.actionButtonText}>Search All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'overview':
        return renderOverview();
      case 'calendar':
        return <AppointmentCalendarView />;
      case 'analytics':
        return <AppointmentAnalytics />;
      case 'management':
        return renderOverview(); // For now, same as overview - could be enhanced later
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Appointment Management</Text>
        <Text style={styles.subtitle}>
          Comprehensive overview and management of all appointments
        </Text>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          {viewModes.map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = selectedView === mode.key;
            return (
              <TouchableOpacity
                key={mode.key}
                style={[styles.tab, isSelected && styles.tabSelected]}
                onPress={() => setSelectedView(mode.key)}
              >
                <IconComponent
                  size={18}
                  color={isSelected ? '#6A2CB0' : '#6B7280'}
                />
                <Text style={[
                  styles.tabText,
                  isSelected && styles.tabTextSelected
                ]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabSelected: {
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextSelected: {
    color: '#6A2CB0',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 20,
  },
  metricCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  metricGradient: {
    padding: 20,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusItem: {
    width: (width - 92) / 3,
    alignItems: 'center',
    padding: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A2CB0',
  },
});