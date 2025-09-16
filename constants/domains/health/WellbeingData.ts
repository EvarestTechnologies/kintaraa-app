// Wellbeing and Mental Health Dummy Data
// This file contains dummy data for mood tracking, journaling, and wellbeing features

export interface MoodEntry {
  id: string;
  userId: string;
  date: string;
  mood: 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';
  intensity: number; // 1-10 scale
  triggers?: string[];
  notes?: string;
  activities?: string[];
  sleepHours?: number;
  stressLevel?: number; // 1-10 scale
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  content: string;
  mood?: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'mindfulness' | 'physical' | 'creative' | 'social' | 'cognitive';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  benefits: string[];
  isCustom: boolean;
  userId?: string;
  createdAt: string;
}

export interface WellbeingGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'mood' | 'sleep' | 'exercise' | 'social' | 'self_care' | 'therapy';
  targetValue?: number;
  currentValue: number;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  progress: number; // percentage
  createdAt: string;
}

export interface TherapySession {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  sessionType: 'individual' | 'group' | 'family' | 'couples';
  date: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  mood_before?: number;
  mood_after?: number;
  topics_discussed?: string[];
  homework_assigned?: string;
  next_session?: string;
  createdAt: string;
}

// Generate dummy mood entries for the last 30 days
export const generateDummyMoodEntries = (userId: string): MoodEntry[] => {
  const moods: MoodEntry['mood'][] = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
  const triggers = ['work_stress', 'relationship', 'family', 'health', 'finances', 'social_media', 'news', 'weather'];
  const activities = ['exercise', 'meditation', 'reading', 'music', 'friends', 'therapy', 'journaling', 'nature'];
  
  const entries: MoodEntry[] = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate some patterns - worse moods on Mondays, better on weekends
    const dayOfWeek = date.getDay();
    let moodBias = 0;
    if (dayOfWeek === 1) moodBias = -1; // Monday blues
    if (dayOfWeek === 0 || dayOfWeek === 6) moodBias = 1; // Weekend boost
    
    const baseMoodIndex = Math.floor(Math.random() * moods.length) + moodBias;
    const moodIndex = Math.max(0, Math.min(moods.length - 1, baseMoodIndex));
    
    entries.push({
      id: `mood-${userId}-${i}`,
      userId,
      date: date.toISOString().split('T')[0],
      mood: moods[moodIndex],
      intensity: Math.floor(Math.random() * 10) + 1,
      triggers: Math.random() > 0.7 ? [triggers[Math.floor(Math.random() * triggers.length)]] : undefined,
      activities: Math.random() > 0.5 ? [activities[Math.floor(Math.random() * activities.length)]] : undefined,
      sleepHours: Math.floor(Math.random() * 4) + 6, // 6-9 hours
      stressLevel: Math.floor(Math.random() * 10) + 1,
      createdAt: date.toISOString(),
    });
  }
  
  return entries.reverse(); // Chronological order
};

// Dummy journal entries
export const dummyJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    userId: 'user-1',
    title: 'Feeling Stronger Today',
    content: 'Today I woke up feeling more hopeful than I have in weeks. The therapy session yesterday really helped me process some difficult emotions. I\'m starting to see that healing is not linear, and that\'s okay.',
    mood: 'hopeful',
    tags: ['therapy', 'healing', 'progress'],
    isPrivate: true,
    createdAt: '2024-12-10T08:30:00Z',
    updatedAt: '2024-12-10T08:30:00Z'
  },
  {
    id: 'journal-2',
    userId: 'user-1',
    title: 'Difficult Day',
    content: 'Had a panic attack at the grocery store today. The crowded space and loud noises triggered memories. But I used the breathing techniques Dr. Johnson taught me, and I was able to calm down. Small victories.',
    mood: 'anxious',
    tags: ['anxiety', 'coping', 'breathing'],
    isPrivate: true,
    createdAt: '2024-12-08T19:15:00Z',
    updatedAt: '2024-12-08T19:15:00Z'
  },
  {
    id: 'journal-3',
    userId: 'user-1',
    title: 'Support Group Reflection',
    content: 'Attended my first support group meeting today. It was scary but also comforting to know I\'m not alone. Hearing other survivors\' stories made me feel less isolated. I think I\'ll keep going.',
    mood: 'connected',
    tags: ['support_group', 'community', 'connection'],
    isPrivate: false,
    createdAt: '2024-12-05T20:00:00Z',
    updatedAt: '2024-12-05T20:00:00Z'
  }
];

