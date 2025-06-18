import React, { useState, useRef, useEffect, useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  Sparkles,
  Trash2,
  CircleAlert as AlertCircle
} from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatMessage as DbChatMessage } from '@/lib/supabase'; // Import the type from supabase.ts

// Define a local type for messages, including a potential temporary ID
// This will be used for messages not yet committed to Supabase
interface LocalChatMessage extends DbChatMessage {
  id: string; // Ensure id is always present for key prop
  isTemporary?: boolean; // Optional: to mark messages not yet fetched from DB
}

const quickSuggestions = [
  "What's the difference between a 401k and IRA?",
  "How do I start building credit?",
  "Explain compound interest simply",
  "What's the 50/30/20 rule?",
  "How much should I save for emergencies?",
  "What are ETFs and how do they work?"
];

const { width: screenWidth } = Dimensions.get('window');

export default function AITutor() {
  const { user } = useUserData();
  const {
    messages: dbMessages, // Renamed to avoid conflict
    loading: messagesLoading,
    error: messagesError,
    callChatAPI, // This is the new function to use
    refetch: refetchMessages // To refetch historical messages if needed
  } = useChatMessages();

  const [messages, setMessages] = useState<LocalChatMessage[]>([]); // Local state for messages
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sync Supabase messages with local state on initial load and refetch
  useEffect(() => {
    if (dbMessages) {
      setMessages(dbMessages as LocalChatMessage[]);
    }
  }, [dbMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when local messages change

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Add welcome message if no messages exist
  useEffect(() => {
    // Only add welcome message if dbMessages have loaded and are empty
    // and no temporary messages are present (from a clear chat)
    if (!messagesLoading && dbMessages.length === 0 && user && messages.length === 0) {
      const welcomeMessageContent = `Hi ${user.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI financial tutor. I'm here to help you understand any financial concept, answer your questions, and guide you on your journey to financial literacy. What would you like to learn about today?`;
      
      // Add welcome message directly to local state
      setMessages([{
        id: `temp-${Date.now()}-ai-welcome`, // Use a temporary ID
        user_id: user.id,
        content: welcomeMessageContent,
        message_type: 'ai',
        created_at: new Date().toISOString(),
        isTemporary: true, // Mark it as temporary
      }]);
    }
  }, [messagesLoading, dbMessages.length, user, messages.length]);


  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || isTyping || !user) return; // Ensure user is available

    setInputText('');
    setIsTyping(true);

    const userMessage: LocalChatMessage = {
      id: `temp-${Date.now()}-user`, // Temporary ID for immediate display
      user_id: user.id,
      content: text.trim(),
      message_type: 'human', // Using 'human' as per your schema
      created_at: new Date().toISOString(),
      isTemporary: true,
    };

    // Optimistically add user message to local state
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();

    try {
      // Call the external AI API
      const aiResponseContent = await callChatAPI(text.trim(), user.id);

      const aiMessage: LocalChatMessage = {
        id: `temp-${Date.now()}-ai`, // Temporary ID for AI response
        user_id: user.id,
        content: aiResponseContent,
        message_type: 'ai',
        created_at: new Date().toISOString(),
        isTemporary: true,
      };

      // Add AI response to local state
      setMessages((prev) => [...prev, aiMessage]);

      // Optional: Refetch messages from DB if your external API updates the DB
      // immediately after sending the response, to get the permanent IDs.
      // If not, these temporary messages will just exist client-side until refresh.
      // refetchMessages();

    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: LocalChatMessage = {
        id: `temp-${Date.now()}-error`,
        user_id: user.id,
        content: `I'm having trouble connecting to my services right now. ${error.message || 'Please try again.'}`,
        message_type: 'ai',
        created_at: new Date().toISOString(),
        isTemporary: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleMicToggle = () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Voice Feature',
        'Voice input would be available in the native app with proper microphone permissions.'
      );
    }
    setIsMicEnabled(!isMicEnabled);
  };

  const handleClearChat = useCallback(() => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat messages? This action cannot be undone locally. You will see historical messages again on next load if they exist in the database.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]); // Clear local messages
            // Re-add the welcome message immediately after clearing
            const welcomeMessageContent = `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI financial tutor. I'm here to help you understand any financial concept, answer your questions, and guide you on your journey to financial literacy. What would you like to learn about today?`;
            setMessages([{
              id: `temp-${Date.now()}-ai-welcome-after-clear`,
              user_id: user?.id || 'anonymous', // Provide a fallback user_id
              content: welcomeMessageContent,
              message_type: 'ai',
              created_at: new Date().toISOString(),
              isTemporary: true,
            }]);
            // If you want to clear the *database* history, you would call an API here
            // e.g., await api.clearChatHistory(user.id);
          }
        }
      ]
    );
  }, [user]); // Depend on user to get name for welcome message

  // Use DbChatMessage for the render function argument type, as we expect full properties
  const renderMessage = (message: LocalChatMessage) => {
    // Ensure 'message_type' and 'content' are used as per your schema
    const isUser = message.message_type === 'human';

    return (
      <View key={message.id} style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.avatar}
            >
              <Bot size={20} color="#FFF" />
            </LinearGradient>
          </View>
        )}

        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content} {/* Changed from message.note */}
          </Text>

          <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {isUser && (
          <View style={styles.userAvatarContainer}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (messagesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading chat history...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.tutorAvatar}>
              <Bot size={24} color="#FFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Financial Tutor</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'Thinking...' : 'Always here to help'}
              </Text>
            </View>
          </View>

          <View style={styles.headerControls}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleClearChat}
            >
              <Trash2 size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messagesError && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#DC2626" />
            <Text style={styles.errorText}>
              Connection issue: {messagesError}
            </Text>
          </View>
        )}

        {messages.map(renderMessage)}

        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.avatar}
              >
                <Bot size={20} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.typingBubble}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#10B981" />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Suggestions */}
        {messages.length <= 1 && ( // Only show if few messages, including the welcome message
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Questions:</Text>
            {quickSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(suggestion)}
                disabled={isTyping}
              >
                <Sparkles size={14} color="#10B981" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything about finance..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSendMessage()}
            blurOnSubmit={false}
            editable={!isTyping}
          />

          <View style={styles.inputControls}>
            <TouchableOpacity
              style={[styles.controlButton, isMicEnabled && styles.activeControlButton]}
              onPress={handleMicToggle}
              disabled={isTyping}
            >
              {isMicEnabled ? (
                <Mic size={20} color="#10B981" />
              ) : (
                <MicOff size={20} color="#6B7280" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isTyping) && styles.disabledSendButton
              ]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator size={20} color="#FFF" />
              ) : (
                <Send size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tutorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarContainer: {
    marginLeft: 8,
    marginBottom: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    borderRadius: 16,
    padding: 12,
  },
  aiBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
  },
  inputControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeControlButton: {
    backgroundColor: '#E6FFFA',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#D1D5DB',
  },
});