/**
 * Logger utility for Kintara app
 * Provides structured logging with different levels
 */

import { DEBUG_CONFIG } from '../constants/config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = this.getLogLevel();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevel(): LogLevel {
    if (!DEBUG_CONFIG.ENABLE_LOGS) return LogLevel.ERROR;
    
    switch (DEBUG_CONFIG.LOG_LEVEL) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.DEBUG;
    }
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

  debug(tag: string, message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', tag, message, data));
    }
  }

  info(tag: string, message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', tag, message, data));
    }
  }

  warn(tag: string, message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', tag, message, data));
    }
  }

  error(tag: string, message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
      
      console.error(this.formatMessage('ERROR', tag, message, errorData));
    }
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
