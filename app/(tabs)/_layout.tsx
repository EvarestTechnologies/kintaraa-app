import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { 
  Home, 
  FileText, 
  Heart, 
  Shield, 
  User,
  Users,
  Briefcase,
  MessageSquare,
  BarChart3,
  Stethoscope,
  Scale,
  Calendar,
  Settings
} from 'lucide-react-native';

export default function TabLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null; // Show loading screen
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Render different tabs based on user role and provider type
  if (user?.role === 'provider') {
    const getProviderTabs = () => {
      const commonScreenOptions = {
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
          fontWeight: '600',
          marginTop: 4,
        },
      };

      switch (user.providerType) {
        case 'healthcare':
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Patients',
                  tabBarIcon: ({ color, size }) => <Stethoscope color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Appointments',
                  tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
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
            </Tabs>
          );

        case 'legal':
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Cases',
                  tabBarIcon: ({ color, size }) => <Scale color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Documents',
                  tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
                options={{
                  title: 'Court',
                  tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
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

        case 'police':
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Cases',
                  tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Evidence',
                  tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
                options={{
                  title: 'Reports',
                  tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
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

        case 'counseling':
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Clients',
                  tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Sessions',
                  tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
                options={{
                  title: 'Resources',
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
            </Tabs>
          );

        case 'social':
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Cases',
                  tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Services',
                  tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
                options={{
                  title: 'Resources',
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
            </Tabs>
          );

        default:
          // Default provider dashboard
          return (
            <Tabs screenOptions={commonScreenOptions}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="reports"
                options={{
                  title: 'Cases',
                  tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="wellbeing"
                options={{
                  title: 'Messages',
                  tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
                }}
              />
              <Tabs.Screen
                name="safety"
                options={{
                  title: 'Analytics',
                  tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
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
    };

    return getProviderTabs();
  }

  // Default survivor tabs
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
          fontWeight: '600',
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