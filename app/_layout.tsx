import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/providers/AuthProvider";
import { SafetyProvider } from "@/providers/SafetyProvider";
import { IncidentProvider } from "@/providers/IncidentProvider";
import { ProviderContext } from "@/providers/ProviderContext";
import { RecommendationProvider } from "@/providers/RecommendationProvider";
import { WellbeingProvider } from "@/providers/WellbeingProvider";

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
    </Stack>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <AuthProvider>
          <SafetyProvider>
            <IncidentProvider>
              <ProviderContext>
                <RecommendationProvider>
                  <WellbeingProvider>
                    <RootLayoutNav />
                    <StatusBar style={styles.statusBar} />
                  </WellbeingProvider>
                </RecommendationProvider>
              </ProviderContext>
            </IncidentProvider>
          </SafetyProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = {
  container: { flex: 1 },
  statusBar: "auto" as const,
};