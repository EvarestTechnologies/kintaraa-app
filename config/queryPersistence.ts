/**
 * Query Persistence Configuration
 * Configures React Query to persist cache to AsyncStorage for offline support
 */

import { QueryClient, MutationCache } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';
import { registerMutationDefaults, createMutationCacheCallbacks } from './mutationDefaults';

/**
 * Create and configure QueryClient for offline-first functionality
 */
export function createOfflineQueryClient(): QueryClient {
  logger.offline.info('Creating offline-capable QueryClient');

  const mutationCacheCallbacks = createMutationCacheCallbacks();

  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: mutationCacheCallbacks.onSuccess,
      onError: mutationCacheCallbacks.onError,
    }),
    defaultOptions: {
      queries: {
        gcTime: offlineConfig.getCacheTime(),
        staleTime: offlineConfig.getStaleTime(),
        retry: offlineConfig.getMaxRetryAttempts(),
        retryDelay: (attemptIndex) => offlineConfig.get('retry').base_delay_ms * Math.pow(
          offlineConfig.get('retry').backoff_multiplier,
          attemptIndex
        ),
        networkMode: 'offlineFirst',
      },
      mutations: {
        networkMode: 'offlineFirst',
        retry: offlineConfig.getMaxRetryAttempts(),
        retryDelay: (attemptIndex) => offlineConfig.get('retry').base_delay_ms * Math.pow(
          offlineConfig.get('retry').backoff_multiplier,
          attemptIndex
        ),
      },
    },
  });

  // Register mutation defaults for offline persistence
  registerMutationDefaults(queryClient);

  logger.offline.info('QueryClient configured for offline mode');

  return queryClient;
}

/**
 * Create AsyncStorage persister for React Query cache
 */
export function createQueryPersister() {
  logger.offline.info('Creating query cache persister');

  const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: STORAGE_KEYS.QUERY_CACHE,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    throttleTime: 1000, // Throttle writes to storage
  });

  return persister;
}

/**
 * Setup network status detection for React Query
 */
export function setupNetworkDetection(): void {
  logger.network.info('Setting up network detection for React Query');

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected ?? false;

      setOnline(isOnline);

      logger.network.info('Network status changed', {
        isOnline,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });
  });

  logger.network.info('Network detection configured');
}

/**
 * Get persist options for PersistQueryClientProvider
 */
export function getPersistOptions() {
  return {
    maxAge: offlineConfig.getMaxAge(),
    buster: offlineConfig.getCacheVersion(),
  };
}
