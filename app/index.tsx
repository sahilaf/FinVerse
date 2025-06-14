import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace('/(auth)');
      } else if (profile && !profile.onboarding_completed) {
        router.replace('/onboarding');
      } else if (profile && profile.onboarding_completed) {
        router.replace('/(tabs)');
      }
    }
  }, [session, profile, loading, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading FinVerse...</Text>
      </View>
    );
  }

  // This should not be reached due to the useEffect redirects
  return <Redirect href="/(auth)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});