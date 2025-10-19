import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Home, FileText, Heart, Shield, User } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { RouteGuard, createSurvivorGuard } from '@/utils/routeGuards';
import { UnauthorizedAccess } from '@/app/components/UnauthorizedAccess';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function SurvivorTabLayout() {
  const { user, isLoading } = useAuth();

  console.log('🛡️ SurvivorTabLayout - Rendering Survivor Dashboard');

  useEffect(() => {
    if (!isLoading && user) {
      RouteGuard.guard(user, createSurvivorGuard());
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
      </View>
    );
  }

  const hasAccess = RouteGuard.canAccess(user, createSurvivorGuard());

  if (!hasAccess) {
    console.warn('🚫 Survivor dashboard - Access denied');
    return (
      <UnauthorizedAccess
        message="This area is only accessible to survivors"
        redirectPath="/"
        userRole={user?.role}
        requiredRole="survivor"
      />
    );
  }

  console.log('✅ Survivor dashboard - Access granted');

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
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wellbeing"
        options={{
          title: 'Wellbeing',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
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