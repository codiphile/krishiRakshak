import { Tabs } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';
import { CustomTabBar } from '../../src/components/CustomTabBar';

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            title: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="photo-camera" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
        {/* Hidden tabs - accessible through routes but not in bottom nav */}
        <Tabs.Screen
          name="chat"
          options={{
            href: null, // This hides the tab from bottom navigation
            title: 'AI Assistant',
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            href: null, // This hides the tab from bottom navigation
            title: 'Community',
          }}
        />
        <Tabs.Screen
          name="locations"
          options={{
            title: 'Locations',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="AnalysisResult"
          options={{
            href: null, // This hides the tab from bottom navigation
            title: 'Analysis Result',
          }}
        />
        <Tabs.Screen
          name="timeline"
          options={{
            href: null, // This hides the tab from bottom navigation
            title: 'AI Farming Timeline',
          }}
        />
        <Tabs.Screen
          name="TimelineResult"
          options={{
            href: null, // This hides the tab from bottom navigation
            title: 'Timeline Result',
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}