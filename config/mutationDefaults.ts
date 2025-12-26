/**
 * Mutation Defaults Configuration
 * Defines default mutation functions for offline operations
 * These functions are registered with React Query so they can be serialized
 */

import { QueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { SyncOperationType } from '@/types/offline.types';
import { logger } from '@/utils/logger';
import { syncQueue } from '@/services/syncQueue';

/**
 * Register all mutation defaults with QueryClient
 * This allows mutations to be resumed after app restart
 */
export function registerMutationDefaults(queryClient: QueryClient): void {
  logger.offline.info('Registering mutation defaults');

  // CREATE_INCIDENT
  queryClient.setMutationDefaults(['CREATE_INCIDENT'], {
    mutationFn: async (data: any) => {
      logger.sync.debug('Executing CREATE_INCIDENT mutation', data);
      const response = await api.post('/incidents', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });

  // UPDATE_INCIDENT
  queryClient.setMutationDefaults(['UPDATE_INCIDENT'], {
    mutationFn: async ({ id, ...data }: any) => {
      logger.sync.debug('Executing UPDATE_INCIDENT mutation', { id });
      const response = await api.put(`/incidents/${id}`, data);
      return response.data;
    },
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', variables.id] });
    },
  });

  // CREATE_SAFETY_PLAN
  queryClient.setMutationDefaults(['CREATE_SAFETY_PLAN'], {
    mutationFn: async (data: any) => {
      logger.sync.debug('Executing CREATE_SAFETY_PLAN mutation');
      const response = await api.post('/safety-plans', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety_plans'] });
    },
  });

  // UPDATE_SAFETY_PLAN
  queryClient.setMutationDefaults(['UPDATE_SAFETY_PLAN'], {
    mutationFn: async ({ id, ...data }: any) => {
      logger.sync.debug('Executing UPDATE_SAFETY_PLAN mutation', { id });
      const response = await api.put(`/safety-plans/${id}`, data);
      return response.data;
    },
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['safety_plans'] });
      queryClient.invalidateQueries({ queryKey: ['safety_plan', variables.id] });
    },
  });

  // ACCEPT_ASSIGNMENT
  queryClient.setMutationDefaults(['ACCEPT_ASSIGNMENT'], {
    mutationFn: async ({ assignmentId }: any) => {
      logger.sync.debug('Executing ACCEPT_ASSIGNMENT mutation', { assignmentId });
      const response = await api.post(`/assignments/${assignmentId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  // DECLINE_ASSIGNMENT
  queryClient.setMutationDefaults(['DECLINE_ASSIGNMENT'], {
    mutationFn: async ({ assignmentId, reason }: any) => {
      logger.sync.debug('Executing DECLINE_ASSIGNMENT mutation', { assignmentId });
      const response = await api.post(`/assignments/${assignmentId}/decline`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // CREATE_WELLBEING_LOG
  queryClient.setMutationDefaults(['CREATE_WELLBEING_LOG'], {
    mutationFn: async (data: any) => {
      logger.sync.debug('Executing CREATE_WELLBEING_LOG mutation');
      const response = await api.post('/wellbeing/logs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellbeing_logs'] });
      queryClient.invalidateQueries({ queryKey: ['wellbeing_stats'] });
    },
  });

  // UPDATE_WELLBEING_LOG
  queryClient.setMutationDefaults(['UPDATE_WELLBEING_LOG'], {
    mutationFn: async ({ id, ...data }: any) => {
      logger.sync.debug('Executing UPDATE_WELLBEING_LOG mutation', { id });
      const response = await api.put(`/wellbeing/logs/${id}`, data);
      return response.data;
    },
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['wellbeing_logs'] });
      queryClient.invalidateQueries({ queryKey: ['wellbeing_log', variables.id] });
    },
  });

  // SEND_MESSAGE
  queryClient.setMutationDefaults(['SEND_MESSAGE'], {
    mutationFn: async (data: any) => {
      logger.sync.debug('Executing SEND_MESSAGE mutation');
      const response = await api.post('/messages', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // UPDATE_PROFILE
  queryClient.setMutationDefaults(['UPDATE_PROFILE'], {
    mutationFn: async (data: any) => {
      logger.sync.debug('Executing UPDATE_PROFILE mutation');
      const response = await api.put('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
    },
  });

  logger.offline.info('Mutation defaults registered successfully');
}

/**
 * Create mutation cache callbacks for sync queue integration
 */
export function createMutationCacheCallbacks() {
  return {
    onSuccess: async (data: any, variables: any, context: any, mutation: any) => {
      // Remove from sync queue on success
      if (mutation.meta?.syncQueueId) {
        await syncQueue.removeOperation(mutation.meta.syncQueueId);
        logger.sync.debug('Operation removed from queue after success', {
          id: mutation.meta.syncQueueId,
        });
      }
    },
    onError: async (error: any, variables: any, context: any, mutation: any) => {
      // Increment retry count on error
      if (mutation.meta?.syncQueueId) {
        await syncQueue.incrementRetryCount(mutation.meta.syncQueueId);
        logger.sync.debug('Operation retry count incremented after error', {
          id: mutation.meta.syncQueueId,
        });
      }
    },
  };
}
