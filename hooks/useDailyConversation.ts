import { useState, useCallback, useRef, useEffect } from 'react';
import DailyIframe from '@daily-co/daily-js';

interface DailyConversationState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  conversationUrl: string | null;
  conversationId: string | null;
  callFrame: any | null;
}

interface ConversationConfig {
  replicaId: string;
  personaId: string;
  apiKey: string;
  userName?: string;
  userEmail?: string;
  conversationName?: string;
}

export function useDailyConversation() {
  const [state, setState] = useState<DailyConversationState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    conversationUrl: null,
    conversationId: null,
    callFrame: null,
  });

  const callFrameRef = useRef<any>(null);

  // Create Tavus conversation with enhanced properties
  const createConversation = async (config: ConversationConfig): Promise<string> => {
    console.log('Creating Tavus conversation with Daily.js integration...');

    const conversationPayload = {
      replica_id: config.replicaId,
      persona_id: config.personaId,
      conversation_name: config.conversationName || 'Mobile App Chat',
      properties: {
        max_call_duration: 1800, // 30 minutes
        participant_left_timeout: 60,
        participant_absent_timeout: 300,
        enable_closed_captions: false, // Reduce UI clutter
        language: 'english',
      }
    };

    console.log('Sending payload to Tavus API:', conversationPayload);

    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey
      },
      body: JSON.stringify(conversationPayload),
    });

    console.log('Tavus API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        console.log('Tavus API error response:', errorData);
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
      }

      // Provide specific error messages
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your Tavus API configuration.';
      } else if (response.status === 404) {
        errorMessage = 'Replica or Persona not found. Please check your IDs.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (response.status >= 500) {
        errorMessage = 'Tavus service is temporarily unavailable. Please try again later.';
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Tavus API success response:', data);

    if (!data.conversation_url) {
      throw new Error('No conversation URL received from Tavus API');
    }

    return data.conversation_url;
  };

  // Join conversation using Daily.js
  const joinConversation = async (conversationUrl: string, config: ConversationConfig) => {
    console.log('Joining conversation with Daily.js:', conversationUrl);

    // Create Daily call frame with optimized settings for mobile
    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '12px',
      },
      showLeaveButton: true,
      showFullscreenButton: false,
      showLocalVideo: true,
      showParticipantsBar: false,
      theme: {
        colors: {
          accent: '#10B981',
          accentText: '#FFFFFF',
          background: '#111827',
          backgroundAccent: '#1F2937',
          baseText: '#F9FAFB',
          border: '#374151',
          mainAreaBg: '#000000',
          mainAreaBgAccent: '#1F2937',
          mainAreaText: '#F9FAFB',
          supportiveText: '#9CA3AF',
        },
      },
    });

    callFrameRef.current = callFrame;

    // Set up event listeners
    callFrame
      .on('joined-meeting', () => {
        console.log('Successfully joined the conversation');
        setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));
      })
      .on('left-meeting', () => {
        console.log('Left the conversation');
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false,
          callFrame: null 
        }));
      })
      .on('error', (error) => {
        console.error('Daily.js error:', error);
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Connection error occurred',
          isConnecting: false 
        }));
      })
      .on('participant-joined', (event) => {
        console.log('Participant joined:', event.participant);
      })
      .on('participant-left', (event) => {
        console.log('Participant left:', event.participant);
      });

    // Join the conversation with pre-configured settings
    try {
      await callFrame.join({
        url: conversationUrl,
        userName: config.userName || 'Mobile User',
        userData: { 
          source: 'mobile_app',
          email: config.userEmail,
        },
        // Pre-configure media settings
        startVideoOff: false,
        startAudioOff: false,
      });

      setState(prev => ({ ...prev, callFrame }));
      return callFrame;
    } catch (error: any) {
      console.error('Failed to join conversation:', error);
      throw new Error(`Failed to join conversation: ${error.message}`);
    }
  };

  const startConversation = useCallback(async (config: ConversationConfig) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Validate required configuration
      if (!config.apiKey) {
        throw new Error('Tavus API key is required');
      }
      if (!config.replicaId) {
        throw new Error('Replica ID is required');
      }
      if (!config.personaId) {
        throw new Error('Persona ID is required');
      }

      // Step 1: Create conversation
      const conversationUrl = await createConversation(config);
      
      setState(prev => ({ 
        ...prev, 
        conversationUrl,
        conversationId: conversationUrl.split('/').pop() || null 
      }));

      // Step 2: Join conversation with Daily.js
      const callFrame = await joinConversation(conversationUrl, config);

      return { conversationUrl, callFrame };
    } catch (error: any) {
      console.error('Conversation creation/join failed:', error);
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to start conversation with AI advisor',
      }));
      
      throw error;
    }
  }, []);

  const endConversation = useCallback(async () => {
    console.log('Ending conversation...');
    
    if (callFrameRef.current) {
      try {
        await callFrameRef.current.leave();
        await callFrameRef.current.destroy();
      } catch (error) {
        console.warn('Error ending call frame:', error);
      }
      callFrameRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      conversationUrl: null,
      conversationId: null,
      callFrame: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, []);

  return {
    ...state,
    startConversation,
    endConversation,
  };
}