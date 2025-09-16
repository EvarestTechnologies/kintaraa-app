import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Users, UserPlus, MapPin, User } from 'lucide-react-native';

export default function CHWTabLayout() {
  console.log('🏥 CHWTabLayout - Rendering Community Health Worker Dashboard');

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