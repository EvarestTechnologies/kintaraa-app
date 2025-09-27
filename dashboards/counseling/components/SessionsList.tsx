import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Video, Phone, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { CounselingSession } from '../index';

const SessionsList: React.FC = () => {
  const { assignedCases } = useProvider();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');

  // Convert incidents to counseling sessions
  const sessions: CounselingSession[] = useMemo(() => {
    const counselingCases = assignedCases.filter(c => c.supportServices.includes('counseling'));
    
    return counselingCases.flatMap((incident, caseIndex) => {
      // Generate multiple sessions per case
      const sessionCount = Math.min(3, Math.max(1, Math.floor(Math.random() * 4)));
      return Array.from({ length: sessionCount }, (_, sessionIndex) => {
        const baseDate = new Date(incident.createdAt);
        const sessionDate = new Date(baseDate.getTime() + (sessionIndex * 7 * 24 * 60 * 60 * 1000)); // Weekly sessions
        
        return {
          id: `${incident.id}-session-${sessionIndex}`,
          clientName: `Client ${incident.caseNumber}`,
          clientId: incident.id,
          type: incident.type === 'physical' ? 'individual' :
                incident.type === 'emotional' ? 'individual' :
                incident.type === 'sexual' ? 'individual' :
                incident.type === 'economic' ? 'family' : 'individual',
          mode: sessionIndex % 3 === 0 ? 'in_person' : sessionIndex % 3 === 1 ? 'video_call' : 'phone_call',
          date: sessionDate.toISOString().split('T')[0],
          time: `${9 + (sessionIndex % 8)}:00`,
          duration: 60,
          status: sessionIndex === 0 && incident.status === 'completed' ? 'completed' :
                  sessionIndex === 0 && incident.status === 'in_progress' ? 'in_progress' :
                  sessionDate < new Date() ? 'completed' :
                  sessionDate.toDateString() === new Date().toDateString() ? 'confirmed' : 'scheduled',
          location: sessionIndex % 3 === 0 ? 'Office Room 201' : undefined,
          sessionNotes: sessionIndex === 0 ? incident.description : undefined,
          goals: [
            'Establish therapeutic rapport',
            'Assess current mental state',
            'Develop coping strategies'
          ],
          progress: sessionIndex === 0 ? 'good' : 
                   sessionDate < new Date() ? 'excellent' : 'good',
          nextSteps: sessionIndex === 0 ? 'Continue weekly sessions, homework assignments' : undefined,
          caseId: incident.caseNumber
        } as CounselingSession;
      });
    });
  }, [assignedCases]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    const today = new Date().toDateString();
    
    switch (selectedFilter) {
      case 'today':
        return sessions.filter(s => new Date(s.date).toDateString() === today);
      case 'upcoming':
        return sessions.filter(s => new Date(s.date) > new Date() && s.status !== 'completed');
      case 'completed':
        return sessions.filter(s => s.status === 'completed');
      default:
        return sessions;
    }
  }, [sessions, selectedFilter]);

  // Sort sessions by date and time
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredSessions]);

  const getStatusColor = (status: CounselingSession['status']) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'confirmed': return '#059669';
      case 'scheduled': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'no_show': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getModeIcon = (mode: CounselingSession['mode']) => {
    switch (mode) {
      case 'video_call': return <Video size={16} color="#6B7280" />;
      case 'phone_call': return <Phone size={16} color="#6B7280" />;
      case 'in_person': return <MapPin size={16} color="#6B7280" />;
      default: return <User size={16} color="#6B7280" />;
    }
  };

  const SessionCard: React.FC<{ session: CounselingSession }> = ({ session }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.clientName}>{session.clientName}</Text>
          <Text style={styles.sessionType}>
            {session.type.replace('_', ' ').toUpperCase()} • {session.caseId}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
          <Text style={styles.statusText}>
            {session.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {new Date(session.date).toLocaleDateString()} at {session.time}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>{session.duration} minutes</Text>
        </View>

        <View style={styles.detailItem}>
          {getModeIcon(session.mode)}
          <Text style={styles.detailText}>
            {session.mode.replace('_', ' ')}
            {session.location && ` • ${session.location}`}
          </Text>
        </View>
      </View>

      {session.goals.length > 0 && (
        <View style={styles.goalsContainer}>
          <Text style={styles.goalsLabel}>Session Goals:</Text>
          {session.goals.slice(0, 2).map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
          {session.goals.length > 2 && (
            <Text style={styles.moreGoals}>+{session.goals.length - 2} more goals</Text>
          )}
        </View>
      )}

      {session.sessionNotes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {session.sessionNotes}
          </Text>
        </View>
      )}

      {session.progress && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress:</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{session.progress.toUpperCase()}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
        <Text style={styles.subtitle}>
          Manage your counseling sessions and track client progress
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
        {[
          { key: 'all', label: 'All Sessions', count: sessions.length },
          { key: 'today', label: 'Today', count: sessions.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length },
          { key: 'upcoming', label: 'Upcoming', count: sessions.filter(s => new Date(s.date) > new Date() && s.status !== 'completed').length },
          { key: 'completed', label: 'Completed', count: sessions.filter(s => s.status === 'completed').length },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.filterTabTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
        {sortedSessions.length > 0 ? (
          sortedSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No sessions found</Text>
            <Text style={styles.emptySubtitle}>
              No sessions match the selected filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  filterScroll: {
    alignItems: 'center',
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  sessionDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  goalsContainer: {
    marginBottom: 12,
  },
  goalsLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginBottom: 6,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 6,
    flex: 1,
  },
  moreGoals: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic' as const,
    marginTop: 4,
  },
  notesContainer: {
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  progressBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#166534',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default SessionsList;