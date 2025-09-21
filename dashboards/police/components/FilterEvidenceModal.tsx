import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Filter,
  Camera,
  Video,
  Mic,
  FileText,
  Eye,
  Shield,
  Calendar,
  RefreshCw,
  Check,
  User,
  Lock,
  AlertTriangle,
  Clock,
} from 'lucide-react-native';
import type { Evidence } from '../index';

export interface EvidenceFilters {
  type: string[];
  status: string[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  caseNumber: string;
  collectedBy: string;
  location: string;
  tags: string;
  confidentialOnly: boolean;
  hasForensicResults: boolean;
}

interface FilterEvidenceModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: EvidenceFilters) => void;
  currentFilters: EvidenceFilters;
  evidence: Evidence[];
}

const evidenceTypeOptions = [
  { label: 'Physical Evidence', value: 'physical', icon: Eye, color: '#DC2626' },
  { label: 'Photo Evidence', value: 'photo', icon: Camera, color: '#3B82F6' },
  { label: 'Video Evidence', value: 'video', icon: Video, color: '#8B5CF6' },
  { label: 'Audio Evidence', value: 'audio', icon: Mic, color: '#F59E0B' },
  { label: 'Digital Evidence', value: 'digital', icon: Shield, color: '#6366F1' },
  { label: 'Document Evidence', value: 'document', icon: FileText, color: '#10B981' },
  { label: 'Forensic Evidence', value: 'forensic', icon: Shield, color: '#059669' },
];

const statusOptions = [
  { label: 'Collected', value: 'collected', color: '#F59E0B', icon: User },
  { label: 'Analyzed', value: 'analyzed', color: '#3B82F6', icon: Eye },
  { label: 'Stored', value: 'stored', color: '#10B981', icon: Shield },
  { label: 'Released', value: 'released', color: '#6B7280', icon: AlertTriangle },
  { label: 'Destroyed', value: 'destroyed', color: '#DC2626', icon: X },
];

export default function FilterEvidenceModal({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
  evidence
}: FilterEvidenceModalProps) {
  const [filters, setFilters] = useState<EvidenceFilters>(currentFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Get unique values from evidence for dynamic filter options
  const uniqueCaseNumbers = Array.from(
    new Set(evidence.map(e => e.caseNumber).filter(Boolean))
  ).sort();

  const uniqueOfficers = Array.from(
    new Set(evidence.map(e => e.collectedBy).filter(Boolean))
  ).sort();

  const uniqueLocations = Array.from(
    new Set(evidence.map(e => e.location).filter(Boolean))
  ).sort();

  const allTags = Array.from(
    new Set(evidence.flatMap(e => e.tags).filter(Boolean))
  ).sort();

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, visible]);

  const toggleArrayFilter = (category: keyof Pick<EvidenceFilters, 'type' | 'status'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const updateTextFilter = (field: keyof Pick<EvidenceFilters, 'caseNumber' | 'collectedBy' | 'location' | 'tags'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBooleanFilter = (field: keyof Pick<EvidenceFilters, 'confidentialOnly' | 'hasForensicResults'>, value: boolean) => {
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
      type: [],
      status: [],
      dateRange: { startDate: null, endDate: null },
      caseNumber: '',
      collectedBy: '',
      location: '',
      tags: '',
      confidentialOnly: false,
      hasForensicResults: false,
    });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    count += filters.type.length;
    count += filters.status.length;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count += 1;
    if (filters.caseNumber) count += 1;
    if (filters.collectedBy) count += 1;
    if (filters.location) count += 1;
    if (filters.tags) count += 1;
    if (filters.confidentialOnly) count += 1;
    if (filters.hasForensicResults) count += 1;
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
              <Icon color={isSelected ? '#FFFFFF' : option.color} size={16} />
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
            {suggestions.slice(0, 6).map((suggestion, index) => (
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

  const renderBooleanFilter = (
    title: string,
    value: boolean,
    onChange: (value: boolean) => void,
    description: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.filterSection}>
      <View style={styles.booleanFilterContainer}>
        <View style={styles.booleanFilterInfo}>
          <View style={styles.booleanFilterHeader}>
            {icon}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Text style={styles.booleanFilterDescription}>{description}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
          thumbColor={value ? '#8B5CF6' : '#9CA3AF'}
        />
      </View>
    </View>
  );

  const renderDateFilter = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <Calendar color="#8B5CF6" size={20} />
        <Text style={styles.sectionTitle}>Collection Date Range</Text>
      </View>
      <View style={styles.dateRangeContainer}>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateLabel}>From:</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => Platform.OS === 'ios' && setShowStartDatePicker(true)}
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
            onPress={() => Platform.OS === 'ios' && setShowEndDatePicker(true)}
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
          onPress={() => {
            updateDateRange('startDate', null);
            updateDateRange('endDate', null);
          }}
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
          <Text style={styles.headerTitle}>Filter Evidence</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
            <RefreshCw color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Evidence Type Filter */}
          {renderMultiSelect(
            'Evidence Type',
            evidenceTypeOptions,
            filters.type,
            (value) => toggleArrayFilter('type', value),
            <FileText color="#8B5CF6" size={20} />
          )}

          {/* Status Filter */}
          {renderMultiSelect(
            'Evidence Status',
            statusOptions,
            filters.status,
            (value) => toggleArrayFilter('status', value),
            <Clock color="#F59E0B" size={20} />
          )}

          {/* Date Range Filter */}
          {renderDateFilter()}

          {/* Case Number Filter */}
          {renderTextFilter(
            'Case Number',
            filters.caseNumber,
            (text) => updateTextFilter('caseNumber', text),
            'Filter by case number (e.g., DV-2025-001)',
            uniqueCaseNumbers
          )}

          {/* Collected By Filter */}
          {renderTextFilter(
            'Collected By',
            filters.collectedBy,
            (text) => updateTextFilter('collectedBy', text),
            'Filter by collecting officer',
            uniqueOfficers
          )}

          {/* Location Filter */}
          {renderTextFilter(
            'Collection Location',
            filters.location,
            (text) => updateTextFilter('location', text),
            'Filter by collection location',
            uniqueLocations
          )}

          {/* Tags Filter */}
          {renderTextFilter(
            'Tags',
            filters.tags,
            (text) => updateTextFilter('tags', text),
            'Filter by tags (e.g., weapon, DNA)',
            allTags
          )}

          {/* Boolean Filters */}
          {renderBooleanFilter(
            'Confidential Only',
            filters.confidentialOnly,
            (value) => updateBooleanFilter('confidentialOnly', value),
            'Show only confidential evidence items',
            <Lock color="#EF4444" size={20} />
          )}

          {renderBooleanFilter(
            'Has Forensic Results',
            filters.hasForensicResults,
            (value) => updateBooleanFilter('hasForensicResults', value),
            'Show only evidence with forensic analysis results',
            <Shield color="#059669" size={20} />
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

        {/* Date Pickers - iOS only */}
        {showStartDatePicker && Platform.OS === 'ios' && (
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

        {showEndDatePicker && Platform.OS === 'ios' && (
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
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
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
  booleanFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  booleanFilterInfo: {
    flex: 1,
    marginRight: 16,
  },
  booleanFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  booleanFilterDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
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
    backgroundColor: '#8B5CF6',
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