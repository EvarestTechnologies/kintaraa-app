/**
 * P3 Form - Section A: Relevant Medical History
 * Page 3 of Official Kenya Police Medical Examination Report
 *
 * Includes general medical history and sexual offence-specific history
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextArea,
  FormRadioGroup,
  FormTextField,
} from '@/components/forms/common';
import { P3MedicalHistory } from '@/types/forms/P3Form_Official';

interface P3SectionAMedicalHistoryProps {
  medicalHistory: P3MedicalHistory;
  onUpdate: (data: Partial<P3MedicalHistory>) => void;
  errors?: Partial<Record<keyof P3MedicalHistory, string>>;
}

export const P3SectionA_MedicalHistory: React.FC<P3SectionAMedicalHistoryProps> = ({
  medicalHistory,
  onUpdate,
  errors = {},
}) => {
  const handleSexualOffenceHistoryUpdate = (
    updates: Partial<typeof medicalHistory.sexualOffenceHistory>
  ) => {
    onUpdate({
      sexualOffenceHistory: {
        ...medicalHistory.sexualOffenceHistory,
        ...updates,
      },
    });
  };

  return (
    <View style={styles.container}>
      <FormSection
        title="SECTION A: RELEVANT MEDICAL HISTORY"
        subtitle="Take note of any notable disabilities/impairments; document relevant medical history"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Relevant Medical History"
          value={medicalHistory.relevantMedicalHistory}
          onChangeText={(text) => onUpdate({ relevantMedicalHistory: text })}
          placeholder="Document any relevant medical history, disabilities, impairments, medications, allergies, previous surgeries, chronic conditions"
          rows={6}
          required={true}
          error={errors.relevantMedicalHistory}
          helpText="Include all relevant medical information"
        />
      </FormSection>

      <FormSection
        title="ADDITIONAL MEDICAL HISTORY RELEVANT TO SEXUAL OFFENCES"
        subtitle="Since the alleged offence took place has the patient:"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.checklistSection}>
          <FormRadioGroup
            label="CHANGED CLOTHES"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.changedClothes ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ changedClothes: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="CONDOM USED"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
              { label: 'UNKNOWN', value: 'unknown' },
            ]}
            value={medicalHistory.sexualOffenceHistory.condomUsed}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ condomUsed: value as any })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="BATHED/WASHED/SHOWERED"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.bathedWashedShowered ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ bathedWashedShowered: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="URINATED"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.urinated ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ urinated: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="DEFECATED"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.defecated ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ defecated: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="WIPED"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.wiped ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ wiped: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="CURRENTLY PREGNANT"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
              { label: 'UNKNOWN', value: 'unknown' },
            ]}
            value={medicalHistory.sexualOffenceHistory.currentlyPregnant}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ currentlyPregnant: value as any })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="CURRENTLY MENSTRUATING"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={medicalHistory.sexualOffenceHistory.currentlyMenstruating ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleSexualOffenceHistoryUpdate({ currentlyMenstruating: value === 'yes' })
            }
            horizontal={true}
            required={true}
          />

          <FormTextArea
            label="Notes"
            value={medicalHistory.sexualOffenceHistory.notes || ''}
            onChangeText={(text) => handleSexualOffenceHistoryUpdate({ notes: text })}
            placeholder="Any additional notes about the above history"
            rows={2}
            helpText="Document any relevant details"
          />
        </View>
      </FormSection>

      <FormSection
        title="History given by:"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.historyGivenByBox}>
          <FormTextField
            label="Name"
            value={medicalHistory.historyGivenBy.name}
            onChangeText={(text) =>
              onUpdate({
                historyGivenBy: {
                  ...medicalHistory.historyGivenBy,
                  name: text,
                },
              })
            }
            placeholder="Name of person giving history"
            required={true}
          />

          <FormTextField
            label="Relationship"
            value={medicalHistory.historyGivenBy.relationship}
            onChangeText={(text) =>
              onUpdate({
                historyGivenBy: {
                  ...medicalHistory.historyGivenBy,
                  relationship: text,
                },
              })
            }
            placeholder="e.g., Patient, Guardian, Parent"
            required={true}
          />

          <FormTextField
            label="Signature"
            value={medicalHistory.historyGivenBy.signature || ''}
            onChangeText={(text) =>
              onUpdate({
                historyGivenBy: {
                  ...medicalHistory.historyGivenBy,
                  signature: text,
                },
              })
            }
            placeholder="Digital signature or 'SIGNED'"
            helpText="Enter 'SIGNED' or initials"
          />
        </View>
      </FormSection>

      {/* Page Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageNumber}>Page 3 of 11</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  checklistSection: {
    padding: 12,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  historyGivenByBox: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  pageFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pageNumber: {
    fontSize: 11,
    color: '#757575',
  },
});
