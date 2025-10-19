/**
 * Route Guard Utilities for Role-Based Access Control (RBAC)
 *
 * Implements security guards to ensure users can only access routes
 * appropriate to their role (survivor/provider) and provider type.
 *
 * Usage:
 * ```typescript
 * // In a dashboard layout
 * const hasAccess = RouteGuard.guard(user, {
 *   allowedRoles: ['provider'],
 *   allowedProviderTypes: ['healthcare'],
 *   redirectOnFail: '/',
 *   showError: true,
 * });
 * ```
 */

import { router, Href } from 'expo-router';
import { User, ProviderType } from '@/providers/AuthProvider';

/**
 * Configuration for route guard checks
 */
export interface RouteGuardConfig {
  /** Roles allowed to access this route */
  allowedRoles: ('survivor' | 'provider' | 'admin')[];

  /** Provider types allowed (only checked if user is a provider) */
  allowedProviderTypes?: ProviderType[];

  /** Where to redirect if access is denied */
  redirectOnFail: Href;

  /** Whether to show error message to user (future: toast/alert) */
  showError?: boolean;
}

/**
 * Main RouteGuard class for access control
 */
export class RouteGuard {
  /**
   * Check if user has access to a route based on configuration
   *
   * @param user - Current user object (null if not authenticated)
   * @param config - Route guard configuration
   * @returns true if user has access, false otherwise
   */
  static canAccess(user: User | null, config: RouteGuardConfig): boolean {
    // No user means no access
    if (!user) {
      console.warn('🚫 RouteGuard: No user object provided');
      return false;
    }

    // Check if user's role is in allowed roles
    if (!config.allowedRoles.includes(user.role)) {
      console.warn('🚫 RouteGuard: Role not allowed', {
        userRole: user.role,
        allowedRoles: config.allowedRoles,
      });
      return false;
    }

    // If user is a provider, check provider type
    if (user.role === 'provider' && config.allowedProviderTypes) {
      // Provider must have a provider type
      if (!user.providerType) {
        console.error('❌ RouteGuard: Provider user missing providerType!');
        return false;
      }

      // Check if provider type is in allowed types
      if (!config.allowedProviderTypes.includes(user.providerType)) {
        console.warn('🚫 RouteGuard: Provider type not allowed', {
          userProviderType: user.providerType,
          allowedProviderTypes: config.allowedProviderTypes,
        });
        return false;
      }
    }

    // All checks passed
    return true;
  }

  /**
   * Guard a route - check access and redirect if unauthorized
   *
   * This method not only checks access but also handles the redirect
   * and logging for unauthorized attempts.
   *
   * @param user - Current user object
   * @param config - Route guard configuration
   * @returns true if access granted, false if access denied (and redirected)
   */
  static guard(user: User | null, config: RouteGuardConfig): boolean {
    const hasAccess = this.canAccess(user, config);

    if (!hasAccess) {
      console.warn('🚫 RouteGuard: Access denied - Redirecting', {
        userRole: user?.role,
        userProviderType: user?.providerType,
        requiredRoles: config.allowedRoles,
        requiredProviderTypes: config.allowedProviderTypes,
        redirectTo: config.redirectOnFail,
      });

      // Future enhancement: Show toast/alert notification
      if (config.showError) {
        // TODO: Integrate with toast/notification system
        console.log('⚠️ User should see error message');
      }

      // Redirect to safe location
      try {
        router.replace(config.redirectOnFail);
      } catch (error) {
        console.error('❌ RouteGuard: Failed to redirect', error);
        // Fallback: try to go to root
        router.replace('/');
      }

      return false;
    }

    // Access granted
    console.log('✅ RouteGuard: Access granted', {
      userRole: user?.role,
      userProviderType: user?.providerType,
    });

    return true;
  }

  /**
   * Validate provider type is valid
   *
   * @param providerType - Provider type to validate
   * @returns true if valid, false otherwise
   */
  static isValidProviderType(providerType?: string): providerType is ProviderType {
    const validTypes: ProviderType[] = [
      'healthcare',
      'legal',
      'police',
      'counseling',
      'social',
      'gbv_rescue',
      'chw',
    ];

    return !!providerType && validTypes.includes(providerType as ProviderType);
  }
}

/**
 * React hook for route guarding
 *
 * Use this in components to check access declaratively
 *
 * @param config - Route guard configuration
 * @param user - Current user object
 * @returns true if user has access
 */
export function useRouteGuard(config: RouteGuardConfig, user: User | null): boolean {
  return RouteGuard.canAccess(user, config);
}

/**
 * Helper function to create provider-specific route config
 *
 * @param providerType - Provider type to allow
 * @returns Route guard configuration for that provider
 */
export function createProviderGuard(providerType: ProviderType): RouteGuardConfig {
  return {
    allowedRoles: ['provider'],
    allowedProviderTypes: [providerType],
    redirectOnFail: '/',
    showError: true,
  };
}

/**
 * Helper function to create survivor route config
 *
 * @returns Route guard configuration for survivors
 */
export function createSurvivorGuard(): RouteGuardConfig {
  return {
    allowedRoles: ['survivor'],
    redirectOnFail: '/',
    showError: true,
  };
}
