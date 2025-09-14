import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { useWellbeingStats } from '@/providers/WellbeingProvider';
import { TrendingUp, Target, Calendar, Award, BarChart3, Heart } from 'lucide-react-native';

export default function ProgressTrackerScreen() {
  const stats = useWellbeingStats();

  const progressItems = [
    {
      id: 'mood-streak',
      title: 'Mood Tracking Streak',
      value: stats.currentStreak,
      unit: 'days',
      icon: Heart,
      color: '#E24B95',
      description: 'Consecutive days of mood logging',
      progress: Math.min(stats.currentStreak / 30 * 100, 100)
    },
    {
      id: 'total-entries',
      title: 'Total Mood Entries',
      value: stats.totalEntries,
      unit: 'entries',
      icon: BarChart3,
      color: '#6A2CB0',
      description: 'All-time mood tracking entries',
      progress: Math.min(stats.totalEntries / 100 * 100, 100)
    },
    {
      id: 'journal-entries',
      title: 'Journal Entries',
      value: stats.journalEntries,
      unit: 'entries',
      icon: Calendar,
      color: '#26A69A',
      description: 'Personal journal reflections',
      progress: Math.min(stats.journalEntries / 50 * 100, 100)
    },
    {
      id: 'goals-completed',
      title: 'Goals Completed',
      value: stats.goalsCompleted,
      unit: 'goals',
      icon: Target,
      color: '#F3B52F',
      description: 'Wellbeing goals achieved',
      progress: Math.min(stats.goalsCompleted / 10 * 100, 100)
    }
  ];

  const weeklyMoodAverage = stats.weeklyProgress.mood.length > 0
    ? stats.weeklyProgress.mood.reduce((sum, mood) => sum + mood, 0) / stats.weeklyProgress.mood.filter(m => m > 0).length
    : 0;

  const weeklySleepAverage = stats.weeklyProgress.sleep.length > 0
    ? stats.weeklyProgress.sleep.reduce((sum, sleep) => sum + sleep, 0) / stats.weeklyProgress.sleep.filter(s => s > 0).length
    : 0;

  const getMoodTrend = () => {
    const moods = stats.weeklyProgress.mood.filter(m => m > 0);
    if (moods.length < 2) return 'stable';
    
    const recent = moods.slice(-3);
    const earlier = moods.slice(0, -3);
    
    if (recent.length === 0 || earlier.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, m) => sum + m, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, m) => sum + m, 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 0.5) return 'improving';
    if (recentAvg < earlierAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#E53935';
      default: return '#FF9800';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Improving ↗️';
      case 'declining': return 'Needs attention ↘️';
      default: return 'Stable →';
    }
  };

  const achievements = [
    {
      id: 'first-entry',
      title: 'First Steps',
      description: 'Logged your first mood entry',
      earned: stats.totalEntries > 0,
      icon: '🌱'
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      earned: stats.currentStreak >= 7,
      icon: '🔥'
    },
    {
      id: 'journal-writer',
      title: 'Thoughtful Writer',
      description: 'Written 5 journal entries',
      earned: stats.journalEntries >= 5,
      icon: '✍️'
    },
    {
      id: 'month-tracker',
      title: 'Consistency Champion',
      description: 'Tracked mood for 30 days',
      earned: stats.totalEntries >= 30,
      icon: '🏆'
    },
    {
      id: 'goal-achiever',
      title: 'Goal Getter',
      description: 'Completed your first goal',
      earned: stats.goalsCompleted > 0,
      icon: '🎯'
    },
    {
      id: 'wellness-warrior',
      title: 'Wellness Warrior',
      description: 'Maintained 30-day streak',
      earned: stats.currentStreak >= 30,
      icon: '💪'
    }
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Progress Tracker',
          headerStyle: { backgroundColor: '#F5F0FF' },
          headerTintColor: '#341A52'
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Overview Card */}
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>Your Wellbeing Journey</Text>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewNumber}>{stats.currentStreak}</Text>
                <Text style={styles.overviewLabel}>Day Streak</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewNumber}>{Math.round(weeklyMoodAverage * 10) / 10}</Text>
                <Text style={styles.overviewLabel}>Avg Mood</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewNumber}>{Math.round(weeklySleepAverage * 10) / 10}h</Text>
                <Text style={styles.overviewLabel}>Avg Sleep</Text>
              </View>
            </View>
            
            <View style={styles.trendIndicator}>
              <TrendingUp color={getTrendColor(getMoodTrend())} size={20} />
              <Text style={[styles.trendText, { color: getTrendColor(getMoodTrend()) }]}>
                {getTrendText(getMoodTrend())}
              </Text>
            </View>
          </View>

          {/* Progress Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress Metrics</Text>
            {progressItems.map((item) => (
              <View key={item.id} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <View style={styles.progressInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                      <item.icon color="#FFFFFF" size={20} />
                    </View>
                    <View style={styles.progressDetails}>
                      <Text style={styles.progressTitle}>{item.title}</Text>
                      <Text style={styles.progressDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={styles.progressValue}>
                    <Text style={styles.progressNumber}>{item.value}</Text>
                    <Text style={styles.progressUnit}>{item.unit}</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${item.progress}%`,
                          backgroundColor: item.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {Math.round(item.progress)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementCard,
                    achievement.earned && styles.achievementEarned
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.earned && styles.achievementTitleEarned
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    achievement.earned && styles.achievementDescriptionEarned
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.earned && (
                    <View style={styles.earnedBadge}>
                      <Award color="#F3B52F" size={16} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weeklyCard}>
              <View style={styles.weeklyRow}>
                <Text style={styles.weeklyLabel}>Mood entries:</Text>
                <Text style={styles.weeklyValue}>
                  {stats.weeklyProgress.mood.filter(m => m > 0).length}/7 days
                </Text>
              </View>
              <View style={styles.weeklyRow}>
                <Text style={styles.weeklyLabel}>Sleep entries:</Text>
                <Text style={styles.weeklyValue}>
                  {stats.weeklyProgress.sleep.filter(s => s > 0).length}/7 days
                </Text>
              </View>
              <View style={styles.weeklyRow}>
                <Text style={styles.weeklyLabel}>Journal entries:</Text>
                <Text style={styles.weeklyValue}>
                  {stats.weeklyProgress.journal} entries
                </Text>
              </View>
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>Keep Going! 💪</Text>
            <Text style={styles.motivationText}>
              {stats.currentStreak > 0 
                ? `You're on a ${stats.currentStreak}-day streak! Every day you track your wellbeing is a step forward in your healing journey.`
                : "Start your wellbeing journey today! Tracking your mood and thoughts helps you understand patterns and celebrate progress."
              }
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    textAlign: 'center',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F3B52F',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '600',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
  },
  progressItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressDetails: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  progressDescription: {
    fontSize: 12,
    color: '#49455A',
  },
  progressValue: {
    alignItems: 'flex-end',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  progressUnit: {
    fontSize: 12,
    color: '#49455A',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#49455A',
    minWidth: 35,
    textAlign: 'right',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    opacity: 0.6,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  achievementEarned: {
    borderColor: '#F3B52F',
    opacity: 1,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#49455A',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleEarned: {
    color: '#341A52',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementDescriptionEarned: {
    color: '#49455A',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#49455A',
  },
  weeklyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  motivationCard: {
    backgroundColor: '#F3B52F',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
});