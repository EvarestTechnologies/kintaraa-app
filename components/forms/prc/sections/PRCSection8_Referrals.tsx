/**
 * PRC Form - Section 8: Referrals
 * MOH 363 - PART A
 */

import React from 'react';
import {
  FormSection,
  FormCheckboxGroup,
  FormTextField,
} from '@/components/forms/common';
import { PRCReferrals } from '@/types/forms';

interface PRCSection8Props {
  referralsData: PRCReferrals;
  onUpdate: (data: Partial<PRCReferrals>) => void;
}

export const PRCSection8_Referrals: React.FC<PRCSection8Props> = ({
  referralsData,
  onUpdate,
}) => {
  // Convert boolean fields to array for FormCheckboxGroup
  const selectedValues: string[] = [];
  if (referralsData.policeStation) selectedValues.push('police_station');
  if (referralsData.hivTest) selectedValues.push('hiv_test');
  if (referralsData.laboratory) selectedValues.push('laboratory');
  if (referralsData.legal) selectedValues.push('legal');
  if (referralsData.traumaCounseling) selectedValues.push('trauma_counseling');
  if (referralsData.safeShelter) selectedValues.push('safe_shelter');
  if (referralsData.opdCccHivClinic) selectedValues.push('opd_ccc_hiv_clinic');
  if (referralsData.other) selectedValues.push('other');

  const handleReferralChange = (newValues: string[]) => {
    // Update all referral fields based on new values
    const updates: Partial<PRCReferrals> = {
      policeStation: newValues.includes('police_station'),
      hivTest: newValues.includes('hiv_test'),
      laboratory: newValues.includes('laboratory'),
      legal: newValues.includes('legal'),
      traumaCounseling: newValues.includes('trauma_counseling'),
      safeShelter: newValues.includes('safe_shelter'),
      opdCccHivClinic: newValues.includes('opd_ccc_hiv_clinic'),
      other: newValues.includes('other'),
    };

    onUpdate(updates);
  };

  return (
    <FormSection
      sectionNumber="Section 8"
      title="REFERRALS"
      subtitle="Indicate all referrals made for this patient"
      required={true}
      defaultExpanded={true}
    >
      {/* Referral Types - Checkboxes */}
      <FormCheckboxGroup
        label="Patient has been referred to"
        options={[
          { label: 'Police Station', value: 'police_station' },
          { label: 'HIV Test', value: 'hiv_test' },
          { label: 'Laboratory', value: 'laboratory' },
          { label: 'Legal', value: 'legal' },
          { label: 'Trauma Counseling', value: 'trauma_counseling' },
          { label: 'Safe Shelter', value: 'safe_shelter' },
          { label: 'OPD/CCC/HIV Clinic', value: 'opd_ccc_hiv_clinic' },
          { label: 'Other (Specify)', value: 'other' },
        ]}
        values={selectedValues}
        onValuesChange={handleReferralChange}
        required={true}
        helpText="Select all applicable referrals made during this visit"
      />

      {/* If 'Other' is selected, show specify field */}
      {referralsData.other && (
        <FormTextField
          label="Specify other referral"
          value={referralsData.otherSpecify || ''}
          onChangeText={(text) => onUpdate({ otherSpecify: text })}
          placeholder="Enter details of other referral"
          required={true}
          helpText="Provide specific details of the referral"
        />
      )}
    </FormSection>
  );
};
