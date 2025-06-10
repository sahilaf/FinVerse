import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TrendingUp, Shield, Zap, Users } from 'lucide-react-native';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Learning',
    description: 'AI-powered lessons that adapt to your pace and knowledge level'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is protected with bank-level security'
  },
  {
    icon: Zap,
    title: 'Quick Progress',
    description: 'Learn essential financial skills in just 10 minutes a day'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Learn from certified financial educators and industry experts'
  }
];

export default function Welcome() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <LinearGradient
        colors={['#065F46', '#047857']}
        className="px-6 pt-16 pb-12"
      >
        <View className="items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-6">
            <TrendingUp size={40} color="#FFF" />
          </View>
          
          <Text className="text-4xl font-poppins-bold text-white text-center mb-4">
            Welcome to FinVerse
          </Text>
          
          <Text className="text-lg font-inter-regular text-white/90 text-center leading-6">
            Master your financial future with personalized AI-powered education
          </Text>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View className="px-6 py-12">
        <Text className="text-2xl font-poppins-semibold text-gray-900 dark:text-white text-center mb-8">
          Why Choose FinVerse?
        </Text>
        
        <View className="space-y-6">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-start space-x-4">
              <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center">
                <feature.icon size={24} color="#10B981" />
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-inter-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 font-inter-regular leading-5">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View className="px-6 pb-12">
        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          className="bg-emerald-600 rounded-2xl py-4 mb-4 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-inter-bold text-center">
            Get Started Free
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="border-2 border-emerald-600 rounded-2xl py-4"
          activeOpacity={0.8}
        >
          <Text className="text-emerald-600 text-lg font-inter-semibold text-center">
            I Already Have an Account
          </Text>
        </TouchableOpacity>
        
        <Text className="text-sm font-inter-regular text-gray-500 dark:text-gray-400 text-center mt-6 leading-5">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
}