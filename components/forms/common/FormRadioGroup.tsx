/**
 * FormRadioGroup Component
 * Radio button group for single selection
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  horizontal?: boolean;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  options,
  value,
  onValueChange,
  required = false,
  error,
  helpText,
  horizontal = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={[styles.optionsContainer, horizontal && styles.horizontal]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, horizontal && styles.optionHorizontal]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={styles.radio}>
              {value === option.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
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
  optionsContainer: {
    gap: 8,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionHorizontal: {
    marginRight: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6A2CB0',
  },
  optionLabel: {
    fontSize: 14,
    color: '#424242',
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
