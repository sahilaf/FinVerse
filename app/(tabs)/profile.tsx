import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Crown, BookOpen, Award, CircleHelp as HelpCircle, LogOut, ChevronRight, Globe, Bell, Shield, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '@/hooks/useUserData';
import { useColorScheme } from '@/hooks/useColorScheme';

const menuItems = [
  {
    id: 'subscription',
    title: 'Upgrade to Premium',
    subtitle: 'Unlock all lessons and features',
    icon: Crown,
    iconColor: '#F59E0B',
    isPremium: true,
    route: '/premium'
  },
  {
    id: 'glossary',
    title: 'Financial Glossary',
    subtitle: 'Learn financial terms',
    icon: BookOpen,
    iconColor: '#3B82F6',
    route: '/glossary'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    subtitle: 'View your progress',
    icon: Award,
    iconColor: '#10B981',
    route: '/achievements'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Manage your alerts',
    icon: Bell,
    iconColor: '#8B5CF6',
  },
  {
    id: 'language',
    title: 'Language & Region',
    subtitle: 'English (US)',
    icon: Globe,
    iconColor: '#06B6D4',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    subtitle: 'Manage your data',
    icon: Shield,
    iconColor: '#EF4444',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get assistance',
    icon: HelpCircle,
    iconColor: '#6B7280',
  },
];

export default function Profile() {
  const { user } = useUserData();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-base font-inter-medium text-gray-600 dark:text-gray-400">
          Loading profile...
        </Text>
      </View>
    );
  }

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    } else {
      Alert.alert('Coming Soon', `${item.title} feature is coming soon!`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          Alert.alert('Signed Out', 'You have been signed out successfully.');
        }}
      ]
    );
  };

  const completionRate = Math.round((user.completedLessons.length / 6) * 100);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={isDark ? ['#047857', '#065F46'] : ['#065F46', '#047857']}
          className="px-5 py-8 rounded-b-3xl pt-16"
        >
          <View className="flex-row items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mr-4">
              <User size={32} color="#FFF" />
            </View>
            
            <View className="flex-1">
              <Text className="text-2xl font-poppins-bold text-white mb-1">{user.name}</Text>
              <Text className="text-sm font-inter text-white/80 mb-2">{user.email}</Text>
              
              <View className="flex-row items-center bg-white/20 px-3 py-2 rounded-xl self-start">
                <Star size={16} color="#F59E0B" />
                <Text className="text-sm font-inter-semibold text-white ml-2">Level {user.level}</Text>
                {user.subscriptionStatus === 'premium' && (
                  <Crown size={16} color="#F59E0B" style={{ marginLeft: 8 }} />
                )}
              </View>
            </View>
          </View>

          {/* Stats */}
          <View className="bg-white/10 rounded-2xl p-5 flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-xl font-poppins-bold text-white">{user.xp}</Text>
              <Text className="text-xs font-inter-medium text-white/80 mt-1">Total XP</Text>
            </View>
            
            <View className="items-center flex-1">
              <Text className="text-xl font-poppins-bold text-white">{user.streak}</Text>
              <Text className="text-xs font-inter-medium text-white/80 mt-1">Day Streak</Text>
            </View>
            
            <View className="items-center flex-1">
              <Text className="text-xl font-poppins-bold text-white">{completionRate}%</Text>
              <Text className="text-xs font-inter-medium text-white/80 mt-1">Complete</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View className="p-5">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm ${
                item.isPremium && user.subscriptionStatus === 'free' 
                  ? 'border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20' 
                  : ''
              }`}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.iconColor}15` }}
                >
                  <item.icon size={20} color={item.iconColor} />
                </View>
                
                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-sm font-inter text-gray-600 dark:text-gray-400">
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center gap-2">
                {item.isPremium && user.subscriptionStatus === 'free' && (
                  <View className="bg-amber-100 dark:bg-amber-800 rounded-lg p-1">
                    <Crown size={12} color="#F59E0B" />
                  </View>
                )}
                <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-5 mb-8"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="text-base font-inter-semibold text-red-500 ml-2">Sign Out</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View className="items-center py-5">
            <Text className="text-sm font-inter-medium text-gray-500 dark:text-gray-400 mb-1">
              FinVerse v1.0.0
            </Text>
            <Text className="text-xs font-inter text-gray-500 dark:text-gray-400">
              Made with ❤️ for financial education
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}