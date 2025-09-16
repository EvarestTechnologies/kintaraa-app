import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';

export default function TabLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🔄 TabLayout - Auth State:', {
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    providerType: user?.providerType
  });

  if (isLoading) {
    console.log('⏳ TabLayout - Loading, showing loading screen');
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6A2CB0', '#E24B95']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContent}>
            <View style={styles.iconContainer}>
              <Shield color="#FFFFFF" size={48} />
            </View>
            <Text style={styles.title}>Kintaraa</Text>
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 TabLayout - Not authenticated, redirecting to welcome');
    return <Redirect href="/(auth)/welcome" />;
  }

  // All users (providers and survivors) should use the dashboard structure
  if (user?.role === 'provider' && user?.providerType) {
    console.log(`🏥 TabLayout - Provider (${user.providerType}), redirecting to dashboard`);
    return <Redirect href={`/(dashboard)/${user.providerType}`} />;
  }

  // Default: redirect survivors to survivor dashboard
  console.log('🛡️ TabLayout - Redirecting to Survivor Dashboard');
  return <Redirect href="/(dashboard)/survivor" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});