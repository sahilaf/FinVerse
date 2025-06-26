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
      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey
        },
        body: JSON.stringify({
          "replica_id": config.replicaId,
          "persona_id": config.personaId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        conversationUrl: data.conversation_url,
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

  const endConversation = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      conversationUrl: null,
      conversationId: null,
    });
  }, []);

  return {
    ...state,
    startConversation,
    endConversation,
  };
}