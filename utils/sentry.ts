/**
 * Sentry Crash Reporting Configuration
 *
 * To enable Sentry:
 * 1. Create a Sentry account at https://sentry.io
 * 2. Create a new React Native project
 * 3. Copy your DSN and replace 'YOUR_SENTRY_DSN_HERE'
 * 4. Deploy your app
 */

import * as Sentry from '@sentry/react-native';
import { APP_CONFIG, isProduction } from '@/constants/config';

// Sentry DSN - replace with your actual DSN
// Format: https://[key]@[organization].ingest.sentry.io/[project]
const SENTRY_DSN = process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE';

// Only initialize Sentry in production or if DSN is configured
const shouldInitializeSentry = !__DEV__ && SENTRY_DSN !== 'YOUR_SENTRY_DSN_HERE';

export function initializeSentry() {
  if (!shouldInitializeSentry) {
    console.log('Sentry not initialized (development mode or DSN not configured)');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // App version and release tracking
    release: `kintaraa@${APP_CONFIG.APP.VERSION}`,
    dist: `${APP_CONFIG.APP.BUILD_NUMBER}`,

    // Environment
    environment: isProduction ? 'production' : 'development',

    // Performance monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions in production

    // Enable native crash reporting
    enableNative: true,
    enableNativeCrashHandling: true,
    enableNativeNagger: false, // Don't show native nagger in development

    // Attach stack traces to all messages
    attachStacktrace: true,

    // Maximum number of breadcrumbs (default is 100)
    maxBreadcrumbs: 50,

    // Before send hook - sanitize sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from error reports
      if (event.request) {
        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers.Authorization;
          delete event.request.headers.authorization;
        }

        // Remove sensitive query parameters
        if (event.request.query_string) {
          const sensitiveParams = ['token', 'password', 'secret'];
          sensitiveParams.forEach(param => {
            if (event.request?.query_string?.includes(param)) {
              event.request.query_string = '[REDACTED]';
            }
          });
        }
      }

      // Remove sensitive data from extra context
      if (event.extra) {
        const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization'];
        Object.keys(event.extra).forEach(key => {
          if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            event.extra![key] = '[REDACTED]';
          }
        });
      }

      return event;
    },

    // Integrations
    integrations: [
      new Sentry.ReactNativeTracing({
        // Routing instrumentation for performance monitoring
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        tracingOrigins: ['localhost', 'api-kintara.onrender.com', /^\//],
      }),
    ],
  });

  console.log('✅ Sentry initialized successfully');
}

/**
 * Set user context for Sentry
 * Call this after successful login
 */
export function setSentryUser(user: { id: string; email?: string; role?: string }) {
  if (!shouldInitializeSentry) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    // Don't send sensitive user data - only identifiers
    role: user.role,
  });
}

/**
 * Clear user context from Sentry
 * Call this after logout
 */
export function clearSentryUser() {
  if (!shouldInitializeSentry) return;

  Sentry.setUser(null);
}

/**
 * Capture an exception manually
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!shouldInitializeSentry) {
    console.error('Sentry not initialized, error not captured:', error);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message manually
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (!shouldInitializeSentry) {
    console.log('Sentry not initialized, message not captured:', message);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  if (!shouldInitializeSentry) return;

  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Wrap the root component with Sentry for error boundaries
 */
export const withSentry = Sentry.wrap;

export { Sentry };
