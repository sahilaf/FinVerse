import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';

interface LiveKitRoomProps {
  roomUrl: string;
  token: string;
  onDisconnect: () => void;
  children?: React.ReactNode;
}

export default function LiveKitRoom({ roomUrl, token, onDisconnect, children }: LiveKitRoomProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsReady(true);
      return;
    }

    initializeLiveKit();
  }, [roomUrl, token]);

  const initializeLiveKit = async () => {
    try {
      console.log('Initializing LiveKit with:', { roomUrl, token });
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize LiveKit:', error);
      Alert.alert('Connection Error', 'Failed to connect to the live session');
      onDisconnect();
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Connecting to live session...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webTitle}>LiveKit Integration</Text>
        <Text style={styles.webSubtitle}>
          This feature requires native LiveKit implementation.
        </Text>
        <Text style={styles.webDescription}>
          In production, this would connect to your Tavus + Gemini agent running on LiveKit.
        </Text>
        <View style={styles.connectionInfo}>
          <Text style={styles.infoLabel}>Room URL:</Text>
          <Text style={styles.infoValue}>{roomUrl}</Text>
          <Text style={styles.infoLabel}>Token:</Text>
          <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
            {token}
          </Text>
        </View>
        {children}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Insert native LiveKit SDK view here */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  webTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  webSubtitle: {
    color: '#10B981',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  webDescription: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  connectionInfo: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  infoLabel: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#334155',
    padding: 8,
    borderRadius: 6,
  },
});
