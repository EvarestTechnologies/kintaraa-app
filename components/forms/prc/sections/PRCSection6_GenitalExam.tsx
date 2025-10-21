/**
 * PRC Form - Section 6: Genital Examination of the Survivor
 * MOH 363 - PART A
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextArea,
} from '@/components/forms/common';
import { PRCGenitalExamination, BodyMapInjury } from '@/types/forms';

interface PRCSection6Props {
  genitalExamData: PRCGenitalExamination;
  onUpdate: (data: Partial<PRCGenitalExamination>) => void;
  onBodyMapPress?: () => void;
  errors?: Partial<Record<keyof PRCGenitalExamination, string>>;
}

export const PRCSection6_GenitalExam: React.FC<PRCSection6Props> = ({
  genitalExamData,
  onUpdate,
  onBodyMapPress,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 6"
      title="GENITAL EXAMINATION OF THE SURVIVOR"
      subtitle="Indicate discharges, inflammation, bleeding"
      required={true}
      defaultExpanded={true}
    >
      {/* Overall Physical Status Description */}
      <FormTextArea
        label="Describe in detail the physical status"
        value={genitalExamData.physicalStatusDescription}
        onChangeText={(text) => onUpdate({ physicalStatusDescription: text })}
        placeholder="Overall genital examination findings"
        rows={3}
        required={true}
        error={errors.physicalStatusDescription}
        helpText="General appearance, any visible abnormalities"
      />

      {/* Physical Injuries (Body Map Reference) */}
      <View style={styles.bodyMapReference}>
        <Text style={styles.bodyMapReferenceTitle}>
          Physical injuries (mark in the body map)
        </Text>
        <Text style={styles.bodyMapReferenceSubtitle}>
          {genitalExamData.physicalInjuries.length} injuries marked on body map
        </Text>
        {genitalExamData.physicalInjuries.length > 0 && (
          <View style={styles.injurySummary}>
            {genitalExamData.physicalInjuries.map((injury, index) => (
              <Text key={injury.id} style={styles.injuryItem}>
                • {injury.type.toUpperCase()} - {injury.location}
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.bodyMapNote}>
          Body map injuries from Section 5 are automatically included here
        </Text>
      </View>

      {/* Outer Genitalia */}
      <FormTextArea
        label="Outer genitalia"
        value={genitalExamData.outerGenitalia}
        onChangeText={(text) => onUpdate({ outerGenitalia: text })}
        placeholder="Examine labia, clitoris, urethral opening. Note any swelling, bruising, lacerations, or discharge"
        rows={3}
        required={true}
        error={errors.outerGenitalia}
        helpText="Labia, clitoris, urethral opening findings"
      />

      {/* Vagina */}
      <FormTextArea
        label="Vagina"
        value={genitalExamData.vagina}
        onChangeText={(text) => onUpdate({ vagina: text })}
        placeholder="Examine vaginal walls. Note any tears, inflammation, discharge, or foreign bodies"
        rows={3}
        required={true}
        error={errors.vagina}
        helpText="Vaginal wall findings, tears, inflammation"
      />

      {/* Hymen */}
      <FormTextArea
        label="Hymen"
        value={genitalExamData.hymen}
        onChangeText={(text) => onUpdate({ hymen: text })}
        placeholder="Examine hymen. Note if intact, torn, or remnants present"
        rows={2}
        required={true}
        error={errors.hymen}
        helpText="Hymen status: intact/torn/remnants"
      />

      {/* Anus */}
      <FormTextArea
        label="Anus"
        value={genitalExamData.anus}
        onChangeText={(text) => onUpdate({ anus: text })}
        placeholder="Examine anal area. Note any tears, bleeding, or signs of trauma"
        rows={3}
        required={true}
        error={errors.anus}
        helpText="Anal examination findings"
      />

      {/* Other Significant Orifices */}
      <FormTextArea
        label="Other significant orifices"
        value={genitalExamData.otherSignificantOrifices}
        onChangeText={(text) => onUpdate({ otherSignificantOrifices: text })}
        placeholder="Examine mouth, ears, or other relevant areas"
        rows={2}
        helpText="Oral cavity, ears, or other relevant findings"
      />

      {/* Female/Male Genitalia Diagrams Note */}
      <View style={styles.diagramNote}>
        <Text style={styles.diagramNoteTitle}>📋 Clinical Documentation</Text>
        <Text style={styles.diagramNoteText}>
          The PDF form includes female and male genitalia diagrams. In this digital version,
          findings are documented in text form above. For visual documentation, use the body
          map feature or attach clinical photographs as evidence.
        </Text>
      </View>

      {/* Comments */}
      <FormTextArea
        label="Comments"
        value={genitalExamData.comments}
        onChangeText={(text) => onUpdate({ comments: text })}
        placeholder="Additional observations, differential diagnoses, or clinical impressions"
        rows={3}
        helpText="Additional clinical notes or observations"
      />
    </FormSection>
  );
};

const styles = StyleSheet.create({
  bodyMapReference: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bodyMapReferenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  bodyMapReferenceSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  injurySummary: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  injuryItem: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  bodyMapNote: {
    fontSize: 11,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 8,
  },
  diagramNote: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  diagramNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 6,
  },
  diagramNoteText: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 18,
  },
});
