import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { AuthProvider } from "@/providers/AuthProvider";
import { SafetyProvider } from "@/providers/SafetyProvider";
import { IncidentProvider } from "@/providers/IncidentProvider";
import { ProviderContext } from "@/providers/ProviderContext";
import { RecommendationProvider } from "@/providers/RecommendationProvider";
import { WellbeingProvider } from "@/providers/WellbeingProvider";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#F5F0FF',
      },
      headerTintColor: '#341A52',
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
      <Stack.Screen name="integration-test" options={{ 
        title: "Integration Testing",
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

  console.log('RootLayout rendering...');

  // Temporarily simplify to test basic functionality
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={styles.container}>
          <AuthProvider>
            <RootLayoutNav />
            <StatusBar style={styles.statusBar} />
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = {
  container: { flex: 1 },
  statusBar: "auto" as const,
};