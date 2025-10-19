/**
 * Unauthorized Access Component
 *
 * Displayed when a user tries to access a route they don't have permission for.
 * Shows a clear error message and provides a way to return to the home screen.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { Shield, AlertTriangle, Home } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UnauthorizedAccessProps {
  /** Custom error message to display */
  message?: string;

  /** Where to redirect when user taps "Go Home" */
  redirectPath?: Href;

  /** User's role for debugging (optional) */
  userRole?: string;

  /** Required role for debugging (optional) */
  requiredRole?: string;
}

export function UnauthorizedAccess({
  message = "You don't have permission to access this area",
  redirectPath = '/',
  userRole,
  requiredRole,
}: UnauthorizedAccessProps) {
  const handleGoHome = () => {
    console.log('🏠 UnauthorizedAccess: Navigating to home');
    router.replace(redirectPath);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E53935', '#D32F2F']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Icon with alert badge */}
          <View style={styles.iconContainer}>
            <Shield color="#FFFFFF" size={64} strokeWidth={2} />
            <View style={styles.alertBadge}>
              <AlertTriangle color="#E53935" size={24} strokeWidth={2.5} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Access Denied</Text>

          {/* Error message */}
          <Text style={styles.message}>{message}</Text>

          {/* Debug info (only in dev mode) */}
          {__DEV__ && (userRole || requiredRole) && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                {userRole && `Your role: ${userRole}`}
                {userRole && requiredRole && ' | '}
                {requiredRole && `Required: ${requiredRole}`}
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Home color="#E53935" size={20} strokeWidth={2.5} />
              <Text style={styles.primaryButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Help text */}
          <Text style={styles.helpText}>
            If you believe this is an error, please contact support or try logging in again.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  alertBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: 320,
  },
  debugContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  debugText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  helpText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});
