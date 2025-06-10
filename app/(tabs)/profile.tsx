import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Crown, BookOpen, Award, CircleHelp as HelpCircle, LogOut, ChevronRight, Globe, Bell, Shield, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-lg font-inter-medium text-gray-600 dark:text-gray-400">
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
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#065F46', '#047857']}
        className="px-5 py-8 rounded-b-6xl"
        style={{ paddingTop: 60 }}
      >
        <View className="flex-row items-center mb-6">
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mr-4">
            <User size={32} color="#FFF" />
          </View>
          
          <View className="flex-1">
            <Text className="text-2xl font-poppins-bold text-white mb-1">
              {userName}
            </Text>
            <Text className="text-sm font-inter-regular text-white/80 mb-2">
              {userEmail}
            </Text>
            
            <View className="flex-row items-center bg-white/20 rounded-3xl px-3 py-1.5 self-start">
              <Star size={16} color="#F59E0B" />
              <Text className="text-sm font-inter-semibold text-white ml-1.5">
                Level 3
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between bg-white/10 rounded-4xl p-5">
          <View className="items-center flex-1">
            <Text className="text-xl font-poppins-bold text-white">1250</Text>
            <Text className="text-xs font-inter-medium text-white/80 mt-1">Total XP</Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-xl font-poppins-bold text-white">7</Text>
            <Text className="text-xs font-inter-medium text-white/80 mt-1">Day Streak</Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-xl font-poppins-bold text-white">50%</Text>
            <Text className="text-xs font-inter-medium text-white/80 mt-1">Complete</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Menu Items */}
      <View className="p-5">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
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
                <Text className="text-sm font-inter-regular text-gray-600 dark:text-gray-400">
                  {item.subtitle}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              {item.isPremium && (
                <View className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-1 mr-2">
                  <Crown size={12} color="#F59E0B" />
                </View>
              )}
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-4 mt-5"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-600 dark:text-red-400 text-lg font-inter-semibold ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center py-5">
          <Text className="text-sm font-inter-medium text-gray-500 dark:text-gray-400 mb-1">
            FinVerse v1.0.0
          </Text>
          <Text className="text-xs font-inter-regular text-gray-400 dark:text-gray-500">
            Made with ❤️ for financial education
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}