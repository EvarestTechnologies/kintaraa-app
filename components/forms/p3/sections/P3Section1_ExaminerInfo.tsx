/**
 * P3 Form - Section 1: Examiner Information
 * Kenya Police Medical Examination Form
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormDateTimePicker,
} from '@/components/forms/common';
import { P3ExaminerInformation } from '@/types/forms';

interface P3Section1Props {
  examinerData: P3ExaminerInformation;
  onUpdate: (data: Partial<P3ExaminerInformation>) => void;
  errors?: Partial<Record<keyof P3ExaminerInformation, string>>;
}

export const P3Section1_ExaminerInfo: React.FC<P3Section1Props> = ({
  examinerData,
  onUpdate,
  errors = {},
}) => {
  return (
    <FormSection
      sectionNumber="Section 1"
      title="EXAMINER INFORMATION"
      subtitle="Police officer details and examination metadata"
      required={true}
      defaultExpanded={true}
    >
      {/* Police Officer Details */}
      <View style={styles.subsection}>
        <FormTextField
          label="Officer name"
          value={examinerData.officerName}
          onChangeText={(text) => onUpdate({ officerName: text })}
          placeholder="Full name of examining police officer"
          required={true}
          error={errors.officerName}
        />

        <FormTextField
          label="Rank"
          value={examinerData.officerRank}
          onChangeText={(text) => onUpdate({ officerRank: text })}
          placeholder="e.g., Inspector, Sergeant, Corporal"
          required={true}
          error={errors.officerRank}
          helpText="Official Kenya Police Service rank"
        />

        <FormTextField
          label="Service number"
          value={examinerData.officerServiceNumber}
          onChangeText={(text) => onUpdate({ officerServiceNumber: text })}
          placeholder="Police service number"
          required={true}
          error={errors.officerServiceNumber}
        />

        <FormTextField
          label="Police station"
          value={examinerData.policeStation}
          onChangeText={(text) => onUpdate({ policeStation: text })}
          placeholder="Station name"
          required={true}
          error={errors.policeStation}
          helpText="Station where officer is posted"
        />
      </View>

      {/* Examination Details */}
      <View style={styles.subsection}>
        <FormDateTimePicker
          label="Examination date & time"
          mode="both"
          dateValue={{
            day: examinerData.examinationDate
              ? new Date(examinerData.examinationDate).getDate().toString()
              : '',
            month: examinerData.examinationDate
              ? (new Date(examinerData.examinationDate).getMonth() + 1).toString()
              : '',
            year: examinerData.examinationDate
              ? new Date(examinerData.examinationDate).getFullYear().toString()
              : '',
          }}
          timeValue={{
            hour: examinerData.examinationTime
              ? examinerData.examinationTime.split(':')[0]
              : '',
            minute: examinerData.examinationTime
              ? examinerData.examinationTime.split(':')[1]
              : '',
            period: 'AM',
          }}
          onDateChange={(date) => {
            if (date.day && date.month && date.year) {
              const isoDate = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
              onUpdate({ examinationDate: isoDate });
            }
          }}
          onTimeChange={(time) => {
            if (time.hour && time.minute) {
              const timeStr = `${time.hour.padStart(2, '0')}:${time.minute.padStart(2, '0')}`;
              onUpdate({ examinationTime: timeStr });
            }
          }}
          required={true}
          helpText="Date and time when P3 examination was conducted"
        />

        <FormTextField
          label="Examination location"
          value={examinerData.examinationLocation}
          onChangeText={(text) => onUpdate({ examinationLocation: text })}
          placeholder="Hospital/clinic name and location"
          required={true}
          error={errors.examinationLocation}
          helpText="Full name of medical facility where examination took place"
        />
      </View>

      {/* Case Details */}
      <View style={styles.subsection}>
        <FormTextField
          label="OB number"
          value={examinerData.obNumber}
          onChangeText={(text) => onUpdate({ obNumber: text })}
          placeholder="Occurrence Book number"
          required={true}
          error={errors.obNumber}
          helpText="Official OB number from police station"
        />

        <FormTextField
          label="Case number (optional)"
          value={examinerData.caseNumber || ''}
          onChangeText={(text) => onUpdate({ caseNumber: text })}
          placeholder="Case reference number if assigned"
          helpText="Court case number if case has proceeded to prosecution"
        />
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  subsection: {
    marginBottom: 16,
  },
});
