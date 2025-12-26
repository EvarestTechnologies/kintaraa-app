/**
 * Sync Button Component
 * Allows manual triggering of data synchronization
 */

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '@/hooks/useNetwork';
import { syncService } from '@/services/syncService';
import { syncQueue } from '@/services/syncQueue';
import { offlineConfig } from '@/utils/configLoader';
import { logger } from '@/utils/logger';
import { useToast } from '@/providers/ToastProvider';

interface SyncButtonProps {
  variant?: 'icon' | 'button';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function SyncButton({
  variant = 'icon',
  size = 'medium',
  showLabel = false,
}: SyncButtonProps) {
  const { isOnline } = useNetwork();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { showToast } = useToast();

  // Check if sync button should be shown
  const shouldShow = offlineConfig.get('ui').show_sync_button;

  useEffect(() => {
    // Subscribe to sync status changes
    const unsubscribe = syncService.onSyncChange((syncing) => {
      setIsSyncing(syncing);
    });

    return unsubscribe;
  }, []);

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

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert(
        'No Connection',
        'Please connect to the internet to sync your data.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isSyncing) {
      return; // Already syncing
    }

    if (pendingCount === 0) {
      showToast('All data is synced', 'success');
      return;
    }

    try {
      logger.sync.info('Manual sync triggered', { pendingCount });

      const results = await syncService.manualSync();

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      if (failed === 0) {
        showToast(`Successfully synced ${successful} changes`, 'success');
      } else if (successful > 0) {
        showToast(`Synced ${successful} changes, ${failed} failed`, 'warning');
      } else {
        showToast('Failed to sync changes. Please try again.', 'error');
      }

      logger.sync.info('Manual sync completed', { successful, failed });
    } catch (error) {
      logger.sync.error('Manual sync failed', error);
      showToast('Sync failed. Please try again.', 'error');
    }
  };

  if (!shouldShow) {
    return null;
  }

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;
  const iconColor = !isOnline
    ? '#9CA3AF'
    : pendingCount > 0
    ? '#6A2CB0'
    : '#10B981';

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleSync}
        disabled={!isOnline || isSyncing}
        className="p-2"
        accessibilityLabel="Sync data"
        accessibilityHint={
          !isOnline
            ? 'No internet connection'
            : isSyncing
            ? 'Syncing in progress'
            : `Sync ${pendingCount} pending changes`
        }
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <MaterialCommunityIcons name="sync" size={iconSize} color={iconColor} />
        )}
      </TouchableOpacity>
    );
  }

  // Button variant
  return (
    <TouchableOpacity
      onPress={handleSync}
      disabled={!isOnline || isSyncing}
      className={`flex-row items-center px-4 py-2 rounded-lg ${
        !isOnline || isSyncing ? 'bg-gray-300' : 'bg-purple-600'
      }`}
      accessibilityLabel="Sync data"
      accessibilityHint={
        !isOnline
          ? 'No internet connection'
          : isSyncing
          ? 'Syncing in progress'
          : `Sync ${pendingCount} pending changes`
      }
    >
      {isSyncing ? (
        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
      ) : (
        <MaterialCommunityIcons
          name="sync"
          size={iconSize}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
      )}
      {showLabel && (
        <Text className="text-white font-semibold">
          {isSyncing
            ? 'Syncing...'
            : pendingCount > 0
            ? `Sync (${pendingCount})`
            : 'Sync'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
