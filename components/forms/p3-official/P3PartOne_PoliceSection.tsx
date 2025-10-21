/**
 * P3 Form - PART ONE: Police Officer Section
 * Pages 1-2 of Official Kenya Police Medical Examination Report
 *
 * Completed by police officer requesting forensic medical examination
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
  FormDateTimePicker,
} from '@/components/forms/common';
import { P3PartOne } from '@/types/forms/P3Form_Official';

interface P3PartOneProps {
  partOneData: P3PartOne;
  onUpdate: (data: Partial<P3PartOne>) => void;
  errors?: Partial<Record<keyof P3PartOne, string>>;
}

export const P3PartOne_PoliceSection: React.FC<P3PartOneProps> = ({
  partOneData,
  onUpdate,
  errors = {},
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Form Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THE NATIONAL POLICE SERVICE</Text>
        <Text style={styles.headerSubtitle}>MEDICAL EXAMINATION REPORT (P3)</Text>
        <Text style={styles.headerNote}>
          (The issuance and completion of this form is free of charge)
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsText}>
          This form is to be completed by a police officer and a trained medical practitioner
          (Public officers); electronically or manually in CLEAR and LEGIBLE handwriting and
          signed on every page; please complete three copies. Additional page may be used,
          stapled and every page signed by the medical practitioner and the police officer
        </Text>
      </View>

      {/* PART ONE Header */}
      <View style={styles.partOneHeader}>
        <Text style={styles.partOneTitle}>
          PART ONE - DETAILS OF COMPLAINT/INCIDENT
        </Text>
        <Text style={styles.partOneSubtitle}>
          (Completed by the police officer requesting the forensic medical examination)
        </Text>
      </View>

      <FormSection
        title="Incident Details"
        required={true}
        defaultExpanded={true}
      >
        <FormTextField
          label="NATURE OF ALLEGED OFFENCE/INCIDENT"
          value={partOneData.natureOfAllegedOffence}
          onChangeText={(text) => onUpdate({ natureOfAllegedOffence: text })}
          placeholder="Enter nature of alleged offence"
          required={true}
          error={errors.natureOfAllegedOffence}
        />

        <FormTextField
          label="DATE AND TIME OF ALLEGED OFFENCE/INCIDENT"
          value={partOneData.dateAndTimeOfAllegedOffence}
          onChangeText={(text) => onUpdate({ dateAndTimeOfAllegedOffence: text })}
          placeholder="DD/MM/YYYY HH:MM"
          required={true}
          error={errors.dateAndTimeOfAllegedOffence}
        />

        <FormTextField
          label="DATE AND TIME REPORTED TO POLICE"
          value={partOneData.dateAndTimeReportedToPolice}
          onChangeText={(text) => onUpdate({ dateAndTimeReportedToPolice: text })}
          placeholder="DD/MM/YYYY HH:MM"
          required={true}
          error={errors.dateAndTimeReportedToPolice}
        />

        <FormTextField
          label="DATE OF ISSUE OF POLICE MEDICAL REPORT FORM"
          value={partOneData.dateOfIssueOfPoliceForm}
          onChangeText={(text) => onUpdate({ dateOfIssueOfPoliceForm: text })}
          placeholder="DD/MM/YYYY"
          required={true}
          error={errors.dateOfIssueOfPoliceForm}
        />

        <FormTextField
          label="POLICE OCCURRENCE BOOK NUMBER"
          value={partOneData.policeOccurrenceBookNumber}
          onChangeText={(text) => onUpdate({ policeOccurrenceBookNumber: text })}
          placeholder="OB Number"
          required={true}
          error={errors.policeOccurrenceBookNumber}
          helpText="Occurrence Book reference number"
        />
      </FormSection>

      <FormSection
        title="FROM: Police Officer Details"
        required={true}
        defaultExpanded={true}
      >
        <FormTextField
          label="POLICE STATION"
          value={partOneData.policeStation}
          onChangeText={(text) => onUpdate({ policeStation: text })}
          placeholder="Station name"
          required={true}
          error={errors.policeStation}
        />

        <FormTextField
          label="SERVICE NO AND NAME OF INVESTIGATING OFFICER"
          value={`${partOneData.investigatingOfficer.serviceNumber} ${partOneData.investigatingOfficer.name}`}
          onChangeText={(text) => {
            const [serviceNumber, ...nameParts] = text.split(' ');
            onUpdate({
              investigatingOfficer: {
                ...partOneData.investigatingOfficer,
                serviceNumber: serviceNumber || '',
                name: nameParts.join(' ') || '',
              },
            });
          }}
          placeholder="Service No. and Full Name"
          required={true}
        />

        <FormTextField
          label="SIGNATURE"
          value={partOneData.investigatingOfficer.signature || ''}
          onChangeText={(text) =>
            onUpdate({
              investigatingOfficer: {
                ...partOneData.investigatingOfficer,
                signature: text,
              },
            })
          }
          placeholder="Digital signature or 'SIGNED'"
          helpText="Enter 'SIGNED' or initials to confirm"
        />
      </FormSection>

      <FormSection
        title="TO: Medical Facility"
        required={true}
        defaultExpanded={true}
      >
        <FormTextField
          label="NAME OF MEDICAL FACILITY"
          value={partOneData.medicalFacilityName}
          onChangeText={(text) => onUpdate({ medicalFacilityName: text })}
          placeholder="Hospital/clinic name"
          required={true}
          error={errors.medicalFacilityName}
        />
      </FormSection>

      <FormSection
        title="REQUEST FOR FORENSIC MEDICAL EXAMINATION OF"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Examination Type"
          options={[
            { label: 'COMPLAINANT', value: 'complainant' },
            { label: 'ACCUSED', value: 'accused' },
          ]}
          value={partOneData.examinationType}
          onValueChange={(value) => onUpdate({ examinationType: value as any })}
          required={true}
          horizontal={true}
          error={errors.examinationType}
        />

        <FormTextField
          label="NAME"
          value={partOneData.patientName}
          onChangeText={(text) => onUpdate({ patientName: text })}
          placeholder="Full name of patient"
          required={true}
          error={errors.patientName}
        />

        <View style={styles.inlineFields}>
          <View style={styles.inlineFieldSmall}>
            <FormTextField
              label="AGE"
              value={partOneData.age?.toString() || ''}
              onChangeText={(text) => {
                const age = parseInt(text, 10);
                if (!isNaN(age) || text === '') {
                  onUpdate({ age: isNaN(age) ? 0 : age });
                }
              }}
              keyboardType="numeric"
              required={true}
            />
          </View>

          <View style={styles.inlineFieldMedium}>
            <FormRadioGroup
              label="SEX"
              options={[
                { label: 'M', value: 'male' },
                { label: 'F', value: 'female' },
                { label: 'Intersex', value: 'intersex' },
              ]}
              value={partOneData.sex}
              onValueChange={(value) => onUpdate({ sex: value as any })}
              required={true}
              horizontal={true}
            />
          </View>
        </View>

        <FormTextField
          label="ID No./Birth Certificate No."
          value={partOneData.idOrBirthCertificateNumber || ''}
          onChangeText={(text) => onUpdate({ idOrBirthCertificateNumber: text })}
          placeholder="ID or Birth Certificate number"
          keyboardType="numeric"
        />

        <FormTextField
          label="CONTACT/MOBILE NO."
          value={partOneData.contactMobileNumber || ''}
          onChangeText={(text) => onUpdate({ contactMobileNumber: text })}
          placeholder="Mobile number"
          keyboardType="phone-pad"
        />

        <FormTextField
          label="PLACE OF RESIDENCE"
          value={partOneData.placeOfResidence}
          onChangeText={(text) => onUpdate({ placeOfResidence: text })}
          placeholder="Current address"
          required={true}
          error={errors.placeOfResidence}
        />

        <FormTextField
          label="DATE SENT TO MEDICAL FACILITY"
          value={partOneData.dateSentToMedicalFacility}
          onChangeText={(text) => onUpdate({ dateSentToMedicalFacility: text })}
          placeholder="DD/MM/YYYY"
          required={true}
          error={errors.dateSentToMedicalFacility}
        />
      </FormSection>

      <FormSection
        title="ESCORTED TO MEDICAL FACILITY BY (fill as applicable)"
        required={false}
        defaultExpanded={true}
      >
        <View style={styles.escortSection}>
          <Text style={styles.escortTitle}>1. Police Officer</Text>
          <FormTextField
            label="Name and Service NO."
            value={`${partOneData.escortedBy.policeOfficer?.name || ''} ${partOneData.escortedBy.policeOfficer?.serviceNumber || ''}`.trim()}
            onChangeText={(text) => {
              const parts = text.split(' ');
              const serviceNumber = parts.pop() || '';
              const name = parts.join(' ');
              onUpdate({
                escortedBy: {
                  ...partOneData.escortedBy,
                  policeOfficer: { name, serviceNumber, signature: '' },
                },
              });
            }}
            placeholder="Name and Service Number"
          />

          <FormTextField
            label="Signature"
            value={partOneData.escortedBy.policeOfficer?.signature || ''}
            onChangeText={(text) =>
              onUpdate({
                escortedBy: {
                  ...partOneData.escortedBy,
                  policeOfficer: {
                    ...partOneData.escortedBy.policeOfficer,
                    name: partOneData.escortedBy.policeOfficer?.name || '',
                    serviceNumber: partOneData.escortedBy.policeOfficer?.serviceNumber || '',
                    signature: text,
                  },
                },
              })
            }
            placeholder="Signature"
          />
        </View>

        <View style={styles.escortSection}>
          <Text style={styles.escortTitle}>2. Accompanying Authorized Guardian</Text>
          <FormTextField
            label="Name"
            value={partOneData.escortedBy.authorizedGuardian1?.name || ''}
            onChangeText={(text) =>
              onUpdate({
                escortedBy: {
                  ...partOneData.escortedBy,
                  authorizedGuardian1: {
                    ...partOneData.escortedBy.authorizedGuardian1,
                    name: text,
                    idNumber: partOneData.escortedBy.authorizedGuardian1?.idNumber || '',
                  },
                },
              })
            }
            placeholder="Guardian name"
          />

          <FormTextField
            label="ID number"
            value={partOneData.escortedBy.authorizedGuardian1?.idNumber || ''}
            onChangeText={(text) =>
              onUpdate({
                escortedBy: {
                  ...partOneData.escortedBy,
                  authorizedGuardian1: {
                    ...partOneData.escortedBy.authorizedGuardian1,
                    name: partOneData.escortedBy.authorizedGuardian1?.name || '',
                    idNumber: text,
                  },
                },
              })
            }
            placeholder="ID number"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.escortSection}>
          <Text style={styles.escortTitle}>3. Accompanying Authorized Guardian Contact</Text>
          <FormTextField
            label="Contact/Mobile Number"
            value={partOneData.escortedBy.authorizedGuardian2?.contactMobileNumber || ''}
            onChangeText={(text) =>
              onUpdate({
                escortedBy: {
                  ...partOneData.escortedBy,
                  authorizedGuardian2: { contactMobileNumber: text },
                },
              })
            }
            placeholder="Mobile number"
            keyboardType="phone-pad"
          />
        </View>
      </FormSection>

      <FormSection
        title="BRIEF DETAILS OF THE ALLEGED OFFENCE/INCIDENT"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Brief Details"
          value={partOneData.briefDetailsOfAllegedOffence}
          onChangeText={(text) => onUpdate({ briefDetailsOfAllegedOffence: text })}
          placeholder="Enter brief details of alleged offence/incident"
          rows={4}
          required={true}
          error={errors.briefDetailsOfAllegedOffence}
        />
      </FormSection>

      <FormSection
        title="PURPOSE OF EXAMINATION"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Purpose"
          value={partOneData.purposeOfExamination}
          onChangeText={(text) => onUpdate({ purposeOfExamination: text })}
          placeholder="e.g., to conduct a forensic examination for suspected defilement"
          rows={4}
          required={true}
          error={errors.purposeOfExamination}
        />
      </FormSection>

      <FormSection
        title="POLICE OFFICER COMMANDING STATION"
        required={true}
        defaultExpanded={true}
      >
        <FormTextField
          label="NAME"
          value={partOneData.commandingOfficer.name}
          onChangeText={(text) =>
            onUpdate({
              commandingOfficer: {
                ...partOneData.commandingOfficer,
                name: text,
              },
            })
          }
          placeholder="Commanding officer name"
          required={true}
        />

        <FormTextField
          label="SIGNATURE"
          value={partOneData.commandingOfficer.signature || ''}
          onChangeText={(text) =>
            onUpdate({
              commandingOfficer: {
                ...partOneData.commandingOfficer,
                signature: text,
              },
            })
          }
          placeholder="Digital signature or 'SIGNED'"
          helpText="Enter 'SIGNED' or initials to confirm"
        />
      </FormSection>

      {/* Page Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageNumber}>Page 1 of 11</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#0D47A1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerNote: {
    fontSize: 11,
    color: '#BBDEFB',
    fontStyle: 'italic',
  },
  instructionsBox: {
    padding: 12,
    backgroundColor: '#FFF9C4',
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
    margin: 16,
  },
  instructionsText: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 16,
  },
  partOneHeader: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  partOneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4,
  },
  partOneSubtitle: {
    fontSize: 11,
    color: '#424242',
    fontStyle: 'italic',
  },
  inlineFields: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineFieldSmall: {
    flex: 1,
  },
  inlineFieldMedium: {
    flex: 2,
  },
  escortSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  escortTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  pageFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pageNumber: {
    fontSize: 11,
    color: '#757575',
  },
});
