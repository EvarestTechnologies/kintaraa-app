/**
 * PRC Form - Section 5: General Physical Examination
 * MOH 363 - PART A
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
} from '@/components/forms/common';
import { PRCGeneralPhysicalExamination, BodyMapInjury } from '@/types/forms';

interface PRCSection5Props {
  physicalExamData: PRCGeneralPhysicalExamination;
  bodyMapInjuries?: BodyMapInjury[];
  onUpdate: (data: Partial<PRCGeneralPhysicalExamination>) => void;
  onBodyMapPress?: () => void;
  errors?: Partial<Record<keyof PRCGeneralPhysicalExamination, string>>;
}

export const PRCSection5_PhysicalExam: React.FC<PRCSection5Props> = ({
  physicalExamData,
  bodyMapInjuries = [],
  onUpdate,
  onBodyMapPress,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="General Condition"
      title="General Physical Examination"
      subtitle="Vital signs and physical injuries"
      required={true}
      defaultExpanded={true}
    >
      {/* General Condition */}
      <FormTextArea
        label="General Condition"
        value={physicalExamData.generalCondition}
        onChangeText={(text) => onUpdate({ generalCondition: text })}
        placeholder="Describe general appearance, consciousness level, distress"
        rows={2}
        helpText="Overall appearance and condition of the survivor"
      />

      {/* Vital Signs */}
      <Text style={styles.subsectionTitle}>Vital Signs</Text>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="BP (Blood Pressure)"
            value={physicalExamData.bloodPressure}
            onChangeText={(text) => onUpdate({ bloodPressure: text })}
            placeholder="e.g., 120/80"
            helpText="Systolic/Diastolic (mmHg)"
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Pulse Rate"
            value={physicalExamData.pulseRate?.toString() || ''}
            onChangeText={(text) => onUpdate({ pulseRate: parseInt(text) || undefined })}
            placeholder="bpm"
            keyboardType="number-pad"
            helpText="Beats per minute"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="RR (Respiratory Rate)"
            value={physicalExamData.respiratoryRate?.toString() || ''}
            onChangeText={(text) => onUpdate({ respiratoryRate: parseInt(text) || undefined })}
            placeholder="breaths/min"
            keyboardType="number-pad"
            helpText="Breaths per minute"
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Temp (Temperature)"
            value={physicalExamData.temperature?.toString() || ''}
            onChangeText={(text) => onUpdate({ temperature: parseFloat(text) || undefined })}
            placeholder="°C"
            keyboardType="decimal-pad"
            helpText="Degrees Celsius"
          />
        </View>
      </View>

      {/* Demeanor / Level of Anxiety */}
      <FormRadioGroup
        label="Demeanor / Level of anxiety"
        options={[
          { label: 'Calm', value: 'calm' },
          { label: 'Not calm', value: 'not_calm' },
        ]}
        value={physicalExamData.demeanorLevelOfAnxiety}
        onValueChange={(value) =>
          onUpdate({ demeanorLevelOfAnxiety: value as 'calm' | 'not_calm' })
        }
        required={true}
        horizontal={true}
      />

      {/* Physical Injuries - Body Map Reference */}
      <View style={styles.bodyMapSection}>
        <Text style={styles.bodyMapTitle}>Physical injuries (mark in the body map)</Text>
        <Text style={styles.bodyMapSubtitle}>
          Use the interactive body map below to mark injury locations
        </Text>

        {/* Body Map Button */}
        <View style={styles.bodyMapButtonContainer}>
          <Text
            style={styles.bodyMapButton}
            onPress={onBodyMapPress}
          >
            📍 Open Interactive Body Map ({bodyMapInjuries.length} injuries marked)
          </Text>
        </View>

        {/* Injury Summary */}
        {bodyMapInjuries.length > 0 && (
          <View style={styles.injurySummary}>
            <Text style={styles.injurySummaryTitle}>Marked Injuries:</Text>
            {bodyMapInjuries.map((injury, index) => (
              <Text key={injury.id} style={styles.injuryItem}>
                {index + 1}. {injury.type.toUpperCase()} - {injury.location} ({injury.view})
              </Text>
            ))}
          </View>
        )}
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginTop: 8,
    marginBottom: 12,
  },
  bodyMapSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bodyMapTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  bodyMapSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  bodyMapButtonContainer: {
    marginVertical: 12,
  },
  bodyMapButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#6A2CB0',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 8,
  },
  injurySummary: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  injurySummaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  injuryItem: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
    paddingLeft: 8,
  },
});
