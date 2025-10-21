/**
 * P3 Form - Section 2: Survivor Information
 * Kenya Police Medical Examination Form
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
  FormDateTimePicker,
} from '@/components/forms/common';
import { P3SurvivorInformation } from '@/types/forms';

interface P3Section2Props {
  survivorData: P3SurvivorInformation;
  onUpdate: (data: Partial<P3SurvivorInformation>) => void;
  errors?: Partial<Record<keyof P3SurvivorInformation, string>>;
}

export const P3Section2_SurvivorInfo: React.FC<P3Section2Props> = ({
  survivorData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 2"
      title="SURVIVOR INFORMATION"
      subtitle="Personal details and incident summary"
      required={true}
      defaultExpanded={true}
    >
      {/* Personal Details */}
      <View style={styles.subsection}>
        <FormTextField
          label="Full name"
          value={survivorData.fullName}
          onChangeText={(text) => onUpdate({ fullName: text })}
          placeholder="Survivor's full name"
          required={true}
          error={errors.fullName}
        />

        <FormTextField
          label="Age"
          value={survivorData.age?.toString() || ''}
          onChangeText={(text) => {
            const age = parseInt(text, 10);
            if (!isNaN(age) || text === '') {
              onUpdate({ age: isNaN(age) ? 0 : age });
            }
          }}
          placeholder="Age in years"
          keyboardType="numeric"
          required={true}
          error={errors.age}
        />

        <FormRadioGroup
          label="Gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          value={survivorData.gender}
          onValueChange={(value) => onUpdate({ gender: value as any })}
          required={true}
          horizontal={true}
          error={errors.gender}
        />

        <FormTextField
          label="ID number (optional)"
          value={survivorData.idNumber || ''}
          onChangeText={(text) => onUpdate({ idNumber: text })}
          placeholder="National ID or passport number"
          keyboardType="numeric"
          helpText="If survivor has identification documents"
        />

        <FormTextField
          label="Phone number (optional)"
          value={survivorData.phoneNumber || ''}
          onChangeText={(text) => onUpdate({ phoneNumber: text })}
          placeholder="Contact phone number"
          keyboardType="phone-pad"
          helpText="For follow-up and case updates"
        />

        <FormTextArea
          label="Address"
          value={survivorData.address}
          onChangeText={(text) => onUpdate({ address: text })}
          placeholder="Current residential address"
          rows={2}
          required={true}
          error={errors.address}
          helpText="Include county, sub-county, and nearest landmarks"
        />
      </View>

      {/* Incident Summary */}
      <View style={styles.subsection}>
        <FormDateTimePicker
          label="Incident date"
          mode="date"
          dateValue={{
            day: survivorData.incidentDate
              ? new Date(survivorData.incidentDate).getDate().toString()
              : '',
            month: survivorData.incidentDate
              ? (new Date(survivorData.incidentDate).getMonth() + 1).toString()
              : '',
            year: survivorData.incidentDate
              ? new Date(survivorData.incidentDate).getFullYear().toString()
              : '',
          }}
          onDateChange={(date) => {
            if (date.day && date.month && date.year) {
              const isoDate = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
              onUpdate({ incidentDate: isoDate });
            }
          }}
          required={true}
          helpText="Date when the incident occurred"
        />

        <FormTextField
          label="Incident location"
          value={survivorData.incidentLocation}
          onChangeText={(text) => onUpdate({ incidentLocation: text })}
          placeholder="Where the incident occurred"
          required={true}
          error={errors.incidentLocation}
          helpText="Be as specific as possible (address, landmarks, etc.)"
        />

        <FormTextArea
          label="Incident description"
          value={survivorData.incidentDescription}
          onChangeText={(text) => onUpdate({ incidentDescription: text })}
          placeholder="Brief description of what happened according to survivor's statement"
          rows={6}
          required={true}
          error={errors.incidentDescription}
          helpText="Document survivor's account as stated - use their own words when possible"
        />
      </View>

      {/* Case Reference (Read-only/Auto-populated) */}
      <View style={styles.referenceSection}>
        <FormTextField
          label="Case ID (System Reference)"
          value={survivorData.caseId}
          onChangeText={() => {}}
          editable={false}
          helpText="Auto-populated from system"
        />

        <FormTextField
          label="Incident ID (System Reference)"
          value={survivorData.incidentId}
          onChangeText={() => {}}
          editable={false}
          helpText="Auto-populated from system"
        />
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  subsection: {
    marginBottom: 16,
  },
  referenceSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
  },
});
