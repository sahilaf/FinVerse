import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, Calculator, Trophy, User } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ size, color }) => (
            <Calculator size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}