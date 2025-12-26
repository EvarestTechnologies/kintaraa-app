/**
 * Offline Indicator Component
 * Shows network status and pending sync operations
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNetwork } from '@/hooks/useNetwork';
import { syncQueue } from '@/services/syncQueue';
import { syncService } from '@/services/syncService';
import { offlineConfig } from '@/utils/configLoader';

export function OfflineIndicator() {
  const { isOnline, networkState } = useNetwork();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if indicator should be shown based on config
  const shouldShow = offlineConfig.get('ui').show_offline_indicator;
  const showPendingCount = offlineConfig.get('ui').show_pending_count;

  useEffect(() => {
    const checkQueue = async () => {
      const count = await syncQueue.getPendingCount();
      setPendingCount(count);
    };

    checkQueue();

    // Poll queue count every 5 seconds
    const interval = setInterval(checkQueue, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subscribe to sync status changes
    const unsubscribe = syncService.onSyncChange((syncing) => {
      setIsSyncing(syncing);
    });

    return unsubscribe;
  }, []);

  // Don't show if disabled or online with no pending operations
  if (!shouldShow || (isOnline && pendingCount === 0 && !isSyncing)) {
    return null;
  }

  const getStatusMessage = () => {
    if (isSyncing) {
      return `Syncing ${pendingCount} changes...`;
    }

    if (!isOnline) {
      return showPendingCount && pendingCount > 0
        ? `Offline - ${pendingCount} changes pending`
        : 'Offline mode';
    }

    if (pendingCount > 0) {
      return `${pendingCount} changes ready to sync`;
    }

    return 'Online';
  };

  const getBackgroundColor = () => {
    if (isSyncing) {
      return '#3B82F6'; // Blue
    }

    if (!isOnline) {
      return '#F59E0B'; // Orange
    }

    if (pendingCount > 0) {
      return '#10B981'; // Green
    }

    return '#10B981'; // Green
  };

  return (
    <View
      className="w-full px-4 py-2 flex-row items-center justify-center"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {isSyncing && (
        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
      )}
      <Text className="text-white text-sm font-semibold text-center">
        {getStatusMessage()}
      </Text>
    </View>
  );
}
