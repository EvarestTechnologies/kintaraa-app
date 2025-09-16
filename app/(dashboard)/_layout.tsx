import { Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('📱 DashboardLayout - Rendering');

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <RouteErrorBoundary fallbackRoute="/">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="police" options={{ headerShown: false }} />
        <Stack.Screen name="healthcare" options={{ headerShown: false }} />
        <Stack.Screen name="legal" options={{ headerShown: false }} />
        <Stack.Screen name="counseling" options={{ headerShown: false }} />
        <Stack.Screen name="social" options={{ headerShown: false }} />
        <Stack.Screen name="gbv_rescue" options={{ headerShown: false }} />
        <Stack.Screen name="chw" options={{ headerShown: false }} />
        <Stack.Screen name="survivor" options={{ headerShown: false }} />
      </Stack>
    </RouteErrorBoundary>
  );
}