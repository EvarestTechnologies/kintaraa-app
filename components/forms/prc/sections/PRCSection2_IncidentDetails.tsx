/**
 * PRC Form - Section 2: Incident Details & Circumstances
 * MOH 363 - PART A
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormDateTimePicker,
  FormRadioGroup,
  FormCheckboxGroup,
  FormTextArea,
  FormDropdown,
} from '@/components/forms/common';
import { PRCIncidentDetails } from '@/types/forms';

// Kenya Counties (abbreviated list - same as PRCFormHeader)
const KENYA_COUNTIES = [
  { label: 'Nairobi', value: 'nairobi' },
  { label: 'Mombasa', value: 'mombasa' },
  { label: 'Kisumu', value: 'kisumu' },
  { label: 'Nakuru', value: 'nakuru' },
  { label: 'Kiambu', value: 'kiambu' },
  // ... (would include all 47 counties)
].sort((a, b) => a.label.localeCompare(b.label));

interface PRCSection2Props {
  incidentData: PRCIncidentDetails;
  onUpdate: (data: Partial<PRCIncidentDetails>) => void;
  errors?: Partial<Record<keyof PRCIncidentDetails, string>>;
}

export const PRCSection2_IncidentDetails: React.FC<PRCSection2Props> = ({
  incidentData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 2"
      title="Incident Details & Circumstances"
      subtitle="When, where, and how the incident occurred"
      required={true}
      defaultExpanded={true}
    >
      {/* Date and Time of Examination */}
      <FormDateTimePicker
        label="Date and Time of Examination"
        mode="datetime"
        dateValue={incidentData.examinationDate}
        timeValue={incidentData.examinationTime}
        onDateChange={(date) => onUpdate({ examinationDate: date })}
        onTimeChange={(time) => onUpdate({ examinationTime: time })}
        required={true}
        error={errors.examinationDate}
      />

      {/* Date and Time of Incident */}
      <FormDateTimePicker
        label="Date and Time of Incident"
        mode="datetime"
        dateValue={incidentData.incidentDate}
        timeValue={incidentData.incidentTime}
        onDateChange={(date) => onUpdate({ incidentDate: date })}
        onTimeChange={(time) => onUpdate({ incidentTime: time })}
        required={true}
        error={errors.incidentDate}
      />

      {/* Date and Time of Report */}
      <FormDateTimePicker
        label="Date and Time of Report"
        mode="datetime"
        dateValue={incidentData.reportDate}
        timeValue={incidentData.reportTime}
        onDateChange={(date) => onUpdate({ reportDate: date })}
        onTimeChange={(time) => onUpdate({ reportTime: time })}
        required={true}
      />

      {/* Alleged Perpetrators */}
      <FormRadioGroup
        label="Alleged Perpetrators"
        options={[
          { label: 'Unknown', value: 'unknown' },
          { label: 'Known', value: 'known' },
        ]}
        value={incidentData.perpetratorStatus}
        onValueChange={(value) => onUpdate({ perpetratorStatus: value as 'unknown' | 'known' })}
        required={true}
        horizontal={true}
      />

      {/* If Known, Specify Relationship */}
      {incidentData.perpetratorStatus === 'known' && (
        <FormTextField
          label="Specify the relationship"
          value={incidentData.perpetratorRelationship || ''}
          onChangeText={(text) => onUpdate({ perpetratorRelationship: text })}
          placeholder="e.g., spouse, neighbor, colleague, family member"
        />
      )}

      {/* Number of Perpetrators */}
      <FormTextField
        label="No. of perpetrators"
        value={incidentData.numberOfPerpetrators?.toString() || ''}
        onChangeText={(text) => onUpdate({ numberOfPerpetrators: parseInt(text) || 1 })}
        placeholder="Number"
        keyboardType="number-pad"
        required={true}
      />

      {/* Perpetrator Gender and Age */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormRadioGroup
            label="Perpetrator Gender"
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={incidentData.perpetratorGender}
            onValueChange={(value) => onUpdate({ perpetratorGender: value as 'male' | 'female' })}
            required={true}
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Estimated Age"
            value={incidentData.perpetratorEstimatedAge}
            onChangeText={(text) => onUpdate({ perpetratorEstimatedAge: text })}
            placeholder="Estimated age"
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Where Incident Occurred */}
      <FormDropdown
        label="County where incident occurred"
        options={KENYA_COUNTIES}
        value={incidentData.incidentLocation.county}
        onValueChange={(value) =>
          onUpdate({
            incidentLocation: { ...incidentData.incidentLocation, county: value },
          })
        }
        searchable={true}
        required={true}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="Sub-county"
            value={incidentData.incidentLocation.subCounty}
            onChangeText={(text) =>
              onUpdate({
                incidentLocation: { ...incidentData.incidentLocation, subCounty: text },
              })
            }
            placeholder="Sub-county"
            required={true}
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Landmark"
            value={incidentData.incidentLocation.landmark}
            onChangeText={(text) =>
              onUpdate({
                incidentLocation: { ...incidentData.incidentLocation, landmark: text },
              })
            }
            placeholder="Specific location"
          />
        </View>
      </View>

      {/* Chief Complaints */}
      <FormTextArea
        label="Chief complaints: Indicate what is observed"
        value={incidentData.chiefComplaintsObserved}
        onChangeText={(text) => onUpdate({ chiefComplaintsObserved: text })}
        placeholder="Physical observations by clinician"
        rows={3}
        required={true}
      />

      <FormTextArea
        label="Indicate what is reported"
        value={incidentData.chiefComplaintsReported}
        onChangeText={(text) => onUpdate({ chiefComplaintsReported: text })}
        placeholder="What the survivor reports"
        rows={3}
        required={true}
      />

      {/* Circumstances Surrounding the Incident */}
      <FormTextArea
        label="Circumstances surrounding the incident (survivor account)"
        value={incidentData.circumstancesSurroundingIncident}
        onChangeText={(text) => onUpdate({ circumstancesSurroundingIncident: text })}
        placeholder="Remember to record penetration (how, where, what was used? Indication of struggle?)"
        rows={6}
        maxLength={1000}
        showCharacterCount={true}
        required={true}
        helpText="Record details of penetration, indication of struggle, and survivor's account"
      />

      {/* Type of Sexual Violence */}
      <FormCheckboxGroup
        label="Type of Sexual Violence"
        options={[
          { label: 'Oral', value: 'oral' },
          { label: 'Vaginal', value: 'vaginal' },
          { label: 'Anal', value: 'anal' },
          { label: 'Other (specify)', value: 'other' },
        ]}
        values={
          Object.entries(incidentData.typeOfSexualViolence)
            .filter(([key, value]) => value && key !== 'otherSpecify')
            .map(([key]) => key)
        }
        onValuesChange={(values) =>
          onUpdate({
            typeOfSexualViolence: {
              oral: values.includes('oral'),
              vaginal: values.includes('vaginal'),
              anal: values.includes('anal'),
              other: values.includes('other'),
            },
          })
        }
        required={true}
      />

      {/* If Other, Specify */}
      {incidentData.typeOfSexualViolence.other && (
        <FormTextField
          label="Specify other type"
          value={incidentData.typeOfSexualViolence.otherSpecify || ''}
          onChangeText={(text) =>
            onUpdate({
              typeOfSexualViolence: {
                ...incidentData.typeOfSexualViolence,
                otherSpecify: text,
              },
            })
          }
          placeholder="Specify"
        />
      )}

      {/* Use of Condom */}
      <FormRadioGroup
        label="Use of condom?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
          { label: 'Unknown', value: 'unknown' },
        ]}
        value={incidentData.useOfCondom}
        onValueChange={(value) => onUpdate({ useOfCondom: value as 'yes' | 'no' | 'unknown' })}
        required={true}
        horizontal={true}
      />

      {/* Incident Already Reported to Police */}
      <FormRadioGroup
        label="Incident already reported to police?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={incidentData.incidentReportedToPolice ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ incidentReportedToPolice: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* If Yes, Police Station Name */}
      {incidentData.incidentReportedToPolice && (
        <FormTextField
          label="Indicate name of police station"
          value={incidentData.policeStationName || ''}
          onChangeText={(text) => onUpdate({ policeStationName: text })}
          placeholder="Police station name"
        />
      )}

      {/* Attended Health Facility Before This One */}
      <FormRadioGroup
        label="Attended a health facility before this one?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={incidentData.attendedHealthFacilityBefore ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ attendedHealthFacilityBefore: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* If Yes, Facility Name */}
      {incidentData.attendedHealthFacilityBefore && (
        <>
          <FormTextField
            label="Indicate name of facility"
            value={incidentData.previousFacilityName || ''}
            onChangeText={(text) => onUpdate({ previousFacilityName: text })}
            placeholder="Previous facility name"
          />

          <FormRadioGroup
            label="Were you treated?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            value={incidentData.previouslyTreated ? 'yes' : 'no'}
            onValueChange={(value) => onUpdate({ previouslyTreated: value === 'yes' })}
            horizontal={true}
          />

          <FormRadioGroup
            label="Were you given referral notes?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            value={incidentData.givenReferralNotes ? 'yes' : 'no'}
            onValueChange={(value) => onUpdate({ givenReferralNotes: value === 'yes' })}
            horizontal={true}
          />
        </>
      )}

      {/* Significant Medical/Surgical History */}
      <FormTextArea
        label="Significant medical and/or surgical history"
        value={incidentData.significantMedicalSurgicalHistory}
        onChangeText={(text) => onUpdate({ significantMedicalSurgicalHistory: text })}
        placeholder="Chronic illnesses, previous surgeries, current medications, allergies"
        rows={4}
        helpText="Include chronic illnesses, medications, allergies"
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
});
