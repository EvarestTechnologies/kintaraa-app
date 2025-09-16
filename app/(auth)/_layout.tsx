import { Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show loading screen
  }

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <RouteErrorBoundary fallbackRoute="/(auth)/welcome">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </RouteErrorBoundary>
  );
}