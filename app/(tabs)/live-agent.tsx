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
import { WebView } from 'react-native-webview';
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
import { useTavusConversation } from '@/hooks/useTavusConversation';

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
    conversationUrl, 
    conversationId, 
    startConversation, 
    endConversation 
  } = useTavusConversation();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const webViewRef = useRef<WebView>(null);

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

    if (!TAVUS_CONFIG.apiKey) {
      Alert.alert(
        'Configuration Required',
        'Tavus API key is required. Please add EXPO_PUBLIC_TAVUS_API_KEY to your environment variables.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await startConversation({
        apiKey: TAVUS_CONFIG.apiKey,
        replicaId: TAVUS_CONFIG.replicaId,
        personaId: TAVUS_CONFIG.personaId,
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
            endConversation();
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Send mute command to WebView
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'toggleMute',
        muted: !isMuted
      }));
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Send video toggle command to WebView
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'toggleVideo',
        enabled: !isVideoEnabled
      }));
    }
  };

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
    // Send volume toggle command to WebView
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'toggleVolume',
        enabled: !isVolumeOn
      }));
    }
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

  if (isConnected && conversationUrl) {
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
          
          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 size={20} color="#FFF" />
            ) : (
              <Maximize2 size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Tavus Conversation WebView */}
        <View style={styles.conversationContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: conversationUrl }}
            style={styles.webView}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Connecting to your AI advisor...</Text>
              </View>
            )}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log('WebView message:', data);
                // Handle messages from the Tavus conversation if needed
              } catch (error) {
                console.log('WebView message (raw):', event.nativeEvent.data);
              }
            }}
            injectedJavaScript={`
              // Inject JavaScript to handle controls
              window.addEventListener('message', function(event) {
                const data = JSON.parse(event.data);
                switch(data.type) {
                  case 'toggleMute':
                    // Handle mute toggle in Tavus interface
                    break;
                  case 'toggleVideo':
                    // Handle video toggle in Tavus interface
                    break;
                  case 'toggleVolume':
                    // Handle volume toggle in Tavus interface
                    break;
                }
              });
              true;
            `}
          />
        </View>

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
              <Text style={styles.featureTitle}>AI-Powered</Text>
              <Text style={styles.featureDescription}>
                Advanced AI understanding for complex financial questions
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <Shield size={24} color="#3B82F6" />
              <Text style={styles.featureTitle}>Secure & Private</Text>
              <Text style={styles.featureDescription}>
                End-to-end encrypted sessions via Tavus infrastructure
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
            <Text style={styles.techTitle}>Powered by Tavus AI</Text>
            <Text style={styles.techDescription}>
              • Realistic AI avatars with natural expressions{'\n'}
              • Advanced conversational AI capabilities{'\n'}
              • Real-time video communication{'\n'}
              • Secure and private conversations
            </Text>
          </View>
        </LinearGradient>
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
  conversationContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFF',
    marginTop: 16,
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