import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSleepTracking } from '@/providers/WellbeingProvider';
import { Moon, Clock, Star, Plus, Calendar } from 'lucide-react-native';

export default function SleepTrackerScreen() {
  const { sleepEntries, addSleepEntry, isAddingSleep } = useSleepTracking();
  const [showAddModal, setShowAddModal] = useState(false);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  const calculateSleepDuration = (bedtime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedTimeMinutes = bedHour * 60 + bedMin;
    let wakeTimeMinutes = wakeHour * 60 + wakeMin;
    
    // Handle overnight sleep
    if (wakeTimeMinutes < bedTimeMinutes) {
      wakeTimeMinutes += 24 * 60;
    }
    
    return Math.round((wakeTimeMinutes - bedTimeMinutes) / 60 * 10) / 10;
  };

  const handleAddSleep = () => {
    const duration = calculateSleepDuration(bedtime, wakeTime);
    
    if (duration <= 0 || duration > 24) {
      Alert.alert('Invalid Time', 'Please check your bedtime and wake time.');
      return;
    }

    addSleepEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      sleepDuration: duration,
      sleepQuality,
      notes: notes.trim() || undefined
    });

    setShowAddModal(false);
    setBedtime('22:00');
    setWakeTime('07:00');
    setSleepQuality(3);
    setNotes('');
  };

  const getQualityColor = (quality: number) => {
    const colors = ['#E53935', '#FF5722', '#FF9800', '#4CAF50', '#2E7D32'];
    return colors[quality - 1];
  };

  const getQualityLabel = (quality: number) => {
    const labels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
    return labels[quality - 1];
  };

  const averageSleep = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleepDuration, 0) / sleepEntries.length 
    : 0;

  const averageQuality = sleepEntries.length > 0
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleepQuality, 0) / sleepEntries.length
    : 0;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sleep Tracker',
          headerStyle: { backgroundColor: '#F5F0FF' },
          headerTintColor: '#341A52'
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Stats Overview */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Sleep Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Moon color="#6A2CB0" size={24} />
                <Text style={styles.statNumber}>{Math.round(averageSleep * 10) / 10}h</Text>
                <Text style={styles.statLabel}>Avg Sleep</Text>
              </View>
              <View style={styles.statItem}>
                <Star color="#6A2CB0" size={24} />
                <Text style={styles.statNumber}>{Math.round(averageQuality * 10) / 10}/5</Text>
                <Text style={styles.statLabel}>Avg Quality</Text>
              </View>
              <View style={styles.statItem}>
                <Calendar color="#6A2CB0" size={24} />
                <Text style={styles.statNumber}>{sleepEntries.length}</Text>
                <Text style={styles.statLabel}>Entries</Text>
              </View>
            </View>
          </View>

          {/* Add Sleep Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus color="#FFFFFF" size={24} />
            <Text style={styles.addButtonText}>Log Sleep</Text>
          </TouchableOpacity>

          {/* Sleep History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sleep History</Text>
            {sleepEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Moon color="#D8CEE8" size={48} />
                <Text style={styles.emptyTitle}>No Sleep Data</Text>
                <Text style={styles.emptyDescription}>
                  Start tracking your sleep to see patterns and insights
                </Text>
              </View>
            ) : (
              sleepEntries.slice(0, 10).map((entry) => (
                <View key={entry.id} style={styles.sleepEntry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryDate}>
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                    <View style={styles.qualityBadge}>
                      <View 
                        style={[
                          styles.qualityDot, 
                          { backgroundColor: getQualityColor(entry.sleepQuality) }
                        ]} 
                      />
                      <Text style={styles.qualityText}>
                        {getQualityLabel(entry.sleepQuality)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.entryDetails}>
                    <View style={styles.timeInfo}>
                      <Clock color="#49455A" size={16} />
                      <Text style={styles.timeText}>
                        {entry.bedtime} - {entry.wakeTime}
                      </Text>
                    </View>
                    <Text style={styles.durationText}>
                      {entry.sleepDuration}h sleep
                    </Text>
                  </View>
                  
                  {entry.notes && (
                    <Text style={styles.entryNotes}>{entry.notes}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Add Sleep Modal */}
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
              <Text style={styles.modalTitle}>Log Sleep</Text>
              <TouchableOpacity 
                onPress={handleAddSleep}
                disabled={isAddingSleep}
              >
                <Text style={[styles.saveButton, isAddingSleep && styles.disabledButton]}>
                  {isAddingSleep ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Bedtime */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bedtime</Text>
                <TextInput
                  style={styles.timeInput}
                  value={bedtime}
                  onChangeText={setBedtime}
                  placeholder="22:00"
                  keyboardType="numeric"
                />
              </View>

              {/* Wake Time */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Wake Time</Text>
                <TextInput
                  style={styles.timeInput}
                  value={wakeTime}
                  onChangeText={setWakeTime}
                  placeholder="07:00"
                  keyboardType="numeric"
                />
              </View>

              {/* Sleep Duration Preview */}
              <View style={styles.durationPreview}>
                <Text style={styles.durationLabel}>Sleep Duration</Text>
                <Text style={styles.durationValue}>
                  {calculateSleepDuration(bedtime, wakeTime)}h
                </Text>
              </View>

              {/* Sleep Quality */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sleep Quality</Text>
                <View style={styles.qualitySelector}>
                  {[1, 2, 3, 4, 5].map((quality) => (
                    <TouchableOpacity
                      key={quality}
                      style={[
                        styles.qualityOption,
                        sleepQuality === quality && styles.qualityOptionSelected
                      ]}
                      onPress={() => setSleepQuality(quality as 1 | 2 | 3 | 4 | 5)}
                    >
                      <View 
                        style={[
                          styles.qualityCircle,
                          { backgroundColor: getQualityColor(quality) }
                        ]}
                      />
                      <Text style={styles.qualityNumber}>{quality}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.qualityDescription}>
                  {getQualityLabel(sleepQuality)}
                </Text>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="How did you sleep? Any factors that affected your sleep?"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
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
    color: '#6A2CB0',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6A2CB0',
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
  sleepEntry: {
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
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  qualityText: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '500',
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#49455A',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  entryNotes: {
    fontSize: 14,
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
    color: '#6A2CB0',
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
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  durationPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 16,
    color: '#49455A',
  },
  durationValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6A2CB0',
  },
  qualitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  qualityOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 4,
  },
  qualityOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  qualityCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  qualityNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  qualityDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
    minHeight: 80,
  },
});