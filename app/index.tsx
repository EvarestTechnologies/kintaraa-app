import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';
import { RouteGuard } from '@/utils/routeGuards';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🎯 Index - Entry point:', {
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    providerType: user?.providerType
  });

  if (isLoading) {
    console.log('⏳ Index - Loading, showing loading screen');
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
            <Text style={styles.loadingText}>Loading your secure space...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 Index - Not authenticated, redirecting to welcome');
    return <Redirect href="/(auth)/welcome" />;
  }

  // Enhanced validation for provider users
  if (user?.role === 'provider') {
    // Validate provider has a provider type
    if (!user.providerType) {
      console.error('❌ Index - Provider user missing providerType!');
      console.log('⚠️ Index - Redirecting to welcome for re-authentication');
      return <Redirect href="/(auth)/welcome" />;
    }

    // Validate provider type is valid
    if (!RouteGuard.isValidProviderType(user.providerType)) {
      console.error('❌ Index - Invalid provider type:', user.providerType);
      console.log('⚠️ Index - Redirecting to welcome for re-authentication');
      return <Redirect href="/(auth)/welcome" />;
    }

    console.log(`✅ Index - Provider (${user.providerType}), redirecting to dashboard`);
    return <Redirect href={`/(dashboard)/${user.providerType}`} />;
  }

  // For survivors, redirect to survivor dashboard
  if (user?.role === 'survivor') {
    console.log('✅ Index - Survivor, redirecting to survivor dashboard');
    return <Redirect href="/(dashboard)/survivor" />;
  }

  // Fallback for invalid or unknown roles
  console.error('❌ Index - Invalid user role:', user?.role);
  console.log('⚠️ Index - Redirecting to welcome for re-authentication');
  return <Redirect href="/(auth)/welcome" />;
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