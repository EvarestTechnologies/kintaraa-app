/**
 * Conflict Resolver Service
 * Handles data conflicts between local and server data
 * Supports multiple resolution strategies
 */

import {
  ConflictData,
  ConflictResolutionStrategy,
  SyncOperationType,
} from '@/types/offline.types';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';

// Field priorities for incidents (GBV-specific)
const INCIDENT_HIGH_PRIORITY_FIELDS = [
  'evidenceFiles',
  'description',
  'location',
  'incidentDate',
  'victimInfo',
];

const INCIDENT_SERVER_PRIORITY_FIELDS = ['assignedProviders', 'status', 'caseNumber'];

// Field priorities for safety plans
const SAFETY_PLAN_HIGH_PRIORITY_FIELDS = [
  'emergencyContacts',
  'safeLocations',
  'triggerWarnings',
  'copingStrategies',
];

const SAFETY_PLAN_SERVER_PRIORITY_FIELDS = ['sharedWith', 'lastReviewedBy', 'reviewDate'];

class ConflictResolver {
  private static instance: ConflictResolver;

  private constructor() {}

  public static getInstance(): ConflictResolver {
    if (!ConflictResolver.instance) {
      ConflictResolver.instance = new ConflictResolver();
    }
    return ConflictResolver.instance;
  }

  /**
   * Resolve conflict using specified strategy
   */
  resolve<T extends Record<string, any>>(
    conflict: ConflictData<T>,
    strategy?: ConflictResolutionStrategy
  ): T {
    if (!offlineConfig.get('features').conflict_resolution_enabled) {
      logger.offline.info('Conflict resolution disabled, using server data');
      return conflict.server;
    }

    const resolveStrategy = strategy || offlineConfig.getConflictStrategy();

    logger.offline.info('Resolving conflict', {
      strategy: resolveStrategy,
      localTimestamp: conflict.localTimestamp,
      serverTimestamp: conflict.serverTimestamp,
    });

    switch (resolveStrategy) {
      case 'server-wins':
        return this.serverWins(conflict);

      case 'client-wins':
        return this.clientWins(conflict);

      case 'last-write-wins':
        return this.lastWriteWins(conflict);

      case 'merge':
        return this.merge(conflict);

      default:
        logger.offline.warn('Unknown conflict strategy, using server-wins', {
          strategy: resolveStrategy,
        });
        return conflict.server;
    }
  }

  /**
   * Resolve conflict by operation type with predefined strategies
   */
  resolveByType<T extends Record<string, any>>(
    conflict: ConflictData<T>,
    operationType: SyncOperationType
  ): T {
    const strategyMap: Record<SyncOperationType, ConflictResolutionStrategy> = {
      CREATE_INCIDENT: 'client-wins',
      CREATE_SAFETY_PLAN: 'client-wins',
      UPDATE_INCIDENT: 'last-write-wins',
      ACCEPT_ASSIGNMENT: 'server-wins',
      DECLINE_ASSIGNMENT: 'server-wins',
      UPDATE_SAFETY_PLAN: 'merge',
      CREATE_WELLBEING_LOG: 'client-wins',
      UPDATE_WELLBEING_LOG: 'last-write-wins',
      SEND_MESSAGE: 'client-wins',
      UPDATE_PROFILE: 'merge',
    };

    const strategy = strategyMap[operationType] || 'last-write-wins';

    logger.offline.debug('Resolving conflict by operation type', {
      operationType,
      strategy,
    });

    return this.resolve(conflict, strategy);
  }

  /**
   * Server wins - always use server data
   */
  private serverWins<T>(conflict: ConflictData<T>): T {
    logger.offline.debug('Conflict resolved: server wins');
    return conflict.server;
  }

  /**
   * Client wins - always use local data
   */
  private clientWins<T>(conflict: ConflictData<T>): T {
    logger.offline.debug('Conflict resolved: client wins');
    return conflict.local;
  }

  /**
   * Last write wins - use most recent data based on timestamp
   */
  private lastWriteWins<T extends Record<string, any>>(conflict: ConflictData<T>): T {
    // Try to use updatedAt field from data
    const localTime =
      conflict.local.updatedAt && typeof conflict.local.updatedAt === 'string'
        ? new Date(conflict.local.updatedAt).getTime()
        : conflict.localTimestamp;

    const serverTime =
      conflict.server.updatedAt && typeof conflict.server.updatedAt === 'string'
        ? new Date(conflict.server.updatedAt).getTime()
        : conflict.serverTimestamp;

    const result = localTime > serverTime ? conflict.local : conflict.server;

    logger.offline.debug('Conflict resolved: last write wins', {
      winner: localTime > serverTime ? 'local' : 'server',
      localTime,
      serverTime,
    });

    return result;
  }

  /**
   * Merge - intelligently merge local and server data
   */
  private merge<T extends Record<string, any>>(conflict: ConflictData<T>): T {
    logger.offline.debug('Conflict resolved: merge strategy');

    // Start with server data as base
    const merged = { ...conflict.server };

    // Override with non-null local values
    for (const [key, value] of Object.entries(conflict.local)) {
      if (value != null && value !== '' && value !== undefined) {
        merged[key as keyof T] = value;
      }
    }

    return merged as T;
  }

  /**
   * Resolve incident-specific conflicts with GBV priorities
   */
  resolveIncidentConflict<T extends Record<string, any>>(
    local: T,
    server: T
  ): T {
    logger.offline.info('Resolving incident conflict with GBV priorities');

    return this.resolveFields(
      local,
      server,
      INCIDENT_HIGH_PRIORITY_FIELDS,
      INCIDENT_SERVER_PRIORITY_FIELDS
    );
  }

  /**
   * Resolve safety plan conflicts
   */
  resolveSafetyPlanConflict<T extends Record<string, any>>(
    local: T,
    server: T
  ): T {
    logger.offline.info('Resolving safety plan conflict');

    return this.resolveFields(
      local,
      server,
      SAFETY_PLAN_HIGH_PRIORITY_FIELDS,
      SAFETY_PLAN_SERVER_PRIORITY_FIELDS
    );
  }

  /**
   * Resolve fields with priority rules
   * High priority fields: prefer local (user-entered data)
   * Server priority fields: prefer server (system-managed data)
   * Other fields: use last-write-wins
   */
  resolveFields<T extends Record<string, any>>(
    localData: T,
    serverData: T,
    highPriorityFields: string[],
    serverPriorityFields: string[]
  ): T {
    const result = { ...serverData };

    for (const [key, value] of Object.entries(localData)) {
      // High priority fields: always use local if not empty
      if (highPriorityFields.includes(key)) {
        if (value != null && value !== '' && value !== undefined) {
          result[key as keyof T] = value;
        }
        continue;
      }

      // Server priority fields: always use server
      if (serverPriorityFields.includes(key)) {
        continue;
      }

      // Other fields: use local if more recent or non-empty
      const localUpdated = localData.updatedAt
        ? new Date(localData.updatedAt as string).getTime()
        : 0;
      const serverUpdated = serverData.updatedAt
        ? new Date(serverData.updatedAt as string).getTime()
        : 0;

      if (localUpdated > serverUpdated && value != null) {
        result[key as keyof T] = value;
      }
    }

    logger.offline.debug('Fields resolved with priorities', {
      highPriorityFields,
      serverPriorityFields,
    });

    return result;
  }
}

// Export singleton instance
export const conflictResolver = ConflictResolver.getInstance();
