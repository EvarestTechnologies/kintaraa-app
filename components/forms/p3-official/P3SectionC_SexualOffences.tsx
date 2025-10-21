/**
 * P3 Form - Section C: Sexual Offences Examination
 * Pages 5-7 of Official Kenya Police Medical Examination Report
 *
 * TO BE COMPLETED IN ALLEGED SEXUAL OFFENCES AFTER SECTIONS A AND B
 *
 * Includes:
 * - Female genital examination (Tanner stage, detailed anatomy)
 * - Male genital examination
 * - Specimen collection (12 forensic sample types)
 * - Medication administered
 * - Recommendations/Referrals
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormTextArea,
  FormRadioGroup,
  FormCheckboxGroup,
} from '@/components/forms/common';
import { P3SexualOffencesExamination } from '@/types/forms/P3Form_Official';

interface P3SectionCProps {
  sexualOffencesExam: P3SexualOffencesExamination;
  patientSex: 'male' | 'female' | 'intersex';
  onUpdate: (data: Partial<P3SexualOffencesExamination>) => void;
  errors?: Partial<Record<keyof P3SexualOffencesExamination, string>>;
}

export const P3SectionC_SexualOffences: React.FC<P3SectionCProps> = ({
  sexualOffencesExam,
  patientSex,
  onUpdate,
  errors = {},
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* SECTION C Header */}
      <View style={styles.sectionCHeader}>
        <Text style={styles.sectionCTitle}>
          SECTION C: SEXUAL OFFENCES TO BE COMPLETED IN ALLEGED SEXUAL OFFENCES AFTER THE
          COMPLETION OF SECTIONS "A" AND "B"
        </Text>
        <Text style={styles.sectionCSubtitle}>
          (Refer to annexes for labelled diagram of anatomy)
        </Text>
      </View>

      {/* GENITAL EXAMINATION Header */}
      <View style={styles.genitalExamHeader}>
        <Text style={styles.genitalExamTitle}>GENITAL EXAMINATION</Text>
      </View>

      {/* FEMALE GENITAL EXAMINATION */}
      {(patientSex === 'female' || patientSex === 'intersex') && (
        <>
          <FormSection
            title="1. FEMALE GENITAL EXAMINATION"
            required={true}
            defaultExpanded={true}
          >
            <FormTextField
              label="Tanner Stage (children - refer to annex)"
              value={sexualOffencesExam.femaleExamination?.tannerStage || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    tannerStage: text,
                  },
                })
              }
              placeholder="Tanner stage I-V"
              helpText="For prepubertal/adolescent patients - see Appendix 2"
            />

            <Text style={styles.examinationInstructions}>
              Describe the physical state (anatomy) and any injuries to the genitalia with
              reference to:
            </Text>

            <FormTextArea
              label="Labia majora"
              value={sexualOffencesExam.femaleExamination?.labiaMajora || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    labiaMajora: text,
                  },
                })
              }
              placeholder="Describe appearance, swelling, bruising, lacerations, tears"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Labia minora"
              value={sexualOffencesExam.femaleExamination?.labiaMinora || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    labiaMinora: text,
                  },
                })
              }
              placeholder="Describe appearance, injuries, asymmetry"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Clitoris and peri-urethral area"
              value={sexualOffencesExam.femaleExamination?.clitorisAndPeriUrethralArea || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    clitorisAndPeriUrethralArea: text,
                  },
                })
              }
              placeholder="Describe clitoris, urethral meatus, peri-urethral area"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Vestibule"
              value={sexualOffencesExam.femaleExamination?.vestibule || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    vestibule: text,
                  },
                })
              }
              placeholder="Describe vestibule appearance, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Hymen: describe the posterior rim, edges of the hymen, posterior fourchette including any injuries"
              value={sexualOffencesExam.femaleExamination?.hymen || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    hymen: text,
                  },
                })
              }
              placeholder="Describe hymenal configuration (annular, crescentic, septate), integrity, tears (position by clock face), posterior rim width, posterior fourchette"
              rows={4}
              required={true}
              helpText="Critical forensic detail - document thoroughly"
            />

            <FormTextArea
              label="Vagina"
              value={sexualOffencesExam.femaleExamination?.vagina || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    vagina: text,
                  },
                })
              }
              placeholder="Describe vaginal walls, rugae, injuries, lacerations"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Cervix"
              value={sexualOffencesExam.femaleExamination?.cervix || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    cervix: text,
                  },
                })
              }
              placeholder="Describe cervix appearance, os, discharge, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Note and describe any presence of discharge, blood or infection"
              value={sexualOffencesExam.femaleExamination?.dischargeBloodInfection || ''}
              onChangeText={(text) =>
                onUpdate({
                  femaleExamination: {
                    ...sexualOffencesExam.femaleExamination!,
                    dischargeBloodInfection: text,
                  },
                })
              }
              placeholder="Document color, consistency, odor, amount of any discharge or bleeding"
              rows={2}
            />

            {/* Position During Examination */}
            <View style={styles.positionBox}>
              <Text style={styles.positionTitle}>POSITION DURING EXAMINATION</Text>
              <FormCheckboxGroup
                label="Position(s) used"
                options={[
                  { label: 'Supine', value: 'supine' },
                  { label: 'Left lateral', value: 'leftLateral' },
                  { label: 'Knee chest', value: 'kneeChest' },
                ]}
                values={Object.keys(
                  sexualOffencesExam.femaleExamination?.positionDuringExamination || {}
                ).filter(
                  (key) =>
                    sexualOffencesExam.femaleExamination?.positionDuringExamination?.[
                      key as keyof typeof sexualOffencesExam.femaleExamination.positionDuringExamination
                    ]
                )}
                onValuesChange={(newValues) => {
                  onUpdate({
                    femaleExamination: {
                      ...sexualOffencesExam.femaleExamination!,
                      positionDuringExamination: {
                        supine: newValues.includes('supine'),
                        leftLateral: newValues.includes('leftLateral'),
                        kneeChest: newValues.includes('kneeChest'),
                      },
                    },
                  });
                }}
              />

              <FormRadioGroup
                label="Speculum used?"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={sexualOffencesExam.femaleExamination?.speculumUsed ? 'yes' : 'no'}
                onValueChange={(value) =>
                  onUpdate({
                    femaleExamination: {
                      ...sexualOffencesExam.femaleExamination!,
                      speculumUsed: value === 'yes',
                    },
                  })
                }
                horizontal={true}
              />
            </View>
          </FormSection>

          {/* SPECIMEN COLLECTION - Female */}
          <FormSection
            title="SPECIMEN COLLECTION (3 swabs per sample)"
            required={true}
            defaultExpanded={true}
          >
            {/* Medical Samples */}
            <View style={styles.specimenSection}>
              <Text style={styles.specimenSectionTitle}>MEDICAL SAMPLES</Text>
              <FormRadioGroup
                label="Blood"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={sexualOffencesExam.specimenCollection.medicalSamples.blood ? 'yes' : 'no'}
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      medicalSamples: {
                        ...sexualOffencesExam.specimenCollection.medicalSamples,
                        blood: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
                required={true}
              />

              <FormRadioGroup
                label="Urine"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={sexualOffencesExam.specimenCollection.medicalSamples.urine ? 'yes' : 'no'}
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      medicalSamples: {
                        ...sexualOffencesExam.specimenCollection.medicalSamples,
                        urine: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
                required={true}
              />
            </View>

            {/* Forensic Serology Samples */}
            <View style={styles.specimenSection}>
              <Text style={styles.specimenSectionTitle}>FORENSIC SEROLOGY SAMPLES</Text>

              <FormRadioGroup
                label="Reference sample"
                options={[
                  { label: 'Buccal swab', value: 'buccal_swab' },
                  { label: 'Blood sample', value: 'blood_sample' },
                  { label: 'Not collected', value: 'none' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.referenceSample
                    .type || 'none'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        referenceSample: {
                          collected: value !== 'none',
                          type: value === 'none' ? null : (value as any),
                        },
                      },
                    },
                  })
                }
                horizontal={false}
                required={true}
              />

              <FormRadioGroup
                label="Oral Swab (In case of ejaculation)"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.oralSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        oralSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="Bite mark Swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.biteMarkSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        biteMarkSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="Pubic Hair"
                options={[
                  { label: 'Combed', value: 'combed' },
                  { label: 'Shaved', value: 'shaved' },
                  { label: 'Plucked', value: 'plucked' },
                  { label: 'Not collected', value: 'none' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.pubicHair.method ||
                  'none'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        pubicHair: {
                          collected: value !== 'none',
                          method: value === 'none' ? null : (value as any),
                        },
                      },
                    },
                  })
                }
                horizontal={false}
              />

              <FormRadioGroup
                label="Low vaginal swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.lowVaginalSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        lowVaginalSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="High Vaginal Swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.highVaginalSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        highVaginalSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="Endo-cervical swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.endoCervicalSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        endoCervicalSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="Anal Swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.analSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        analSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />

              <FormRadioGroup
                label="Finger nail clippings/scrapings"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples
                    .fingerNailClippingsScrapings
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        fingerNailClippingsScrapings: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />
            </View>
          </FormSection>
        </>
      )}

      {/* MALE GENITAL EXAMINATION */}
      {(patientSex === 'male' || patientSex === 'intersex') && (
        <>
          <FormSection
            title="2. MALE GENITAL EXAMINATION"
            required={true}
            defaultExpanded={true}
          >
            <FormTextField
              label="Tanner stage (children - refer to Annex)"
              value={sexualOffencesExam.maleExamination?.tannerStage || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    tannerStage: text,
                  },
                })
              }
              placeholder="Tanner stage I-V"
              helpText="For prepubertal/adolescent patients - see Appendix 2"
            />

            <Text style={styles.examinationInstructions}>
              Describe in detail the physical state (anatomy) of and injuries to the:
            </Text>

            <FormTextArea
              label="Prepuce/frenulum"
              value={sexualOffencesExam.maleExamination?.prepuceFrenulum || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    prepuceFrenulum: text,
                  },
                })
              }
              placeholder="Describe prepuce/foreskin, frenulum, circumcision status, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Shaft"
              value={sexualOffencesExam.maleExamination?.shaft || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    shaft: text,
                  },
                })
              }
              placeholder="Describe penile shaft, skin, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Scrotum"
              value={sexualOffencesExam.maleExamination?.scrotum || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    scrotum: text,
                  },
                })
              }
              placeholder="Describe scrotal skin, testes, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Anus"
              value={sexualOffencesExam.maleExamination?.anus || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    anus: text,
                  },
                })
              }
              placeholder="Describe anal verge, sphincter tone, fissures, tears, injuries"
              rows={2}
              required={true}
            />

            <FormTextArea
              label="Note presence of discharge from the prepuce, around anus, or/ on thighs, etc; whether recent or of long standing"
              value={sexualOffencesExam.maleExamination?.dischargeNotes || ''}
              onChangeText={(text) =>
                onUpdate({
                  maleExamination: {
                    ...sexualOffencesExam.maleExamination!,
                    dischargeNotes: text,
                  },
                })
              }
              placeholder="Document any discharge - color, consistency, location, chronicity"
              rows={3}
            />
          </FormSection>

          {/* SPECIMEN COLLECTION - Male (similar to female but without vaginal swabs) */}
          <FormSection
            title="SPECIMEN COLLECTION (3 swabs per sample)"
            required={true}
            defaultExpanded={true}
          >
            {/* Medical + Forensic samples for male - similar structure but without vaginal swabs */}
            <View style={styles.specimenSection}>
              <Text style={styles.specimenSectionTitle}>FORENSIC SEROLOGY SAMPLES</Text>

              <FormRadioGroup
                label="Rectal swab"
                options={[
                  { label: 'YES', value: 'yes' },
                  { label: 'NO', value: 'no' },
                ]}
                value={
                  sexualOffencesExam.specimenCollection.forensicSerologysamples.rectalSwab
                    ? 'yes'
                    : 'no'
                }
                onValueChange={(value) =>
                  onUpdate({
                    specimenCollection: {
                      ...sexualOffencesExam.specimenCollection,
                      forensicSerologysamples: {
                        ...sexualOffencesExam.specimenCollection.forensicSerologysamples,
                        rectalSwab: value === 'yes',
                      },
                    },
                  })
                }
                horizontal={true}
              />
            </View>
          </FormSection>
        </>
      )}

      {/* ADDITIONAL REMARKS/CONCLUSION */}
      <FormSection
        title="ADDITIONAL REMARKS/CONCLUSION BY THE PRACTITIONER"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Additional Remarks/Conclusion"
          value={sexualOffencesExam.additionalRemarksConclusion}
          onChangeText={(text) => onUpdate({ additionalRemarksConclusion: text })}
          placeholder="Summary of genital examination findings, clinical significance, consistency with allegations, expert opinion"
          rows={5}
          required={true}
          error={errors.additionalRemarksConclusion}
        />
      </FormSection>

      {/* MEDICATION ADMINISTERED */}
      <FormSection
        title="MEDICATION ADMINISTERED"
        subtitle="Note any medication administered prior to or after examination eg PEP, EC, TT, Hep B"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Medication Administered"
          value={sexualOffencesExam.medicationAdministered}
          onChangeText={(text) => onUpdate({ medicationAdministered: text })}
          placeholder="Document: PEP (Post-Exposure Prophylaxis), EC (Emergency Contraception), TT (Tetanus Toxoid), Hep B vaccine, antibiotics, pain medication, etc. Include dosages and times."
          rows={4}
          required={true}
          error={errors.medicationAdministered}
          helpText="Critical for time-sensitive interventions like PEP (72hrs) and EC (120hrs)"
        />
      </FormSection>

      {/* RECOMMENDATIONS/REFERRALS */}
      <FormSection
        title="RECOMMENDATIONS/REFERRALS"
        subtitle="e.g., urgent need for children officer/pediatrician review/admission"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Recommendations/Referrals"
          value={sexualOffencesExam.recommendationsReferrals}
          onChangeText={(text) => onUpdate({ recommendationsReferrals: text })}
          placeholder="Document: follow-up appointments, specialist referrals (pediatrician, psychiatrist, gynecologist), admission requirements, police follow-up, social services, counseling services, etc."
          rows={4}
          required={true}
          error={errors.recommendationsReferrals}
        />
      </FormSection>

      {/* Page Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageNumber}>Page 5-7 of 11</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionCHeader: {
    padding: 16,
    backgroundColor: '#FCE4EC',
    borderLeftWidth: 4,
    borderLeftColor: '#C2185B',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionCTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#880E4F',
    marginBottom: 4,
    lineHeight: 18,
  },
  sectionCSubtitle: {
    fontSize: 11,
    color: '#424242',
    fontStyle: 'italic',
  },
  genitalExamHeader: {
    padding: 12,
    backgroundColor: '#F3E5F5',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  genitalExamTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A1B9A',
    textAlign: 'center',
  },
  examinationInstructions: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 12,
    fontStyle: 'italic',
    backgroundColor: '#FFF9C4',
    padding: 8,
    borderRadius: 4,
  },
  positionBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  positionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  specimenSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  specimenSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 12,
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
