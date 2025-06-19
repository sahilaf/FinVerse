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
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Sparkles,
  Bot,
  Zap,
  Shield,
} from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useLiveKitConnection } from '@/hooks/useLiveKitConnection';
import LiveKitRoom from '@/components/LiveKitRoom';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configuration for your LiveKit server
const LIVEKIT_CONFIG = {
  serverUrl: process.env.EXPO_PUBLIC_LIVEKIT_URL || 'wss://finverse-kev4ntpv.livekit.cloud',
  apiKey: process.env.EXPO_PUBLIC_LIVEKIT_API_KEY,
};

export default function LiveAgent() {
  const { user } = useUserData();
  const { isConnected, isConnecting, error, roomUrl, token, connect, disconnect } = useLiveKitConnection();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    if (Platform.OS === 'web') {
      Alert.alert(
        'Tavus + LiveKit Integration',
        'This connects to your external Tavus + Gemini agent running on LiveKit.\n\nIn production:\n• Real-time video with Tavus avatars\n• Gemini-powered financial advice\n• LiveKit WebRTC infrastructure\n• Secure room-based sessions',
        [
          { text: 'Learn More', onPress: () => console.log('Learn more about integration') },
          { text: 'Demo Connection', onPress: startDemoConnection }
        ]
      );
    } else {
      startDemoConnection();
    }
  };

  const startDemoConnection = async () => {
    try {
      await connect({
        serverUrl: LIVEKIT_CONFIG.serverUrl,
        apiKey: LIVEKIT_CONFIG.apiKey,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'User',
      });
    } catch (error: any) {
      Alert.alert('Connection Failed', error.message);
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
            disconnect();
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real implementation, this would control LiveKit audio
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real implementation, this would control LiveKit video
  };

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
    // In real implementation, this would control audio output
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleConnect}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (isConnected && roomUrl && token) {
    return (
      <View style={styles.container}>
        <LiveKitRoom roomUrl={roomUrl} token={token} onDisconnect={disconnect}>
          {/* Session Header */}
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.sessionTime}>{formatTime(sessionDuration)}</Text>
            </View>
            
            <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 size={20} color="#FFF" />
              ) : (
                <Maximize2 size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Tavus Avatar Display Area */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.avatarPlaceholder}
            >
              <Bot size={48} color="#FFF" />
              <Text style={styles.avatarName}>Sarah - AI Financial Advisor</Text>
              <Text style={styles.avatarStatus}>Powered by Tavus + Gemini</Text>
            </LinearGradient>
          </View>

          {/* User Video (Picture-in-Picture) */}
          {isVideoEnabled && (
            <View style={styles.userVideoContainer}>
              <View style={styles.userVideoPlaceholder}>
                <Text style={styles.userInitial}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </View>
            </View>
          )}

          {/* Control Panel */}
          <View style={styles.controlPanel}>
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.controlButton, isMuted && styles.mutedButton]}
                onPress={toggleMute}
              >
                {isMuted ? (
                  <MicOff size={24} color="#FFF" />
                ) : (
                  <Mic size={24} color="#FFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, !isVideoEnabled && styles.disabledButton]}
                onPress={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video size={24} color="#FFF" />
                ) : (
                  <VideoOff size={24} color="#FFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, !isVolumeOn && styles.disabledButton]}
                onPress={toggleVolume}
              >
                {isVolumeOn ? (
                  <Volume2 size={24} color="#FFF" />
                ) : (
                  <VolumeX size={24} color="#FFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.endCallButton}
                onPress={handleDisconnect}
              >
                <PhoneOff size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.sessionDetails}>
              <Text style={styles.sessionTitle}>Live Financial Consultation</Text>
              <Text style={styles.sessionDescription}>
                Real-time advice from your AI financial advisor
              </Text>
            </View>
          </View>
        </LiveKitRoom>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1200',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
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
                Connect with Tavus-powered AI for personalized financial guidance
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <View style={styles.featureCard}>
                <Sparkles size={24} color="#10B981" />
                <Text style={styles.featureTitle}>Real-Time Video</Text>
                <Text style={styles.featureDescription}>
                  Face-to-face conversation with lifelike AI avatar
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <Zap size={24} color="#F59E0B" />
                <Text style={styles.featureTitle}>Gemini-Powered</Text>
                <Text style={styles.featureDescription}>
                  Advanced AI understanding for complex financial questions
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <Shield size={24} color="#3B82F6" />
                <Text style={styles.featureTitle}>Secure & Private</Text>
                <Text style={styles.featureDescription}>
                  End-to-end encrypted sessions via LiveKit infrastructure
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
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Phone size={24} color="#FFF" />
                      <Text style={styles.connectButtonText}>Start Live Session</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.connectionNote}>
                {isConnecting ? 'Connecting to your AI advisor...' : 'Average session: 15-30 minutes'}
              </Text>
            </View>

            {/* Technical Info */}
            <View style={styles.techInfo}>
              <Text style={styles.techTitle}>Powered by Advanced AI</Text>
              <Text style={styles.techDescription}>
                • Tavus: Realistic AI avatars with natural expressions{'\n'}
                • Gemini: Google's most capable AI model{'\n'}
                • LiveKit: Enterprise-grade WebRTC infrastructure
              </Text>
            </View>
          </LinearGradient>
        </BlurView>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  featuresSection: {
    marginBottom: 40,
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
    marginBottom: 40,
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
  techInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  techTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 12,
  },
  techDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
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
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  fullscreenButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginTop: 16,
    textAlign: 'center',
  },
  avatarStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  userVideoContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  controlPanel: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    backgroundColor: '#EF4444',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionDetails: {
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});