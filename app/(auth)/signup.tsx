import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://localhost:8081/--/(tabs)',
        },
      });

      if (error) {
        Alert.alert('Google Sign Up Failed', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Google');
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
          Create Account
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-inter-regular">
          Start your journey to financial freedom
        </Text>
      </View>

      {/* Form */}
      <View className="px-6">
        {/* Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-inter-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-4 border border-gray-200 dark:border-gray-700">
            <User size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 dark:text-white font-inter-regular"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

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
              placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <View className="mb-8">
          <Text className="text-sm font-inter-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-4 border border-gray-200 dark:border-gray-700">
            <Lock size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 dark:text-white font-inter-regular"
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleEmailSignUp}
          disabled={loading}
          className={`rounded-2xl py-4 mb-6 ${loading ? 'bg-gray-400' : 'bg-emerald-600'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-inter-bold text-center">
            {loading ? 'Creating Account...' : 'Create Account'}
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

        {/* Google Sign Up */}
        <TouchableOpacity
          onPress={handleGoogleSignUp}
          className="flex-row items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-gray-900 dark:text-white text-lg font-inter-semibold ml-3">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center pb-8">
          <Text className="text-gray-600 dark:text-gray-400 font-inter-regular">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-emerald-600 font-inter-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}