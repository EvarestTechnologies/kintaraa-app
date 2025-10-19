/**
 * Communication History Component
 * Displays SMS and call logs for a case
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Phone, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { CommunicationService, CommunicationLog } from '@/services/communicationService';

interface CommunicationHistoryProps {
  caseId: string;
  maxHeight?: number;
}

export function CommunicationHistory({ caseId, maxHeight }: CommunicationHistoryProps) {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [caseId]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const history = await CommunicationService.getCommunicationHistory(caseId);
      setLogs(history);
    } catch (error) {
      console.error('Failed to load communication history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'completed':
        return <CheckCircle color="#10B981" size={16} />;
      case 'failed':
      case 'no_answer':
        return <XCircle color="#EF4444" size={16} />;
      case 'pending':
      case 'initiated':
      case 'ringing':
      case 'in_progress':
        return <Clock color="#F59E0B" size={16} />;
      default:
        return <AlertCircle color="#94A3B8" size={16} />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'completed':
        return '#10B981';
      case 'failed':
      case 'no_answer':
        return '#EF4444';
      case 'pending':
      case 'initiated':
      case 'ringing':
      case 'in_progress':
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
        <Text style={styles.loadingText}>Loading communication history...</Text>
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MessageSquare color="#CBD5E1" size={48} />
        <Text style={styles.emptyTitle}>No Communication Yet</Text>
        <Text style={styles.emptyText}>
          Communication history will appear here once you send messages or make calls.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, maxHeight ? { maxHeight } : undefined]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {logs.map((log) => (
        <View key={log.id} style={styles.logItem}>
          {/* Icon and Type */}
          <View style={styles.iconContainer}>
            {log.type === 'call' ? (
              <Phone color="#10B981" size={20} />
            ) : (
              <MessageSquare color="#6A2CB0" size={20} />
            )}
          </View>

          {/* Content */}
          <View style={styles.logContent}>
            <View style={styles.logHeader}>
              <Text style={styles.logType}>
                {log.type === 'call' ? 'Voice Call' : 'SMS Message'}
              </Text>
              <Text style={styles.logTimestamp}>{formatTimestamp(log.timestamp)}</Text>
            </View>

            <View style={styles.logDetails}>
              <Text style={styles.logDirection}>
                {log.direction === 'outbound' ? 'To' : 'From'}: {log.phone_number}
              </Text>
            </View>

            {log.type === 'sms' && log.content && (
              <Text style={styles.messageContent} numberOfLines={3}>
                {log.content}
              </Text>
            )}

            {log.type === 'call' && log.duration !== undefined && (
              <Text style={styles.callDuration}>
                Duration: {formatDuration(log.duration)}
              </Text>
            )}

            {/* Status */}
            <View style={styles.statusContainer}>
              {getStatusIcon(log.status)}
              <Text style={[styles.statusText, { color: getStatusColor(log.status) }]}>
                {log.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  logItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  logTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  logDetails: {
    marginBottom: 8,
  },
  logDirection: {
    fontSize: 14,
    color: '#64748B',
  },
  messageContent: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
  },
  callDuration: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
