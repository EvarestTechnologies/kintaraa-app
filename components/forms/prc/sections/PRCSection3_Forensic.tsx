/**
 * PRC Form - Section 3: Forensic Information
 * MOH 363 - PART A
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
} from '@/components/forms/common';
import { PRCForensicInformation } from '@/types/forms';

interface PRCSection3Props {
  forensicData: PRCForensicInformation;
  onUpdate: (data: Partial<PRCForensicInformation>) => void;
  errors?: Partial<Record<keyof PRCForensicInformation, string>>;
}

export const PRCSection3_Forensic: React.FC<PRCSection3Props> = ({
  forensicData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 3 - FORENSIC"
      title="Forensic Information"
      subtitle="Evidence preservation and collection details"
      required={true}
      defaultExpanded={true}
    >
      {/* Did the Survivor Change Clothes? */}
      <FormRadioGroup
        label="Did the survivor change clothes?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={forensicData.survivorChangedClothes ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ survivorChangedClothes: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* State of Clothes */}
      <FormTextArea
        label="State of clothes (stains, torn, color, where were the worn clothes taken)"
        value={forensicData.stateOfClothes || ''}
        onChangeText={(text) => onUpdate({ stateOfClothes: text })}
        placeholder="Describe condition of clothes, color, any stains or tears"
        rows={3}
        helpText="Document evidence details for forensic purposes"
      />

      {/* How Were the Clothes Transported? */}
      <FormRadioGroup
        label="How were the clothes transported?"
        options={[
          { label: 'Plastic Bag', value: 'plastic_bag' },
          { label: 'Non Plastic Bag', value: 'non_plastic_bag' },
          { label: 'Other', value: 'other' },
        ]}
        value={forensicData.clothesTransportMethod || 'plastic_bag'}
        onValueChange={(value) =>
          onUpdate({
            clothesTransportMethod: value as 'plastic_bag' | 'non_plastic_bag' | 'other',
          })
        }
        horizontal={false}
      />

      {/* If Other, Give Details */}
      {forensicData.clothesTransportMethod === 'other' && (
        <FormTextField
          label="Give details"
          value={forensicData.clothesTransportOther || ''}
          onChangeText={(text) => onUpdate({ clothesTransportOther: text })}
          placeholder="Specify how clothes were transported"
        />
      )}

      {/* Were the Clothes Handed to the Police? */}
      <FormRadioGroup
        label="Were the clothes handed to the police?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={forensicData.clothesHandedToPolice ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ clothesHandedToPolice: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* Did the Survivor Have a Bath or Clean Themselves? */}
      <FormRadioGroup
        label="Did the survivor have a bath or clean themselves?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={forensicData.survivorHadBath ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ survivorHadBath: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* If Yes, Give Details */}
      {forensicData.survivorHadBath && (
        <FormTextArea
          label="Give details"
          value={forensicData.bathDetails || ''}
          onChangeText={(text) => onUpdate({ bathDetails: text })}
          placeholder="When, where, and how the survivor bathed or cleaned"
          rows={2}
        />
      )}

      {/* Did the Survivor Go to the Toilet? */}
      <FormRadioGroup
        label="Did the survivor go to the toilet?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={forensicData.survivorWentToToilet ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ survivorWentToToilet: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* If Yes, Long Call or Short Call */}
      {forensicData.survivorWentToToilet && (
        <FormRadioGroup
          label="Type of call?"
          options={[
            { label: 'Long call', value: 'long_call' },
            { label: 'Short call', value: 'short_call' },
          ]}
          value={forensicData.toiletType || 'short_call'}
          onValueChange={(value) =>
            onUpdate({ toiletType: value as 'long_call' | 'short_call' })
          }
          horizontal={true}
        />
      )}

      {/* Did the Survivor Leave Any Marks on the Perpetrator? */}
      <FormRadioGroup
        label="Did the survivor leave any marks on the perpetrator?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={forensicData.survivorLeftMarksOnPerpetrator ? 'yes' : 'no'}
        onValueChange={(value) =>
          onUpdate({ survivorLeftMarksOnPerpetrator: value === 'yes' })
        }
        required={true}
        horizontal={true}
      />

      {/* If Yes, Give Details */}
      {forensicData.survivorLeftMarksOnPerpetrator && (
        <FormTextArea
          label="Give details"
          value={forensicData.marksDetails || ''}
          onChangeText={(text) => onUpdate({ marksDetails: text })}
          placeholder="Describe marks (scratches, bites, bruises) and location on perpetrator"
          rows={3}
        />
      )}
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
