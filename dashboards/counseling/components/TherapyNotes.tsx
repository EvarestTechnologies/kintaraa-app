import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, FileText, Calendar, User, Lock, Tag } from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { TherapyNote } from '../index';

const TherapyNotes: React.FC = () => {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'session_note' | 'progress_note' | 'assessment'>('all');

  // Convert incidents to therapy notes
  const therapyNotes: TherapyNote[] = useMemo(() => {
    const counselingCases = assignedCases.filter(c => c.supportServices.includes('counseling'));
    
    return counselingCases.flatMap((incident, caseIndex) => {
      // Generate multiple notes per case
      const noteCount = Math.min(4, Math.max(2, Math.floor(Math.random() * 5)));
      return Array.from({ length: noteCount }, (_, noteIndex) => {
        const baseDate = new Date(incident.createdAt);
        const noteDate = new Date(baseDate.getTime() + (noteIndex * 7 * 24 * 60 * 60 * 1000));
        
        const noteTypes: TherapyNote['type'][] = ['session_note', 'progress_note', 'assessment', 'crisis_note'];
        const noteType = noteTypes[noteIndex % noteTypes.length];
        
        return {
          id: `${incident.id}-note-${noteIndex}`,
          clientId: incident.id,
          clientName: `Client ${incident.caseNumber}`,
          sessionId: noteType === 'session_note' ? `${incident.id}-session-${noteIndex}` : undefined,
          type: noteType,
          title: noteType === 'session_note' ? `Session ${noteIndex + 1} - Individual Therapy` :
                 noteType === 'progress_note' ? `Progress Review - Week ${noteIndex + 1}` :
                 noteType === 'assessment' ? `Initial Assessment - ${incident.type} Trauma` :
                 `Crisis Intervention Note`,
          content: noteType === 'session_note' ? 
            `Client presented with ${incident.type} trauma symptoms. Discussed coping strategies and emotional regulation techniques. Client showed good engagement and willingness to participate in therapeutic process. Homework assigned: daily mindfulness practice and mood tracking.` :
            noteType === 'progress_note' ?
            `Client demonstrates significant improvement in emotional regulation and trauma symptoms. Sleep patterns have improved, and anxiety levels have decreased. Continue current treatment approach with focus on interpersonal relationships.` :
            noteType === 'assessment' ?
            `Comprehensive assessment reveals ${incident.type} trauma with associated PTSD symptoms. Client reports flashbacks, hypervigilance, and avoidance behaviors. Recommended treatment plan includes trauma-focused CBT and EMDR therapy.` :
            `Crisis intervention provided due to acute distress. Safety plan reviewed and updated. Client stabilized and agreed to follow-up appointment within 48 hours.`,
          date: noteDate.toISOString().split('T')[0],
          therapist: 'Dr. Sarah Johnson, LCSW',
          status: noteIndex === 0 ? 'completed' : 
                  noteIndex === 1 ? 'pending_review' : 
                  'approved',
          confidentiality: incident.type === 'sexual' ? 'high_security' :
                          incident.isAnonymous ? 'restricted' : 'standard',
          tags: [
            incident.type,
            noteType === 'session_note' ? 'therapy' : 
            noteType === 'progress_note' ? 'progress' : 
            noteType === 'assessment' ? 'assessment' : 'crisis',
            incident.priority
          ],
          caseId: incident.caseNumber
        } as TherapyNote;
      });
    });
  }, [assignedCases]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let filtered = therapyNotes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.clientName.toLowerCase().includes(query) ||
        note.caseId.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(note => note.type === selectedFilter);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [therapyNotes, searchQuery, selectedFilter]);

  const getStatusColor = (status: TherapyNote['status']) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'approved': return '#8B5CF6';
      case 'pending_review': return '#F59E0B';
      case 'draft': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getConfidentialityColor = (confidentiality: TherapyNote['confidentiality']) => {
    switch (confidentiality) {
      case 'high_security': return '#DC2626';
      case 'restricted': return '#EA580C';
      case 'standard': return '#059669';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: TherapyNote['type']) => {
    switch (type) {
      case 'session_note': return <User size={16} color="#6B7280" />;
      case 'progress_note': return <Calendar size={16} color="#6B7280" />;
      case 'assessment': return <FileText size={16} color="#6B7280" />;
      case 'crisis_note': return <FileText size={16} color="#DC2626" />;
      case 'discharge_summary': return <FileText size={16} color="#8B5CF6" />;
      default: return <FileText size={16} color="#6B7280" />;
    }
  };

  const TherapyNoteCard: React.FC<{ note: TherapyNote }> = ({ note }) => (
    <TouchableOpacity style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <View style={styles.noteInfo}>
          <View style={styles.noteTitleRow}>
            {getTypeIcon(note.type)}
            <Text style={styles.noteTitle} numberOfLines={1}>
              {note.title}
            </Text>
          </View>
          <Text style={styles.clientName}>{note.clientName} • {note.caseId}</Text>
        </View>
        <View style={styles.noteStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(note.status) }]}>
            <Text style={styles.statusText}>
              {note.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.noteContent} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.noteDetails}>
        <View style={styles.noteDate}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.noteDateText}>
            {new Date(note.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.therapistInfo}>
          <User size={14} color="#6B7280" />
          <Text style={styles.therapistText}>{note.therapist}</Text>
        </View>
      </View>

      <View style={styles.noteFooter}>
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={`${note.id}-tag-${index}`} style={styles.tag}>
              <Tag size={10} color="#6B7280" />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTags}>+{note.tags.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.confidentialityContainer}>
          <Lock size={12} color={getConfidentialityColor(note.confidentiality)} />
          <Text style={[
            styles.confidentialityText,
            { color: getConfidentialityColor(note.confidentiality) }
          ]}>
            {note.confidentiality.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Therapy Notes</Text>
        <Text style={styles.subtitle}>
          Document and review client therapy sessions and progress
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
        {[
          { key: 'all', label: 'All Notes', count: therapyNotes.length },
          { key: 'session_note', label: 'Session Notes', count: therapyNotes.filter(n => n.type === 'session_note').length },
          { key: 'progress_note', label: 'Progress Notes', count: therapyNotes.filter(n => n.type === 'progress_note').length },
          { key: 'assessment', label: 'Assessments', count: therapyNotes.filter(n => n.type === 'assessment').length },
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

      {/* Notes List */}
      <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <TherapyNoteCard key={note.id} note={note} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No therapy notes found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No notes match the selected filter'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabs: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noteCard: {
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
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    color: '#6B7280',
  },
  noteStatus: {
    alignItems: 'flex-end',
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
  noteContent: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  noteDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapistText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
  moreTags: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic' as const,
  },
  confidentialityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidentialityText: {
    fontSize: 10,
    fontWeight: '500' as const,
    marginLeft: 4,
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

export default TherapyNotes;