/**
 * PRC Form - Section 1: Patient Demographics
 * MOH 363 - PART A
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormDropdown,
} from '@/components/forms/common';
import { PRCPatientDemographics } from '@/types/forms';

const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
];

interface PRCSection1Props {
  demographicsData: PRCPatientDemographics;
  onUpdate: (data: Partial<PRCPatientDemographics>) => void;
  errors?: Partial<Record<keyof PRCPatientDemographics, string>>;
}

export const PRCSection1_Demographics: React.FC<PRCSection1Props> = ({
  demographicsData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 1"
      title="Patient Demographics"
      subtitle="Survivor personal information"
      required={true}
      defaultExpanded={true}
    >
      {/* Name (Three Names) */}
      <FormTextField
        label="Name(s) (Three Names)"
        value={demographicsData.names}
        onChangeText={(text) => onUpdate({ names: text })}
        placeholder="Surname, First Name, Middle Name"
        required={true}
        error={errors.names}
        helpText="Enter surname, first name, and middle name"
      />

      {/* Date of Birth */}
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <FormTextField
            label="Day"
            value={demographicsData.dateOfBirth.day}
            onChangeText={(text) =>
              onUpdate({
                dateOfBirth: { ...demographicsData.dateOfBirth, day: text },
              })
            }
            placeholder="DD"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.dateField}>
          <FormTextField
            label="Month"
            value={demographicsData.dateOfBirth.month}
            onChangeText={(text) =>
              onUpdate({
                dateOfBirth: { ...demographicsData.dateOfBirth, month: text },
              })
            }
            placeholder="MM"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.yearField}>
          <FormTextField
            label="Year"
            value={demographicsData.dateOfBirth.year}
            onChangeText={(text) =>
              onUpdate({
                dateOfBirth: { ...demographicsData.dateOfBirth, year: text },
              })
            }
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>

      {/* Gender */}
      <FormRadioGroup
        label="Gender"
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
        value={demographicsData.gender}
        onValueChange={(value) => onUpdate({ gender: value as 'male' | 'female' })}
        required={true}
        horizontal={true}
      />

      {/* County Code & Sub-county Code */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="County Code"
            value={demographicsData.countyCode}
            onChangeText={(text) => onUpdate({ countyCode: text })}
            placeholder="County code"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Sub-county Code"
            value={demographicsData.subCountyCode}
            onChangeText={(text) => onUpdate({ subCountyCode: text })}
            placeholder="Sub-county code"
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* OP/IP Number */}
      <FormTextField
        label="OP/IP No."
        value={demographicsData.opIpNumber}
        onChangeText={(text) => onUpdate({ opIpNumber: text })}
        placeholder="Outpatient/Inpatient number"
        helpText="Patient registration number"
      />

      {/* Contacts */}
      <FormTextField
        label="Contacts (Residence and Phone number)"
        value={demographicsData.residenceAndPhone}
        onChangeText={(text) => onUpdate({ residenceAndPhone: text })}
        placeholder="Address and phone number"
        required={true}
        error={errors.residenceAndPhone}
        multiline={true}
      />

      {/* Citizenship */}
      <FormTextField
        label="Citizenship"
        value={demographicsData.citizenship}
        onChangeText={(text) => onUpdate({ citizenship: text })}
        placeholder="e.g., Kenyan, Tanzanian, etc."
        required={true}
      />

      {/* Marital Status */}
      <FormDropdown
        label="Marital Status (specify)"
        options={MARITAL_STATUS_OPTIONS}
        value={demographicsData.maritalStatus}
        onValueChange={(value) => onUpdate({ maritalStatus: value })}
        placeholder="Select marital status"
        required={true}
      />

      {/* Disabilities */}
      <FormTextField
        label="Disabilities (Specify)"
        value={demographicsData.disabilities || ''}
        onChangeText={(text) => onUpdate({ disabilities: text })}
        placeholder="Specify any disabilities"
        helpText="Leave blank if none"
      />

      {/* Orphaned Vulnerable Child (OVC) */}
      <FormRadioGroup
        label="Orphaned Vulnerable Child (OVC)"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={demographicsData.orphanedVulnerableChild ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ orphanedVulnerableChild: value === 'yes' })}
        required={true}
        horizontal={true}
      />
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
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateField: {
    flex: 1,
  },
  yearField: {
    flex: 1.5,
  },
});