// Dummy coping strategies
export const dummyCopingStrategies: CopingStrategy[] = [
  {
    id: 'coping-1',
    title: '4-7-8 Breathing Technique',
    description: 'A simple breathing exercise to reduce anxiety and promote relaxation',
    category: 'breathing',
    duration: 5,
    difficulty: 'easy',
    instructions: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Close your mouth and inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat 3-4 times'
    ],
    benefits: ['Reduces anxiety', 'Promotes sleep', 'Lowers stress'],
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coping-2',
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax different muscle groups to release physical tension',
    category: 'physical',
    duration: 15,
    difficulty: 'medium',
    instructions: [
      'Find a quiet, comfortable place to lie down',
      'Start with your toes - tense for 5 seconds, then relax',
      'Move up to your calves, thighs, abdomen, etc.',
      'Tense each muscle group for 5 seconds, then relax for 10 seconds',
      'Notice the difference between tension and relaxation',
      'End with deep breathing'
    ],
    benefits: ['Reduces muscle tension', 'Improves sleep', 'Decreases anxiety'],
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coping-3',
    title: '5-4-3-2-1 Grounding Technique',
    description: 'Use your senses to ground yourself in the present moment during anxiety or flashbacks',
    category: 'mindfulness',
    duration: 3,
    difficulty: 'easy',
    instructions: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take slow, deep breaths throughout'
    ],
    benefits: ['Reduces dissociation', 'Manages flashbacks', 'Increases present-moment awareness'],
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coping-4',
    title: 'Journaling for Emotional Release',
    description: 'Write freely about your thoughts and feelings without judgment',
    category: 'creative',
    duration: 20,
    difficulty: 'easy',
    instructions: [
      'Find a quiet space with pen and paper or device',
      'Set a timer for 10-20 minutes',
      'Write continuously without stopping to edit',
      'Don\'t worry about grammar or spelling',
      'Let your thoughts flow freely onto the page',
      'When finished, you can keep, share, or discard what you wrote'
    ],
    benefits: ['Processes emotions', 'Reduces stress', 'Improves self-awareness'],
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coping-5',
    title: 'Safe Place Visualization',
    description: 'Create a mental safe space you can visit during times of distress',
    category: 'mindfulness',
    duration: 10,
    difficulty: 'medium',
    instructions: [
      'Close your eyes and take several deep breaths',
      'Imagine a place where you feel completely safe and peaceful',
      'This can be real or imaginary - a beach, forest, cozy room, etc.',
      'Engage all your senses - what do you see, hear, smell, feel?',
      'Spend time exploring this safe space in your mind',
      'Remember you can return here anytime you need comfort'
    ],
    benefits: ['Provides emotional refuge', 'Reduces trauma symptoms', 'Builds resilience'],
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Dummy wellbeing goals
export const dummyWellbeingGoals: WellbeingGoal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Daily Mood Check-in',
    description: 'Track my mood every day to identify patterns and triggers',
    category: 'mood',
    currentValue: 23,
    targetValue: 30,
    unit: 'days',
    frequency: 'daily',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    isCompleted: false,
    progress: 76.7,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Attend Therapy Sessions',
    description: 'Consistently attend weekly therapy sessions for healing',
    category: 'therapy',
    currentValue: 8,
    targetValue: 12,
    unit: 'sessions',
    frequency: 'weekly',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    isCompleted: false,
    progress: 66.7,
    createdAt: '2024-10-01T00:00:00Z'
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: 'Practice Self-Care',
    description: 'Engage in self-care activities at least 3 times per week',
    category: 'self_care',
    currentValue: 9,
    targetValue: 12,
    unit: 'activities',
    frequency: 'weekly',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    isCompleted: false,
    progress: 75,
    createdAt: '2024-12-01T00:00:00Z'
  }
];

// Dummy therapy sessions
export const dummyTherapySessions: TherapySession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Johnson',
    sessionType: 'individual',
    date: '2024-12-09T14:00:00Z',
    duration: 60,
    status: 'completed',
    notes: 'Worked on processing trauma memories using EMDR technique. Client showed good progress.',
    mood_before: 4,
    mood_after: 7,
    topics_discussed: ['trauma processing', 'coping strategies', 'safety planning'],
    homework_assigned: 'Practice grounding techniques daily, continue mood journaling',
    next_session: '2024-12-16T14:00:00Z',
    createdAt: '2024-12-09T15:00:00Z'
  },
  {
    id: 'session-2',
    userId: 'user-1',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Johnson',
    sessionType: 'individual',
    date: '2024-12-02T14:00:00Z',
    duration: 60,
    status: 'completed',
    notes: 'Focused on building trust and establishing therapeutic relationship. Discussed safety concerns.',
    mood_before: 3,
    mood_after: 6,
    topics_discussed: ['safety assessment', 'trust building', 'therapy goals'],
    homework_assigned: 'Complete safety plan worksheet',
    createdAt: '2024-12-02T15:00:00Z'
  },
  {
    id: 'session-3',
    userId: 'user-1',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Johnson',
    sessionType: 'individual',
    date: '2024-12-16T14:00:00Z',
    duration: 60,
    status: 'scheduled',
    createdAt: '2024-12-09T15:00:00Z'
  }
];

// Export all wellbeing data
export const WellbeingData = {
  generateMoodEntries: generateDummyMoodEntries,
  journalEntries: dummyJournalEntries,
  copingStrategies: dummyCopingStrategies,
  wellbeingGoals: dummyWellbeingGoals,
  therapySessions: dummyTherapySessions
};

export default WellbeingData;