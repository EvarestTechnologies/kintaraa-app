/**
 * FormTextArea Component
 * Multiline text input for longer form responses
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormTextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  containerStyle?: object;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  error,
  helpText,
  rows = 4,
  maxLength,
  showCharacterCount = false,
  containerStyle,
  ...textInputProps
}) => {
  const lineHeight = 20;
  const minHeight = rows * lineHeight + 24; // 24px for padding

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TextInput
        style={[styles.textArea, error ? styles.textAreaError : null, { minHeight }]}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        maxLength={maxLength}
        placeholderTextColor="#9E9E9E"
        {...textInputProps}
      />

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {showCharacterCount && maxLength && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
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
  textArea: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  textAreaError: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  footerLeft: {
    flex: 1,
  },
  helpText: {
    fontSize: 12,
    color: '#757575',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
  },
  characterCount: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
  },
});
