import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { router } from 'expo-router';
import type { Appointment } from '../index';

type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'therapy';
type AppointmentMode = 'in_person' | 'video_call' | 'phone_call';
type FilterType = 'all' | 'today' | 'upcoming' | 'completed' | 'cancelled';

const statusConfig = {
  scheduled: { color: '#F59E0B', icon: Clock, label: 'Scheduled' },
  confirmed: { color: '#10B981', icon: CheckCircle, label: 'Confirmed' },
  in_progress: { color: '#3B82F6', icon: Clock, label: 'In Progress' },
  completed: { color: '#059669', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: '#EF4444', icon: XCircle, label: 'Cancelled' },
};

const typeConfig = {
  consultation: { color: '#3B82F6', label: 'Consultation' },
  follow_up: { color: '#10B981', label: 'Follow-up' },
  emergency: { color: '#EF4444', label: 'Emergency' },
  therapy: { color: '#8B5CF6', label: 'Therapy' },
};

const modeConfig = {
  in_person: { icon: MapPin, label: 'In Person' },
  video_call: { icon: Video, label: 'Video Call' },
  phone_call: { icon: Phone, label: 'Phone Call' },
};

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Appointments' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentsList() {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Transform cases to appointments
  const appointments: Appointment[] = useMemo(() => {
    const appointmentsList: Appointment[] = [];
    
    assignedCases.forEach((case_, index) => {
      // Create 1-3 appointments per case
      const numAppointments = 1 + (index % 3);
      
      for (let i = 0; i < numAppointments; i++) {
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + (index * 2) + i - 5);
        
        const types: AppointmentType[] = ['consultation', 'follow_up', 'emergency', 'therapy'];
        const modes: AppointmentMode[] = ['in_person', 'video_call', 'phone_call'];
        const statuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];
        
        appointmentsList.push({
          id: `${case_.id}-apt-${i}`,
          patientName: `Patient ${case_.caseNumber.split('-')[2] || index + 1}`,
          patientId: case_.id,
          type: types[i % types.length],
          mode: modes[i % modes.length],
          date: appointmentDate.toISOString().split('T')[0],
          time: `${9 + (i * 2)}:${i % 2 === 0 ? '00' : '30'}`,
          duration: 30 + (i * 15),
          status: statuses[i % statuses.length],
          location: case_.location?.address || case_.location?.description || 'Location not specified',
          notes: i === 0 ? 'Initial consultation' : `Follow-up session ${i}`,
          priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
          caseId: case_.id,
        });
      }
    });
    
    return appointmentsList.sort((a, b) => 
      new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
    );
  }, [assignedCases]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Apply status filter
    switch (selectedFilter) {
      case 'today':
        filtered = filtered.filter(apt => apt.date === today);
        break;
      case 'upcoming':
        filtered = filtered.filter(apt => {
          const aptDateTime = new Date(`${apt.date} ${apt.time}`);
          return aptDateTime > now && apt.status !== 'cancelled' && apt.status !== 'completed';
        });
        break;
      case 'completed':
        filtered = filtered.filter(apt => apt.status === 'completed');
        break;
      case 'cancelled':
        filtered = filtered.filter(apt => apt.status === 'cancelled');
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.patientName.toLowerCase().includes(query) ||
        apt.type.toLowerCase().includes(query) ||
        apt.location?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [appointments, selectedFilter, searchQuery]);

  const handleAppointmentPress = (appointment: Appointment) => {
    console.log('Navigate to appointment details:', appointment.id);
    router.push(`/case-details/${appointment.caseId}`);
  };

  const handleAddAppointment = () => {
    Alert.alert(
      'Schedule Appointment',
      'Appointment scheduling functionality will be implemented in the next phase.',
      [{ text: 'OK' }]
    );
  };

  const handleJoinCall = (appointment: Appointment) => {
    if (appointment.mode === 'video_call') {
      Alert.alert(
        'Join Video Call',
        `Join video consultation with ${appointment.patientName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => console.log('Joining video call:', appointment.id) },
        ]
      );
    } else if (appointment.mode === 'phone_call') {
      Alert.alert(
        'Start Phone Call',
        `Call ${appointment.patientName} for scheduled consultation?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => console.log('Starting phone call:', appointment.id) },
        ]
      );
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    const StatusIcon = statusConfig[status].icon;
    return <StatusIcon color={statusConfig[status].color} size={16} />;
  };

  const getModeIcon = (mode: AppointmentMode) => {
    const ModeIcon = modeConfig[mode].icon;
    return <ModeIcon color="#6B7280" size={16} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isUpcoming = (appointment: Appointment) => {
    const aptDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return aptDateTime > new Date() && appointment.status !== 'cancelled' && appointment.status !== 'completed';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Appointments</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddAppointment}
            testID="add-appointment-button"
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter color={showFilters ? '#6A2CB0' : '#9CA3AF'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterChip,
                  selectedFilter === option.key && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(option.key)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === option.key && styles.filterChipTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Appointments List */}
      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No Appointments Found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No appointments match the selected filter'}
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.appointmentCard}
              onPress={() => handleAppointmentPress(appointment)}
              testID={`appointment-card-${appointment.id}`}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentInfo}>
                  <View style={styles.patientNameRow}>
                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                    <View style={styles.statusBadge}>
                      {getStatusIcon(appointment.status)}
                      <Text style={[
                        styles.statusText,
                        { color: statusConfig[appointment.status].color }
                      ]}>
                        {statusConfig[appointment.status].label}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.typeRow}>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: `${typeConfig[appointment.type].color}20` }
                    ]}>
                      <Text style={[
                        styles.typeText,
                        { color: typeConfig[appointment.type].color }
                      ]}>
                        {typeConfig[appointment.type].label}
                      </Text>
                    </View>
                    
                    {appointment.priority === 'urgent' && (
                      <View style={styles.urgentBadge}>
                        <AlertTriangle color="#EF4444" size={12} />
                        <Text style={styles.urgentText}>Urgent</Text>
                      </View>
                    )}
                  </View>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.timeInfo}>
                  <View style={styles.infoRow}>
                    <Calendar color="#6B7280" size={16} />
                    <Text style={styles.infoText}>
                      {formatDate(appointment.date)} at {appointment.time}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Clock color="#6B7280" size={16} />
                    <Text style={styles.infoText}>
                      {appointment.duration} minutes
                    </Text>
                  </View>
                </View>
                
                <View style={styles.modeInfo}>
                  <View style={styles.infoRow}>
                    {getModeIcon(appointment.mode)}
                    <Text style={styles.infoText}>
                      {modeConfig[appointment.mode].label}
                    </Text>
                  </View>
                  
                  {appointment.location && appointment.mode === 'in_person' && (
                    <View style={styles.infoRow}>
                      <MapPin color="#6B7280" size={16} />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {appointment.location}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {appointment.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                  {appointment.notes}
                </Text>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {isUpcoming(appointment) && (appointment.mode === 'video_call' || appointment.mode === 'phone_call') && (
                  <TouchableOpacity 
                    style={styles.joinButton}
                    onPress={() => handleJoinCall(appointment)}
                  >
                    {appointment.mode === 'video_call' ? (
                      <Video color="#FFFFFF" size={16} />
                    ) : (
                      <Phone color="#FFFFFF" size={16} />
                    )}
                    <Text style={styles.joinButtonText}>
                      {appointment.mode === 'video_call' ? 'Join Call' : 'Start Call'}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleAppointmentPress(appointment)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
  },
  addButton: {
    backgroundColor: '#6A2CB0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    marginTop: 16,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    gap: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeInfo: {
    flex: 1,
    gap: 4,
  },
  modeInfo: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  notes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
});