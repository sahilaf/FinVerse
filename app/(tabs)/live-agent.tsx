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
import { WebView } from 'react-native-webview';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Maximize2, Minimize2, Volume2, VolumeX, Bot, RefreshCw } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useTavusConversation } from '@/hooks/useTavusConversation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configuration for Tavus API
const TAVUS_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_TAVUS_API_KEY || '',
  replicaId: process.env.EXPO_PUBLIC_TAVUS_REPLICA_ID || '',
  personaId: process.env.EXPO_PUBLIC_TAVUS_PERSONA_ID || '',
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
  const [sessionDuration, setSessionDuration] = useState(0);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dailyCallObject, setDailyCallObject] = useState<any>(null);
  
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
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSessionDuration(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConnected]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (isConnected && showControls) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
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

    // Validate configuration
    const missingConfig = [];
    if (!TAVUS_CONFIG.apiKey) missingConfig.push('API Key');
    if (!TAVUS_CONFIG.replicaId) missingConfig.push('Replica ID');
    if (!TAVUS_CONFIG.personaId) missingConfig.push('Persona ID');
    
    if (missingConfig.length > 0) {
      Alert.alert(
        'Configuration Required',
        `Missing Tavus configuration: ${missingConfig.join(', ')}.\n\nPlease check your environment variables.`,
        [
          { text: 'OK' },
          { 
            text: 'Dashboard', 
            onPress: () => console.log('Visit: https://platform.tavus.io/') 
          }
        ]
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
      
      // User-friendly error messages
      let userMessage = error.message || 'An unknown error occurred';
      if (error.message?.includes('401')) userMessage = 'Invalid API key';
      else if (error.message?.includes('404')) userMessage = 'Replica or Persona not found';
      else if (error.message?.includes('429')) userMessage = 'Too many requests, please try again later';
      else if (error.message?.includes('500')) userMessage = 'Service unavailable, please try again later';
      
      Alert.alert('Connection Failed', userMessage);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            if (dailyCallObject) {
              dailyCallObject.leave();
            }
            endConversation(conversationId || undefined);
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (dailyCallObject) {
      dailyCallObject.setLocalAudio(!isMuted);
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'toggleMute', muted: !isMuted }));
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (dailyCallObject) {
      dailyCallObject.setLocalVideo(!isVideoEnabled);
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'toggleVideo', enabled: !isVideoEnabled }));
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
  };

  // Enhanced Daily.js integration
  const initializeDailyCall = () => {
    if (!conversationUrl) return;

    // Initialize Daily.js
    const callFrame = (window as any).DailyIframe?.createFrame({
      iframeStyle: {
        width: '100%',
        height: '100%',
      },
      showLeaveButton: false,
      showFullscreenButton: false,
    });

    callFrame.join({ url: conversationUrl })
      .then(() => {
        console.log('Joined Daily.co call');
        setDailyCallObject(callFrame);
        
        // Set initial state
        callFrame.getLocalAudio().then(audio => setIsMuted(!audio));
        callFrame.getLocalVideo().then(video => setIsVideoEnabled(video));
        
        // Set up event listeners
        callFrame.on('left-meeting', () => {
          console.log('Left meeting');
          endConversation();
        });
        
        callFrame.on('participant-updated', (e: any) => {
          if (e.participant.local) {
            setIsMuted(!e.participant.audio);
            setIsVideoEnabled(e.participant.video);
          }
        });
      })
      .catch((err: any) => {
        console.error('Daily.co join error:', err);
        Alert.alert('Connection Error', 'Failed to join video session');
      });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          
          <TouchableOpacity style={styles.retryButton} onPress={handleConnect}>
            <RefreshCw size={20} color="#FFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (isConnected && conversationUrl) {
    return (
      <View style={styles.container}>
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
              <TouchableOpacity style={styles.headerButton}>
                <Maximize2 size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

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
            onLoadEnd={() => {
              setWebViewLoaded(true);
              initializeDailyCall();
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              Alert.alert(
                'Connection Error',
                'Failed to load the conversation. Please check your internet connection.'
              );
            }}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Connecting to your AI advisor...</Text>
                </View>
              </View>
            )}
            injectedJavaScript={`
              // Initialize Daily.js if available
              if (window.DailyIframe) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dailyAvailable' }));
              }
              
              // Auto-fill user information
              setTimeout(() => {
                try {
                  const nameInputs = document.querySelectorAll('input[type="text"]');
                  const emailInputs = document.querySelectorAll('input[type="email"]');
                  
                  if (nameInputs.length > 0) {
                    nameInputs[0].value = '${user?.name || 'User'}';
                    const inputEvent = new Event('input', { bubbles: true });
                    nameInputs[0].dispatchEvent(inputEvent);
                  }
                  
                  if (emailInputs.length > 0) {
                    emailInputs[0].value = '${user?.email || ''}';
                    const inputEvent = new Event('input', { bubbles: true });
                    emailInputs[0].dispatchEvent(inputEvent);
                  }
                  
                  // Auto-click join button after 1s
                  setTimeout(() => {
                    const buttons = document.querySelectorAll('button');
                    for (const btn of buttons) {
                      if (btn.innerText.toLowerCase().includes('join') || 
                          btn.innerText.toLowerCase().includes('enter')) {
                        btn.click();
                        break;
                      }
                    }
                  }, 1000);
                } catch (e) {
                  window.ReactNativeWebView.postMessage('Auto-fill error: ' + e.message);
                }
              }, 500);
              true;
            `}
          />
        </TouchableOpacity>

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
                style={styles.endCallButton}
                onPress={handleDisconnect}
              >
                <PhoneOff size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['rgba(16, 185, 129, 0.1)', 'rgba(6, 95, 70, 0.3)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Bot size={32} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>AI Financial Advisor</Text>
          <Text style={styles.headerSubtitle}>
            Get personalized financial guidance
          </Text>
        </View>

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
    marginBottom: 24,
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
  configSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  configItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  configValid: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  configInvalid: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  configIcon: {
    marginRight: 8,
  },
  configText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
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