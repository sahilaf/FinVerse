import React, { useState, useRef, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Send, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Bot, 
  Sparkles, 
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2
} from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatMessage } from '@/types';

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
    messages, 
    loading: messagesLoading, 
    error: messagesError,
    addMessage, 
    clearMessages 
  } = useChatMessages();
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Add welcome message if no messages exist
  useEffect(() => {
    if (!messagesLoading && messages.length === 0 && user) {
      const welcomeMessage = `Hi ${user.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI financial tutor. I'm here to help you understand any financial concept, answer your questions, and guide you on your journey to financial literacy. What would you like to learn about today?`;
      addMessage('ai', welcomeMessage);
    }
  }, [messagesLoading, messages.length, user, addMessage]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Add user message to database
    await addMessage('user', text.trim());
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (In production, this would call Tavus API)
    setTimeout(async () => {
      const aiResponse = generateAIResponse(text.trim());
      await addMessage('ai', aiResponse);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // This is a mock response. In production, this would integrate with Tavus API
    const responses = {
      credit: "Great question about credit! Building credit is like building trust with lenders. Start with a secured credit card, make small purchases, and always pay on time. Your credit score ranges from 300-850, and payment history makes up 35% of your score. Would you like me to explain the factors that affect your credit score?",
      compound: "Compound interest is the magic of money growing on money! Think of it like a snowball rolling down a hill - it starts small but gets bigger and bigger. When you earn interest on your initial investment AND on the interest you've already earned, that's compound interest. Einstein called it the 8th wonder of the world!",
      emergency: "An emergency fund is your financial safety net! Aim to save 3-6 months of living expenses. Start small - even $25 per month adds up. Keep it in a high-yield savings account that's easily accessible but separate from your checking account. This fund is for true emergencies like job loss or medical bills, not vacations!",
      budget: "The 50/30/20 rule is a simple budgeting framework! Spend 50% of your after-tax income on needs (rent, groceries, utilities), 30% on wants (entertainment, dining out), and 20% on savings and debt repayment. It's a great starting point, but adjust based on your personal situation!",
      default: "That's an excellent question! Financial literacy is a journey, and I'm here to help you every step of the way. Could you be more specific about what aspect you'd like to explore? I can explain concepts, help with calculations, or provide personalized advice based on your goals."
    };

    let responseText = responses.default;
    const input = userInput.toLowerCase();

    if (input.includes('credit') || input.includes('score')) {
      responseText = responses.credit;
    } else if (input.includes('compound') || input.includes('interest')) {
      responseText = responses.compound;
    } else if (input.includes('emergency') || input.includes('fund')) {
      responseText = responses.emergency;
    } else if (input.includes('50') || input.includes('budget') || input.includes('rule')) {
      responseText = responses.budget;
    }

    return responseText;
  };

  const handleVideoToggle = () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Tavus Integration Required',
        'Video tutoring requires Tavus integration. In production, this would:\n\n• Generate personalized video responses\n• Use your AI tutor avatar\n• Provide interactive video conversations\n\nTavus enables realistic AI video conversations with lip-sync and natural expressions.'
      );
    }
    setIsVideoMode(!isVideoMode);
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

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            const success = await clearMessages();
            if (success) {
              // Add welcome message back
              const welcomeMessage = `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI financial tutor. I'm here to help you understand any financial concept, answer your questions, and guide you on your journey to financial literacy. What would you like to learn about today?`;
              await addMessage('ai', welcomeMessage);
            }
          }
        }
      ]
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    
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
          {Math.random() > 0.7 && !isUser && (
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Bot size={32} color="#10B981" />
                <Text style={styles.videoText}>AI Tutor Video Response</Text>
                <Text style={styles.videoSubtext}>Powered by Tavus</Text>
              </View>
              
              <View style={styles.videoControls}>
                <TouchableOpacity 
                  style={styles.videoControlButton}
                  onPress={() => setIsVideoPlaying(!isVideoPlaying)}
                >
                  {isVideoPlaying ? (
                    <Pause size={16} color="#FFF" />
                  ) : (
                    <Play size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.videoControlButton}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX size={16} color="#FFF" />
                  ) : (
                    <Volume2 size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.note}
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
              <Text style={styles.headerSubtitle}>Powered by Tavus • Always here to help</Text>
            </View>
          </View>
          
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={[styles.headerButton, isVideoMode && styles.activeHeaderButton]}
              onPress={handleVideoToggle}
            >
              {isVideoMode ? (
                <Video size={20} color="#FFF" />
              ) : (
                <VideoOff size={20} color="rgba(255,255,255,0.7)" />
              )}
            </TouchableOpacity>
            
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
            <Text style={styles.errorText}>Error loading messages: {messagesError}</Text>
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
                <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
                <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
              </View>
            </View>
          </View>
        )}

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Questions:</Text>
            {quickSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(suggestion)}
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
          />
          
          <View style={styles.inputControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMicEnabled && styles.activeControlButton]}
              onPress={handleMicToggle}
            >
              {isMicEnabled ? (
                <Mic size={20} color="#10B981" />
              ) : (
                <MicOff size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="#FFF" />
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
  activeHeaderButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
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
  videoContainer: {
    marginBottom: 8,
  },
  videoPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  videoText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
  },
  videoSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  videoControls: {
    flexDirection: 'row',
    gap: 8,
  },
  videoControlButton: {
    backgroundColor: '#10B981',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    opacity: 0.4,
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