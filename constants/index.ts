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
} from './domains/health/WellbeingData';

import {
  dummyCHWStats,
  dummyCHWPatients,
  dummyHealthEducationSessions,
  dummyCommunityOutreachEvents,
  dummyHealthReferrals
} from './domains/health/CHWData';

import {
  dummySafeLocations,
  dummySafetyPlans,
  dummyEmergencyAlerts,
  dummySafetyResources
} from './domains/safety/SafetyData';

import {
  mockSocialServicesStats,
  mockSocialClients,
  mockSocialServices,
  mockCommunityResources,
  mockCommunityPrograms,
  mockServiceAssessments
} from './domains/social/SocialServicesData';

// Export all individual items
export * from './DummyData';
export * from './domains/health/WellbeingData';
export * from './domains/health/CHWData';
export * from './domains/safety/SafetyData';
export * from './domains/social/SocialServicesData';

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
  
  // Health & Wellbeing data
  journalEntries: dummyJournalEntries,
  copingStrategies: dummyCopingStrategies,
  wellbeingGoals: dummyWellbeingGoals,
  therapySessions: dummyTherapySessions,

  // Community Health Worker data
  chwStats: dummyCHWStats,
  chwPatients: dummyCHWPatients,
  healthEducationSessions: dummyHealthEducationSessions,
  communityOutreachEvents: dummyCommunityOutreachEvents,
  healthReferrals: dummyHealthReferrals,
  
  // Safety data
  safeLocations: dummySafeLocations,
  safetyPlans: dummySafetyPlans,
  emergencyAlerts: dummyEmergencyAlerts,
  safetyResources: dummySafetyResources,
  
  // Social Services data
  socialServicesStats: mockSocialServicesStats,
  socialClients: mockSocialClients,
  socialServices: mockSocialServices,
  communityResources: mockCommunityResources,
  communityPrograms: mockCommunityPrograms,
  serviceAssessments: mockServiceAssessments,
};

// Utility functions for generating dynamic data
export const DataGenerators = {
  generateMoodEntries: generateDummyMoodEntries,
};