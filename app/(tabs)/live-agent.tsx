import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Phone, 
  PhoneOff, 
  Bot, 
  MessageCircle, 
  Shield, 
  CircleAlert as AlertCircle, 
  RefreshCw,
  Sparkles,
  Users,
  Video
} from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useDailyConversation } from '@/hooks/useDailyConversation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configuration for Tavus API
const TAVUS_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_TAVUS_API_KEY || '',
  replicaId: process.env.EXPO_PUBLIC_TAVUS_REPLICA_ID || 'r4d9b2288937',
  personaId: process.env.EXPO_PUBLIC_TAVUS_PERSONA_ID || 'p59e5e593b7e',
};

export default function LiveAgent() {
  const { user } = useUserData();
  const { 
    isConnected, 
    isConnecting, 
    error, 
    callFrame,
    startConversation, 
    endConversation 
  } = useDailyConversation();
  
  const [sessionDuration, setSessionDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callFrameContainerRef = useRef<HTMLDivElement>(null);

  // Session timer
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSessionDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  // Mount Daily.js call frame to DOM element
  useEffect(() => {
    if (callFrame && callFrameContainerRef.current && Platform.OS === 'web') {
      try {
        // Append the Daily.js iframe to our container
        const iframe = callFrame.iframe();
        if (iframe && callFrameContainerRef.current) {
          // Clear any existing content
          callFrameContainerRef.current.innerHTML = '';
          // Append the iframe
          callFrameContainerRef.current.appendChild(iframe);
        }
      } catch (error) {
        console.error('Error mounting call frame:', error);
      }
    }

    return () => {
      // Cleanup is handled by the hook
    };
  }, [callFrame]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConnect = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to start a live session');
      return;
    }

    // Check configuration
    if (!TAVUS_CONFIG.apiKey) {
      Alert.alert(
        'Configuration Required',
        'Tavus API key is missing. Please add EXPO_PUBLIC_TAVUS_API_KEY to your environment variables.\n\nYou can get your API key from the Tavus dashboard.',
        [
          { text: 'OK' },
          { 
            text: 'Learn More', 
            onPress: () => console.log('Visit: https://platform.tavus.io/') 
          }
        ]
      );
      return;
    }

    if (!TAVUS_CONFIG.replicaId || !TAVUS_CONFIG.personaId) {
      Alert.alert(
        'Configuration Required',
        'Tavus Replica ID and Persona ID are required. Please check your environment variables:\n\n• EXPO_PUBLIC_TAVUS_REPLICA_ID\n• EXPO_PUBLIC_TAVUS_PERSONA_ID',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await startConversation({
        apiKey: TAVUS_CONFIG.apiKey,
        replicaId: TAVUS_CONFIG.replicaId,
        personaId: TAVUS_CONFIG.personaId,
        userName: user.name,
        userEmail: user.email,
        conversationName: `Financial Consultation - ${user.name}`,
      });
    } catch (error: any) {
      console.error('Connection failed:', error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes('401') || error.message.includes('Invalid API key')) {
        userMessage = 'Invalid API key. Please check your Tavus configuration.';
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        userMessage = 'Replica or Persona not found. Please check your Tavus IDs.';
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('500') || error.message.includes('service')) {
        userMessage = 'Tavus service is temporarily unavailable. Please try again later.';
      }
      
      Alert.alert('Connection Failed', userMessage);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end your live session with the AI financial advisor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            endConversation();
          }
        }
      ]
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.errorContainer}>
          <AlertCircle size={48} color="#FFF" />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          
          <View style={styles.errorActions}>
            <TouchableOpacity style={styles.retryButton} onPress={handleConnect}>
              <RefreshCw size={20} color="#FFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.helpButton} 
              onPress={() => {
                Alert.alert(
                  'Troubleshooting',
                  'Common issues:\n\n• Check your internet connection\n• Verify Tavus API key is valid\n• Ensure Replica and Persona IDs are correct\n• Try again in a few moments',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.helpButtonText}>Get Help</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (isConnected && callFrame) {
    return (
      <View style={styles.container}>
        {/* Session Header */}
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.sessionTime}>{formatTime(sessionDuration)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleDisconnect}
          >
            <PhoneOff size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Daily.js Call Frame Container */}
        <View style={styles.callFrameContainer}>
          {Platform.OS === 'web' ? (
            <div 
              ref={callFrameContainerRef}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
              }}
            />
          ) : (
            <View style={styles.nativeCallPlaceholder}>
              <Bot size={48} color="#10B981" />
              <Text style={styles.nativeCallText}>
                Video calling is optimized for web platform
              </Text>
              <Text style={styles.nativeCallSubtext}>
                For the best experience, please use the web version
              </Text>
            </View>
          )}
        </View>

        {/* Session Info Footer */}
        <View style={styles.sessionFooter}>
          <Text style={styles.sessionTitle}>Live Financial Consultation</Text>
          <Text style={styles.sessionDescription}>
            Powered by Daily.js • Enhanced video experience
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['rgba(16, 185, 129, 0.1)', 'rgba(6, 95, 70, 0.3)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Bot size={32} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>AI Financial Advisor</Text>
          <Text style={styles.headerSubtitle}>
            Get personalized financial guidance with enhanced video calling
          </Text>
          {user && (
            <View style={styles.userGreeting}>
              <Text style={styles.greetingText}>
                Ready to help you, {user.name}!
              </Text>
            </View>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <Video size={24} color="#10B981" />
            <Text style={styles.featureTitle}>Enhanced Video Experience</Text>
            <Text style={styles.featureDescription}>
              Powered by Daily.js for crystal-clear video and audio quality
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <MessageCircle size={24} color="#10B981" />
            <Text style={styles.featureTitle}>Instant Connection</Text>
            <Text style={styles.featureDescription}>
              No waiting rooms or complex setup - jump straight into your session
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Shield size={24} color="#3B82F6" />
            <Text style={styles.featureTitle}>Secure & Private</Text>
            <Text style={styles.featureDescription}>
              End-to-end encrypted conversations with enterprise-grade security
            </Text>
          </View>
        </View>

        {/* Connection Button */}
        <View style={styles.connectionSection}>
          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.disabledConnectButton]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.connectButtonGradient}
            >
              {isConnecting ? (
                <>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={styles.connectButtonText}>Connecting...</Text>
                </>
              ) : (
                <>
                  <Phone size={24} color="#FFF" />
                  <Text style={styles.connectButtonText}>Start Live Session</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.connectionNote}>
            {isConnecting 
              ? 'Setting up your enhanced video session...' 
              : 'Powered by Daily.js • Professional video calling'
            }
          </Text>
        </View>

        {/* Technology Info */}
        <View style={styles.techSection}>
          <View style={styles.techCard}>
            <Sparkles size={20} color="#F59E0B" />
            <Text style={styles.techTitle}>Daily.js Integration</Text>
            <Text style={styles.techDescription}>
              Professional-grade video calling with advanced features and reliability
            </Text>
          </View>
          
          <View style={styles.techCard}>
            <Users size={20} color="#3B82F6" />
            <Text style={styles.techTitle}>Optimized Experience</Text>
            <Text style={styles.techDescription}>
              Custom UI themes and mobile-optimized controls for the best experience
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 48
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  userGreeting: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  greetingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  connectionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  connectButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledConnectButton: {
    opacity: 0.6,
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    gap: 12,
  },
  connectButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  connectionNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  techSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  techCard: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  techTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  techDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  helpButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  // Session UI Styles
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  liveText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  sessionTime: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  endCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callFrameContainer: {
    flex: 1,
    backgroundColor: '#000',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nativeCallPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 40,
  },
  nativeCallText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  nativeCallSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  sessionFooter: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});