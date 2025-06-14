import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Redirect } from 'expo-router';
import { TrendingUp, Sparkles, BookOpen } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only proceed with navigation logic when not loading
    if (!loading) {
      console.log('Index: Auth state loaded', { 
        hasSession: !!session, 
        hasProfile: !!profile, 
        onboardingCompleted: profile?.onboarding_completed 
      });

      if (!session) {
        console.log('Index: No session, redirecting to auth');
        router.replace('/(auth)');
        return;
      }

      if (profile === null) {
        console.log('Index: Profile is null, staying on loading screen');
        return;
      }

      if (!profile.onboarding_completed) {
        console.log('Index: Onboarding not completed, redirecting to onboarding');
        router.replace('/onboarding');
        return;
      }

      console.log('Index: All checks passed, redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [session, profile, loading, router]);

  // Show loading screen while auth state is being determined
  if (loading || (session && profile === null)) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#065F46', '#047857', '#059669']}
          style={styles.gradient}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <TrendingUp size={48} color="#FFF" />
              </View>
              <Text style={styles.logoText}>FinVerse</Text>
              <Text style={styles.tagline}>Master Your Financial Future</Text>
            </View>

            {/* Loading Animation */}
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>
                Loading your financial journey...
              </Text>
              <Text style={styles.loadingSubtext}>
                Preparing personalized content
              </Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <BookOpen size={24} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Interactive Lessons</Text>
              </View>

              <View style={styles.featureItem}>
                <Sparkles size={24} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>AI-Powered Learning</Text>
              </View>

              <View style={styles.featureItem}>
                <TrendingUp size={24} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featureText}>Track Your Progress</Text>
              </View>
            </View>

            {/* Loading Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>
                Setting up your experience...
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Welcome to the future of financial education
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  // This should not be reached due to the useEffect redirects
  return <Redirect href="/(auth)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  loadingText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginLeft: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});