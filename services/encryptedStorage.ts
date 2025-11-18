/**
 * Encrypted Storage Service
 * Provides encryption layer for sensitive data stored in AsyncStorage
 * Uses Base64 encoding (can be enhanced with expo-crypto for production)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, SENSITIVE_STORAGE_KEYS } from '@/constants/storage.constants';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';

class EncryptedStorage {
  private static instance: EncryptedStorage;

  private constructor() {}

  public static getInstance(): EncryptedStorage {
    if (!EncryptedStorage.instance) {
      EncryptedStorage.instance = new EncryptedStorage();
    }
    return EncryptedStorage.instance;
  }

  /**
   * Check if encryption is enabled and key is sensitive
   */
  private shouldEncrypt(key: string): boolean {
    if (!offlineConfig.get('features').encryption_enabled) {
      return false;
    }

    return SENSITIVE_STORAGE_KEYS.includes(key as any);
  }

  /**
   * Simple encryption using Base64 (for demo - use expo-crypto in production)
   * In production, replace with: expo-crypto's Crypto.digestStringAsync with AES
   */
  private encrypt(value: string): string {
    try {
      // Convert to Base64
      const encrypted = Buffer.from(value, 'utf-8').toString('base64');
      return encrypted;
    } catch (error) {
      logger.storage.error('Encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Simple decryption from Base64
   */
  private decrypt(encryptedValue: string): string {
    try {
      // Convert from Base64
      const decrypted = Buffer.from(encryptedValue, 'base64').toString('utf-8');
      return decrypted;
    } catch (error) {
      logger.storage.error('Decryption failed', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Set item with optional encryption
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const shouldEncrypt = this.shouldEncrypt(key);
      const storageValue = shouldEncrypt ? this.encrypt(value) : value;
      const storageKey = shouldEncrypt ? `encrypted_${key}` : key;

      await AsyncStorage.setItem(storageKey, storageValue);

      logger.storage.debug('Item saved', {
        key: storageKey,
        encrypted: shouldEncrypt,
        size: storageValue.length,
      });
    } catch (error) {
      logger.storage.error(`Failed to set item: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get item with automatic decryption
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const shouldDecrypt = this.shouldEncrypt(key);
      const storageKey = shouldDecrypt ? `encrypted_${key}` : key;

      const storageValue = await AsyncStorage.getItem(storageKey);

      if (!storageValue) {
        return null;
      }

      const value = shouldDecrypt ? this.decrypt(storageValue) : storageValue;

      logger.storage.debug('Item retrieved', {
        key: storageKey,
        encrypted: shouldDecrypt,
      });

      return value;
    } catch (error) {
      logger.storage.error(`Failed to get item: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove item
   */
  async removeItem(key: string): Promise<void> {
    try {
      const shouldEncrypt = this.shouldEncrypt(key);
      const storageKey = shouldEncrypt ? `encrypted_${key}` : key;

      await AsyncStorage.removeItem(storageKey);

      logger.storage.debug('Item removed', { key: storageKey });
    } catch (error) {
      logger.storage.error(`Failed to remove item: ${key}`, error);
      throw error;
    }
  }

  /**
   * Clear all sensitive data
   */
  async clearSensitiveData(): Promise<void> {
    try {
      const keysToRemove = SENSITIVE_STORAGE_KEYS.map((key) =>
        this.shouldEncrypt(key) ? `encrypted_${key}` : key
      );

      await AsyncStorage.multiRemove(keysToRemove);

      logger.storage.info('Sensitive data cleared', {
        keysCleared: keysToRemove.length,
      });
    } catch (error) {
      logger.storage.error('Failed to clear sensitive data', error);
      throw error;
    }
  }

  /**
   * Set JSON object with encryption
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.setItem(key, jsonString);
  }

  /**
   * Get JSON object with decryption
   */
  async getObject<T>(key: string): Promise<T | null> {
    const jsonString = await this.getItem(key);

    if (!jsonString) {
      return null;
    }

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      logger.storage.error(`Failed to parse JSON for key: ${key}`, error);
      return null;
    }
  }
}

// Export singleton instance
export const encryptedStorage = EncryptedStorage.getInstance();
