/**
 * FormCheckboxGroup Component
 * Checkbox group for multiple selections
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface CheckboxOption {
  label: string;
  value: string;
}

interface FormCheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  maxSelections?: number;
}

export const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  label,
  options,
  values,
  onValuesChange,
  required = false,
  error,
  helpText,
  maxSelections,
}) => {
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      // Remove value
      onValuesChange(values.filter((v) => v !== value));
    } else {
      // Add value (check max selections)
      if (maxSelections && values.length >= maxSelections) {
        return; // Don't add if max reached
      }
      onValuesChange([...values, value]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isChecked = values.includes(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => toggleValue(option.value)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionLabel: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
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
