import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Crown, Check, Star, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

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

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    // Note: RevenueCat integration would be implemented here
    // Since RevenueCat requires native code, users would need to export
    // the project and implement RevenueCat locally
    console.log(`Subscribe to ${plan} plan`);
    
    // For demonstration, show an alert
    alert(`RevenueCat Integration Required\n\nTo implement subscriptions, you'll need to:\n\n1. Export this project to your local environment\n2. Install RevenueCat SDK\n3. Configure your RevenueCat dashboard\n4. Add subscription products\n\nRevenueCat handles all billing, receipt validation, and subscription management across iOS and Android.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.crownIcon}>
              <Crown size={32} color="#FFF" />
            </View>
            
            <Text style={styles.heroTitle}>Unlock Premium</Text>
            <Text style={styles.heroSubtitle}>
              Get unlimited access to advanced financial education and personalized AI guidance
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Premium Features</Text>
            
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.checkIcon}>
                  <Check size={16} color="#FFF" />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Plans */}
          <View style={styles.pricingSection}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            
            {/* Annual Plan */}
            <View style={styles.planCard}>
              <View style={styles.planBadge}>
                <Star size={12} color="#FFF" />
                <Text style={styles.planBadgeText}>BEST VALUE</Text>
              </View>
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Annual Plan</Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>$7.99</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
                <Text style={styles.planBilled}>Billed annually at $95.88</Text>
                <Text style={styles.planSavings}>Save 33% compared to monthly</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => handleSubscribe('annual')}
              >
                <Text style={styles.subscribeButtonText}>Start Annual Plan</Text>
              </TouchableOpacity>
            </View>

            {/* Monthly Plan */}
            <View style={[styles.planCard, styles.monthlyPlan]}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Monthly Plan</Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>$11.99</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
                <Text style={styles.planBilled}>Billed monthly</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.subscribeButton, styles.monthlyButton]}
                onPress={() => handleSubscribe('monthly')}
              >
                <Text style={[styles.subscribeButtonText, styles.monthlyButtonText]}>
                  Start Monthly Plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Highlights */}
          <View style={styles.benefitsSection}>
            <View style={styles.benefitCard}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.benefitTitle}>Accelerated Learning</Text>
              <Text style={styles.benefitDescription}>
                Master financial concepts 3x faster with personalized AI guidance
              </Text>
            </View>
            
            <View style={styles.benefitCard}>
              <Crown size={24} color="#F59E0B" />
              <Text style={styles.benefitTitle}>Expert-Level Content</Text>
              <Text style={styles.benefitDescription}>
                Access advanced strategies used by financial professionals
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              • Cancel anytime • 7-day free trial • No hidden fees
            </Text>
            <Text style={styles.footerSubtext}>
              Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  crownIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  pricingSection: {
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#F59E0B',
    position: 'relative',
  },
  monthlyPlan: {
    borderColor: '#E5E7EB',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginLeft: 4,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#F59E0B',
  },
  planPeriod: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  planBilled: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  subscribeButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  monthlyButton: {
    backgroundColor: '#F3F4F6',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  monthlyButtonText: {
    color: '#374151',
  },
  benefitsSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  benefitCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});