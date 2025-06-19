import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface LiveKitConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  roomUrl: string | null;
  token: string | null;
}

interface ConnectionConfig {
  serverUrl: string;
  apiKey?: string;
  userId: string;
  userName: string;
}

export function useLiveKitConnection() {
  const [state, setState] = useState<LiveKitConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    roomUrl: null,
    token: null,
  });

  const connect = useCallback(async (config: ConnectionConfig) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // For web platform, we'll simulate the connection
      // In a real implementation, you'd call your LiveKit server to get room details
      if (Platform.OS === 'web') {
        // Simulate API call to your LiveKit server
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          roomUrl: `${config.serverUrl}/room-${Date.now()}`,
          token: simulated-token-${config.userId},
        }));
        
        return;
      }

      // For native platforms, make actual API call to your LiveKit server
      const response = await fetch(${config.serverUrl}/api/create-room, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': Bearer ${config.apiKey} }),
        },
        body: JSON.stringify({
          userId: config.userId,
          userName: config.userName,
          roomName: financial-session-${Date.now()},
        }),
      });

      if (!response.ok) {
        throw new Error(Failed to create room: ${response.statusText});
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        roomUrl: data.roomUrl,
        token: data.token,
      }));

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect to live session',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      roomUrl: null,
      token: null,
    });
  }, []);

  return {
    ...state,
    connect,
    disconnect,
  };
}