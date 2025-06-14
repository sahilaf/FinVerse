import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, ChevronLeft, TrendingUp, DollarSign, Target, BookOpen } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to FinVerse!',
    subtitle: 'Let\'s personalize your financial education journey',
    icon: TrendingUp,
    content: 'PersonalInfo'
  },
  {
    id: 2,
    title: 'What\'s your financial goal?',
    subtitle: 'This helps us recommend the best content for you',
    icon: Target,
    content: 'Goals'
  },
  {
    id: 3,
    title: 'Current financial knowledge?',
    subtitle: 'Be honest - we\'ll tailor lessons to your level',
    icon: BookOpen,
    content: 'Knowledge'
  },
  {
    id: 4,
    title: 'Preferred currency?',
    subtitle: 'We\'ll show examples in your local currency',
    icon: DollarSign,
    content: 'Currency'
  }
];

const goals = [
  { id: 'budgeting', title: 'Better Budgeting', description: 'Learn to manage money effectively' },
  { id: 'saving', title: 'Build Savings', description: 'Create an emergency fund and save more' },
  { id: 'investing', title: 'Start Investing', description: 'Grow wealth through smart investments' },
  { id: 'debt', title: 'Pay Off Debt', description: 'Eliminate debt and improve credit' },
  { id: 'retirement', title: 'Plan Retirement', description: 'Secure your financial future' },
  { id: 'general', title: 'General Knowledge', description: 'Learn all aspects of personal finance' }
];

const knowledgeLevels = [
  { id: 'beginner', title: 'Beginner', description: 'New to personal finance' },
  { id: 'intermediate', title: 'Intermediate', description: 'Some experience with money management' },
  { id: 'advanced', title: 'Advanced', description: 'Experienced with financial concepts' }
];

const currencies = [
  { id: 'USD', title: 'US Dollar', symbol: '$' },
  { id: 'EUR', title: 'Euro', symbol: '€' },
  { id: 'GBP', title: 'British Pound', symbol: '£' },
  { id: 'CAD', title: 'Canadian Dollar', symbol: 'C$' },
  { id: 'AUD', title: 'Australian Dollar', symbol: 'A$' },
  { id: 'INR', title: 'Indian Rupee', symbol: '₹' }
];

export default function Onboarding() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedKnowledge, setSelectedKnowledge] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!selectedGoal || !selectedKnowledge) {
      Alert.alert('Please complete all steps', 'Make sure to select your goal and knowledge level');
      return;
    }

    setLoading(true);
    const { error } = await updateProfile({
      currency: selectedCurrency,
      onboarding_completed: true,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    } else {
      // Navigate to the main app (tabs)
      router.replace('/(tabs)');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return selectedGoal !== '';
      case 2:
        return selectedKnowledge !== '';
      case 3:
        return selectedCurrency !== '';
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];

    switch (step.content) {
      case 'PersonalInfo':
        return (
          <View style={styles.stepContent}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Hi {profile?.full_name?.split(' ')[0] || 'there'}! 👋
              </Text>
              <Text style={styles.descriptionText}>
                We're excited to help you master your finances. Let's set up your personalized learning experience in just a few steps.
              </Text>
            </View>
          </View>
        );

      case 'Goals':
        return (
          <View style={styles.stepContent}>
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.optionCard,
                    selectedGoal === goal.id && styles.selectedOption
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionTitle,
                    selectedGoal === goal.id && styles.selectedOptionText
                  ]}>
                    {goal.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    selectedGoal === goal.id && styles.selectedOptionDescription
                  ]}>
                    {goal.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'Knowledge':
        return (
          <View style={styles.stepContent}>
            <View style={styles.optionsContainer}>
              {knowledgeLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionCard,
                    selectedKnowledge === level.id && styles.selectedOption
                  ]}
                  onPress={() => setSelectedKnowledge(level.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionTitle,
                    selectedKnowledge === level.id && styles.selectedOptionText
                  ]}>
                    {level.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    selectedKnowledge === level.id && styles.selectedOptionDescription
                  ]}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'Currency':
        return (
          <View style={styles.stepContent}>
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.id}
                  style={[
                    styles.optionCard,
                    selectedCurrency === currency.id && styles.selectedOption
                  ]}
                  onPress={() => setSelectedCurrency(currency.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionTitle,
                    selectedCurrency === currency.id && styles.selectedOptionText
                  ]}>
                    {currency.symbol} {currency.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#065F46', '#047857']}
        style={styles.header}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {onboardingSteps.length}
          </Text>
        </View>

        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.iconContainer}>
            <IconComponent size={32} color="#FFF" />
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {renderStepContent()}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.disabledButton,
            currentStep === 0 && styles.fullWidthButton
          ]}
          onPress={handleNext}
          disabled={!canProceed() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Completing...' : currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          {currentStep < onboardingSteps.length - 1 && (
            <ChevronRight size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  stepHeader: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepContent: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#065F46',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  selectedOptionDescription: {
    color: '#047857',
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 4,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fullWidthButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginRight: 4,
  },
});