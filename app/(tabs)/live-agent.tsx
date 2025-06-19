import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
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
  const [hasJoined, setHasJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHasJoined(true);
      setIsLoading(false);
    }, 1500); // simulate loading
  };

  const handleEndCall = () => {
    setHasJoined(false);
  };

  return (
    <View style={styles.container}>
      {!hasJoined ? (
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1350&q=80',
          }}
          style={styles.bg}
          resizeMode="cover"
        >
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.joinContent}>
              <Sparkles size={64} color="#10B981" />
              <Text style={styles.joinTitle}>Talk to Your AI Agent</Text>
              <Text style={styles.joinSubtitle}>Get financial advice instantly</Text>

              <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.joinButtonText}>Join Live Chat</Text>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Live AI Agent</Text>
            <TouchableOpacity onPress={handleEndCall}>
              <PhoneOff color="#f87171" />
            </TouchableOpacity>
          </View>

          {/* Avatar or Video */}
          <View style={styles.videoContainer}>
            <View style={styles.avatarBox}>
              <Sparkles size={64} color="#10B981" />
              <Text style={styles.avatarText}>Tavus Avatar</Text>
            </View>
          </View>

          {/* Controls */}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  joinSubtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    marginVertical: 8,
  },
  joinButton: {
    marginTop: 24,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
