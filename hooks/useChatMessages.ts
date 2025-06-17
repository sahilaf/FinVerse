import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from '@/types';

export function useChatMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat messages for the current user
  const fetchMessages = async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat messages:', error);
        setError(error.message);
      } else {
        setMessages(data || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new message
  const addMessage = async (type: 'user' | 'ai', note: string, amount: number = 0) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          type,
          note,
          amount,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        setError(error.message);
        return null;
      }

      // Add the new message to local state
      setMessages(prev => [...prev, data]);
      setError(null);
      return data;
    } catch (err: any) {
      console.error('Unexpected error adding message:', err);
      setError(err.message);
      return null;
    }
  };

  // Update a message
  const updateMessage = async (messageId: string, updates: Partial<ChatMessage>) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .update(updates)
        .eq('id', messageId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating message:', error);
        setError(error.message);
        return null;
      }

      // Update the message in local state
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, ...data } : msg)
      );
      setError(null);
      return data;
    } catch (err: any) {
      console.error('Unexpected error updating message:', err);
      setError(err.message);
      return null;
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting message:', error);
        setError(error.message);
        return false;
      }

      // Remove the message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Unexpected error deleting message:', err);
      setError(err.message);
      return false;
    }
  };

  // Clear all messages for the user
  const clearMessages = async () => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing messages:', error);
        setError(error.message);
        return false;
      }

      setMessages([]);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Unexpected error clearing messages:', err);
      setError(err.message);
      return false;
    }
  };

  // Fetch messages when user changes
  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time chat message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ChatMessage : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    messages,
    loading,
    error,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    refetch: fetchMessages,
  };
}