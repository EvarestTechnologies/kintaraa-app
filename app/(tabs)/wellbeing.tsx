import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Moon,
  BookOpen,
  Smile,
  Meh,
  Frown,
  Calendar,
  TrendingUp,
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
    gradient: ['#E24B95', '#F06292'],
  },
  {
    id: 'sleep',
    title: 'Sleep Tracker',
    description: 'Log your sleep patterns',
    icon: Moon,
    color: '#6A2CB0',
    gradient: ['#6A2CB0', '#9C27B0'],
  },
  {
    id: 'journal',
    title: 'Healing Journal',
    description: 'Write your thoughts safely',
    icon: BookOpen,
    color: '#26A69A',
    gradient: ['#26A69A', '#4DB6AC'],
  },
  {
    id: 'progress',
    title: 'Progress Tracker',
    description: 'See your healing journey',
    icon: TrendingUp,
    color: '#F3B52F',
    gradient: ['#F3B52F', '#FFB74D'],
  },
];

export default function WellbeingScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
    setTodayMoodLogged(true);
    // Here you would save the mood to storage/API
  };

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
});