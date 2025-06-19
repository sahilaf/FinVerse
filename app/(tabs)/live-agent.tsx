import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LiveAgent() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEndCall = () => {
    // End call logic
    Alert.alert('Call Ended');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Live AI Agent</Text>
          <TouchableOpacity>
            <Settings color="white" />
          </TouchableOpacity>
        </View>

        {/* Video/Avatar Area */}
        <View style={styles.videoContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#10B981" />
          ) : (
            <View style={styles.avatarBox}>
              <Sparkles size={64} color="#10B981" />
              <Text style={styles.avatarText}>Tavus Avatar</Text>
            </View>
          )}
        </View>

        {/* Call Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic color="white" /> : <MicOff color="white" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video color="white" /> : <VideoOff color="white" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <PhoneOff color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsVolumeOn(!isVolumeOn)}
          >
            {isVolumeOn ? <Volume2 color="white" /> : <VolumeX color="white" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 color="white" /> : <Maximize2 color="white" />}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Users color="#94a3b8" size={20} />
          <Text style={styles.footerText}>You’re talking to a virtual agent</Text>
          <Clock color="#94a3b8" size={20} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBox: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 40,
  },
  endCallButton: {
    backgroundColor: '#dc2626',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
