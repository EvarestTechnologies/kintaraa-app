/**
 * FormSection Component
 * Collapsible section wrapper for form organization
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  required?: boolean;
  sectionNumber?: string; // e.g., "Section 1", "PART A", etc.
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  defaultExpanded = true,
  required = false,
  sectionNumber,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {sectionNumber && (
            <Text style={styles.sectionNumber}>{sectionNumber}</Text>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {title}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0', // Primary Purple
    marginRight: 12,
    minWidth: 80,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  required: {
    color: '#D32F2F',
    fontSize: 16,
  },
  chevron: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
});
