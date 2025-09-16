import { Tabs } from 'expo-router';
import React from 'react';
import { Home, AlertTriangle, Phone, Users2, User } from 'lucide-react-native';

export default function GbvRescueTabLayout() {
  console.log('🚨 GbvRescueTabLayout - Rendering GBV Rescue Dashboard');

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
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="hotline"
        options={{
          title: 'Hotline',
          tabBarIcon: ({ color, size }) => <Phone color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="response"
        options={{
          title: 'Response',
          tabBarIcon: ({ color, size }) => <Users2 color={color} size={size} />,
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