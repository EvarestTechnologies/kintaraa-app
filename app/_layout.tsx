import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AuthProvider } from "@/providers/AuthProvider";
import { IncidentProvider } from "@/providers/IncidentProvider";
import { ProviderContext } from "@/providers/ProviderContext";
import { WellbeingProvider } from "@/providers/WellbeingProvider";
import { SafetyProvider } from "@/providers/SafetyProvider";
import { RecommendationProvider } from "@/providers/RecommendationProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import {
  createOfflineQueryClient,
  createQueryPersister,
  setupNetworkDetection,
  getPersistOptions,
} from "@/config/queryPersistence";
import { syncService } from "@/services/syncService";
import { offlineConfig } from "@/utils/configLoader";
import { logger } from "@/utils/logger";


// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error && errorInfo) {
      console.log('Error caught by boundary:', error.message, errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Something went wrong</Text>
          <Text style={errorStyles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    color: '#666',
  },
});

SplashScreen.preventAutoHideAsync();

// Create offline-capable QueryClient and persister
const queryClient = createOfflineQueryClient();
const queryPersister = createQueryPersister();

// Setup network detection for React Query
setupNetworkDetection();

// Initialize sync service
syncService.initialize(queryClient);

function RootLayoutNav() {
  console.log('📱 RootLayoutNav rendering Stack...');

  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#F5F0FF',
      },
      headerTintColor: '#341A52',
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      <Stack.Screen name="emergency" options={{
        presentation: "modal",
        headerShown: false,
      }} />
      <Stack.Screen name="report" options={{
        presentation: "modal",
        title: "Report Incident",
        headerStyle: {
          backgroundColor: '#6A2CB0',
        },
        headerTintColor: '#FFFFFF',
      }} />
      <Stack.Screen name="recommendations" options={{
        title: "AI Recommendations",
        headerStyle: {
          backgroundColor: '#F5F0FF',
        },
        headerTintColor: '#341A52',
      }} />
      <Stack.Screen name="learning-resources" options={{
        title: "Learning Resources",
        headerStyle: {
          backgroundColor: '#F5F0FF',
        },
        headerTintColor: '#341A52',
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log('Error hiding splash screen:', error);
      }
    };
    hideSplash();
  }, []);

  // Register background sync if enabled
  React.useEffect(() => {
    const registerSync = async () => {
      if (offlineConfig.get('features').background_sync_enabled) {
        try {
          await syncService.registerBackgroundSync();
          logger.offline.info('Background sync registered');
        } catch (error) {
          logger.offline.error('Failed to register background sync', error);
        }
      }
    };

    registerSync();

    // Cleanup on unmount
    return () => {
      if (offlineConfig.get('features').background_sync_enabled) {
        syncService.unregisterBackgroundSync().catch((error) => {
          logger.offline.error('Failed to unregister background sync', error);
        });
      }
    };
  }, []);

  console.log('🚀 RootLayout rendering...');

  // Add error handler for uncaught errors
  React.useEffect(() => {
    const errorHandler = (error: Error, isFatal?: boolean) => {
      console.error('💥 Uncaught error:', error, 'isFatal:', isFatal);
    };

    if (__DEV__) {
      // @ts-ignore
      ErrorUtils.setGlobalHandler(errorHandler);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: queryPersister,
            ...getPersistOptions(),
          }}
        >
          <ToastProvider>
            <GestureHandlerRootView style={styles.container}>
              <AuthProvider>
                <SafetyProvider>
                  <IncidentProvider>
                    <ProviderContext>
                      <WellbeingProvider>
                        <RecommendationProvider>
                          <RootLayoutNav />
                          <StatusBar style={styles.statusBar} />
                        </RecommendationProvider>
                      </WellbeingProvider>
                    </ProviderContext>
                  </IncidentProvider>
                </SafetyProvider>
              </AuthProvider>
            </GestureHandlerRootView>
          </ToastProvider>
        </PersistQueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = {
  container: { flex: 1 },
  statusBar: "auto" as const,
};