import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MapPin, 
  Calendar,
  AlertTriangle,
  User,
  Heart,
  Activity
} from 'lucide-react-native';
import { CHWPatient } from '../index';

interface PatientsListProps {
  patients: CHWPatient[];
  onPatientSelect: (patient: CHWPatient) => void;
  onAddPatient: () => void;
}

const PatientsList: React.FC<PatientsListProps> = ({ patients, onPatientSelect, onAddPatient }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Patients', count: patients.length },
    { key: 'active', label: 'Active', count: patients.filter(p => p.status === 'active').length },
    { key: 'high_priority', label: 'High Priority', count: patients.filter(p => p.priority === 'high' || p.priority === 'urgent').length },
    { key: 'follow_up', label: 'Follow-up Due', count: patients.filter(p => p.nextAppointment && new Date(p.nextAppointment) <= new Date()).length },
    { key: 'chronic', label: 'Chronic Conditions', count: patients.filter(p => p.healthConditions.length > 0).length },
  ];

  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.healthConditions.some(condition => condition.toLowerCase().includes(query)) ||
        patient.address.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(p => p.status === 'active');
        break;
      case 'high_priority':
        filtered = filtered.filter(p => p.priority === 'high' || p.priority === 'urgent');
        break;
      case 'follow_up':
        filtered = filtered.filter(p => p.nextAppointment && new Date(p.nextAppointment) <= new Date());
        break;
      case 'chronic':
        filtered = filtered.filter(p => p.healthConditions.length > 0);
        break;
    }

    // Sort by priority and last visit
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    });
  }, [patients, searchQuery, selectedFilter]);

  const getPriorityColor = (priority: CHWPatient['priority']) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#65A30D';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: CHWPatient['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'referred': return '#3B82F6';
      case 'completed': return '#8B5CF6';
      case 'lost_to_followup': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderPatientCard = (patient: CHWPatient) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.patientCard}
      onPress={() => onPatientSelect(patient)}
      activeOpacity={0.7}
    >
      <View style={styles.patientHeader}>
        <View style={styles.patientInfo}>
          <View style={styles.patientNameRow}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(patient.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(patient.priority) }]}>
                {patient.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientAge}>{patient.age} years • {patient.gender}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(patient.status) }]}>
                {patient.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.patientContent}>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Phone size={14} color="#64748B" />
            <Text style={styles.contactText}>{patient.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.contactText} numberOfLines={1}>{patient.address}</Text>
          </View>
        </View>

        {patient.healthConditions.length > 0 && (
          <View style={styles.conditionsContainer}>
            <Heart size={14} color="#EF4444" />
            <Text style={styles.conditionsText} numberOfLines={2}>
              {patient.healthConditions.join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.patientFooter}>
          <View style={styles.lastVisit}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.lastVisitText}>Last visit: {formatDate(patient.lastVisit)}</Text>
          </View>
          {patient.nextAppointment && (
            <View style={styles.nextAppointment}>
              <Activity size={14} color="#3B82F6" />
              <Text style={styles.nextAppointmentText}>
                Next: {new Date(patient.nextAppointment).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {patient.riskFactors.length > 0 && (
          <View style={styles.riskFactors}>
            <AlertTriangle size={14} color="#F59E0B" />
            <Text style={styles.riskText} numberOfLines={1}>
              Risk factors: {patient.riskFactors.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = (filter: typeof filterOptions[0]) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterChip,
        selectedFilter === filter.key && styles.filterChipActive
      ]}
      onPress={() => setSelectedFilter(filter.key)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === filter.key && styles.filterChipTextActive
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Patients</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPatient}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patients..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#FFFFFF" : "#64748B"} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filterOptions.map(renderFilterChip)}
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.patientsList} showsVerticalScrollIndicator={false}>
        {filteredPatients.length > 0 ? (
          <View style={styles.patientsContainer}>
            {filteredPatients.map(renderPatientCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <User size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    backgroundColor: '#F1F5F9',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filtersContainer: {
    marginTop: 8,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  patientsList: {
    flex: 1,
  },
  patientsContainer: {
    padding: 16,
    gap: 12,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
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
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  patientDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientAge: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  patientContent: {
    gap: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  conditionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
  },
  conditionsText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  patientFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastVisit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastVisitText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  nextAppointment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextAppointmentText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
  },
  riskFactors: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    color: '#D97706',
    marginLeft: 8,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default PatientsList;