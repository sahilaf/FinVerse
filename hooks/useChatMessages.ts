import { useState, useEffect } from 'react';
import { supabase, Database } from '@/lib/supabase'; // Ensure Database type is imported
import { useAuth } from '@/contexts/AuthContext';

// Define ChatMessage type based on your Supabase schema
export type ChatMessage = Database['public']['Tables']['chat_history']['Row'];

export function useChatMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat messages for the current user from Supabase
  const fetchMessages = async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (supabaseError) {
        console.error('Error fetching chat messages:', supabaseError);
        setError(supabaseError.message);
      } else {
        // Ensure data matches ChatMessage type (content, message_type)
        setMessages(data as ChatMessage[] || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call the external chat API (This function remains as you'll use it elsewhere to send messages)
  const callChatAPI = async (message: string, userId: string): Promise<string> => {
    try {
      const response = await fetch('https://finverseagent.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message: message, // Your external API expects 'message'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'Sorry, I couldn\'t process your request right now.';
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to get response from AI tutor. Please try again.');
    }
  };

  // Fetch messages when user changes
  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Real-time subscription is removed as per your requirement
  // If you later decide to use Supabase for real-time updates for the chat_history table,
  // you would re-add the useEffect with the .channel().on().subscribe() logic here.

  return {
    messages,
    loading,
    error,
    callChatAPI, // Expose the API call function for sending messages
    refetch: fetchMessages, // Allow manual refetching of history
  };
}