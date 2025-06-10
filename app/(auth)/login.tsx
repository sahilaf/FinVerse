import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://localhost:8081/--/(tabs)',
        },
      });

      if (error) {
        Alert.alert('Google Login Failed', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-8"
        >
          <ArrowLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <Text className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-inter-regular">
          Sign in to continue your financial journey
        </Text>
      </View>

      {/* Form */}
      <View className="px-6">
        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm font-inter-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-4 border border-gray-200 dark:border-gray-700">
            <Mail size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 dark:text-white font-inter-regular"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-inter-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-4 border border-gray-200 dark:border-gray-700">
            <Lock size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 dark:text-white font-inter-regular"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity className="mb-8">
          <Text className="text-emerald-600 font-inter-semibold text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleEmailLogin}
          disabled={loading}
          className={`rounded-2xl py-4 mb-6 ${loading ? 'bg-gray-400' : 'bg-emerald-600'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-inter-bold text-center">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400 font-inter-medium">
            or continue with
          </Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </View>

        {/* Google Login */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          className="flex-row items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-gray-900 dark:text-white text-lg font-inter-semibold ml-3">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600 dark:text-gray-400 font-inter-regular">
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-emerald-600 font-inter-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}