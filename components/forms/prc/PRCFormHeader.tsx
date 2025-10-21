/**
 * PRC Form Header Component
 * Facility and administrative information (top of MOH 363 form)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormTextField, FormDropdown } from '@/components/forms/common';
import { PRCFormHeader as PRCFormHeaderType } from '@/types/forms';

// Kenya Counties (all 47)
const KENYA_COUNTIES = [
  { label: 'Baringo', value: 'baringo' },
  { label: 'Bomet', value: 'bomet' },
  { label: 'Bungoma', value: 'bungoma' },
  { label: 'Busia', value: 'busia' },
  { label: 'Elgeyo-Marakwet', value: 'elgeyo_marakwet' },
  { label: 'Embu', value: 'embu' },
  { label: 'Garissa', value: 'garissa' },
  { label: 'Homa Bay', value: 'homa_bay' },
  { label: 'Isiolo', value: 'isiolo' },
  { label: 'Kajiado', value: 'kajiado' },
  { label: 'Kakamega', value: 'kakamega' },
  { label: 'Kericho', value: 'kericho' },
  { label: 'Kiambu', value: 'kiambu' },
  { label: 'Kilifi', value: 'kilifi' },
  { label: 'Kirinyaga', value: 'kirinyaga' },
  { label: 'Kisii', value: 'kisii' },
  { label: 'Kisumu', value: 'kisumu' },
  { label: 'Kitui', value: 'kitui' },
  { label: 'Kwale', value: 'kwale' },
  { label: 'Laikipia', value: 'laikipia' },
  { label: 'Lamu', value: 'lamu' },
  { label: 'Machakos', value: 'machakos' },
  { label: 'Makueni', value: 'makueni' },
  { label: 'Mandera', value: 'mandera' },
  { label: 'Marsabit', value: 'marsabit' },
  { label: 'Meru', value: 'meru' },
  { label: 'Migori', value: 'migori' },
  { label: 'Mombasa', value: 'mombasa' },
  { label: 'Murang\'a', value: 'muranga' },
  { label: 'Nairobi', value: 'nairobi' },
  { label: 'Nakuru', value: 'nakuru' },
  { label: 'Nandi', value: 'nandi' },
  { label: 'Narok', value: 'narok' },
  { label: 'Nyamira', value: 'nyamira' },
  { label: 'Nyandarua', value: 'nyandarua' },
  { label: 'Nyeri', value: 'nyeri' },
  { label: 'Samburu', value: 'samburu' },
  { label: 'Siaya', value: 'siaya' },
  { label: 'Taita-Taveta', value: 'taita_taveta' },
  { label: 'Tana River', value: 'tana_river' },
  { label: 'Tharaka-Nithi', value: 'tharaka_nithi' },
  { label: 'Trans Nzoia', value: 'trans_nzoia' },
  { label: 'Turkana', value: 'turkana' },
  { label: 'Uasin Gishu', value: 'uasin_gishu' },
  { label: 'Vihiga', value: 'vihiga' },
  { label: 'Wajir', value: 'wajir' },
  { label: 'West Pokot', value: 'west_pokot' },
].sort((a, b) => a.label.localeCompare(b.label));

interface PRCFormHeaderProps {
  headerData: PRCFormHeaderType;
  onUpdate: (data: Partial<PRCFormHeaderType>) => void;
  errors?: Partial<Record<keyof PRCFormHeaderType, string>>;
}

export const PRCFormHeader: React.FC<PRCFormHeaderProps> = ({
  headerData,
  onUpdate,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormDropdown
            label="County"
            options={KENYA_COUNTIES}
            value={headerData.county}
            onValueChange={(value) => onUpdate({ county: value })}
            placeholder="Select county"
            required={true}
            searchable={true}
            error={errors.county}
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Sub-County"
            value={headerData.subCounty}
            onChangeText={(text) => onUpdate({ subCounty: text })}
            placeholder="Enter sub-county"
            required={true}
            error={errors.subCounty}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="Facility"
            value={headerData.facility}
            onChangeText={(text) => onUpdate({ facility: text })}
            placeholder="Enter facility name"
            required={true}
            error={errors.facility}
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="Facility MFL Code"
            value={headerData.facilityMFLCode}
            onChangeText={(text) => onUpdate({ facilityMFLCode: text })}
            placeholder="Enter MFL code"
            keyboardType="number-pad"
            required={true}
            error={errors.facilityMFLCode}
            helpText="Master Facility List code"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormTextField
            label="Start Date"
            value={headerData.startDate}
            onChangeText={(text) => onUpdate({ startDate: text })}
            placeholder="YYYY-MM-DD"
            required={true}
            error={errors.startDate}
          />
        </View>

        <View style={styles.halfWidth}>
          <FormTextField
            label="End Date"
            value={headerData.endDate}
            onChangeText={(text) => onUpdate({ endDate: text })}
            placeholder="YYYY-MM-DD"
            required={true}
            error={errors.endDate}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 2,
    borderBottomColor: '#6A2CB0',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  halfWidth: {
    flex: 1,
  },
});
