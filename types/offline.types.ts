/**
 * Type definitions for offline-first functionality
 * These types correspond to the YAML configuration structure
 */

export type NetworkMode = 'online' | 'offline' | 'offlineFirst';

export type ConflictResolutionStrategy = 'server-wins' | 'client-wins' | 'last-write-wins' | 'merge';

export type SyncOperationType =
  | 'CREATE_INCIDENT'
  | 'UPDATE_INCIDENT'
  | 'CREATE_SAFETY_PLAN'
  | 'UPDATE_SAFETY_PLAN'
  | 'ACCEPT_ASSIGNMENT'
  | 'DECLINE_ASSIGNMENT'
  | 'CREATE_WELLBEING_LOG'
  | 'UPDATE_WELLBEING_LOG'
  | 'SEND_MESSAGE'
  | 'UPDATE_PROFILE';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type IndicatorPosition = 'top' | 'bottom';

// Pending operation in sync queue
export interface PendingOperation<T = any> {
  id: string;
  type: SyncOperationType;
  data: T;
  timestamp: number;
  retryCount: number;
  priority: number;
  lastAttempt?: number;
  error?: string;
}

// Conflict data structure
export interface ConflictData<T> {
  local: T;
  server: T;
  localTimestamp: number;
  serverTimestamp: number;
  field?: string;
}

// Network state
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown';
  quality?: 'poor' | 'moderate' | 'good' | 'excellent';
}

// Sync result
export interface SyncResult {
  id: string;
  success: boolean;
  operation: SyncOperationType;
  error?: string;
  timestamp: number;
}

// Sync status
export interface SyncStatus {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  errors: SyncResult[];
}

// Configuration interfaces (matching YAML structure)
export interface StorageConfig {
  keys: {
    query_cache: string;
    sync_queue: string;
    encryption_key: string;
    network_state: string;
    last_sync: string;
  };
  cache_buster: string;
  encryption: {
    enabled: boolean;
    sensitive_keys: string[];
  };
}

export interface QueryConfig {
  cache_time: number;
  stale_time: number;
  max_age: number;
  retry: {
    attempts: number;
    delay_base: number;
    delay_max: number;
    delay_multiplier: number;
  };
  network_mode: {
    queries: NetworkMode;
    mutations: NetworkMode;
  };
}

export interface SyncConfig {
  max_retry_attempts: number;
  retry_delays: number[];
  background: {
    enabled: boolean;
    interval: number;
    stop_on_terminate: boolean;
    start_on_boot: boolean;
    task_name: string;
  };
  manual: {
    debounce: number;
    show_progress: boolean;
    show_success_toast: boolean;
  };
  priorities: Record<SyncOperationType, number>;
}

export interface NetworkConfig {
  polling_interval: number;
  connection_timeout: number;
  minimum_quality: {
    type: string;
    is_connected: boolean;
    is_internet_reachable: boolean;
  };
}

export interface ConflictConfig {
  default_strategy: ConflictResolutionStrategy;
  strategies: Record<SyncOperationType, ConflictResolutionStrategy>;
  field_priorities: {
    incidents: {
      high_priority: string[];
      server_priority: string[];
    };
    safety_plans: {
      high_priority: string[];
      server_priority: string[];
    };
  };
}

export interface UIConfig {
  offline_indicator: {
    enabled: boolean;
    position: IndicatorPosition;
    auto_hide: boolean;
    show_pending_count: boolean;
  };
  sync_button: {
    enabled: boolean;
    show_in_header: boolean;
    show_in_settings: boolean;
    icon: string;
  };
  toast: {
    show_on_offline: boolean;
    show_on_online: boolean;
    show_on_sync_start: boolean;
    show_on_sync_complete: boolean;
    show_on_sync_error: boolean;
    duration: number;
  };
}

export interface MutationEndpoint {
  method: HttpMethod;
  path: string;
  invalidates: (string | string[])[];
}

export interface MutationsConfig {
  endpoints: Record<SyncOperationType, MutationEndpoint>;
}

export interface LoggingConfig {
  enabled: boolean;
  level: LogLevel;
  log_sync_operations: boolean;
  log_network_changes: boolean;
  log_conflicts: boolean;
  log_errors: boolean;
}

export interface SecurityConfig {
  offline_timeout: number;
  clear_on_logout: string[];
  validate_integrity: boolean;
  rate_limit: {
    enabled: boolean;
    max_operations_per_minute: number;
  };
}

// Main offline configuration interface
export interface OfflineConfig {
  storage: StorageConfig;
  query: QueryConfig;
  sync: SyncConfig;
  network: NetworkConfig;
  conflict: ConflictConfig;
  ui: UIConfig;
  mutations: MutationsConfig;
  logging: LoggingConfig;
  security: SecurityConfig;
}

// Hook return types
export interface UseNetworkReturn {
  isOnline: boolean;
  isConnected: boolean;
  networkState: NetworkState;
  connectionQuality: 'poor' | 'moderate' | 'good' | 'excellent' | 'unknown';
}

export interface UseSyncReturn {
  sync: () => Promise<SyncResult[]>;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  errors: SyncResult[];
}

export interface UseOfflineReturn {
  isOnline: boolean;
  pendingOperations: PendingOperation[];
  sync: () => Promise<SyncResult[]>;
  clearQueue: () => Promise<void>;
  queueOperation: <T>(type: SyncOperationType, data: T) => Promise<PendingOperation<T>>;
}

// Encrypted storage interface
export interface IEncryptedStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Sync queue interface
export interface ISyncQueue {
  addOperation<T>(operation: Omit<PendingOperation<T>, 'id' | 'timestamp' | 'retryCount' | 'priority'>): Promise<PendingOperation<T>>;
  getQueue(): Promise<PendingOperation[]>;
  removeOperation(id: string): Promise<void>;
  clearQueue(): Promise<void>;
  incrementRetryCount(id: string): Promise<void>;
  updateOperation(id: string, updates: Partial<PendingOperation>): Promise<void>;
  getOperationsByType(type: SyncOperationType): Promise<PendingOperation[]>;
  getSortedQueue(): Promise<PendingOperation[]>;
}

// Conflict resolver interface
export interface IConflictResolver {
  resolve<T>(conflict: ConflictData<T>, strategy?: ConflictResolutionStrategy): T;
  resolveByType<T>(conflict: ConflictData<T>, operationType: SyncOperationType): T;
  resolveFields<T extends Record<string, any>>(
    localData: T,
    serverData: T,
    highPriorityFields: string[],
    serverPriorityFields: string[]
  ): T;
}
