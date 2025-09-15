import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './AuthProvider';
import {
  MoodEntry,
  JournalEntry,
  WellbeingGoal,
  generateDummyMoodEntries,
  dummyJournalEntries,
  dummyCopingStrategies,
  dummyWellbeingGoals,
  dummyTherapySessions
} from '@/constants/WellbeingData';

export interface SleepEntry {
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  sleepDuration: number; // in hours
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 1 = very poor, 5 = excellent
  notes?: string;
  createdAt: string;
}

export interface WellbeingStats {
  currentStreak: number;
  totalEntries: number;
  averageMood: number;
  averageSleep: number;
  journalEntries: number;
  goalsCompleted: number;
  weeklyProgress: {
    mood: number[];
    sleep: number[];
    journal: number;
  };
}

export const [WellbeingProvider, useWellbeing] = createContextHook(() => {
  console.log('WellbeingProvider initializing...');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Load mood entries
  const moodQuery = useQuery({
    queryKey: ['mood-entries', user?.id],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(`mood-entries-${user?.id}`);
        if (stored) {
          return JSON.parse(stored) as MoodEntry[];
        }
        // Generate initial dummy data
        const dummyData = generateDummyMoodEntries(user?.id || '1');
        await AsyncStorage.setItem(`mood-entries-${user?.id}`, JSON.stringify(dummyData));
        return dummyData;
      } catch (error) {
        console.error('Error loading mood entries:', error);
        return generateDummyMoodEntries(user?.id || '1');
      }
    },
    enabled: !!user?.id
  });

  // Load sleep entries
  const sleepQuery = useQuery({
    queryKey: ['sleep-entries', user?.id],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(`sleep-entries-${user?.id}`);
        if (stored) {
          return JSON.parse(stored) as SleepEntry[];
        }
        // Generate initial dummy sleep data
        const dummyData: SleepEntry[] = [];
        for (let i = 0; i < 14; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const bedtime = new Date(date);
          bedtime.setHours(22 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
          const wakeTime = new Date(bedtime);
          wakeTime.setHours(bedtime.getHours() + 7 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          
          dummyData.push({
            id: `sleep-${user?.id}-${i}`,
            userId: user?.id || '1',
            date: date.toISOString().split('T')[0],
            bedtime: bedtime.toTimeString().slice(0, 5),
            wakeTime: wakeTime.toTimeString().slice(0, 5),
            sleepDuration: Math.round((wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60) * 10) / 10,
            sleepQuality: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
            createdAt: date.toISOString()
          });
        }
        await AsyncStorage.setItem(`sleep-entries-${user?.id}`, JSON.stringify(dummyData));
        return dummyData.reverse();
      } catch (error) {
        console.error('Error loading sleep entries:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  // Load journal entries
  const journalQuery = useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(`journal-entries-${user?.id}`);
        if (stored) {
          return JSON.parse(stored) as JournalEntry[];
        }
        // Use dummy data with user ID
        const userJournalEntries = dummyJournalEntries.map(entry => ({
          ...entry,
          userId: user?.id || '1'
        }));
        await AsyncStorage.setItem(`journal-entries-${user?.id}`, JSON.stringify(userJournalEntries));
        return userJournalEntries;
      } catch (error) {
        console.error('Error loading journal entries:', error);
        return dummyJournalEntries;
      }
    },
    enabled: !!user?.id
  });

  // Load wellbeing goals
  const goalsQuery = useQuery({
    queryKey: ['wellbeing-goals', user?.id],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(`wellbeing-goals-${user?.id}`);
        if (stored) {
          return JSON.parse(stored) as WellbeingGoal[];
        }
        // Use dummy data with user ID
        const userGoals = dummyWellbeingGoals.map(goal => ({
          ...goal,
          userId: user?.id || '1'
        }));
        await AsyncStorage.setItem(`wellbeing-goals-${user?.id}`, JSON.stringify(userGoals));
        return userGoals;
      } catch (error) {
        console.error('Error loading wellbeing goals:', error);
        return dummyWellbeingGoals;
      }
    },
    enabled: !!user?.id
  });

  // Add mood entry mutation
  const addMoodMutation = useMutation({
    mutationFn: async (moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>) => {
      const newEntry: MoodEntry = {
        id: `mood-${user?.id}-${Date.now()}`,
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        ...moodData
      };
      
      const currentEntries = moodQuery.data || [];
      const updatedEntries = [newEntry, ...currentEntries];
      
      await AsyncStorage.setItem(`mood-entries-${user?.id}`, JSON.stringify(updatedEntries));
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries', user?.id] });
    }
  });

  // Add sleep entry mutation
  const addSleepMutation = useMutation({
    mutationFn: async (sleepData: Omit<SleepEntry, 'id' | 'userId' | 'createdAt'>) => {
      const newEntry: SleepEntry = {
        id: `sleep-${user?.id}-${Date.now()}`,
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        ...sleepData
      };
      
      const currentEntries = sleepQuery.data || [];
      const updatedEntries = [newEntry, ...currentEntries];
      
      await AsyncStorage.setItem(`sleep-entries-${user?.id}`, JSON.stringify(updatedEntries));
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-entries', user?.id] });
    }
  });

  // Add journal entry mutation
  const addJournalMutation = useMutation({
    mutationFn: async (journalData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const newEntry: JournalEntry = {
        id: `journal-${user?.id}-${Date.now()}`,
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...journalData
      };
      
      const currentEntries = journalQuery.data || [];
      const updatedEntries = [newEntry, ...currentEntries];
      
      await AsyncStorage.setItem(`journal-entries-${user?.id}`, JSON.stringify(updatedEntries));
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries', user?.id] });
    }
  });

  // Calculate wellbeing statistics
  const stats: WellbeingStats = useMemo(() => {
    const moodEntries = moodQuery.data || [];
    const sleepEntries = sleepQuery.data || [];
    const journalEntries = journalQuery.data || [];
    const goals = goalsQuery.data || [];

    // Calculate current mood streak
    let currentStreak = 0;
    const sortedMoodEntries = [...moodEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = 0; i < sortedMoodEntries.length; i++) {
      const entryDate = new Date(sortedMoodEntries[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate averages
    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / moodEntries.length 
      : 0;
    
    const averageSleep = sleepEntries.length > 0
      ? sleepEntries.reduce((sum, entry) => sum + entry.sleepDuration, 0) / sleepEntries.length
      : 0;

    // Weekly progress (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyMood = last7Days.map(date => {
      const entry = moodEntries.find(e => e.date === date);
      return entry ? entry.intensity : 0;
    });

    const weeklySleep = last7Days.map(date => {
      const entry = sleepEntries.find(e => e.date === date);
      return entry ? entry.sleepDuration : 0;
    });

    const weeklyJournalCount = journalEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
      return last7Days.includes(entryDate);
    }).length;

    return {
      currentStreak,
      totalEntries: moodEntries.length,
      averageMood: Math.round(averageMood * 10) / 10,
      averageSleep: Math.round(averageSleep * 10) / 10,
      journalEntries: journalEntries.length,
      goalsCompleted: goals.filter(g => g.isCompleted).length,
      weeklyProgress: {
        mood: weeklyMood,
        sleep: weeklySleep,
        journal: weeklyJournalCount
      }
    };
  }, [moodQuery.data, sleepQuery.data, journalQuery.data, goalsQuery.data]);

  // Check if mood logged today
  const isMoodLoggedToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return (moodQuery.data || []).some(entry => entry.date === today);
  }, [moodQuery.data]);

  // Get today's mood entry
  const todaysMoodEntry = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return (moodQuery.data || []).find(entry => entry.date === today);
  }, [moodQuery.data]);

  const result = {
    // Data
    moodEntries: moodQuery.data || [],
    sleepEntries: sleepQuery.data || [],
    journalEntries: journalQuery.data || [],
    goals: goalsQuery.data || [],
    copingStrategies: dummyCopingStrategies,
    therapySessions: dummyTherapySessions,
    
    // Loading states
    isLoading: moodQuery.isLoading || sleepQuery.isLoading || journalQuery.isLoading || goalsQuery.isLoading,
    
    // Statistics
    stats,
    isMoodLoggedToday,
    todaysMoodEntry,
    
    // Actions
    addMoodEntry: addMoodMutation.mutate,
    addSleepEntry: addSleepMutation.mutate,
    addJournalEntry: addJournalMutation.mutate,
    
    // Loading states for mutations
    isAddingMood: addMoodMutation.isPending,
    isAddingSleep: addSleepMutation.isPending,
    isAddingJournal: addJournalMutation.isPending
  };
  
  console.log('WellbeingProvider returning:', {
    moodEntriesCount: result.moodEntries.length,
    isLoading: result.isLoading,
    statsAvailable: !!result.stats
  });
  
  return result;
});

// Helper hooks
export const useWellbeingStats = () => {
  const { stats } = useWellbeing();
  return stats;
};

export const useMoodTracking = () => {
  const { moodEntries, addMoodEntry, isAddingMood, isMoodLoggedToday, todaysMoodEntry } = useWellbeing();
  return { moodEntries, addMoodEntry, isAddingMood, isMoodLoggedToday, todaysMoodEntry };
};

export const useSleepTracking = () => {
  const { sleepEntries, addSleepEntry, isAddingSleep } = useWellbeing();
  return { sleepEntries, addSleepEntry, isAddingSleep };
};

export const useJournaling = () => {
  const { journalEntries, addJournalEntry, isAddingJournal } = useWellbeing();
  return { journalEntries, addJournalEntry, isAddingJournal };
};

export default WellbeingProvider;