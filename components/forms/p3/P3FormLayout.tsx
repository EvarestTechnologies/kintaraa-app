/**
 * P3 Form Layout
 * Kenya Police Medical Examination Form - Main Container
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {
  P3Section1_ExaminerInfo,
  P3Section2_SurvivorInfo,
  P3Section3_InjuryDocumentation,
  P3Section4_EvidenceCollection,
} from './sections';
import { P3Form, P3FormValidationErrors } from '@/types/forms';

interface P3FormLayoutProps {
  formData: P3Form;
  onUpdate: (data: Partial<P3Form>) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  errors?: P3FormValidationErrors;
  isSaving?: boolean;
  isSubmitting?: boolean;
}

export const P3FormLayout: React.FC<P3FormLayoutProps> = ({
  formData,
  onUpdate,
  onSaveDraft,
  onSubmit,
  errors = {},
  isSaving = false,
  isSubmitting = false,
}) => {
  const [currentSection, setCurrentSection] = useState(1);

  const handleSaveDraft = () => {
    Alert.alert(
      'Save Draft',
      'Do you want to save this form as a draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: onSaveDraft,
        },
      ]
    );
  };

  const handleSubmit = () => {
    // Basic validation before submission
    const missingFields: string[] = [];

    if (!formData.examinerInformation.officerName) missingFields.push('Officer name');
    if (!formData.examinerInformation.obNumber) missingFields.push('OB number');
    if (!formData.survivorInformation.fullName) missingFields.push('Survivor name');
    if (!formData.injuryDocumentation.overallInjuryAssessment) missingFields.push('Injury assessment');
    if (!formData.evidenceCollection.chainOfCustody.collectedBy.name) missingFields.push('Evidence collector');

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Required Fields',
        `Please complete the following required fields:\n\n${missingFields.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Submit P3 Form',
      'Are you sure you want to submit this form? Once submitted, it cannot be edited.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: onSubmit,
        },
      ]
    );
  };

  const getSectionProgress = (): string => {
    let completed = 0;
    let total = 4;

    if (formData.examinerInformation.officerName && formData.examinerInformation.obNumber) completed++;
    if (formData.survivorInformation.fullName && formData.survivorInformation.incidentDescription) completed++;
    if (formData.injuryDocumentation.overallInjuryAssessment) completed++;
    if (formData.evidenceCollection.chainOfCustody.collectedBy.name) completed++;

    return `${completed}/${total} sections`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>P3 Form</Text>
          <Text style={styles.headerSubtitle}>Kenya Police Medical Examination</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{formData.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>Progress: {getSectionProgress()}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(parseInt(getSectionProgress().split('/')[0]) / 4) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Section Navigation */}
      <View style={styles.sectionNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { num: 1, title: 'Examiner Info' },
            { num: 2, title: 'Survivor Info' },
            { num: 3, title: 'Injury Docs' },
            { num: 4, title: 'Evidence' },
          ].map((section) => (
            <TouchableOpacity
              key={section.num}
              style={[
                styles.sectionNavButton,
                currentSection === section.num && styles.sectionNavButtonActive,
              ]}
              onPress={() => setCurrentSection(section.num)}
            >
              <Text
                style={[
                  styles.sectionNavButtonText,
                  currentSection === section.num && styles.sectionNavButtonTextActive,
                ]}
              >
                {section.num}. {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.formContent} showsVerticalScrollIndicator={true}>
        {/* Section 1: Examiner Information */}
        {currentSection === 1 && (
          <P3Section1_ExaminerInfo
            examinerData={formData.examinerInformation}
            onUpdate={(data) =>
              onUpdate({
                examinerInformation: {
                  ...formData.examinerInformation,
                  ...data,
                },
              })
            }
            errors={errors.examinerInformation as any}
          />
        )}

        {/* Section 2: Survivor Information */}
        {currentSection === 2 && (
          <P3Section2_SurvivorInfo
            survivorData={formData.survivorInformation}
            onUpdate={(data) =>
              onUpdate({
                survivorInformation: {
                  ...formData.survivorInformation,
                  ...data,
                },
              })
            }
            errors={errors.survivorInformation as any}
          />
        )}

        {/* Section 3: Injury Documentation */}
        {currentSection === 3 && (
          <P3Section3_InjuryDocumentation
            injuryData={formData.injuryDocumentation}
            onUpdate={(data) =>
              onUpdate({
                injuryDocumentation: {
                  ...formData.injuryDocumentation,
                  ...data,
                },
              })
            }
            errors={errors.injuryDocumentation as any}
          />
        )}

        {/* Section 4: Evidence Collection */}
        {currentSection === 4 && (
          <P3Section4_EvidenceCollection
            evidenceData={formData.evidenceCollection}
            onUpdate={(data) =>
              onUpdate({
                evidenceCollection: {
                  ...formData.evidenceCollection,
                  ...data,
                },
              })
            }
            errors={errors.evidenceCollection as any}
          />
        )}

        {/* Section Navigation Buttons */}
        <View style={styles.sectionNavButtons}>
          {currentSection > 1 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => setCurrentSection(currentSection - 1)}
            >
              <Text style={styles.previousButtonText}>← Previous</Text>
            </TouchableOpacity>
          )}

          {currentSection < 4 && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setCurrentSection(currentSection + 1)}
            >
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.saveDraftButton, isSaving && styles.buttonDisabled]}
          onPress={handleSaveDraft}
          disabled={isSaving || isSubmitting}
        >
          <Text style={styles.saveDraftButtonText}>
            {isSaving ? 'Saving...' : '💾 Save Draft'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSaving || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : '✓ Submit Form'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1565C0',
    borderBottomWidth: 4,
    borderBottomColor: '#0D47A1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BBDEFB',
  },
  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFC107',
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
  },
  progressSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  sectionNav: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionNavButton: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionNavButtonActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  sectionNavButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  sectionNavButtonTextActive: {
    color: '#FFFFFF',
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  sectionNavButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  previousButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previousButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1565C0',
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveDraftButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
  },
  saveDraftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 14,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
