import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Filter,
  Calendar,
  RefreshCw,
  Check,
  Shield,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react-native';
import type { PoliceCase } from '../index';

export interface CaseFilters {
  status: string[];
  incidentType: string[];
  priority: string[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  assignedDetective: string;
  reportingOfficer: string;
  location: string;
}

interface FilterCasesModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CaseFilters) => void;
  currentFilters: CaseFilters;
  cases: PoliceCase[];
}

const statusOptions = [
  { label: 'Open', value: 'open', color: '#F59E0B', icon: AlertTriangle },
  { label: 'Under Investigation', value: 'under_investigation', color: '#3B82F6', icon: Shield },
  { label: 'Closed', value: 'closed', color: '#10B981', icon: Check },
  { label: 'Cold Case', value: 'cold_case', color: '#6B7280', icon: Clock },
  { label: 'Referred', value: 'referred', color: '#8B5CF6', icon: User },
];

const incidentTypeOptions = [
  { label: 'Domestic Violence', value: 'domestic_violence', icon: '🏠' },
  { label: 'Sexual Assault', value: 'sexual_assault', icon: '⚠️' },
  { label: 'Harassment', value: 'harassment', icon: '📢' },
  { label: 'Theft', value: 'theft', icon: '💰' },
  { label: 'Assault', value: 'assault', icon: '✊' },
  { label: 'Fraud', value: 'fraud', icon: '💳' },
  { label: 'Other', value: 'other', icon: '📝' },
];

const priorityOptions = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Urgent', value: 'urgent', color: '#DC2626' },
];

export default function FilterCasesModal({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
  cases
}: FilterCasesModalProps) {
  const [filters, setFilters] = useState<CaseFilters>(currentFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Get unique values from cases for dynamic filter options
  const uniqueDetectives = Array.from(
    new Set(cases.map(c => c.assignedDetective).filter(Boolean))
  ).sort();

  const uniqueOfficers = Array.from(
    new Set(cases.map(c => c.reportingOfficer).filter(Boolean))
  ).sort();

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, visible]);

  const toggleArrayFilter = (category: keyof Pick<CaseFilters, 'status' | 'incidentType' | 'priority'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const updateTextFilter = (field: keyof Pick<CaseFilters, 'assignedDetective' | 'reportingOfficer' | 'location'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDateRange = (type: 'startDate' | 'endDate', date: string | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: date
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      incidentType: [],
      priority: [],
      dateRange: { startDate: null, endDate: null },
      assignedDetective: '',
      reportingOfficer: '',
      location: '',
    });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    count += filters.status.length;
    count += filters.incidentType.length;
    count += filters.priority.length;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count += 1;
    if (filters.assignedDetective) count += 1;
    if (filters.reportingOfficer) count += 1;
    if (filters.location) count += 1;
    return count;
  };

  const renderMultiSelect = (
    title: string,
    options: any[],
    selectedValues: string[],
    onToggle: (value: string) => void,
    icon: React.ReactNode
  ) => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const Icon = option.icon;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionChip, isSelected && styles.optionChipSelected]}
              onPress={() => onToggle(option.value)}
            >
              {typeof option.icon === 'string' ? (
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              ) : (
                Icon && <Icon color={isSelected ? '#FFFFFF' : option.color || '#64748B'} size={16} />
              )}
              <Text style={[
                styles.optionText,
                isSelected && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
              {isSelected && <Check color="#FFFFFF" size={16} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderTextFilter = (
    title: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    suggestions: string[] = []
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
      {suggestions.length > 0 && value === '' && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>Suggestions:</Text>
          <View style={styles.suggestionsList}>
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => onChangeText(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderDateFilter = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <Calendar color="#8B5CF6" size={20} />
        <Text style={styles.sectionTitle}>Date Range</Text>
      </View>
      <View style={styles.dateRangeContainer}>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateLabel}>From:</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={[styles.dateText, !filters.dateRange.startDate && styles.datePlaceholder]}>
              {filters.dateRange.startDate
                ? new Date(filters.dateRange.startDate).toLocaleDateString()
                : 'Select start date'
              }
            </Text>
            <Calendar color="#6B7280" size={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateInputContainer}>
          <Text style={styles.dateLabel}>To:</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={[styles.dateText, !filters.dateRange.endDate && styles.datePlaceholder]}>
              {filters.dateRange.endDate
                ? new Date(filters.dateRange.endDate).toLocaleDateString()
                : 'Select end date'
              }
            </Text>
            <Calendar color="#6B7280" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {(filters.dateRange.startDate || filters.dateRange.endDate) && (
        <TouchableOpacity
          style={styles.clearDateButton}
          onPress={() => updateDateRange('startDate', null) || updateDateRange('endDate', null)}
        >
          <X color="#EF4444" size={16} />
          <Text style={styles.clearDateText}>Clear date range</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filter Cases</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
            <RefreshCw color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Filter */}
          {renderMultiSelect(
            'Case Status',
            statusOptions,
            filters.status,
            (value) => toggleArrayFilter('status', value),
            <Shield color="#1E40AF" size={20} />
          )}

          {/* Incident Type Filter */}
          {renderMultiSelect(
            'Incident Type',
            incidentTypeOptions,
            filters.incidentType,
            (value) => toggleArrayFilter('incidentType', value),
            <AlertTriangle color="#EF4444" size={20} />
          )}

          {/* Priority Filter */}
          {renderMultiSelect(
            'Priority Level',
            priorityOptions,
            filters.priority,
            (value) => toggleArrayFilter('priority', value),
            <Clock color="#F59E0B" size={20} />
          )}

          {/* Date Range Filter */}
          {renderDateFilter()}

          {/* Officer Filters */}
          {renderTextFilter(
            'Assigned Detective',
            filters.assignedDetective,
            (text) => updateTextFilter('assignedDetective', text),
            'Filter by detective name',
            uniqueDetectives
          )}

          {renderTextFilter(
            'Reporting Officer',
            filters.reportingOfficer,
            (text) => updateTextFilter('reportingOfficer', text),
            'Filter by reporting officer',
            uniqueOfficers
          )}

          {renderTextFilter(
            'Location',
            filters.location,
            (text) => updateTextFilter('location', text),
            'Filter by location (e.g., Downtown, Campus)'
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.filtersSummary}>
            <Text style={styles.filtersCount}>
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
            </Text>
          </View>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              onApplyFilters(filters);
              onClose();
            }}
          >
            <Filter color="#FFFFFF" size={20} />
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                updateDateRange('startDate', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                updateDateRange('endDate', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  optionChipSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 12,
    color: '#475569',
  },
  dateRangeContainer: {
    gap: 12,
  },
  dateInputContainer: {
    gap: 6,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 14,
    color: '#1E293B',
  },
  datePlaceholder: {
    color: '#9CA3AF',
  },
  clearDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  clearDateText: {
    fontSize: 12,
    color: '#EF4444',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  filtersSummary: {
    marginBottom: 12,
  },
  filtersCount: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});