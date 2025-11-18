/**
 * Sync Queue Service
 * Manages pending operations that need to be synced when online
 * Provides priority-based queuing and retry logic
 */

import { PendingOperation, SyncOperationType } from '@/types/offline.types';
import { encryptedStorage } from './encryptedStorage';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';

// Operation priority mapping
const OPERATION_PRIORITY: Record<SyncOperationType, number> = {
  CREATE_INCIDENT: offlineConfig.get('sync').priorities.critical,
  CREATE_SAFETY_PLAN: offlineConfig.get('sync').priorities.critical,
  UPDATE_INCIDENT: offlineConfig.get('sync').priorities.high,
  ACCEPT_ASSIGNMENT: offlineConfig.get('sync').priorities.high,
  DECLINE_ASSIGNMENT: offlineConfig.get('sync').priorities.high,
  UPDATE_SAFETY_PLAN: offlineConfig.get('sync').priorities.medium,
  CREATE_WELLBEING_LOG: offlineConfig.get('sync').priorities.medium,
  UPDATE_WELLBEING_LOG: offlineConfig.get('sync').priorities.medium,
  SEND_MESSAGE: offlineConfig.get('sync').priorities.low,
  UPDATE_PROFILE: offlineConfig.get('sync').priorities.low,
};

class SyncQueue {
  private static instance: SyncQueue;

  private constructor() {}

  public static getInstance(): SyncQueue {
    if (!SyncQueue.instance) {
      SyncQueue.instance = new SyncQueue();
    }
    return SyncQueue.instance;
  }

  /**
   * Add operation to sync queue
   */
  async addOperation<T>(
    operation: Omit<PendingOperation<T>, 'id' | 'timestamp' | 'retryCount' | 'priority'>
  ): Promise<PendingOperation<T>> {
    try {
      const queue = await this.getQueue();

      const newOperation: PendingOperation<T> = {
        ...operation,
        id: this.generateOperationId(),
        timestamp: Date.now(),
        retryCount: 0,
        priority: OPERATION_PRIORITY[operation.type] || 50,
      };

      queue.push(newOperation);
      await this.saveQueue(queue);

      logger.sync.info('Operation added to queue', {
        type: operation.type,
        id: newOperation.id,
        priority: newOperation.priority,
      });

      return newOperation;
    } catch (error) {
      logger.sync.error('Failed to add operation to queue', error);
      throw error;
    }
  }

  /**
   * Get all operations in queue
   */
  async getQueue(): Promise<PendingOperation[]> {
    try {
      const queueData = await encryptedStorage.getObject<PendingOperation[]>(
        STORAGE_KEYS.SYNC_QUEUE
      );

      return queueData || [];
    } catch (error) {
      logger.sync.error('Failed to get sync queue', error);
      return [];
    }
  }

  /**
   * Get queue sorted by priority (highest first) and timestamp (oldest first)
   */
  async getSortedQueue(): Promise<PendingOperation[]> {
    const queue = await this.getQueue();

    return queue.sort((a, b) => {
      // Higher priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // Older timestamp first
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Remove operation from queue
   */
  async removeOperation(id: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const filteredQueue = queue.filter((op) => op.id !== id);

      await this.saveQueue(filteredQueue);

      logger.sync.info('Operation removed from queue', { id });
    } catch (error) {
      logger.sync.error('Failed to remove operation from queue', error);
      throw error;
    }
  }

  /**
   * Update operation in queue
   */
  async updateOperation(id: string, updates: Partial<PendingOperation>): Promise<void> {
    try {
      const queue = await this.getQueue();
      const operationIndex = queue.findIndex((op) => op.id === id);

      if (operationIndex === -1) {
        logger.sync.warn('Operation not found in queue', { id });
        return;
      }

      queue[operationIndex] = { ...queue[operationIndex], ...updates };
      await this.saveQueue(queue);

      logger.sync.debug('Operation updated in queue', { id, updates });
    } catch (error) {
      logger.sync.error('Failed to update operation in queue', error);
      throw error;
    }
  }

  /**
   * Increment retry count for operation
   */
  async incrementRetryCount(id: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const operation = queue.find((op) => op.id === id);

      if (!operation) {
        logger.sync.warn('Operation not found for retry increment', { id });
        return;
      }

      operation.retryCount++;
      operation.lastAttempt = Date.now();

      const maxAttempts = offlineConfig.getMaxRetryAttempts();

      if (operation.retryCount >= maxAttempts) {
        logger.sync.warn('Operation exceeded max retry attempts', {
          id,
          retryCount: operation.retryCount,
          maxAttempts,
        });

        // Mark as failed but keep in queue for manual intervention
        operation.error = `Exceeded max retry attempts (${maxAttempts})`;
      }

      await this.saveQueue(queue);

      logger.sync.info('Operation retry count incremented', {
        id,
        retryCount: operation.retryCount,
      });
    } catch (error) {
      logger.sync.error('Failed to increment retry count', error);
      throw error;
    }
  }

  /**
   * Get operations by type
   */
  async getOperationsByType(type: SyncOperationType): Promise<PendingOperation[]> {
    const queue = await this.getQueue();
    return queue.filter((op) => op.type === type);
  }

  /**
   * Get operations that are ready to retry
   * (not exceeded max retries and not recently attempted)
   */
  async getRetryableOperations(): Promise<PendingOperation[]> {
    const queue = await this.getSortedQueue();
    const maxAttempts = offlineConfig.getMaxRetryAttempts();
    const now = Date.now();
    const retryDelay = offlineConfig.get('retry').base_delay_ms;

    return queue.filter((op) => {
      // Skip if exceeded max retries
      if (op.retryCount >= maxAttempts) {
        return false;
      }

      // Skip if recently attempted (within retry delay)
      if (op.lastAttempt && now - op.lastAttempt < retryDelay) {
        return false;
      }

      return true;
    });
  }

  /**
   * Clear entire queue
   */
  async clearQueue(): Promise<void> {
    try {
      await encryptedStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      logger.sync.info('Sync queue cleared');
    } catch (error) {
      logger.sync.error('Failed to clear sync queue', error);
      throw error;
    }
  }

  /**
   * Get pending operation count
   */
  async getPendingCount(): Promise<number> {
    const queue = await this.getQueue();
    const maxAttempts = offlineConfig.getMaxRetryAttempts();

    // Count operations that haven't exceeded max retries
    return queue.filter((op) => op.retryCount < maxAttempts).length;
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(queue: PendingOperation[]): Promise<void> {
    await encryptedStorage.setObject(STORAGE_KEYS.SYNC_QUEUE, queue);
  }

  /**
   * Generate unique operation ID
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    total: number;
    pending: number;
    failed: number;
    byType: Record<SyncOperationType, number>;
  }> {
    const queue = await this.getQueue();
    const maxAttempts = offlineConfig.getMaxRetryAttempts();

    const stats = {
      total: queue.length,
      pending: 0,
      failed: 0,
      byType: {} as Record<SyncOperationType, number>,
    };

    for (const op of queue) {
      if (op.retryCount >= maxAttempts) {
        stats.failed++;
      } else {
        stats.pending++;
      }

      stats.byType[op.type] = (stats.byType[op.type] || 0) + 1;
    }

    return stats;
  }
}

// Export singleton instance
export const syncQueue = SyncQueue.getInstance();
