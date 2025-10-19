import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Home, Users, Calendar, FileText, User } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { RouteGuard, createProviderGuard } from '@/utils/routeGuards';
import { UnauthorizedAccess } from '@/app/components/UnauthorizedAccess';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function HealthcareTabLayout() {
  const { user, isLoading } = useAuth();

  console.log('🏥 HealthcareTabLayout - Rendering Healthcare Dashboard');

  // Guard the route on mount and when user changes
  useEffect(() => {
    if (!isLoading && user) {
      RouteGuard.guard(user, createProviderGuard('healthcare'));
    }
  }, [user, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
      </View>
    );
  }

  // Check if user has access to healthcare dashboard
  const hasAccess = RouteGuard.canAccess(user, createProviderGuard('healthcare'));

  if (!hasAccess) {
    console.warn('🚫 Healthcare dashboard - Access denied');
    return (
      <UnauthorizedAccess
        message="This area is only accessible to healthcare providers"
        redirectPath="/"
        userRole={user?.role}
        requiredRole="provider (healthcare)"
      />
    );
  }

  console.log('✅ Healthcare dashboard - Access granted');

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
        name="patients"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="patient"
        options={{
          href: null, // Hide from tab bar
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