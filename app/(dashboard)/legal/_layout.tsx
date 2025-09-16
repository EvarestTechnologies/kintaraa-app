import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Scale, FileText, Building, User } from 'lucide-react-native';

export default function LegalTabLayout() {
  console.log('⚖️ LegalTabLayout - Rendering Legal Dashboard');

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
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ color, size }) => <Scale color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="court"
        options={{
          title: 'Court',
          tabBarIcon: ({ color, size }) => <Building color={color} size={size} />,
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