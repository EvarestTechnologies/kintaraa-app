import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { useIncidents, Incident, ServiceProvider } from './IncidentProvider';
import { useProvider } from './ProviderContext';

export interface RecommendationScore {
  providerId: string;
  score: number;
  reasons: string[];
  confidence: number;
}

export interface CaseRecommendation {
  incidentId: string;
  recommendedProviders: RecommendationScore[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedResolutionTime: number; // in hours
  suggestedServices: string[];
  riskFactors: string[];
  generatedAt: string;
}

export interface ResourceRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  relevanceScore: number;
  reasons: string[];
  url?: string;
  phoneNumber?: string;
}

export interface SurvivorRecommendation {
  survivorId: string;
  recommendedResources: ResourceRecommendation[];
  safetyTips: string[];
  nextSteps: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  };
  generatedAt: string;
}

export interface ProviderPerformanceMetrics {
  providerId: string;
  averageResponseTime: number;
  caseCompletionRate: number;
  survivorSatisfactionScore: number;
  specialtyMatchScore: number;
  workloadScore: number;
  availabilityScore: number;
}

export const [RecommendationProvider, useRecommendations] = createContextHook(() => {
  const { user } = useAuth();
  const { incidents, providers } = useIncidents();
  const { assignedCases } = useProvider();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI-powered case assignment algorithm
  const calculateProviderScore = useCallback((provider: ServiceProvider, incident: Incident): RecommendationScore => {
    let score = 0;
    const reasons: string[] = [];
    
    // Service match scoring (40% weight)
    const serviceMatch = incident.supportServices.filter((service) => {
      if (!service || typeof service !== 'string' || service.trim().length === 0) return false;
      return provider.services.includes(service.trim());
    }).length / incident.supportServices.length;
    score += serviceMatch * 40;
    if (serviceMatch > 0.7) {
      reasons.push(`Strong service match (${Math.round(serviceMatch * 100)}%)`);
    }
    
    // Availability scoring (25% weight)
    const availabilityScore = provider.availability.isAvailable ? 
      (provider.availability.capacity - (provider.availability.capacity * 0.8)) / provider.availability.capacity * 25 : 0;
    score += availabilityScore;
    if (provider.availability.isAvailable) {
      reasons.push('Currently available');
    }
    
    // Performance scoring (20% weight)
    const performanceScore = (provider.rating / 5) * 20;
    score += performanceScore;
    if (provider.rating >= 4.5) {
      reasons.push(`Excellent rating (${provider.rating}/5)`);
    }
    
    // Response time scoring (15% weight)
    const responseTimeScore = Math.max(0, (120 - provider.responseTime) / 120) * 15;
    score += responseTimeScore;
    if (provider.responseTime <= 30) {
      reasons.push('Fast response time');
    }
    
    // Priority matching bonus
    if (incident.priority === 'critical' && provider.responseTime <= 15) {
      score += 10;
      reasons.push('Emergency response capable');
    }
    
    // Location proximity bonus (if available)
    if (provider.location && incident.location?.coordinates) {
      // Simplified distance calculation
      const distance = Math.sqrt(
        Math.pow(provider.location.latitude - incident.location.coordinates.latitude, 2) +
        Math.pow(provider.location.longitude - incident.location.coordinates.longitude, 2)
      );
      if (distance < 0.1) { // Roughly 10km
        score += 5;
        reasons.push('Located nearby');
      }
    }
    
    const confidence = Math.min(100, Math.max(0, score + (reasons.length * 5)));
    
    return {
      providerId: provider.id,
      score: Math.round(score),
      reasons,
      confidence: Math.round(confidence)
    };
  }, []);

  // Generate case recommendations
  const generateCaseRecommendations = useCallback((incident: Incident): CaseRecommendation => {
    const providerScores = providers
      .map(provider => calculateProviderScore(provider, incident))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 recommendations
    
    // Determine urgency level
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (incident.priority === 'critical' || incident.severity === 'high') {
      urgencyLevel = 'critical';
    } else if (incident.priority === 'high') {
      urgencyLevel = 'high';
    } else if (incident.priority === 'low' && incident.severity === 'low') {
      urgencyLevel = 'low';
    }
    
    // Estimate resolution time based on case complexity
    let estimatedResolutionTime = 72; // Default 3 days
    if (incident.type === 'physical' || incident.type === 'sexual') {
      estimatedResolutionTime = 24; // 1 day for urgent medical cases
    } else if (incident.supportServices.includes('legal')) {
      estimatedResolutionTime = 168; // 1 week for legal cases
    }
    
    // Suggest additional services based on incident type
    const suggestedServices = [...incident.supportServices];
    if (incident.type === 'physical' && !suggestedServices.includes('medical')) {
      suggestedServices.push('medical');
    }
    if (incident.severity === 'high' && !suggestedServices.includes('counseling')) {
      suggestedServices.push('counseling');
    }
    
    // Identify risk factors
    const riskFactors: string[] = [];
    if (incident.priority === 'critical') riskFactors.push('Critical priority level');
    if (incident.type === 'physical') riskFactors.push('Physical violence involved');
    if (incident.severity === 'high') riskFactors.push('High severity incident');
    if (!incident.assignedProviderId) riskFactors.push('No provider assigned yet');
    
    return {
      incidentId: incident.id,
      recommendedProviders: providerScores,
      urgencyLevel,
      estimatedResolutionTime,
      suggestedServices,
      riskFactors,
      generatedAt: new Date().toISOString()
    };
  }, [providers, calculateProviderScore]);

  // Generate resource recommendations for survivors
  const generateSurvivorRecommendations = useCallback((survivorIncidents: Incident[]): SurvivorRecommendation => {
    const latestIncident = survivorIncidents[0];
    if (!latestIncident) {
      return {
        survivorId: user?.id || '',
        recommendedResources: [],
        safetyTips: [],
        nextSteps: [],
        riskAssessment: {
          level: 'low',
          factors: [],
          recommendations: []
        },
        generatedAt: new Date().toISOString()
      };
    }
    
    // Generate resource recommendations based on incident type
    const recommendedResources: ResourceRecommendation[] = [];
    
    if (latestIncident.type === 'physical') {
      recommendedResources.push({
        id: 'medical-1',
        title: 'Emergency Medical Care',
        description: 'Immediate medical attention for physical injuries',
        category: 'medical',
        relevanceScore: 95,
        reasons: ['Physical violence reported', 'Medical evaluation needed'],
        phoneNumber: '911'
      });
      recommendedResources.push({
        id: 'legal-1',
        title: 'Restraining Order Assistance',
        description: 'Legal protection through restraining orders',
        category: 'legal',
        relevanceScore: 85,
        reasons: ['Physical violence', 'Legal protection needed'],
        url: 'https://example.com/restraining-orders'
      });
    }
    
    if (latestIncident.type === 'emotional') {
      recommendedResources.push({
        id: 'counseling-1',
        title: 'Trauma Counseling Services',
        description: 'Professional counseling for emotional trauma',
        category: 'counseling',
        relevanceScore: 90,
        reasons: ['Emotional abuse reported', 'Mental health support needed'],
        phoneNumber: '1-800-799-7233'
      });
    }
    
    // Always recommend crisis hotline
    recommendedResources.push({
      id: 'crisis-1',
      title: 'National Domestic Violence Hotline',
      description: '24/7 confidential support and crisis intervention',
      category: 'emergency',
      relevanceScore: 100,
      reasons: ['Always available', '24/7 support'],
      phoneNumber: '1-800-799-7233'
    });
    
    // Generate safety tips based on incident pattern
    const safetyTips: string[] = [];
    if (latestIncident.type === 'physical') {
      safetyTips.push('Keep important documents in a safe place away from home');
      safetyTips.push('Identify safe places to go in an emergency');
      safetyTips.push('Consider changing locks if you have left the relationship');
    }
    
    safetyTips.push('Trust your instincts about your safety');
    safetyTips.push('Keep emergency numbers easily accessible');
    safetyTips.push('Consider a safety plan with a trusted friend or family member');
    
    // Generate next steps
    const nextSteps: string[] = [];
    if (!latestIncident.assignedProviderId) {
      nextSteps.push('Wait for case worker assignment (typically within 24 hours)');
    } else {
      nextSteps.push('Follow up with your assigned case worker');
    }
    
    if (latestIncident.supportServices.includes('medical')) {
      nextSteps.push('Schedule medical evaluation if not already done');
    }
    
    if (latestIncident.supportServices.includes('legal')) {
      nextSteps.push('Consult with legal aid about your options');
    }
    
    nextSteps.push('Document any new incidents or evidence');
    nextSteps.push('Stay connected with your support network');
    
    // Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    const riskFactors: string[] = [];
    const riskRecommendations: string[] = [];
    
    if (latestIncident.priority === 'critical') {
      riskLevel = 'critical';
      riskFactors.push('Critical priority incident');
      riskRecommendations.push('Consider immediate safety measures');
    }
    
    if (latestIncident.type === 'physical') {
      if (riskLevel === 'medium') riskLevel = 'high';
      riskFactors.push('Physical violence present');
      riskRecommendations.push('Develop a safety plan');
    }
    
    if (survivorIncidents.length > 1) {
      riskFactors.push('Multiple incidents reported');
      riskRecommendations.push('Consider long-term safety planning');
    }
    
    return {
      survivorId: user?.id || '',
      recommendedResources: recommendedResources.sort((a, b) => b.relevanceScore - a.relevanceScore),
      safetyTips,
      nextSteps,
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors,
        recommendations: riskRecommendations
      },
      generatedAt: new Date().toISOString()
    };
  }, [user?.id]);

  // Analyze case patterns and generate insights
  const analyzePatterns = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis delay
      await new Promise((resolve) => {
        if (typeof resolve === 'function') {
          setTimeout(resolve, 2000);
        }
      });
      
      const insights = [];
      
      // Pattern analysis for providers
      if (user?.role === 'provider') {
        const cases = assignedCases;
        
        // Response time analysis
        const avgResponseTime = cases.reduce((sum, c) => {
          const created = new Date(c.createdAt).getTime();
          const updated = new Date(c.updatedAt).getTime();
          return sum + (updated - created) / (1000 * 60); // minutes
        }, 0) / cases.length;
        
        if (avgResponseTime > 60) {
          insights.push({
            type: 'performance',
            title: 'Response Time Opportunity',
            message: `Your average response time is ${Math.round(avgResponseTime)} minutes. Consider setting up notifications to respond faster.`,
            priority: 'medium',
            actionable: true
          });
        }
        
        // Case type analysis
        const caseTypes = cases.reduce((acc, c) => {
          acc[c.type] = (acc[c.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommonType = Object.entries(caseTypes).sort(([,a], [,b]) => b - a)[0];
        if (mostCommonType) {
          insights.push({
            type: 'specialization',
            title: 'Specialization Insight',
            message: `You handle ${mostCommonType[1]} ${mostCommonType[0]} cases. Consider specialized training in this area.`,
            priority: 'low',
            actionable: true
          });
        }
      }
      
      // Pattern analysis for survivors
      if (user?.role === 'survivor') {
        const userIncidents = incidents.filter(i => i.survivorId === user.id);
        
        if (userIncidents.length > 1) {
          const timeGaps = [];
          for (let i = 1; i < userIncidents.length; i++) {
            const gap = new Date(userIncidents[i-1].createdAt).getTime() - 
                       new Date(userIncidents[i].createdAt).getTime();
            timeGaps.push(gap / (1000 * 60 * 60 * 24)); // days
          }
          
          const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
          
          if (avgGap < 30) {
            insights.push({
              type: 'safety',
              title: 'Safety Pattern Alert',
              message: 'Multiple incidents in a short timeframe detected. Consider enhanced safety planning.',
              priority: 'high',
              actionable: true
            });
          }
        }
      }
      
      setAiInsights(insights);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user?.role, assignedCases, incidents]);

  // Get recommendations for a specific case
  const getCaseRecommendations = useCallback((incidentId: string): CaseRecommendation | null => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return null;
    
    return generateCaseRecommendations(incident);
  }, [incidents, generateCaseRecommendations]);

  // Get recommendations for current survivor
  const getSurvivorRecommendations = useCallback((): SurvivorRecommendation | null => {
    if (user?.role !== 'survivor') return null;
    
    const userIncidents = incidents.filter(i => i.survivorId === user.id);
    return generateSurvivorRecommendations(userIncidents);
  }, [user?.role, user?.id, incidents, generateSurvivorRecommendations]);

  // Get provider performance metrics
  const getProviderMetrics = useCallback((providerId: string): ProviderPerformanceMetrics | null => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return null;
    
    const providerCases = incidents.filter(i => i.assignedProviderId === providerId);
    
    return {
      providerId,
      averageResponseTime: provider.responseTime,
      caseCompletionRate: providerCases.filter(c => c.status === 'completed').length / providerCases.length * 100,
      survivorSatisfactionScore: provider.rating,
      specialtyMatchScore: 85, // Calculated based on service alignment
      workloadScore: (provider.availability.capacity - providerCases.filter(c => c.status !== 'completed').length) / provider.availability.capacity * 100,
      availabilityScore: provider.availability.isAvailable ? 100 : 0
    };
  }, [providers, incidents]);

  // Auto-generate recommendations for new cases
  useEffect(() => {
    if (user?.role === 'provider' && assignedCases.length > 0) {
      // Auto-analyze when new cases are assigned
      analyzePatterns();
    }
  }, [assignedCases.length, user?.role, analyzePatterns]);

  return useMemo(() => ({
    // Core recommendation functions
    getCaseRecommendations,
    getSurvivorRecommendations,
    getProviderMetrics,
    
    // AI insights
    aiInsights,
    isAnalyzing,
    analyzePatterns,
    
    // Utility functions
    generateCaseRecommendations,
    generateSurvivorRecommendations,
    calculateProviderScore,
    
    // State
    isLoading: isAnalyzing
  }), [
    getCaseRecommendations,
    getSurvivorRecommendations,
    getProviderMetrics,
    aiInsights,
    isAnalyzing,
    analyzePatterns,
    generateCaseRecommendations,
    generateSurvivorRecommendations,
    calculateProviderScore
  ]);
});

// Helper hooks
export const useCaseRecommendations = (incidentId: string) => {
  const { getCaseRecommendations } = useRecommendations();
  return getCaseRecommendations(incidentId);
};

export const useSurvivorRecommendations = () => {
  const { getSurvivorRecommendations } = useRecommendations();
  return getSurvivorRecommendations();
};

export const useProviderMetrics = (providerId: string) => {
  const { getProviderMetrics } = useRecommendations();
  return getProviderMetrics(providerId);
};

export const useAIInsights = () => {
  const { aiInsights, isAnalyzing, analyzePatterns } = useRecommendations();
  return { insights: aiInsights, isAnalyzing, refresh: analyzePatterns };
};