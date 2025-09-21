import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Send,
  MessageCircle,
  User,
  Shield,
  Clock,
} from 'lucide-react-native';
import { useIncidents } from '@/providers/IncidentProvider';
import { useProvider } from '@/providers/ProviderContext';
import { useAuth } from '@/providers/AuthProvider';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'survivor' | 'provider';
  createdAt: string;
  isRead: boolean;
}

export default function MessagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { incidents } = useIncidents();
  const { assignedCases } = useProvider();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Find the incident
  const incident = React.useMemo(() => {
    return incidents.find(inc => inc.id === id) || assignedCases.find(inc => inc.id === id);
  }, [incidents, assignedCases, id]);

  useEffect(() => {
    if (incident?.messages) {
      // Convert incident messages to our Message format
      const formattedMessages: Message[] = incident.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId || msg.sender?.id || 'unknown',
        senderName: msg.sender?.firstName || (msg.senderId === user?.id ? user?.firstName : 'Provider'),
        senderRole: msg.senderId === user?.id ? (user?.role === 'provider' ? 'provider' : 'survivor') : (user?.role === 'provider' ? 'survivor' : 'provider'),
        createdAt: msg.createdAt,
        isRead: msg.isRead || false,
      }));
      setMessages(formattedMessages);
    }
  }, [incident, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (!incident) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.errorContainer}>
          <MessageCircle color="#D8CEE8" size={64} />
          <Text style={styles.errorTitle}>Case Not Found</Text>
          <Text style={styles.errorDescription}>
            The requested case could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Create new message
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderId: user?.id || 'current-user',
        senderName: user?.firstName || 'You',
        senderRole: user?.role === 'provider' ? 'provider' : 'survivor',
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      // Add to messages
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // In a real app, you would send this to your backend
      console.log('Sending message:', message);
      
      // Simulate response from other party after a delay
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: user?.role === 'provider' 
            ? "Thank you for your message. I've received your update and will respond accordingly."
            : "Thank you for reaching out. I'm here to help and will get back to you soon.",
          senderId: 'other-user',
          senderName: user?.role === 'provider' ? 'Survivor' : 'Support Team',
          senderRole: user?.role === 'provider' ? 'survivor' : 'provider',
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      if (Platform.OS === 'web') {
        alert('Failed to send message. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const isCurrentUser = (senderId: string) => {
    return senderId === user?.id || senderId === 'current-user';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#6A2CB0" size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Case {incident.caseNumber}</Text>
        </View>
        <View style={styles.headerIcon}>
          <Shield color="#43A047" size={20} />
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages List */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageCircle color="#D8CEE8" size={48} />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyDescription}>
                Start a conversation to communicate securely about this case.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageItem,
                  isCurrentUser(message.senderId) ? styles.messageItemSent : styles.messageItemReceived,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isCurrentUser(message.senderId) ? styles.messageBubbleSent : styles.messageBubbleReceived,
                  ]}
                >
                  {!isCurrentUser(message.senderId) && (
                    <View style={styles.senderInfo}>
                      <View style={styles.senderIcon}>
                        {message.senderRole === 'provider' ? (
                          <Shield color="#6A2CB0" size={12} />
                        ) : (
                          <User color="#E24B95" size={12} />
                        )}
                      </View>
                      <Text style={styles.senderName}>{message.senderName}</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      isCurrentUser(message.senderId) ? styles.messageTextSent : styles.messageTextReceived,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Clock color={isCurrentUser(message.senderId) ? '#FFFFFF80' : '#49455A80'} size={10} />
                    <Text
                      style={[
                        styles.messageTime,
                        isCurrentUser(message.senderId) ? styles.messageTimeSent : styles.messageTimeReceived,
                      ]}
                    >
                      {formatMessageTime(message.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#49455A80"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
            >
              <Send 
                color={(!newMessage.trim() || isLoading) ? '#D8CEE8' : '#FFFFFF'} 
                size={20} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            🔒 All messages are encrypted and secure
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  subtitle: {
    fontSize: 14,
    color: '#49455A',
    marginTop: 2,
  },
  headerIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  messageItem: {
    marginBottom: 16,
  },
  messageItemSent: {
    alignItems: 'flex-end',
  },
  messageItemReceived: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleSent: {
    backgroundColor: '#6A2CB0',
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  senderIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageTextReceived: {
    color: '#341A52',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
    fontWeight: '500',
  },
  messageTimeSent: {
    color: '#FFFFFF80',
  },
  messageTimeReceived: {
    color: '#49455A80',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F0FF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#D8CEE8',
  },
  inputHint: {
    fontSize: 12,
    color: '#49455A80',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
  },
});