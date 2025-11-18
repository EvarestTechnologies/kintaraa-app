/**
 * Configuration Loader Utility
 * Loads and parses YAML configuration file for offline functionality
 * Provides type-safe access to configuration values
 */

import yaml from 'js-yaml';

// Configuration interface matching YAML structure
export interface OfflineConfig {
  features: {
    offline_mode_enabled: boolean;
    background_sync_enabled: boolean;
    encryption_enabled: boolean;
    conflict_resolution_enabled: boolean;
  };
  cache: {
    query_cache_time: number;
    query_stale_time: number;
    persisted_cache_max_age: number;
    version: string;
  };
  retry: {
    max_attempts: number;
    base_delay_ms: number;
    max_delay_ms: number;
    backoff_multiplier: number;
  };
  sync: {
    background_interval_seconds: number;
    manual_debounce_ms: number;
    priorities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  network: {
    polling_interval_ms: number;
    connection_timeout_ms: number;
  };
  conflict: {
    default_strategy: 'server-wins' | 'client-wins' | 'last-write-wins' | 'merge';
  };
  ui: {
    show_offline_indicator: boolean;
    show_pending_count: boolean;
    show_sync_button: boolean;
    toast_duration_ms: number;
  };
  security: {
    offline_timeout_ms: number;
    max_sync_operations_per_minute: number;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    write_to_file: boolean;
    max_file_size_kb: number;
    max_files: number;
  };
}

// YAML configuration content (embedded to avoid file system issues in React Native)
const CONFIG_YAML = `
features:
  offline_mode_enabled: true
  background_sync_enabled: true
  encryption_enabled: true
  conflict_resolution_enabled: true

cache:
  query_cache_time: 86400000
  query_stale_time: 300000
  persisted_cache_max_age: 604800000
  version: "1.0.0"

retry:
  max_attempts: 5
  base_delay_ms: 1000
  max_delay_ms: 30000
  backoff_multiplier: 2

sync:
  background_interval_seconds: 900
  manual_debounce_ms: 2000
  priorities:
    critical: 100
    high: 85
    medium: 70
    low: 50

network:
  polling_interval_ms: 5000
  connection_timeout_ms: 10000

conflict:
  default_strategy: "last-write-wins"

ui:
  show_offline_indicator: true
  show_pending_count: true
  show_sync_button: true
  toast_duration_ms: 3000

security:
  offline_timeout_ms: 604800000
  max_sync_operations_per_minute: 60

logging:
  enabled: true
  level: "info"
  write_to_file: true
  max_file_size_kb: 500
  max_files: 3
`;

/**
 * Singleton class to manage offline configuration
 */
class ConfigLoader {
  private static instance: ConfigLoader;
  private config: OfflineConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  /**
   * Load and parse YAML configuration
   */
  private loadConfig(): OfflineConfig {
    try {
      const parsed = yaml.load(CONFIG_YAML) as OfflineConfig;
      this.validateConfig(parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to load offline config, using defaults:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Validate configuration structure
   */
  private validateConfig(config: any): void {
    const requiredSections = [
      'features',
      'cache',
      'retry',
      'sync',
      'network',
      'conflict',
      'ui',
      'security',
      'logging',
    ];

    for (const section of requiredSections) {
      if (!config[section]) {
        throw new Error(`Missing required config section: ${section}`);
      }
    }
  }

  /**
   * Get default configuration (fallback)
   */
  private getDefaultConfig(): OfflineConfig {
    return {
      features: {
        offline_mode_enabled: true,
        background_sync_enabled: true,
        encryption_enabled: true,
        conflict_resolution_enabled: true,
      },
      cache: {
        query_cache_time: 86400000,
        query_stale_time: 300000,
        persisted_cache_max_age: 604800000,
        version: '1.0.0',
      },
      retry: {
        max_attempts: 5,
        base_delay_ms: 1000,
        max_delay_ms: 30000,
        backoff_multiplier: 2,
      },
      sync: {
        background_interval_seconds: 900,
        manual_debounce_ms: 2000,
        priorities: {
          critical: 100,
          high: 85,
          medium: 70,
          low: 50,
        },
      },
      network: {
        polling_interval_ms: 5000,
        connection_timeout_ms: 10000,
      },
      conflict: {
        default_strategy: 'last-write-wins',
      },
      ui: {
        show_offline_indicator: true,
        show_pending_count: true,
        show_sync_button: true,
        toast_duration_ms: 3000,
      },
      security: {
        offline_timeout_ms: 604800000,
        max_sync_operations_per_minute: 60,
      },
      logging: {
        enabled: true,
        level: 'info',
        write_to_file: true,
        max_file_size_kb: 500,
        max_files: 3,
      },
    };
  }

  /**
   * Get full configuration
   */
  public getConfig(): OfflineConfig {
    return this.config;
  }

  /**
   * Get specific configuration section
   */
  public get<K extends keyof OfflineConfig>(section: K): OfflineConfig[K] {
    return this.config[section];
  }

  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: keyof OfflineConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Get retry delay for a specific attempt
   */
  public getRetryDelay(attemptNumber: number): number {
    const { base_delay_ms, max_delay_ms, backoff_multiplier } = this.config.retry;
    const delay = Math.min(
      base_delay_ms * Math.pow(backoff_multiplier, attemptNumber),
      max_delay_ms
    );
    return delay;
  }

  /**
   * Get cache time in milliseconds
   */
  public getCacheTime(): number {
    return this.config.cache.query_cache_time;
  }

  /**
   * Get stale time in milliseconds
   */
  public getStaleTime(): number {
    return this.config.cache.query_stale_time;
  }

  /**
   * Get max age for persisted cache
   */
  public getMaxAge(): number {
    return this.config.cache.persisted_cache_max_age;
  }

  /**
   * Get cache version (buster)
   */
  public getCacheVersion(): string {
    return this.config.cache.version;
  }

  /**
   * Get max retry attempts
   */
  public getMaxRetryAttempts(): number {
    return this.config.retry.max_attempts;
  }

  /**
   * Get background sync interval in seconds
   */
  public getBackgroundSyncInterval(): number {
    return this.config.sync.background_interval_seconds;
  }

  /**
   * Get manual sync debounce time
   */
  public getManualSyncDebounce(): number {
    return this.config.sync.manual_debounce_ms;
  }

  /**
   * Get priority for operation level
   */
  public getPriority(level: keyof OfflineConfig['sync']['priorities']): number {
    return this.config.sync.priorities[level];
  }

  /**
   * Get network polling interval
   */
  public getNetworkPollingInterval(): number {
    return this.config.network.polling_interval_ms;
  }

  /**
   * Get conflict resolution strategy
   */
  public getConflictStrategy(): OfflineConfig['conflict']['default_strategy'] {
    return this.config.conflict.default_strategy;
  }

  /**
   * Get toast duration
   */
  public getToastDuration(): number {
    return this.config.ui.toast_duration_ms;
  }

  /**
   * Get offline timeout
   */
  public getOfflineTimeout(): number {
    return this.config.security.offline_timeout_ms;
  }

  /**
   * Get rate limit
   */
  public getRateLimit(): number {
    return this.config.security.max_sync_operations_per_minute;
  }

  /**
   * Get log level
   */
  public getLogLevel(): OfflineConfig['logging']['level'] {
    return this.config.logging.level;
  }

  /**
   * Check if logging is enabled
   */
  public isLoggingEnabled(): boolean {
    return this.config.logging.enabled;
  }
}

// Export singleton instance
export const offlineConfig = ConfigLoader.getInstance();

// Export convenience functions
export const getOfflineConfig = () => offlineConfig.getConfig();
export const isFeatureEnabled = (feature: keyof OfflineConfig['features']) =>
  offlineConfig.isFeatureEnabled(feature);
export const getRetryDelay = (attemptNumber: number) =>
  offlineConfig.getRetryDelay(attemptNumber);
export const getCacheTime = () => offlineConfig.getCacheTime();
export const getStaleTime = () => offlineConfig.getStaleTime();
export const getMaxAge = () => offlineConfig.getMaxAge();
export const getCacheVersion = () => offlineConfig.getCacheVersion();
export const getMaxRetryAttempts = () => offlineConfig.getMaxRetryAttempts();
export const getBackgroundSyncInterval = () => offlineConfig.getBackgroundSyncInterval();
export const getConflictStrategy = () => offlineConfig.getConflictStrategy();
export const getToastDuration = () => offlineConfig.getToastDuration();
export const getOfflineTimeout = () => offlineConfig.getOfflineTimeout();
export const getRateLimit = () => offlineConfig.getRateLimit();
export const getLogLevel = () => offlineConfig.getLogLevel();
export const isLoggingEnabled = () => offlineConfig.isLoggingEnabled();
