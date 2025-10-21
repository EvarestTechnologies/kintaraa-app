/**
 * PRC Form - Section 4: OB/GYN History
 * MOH 363 - PART A
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
} from '@/components/forms/common';
import { PRCOBGYNHistory } from '@/types/forms';

interface PRCSection4Props {
  obgynData: PRCOBGYNHistory;
  onUpdate: (data: Partial<PRCOBGYNHistory>) => void;
  errors?: Partial<Record<keyof PRCOBGYNHistory, string>>;
}

export const PRCSection4_OBGYNHistory: React.FC<PRCSection4Props> = ({
  obgynData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="OB/GYN History"
      title="Obstetric & Gynecological History"
      subtitle="Female reproductive health information"
      required={false}
      defaultExpanded={true}
    >
      {/* Parity */}
      <FormTextField
        label="Parity"
        value={obgynData.parity?.toString() || ''}
        onChangeText={(text) => onUpdate({ parity: parseInt(text) || 0 })}
        placeholder="Number of pregnancies"
        keyboardType="number-pad"
        helpText="Total number of times pregnant (including current if applicable)"
      />

      {/* Contraception Type */}
      <FormTextField
        label="Contraception type"
        value={obgynData.contraceptionType}
        onChangeText={(text) => onUpdate({ contraceptionType: text })}
        placeholder="e.g., Pills, IUD, Injection, None"
        helpText="Current contraception method being used"
      />

      {/* LMP (Last Menstrual Period) */}
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <FormTextField
            label="LMP - Day"
            value={obgynData.lastMenstrualPeriod.day}
            onChangeText={(text) =>
              onUpdate({
                lastMenstrualPeriod: { ...obgynData.lastMenstrualPeriod, day: text },
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
            value={obgynData.lastMenstrualPeriod.month}
            onChangeText={(text) =>
              onUpdate({
                lastMenstrualPeriod: { ...obgynData.lastMenstrualPeriod, month: text },
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
            value={obgynData.lastMenstrualPeriod.year}
            onChangeText={(text) =>
              onUpdate({
                lastMenstrualPeriod: { ...obgynData.lastMenstrualPeriod, year: text },
              })
            }
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>

      {/* Known Pregnancy */}
      <FormRadioGroup
        label="Known Pregnancy?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={obgynData.knownPregnancy ? 'yes' : 'no'}
        onValueChange={(value) => onUpdate({ knownPregnancy: value === 'yes' })}
        required={true}
        horizontal={true}
      />

      {/* Date of Last Consensual Sexual Intercourse */}
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <FormTextField
            label="Date of last consensual sexual intercourse - Day"
            value={obgynData.dateOfLastConsensualIntercourse.day}
            onChangeText={(text) =>
              onUpdate({
                dateOfLastConsensualIntercourse: {
                  ...obgynData.dateOfLastConsensualIntercourse,
                  day: text,
                },
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
            value={obgynData.dateOfLastConsensualIntercourse.month}
            onChangeText={(text) =>
              onUpdate({
                dateOfLastConsensualIntercourse: {
                  ...obgynData.dateOfLastConsensualIntercourse,
                  month: text,
                },
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
            value={obgynData.dateOfLastConsensualIntercourse.year}
            onChangeText={(text) =>
              onUpdate({
                dateOfLastConsensualIntercourse: {
                  ...obgynData.dateOfLastConsensualIntercourse,
                  year: text,
                },
              })
            }
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
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
