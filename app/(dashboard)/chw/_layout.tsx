import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Home, Users, UserPlus, MapPin, User } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { RouteGuard, createProviderGuard } from '@/utils/routeGuards';
import { UnauthorizedAccess } from '@/app/components/UnauthorizedAccess';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function CHWTabLayout() {
  const { user, isLoading } = useAuth();

  console.log('🏥 CHWTabLayout - Rendering Community Health Worker Dashboard');

  useEffect(() => {
    if (!isLoading && user) {
      RouteGuard.guard(user, createProviderGuard('chw'));
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
      </View>
    );
  }

  const hasAccess = RouteGuard.canAccess(user, createProviderGuard('chw'));

  if (!hasAccess) {
    console.warn('🚫 CHW dashboard - Access denied');
    return (
      <UnauthorizedAccess
        message="This area is only accessible to community health workers"
        redirectPath="/"
        userRole={user?.role}
        requiredRole="provider (chw)"
      />
    );
  }

  console.log('✅ CHW dashboard - Access granted');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A2CB0',
        tabBarInactiveTintColor: '#D8CEE8',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F5F0FF',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="community-cases"
        options={{
          title: 'Community Cases',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="outreach"
        options={{
          title: 'Outreach',
          tabBarIcon: ({ color, size }) => <UserPlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: 'Locations',
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});
