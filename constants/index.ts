// Comprehensive Dummy Data Index
// This file exports all dummy data for easy importing throughout the app

// Import all data first
import { 
  dummySurvivors, 
  dummyServiceProviders, 
  dummyResources, 
  dummySafetyTips, 
  dummyEmergencyContacts, 
  dummyStatistics, 
  dummyNotifications 
} from './DummyData';

import { 
  dummyJournalEntries, 
  dummyCopingStrategies, 
  dummyWellbeingGoals, 
  dummyTherapySessions,
  generateDummyMoodEntries
} from './WellbeingData';

import { 
  dummySafeLocations, 
  dummySafetyPlans, 
  dummyEmergencyAlerts, 
  dummySafetyResources 
} from './SafetyData';

// Export all individual items
export * from './DummyData';
export * from './WellbeingData';
export * from './SafetyData';

// Combined export for all dummy data
export const AllDummyData = {
  // Core platform data
  survivors: dummySurvivors,
  serviceProviders: dummyServiceProviders,
  resources: dummyResources,
  safetyTips: dummySafetyTips,
  emergencyContacts: dummyEmergencyContacts,
  statistics: dummyStatistics,
  notifications: dummyNotifications,
  
  // Wellbeing data
  journalEntries: dummyJournalEntries,
  copingStrategies: dummyCopingStrategies,
  wellbeingGoals: dummyWellbeingGoals,
  therapySessions: dummyTherapySessions,
  
  // Safety data
  safeLocations: dummySafeLocations,
  safetyPlans: dummySafetyPlans,
  emergencyAlerts: dummyEmergencyAlerts,
  safetyResources: dummySafetyResources,
};

// Utility functions for generating dynamic data
export const DataGenerators = {
  generateMoodEntries: generateDummyMoodEntries,
};