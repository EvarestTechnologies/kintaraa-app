/**
 * PRC Form - Section 9: Laboratory Samples & Chain of Custody
 * MOH 363 - PART A
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  FormSection,
  FormRadioGroup,
  FormTextField,
} from '@/components/forms/common';
import { PRCLaboratorySamples } from '@/types/forms/PRCFormMOH363';

interface PRCSection9Props {
  labSamplesData: PRCLaboratorySamples;
  onUpdate: (data: Partial<PRCLaboratorySamples>) => void;
}

export const PRCSection9_LabSamples: React.FC<PRCSection9Props> = ({
  labSamplesData,
  onUpdate,
}) => {
  return (
    <FormSection
      sectionNumber="Section 9"
      title="LABORATORY SAMPLES & CHAIN OF CUSTODY"
      subtitle="Document forensic samples collected and custody tracking"
      required={true}
      defaultExpanded={true}
    >
      <Text style={styles.infoText}>
        Note: Detailed sample collection and test selection will be implemented in a future update.
        For now, please document chain of custody information below.
      </Text>

      {/* Chain of Custody Section */}
      <View style={styles.chainOfCustodySection}>
        <Text style={styles.chainOfCustodyTitle}>⚖️ Chain of Custody</Text>
        <Text style={styles.chainOfCustodySubtitle}>
          Legal documentation of sample handling and transfer
        </Text>

        {/* Samples Packed/Issued */}
        <FormRadioGroup
          label="Samples packed/issued"
          options={[
            { label: 'All samples', value: 'all' },
            { label: 'Some samples', value: 'some' },
            { label: 'These samples (Specify)', value: 'these' },
          ]}
          value={labSamplesData.chainOfCustody.samplesPackedAndIssued}
          onValueChange={(value) =>
            onUpdate({
              chainOfCustody: {
                ...labSamplesData.chainOfCustody,
                samplesPackedAndIssued: value as 'all' | 'some' | 'these',
              },
            })
          }
          required={true}
          horizontal={false}
        />

        {/* If 'These' is selected, show specify field */}
        {labSamplesData.chainOfCustody.samplesPackedAndIssued === 'these' && (
          <FormTextField
            label="Specify which samples"
            value={labSamplesData.chainOfCustody.samplesSpecify || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...labSamplesData.chainOfCustody,
                  samplesSpecify: text,
                },
              })
            }
            placeholder="List specific samples packed/issued"
            required={true}
            multiline={true}
            numberOfLines={2}
          />
        )}

        {/* Examining Officer Details */}
        <View style={styles.officerSection}>
          <Text style={styles.officerSectionTitle}>Examining Officer</Text>

          <FormTextField
            label="Name of examining officer"
            value={labSamplesData.chainOfCustody.examiningOfficerName}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...labSamplesData.chainOfCustody,
                  examiningOfficerName: text,
                },
              })
            }
            placeholder="Full name"
            required={true}
          />

          <FormTextField
            label="Signature"
            value={labSamplesData.chainOfCustody.examiningOfficerSignature || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...labSamplesData.chainOfCustody,
                  examiningOfficerSignature: text,
                },
              })
            }
            placeholder="Digital signature or initials"
            helpText="In digital form, enter initials or 'SIGNED' to confirm"
          />

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <FormTextField
                label="Day"
                value={labSamplesData.chainOfCustody.examiningOfficerDate.day}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      examiningOfficerDate: {
                        ...labSamplesData.chainOfCustody.examiningOfficerDate,
                        day: text,
                      },
                    },
                  })
                }
                placeholder="DD"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.dateField}>
              <FormTextField
                label="Month"
                value={labSamplesData.chainOfCustody.examiningOfficerDate.month}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      examiningOfficerDate: {
                        ...labSamplesData.chainOfCustody.examiningOfficerDate,
                        month: text,
                      },
                    },
                  })
                }
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.dateField}>
              <FormTextField
                label="Year"
                value={labSamplesData.chainOfCustody.examiningOfficerDate.year}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      examiningOfficerDate: {
                        ...labSamplesData.chainOfCustody.examiningOfficerDate,
                        year: text,
                      },
                    },
                  })
                }
                placeholder="YYYY"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
        </View>

        {/* Police Officer Details */}
        <View style={styles.officerSection}>
          <Text style={styles.officerSectionTitle}>Police Officer (Receiving)</Text>

          <FormTextField
            label="Name of police officer"
            value={labSamplesData.chainOfCustody.policeOfficerName}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...labSamplesData.chainOfCustody,
                  policeOfficerName: text,
                },
              })
            }
            placeholder="Full name"
            required={true}
          />

          <FormTextField
            label="Signature"
            value={labSamplesData.chainOfCustody.policeOfficerSignature || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...labSamplesData.chainOfCustody,
                  policeOfficerSignature: text,
                },
              })
            }
            placeholder="Digital signature or initials"
            helpText="In digital form, enter initials or 'SIGNED' to confirm"
          />

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <FormTextField
                label="Day"
                value={labSamplesData.chainOfCustody.policeOfficerDate.day}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      policeOfficerDate: {
                        ...labSamplesData.chainOfCustody.policeOfficerDate,
                        day: text,
                      },
                    },
                  })
                }
                placeholder="DD"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.dateField}>
              <FormTextField
                label="Month"
                value={labSamplesData.chainOfCustody.policeOfficerDate.month}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      policeOfficerDate: {
                        ...labSamplesData.chainOfCustody.policeOfficerDate,
                        month: text,
                      },
                    },
                  })
                }
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.dateField}>
              <FormTextField
                label="Year"
                value={labSamplesData.chainOfCustody.policeOfficerDate.year}
                onChangeText={(text) =>
                  onUpdate({
                    chainOfCustody: {
                      ...labSamplesData.chainOfCustody,
                      policeOfficerDate: {
                        ...labSamplesData.chainOfCustody.policeOfficerDate,
                        year: text,
                      },
                    },
                  })
                }
                placeholder="YYYY"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
        </View>

        {/* Chain of Custody Notes */}
        <View style={styles.chainNotes}>
          <Text style={styles.chainNotesTitle}>📋 Chain of Custody Guidelines</Text>
          <Text style={styles.chainNotesText}>
            • All samples must be properly labeled with patient ID and collection date/time
          </Text>
          <Text style={styles.chainNotesText}>
            • Samples should be stored in appropriate containers (e.g., sealed, tamper-evident bags)
          </Text>
          <Text style={styles.chainNotesText}>
            • Maintain continuous custody documentation for legal validity
          </Text>
          <Text style={styles.chainNotesText}>
            • Both examining officer and receiving police officer must sign and date
          </Text>
          <Text style={styles.chainNotesText}>
            • Keep copies of all chain of custody forms for facility records
          </Text>
        </View>
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  chainOfCustodySection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  chainOfCustodyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  chainOfCustodySubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  officerSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFA000',
  },
  officerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dateField: {
    flex: 1,
  },
  chainNotes: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  chainNotesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  chainNotesText: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 4,
    lineHeight: 18,
  },
});
