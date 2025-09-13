import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/providers/AuthProvider';
import { useProvider } from '@/providers/ProviderContext';
import {
  Heart,
  Moon,
  BookOpen,
  Smile,
  Meh,
  Frown,
  Calendar,
  TrendingUp,
  MessageSquare,
  Send,
  User,
  Clock,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const moodEmojis = [
  { id: 1, emoji: '😢', label: 'Very Sad', icon: Frown, color: '#E53935' },
  { id: 2, emoji: '😔', label: 'Sad', icon: Frown, color: '#FF5722' },
  { id: 3, emoji: '😐', label: 'Neutral', icon: Meh, color: '#FF9800' },
  { id: 4, emoji: '🙂', label: 'Good', icon: Smile, color: '#4CAF50' },
  { id: 5, emoji: '😊', label: 'Great', icon: Smile, color: '#2E7D32' },
];

const wellbeingActivities = [
  {
    id: 'mood',
    title: 'Mood Check-in',
    description: 'Track how you\'re feeling today',
    icon: Heart,
    color: '#E24B95',
    gradient: ['#E24B95', '#F06292'] as const,
  },
  {
    id: 'sleep',
    title: 'Sleep Tracker',
    description: 'Log your sleep patterns',
    icon: Moon,
    color: '#6A2CB0',
    gradient: ['#6A2CB0', '#9C27B0'] as const,
  },
  {
    id: 'journal',
    title: 'Healing Journal',
    description: 'Write your thoughts safely',
    icon: BookOpen,
    color: '#26A69A',
    gradient: ['#26A69A', '#4DB6AC'] as const,
  },
  {
    id: 'progress',
    title: 'Progress Tracker',
    description: 'See your healing journey',
    icon: TrendingUp,
    color: '#F3B52F',
    gradient: ['#F3B52F', '#FFB74D'] as const,
  },
];

export default function WellbeingScreen() {
  const { user } = useAuth();
  const { assignedCases } = useProvider();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
    setTodayMoodLogged(true);
    // Here you would save the mood to storage/API
  };

  // Provider messaging interface
  if (user?.role === 'provider') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Communicate with survivors</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Active Conversations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Conversations</Text>
            <View style={styles.conversationsList}>
              {assignedCases.filter(c => c.messages.length > 0).map((incident) => (
                <TouchableOpacity
                  key={incident.id}
                  style={[
                    styles.conversationCard,
                    selectedCase === incident.id && styles.selectedConversation
                  ]}
                  onPress={() => setSelectedCase(incident.id)}
                >
                  <View style={styles.conversationHeader}>
                    <View style={styles.avatarContainer}>
                      <User color="#FFFFFF" size={20} />
                    </View>
                    <View style={styles.conversationInfo}>
                      <Text style={styles.conversationTitle}>
                        Case {incident.caseNumber}
                      </Text>
                      <Text style={styles.conversationType}>
                        {incident.type} - {incident.status}
                      </Text>
                    </View>
                    <View style={styles.conversationMeta}>
                      <Text style={styles.messageCount}>
                        {incident.messages.length}
                      </Text>
                      <Text style={styles.lastMessageTime}>
                        {new Date(incident.messages[incident.messages.length - 1]?.createdAt || incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  
                  {incident.messages.length > 0 && (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {incident.messages[incident.messages.length - 1].content}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
              
              {assignedCases.filter(c => c.messages.length > 0).length === 0 && (
                <View style={styles.emptyMessages}>
                  <MessageSquare color="#D8CEE8" size={48} />
                  <Text style={styles.emptyTitle}>No Active Conversations</Text>
                  <Text style={styles.emptyDescription}>
                    Messages with survivors will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Message Composer */}
          {selectedCase && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Send Message</Text>
              <View style={styles.messageComposer}>
                <TextInput
                  style={styles.messageInput}
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Type your message..."
                  placeholderTextColor="#D8CEE8"
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => {
                    if (messageText.trim()) {
                      Alert.alert('Message Sent', 'Your message has been sent to the survivor.');
                      setMessageText('');
                    }
                  }}
                >
                  <Send color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Quick Responses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Responses</Text>
            <View style={styles.quickResponses}>
              {[
                'Thank you for reaching out. I&apos;m here to help.',
                'Your safety is our priority. Let&apos;s discuss next steps.',
                'I&apos;ve reviewed your case and will follow up shortly.',
                'Please let me know if you need immediate assistance.'
              ].map((response, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickResponseButton}
                  onPress={() => setMessageText(response)}
                >
                  <Text style={styles.quickResponseText}>{response}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Communication Guidelines */}
          <View style={styles.section}>
            <View style={styles.guidelinesCard}>
              <Text style={styles.guidelinesTitle}>Communication Guidelines</Text>
              <Text style={styles.guidelinesText}>
                • Always maintain professional boundaries{"\n"}
                • Respond within 24 hours during business hours{"\n"}
                • Use trauma-informed language{"\n"}
                • Respect survivor autonomy and choices{"\n"}
                • Document all interactions appropriately
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Default survivor wellbeing screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wellbeing</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar color="#6A2CB0" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Mood Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          {!todayMoodLogged ? (
            <View style={styles.moodSelector}>
              {moodEmojis.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.id && styles.moodOptionSelected,
                  ]}
                  onPress={() => handleMoodSelect(mood.id)}
                  testID={`mood-${mood.id}`}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.moodLogged}>
              <View style={styles.moodLoggedContent}>
                <Text style={styles.moodLoggedEmoji}>
                  {moodEmojis.find(m => m.id === selectedMood)?.emoji}
                </Text>
                <Text style={styles.moodLoggedText}>
                  Mood logged for today: {moodEmojis.find(m => m.id === selectedMood)?.label}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeMoodButton}
                onPress={() => setTodayMoodLogged(false)}
              >
                <Text style={styles.changeMoodButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Wellbeing Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellbeing Activities</Text>
          <View style={styles.activitiesGrid}>
            {wellbeingActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                testID={`activity-${activity.id}`}
              >
                <LinearGradient
                  colors={activity.gradient}
                  style={styles.activityGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <activity.icon color="#FFFFFF" size={32} />
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>This Week's Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>5</Text>
                <Text style={styles.summaryLabel}>Days Tracked</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>7.2h</Text>
                <Text style={styles.summaryLabel}>Avg Sleep</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>3</Text>
                <Text style={styles.summaryLabel}>Journal Entries</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.summaryButton}>
              <Text style={styles.summaryButtonText}>View Full Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coping Strategies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Coping Strategies</Text>
          <View style={styles.copingStrategies}>
            <TouchableOpacity style={styles.copingStrategy}>
              <Text style={styles.copingTitle}>Deep Breathing</Text>
              <Text style={styles.copingDescription}>
                4-7-8 breathing technique for immediate calm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copingStrategy}>
              <Text style={styles.copingTitle}>Grounding Exercise</Text>
              <Text style={styles.copingDescription}>
                5-4-3-2-1 technique to stay present
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copingStrategy}>
              <Text style={styles.copingTitle}>Progressive Relaxation</Text>
              <Text style={styles.copingDescription}>
                Guided muscle relaxation exercise
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  moodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#341A52',
    textAlign: 'center',
  },
  moodLogged: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  moodLoggedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodLoggedEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  moodLoggedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    flex: 1,
  },
  changeMoodButton: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeMoodButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  activityCard: {
    width: (width - 48) / 2,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  activityDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '600',
  },
  summaryButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  copingStrategies: {
    paddingHorizontal: 24,
    gap: 12,
  },
  copingStrategy: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  copingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  copingDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 18,
  },
  // Provider messaging styles
  subtitle: {
    fontSize: 16,
    color: '#49455A',
    marginTop: 4,
  },
  conversationsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedConversation: {
    borderWidth: 2,
    borderColor: '#6A2CB0',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  conversationType: {
    fontSize: 12,
    color: '#49455A',
    textTransform: 'capitalize',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  messageCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  lastMessageTime: {
    fontSize: 10,
    color: '#49455A',
  },
  lastMessage: {
    fontSize: 14,
    color: '#49455A',
    fontStyle: 'italic',
  },
  emptyMessages: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
  },
  messageComposer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#6A2CB0',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickResponses: {
    paddingHorizontal: 24,
    gap: 8,
  },
  quickResponseButton: {
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  quickResponseText: {
    fontSize: 14,
    color: '#6A2CB0',
    fontWeight: '500',
  },
  guidelinesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
});