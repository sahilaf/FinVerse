import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Crown, Check, Star, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

const premiumFeatures = [
  'Access to all premium lessons and courses',
  'Advanced investing and retirement planning content',
  'Cryptocurrency and Web3 education modules',
  'Personalized AI tutor with unlimited questions',
  'Priority customer support and assistance',
  'Exclusive webinars and live Q&A sessions',
  'Advanced budgeting tools and analytics',
  'Early access to new features and content'
];

export default function Premium() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    console.log(`Subscribe to ${plan} plan`);
    
    alert(`RevenueCat Integration Required\n\nTo implement subscriptions, you'll need to:\n\n1. Export this project to your local environment\n2. Install RevenueCat SDK\n3. Configure your RevenueCat dashboard\n4. Add subscription products\n\nRevenueCat handles all billing, receipt validation, and subscription management across iOS and Android.`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="absolute top-12 left-5 z-10">
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-black/20 items-center justify-center"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          className="pt-32 pb-10 px-5 rounded-b-3xl"
        >
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-5">
              <Crown size={32} color="#FFF" />
            </View>
            
            <Text className="text-3xl font-poppins-bold text-white mb-3 text-center">Unlock Premium</Text>
            <Text className="text-base font-inter text-white/90 text-center leading-6">
              Get unlimited access to advanced financial education and personalized AI guidance
            </Text>
          </View>
        </LinearGradient>

        <View className="p-5">
          {/* Features */}
          <View className="mb-8">
            <Text className="text-2xl font-poppins-semibold text-gray-900 dark:text-white mb-5">Premium Features</Text>
            
            {premiumFeatures.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-4">
                <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center mr-4">
                  <Check size={16} color="#FFF" />
                </View>
                <Text className="text-base font-inter text-gray-700 dark:text-gray-300 leading-6 flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Plans */}
          <View className="mb-8">
            <Text className="text-2xl font-poppins-semibold text-gray-900 dark:text-white mb-5">Choose Your Plan</Text>
            
            {/* Annual Plan */}
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-4 shadow-lg border-2 border-secondary-500 relative">
              <View className="absolute -top-3 right-5 bg-red-500 flex-row items-center px-3 py-2 rounded-xl">
                <Star size={12} color="#FFF" />
                <Text className="text-xs font-inter-bold text-white ml-1">BEST VALUE</Text>
              </View>
              
              <View className="items-center mb-5">
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-2">Annual Plan</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-4xl font-poppins-bold text-secondary-500">$7.99</Text>
                  <Text className="text-lg font-inter-medium text-gray-600 dark:text-gray-400 ml-1">/month</Text>
                </View>
                <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 mb-1">Billed annually at $95.88</Text>
                <Text className="text-sm font-inter-semibold text-primary-500">Save 33% compared to monthly</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-secondary-500 py-4 rounded-xl items-center"
                onPress={() => handleSubscribe('annual')}
              >
                <Text className="text-base font-inter-bold text-white">Start Annual Plan</Text>
              </TouchableOpacity>
            </View>

            {/* Monthly Plan */}
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <View className="items-center mb-5">
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-2">Monthly Plan</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-4xl font-poppins-bold text-secondary-500">$11.99</Text>
                  <Text className="text-lg font-inter-medium text-gray-600 dark:text-gray-400 ml-1">/month</Text>
                </View>
                <Text className="text-sm font-inter text-gray-600 dark:text-gray-400">Billed monthly</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-gray-100 dark:bg-gray-700 py-4 rounded-xl items-center"
                onPress={() => handleSubscribe('monthly')}
              >
                <Text className="text-base font-inter-bold text-gray-700 dark:text-gray-300">Start Monthly Plan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Highlights */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-5 items-center shadow-sm">
              <Zap size={24} color="#F59E0B" />
              <Text className="text-base font-inter-semibold text-gray-900 dark:text-white text-center mt-3 mb-2">
                Accelerated Learning
              </Text>
              <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 text-center leading-5">
                Master financial concepts 3x faster with personalized AI guidance
              </Text>
            </View>
            
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-5 items-center shadow-sm">
              <Crown size={24} color="#F59E0B" />
              <Text className="text-base font-inter-semibold text-gray-900 dark:text-white text-center mt-3 mb-2">
                Expert-Level Content
              </Text>
              <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 text-center leading-5">
                Access advanced strategies used by financial professionals
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center pt-5">
            <Text className="text-sm font-inter-semibold text-primary-500 text-center mb-2">
              • Cancel anytime • 7-day free trial • No hidden fees
            </Text>
            <Text className="text-xs font-inter text-gray-500 dark:text-gray-400 text-center leading-5">
              Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}