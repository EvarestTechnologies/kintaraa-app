/**
 * Logger utility for Kintara app
 * Provides structured logging with different levels
 * Supports both console and file logging
 */

import { DEBUG_CONFIG } from '../constants/config';
import * as FileSystem from 'expo-file-system/legacy';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log file path
const LOG_DIR = `${FileSystem.documentDirectory}logs/`;
const LOG_FILE = `${LOG_DIR}app.log`;

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private writeToFile: boolean = false;
  private maxFileSizeKB: number = 500;
  private maxFiles: number = 3;
  private isInitialized: boolean = false;

  private constructor() {
    this.logLevel = this.getLogLevel();
    // Initialize file logging asynchronously
    this.initializeFileLogging().catch(err => {
      console.error('[LOGGER] Failed to init file logging:', err);
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Initialize file logging
   */
  private async initializeFileLogging(): Promise<void> {
    try {
      // Import config dynamically to avoid circular dependencies
      const { offlineConfig } = await import('./configLoader');

      const loggingConfig = offlineConfig.get('logging');
      this.writeToFile = loggingConfig.write_to_file;
      this.maxFileSizeKB = loggingConfig.max_file_size_kb;
      this.maxFiles = loggingConfig.max_files;

      if (this.writeToFile) {
        // Ensure log directory exists
        const dirInfo = await FileSystem.getInfoAsync(LOG_DIR);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(LOG_DIR, { intermediates: true });
        }
        this.isInitialized = true;
        console.log('[LOGGER] File logging initialized at:', LOG_FILE);
      }
    } catch (error) {
      console.error('[LOGGER] Failed to initialize file logging:', error);
      this.writeToFile = false;
    }
  }

  private getLogLevel(): LogLevel {
    // Always enable all logs for offline functionality
    return LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, tag: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] ${level} [${tag}]: ${message}`;

    if (data) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }

    return baseMessage;
  }

  /**
   * Write log message to file
   */
  private async writeToLogFile(message: string): Promise<void> {
    if (!this.writeToFile || !this.isInitialized) {
      return;
    }

    try {
      // Check file size and rotate if needed
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE);

      if (fileInfo.exists && fileInfo.size) {
        const fileSizeKB = fileInfo.size / 1024;

        if (fileSizeKB > this.maxFileSizeKB) {
          await this.rotateLogFiles();
        }
      }

      // Append message to log file
      await FileSystem.writeAsStringAsync(
        LOG_FILE,
        `${message}\n`,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    } catch (error) {
      // Don't log to console to avoid infinite loop
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Rotate log files when max size is reached
   */
  private async rotateLogFiles(): Promise<void> {
    try {
      // Delete oldest log file if we have max files
      const oldestLog = `${LOG_DIR}app.${this.maxFiles - 1}.log`;
      const oldestInfo = await FileSystem.getInfoAsync(oldestLog);

      if (oldestInfo.exists) {
        await FileSystem.deleteAsync(oldestLog);
      }

      // Rotate existing log files
      for (let i = this.maxFiles - 2; i >= 0; i--) {
        const currentLog = i === 0 ? LOG_FILE : `${LOG_DIR}app.${i}.log`;
        const currentInfo = await FileSystem.getInfoAsync(currentLog);

        if (currentInfo.exists) {
          const nextLog = `${LOG_DIR}app.${i + 1}.log`;
          await FileSystem.moveAsync({
            from: currentLog,
            to: nextLog,
          });
        }
      }
    } catch (error) {
      console.error('Failed to rotate log files:', error);
    }
  }

  /**
   * Get current log file path
   */
  public getLogFilePath(): string {
    return LOG_FILE;
  }

  /**
   * Get all log file paths
   */
  public async getLogFiles(): Promise<string[]> {
    try {
      const files: string[] = [];

      // Check main log file
      const mainInfo = await FileSystem.getInfoAsync(LOG_FILE);
      if (mainInfo.exists) {
        files.push(LOG_FILE);
      }

      // Check rotated files
      for (let i = 1; i < this.maxFiles; i++) {
        const logPath = `${LOG_DIR}app.${i}.log`;
        const info = await FileSystem.getInfoAsync(logPath);
        if (info.exists) {
          files.push(logPath);
        }
      }

      return files;
    } catch (error) {
      console.error('Failed to get log files:', error);
      return [];
    }
  }

  /**
   * Clear all log files
   */
  public async clearLogs(): Promise<void> {
    try {
      const files = await this.getLogFiles();

      for (const file of files) {
        await FileSystem.deleteAsync(file);
      }

      console.log('All log files cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  debug(tag: string, message: string, data?: any): void {
    const formatted = this.formatMessage('DEBUG', tag, message, data);
    console.log(formatted);
    this.writeToLogFile(formatted);
  }

  info(tag: string, message: string, data?: any): void {
    const formatted = this.formatMessage('INFO', tag, message, data);
    console.info(formatted);
    this.writeToLogFile(formatted);
  }

  warn(tag: string, message: string, data?: any): void {
    const formatted = this.formatMessage('WARN', tag, message, data);
    console.warn(formatted);
    this.writeToLogFile(formatted);
  }

  error(tag: string, message: string, error?: any): void {
    const errorData = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    const formatted = this.formatMessage('ERROR', tag, message, errorData);
    console.error(formatted);
    this.writeToLogFile(formatted);
  }

  // Specialized loggers for different parts of the app
  auth = {
    debug: (message: string, data?: any) => this.debug('AUTH', message, data),
    info: (message: string, data?: any) => this.info('AUTH', message, data),
    warn: (message: string, data?: any) => this.warn('AUTH', message, data),
    error: (message: string, error?: any) => this.error('AUTH', message, error),
  };

  api = {
    debug: (message: string, data?: any) => this.debug('API', message, data),
    info: (message: string, data?: any) => this.info('API', message, data),
    warn: (message: string, data?: any) => this.warn('API', message, data),
    error: (message: string, error?: any) => this.error('API', message, error),
  };

  navigation = {
    debug: (message: string, data?: any) => this.debug('NAVIGATION', message, data),
    info: (message: string, data?: any) => this.info('NAVIGATION', message, data),
    warn: (message: string, data?: any) => this.warn('NAVIGATION', message, data),
    error: (message: string, error?: any) => this.error('NAVIGATION', message, error),
  };

  storage = {
    debug: (message: string, data?: any) => this.debug('STORAGE', message, data),
    info: (message: string, data?: any) => this.info('STORAGE', message, data),
    warn: (message: string, data?: any) => this.warn('STORAGE', message, data),
    error: (message: string, error?: any) => this.error('STORAGE', message, error),
  };

  offline = {
    debug: (message: string, data?: any) => this.debug('OFFLINE', message, data),
    info: (message: string, data?: any) => this.info('OFFLINE', message, data),
    warn: (message: string, data?: any) => this.warn('OFFLINE', message, data),
    error: (message: string, error?: any) => this.error('OFFLINE', message, error),
  };

  sync = {
    debug: (message: string, data?: any) => this.debug('SYNC', message, data),
    info: (message: string, data?: any) => this.info('SYNC', message, data),
    warn: (message: string, data?: any) => this.warn('SYNC', message, data),
    error: (message: string, error?: any) => this.error('SYNC', message, error),
  };

  network = {
    debug: (message: string, data?: any) => this.debug('NETWORK', message, data),
    info: (message: string, data?: any) => this.info('NETWORK', message, data),
    warn: (message: string, data?: any) => this.warn('NETWORK', message, data),
    error: (message: string, error?: any) => this.error('NETWORK', message, error),
  };
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience functions for quick logging
export const log = {
  debug: (tag: string, message: string, data?: any) => logger.debug(tag, message, data),
  info: (tag: string, message: string, data?: any) => logger.info(tag, message, data),
  warn: (tag: string, message: string, data?: any) => logger.warn(tag, message, data),
  error: (tag: string, message: string, error?: any) => logger.error(tag, message, error),
};

// Quick access to specialized loggers
export const authLog = logger.auth;
export const apiLog = logger.api;
export const navLog = logger.navigation;
export const storageLog = logger.storage;
