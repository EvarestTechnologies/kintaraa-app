import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import { useJournaling } from '@/providers/WellbeingProvider';
import { BookOpen, Plus, Lock, Globe, Calendar, Heart } from 'lucide-react-native';

export default function JournalScreen() {
  const { journalEntries, addJournalEntry, isAddingJournal } = useJournaling();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleAddEntry = () => {
    if (!content.trim()) {
      return;
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    addJournalEntry({
      title: title.trim() || undefined,
      content: content.trim(),
      mood: mood.trim() || undefined,
      tags: tagArray,
      isPrivate
    });

    setShowAddModal(false);
    setTitle('');
    setContent('');
    setMood('');
    setTags('');
    setIsPrivate(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'anxious': '😰',
      'hopeful': '🌟',
      'angry': '😠',
      'peaceful': '😌',
      'grateful': '🙏',
      'confused': '😕',
      'excited': '🎉',
      'tired': '😴',
      'connected': '🤝',
      'lonely': '😔'
    };
    return mood ? moodEmojis[mood.toLowerCase()] || '💭' : '💭';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Healing Journal',
          headerStyle: { backgroundColor: '#F5F0FF' },
          headerTintColor: '#341A52'
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Stats Overview */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Journal Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <BookOpen color="#26A69A" size={24} />
                <Text style={styles.statNumber}>{journalEntries.length}</Text>
                <Text style={styles.statLabel}>Total Entries</Text>
              </View>
              <View style={styles.statItem}>
                <Calendar color="#26A69A" size={24} />
                <Text style={styles.statNumber}>
                  {journalEntries.filter(entry => {
                    const entryDate = new Date(entry.createdAt).toDateString();
                    const today = new Date().toDateString();
                    return entryDate === today;
                  }).length}
                </Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statItem}>
                <Heart color="#26A69A" size={24} />
                <Text style={styles.statNumber}>
                  {journalEntries.filter(entry => entry.mood).length}
                </Text>
                <Text style={styles.statLabel}>With Mood</Text>
              </View>
            </View>
          </View>

          {/* Add Entry Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus color="#FFFFFF" size={24} />
            <Text style={styles.addButtonText}>New Entry</Text>
          </TouchableOpacity>

          {/* Journal Entries */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {journalEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen color="#D8CEE8" size={48} />
                <Text style={styles.emptyTitle}>No Journal Entries</Text>
                <Text style={styles.emptyDescription}>
                  Start writing to track your thoughts and feelings
                </Text>
              </View>
            ) : (
              journalEntries.slice(0, 10).map((entry) => (
                <View key={entry.id} style={styles.journalEntry}>
                  <View style={styles.entryHeader}>
                    <View style={styles.entryTitleRow}>
                      {entry.mood && (
                        <Text style={styles.moodEmoji}>
                          {getMoodEmoji(entry.mood)}
                        </Text>
                      )}
                      <Text style={styles.entryTitle}>
                        {entry.title || 'Untitled Entry'}
                      </Text>
                    </View>
                    <View style={styles.privacyIndicator}>
                      {entry.isPrivate ? (
                        <Lock color="#49455A" size={16} />
                      ) : (
                        <Globe color="#49455A" size={16} />
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.entryDate}>
                    {formatDate(entry.createdAt)}
                  </Text>
                  
                  <Text style={styles.entryContent} numberOfLines={3}>
                    {entry.content}
                  </Text>
                  
                  {entry.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                      {entry.tags.length > 3 && (
                        <Text style={styles.moreTags}>+{entry.tags.length - 3}</Text>
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Add Entry Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Entry</Text>
              <TouchableOpacity 
                onPress={handleAddEntry}
                disabled={isAddingJournal || !content.trim()}
              >
                <Text style={[
                  styles.saveButton, 
                  (isAddingJournal || !content.trim()) && styles.disabledButton
                ]}>
                  {isAddingJournal ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title (Optional)</Text>
                <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Give your entry a title..."
                  placeholderTextColor="#D8CEE8"
                />
              </View>

              {/* Content */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Thoughts *</Text>
                <TextInput
                  style={styles.contentInput}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Write about your day, feelings, thoughts, or anything on your mind..."
                  placeholderTextColor="#D8CEE8"
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>

              {/* Mood */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mood (Optional)</Text>
                <TextInput
                  style={styles.moodInput}
                  value={mood}
                  onChangeText={setMood}
                  placeholder="How are you feeling? (e.g., hopeful, anxious, grateful)"
                  placeholderTextColor="#D8CEE8"
                />
              </View>

              {/* Tags */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (Optional)</Text>
                <TextInput
                  style={styles.tagsInput}
                  value={tags}
                  onChangeText={setTags}
                  placeholder="therapy, healing, progress, family (separate with commas)"
                  placeholderTextColor="#D8CEE8"
                />
              </View>

              {/* Privacy Setting */}
              <View style={styles.inputGroup}>
                <View style={styles.privacyRow}>
                  <View style={styles.privacyInfo}>
                    <Text style={styles.inputLabel}>Private Entry</Text>
                    <Text style={styles.privacyDescription}>
                      {isPrivate 
                        ? 'Only you can see this entry' 
                        : 'This entry may be shared with your care team'
                      }
                    </Text>
                  </View>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: '#D8CEE8', true: '#26A69A' }}
                    thumbColor={isPrivate ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>

              {/* Writing Tips */}
              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>Writing Tips</Text>
                <Text style={styles.tipsText}>
                  • Write freely without worrying about grammar{'\n'}
                  • Focus on your feelings and experiences{'\n'}
                  • Be honest and authentic with yourself{'\n'}
                  • Use this space to process difficult emotions{'\n'}
                  • Celebrate small victories and progress
                </Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#26A69A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#26A69A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
  },
  journalEntry: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  moodEmoji: {
    fontSize: 20,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    flex: 1,
  },
  privacyIndicator: {
    marginLeft: 8,
  },
  entryDate: {
    fontSize: 12,
    color: '#49455A',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#26A69A',
  },
  tagText: {
    fontSize: 12,
    color: '#26A69A',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    color: '#49455A',
    fontStyle: 'italic',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CEE8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#341A52',
  },
  cancelButton: {
    fontSize: 16,
    color: '#49455A',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26A69A',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
    minHeight: 120,
  },
  moodInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  tagsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#49455A',
    marginTop: 4,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
});