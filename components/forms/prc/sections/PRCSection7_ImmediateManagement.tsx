/**
 * PRC Form - Section 7: Immediate Management
 * MOH 363 - PART A
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormRadioGroup,
  FormTextField,
  FormTextArea,
} from '@/components/forms/common';
import { PRCImmediateManagement } from '@/types/forms';

interface PRCSection7Props {
  managementData: PRCImmediateManagement;
  onUpdate: (data: Partial<PRCImmediateManagement>) => void;
  errors?: Partial<Record<keyof PRCImmediateManagement, string>>;
}

export const PRCSection7_ImmediateManagement: React.FC<PRCSection7Props> = ({
  managementData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Immediate Management"
      title="Immediate Management"
      subtitle="Treatment provided during this visit"
      required={true}
      defaultExpanded={true}
    >
      {/* PEP (Post-Exposure Prophylaxis) 1st Dose */}
      <FormRadioGroup
        label="PEP 1st dose"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={managementData.pepFirstDose ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ pepFirstDose: value === 'yes' })}
        required={true}
        horizontal={true}
        helpText="Post-Exposure Prophylaxis - within 72 hours of incident"
      />

      {/* ECP (Emergency Contraceptive Pills) Given */}
      <FormRadioGroup
        label="ECP given"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={managementData.ecpGiven ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ ecpGiven: value === 'yes' })}
        required={true}
        horizontal={true}
        helpText="Emergency Contraceptive Pills - within 120 hours"
      />

      {/* If ECP Given, Number of Tablets */}
      {managementData.ecpGiven && (
        <FormTextField
          label="No. of tablets"
          value={managementData.ecpNumberOfTablets?.toString() || ''}
          onChangeText={(text) => onUpdate({ ecpNumberOfTablets: parseInt(text) || undefined })}
          placeholder="Number of tablets given"
          keyboardType="number-pad"
        />
      )}

      {/* Stitching / Surgical Toilet Done */}
      <FormRadioGroup
        label="Stitching / surgical toilet done"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={managementData.stitchingSurgicalToiletDone ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ stitchingSurgicalToiletDone: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* If Yes, Comment on Stitching */}
      {managementData.stitchingSurgicalToiletDone && (
        <FormTextArea
          label="Comment"
          value={managementData.stitchingComments || ''}
          onChangeText={(text) => onUpdate({ stitchingComments: text })}
          placeholder="Details of stitching/surgical procedure performed"
          rows={2}
          helpText="Location, number of stitches, type of suture"
        />
      )}

      {/* STI Treatment Given */}
      <FormRadioGroup
        label="STI treatment given"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={managementData.stiTreatmentGiven ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ stiTreatmentGiven: value === 'yes' })}
        required={true}
        horizontal={true}
        helpText="Sexually Transmitted Infection prophylaxis"
      />

      {/* If Yes, Comment on STI Treatment */}
      {managementData.stiTreatmentGiven && (
        <FormTextArea
          label="Comment"
          value={managementData.stiTreatmentComments || ''}
          onChangeText={(text) => onUpdate({ stiTreatmentComments: text })}
          placeholder="Medications given (e.g., Ceftriaxone, Azithromycin, Metronidazole)"
          rows={2}
          helpText="Specify antibiotics and dosages"
        />
      )}

      {/* Any Other Treatment / Medication Given / Management */}
      <FormTextArea
        label="Any other treatment / Medication given / management?"
        value={managementData.otherTreatmentMedicationGiven || ''}
        onChangeText={(text) => onUpdate({ otherTreatmentMedicationGiven: text })}
        placeholder="Pain medications, tetanus prophylaxis, hepatitis B vaccine, wound care, etc."
        rows={3}
        helpText="Include pain management, tetanus, hepatitis B, wound care"
      />

      {/* Comments */}
      <FormTextArea
        label="Comments"
        value={managementData.comments}
        onChangeText={(text) => onUpdate({ comments: text })}
        placeholder="Additional notes on treatment, patient response, or follow-up instructions"
        rows={3}
        helpText="Additional clinical notes"
      />
    </FormSection>
  );
};

const styles = StyleSheet.create({
  // No custom styles needed for this component
});
