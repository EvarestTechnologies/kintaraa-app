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
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { router } from 'expo-router';
import type { Patient } from '../index';
import RegisterPatientModal from './RegisterPatientModal';

type PatientStatus = 'active' | 'recovering' | 'stable' | 'critical';
type FilterType = 'all' | 'active' | 'recovering' | 'stable' | 'critical';

const statusConfig = {
  active: { color: '#10B981', icon: Activity, label: 'Active' },
  recovering: { color: '#F59E0B', icon: Clock, label: 'Recovering' },
  stable: { color: '#3B82F6', icon: CheckCircle, label: 'Stable' },
  critical: { color: '#EF4444', icon: AlertCircle, label: 'Critical' },
};

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Patients' },
  { key: 'active', label: 'Active' },
  { key: 'recovering', label: 'Recovering' },
  { key: 'stable', label: 'Stable' },
  { key: 'critical', label: 'Critical' },
];

export default function PatientsList() {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Transform cases to patients
  const patients: Patient[] = useMemo(() => {
    return assignedCases.map((case_, index) => ({
      id: case_.id,
      name: `Patient ${case_.caseNumber.split('-')[2] || index + 1}`, // Generate name from case number
      age: 25 + (index % 40), // Mock age
      gender: index % 2 === 0 ? 'Female' : 'Male',
      condition: case_.description ? case_.description.substring(0, 50) + '...' : 'No description available',
      status: (['active', 'recovering', 'stable', 'critical'] as PatientStatus[])[index % 4],
      lastVisit: case_.updatedAt,
      nextAppointment: case_.status === 'in_progress' ? 
        new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      phone: `+256 ${700 + index}${String(index).padStart(6, '0')}`,
      address: case_.location?.address || case_.location?.description || 'Address not provided',
      caseId: case_.id,
    }));
  }, [assignedCases]);

  // Calculate patient stats
  const patientStats = useMemo(() => {
    return {
      total: patients.length,
      active: patients.filter(p => p.status === 'active').length,
      recovering: patients.filter(p => p.status === 'recovering').length,
      stable: patients.filter(p => p.status === 'stable').length,
      critical: patients.filter(p => p.status === 'critical').length,
      withAppointments: patients.filter(p => p.nextAppointment).length,
    };
  }, [patients]);

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query) ||
        patient.phone.includes(query)
      );
    }

    return filtered;
  }, [patients, selectedFilter, searchQuery]);

  const handlePatientPress = (patient: Patient) => {
    console.log('Navigate to patient details:', patient.id);
    router.push(`/case-details/${patient.caseId}`);
  };

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleAddPatient = () => {
    setShowRegisterModal(true);
  };

  const handleCallPatient = (patient: Patient) => {
    Alert.alert(
      'Call Patient',
      `Call ${patient.name} at ${patient.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', patient.phone) },
      ]
    );
  };

  const getStatusIcon = (status: PatientStatus) => {
    const StatusIcon = statusConfig[status].icon;
    return <StatusIcon color={statusConfig[status].color} size={16} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Patients</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPatient}
            testID="add-patient-button"
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
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

      {/* Patient Overview Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <User color="#6A2CB0" size={24} />
              <Text style={styles.statNumber}>{patientStats.total}</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </View>
            <View style={styles.statItem}>
              <Activity color="#10B981" size={24} />
              <Text style={styles.statNumber}>{patientStats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Clock color="#F59E0B" size={24} />
              <Text style={styles.statNumber}>{patientStats.recovering}</Text>
              <Text style={styles.statLabel}>Recovering</Text>
            </View>
            <View style={styles.statItem}>
              <AlertCircle color="#EF4444" size={24} />
              <Text style={styles.statNumber}>{patientStats.critical}</Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
          </View>
          <View style={styles.statsSecondary}>
            <View style={styles.secondaryStatItem}>
              <CheckCircle color="#3B82F6" size={16} />
              <Text style={styles.secondaryStatText}>
                {patientStats.stable} Stable • {patientStats.withAppointments} Scheduled
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Patients List */}
      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <User color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No Patients Found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No patients match the selected filter'}
            </Text>
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => handlePatientPress(patient)}
              testID={`patient-card-${patient.id}`}
            >
              <View style={styles.patientHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.patientNameRow}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={styles.statusBadge}>
                      {getStatusIcon(patient.status)}
                      <Text style={[
                        styles.statusText,
                        { color: statusConfig[patient.status].color }
                      ]}>
                        {statusConfig[patient.status].label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.patientDetails}>
                    {patient.age} years • {patient.gender}
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </View>

              <Text style={styles.condition} numberOfLines={2}>
                {patient.condition}
              </Text>

              <View style={styles.patientFooter}>
                <View style={styles.contactInfo}>
                  <View style={styles.infoRow}>
                    <Phone color="#6B7280" size={14} />
                    <Text style={styles.infoText}>{patient.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {patient.address}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.appointmentInfo}>
                  {patient.nextAppointment ? (
                    <View style={styles.infoRow}>
                      <Calendar color="#10B981" size={14} />
                      <Text style={styles.nextAppointment}>
                        {new Date(patient.nextAppointment).toLocaleDateString()}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.noAppointment}>No upcoming appointment</Text>
                  )}
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCallPatient(patient)}
                >
                  <Phone color="#FFFFFF" size={16} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handlePatientPress(patient)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Register Patient Modal */}
      <RegisterPatientModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          // The patient will automatically appear in the list since it's added to incidents
          console.log('Patient registered successfully in patients list');
        }}
      />
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
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsSecondary: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  secondaryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryStatText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  patientDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  condition: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  patientFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentInfo: {
    alignItems: 'flex-end',
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
  nextAppointment: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  noAppointment: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
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