import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useRecommendations, useAIInsights, useSurvivorRecommendations } from '@/providers/RecommendationProvider';
import { useProvider } from '@/providers/ProviderContext';
import {
  Brain,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  Star,
  Target,
  Lightbulb,
  Phone,
  ExternalLink,
  RefreshCw,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react-native';

export default function RecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { assignedCases } = useProvider();
  const { insights, isAnalyzing, refresh } = useAIInsights();
  const { getCaseRecommendations } = useRecommendations();
  const survivorRecommendations = useSurvivorRecommendations();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Provider AI Recommendations View
  if (user?.role === 'provider') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AI Recommendations</Text>
            <Text style={styles.subtitle}>Intelligent insights for better care</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isAnalyzing}
          >
            <RefreshCw 
              color="#6A2CB0" 
              size={20} 
              style={isAnalyzing ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* AI Status Card */}
          <View style={styles.section}>
            <LinearGradient
              colors={['#6A2CB0', '#9C27B0']}
              style={styles.aiStatusCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Brain color="#FFFFFF" size={32} />
              <View style={styles.aiStatusContent}>
                <Text style={styles.aiStatusTitle}>AI Analysis</Text>
                <Text style={styles.aiStatusDescription}>
                  {isAnalyzing ? 'Analyzing patterns...' : `${insights.length} insights available`}
                </Text>
              </View>
              {isAnalyzing && (
                <View style={styles.loadingIndicator}>
                  <Zap color="#FFFFFF" size={16} />
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Performance Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Insights</Text>
            <View style={styles.insightsContainer}>
              {insights.length === 0 && !isAnalyzing ? (
                <View style={styles.emptyInsights}>
                  <Lightbulb color="#D8CEE8" size={48} />
                  <Text style={styles.emptyTitle}>No Insights Yet</Text>
                  <Text style={styles.emptyDescription}>
                    AI insights will appear here as you handle more cases
                  </Text>
                </View>
              ) : (
                insights.map((insight) => (
                  <View key={`${insight.type}-${insight.title}`} style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                      <View style={[
                        styles.insightIcon,
                        { backgroundColor: insight.priority === 'high' ? '#E53935' : 
                                          insight.priority === 'medium' ? '#FF9800' : '#43A047' }
                      ]}>
                        {insight.type === 'performance' && <TrendingUp color="#FFFFFF" size={16} />}
                        {insight.type === 'specialization' && <Award color="#FFFFFF" size={16} />}
                        {insight.type === 'safety' && <Shield color="#FFFFFF" size={16} />}
                      </View>
                      <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightMessage}>{insight.message}</Text>
                      </View>
                    </View>
                    {insight.actionable && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Take Action</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Case Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smart Case Assignments</Text>
            <View style={styles.caseRecommendations}>
              {assignedCases.slice(0, 3).map((incident) => {
                const recommendation = getCaseRecommendations(incident.id);
                if (!recommendation) return null;

                return (
                  <TouchableOpacity
                    key={incident.id}
                    style={styles.caseRecommendationCard}
                    onPress={() => router.push(`/case-details/${incident.id}`)}
                  >
                    <View style={styles.caseHeader}>
                      <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
                      <View style={[
                        styles.urgencyBadge,
                        { backgroundColor: recommendation.urgencyLevel === 'critical' ? '#E53935' :
                                          recommendation.urgencyLevel === 'high' ? '#FF9800' :
                                          recommendation.urgencyLevel === 'medium' ? '#2196F3' : '#43A047' }
                      ]}>
                        <Text style={styles.urgencyText}>
                          {recommendation.urgencyLevel.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.caseDescription} numberOfLines={2}>
                      {incident.description}
                    </Text>
                    
                    <View style={styles.recommendationMeta}>
                      <View style={styles.metaItem}>
                        <Clock color="#49455A" size={14} />
                        <Text style={styles.metaText}>
                          {recommendation.estimatedResolutionTime}h est.
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Target color="#49455A" size={14} />
                        <Text style={styles.metaText}>
                          {recommendation.riskFactors.length} risk factors
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Provider Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Performance</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <BarChart3 color="#6A2CB0" size={24} />
                <Text style={styles.metricNumber}>
                  {assignedCases.filter(c => c.status === 'completed').length}
                </Text>
                <Text style={styles.metricLabel}>Completed Cases</Text>
              </View>
              <View style={styles.metricCard}>
                <Clock color="#FF9800" size={24} />
                <Text style={styles.metricNumber}>32min</Text>
                <Text style={styles.metricLabel}>Avg Response</Text>
              </View>
              <View style={styles.metricCard}>
                <Star color="#F3B52F" size={24} />
                <Text style={styles.metricNumber}>4.8</Text>
                <Text style={styles.metricLabel}>Rating</Text>
              </View>
              <View style={styles.metricCard}>
                <TrendingUp color="#43A047" size={24} />
                <Text style={styles.metricNumber}>+12%</Text>
                <Text style={styles.metricLabel}>This Month</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Survivor AI Recommendations View
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Personalized Support</Text>
          <Text style={styles.subtitle}>AI-powered recommendations for you</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {survivorRecommendations ? (
          <>
            {/* Risk Assessment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Safety Assessment</Text>
              <View style={[
                styles.riskCard,
                { borderLeftColor: survivorRecommendations.riskAssessment.level === 'critical' ? '#E53935' :
                                  survivorRecommendations.riskAssessment.level === 'high' ? '#FF9800' :
                                  survivorRecommendations.riskAssessment.level === 'medium' ? '#2196F3' : '#43A047' }
              ]}>
                <View style={styles.riskHeader}>
                  <Shield 
                    color={survivorRecommendations.riskAssessment.level === 'critical' ? '#E53935' :
                           survivorRecommendations.riskAssessment.level === 'high' ? '#FF9800' :
                           survivorRecommendations.riskAssessment.level === 'medium' ? '#2196F3' : '#43A047'} 
                    size={24} 
                  />
                  <Text style={styles.riskLevel}>
                    {survivorRecommendations.riskAssessment.level.toUpperCase()} RISK
                  </Text>
                </View>
                <Text style={styles.riskDescription}>
                  Based on your situation, we&apos;ve identified some important safety considerations.
                </Text>
                {survivorRecommendations.riskAssessment.factors.length > 0 && (
                  <View style={styles.riskFactors}>
                    <Text style={styles.riskFactorsTitle}>Key Factors:</Text>
                    {survivorRecommendations.riskAssessment.factors.map((factor) => (
                      <Text key={factor} style={styles.riskFactor}>• {factor}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Recommended Resources */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Resources</Text>
              <View style={styles.resourcesList}>
                {survivorRecommendations.recommendedResources.map((resource) => (
                  <View key={resource.id} style={styles.resourceCard}>
                    <View style={styles.resourceHeader}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <View style={styles.relevanceScore}>
                        <Text style={styles.relevanceText}>
                          {resource.relevanceScore}% match
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.resourceDescription}>
                      {resource.description}
                    </Text>
                    <View style={styles.resourceReasons}>
                      {resource.reasons.map((reason) => (
                        <Text key={reason} style={styles.resourceReason}>
                          • {reason}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.resourceActions}>
                      {resource.phoneNumber && (
                        <TouchableOpacity 
                          style={styles.resourceAction}
                          onPress={() => Linking.openURL(`tel:${resource.phoneNumber}`)}
                        >
                          <Phone color="#43A047" size={16} />
                          <Text style={styles.resourceActionText}>Call</Text>
                        </TouchableOpacity>
                      )}
                      {resource.url && (
                        <TouchableOpacity style={styles.resourceAction}>
                          <ExternalLink color="#6A2CB0" size={16} />
                          <Text style={styles.resourceActionText}>Visit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Safety Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personalized Safety Tips</Text>
              <View style={styles.safetyTips}>
                {survivorRecommendations.safetyTips.map((tip) => (
                  <View key={tip} style={styles.safetyTip}>
                    <CheckCircle color="#43A047" size={16} />
                    <Text style={styles.safetyTipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Next Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
              <View style={styles.nextSteps}>
                {survivorRecommendations.nextSteps.map((step, index) => (
                  <View key={step} style={styles.nextStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Brain color="#D8CEE8" size={64} />
            <Text style={styles.emptyTitle}>No Recommendations Yet</Text>
            <Text style={styles.emptyDescription}>
              Submit a report to receive personalized AI recommendations
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/report')}
            >
              <Text style={styles.emptyButtonText}>Create Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
  subtitle: {
    fontSize: 16,
    color: '#49455A',
    marginTop: 4,
  },
  refreshButton: {
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
  aiStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  aiStatusContent: {
    flex: 1,
  },
  aiStatusTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiStatusDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  loadingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  emptyInsights: {
    alignItems: 'center',
    paddingVertical: 40,
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
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  caseRecommendations: {
    paddingHorizontal: 24,
    gap: 12,
  },
  caseRecommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  caseDescription: {
    fontSize: 14,
    color: '#341A52',
    marginBottom: 12,
    lineHeight: 18,
  },
  recommendationMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#49455A',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  // Survivor-specific styles
  riskCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
  },
  riskDescription: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 12,
    lineHeight: 18,
  },
  riskFactors: {
    marginTop: 8,
  },
  riskFactorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  riskFactor: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 4,
  },
  resourcesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    flex: 1,
    marginRight: 8,
  },
  relevanceScore: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  relevanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 8,
    lineHeight: 18,
  },
  resourceReasons: {
    marginBottom: 12,
  },
  resourceReason: {
    fontSize: 12,
    color: '#49455A',
    marginBottom: 2,
  },
  resourceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  resourceActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  safetyTips: {
    paddingHorizontal: 24,
    gap: 12,
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyTipText: {
    fontSize: 14,
    color: '#341A52',
    flex: 1,
    lineHeight: 18,
  },
  nextSteps: {
    paddingHorizontal: 24,
    gap: 12,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 14,
    color: '#341A52',
    flex: 1,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});