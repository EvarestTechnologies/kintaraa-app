/**
 * P3 Form - Section A: Practitioner Details & Patient Consent
 * Pages 2-3 of Official Kenya Police Medical Examination Report
 *
 * PART TWO - Medical Practitioner Section
 * Section A: Details of Practitioner and Facility + Patient Information & Consent
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormRadioGroup,
  FormTextArea,
} from '@/components/forms/common';
import { P3PractitionerDetails, P3PatientConsent } from '@/types/forms/P3Form_Official';

interface P3SectionAProps {
  practitionerDetails: P3PractitionerDetails;
  patientConsent: P3PatientConsent;
  onUpdatePractitioner: (data: Partial<P3PractitionerDetails>) => void;
  onUpdateConsent: (data: Partial<P3PatientConsent>) => void;
  errors?: {
    practitioner?: Partial<Record<keyof P3PractitionerDetails, string>>;
    consent?: Partial<Record<keyof P3PatientConsent, string>>;
  };
}

export const P3SectionA_PractitionerConsent: React.FC<P3SectionAProps> = ({
  practitionerDetails,
  patientConsent,
  onUpdatePractitioner,
  onUpdateConsent,
  errors = {},
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* PART TWO Header */}
      <View style={styles.partTwoHeader}>
        <Text style={styles.partTwoTitle}>
          PART TWO - DETAILS OF THE FORENSIC MEDICAL EXAMINATION
        </Text>
        <Text style={styles.partTwoSubtitle}>
          (to be completed by the medical practitioner)
        </Text>
      </View>

      {/* Medical/Forensic Facility Reference */}
      <View style={styles.referenceBox}>
        <FormTextField
          label="MEDICAL/FORENSIC FACILITY REFERENCE/ FILE NUMBER"
          value={practitionerDetails.medicalForensicFacilityReferenceNumber}
          onChangeText={(text) =>
            onUpdatePractitioner({ medicalForensicFacilityReferenceNumber: text })
          }
          placeholder="Facility reference number"
          required={true}
          error={errors.practitioner?.medicalForensicFacilityReferenceNumber}
        />
      </View>

      {/* A. DETAILS OF PRACTITIONER AND FACILITY */}
      <FormSection
        title="A. DETAILS OF PRACTITIONER AND FACILITY"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.twoColumnTable}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <FormTextField
                label="NAME OF PRACTITIONER"
                value={practitionerDetails.practitionerName}
                onChangeText={(text) => onUpdatePractitioner({ practitionerName: text })}
                placeholder="Full name"
                required={true}
                error={errors.practitioner?.practitionerName}
              />
            </View>
            <View style={styles.tableCell}>
              <FormTextField
                label="NAME OF MEDICAL/FORENSIC FACILITY"
                value={practitionerDetails.medicalFacilityName}
                onChangeText={(text) => onUpdatePractitioner({ medicalFacilityName: text })}
                placeholder="Facility name"
                required={true}
                error={errors.practitioner?.medicalFacilityName}
              />
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <FormTextField
                label="REGISTRATION NUMBER OF PRACTITIONER"
                value={practitionerDetails.registrationNumber}
                onChangeText={(text) => onUpdatePractitioner({ registrationNumber: text })}
                placeholder="Registration number"
                required={true}
                error={errors.practitioner?.registrationNumber}
              />
            </View>
            <View style={styles.tableCell}>
              <FormTextField
                label="PATIENT RECORD/FILE/REFERENCE NUMBER"
                value={practitionerDetails.patientRecordNumber}
                onChangeText={(text) => onUpdatePractitioner({ patientRecordNumber: text })}
                placeholder="Patient record number"
                required={true}
                error={errors.practitioner?.patientRecordNumber}
              />
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <FormTextField
                label="PRACTITIONER QUALIFICATIONS"
                value={practitionerDetails.qualifications}
                onChangeText={(text) => onUpdatePractitioner({ qualifications: text })}
                placeholder="e.g., MBChB, MPH"
                required={true}
                error={errors.practitioner?.qualifications}
              />
            </View>
            <View style={styles.tableCell}>
              <FormTextField
                label="TELEPHONE CONTACT OF FACILITY"
                value={practitionerDetails.facilityTelephoneContact}
                onChangeText={(text) =>
                  onUpdatePractitioner({ facilityTelephoneContact: text })
                }
                placeholder="Facility phone"
                keyboardType="phone-pad"
                required={true}
              />
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <FormTextField
                label="TELEPHONE CONTACT"
                value={practitionerDetails.telephoneContact}
                onChangeText={(text) => onUpdatePractitioner({ telephoneContact: text })}
                placeholder="Practitioner phone"
                keyboardType="phone-pad"
                required={true}
              />
            </View>
            <View style={styles.tableCell}>
              <FormTextArea
                label="PHYSICAL ADDRESS OF FACILITY"
                value={practitionerDetails.facilityPhysicalAddress}
                onChangeText={(text) =>
                  onUpdatePractitioner({ facilityPhysicalAddress: text })
                }
                placeholder="Complete address"
                rows={2}
                required={true}
              />
            </View>
          </View>
        </View>
      </FormSection>

      {/* B. PATIENT INFORMATION - CONSENT/ASSENT */}
      <FormSection
        title="B. PATIENT INFORMATION"
        subtitle="CONSENT/ASSENT FOR FULL FORENSIC MEDICAL EXAMINATION"
        required={true}
        defaultExpanded={true}
      >
        {/* Consent Declaration Box */}
        <View style={styles.consentBox}>
          <Text style={styles.consentTitle}>
            I understand that this examination will include:
          </Text>
          <Text style={styles.consentItem}>
            a. Full Medical History and a Complete Forensic Medical Examination
          </Text>
          <Text style={styles.consentItem}>
            b. Collection of Forensic specimens and/or Medical samples
          </Text>
          <Text style={styles.consentItem}>
            c. Taking of notes, photographs, videos, digital images for recording and evidential
            purposes including second opinions from forensic/medical experts and peer reviews
          </Text>
          <Text style={styles.consentItem}>
            d. I have been informed that any sensitive photographs, videos, and or digital images
            will be stored securely and only be made available to other non-medical persons on the
            order of a Court.
          </Text>
          <Text style={styles.consentItem}>
            e. I understand and agree that copy of the medical notes/statement/report and expert
            testimony may be given to professionals involved in the case and may be used in court.
          </Text>
          <Text style={styles.consentItem}>
            f. I agree to the use of anonymized photographs/imaging/videos for teaching and
            research purposes.
          </Text>
          <Text style={styles.consentItem}>
            g. I have been advised that I may stop the examination at any point.
          </Text>
        </View>

        <FormRadioGroup
          label="Consent Status"
          options={[
            { label: 'Consent Given', value: 'yes' },
            { label: 'Consent NOT Given', value: 'no' },
          ]}
          value={patientConsent.consentGiven ? 'yes' : 'no'}
          onValueChange={(value) => onUpdateConsent({ consentGiven: value === 'yes' })}
          required={true}
          horizontal={true}
          error={errors.consent?.consentGiven}
        />

        {patientConsent.consentGiven ? (
          <>
            <FormTextField
              label="FULL NAMES OF THE PATIENT"
              value={patientConsent.patientFullNames}
              onChangeText={(text) => onUpdateConsent({ patientFullNames: text })}
              placeholder="Patient full names"
              required={true}
              error={errors.consent?.patientFullNames}
            />

            <FormTextField
              label="FULL NAMES OF AUTHORISED GUARDIAN (where applicable)"
              value={patientConsent.authorizedGuardianFullNames || ''}
              onChangeText={(text) => onUpdateConsent({ authorizedGuardianFullNames: text })}
              placeholder="Guardian full names (for minors)"
              helpText="Required for patients under 18 years"
            />

            <FormTextField
              label="SIGNATURE AND DATE"
              value={patientConsent.consentDate}
              onChangeText={(text) => onUpdateConsent({ consentDate: text })}
              placeholder="DD/MM/YYYY"
              required={true}
              error={errors.consent?.consentDate}
            />

            <FormTextField
              label="PATIENT SIGNATURE"
              value={patientConsent.patientSignature || ''}
              onChangeText={(text) => onUpdateConsent({ patientSignature: text })}
              placeholder="Digital signature or 'SIGNED'"
              helpText="Enter 'SIGNED' or initials"
            />

            {patientConsent.authorizedGuardianFullNames && (
              <FormTextField
                label="GUARDIAN SIGNATURE"
                value={patientConsent.guardianSignature || ''}
                onChangeText={(text) => onUpdateConsent({ guardianSignature: text })}
                placeholder="Guardian signature"
              />
            )}
          </>
        ) : (
          <FormTextArea
            label="CONSENT NOT GIVEN - Indicate Reason(s)"
            value={patientConsent.consentNotGivenReason || ''}
            onChangeText={(text) => onUpdateConsent({ consentNotGivenReason: text })}
            placeholder="Explain why consent was not obtained"
            rows={3}
            required={true}
            error={errors.consent?.consentNotGivenReason}
            helpText="Document reasons clearly for legal purposes"
          />
        )}
      </FormSection>

      {/* Patient Demographics */}
      <FormSection
        title="Patient Demographics"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.inlineFields}>
          <View style={styles.inlineFieldSmall}>
            <FormTextField
              label="DATE OF BIRTH"
              value={patientConsent.dateOfBirth}
              onChangeText={(text) => onUpdateConsent({ dateOfBirth: text })}
              placeholder="DD/MM/YYYY"
              required={true}
              error={errors.consent?.dateOfBirth}
            />
          </View>
          <View style={styles.inlineFieldSmall}>
            <FormTextField
              label="AGE"
              value={patientConsent.age?.toString() || ''}
              onChangeText={(text) => {
                const age = parseInt(text, 10);
                if (!isNaN(age) || text === '') {
                  onUpdateConsent({ age: isNaN(age) ? 0 : age });
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
              value={patientConsent.sex}
              onValueChange={(value) => onUpdateConsent({ sex: value as any })}
              required={true}
              horizontal={true}
            />
          </View>
        </View>

        <FormTextField
          label="PATIENT ACCOMPANIED BY"
          value={patientConsent.patientAccompaniedBy || ''}
          onChangeText={(text) => onUpdateConsent({ patientAccompaniedBy: text })}
          placeholder="Name and relationship"
        />

        <FormTextField
          label="PERSONS PRESENT DURING EXAMINATION (Maximum 2)"
          value={patientConsent.personsPresent.join(', ')}
          onChangeText={(text) => {
            const persons = text.split(',').map((p) => p.trim()).filter(Boolean);
            onUpdateConsent({ personsPresent: persons.slice(0, 2) });
          }}
          placeholder="Names of persons present (comma-separated)"
          helpText="Maximum 2 persons, separate with commas"
        />
      </FormSection>

      {/* Page Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageNumber}>Page 2-3 of 11</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  partTwoHeader: {
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  partTwoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  partTwoSubtitle: {
    fontSize: 11,
    color: '#424242',
    fontStyle: 'italic',
  },
  referenceBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  twoColumnTable: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tableCell: {
    flex: 1,
  },
  consentBox: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginBottom: 16,
  },
  consentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  consentItem: {
    fontSize: 11,
    color: '#424242',
    marginBottom: 8,
    paddingLeft: 8,
    lineHeight: 16,
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
