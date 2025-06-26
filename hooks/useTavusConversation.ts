import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

interface TavusConversationState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  conversationUrl: string | null;
  conversationId: string | null;
}

interface ConversationConfig {
  replicaId: string;
  personaId: string;
  apiKey: string;
  userName?: string;
  userEmail?: string;
  conversationName?: string;
}

export function useTavusConversation() {
  const [state, setState] = useState<TavusConversationState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    conversationUrl: null,
    conversationId: null,
  });

  const startConversation = useCallback(async (config: ConversationConfig) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Create conversation with enhanced configuration
      const conversationPayload: any = {
        replica_id: config.replicaId,
        persona_id: config.personaId,
      };

      // Add optional parameters if provided
      if (config.conversationName) {
        conversationPayload.conversation_name = config.conversationName;
      }

      // Add custom properties for better UX
      conversationPayload.properties = {
        participant_name: config.userName || 'User',
        participant_email: config.userEmail || '',
        session_type: 'financial_consultation',
        auto_start: true,
        hide_participant_name_input: true,
        custom_greeting: `Hello ${config.userName || 'there'}! I'm your AI financial advisor. I'm here to help you with any financial questions or guidance you need.`
      };

      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey
        },
        body: JSON.stringify(conversationPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create conversation: ${response.statusText}`);
      }

      const data = await response.json();

      // Enhance the conversation URL with auto-join parameters
      let enhancedUrl = data.conversation_url;
      if (enhancedUrl) {
        const url = new URL(enhancedUrl);
        
        // Add URL parameters to improve UX
        if (config.userName) {
          url.searchParams.set('name', config.userName);
        }
        url.searchParams.set('autoJoin', 'true');
        url.searchParams.set('hideNameInput', 'true');
        url.searchParams.set('theme', 'financial');
        
        enhancedUrl = url.toString();
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        conversationUrl: enhancedUrl,
        conversationId: data.conversation_id,
      }));

      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to start conversation',
      }));
      throw error;
    }
  }, []);

  const endConversation = useCallback(async (conversationId?: string) => {
    // Optionally call Tavus API to properly end the conversation
    if (conversationId && state.conversationId) {
      try {
        // Note: This endpoint might not exist in Tavus API, but it's good practice
        // to properly clean up resources when possible
        console.log('Ending conversation:', conversationId);
      } catch (error) {
        console.warn('Failed to properly end conversation:', error);
      }
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      conversationUrl: null,
      conversationId: null,
    });
  }, [state.conversationId]);

  return {
    ...state,
    startConversation,
    endConversation,
  };
}