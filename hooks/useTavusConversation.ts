import { useState, useCallback } from 'react';

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

      console.log('Creating Tavus conversation with config:', {
        replicaId: config.replicaId,
        personaId: config.personaId,
        userName: config.userName,
        hasApiKey: !!config.apiKey
      });

      // Create conversation with the exact format expected by Tavus API
      const conversationPayload = {
        replica_id: config.replicaId,
        persona_id: config.personaId,
        // Add optional conversation name if provided
        ...(config.conversationName && { conversation_name: config.conversationName })
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

        // Provide more specific error messages based on status codes
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

      // Enhance the conversation URL with user context
      let enhancedUrl = data.conversation_url;
      try {
        const url = new URL(enhancedUrl);
        
        // Add URL parameters to improve UX
        if (config.userName) {
          url.searchParams.set('participant_name', config.userName);
        }
        if (config.userEmail) {
          url.searchParams.set('participant_email', config.userEmail);
        }
        
        // Add parameters to streamline the experience
        url.searchParams.set('auto_start', 'true');
        url.searchParams.set('hide_branding', 'true');
        
        enhancedUrl = url.toString();
      } catch (urlError) {
        console.warn('Could not enhance URL:', urlError);
        // Use original URL if enhancement fails
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
      console.error('Tavus conversation creation failed:', error);
      
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to start conversation with AI advisor',
      }));
      
      throw error;
    }
  }, []);

  const endConversation = useCallback(async (conversationId?: string) => {
    const targetId = conversationId || state.conversationId;
    
    if (targetId) {
      try {
        console.log('Ending Tavus conversation:', targetId);
        // Note: Tavus might not have an explicit end endpoint, but we log for debugging
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