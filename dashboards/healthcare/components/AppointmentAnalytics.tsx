import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProvider } from '@/providers/ProviderContext';
import { AppointmentStatusService } from '@/services/appointmentStatusService';
import { AppointmentReminderService } from '@/services/appointmentReminderService';

const { width } = Dimensions.get('window');

export default function AppointmentAnalytics() {
  const { assignedCases } = useProvider();

  // Get analytics data
  const statusSummary = useMemo(() => AppointmentStatusService.getStatusSummary(), []);
  const reminderStats = useMemo(() => AppointmentReminderService.getReminderStatistics(), []);
  const recentUpdates = useMemo(() => AppointmentStatusService.getRecentStatusUpdates(20), []);

  // Calculate metrics
  const totalAppointments = Object.values(statusSummary).reduce((sum, count) => sum + count, 0);
  const completionRate = totalAppointments > 0 ? (statusSummary.completed / totalAppointments * 100) : 0;
  const cancellationRate = totalAppointments > 0 ? ((statusSummary.cancelled + statusSummary.declined) / totalAppointments * 100) : 0;
  const confirmationRate = totalAppointments > 0 ? (statusSummary.confirmed / totalAppointments * 100) : 0;
  const reminderSuccessRate = reminderStats.total > 0 ? (reminderStats.sent / reminderStats.total * 100) : 0;

  // Calculate trends (mock data for demonstration)
  const trends = {
    appointments: +12.5, // % change from last period
    completions: +8.3,
    cancellations: -5.2,
    reminders: +15.7,
  };

  // Weekly activity data (mock)
  const weeklyData = [
    { day: 'Mon', appointments: 8, completed: 6, cancelled: 1 },
    { day: 'Tue', appointments: 12, completed: 10, cancelled: 2 },
    { day: 'Wed', appointments: 15, completed: 12, cancelled: 1 },
    { day: 'Thu', appointments: 10, completed: 8, cancelled: 2 },
    { day: 'Fri', appointments: 14, completed: 11, cancelled: 3 },
    { day: 'Sat', appointments: 6, completed: 5, cancelled: 0 },
    { day: 'Sun', appointments: 4, completed: 4, cancelled: 0 },
  ];

  const maxWeeklyValue = Math.max(...weeklyData.map(d => d.appointments));

  // Status distribution for pie chart visualization
  const statusDistribution = [
    { label: 'Completed', value: statusSummary.completed, color: '#10B981' },
    { label: 'Confirmed', value: statusSummary.confirmed, color: '#3B82F6' },
    { label: 'Pending', value: statusSummary.pending, color: '#F59E0B' },
    { label: 'Cancelled', value: statusSummary.cancelled, color: '#EF4444' },
    { label: 'Declined', value: statusSummary.declined, color: '#F59E0B' },
    { label: 'Reschedule Req.', value: statusSummary.rescheduleRequested, color: '#8B5CF6' },
  ].filter(item => item.value > 0);

  const renderTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp size={16} color="#10B981" />;
    } else if (trend < 0) {
      return <TrendingDown size={16} color="#EF4444" />;
    } else {
      return <BarChart3 size={16} color="#6B7280" />;
    }
  };

  const renderTrendText = (trend: number) => {
    const absValue = Math.abs(trend);
    const color = trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280';
    const symbol = trend > 0 ? '+' : '';
    return (
      <Text style={[styles.trendText, { color }]}>
        {symbol}{trend.toFixed(1)}%
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Key Performance Indicators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.kpiGradient}>
              <View style={styles.kpiHeader}>
                <Calendar size={20} color="#FFFFFF" />
                <View style={styles.kpiTrend}>
                  {renderTrendIcon(trends.appointments)}
                  {renderTrendText(trends.appointments)}
                </View>
              </View>
              <Text style={styles.kpiValue}>{totalAppointments}</Text>
              <Text style={styles.kpiLabel}>Total Appointments</Text>
            </LinearGradient>
          </View>

          <View style={styles.kpiCard}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.kpiGradient}>
              <View style={styles.kpiHeader}>
                <CheckCircle size={20} color="#FFFFFF" />
                <View style={styles.kpiTrend}>
                  {renderTrendIcon(trends.completions)}
                  {renderTrendText(trends.completions)}
                </View>
              </View>
              <Text style={styles.kpiValue}>{completionRate.toFixed(1)}%</Text>
              <Text style={styles.kpiLabel}>Completion Rate</Text>
            </LinearGradient>
          </View>

          <View style={styles.kpiCard}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.kpiGradient}>
              <View style={styles.kpiHeader}>
                <XCircle size={20} color="#FFFFFF" />
                <View style={styles.kpiTrend}>
                  {renderTrendIcon(trends.cancellations)}
                  {renderTrendText(trends.cancellations)}
                </View>
              </View>
              <Text style={styles.kpiValue}>{cancellationRate.toFixed(1)}%</Text>
              <Text style={styles.kpiLabel}>Cancellation Rate</Text>
            </LinearGradient>
          </View>

          <View style={styles.kpiCard}>
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.kpiGradient}>
              <View style={styles.kpiHeader}>
                <AlertTriangle size={20} color="#FFFFFF" />
                <View style={styles.kpiTrend}>
                  {renderTrendIcon(trends.reminders)}
                  {renderTrendText(trends.reminders)}
                </View>
              </View>
              <Text style={styles.kpiValue}>{reminderSuccessRate.toFixed(1)}%</Text>
              <Text style={styles.kpiLabel}>Reminder Success</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Weekly Activity Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Appointments This Week</Text>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.legendText}>Scheduled</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Cancelled</Text>
              </View>
            </View>
          </View>

          <View style={styles.chart}>
            {weeklyData.map((day, index) => (
              <View key={day.day} style={styles.chartColumn}>
                <View style={styles.bars}>
                  <View
                    style={[
                      styles.bar,
                      styles.scheduledBar,
                      { height: (day.appointments / maxWeeklyValue) * 120 }
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.completedBar,
                      { height: (day.completed / maxWeeklyValue) * 120 }
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.cancelledBar,
                      { height: (day.cancelled / maxWeeklyValue) * 120 }
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{day.day}</Text>
                <Text style={styles.chartValue}>{day.appointments}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Status Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Distribution</Text>
        <View style={styles.distributionContainer}>
          {statusDistribution.map((item, index) => (
            <View key={item.label} style={styles.distributionItem}>
              <View style={styles.distributionBar}>
                <View
                  style={[
                    styles.distributionFill,
                    {
                      backgroundColor: item.color,
                      width: `${(item.value / totalAppointments) * 100}%`
                    }
                  ]}
                />
              </View>
              <View style={styles.distributionMeta}>
                <View style={styles.distributionLabel}>
                  <View style={[styles.distributionDot, { backgroundColor: item.color }]} />
                  <Text style={styles.distributionText}>{item.label}</Text>
                </View>
                <Text style={styles.distributionValue}>
                  {item.value} ({((item.value / totalAppointments) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Detailed Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <Users size={16} color="#3B82F6" />
            </View>
            <Text style={styles.metricLabel}>Active Patients</Text>
            <Text style={styles.metricValue}>{assignedCases.length}</Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <Clock size={16} color="#F59E0B" />
            </View>
            <Text style={styles.metricLabel}>Avg. Duration</Text>
            <Text style={styles.metricValue}>45min</Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <CheckCircle size={16} color="#10B981" />
            </View>
            <Text style={styles.metricLabel}>Confirmation Rate</Text>
            <Text style={styles.metricValue}>{confirmationRate.toFixed(1)}%</Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <AlertTriangle size={16} color="#8B5CF6" />
            </View>
            <Text style={styles.metricLabel}>No-Show Rate</Text>
            <Text style={styles.metricValue}>2.3%</Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <Calendar size={16} color="#059669" />
            </View>
            <Text style={styles.metricLabel}>Reminders Sent</Text>
            <Text style={styles.metricValue}>{reminderStats.sent}</Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIcon}>
              <TrendingUp size={16} color="#EF4444" />
            </View>
            <Text style={styles.metricLabel}>Response Time</Text>
            <Text style={styles.metricValue}>2.4hrs</Text>
          </View>
        </View>
      </View>

      {/* Performance Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>This Month</Text>
            <View style={styles.summaryMetrics}>
              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Appointments</Text>
                <Text style={styles.summaryValue}>{totalAppointments}</Text>
              </View>
              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Completed</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                  {statusSummary.completed}
                </Text>
              </View>
              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Success Rate</Text>
                <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
                  {completionRate.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  kpiGradient: {
    padding: 16,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  chartContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 2,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    minHeight: 2,
  },
  scheduledBar: {
    backgroundColor: '#3B82F6',
  },
  completedBar: {
    backgroundColor: '#10B981',
  },
  cancelledBar: {
    backgroundColor: '#EF4444',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  chartValue: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  distributionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  distributionItem: {
    gap: 8,
  },
  distributionBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distributionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distributionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  distributionValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    width: (width - 84) / 3,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryMetric: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
});