import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
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
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  getConversationForIncident,
  getConversationMessages,
  type ConversationData,
  type MessageData,
  type WsMessageEvent,
} from '@/services/messaging';
import { useChatSocket } from '@/hooks/useChatSocket';

// Local message type displayed in the UI
interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'survivor' | 'provider' | 'system';
  createdAt: string;
  isRead: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapApiMessage(msg: MessageData): Message {
  if (msg.message_type === 'system_event' || msg.message_type === 'status_update') {
    return {
      id: msg.id,
      content: msg.content,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'system',
      createdAt: msg.created_at,
      isRead: true,
    };
  }
  return {
    id: msg.id,
    content: msg.content,
    senderId: msg.sender?.id ?? 'unknown',
    senderName: msg.sender?.full_name ?? 'Unknown',
    senderRole: msg.sender?.role === 'provider' ? 'provider' : 'survivor',
    createdAt: msg.created_at,
    isRead: false,
  };
}

function mapWsMessage(data: WsMessageEvent): Message {
  if (data.message_type === 'system_event' || data.message_type === 'status_update') {
    return {
      id: data.id,
      content: data.content,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'system',
      createdAt: data.created_at,
      isRead: true,
    };
  }
  return {
    id: data.id,
    content: data.content,
    senderId: data.sender?.id ?? 'unknown',
    senderName: data.sender?.full_name ?? 'Unknown',
    senderRole: data.sender?.role === 'provider' ? 'provider' : 'survivor',
    createdAt: data.created_at,
    isRead: false,
  };
}

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MessagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const seenIds = useRef<Set<string>>(new Set());

  // WebSocket — only active once we have a conversationId
  const { isConnected, incomingMessage, typingEvent, sendMessage } = useChatSocket(
    conversation?.id ?? null
  );

  // ── Load conversation; poll every 10 s until one appears ───────────────────
  useEffect(() => {
    if (!id) {
      setConversationLoading(false);
      return;
    }

    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const load = async (isFirstLoad: boolean) => {
      try {
        const conv = await getConversationForIncident(id);
        if (cancelled) return;

        setConversation(conv);

        if (conv) {
          // Load message history once we have a conversation
          if (isFirstLoad || messages.length === 0) {
            setMessagesLoading(true);
            const apiMessages = await getConversationMessages(conv.id);
            if (cancelled) return;

            const mapped = apiMessages.map(mapApiMessage);
            mapped.forEach(m => seenIds.current.add(m.id));
            setMessages(mapped);
            setMessagesLoading(false);
          }
        } else {
          // No conversation yet — poll again in 10 seconds
          pollTimer = setTimeout(() => {
            if (!cancelled) load(false);
          }, 10_000);
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      } finally {
        if (isFirstLoad && !cancelled) setConversationLoading(false);
      }
    };

    load(true);

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [id]);

  // ── Append incoming WS messages ─────────────────────────────────────────────
  useEffect(() => {
    if (!incomingMessage) return;
    if (seenIds.current.has(incomingMessage.id)) return; // deduplicate

    seenIds.current.add(incomingMessage.id);
    setMessages(prev => [...prev, mapWsMessage(incomingMessage)]);
  }, [incomingMessage]);

  // ── Auto-scroll to bottom ───────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    const content = newMessage.trim();
    if (!content || isSending || !conversation) return;

    setNewMessage('');
    setIsSending(true);

    try {
      if (isConnected) {
        // Prefer WebSocket — the server will broadcast back to us
        sendMessage(content);
      } else {
        // REST fallback when WebSocket is down
        const { sendMessageRest } = await import('@/services/messaging');
        const msg = await sendMessageRest(conversation.id, content);
        const mapped = mapApiMessage(msg);
        if (!seenIds.current.has(mapped.id)) {
          seenIds.current.add(mapped.id);
          setMessages(prev => [...prev, mapped]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(content); // restore on failure
      if (Platform.OS === 'web') {
        alert('Failed to send message. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  }, [newMessage, isSending, conversation, isConnected, sendMessage]);

  const isCurrentUser = (senderId: string) => senderId === user?.id;

  // ── Loading state ───────────────────────────────────────────────────────────
  if (conversationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#6A2CB0" />
          <Text style={styles.loadingText}>Loading conversation…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── No incident ─────────────────────────────────────────────────────────────
  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centeredState}>
          <MessageCircle color="#D8CEE8" size={64} />
          <Text style={styles.errorTitle}>Case Not Found</Text>
          <Text style={styles.errorDescription}>The requested case could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── No conversation yet (still waiting for a provider to accept) ────────────
  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centeredState}>
          <Clock color="#D8CEE8" size={64} />
          <Text style={styles.errorTitle}>Waiting for a Provider</Text>
          <Text style={styles.errorDescription}>
            A chat will open automatically once a provider accepts your case.
          </Text>
          <ActivityIndicator size="small" color="#6A2CB0" style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Case closed / conversation inactive ──────────────────────────────────────
  if (!conversation.is_active) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Case {conversation.incident.case_number}</Text>
          </View>
        </View>
        {/* Read-only message history */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            if (message.senderRole === 'system') {
              return (
                <View key={message.id} style={styles.systemMessageContainer}>
                  <Text style={styles.systemMessageText}>{message.content}</Text>
                </View>
              );
            }
            const mine = isCurrentUser(message.senderId);
            return (
              <View key={message.id} style={[styles.messageItem, mine ? styles.messageItemSent : styles.messageItemReceived]}>
                <View style={[styles.messageBubble, mine ? styles.messageBubbleSent : styles.messageBubbleReceived]}>
                  {!mine && (
                    <View style={styles.senderInfo}>
                      <View style={styles.senderIcon}>
                        {message.senderRole === 'provider' ? <Shield color="#6A2CB0" size={12} /> : <User color="#E24B95" size={12} />}
                      </View>
                      <Text style={styles.senderName}>{message.senderName}</Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, mine ? styles.messageTextSent : styles.messageTextReceived]}>
                    {message.content}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Clock color={mine ? '#FFFFFF80' : '#49455A80'} size={10} />
                    <Text style={[styles.messageTime, mine ? styles.messageTimeSent : styles.messageTimeReceived]}>
                      {formatMessageTime(message.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {/* Closed banner */}
        <View style={styles.closedBanner}>
          <Shield color="#49455A" size={16} />
          <Text style={styles.closedBannerText}>This case is closed — conversation is read-only</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main chat UI ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#6A2CB0" size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Case {conversation.incident.case_number}</Text>
        </View>
        <View style={styles.headerRight}>
          {isConnected ? (
            <Wifi color="#43A047" size={18} />
          ) : (
            <WifiOff color="#E24B95" size={18} />
          )}
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
          {messagesLoading ? (
            <View style={styles.centeredState}>
              <ActivityIndicator size="small" color="#6A2CB0" />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageCircle color="#D8CEE8" size={48} />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyDescription}>
                Start a conversation to communicate securely about this case.
              </Text>
            </View>
          ) : (
            messages.map((message) => {
              // System messages render centered
              if (message.senderRole === 'system') {
                return (
                  <View key={message.id} style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{message.content}</Text>
                  </View>
                );
              }

              const mine = isCurrentUser(message.senderId);

              return (
                <View
                  key={message.id}
                  style={[styles.messageItem, mine ? styles.messageItemSent : styles.messageItemReceived]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      mine ? styles.messageBubbleSent : styles.messageBubbleReceived,
                    ]}
                  >
                    {!mine && (
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
                        mine ? styles.messageTextSent : styles.messageTextReceived,
                      ]}
                    >
                      {message.content}
                    </Text>
                    <View style={styles.messageFooter}>
                      <Clock color={mine ? '#FFFFFF80' : '#49455A80'} size={10} />
                      <Text
                        style={[
                          styles.messageTime,
                          mine ? styles.messageTimeSent : styles.messageTimeReceived,
                        ]}
                      >
                        {formatMessageTime(message.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* Typing indicator */}
          {typingEvent?.is_typing && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>{typingEvent.full_name} is typing…</Text>
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message…"
              placeholderTextColor="#49455A80"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={5000}
              editable={!isSending}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send color={!newMessage.trim() ? '#D8CEE8' : '#FFFFFF'} size={20} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            {isConnected ? '🔒 Connected — messages are encrypted' : '⚠️ Reconnecting…'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FF' },
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
  backButton: { padding: 8, marginRight: 12 },
  headerInfo: { flex: 1 },
  headerRight: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#341A52' },
  subtitle: { fontSize: 14, color: '#49455A', marginTop: 2 },
  content: { flex: 1 },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  loadingText: { fontSize: 14, color: '#49455A', marginTop: 12 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#341A52', marginTop: 16, marginBottom: 8 },
  errorDescription: { fontSize: 14, color: '#49455A', textAlign: 'center', lineHeight: 20 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#341A52', marginTop: 16, marginBottom: 8 },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  systemMessageContainer: { alignItems: 'center', marginVertical: 8 },
  systemMessageText: {
    fontSize: 12,
    color: '#49455A',
    backgroundColor: '#E8E0F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageItem: { marginBottom: 16 },
  messageItemSent: { alignItems: 'flex-end' },
  messageItemReceived: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  messageBubbleSent: { backgroundColor: '#6A2CB0', borderBottomRightRadius: 4 },
  messageBubbleReceived: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  senderInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  senderIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderName: { fontSize: 12, fontWeight: '600', color: '#6A2CB0' },
  messageText: { fontSize: 16, lineHeight: 20, marginBottom: 4 },
  messageTextSent: { color: '#FFFFFF' },
  messageTextReceived: { color: '#341A52' },
  messageFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  messageTime: { fontSize: 10, fontWeight: '500' },
  messageTimeSent: { color: '#FFFFFF80' },
  messageTimeReceived: { color: '#49455A80' },
  typingContainer: { paddingLeft: 4, marginBottom: 8 },
  typingText: { fontSize: 12, color: '#6A2CB0', fontStyle: 'italic' },
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
  sendButtonDisabled: { backgroundColor: '#D8CEE8' },
  inputHint: { fontSize: 12, color: '#49455A80', textAlign: 'center' },
  closedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F5F0FF',
    borderTopWidth: 1,
    borderTopColor: '#E8E0F5',
  },
  closedBannerText: { fontSize: 13, color: '#49455A', fontStyle: 'italic' },
});
