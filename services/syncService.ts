/**
 * Sync Service
 * Orchestrates syncing of pending operations to server
 * Handles background sync and manual sync
 */

import { QueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { SyncResult, SyncOperationType } from '@/types/offline.types';
import { syncQueue } from './syncQueue';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { encryptedStorage } from './encryptedStorage';

const BACKGROUND_SYNC_TASK = 'KINTARAA_BACKGROUND_SYNC';

class SyncService {
  private static instance: SyncService;
  private queryClient: QueryClient | null = null;
  private isSyncing = false;
  private syncListeners: Array<(isSyncing: boolean) => void> = [];

  private constructor() {}

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Initialize sync service with QueryClient
   */
  initialize(queryClient: QueryClient): void {
    this.queryClient = queryClient;
    logger.sync.info('Sync service initialized');
  }

  /**
   * Register background sync task
   */
  async registerBackgroundSync(): Promise<void> {
    if (!offlineConfig.get('features').background_sync_enabled) {
      logger.sync.info('Background sync disabled in config');
      return;
    }

    try {
      // Check if task is already registered
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

      if (isRegistered) {
        logger.sync.debug('Background sync task already registered');
        return;
      }

      // Define background task
      TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
        try {
          logger.sync.info('Background sync task started');

          const netInfo = await NetInfo.fetch();

          if (!netInfo.isConnected) {
            logger.sync.info('Background sync skipped: no connection');
            return BackgroundFetch.BackgroundFetchResult.NoData;
          }

          // Perform sync
          const results = await this.performSync();

          if (results.length > 0) {
            logger.sync.info('Background sync completed', {
              synced: results.filter((r) => r.success).length,
              failed: results.filter((r) => !r.success).length,
            });
            return BackgroundFetch.BackgroundFetchResult.NewData;
          }

          return BackgroundFetch.BackgroundFetchResult.NoData;
        } catch (error) {
          logger.sync.error('Background sync task failed', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      // Register background fetch
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: offlineConfig.getBackgroundSyncInterval(),
        stopOnTerminate: false,
        startOnBoot: true,
      });

      logger.sync.info('Background sync registered', {
        interval: offlineConfig.getBackgroundSyncInterval(),
      });
    } catch (error) {
      logger.sync.error('Failed to register background sync', error);
    }
  }

  /**
   * Unregister background sync
   */
  async unregisterBackgroundSync(): Promise<void> {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
      logger.sync.info('Background sync unregistered');
    } catch (error) {
      logger.sync.error('Failed to unregister background sync', error);
    }
  }

  /**
   * Manual sync - trigger immediate synchronization
   */
  async manualSync(): Promise<SyncResult[]> {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    logger.sync.info('Manual sync started');

    return this.performSync();
  }

  /**
   * Perform actual synchronization
   */
  private async performSync(): Promise<SyncResult[]> {
    if (this.isSyncing) {
      logger.sync.warn('Sync already in progress');
      return [];
    }

    if (!this.queryClient) {
      logger.sync.error('Sync service not initialized with QueryClient');
      return [];
    }

    this.isSyncing = true;
    this.notifySyncListeners(true);

    const results: SyncResult[] = [];

    try {
      // Resume paused React Query mutations first
      await this.queryClient.resumePausedMutations();

      // Get operations from queue
      const operations = await syncQueue.getRetryableOperations();

      logger.sync.info('Syncing operations', { count: operations.length });

      // Sync each operation
      for (const operation of operations) {
        try {
          // Trigger mutation using React Query
          await this.queryClient.executeMutation({
            mutationKey: [operation.type],
            variables: operation.data,
          });

          // Remove from queue on success
          await syncQueue.removeOperation(operation.id);

          results.push({
            id: operation.id,
            success: true,
            operation: operation.type,
            timestamp: Date.now(),
          });

          logger.sync.info('Operation synced successfully', {
            id: operation.id,
            type: operation.type,
          });
        } catch (error) {
          // Increment retry count on failure
          await syncQueue.incrementRetryCount(operation.id);

          results.push({
            id: operation.id,
            success: false,
            operation: operation.type,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now(),
          });

          logger.sync.error('Operation sync failed', {
            id: operation.id,
            type: operation.type,
            error,
          });
        }
      }

      // Update last sync time
      await encryptedStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, Date.now().toString());

      logger.sync.info('Sync completed', {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      });
    } catch (error) {
      logger.sync.error('Sync process failed', error);
    } finally {
      this.isSyncing = false;
      this.notifySyncListeners(false);
    }

    return results;
  }

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<{
    isSyncing: boolean;
    pendingCount: number;
    lastSyncTime: number | null;
  }> {
    const pendingCount = await syncQueue.getPendingCount();
    const lastSyncStr = await encryptedStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
    const lastSyncTime = lastSyncStr ? parseInt(lastSyncStr, 10) : null;

    return {
      isSyncing: this.isSyncing,
      pendingCount,
      lastSyncTime,
    };
  }

  /**
   * Subscribe to sync status changes
   */
  onSyncChange(callback: (isSyncing: boolean) => void): () => void {
    this.syncListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.syncListeners = this.syncListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify sync listeners
   */
  private notifySyncListeners(isSyncing: boolean): void {
    this.syncListeners.forEach((callback) => callback(isSyncing));
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<number | null> {
    const lastSyncStr = await encryptedStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
    return lastSyncStr ? parseInt(lastSyncStr, 10) : null;
  }

  /**
   * Clear all pending operations (use with caution)
   */
  async clearPendingOperations(): Promise<void> {
    await syncQueue.clearQueue();
    logger.sync.warn('All pending operations cleared');
  }
}

// Export singleton instance
export const syncService = SyncService.getInstance();
