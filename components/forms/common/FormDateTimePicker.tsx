/**
 * FormDateTimePicker Component
 * Date and time picker with Day/Month/Year and Hour/Minute/AM-PM format
 * Matches MOH 363 form date/time entry format
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DateValue {
  day: string;
  month: string;
  year: string;
}

interface TimeValue {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

interface FormDateTimePickerProps {
  label: string;
  mode: 'date' | 'time' | 'datetime';
  dateValue?: DateValue;
  timeValue?: TimeValue;
  onDateChange?: (date: DateValue) => void;
  onTimeChange?: (time: TimeValue) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const FormDateTimePicker: React.FC<FormDateTimePickerProps> = ({
  label,
  mode,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  required = false,
  error,
  helpText,
}) => {
  const handleDateChange = (field: keyof DateValue, value: string) => {
    if (onDateChange && dateValue) {
      onDateChange({ ...dateValue, [field]: value });
    }
  };

  const handleTimeChange = (field: keyof TimeValue, value: string) => {
    if (onTimeChange && timeValue) {
      if (field === 'period') {
        onTimeChange({ ...timeValue, period: value as 'AM' | 'PM' });
      } else {
        onTimeChange({ ...timeValue, [field]: value });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.inputContainer}>
        {(mode === 'date' || mode === 'datetime') && (
          <View style={styles.dateContainer}>
            <View style={styles.dateGroup}>
              <Text style={styles.fieldLabel}>Day</Text>
              <TextInput
                style={styles.dateInput}
                value={dateValue?.day || ''}
                onChangeText={(text) => handleDateChange('day', text)}
                placeholder="DD"
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9E9E9E"
              />
            </View>

            <View style={styles.dateGroup}>
              <Text style={styles.fieldLabel}>Month</Text>
              <TextInput
                style={styles.dateInput}
                value={dateValue?.month || ''}
                onChangeText={(text) => handleDateChange('month', text)}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9E9E9E"
              />
            </View>

            <View style={styles.dateGroup}>
              <Text style={styles.fieldLabel}>Year</Text>
              <TextInput
                style={styles.yearInput}
                value={dateValue?.year || ''}
                onChangeText={(text) => handleDateChange('year', text)}
                placeholder="YYYY"
                keyboardType="number-pad"
                maxLength={4}
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>
        )}

        {(mode === 'time' || mode === 'datetime') && (
          <View style={styles.timeContainer}>
            <View style={styles.timeGroup}>
              <Text style={styles.fieldLabel}>Hr</Text>
              <TextInput
                style={styles.timeInput}
                value={timeValue?.hour || ''}
                onChangeText={(text) => handleTimeChange('hour', text)}
                placeholder="HH"
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9E9E9E"
              />
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeGroup}>
              <Text style={styles.fieldLabel}>Min</Text>
              <TextInput
                style={styles.timeInput}
                value={timeValue?.minute || ''}
                onChangeText={(text) => handleTimeChange('minute', text)}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9E9E9E"
              />
            </View>

            <View style={styles.periodContainer}>
              <Text style={styles.fieldLabel}>Period</Text>
              <View style={styles.periodButtons}>
                <Text
                  style={[
                    styles.periodButton,
                    timeValue?.period === 'AM' && styles.periodButtonActive,
                  ]}
                  onPress={() => handleTimeChange('period', 'AM')}
                >
                  AM
                </Text>
                <Text
                  style={[
                    styles.periodButton,
                    timeValue?.period === 'PM' && styles.periodButtonActive,
                  ]}
                  onPress={() => handleTimeChange('period', 'PM')}
                >
                  PM
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  required: {
    color: '#D32F2F',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateGroup: {
    flexDirection: 'column',
  },
  fieldLabel: {
    fontSize: 10,
    color: '#757575',
    marginBottom: 4,
    textAlign: 'center',
  },
  dateInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  yearInput: {
    width: 70,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeGroup: {
    flexDirection: 'column',
  },
  timeInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  timeSeparator: {
    fontSize: 18,
    color: '#424242',
    paddingBottom: 8,
  },
  periodContainer: {
    flexDirection: 'column',
  },
  periodButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#424242',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#6A2CB0',
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
});
