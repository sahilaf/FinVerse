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
  MessageCircle,
  Star,
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
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const webViewRef = useRef<WebView>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (isConnected && showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000); // Hide after 5 seconds of inactivity
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isConnected, showControls]);

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
        userName: user.name,
        userEmail: user.email,
        conversationName: `Financial Consultation - ${user.name}`,
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
            endConversation(conversationId || undefined);
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

  const showControlsTemporarily = () => {
    setShowControls(true);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.errorContainer}>
          <Bot size={48} color="#FFF" />
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
        {/* Session Header - Only show when controls are visible */}
        {showControls && (
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.sessionTime}>{formatTime(sessionDuration)}</Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 size={20} color="#FFF" />
                ) : (
                  <Maximize2 size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tavus Conversation WebView */}
        <TouchableOpacity 
          style={styles.conversationContainer}
          activeOpacity={1}
          onPress={showControlsTemporarily}
        >
          <WebView
            ref={webViewRef}
            source={{ uri: conversationUrl }}
            style={styles.webView}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onLoadEnd={() => setWebViewLoaded(true)}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Connecting to your AI advisor...</Text>
                  <Text style={styles.loadingSubtext}>
                    Setting up your personalized session with {user?.name}
                  </Text>
                </View>
              </View>
            )}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log('WebView message:', data);
                
                // Handle specific events from Tavus
                if (data.type === 'conversationStarted') {
                  setWebViewLoaded(true);
                } else if (data.type === 'conversationEnded') {
                  endConversation();
                }
              } catch (error) {
                console.log('WebView message (raw):', event.nativeEvent.data);
              }
            }}
            injectedJavaScript={`
              // Enhanced JavaScript injection for better UX
              (function() {
                // Auto-fill user information if forms are present
                function autoFillUserInfo() {
                  const nameInputs = document.querySelectorAll('input[type="text"], input[placeholder*="name"], input[placeholder*="Name"]');
                  nameInputs.forEach(input => {
                    if (input.value === '' || input.placeholder.toLowerCase().includes('name')) {
                      input.value = '${user?.name || 'User'}';
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                      input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                  });
                  
                  // Auto-click join/start buttons
                  const joinButtons = document.querySelectorAll('button');
                  joinButtons.forEach(button => {
                    const text = button.textContent?.toLowerCase() || '';
                    if (text.includes('join') || text.includes('start') || text.includes('continue')) {
                      setTimeout(() => button.click(), 1000);
                    }
                  });
                }
                
                // Run auto-fill after page loads
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', autoFillUserInfo);
                } else {
                  autoFillUserInfo();
                }
                
                // Re-run auto-fill when new content is added
                const observer = new MutationObserver(autoFillUserInfo);
                observer.observe(document.body, { childList: true, subtree: true });
                
                // Handle control messages from React Native
                window.addEventListener('message', function(event) {
                  try {
                    const data = JSON.parse(event.data);
                    switch(data.type) {
                      case 'toggleMute':
                        // Try to find and click mute button
                        const muteBtn = document.querySelector('[data-testid="mute"], button[aria-label*="mute"], button[title*="mute"]');
                        if (muteBtn) muteBtn.click();
                        break;
                      case 'toggleVideo':
                        // Try to find and click video button
                        const videoBtn = document.querySelector('[data-testid="video"], button[aria-label*="video"], button[title*="video"]');
                        if (videoBtn) videoBtn.click();
                        break;
                      case 'toggleVolume':
                        // Try to find and click volume button
                        const volumeBtn = document.querySelector('[data-testid="volume"], button[aria-label*="volume"], button[title*="volume"]');
                        if (volumeBtn) volumeBtn.click();
                        break;
                    }
                  } catch (e) {
                    console.log('Error handling message:', e);
                  }
                });
                
                // Send status updates to React Native
                function sendStatus(type, data) {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...data }));
                }
                
                // Monitor for conversation events
                setTimeout(() => sendStatus('conversationStarted', {}), 2000);
              })();
              true;
            `}
          />
        </TouchableOpacity>

        {/* Control Panel - Only show when controls are visible */}
        {showControls && (
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
                Tap anywhere to show/hide controls
              </Text>
            </View>
          </View>
        )}
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
              Get personalized financial guidance from your AI advisor
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
              <MessageCircle size={24} color="#10B981" />
              <Text style={styles.featureTitle}>Instant Connection</Text>
              <Text style={styles.featureDescription}>
                No waiting rooms or complex setup - jump straight into your session
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.featureTitle}>Personalized Experience</Text>
              <Text style={styles.featureDescription}>
                Your session is automatically customized with your profile information
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
                ? 'Setting up your personalized session...' 
                : 'One-click connection • No setup required'
              }
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>What to Expect</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Zap size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Instant session start with your name pre-filled</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <MessageCircle size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Natural conversation about your financial goals</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Star size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Personalized advice based on your profile</Text>
              </View>
            </View>
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
    marginBottom: 32,
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
    marginBottom: 32,
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
    marginBottom: 32,
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
  benefitsSection: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
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
    marginTop: 16,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
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
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  controlPanel: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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