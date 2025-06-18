import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  Sparkles
} from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LiveAgent() {
  const { user } = useUserData();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const [waitingInQueue, setWaitingInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate connection timer
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setConnectionTime(0);
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
    if (Platform.OS === 'web') {
      Alert.alert(
        'Tavus Live Agent Integration',
        'This feature requires Tavus Live Conversation API integration. In production, this would:\n\n• Connect to a live AI financial advisor\n• Provide real-time video conversations\n• Use advanced AI avatars with natural expressions\n• Offer personalized financial guidance\n\nTavus enables realistic AI video conversations with lip-sync, natural expressions, and real-time interaction capabilities.',
        [
          { text: 'Learn More', onPress: () => console.log('Learn more about Tavus') },
          { text: 'Demo Mode', onPress: startDemoConnection }
        ]
      );
    } else {
      startDemoConnection();
    }
  };

  const startDemoConnection = async () => {
    setIsConnecting(true);
    setWaitingInQueue(true);
    setQueuePosition(Math.floor(Math.random() * 5) + 1);

    // Simulate queue waiting
    setTimeout(() => {
      setWaitingInQueue(false);
      setIsConnected(true);
      setIsConnecting(false);
    }, 3000);
  };

  const handleDisconnect = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end your live session with the financial advisor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            setIsConnected(false);
            setIsConnecting(false);
            setWaitingInQueue(false);
            setConnectionTime(0);
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isConnected) {
    return (
      <View style={styles.container}>
        {/* Video Call Interface */}
        <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
          {/* AI Agent Video */}
          <View style={styles.agentVideoContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.agentVideoPlaceholder}
            >
              <Video size={48} color="#FFF" />
              <Text style={styles.agentName}>Sarah - Financial Advisor</Text>
              <Text style={styles.agentStatus}>AI-Powered Live Agent</Text>
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

          {/* Connection Info */}
          <View style={styles.connectionInfo}>
            <View style={styles.connectionBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.connectionText}>LIVE</Text>
            </View>
            <Text style={styles.connectionTime}>{formatTime(connectionTime)}</Text>
          </View>

          {/* Controls Overlay */}
          <View style={styles.controlsOverlay}>
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 size={20} color="#FFF" />
              ) : (
                <Maximize2 size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Controls */}
        {!isFullscreen && (
          <View style={styles.bottomControls}>
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
                style={styles.endCallButton}
                onPress={handleDisconnect}
              >
                <PhoneOff size={24} color="#FFF" />
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
            </View>

            {/* Session Info */}
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Live Financial Consultation</Text>
              <Text style={styles.sessionDescription}>
                Get personalized advice from our AI financial advisor
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Video size={32} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>Live Financial Advisor</Text>
          <Text style={styles.headerSubtitle}>
            Connect with an AI-powered financial expert
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Connection Status */}
        {(isConnecting || waitingInQueue) && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.statusTitle}>
              {waitingInQueue ? 'Connecting to Advisor...' : 'Preparing Session...'}
            </Text>
            {waitingInQueue && (
              <Text style={styles.statusSubtitle}>
                Position in queue: {queuePosition}
              </Text>
            )}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Sparkles size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Personalized Advice</Text>
                <Text style={styles.featureDescription}>
                  Get tailored financial guidance based on your goals and situation
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Users size={20} color="#10B981" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Expert Knowledge</Text>
                <Text style={styles.featureDescription}>
                  Access to comprehensive financial expertise and market insights
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-Time Interaction</Text>
                <Text style={styles.featureDescription}>
                  Ask questions and get immediate responses in natural conversation
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Connect Button */}
        <View style={styles.connectSection}>
          <TouchableOpacity
            style={[styles.connectButton, (isConnecting || waitingInQueue) && styles.disabledConnectButton]}
            onPress={handleConnect}
            disabled={isConnecting || waitingInQueue}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.connectButtonGradient}
            >
              {isConnecting || waitingInQueue ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Video size={24} color="#FFF" />
                  <Text style={styles.connectButtonText}>Start Live Session</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.connectNote}>
            Average session time: 15-30 minutes
          </Text>
        </View>

        {/* Powered by Tavus */}
        <View style={styles.poweredBy}>
          <Text style={styles.poweredByText}>Powered by Tavus Live Conversation API</Text>
          <Text style={styles.poweredBySubtext}>
            Advanced AI avatars with natural expressions and real-time interaction
          </Text>
        </View>
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
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  connectSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  connectButton: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledConnectButton: {
    opacity: 0.6,
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  connectButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  connectNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  poweredBy: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  poweredByText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  poweredBySubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Video Call Styles
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  agentVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentVideoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginTop: 16,
  },
  agentStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  userVideoContainer: {
    position: 'absolute',
    top: 60,
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
  connectionInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  connectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  connectionTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 60,
    right: 160,
  },
  fullscreenButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  bottomControls: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
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
  sessionInfo: {
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});