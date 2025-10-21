/**
 * P3 Form - Section 3: Injury Documentation & Body Map
 * Kenya Police Medical Examination Form
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
} from '@/components/forms/common';
import { BodyMapPicker } from '@/components/forms/common/BodyMapPicker';
import { P3InjurySection, P3InjuryDocumentation } from '@/types/forms';

interface P3Section3Props {
  injuryData: P3InjurySection;
  onUpdate: (data: Partial<P3InjurySection>) => void;
  errors?: Partial<Record<keyof P3InjurySection, string>>;
}

export const P3Section3_InjuryDocumentation: React.FC<P3Section3Props> = ({
  injuryData,
  onUpdate,
  errors = {},
}) => {
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [editingInjuryIndex, setEditingInjuryIndex] = useState<number | null>(null);

  const handleAddInjury = () => {
    const newInjury: P3InjuryDocumentation = {
      id: Date.now().toString(),
      injuryType: 'bruise',
      bodyLocation: '',
      severity: 'minor',
      description: '',
      photographTaken: false,
    };

    onUpdate({
      injuryDocumentation: [...injuryData.injuryDocumentation, newInjury],
    });
    setEditingInjuryIndex(injuryData.injuryDocumentation.length);
  };

  const handleUpdateInjury = (index: number, updates: Partial<P3InjuryDocumentation>) => {
    const updatedInjuries = [...injuryData.injuryDocumentation];
    updatedInjuries[index] = { ...updatedInjuries[index], ...updates };
    onUpdate({ injuryDocumentation: updatedInjuries });
  };

  const handleRemoveInjury = (index: number) => {
    const updatedInjuries = injuryData.injuryDocumentation.filter((_, i) => i !== index);
    onUpdate({ injuryDocumentation: updatedInjuries });
    if (editingInjuryIndex === index) {
      setEditingInjuryIndex(null);
    }
  };

  return (
    <FormSection
      sectionNumber="Section 3"
      title="INJURY DOCUMENTATION & BODY MAP"
      subtitle="Document all visible injuries and mark on body map"
      required={true}
      defaultExpanded={true}
    >
      {/* Body Map Integration */}
      <View style={styles.bodyMapSection}>
        <TouchableOpacity
          style={styles.bodyMapButton}
          onPress={() => setShowBodyMap(!showBodyMap)}
        >
          <Text style={styles.bodyMapButtonText}>
            {showBodyMap ? '📍 Hide Body Map' : '📍 Show Body Map'}
          </Text>
          <Text style={styles.bodyMapButtonSubtext}>
            {injuryData.bodyMapInjuries.length} injuries marked
          </Text>
        </TouchableOpacity>

        {showBodyMap && (
          <BodyMapPicker
            injuries={injuryData.bodyMapInjuries}
            onInjuriesChange={(injuries) => onUpdate({ bodyMapInjuries: injuries })}
          />
        )}
      </View>

      {/* Photographs Section */}
      <FormRadioGroup
        label="Were photographs taken of injuries?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={injuryData.photographsTaken ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ photographsTaken: value === 'yes' })}
        required={true}
        horizontal={true}
        helpText="Document whether forensic photographs were taken"
      />

      {injuryData.photographsTaken && (
        <View>
          <FormTextField
            label="Number of photographs"
            value={injuryData.numberOfPhotographs?.toString() || ''}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              if (!isNaN(num) || text === '') {
                onUpdate({ numberOfPhotographs: isNaN(num) ? 0 : num });
              }
            }}
            keyboardType="numeric"
            placeholder="Total number of photographs taken"
            required={true}
          />

          <FormTextField
            label="Photograph references"
            value={injuryData.photographReferences?.join(', ') || ''}
            onChangeText={(text) => {
              const refs = text.split(',').map((s) => s.trim()).filter(Boolean);
              onUpdate({ photographReferences: refs });
            }}
            placeholder="Photo reference numbers (comma-separated)"
            helpText="e.g., IMG001, IMG002, IMG003"
          />
        </View>
      )}

      {/* Injury Documentation List */}
      <View style={styles.injuryListSection}>
        <Text style={styles.injuryListTitle}>Detailed Injury Documentation</Text>
        <Text style={styles.injuryListSubtitle}>
          Document each injury with specific details
        </Text>

        {/* Add Injury Button */}
        <TouchableOpacity style={styles.addInjuryButton} onPress={handleAddInjury}>
          <Text style={styles.addInjuryButtonText}>+ Add New Injury</Text>
        </TouchableOpacity>

        {/* Injury List */}
        {injuryData.injuryDocumentation.map((injury, index) => (
          <View key={injury.id} style={styles.injuryCard}>
            <View style={styles.injuryCardHeader}>
              <Text style={styles.injuryCardTitle}>Injury {index + 1}</Text>
              <TouchableOpacity
                style={styles.removeInjuryButton}
                onPress={() => handleRemoveInjury(index)}
              >
                <Text style={styles.removeInjuryButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {/* Injury Type */}
            <FormRadioGroup
              label="Injury type"
              options={[
                { label: 'Bruise', value: 'bruise' },
                { label: 'Laceration', value: 'laceration' },
                { label: 'Abrasion', value: 'abrasion' },
                { label: 'Bite mark', value: 'bite_mark' },
                { label: 'Burn', value: 'burn' },
                { label: 'Fracture', value: 'fracture' },
                { label: 'Other', value: 'other' },
              ]}
              value={injury.injuryType}
              onValueChange={(value) => handleUpdateInjury(index, { injuryType: value as any })}
              required={true}
              horizontal={false}
            />

            {/* Body Location */}
            <FormTextField
              label="Body location"
              value={injury.bodyLocation}
              onChangeText={(text) => handleUpdateInjury(index, { bodyLocation: text })}
              placeholder="e.g., Left forearm, Right cheek, Lower back"
              required={true}
              helpText="Be specific about anatomical location"
            />

            {/* Severity */}
            <FormRadioGroup
              label="Severity"
              options={[
                { label: 'Minor', value: 'minor' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Severe', value: 'severe' },
              ]}
              value={injury.severity}
              onValueChange={(value) => handleUpdateInjury(index, { severity: value as any })}
              required={true}
              horizontal={true}
            />

            {/* Description */}
            <FormTextArea
              label="Detailed description"
              value={injury.description}
              onChangeText={(text) => handleUpdateInjury(index, { description: text })}
              placeholder="Detailed description of the injury including color, shape, pattern, and any distinctive features"
              rows={3}
              required={true}
              helpText="Include all relevant clinical details"
            />

            {/* Measurements */}
            <FormTextField
              label="Measurements (optional)"
              value={injury.measurements || ''}
              onChangeText={(text) => handleUpdateInjury(index, { measurements: text })}
              placeholder="e.g., 3cm x 2cm, 5cm diameter"
              helpText="Length, width, diameter, or circumference"
            />

            {/* Color (for bruises) */}
            {injury.injuryType === 'bruise' && (
              <FormTextField
                label="Color"
                value={injury.color || ''}
                onChangeText={(text) => handleUpdateInjury(index, { color: text })}
                placeholder="e.g., Purple, Yellow, Blue-black"
                helpText="Color helps estimate age of bruise"
              />
            )}

            {/* Age of Injury */}
            <FormTextField
              label="Estimated age of injury"
              value={injury.age || ''}
              onChangeText={(text) => handleUpdateInjury(index, { age: text })}
              placeholder="e.g., Fresh, 1-2 days old, Healing, Old"
              helpText="Clinical estimate based on appearance"
            />

            {/* Photograph Reference */}
            <FormRadioGroup
              label="Photograph taken of this injury?"
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
              value={injury.photographTaken ? 'yes' : 'no'}
              onValueChange={(value) =>
                handleUpdateInjury(index, { photographTaken: value === 'yes' })
              }
              horizontal={true}
            />

            {injury.photographTaken && (
              <FormTextField
                label="Photograph reference number"
                value={injury.photographReference || ''}
                onChangeText={(text) => handleUpdateInjury(index, { photographReference: text })}
                placeholder="e.g., IMG001"
                helpText="Reference number for forensic photograph"
              />
            )}
          </View>
        ))}

        {injuryData.injuryDocumentation.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No injuries documented yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap "Add New Injury" to begin</Text>
          </View>
        )}
      </View>

      {/* Overall Assessment */}
      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentTitle}>Overall Injury Assessment</Text>

        <FormTextArea
          label="Overall assessment"
          value={injuryData.overallInjuryAssessment}
          onChangeText={(text) => onUpdate({ overallInjuryAssessment: text })}
          placeholder="Summary of all injuries observed, pattern analysis, and clinical significance"
          rows={4}
          required={true}
          error={errors.overallInjuryAssessment}
          helpText="Provide comprehensive summary of injury findings"
        />

        <FormRadioGroup
          label="Are injuries consistent with survivor's allegations?"
          options={[
            { label: 'Yes - Consistent', value: 'yes' },
            { label: 'No - Not consistent', value: 'no' },
            { label: 'Unable to determine', value: 'unable' },
          ]}
          value={
            injuryData.consistentWithAllegations
              ? 'yes'
              : injuryData.consistentWithAllegations === false
              ? 'no'
              : 'unable'
          }
          onValueChange={(value) =>
            onUpdate({
              consistentWithAllegations: value === 'yes' ? true : value === 'no' ? false : null,
            })
          }
          required={true}
          horizontal={false}
          helpText="Clinical opinion on consistency with reported incident"
        />

        <FormTextArea
          label="Assessment notes"
          value={injuryData.assessmentNotes || ''}
          onChangeText={(text) => onUpdate({ assessmentNotes: text })}
          placeholder="Additional notes, limitations of examination, need for follow-up, or other relevant observations"
          rows={3}
          helpText="Include any important contextual information"
        />
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  bodyMapSection: {
    marginBottom: 16,
  },
  bodyMapButton: {
    padding: 16,
    backgroundColor: '#6A2CB0',
    borderRadius: 8,
    alignItems: 'center',
  },
  bodyMapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bodyMapButtonSubtext: {
    fontSize: 12,
    color: '#E1BEE7',
  },
  injuryListSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  injuryListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  injuryListSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  addInjuryButton: {
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 16,
  },
  addInjuryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  injuryCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  injuryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  injuryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A2CB0',
  },
  removeInjuryButton: {
    padding: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
  },
  removeInjuryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  assessmentSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
});
