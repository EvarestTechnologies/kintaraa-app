/**
 * P3 Form - Section B: General Examination
 * Pages 3-5 of Official Kenya Police Medical Examination Report
 *
 * Includes:
 * - Vital signs
 * - State of clothing
 * - Physical appearance and behavior
 * - Toxicology samples
 * - Detailed physical examination by body regions
 * - Injury assessment
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormTextArea,
  FormRadioGroup,
} from '@/components/forms/common';
import {
  P3GeneralExamination,
  P3PhysicalExamination,
} from '@/types/forms/P3Form_Official';

interface P3SectionBProps {
  generalExamination: P3GeneralExamination;
  physicalExamination: P3PhysicalExamination;
  onUpdateGeneral: (data: Partial<P3GeneralExamination>) => void;
  onUpdatePhysical: (data: Partial<P3PhysicalExamination>) => void;
  errors?: {
    general?: Partial<Record<keyof P3GeneralExamination, string>>;
    physical?: Partial<Record<keyof P3PhysicalExamination, string>>;
  };
}

export const P3SectionB_GeneralExamination: React.FC<P3SectionBProps> = ({
  generalExamination,
  physicalExamination,
  onUpdateGeneral,
  onUpdatePhysical,
  errors = {},
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SECTION B: GENERAL EXAMINATION</Text>
        <Text style={styles.sectionSubtitle}>
          (All specimens collected must be properly packaged, labelled and preserved)
        </Text>
      </View>

      {/* VITAL SIGNS */}
      <FormSection
        title="VITAL SIGNS"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.vitalSignsGrid}>
          <View style={styles.vitalSignRow}>
            <View style={styles.vitalSignCell}>
              <FormTextField
                label="Heart Rate"
                value={generalExamination.vitalSigns.heartRate}
                onChangeText={(text) =>
                  onUpdateGeneral({
                    vitalSigns: { ...generalExamination.vitalSigns, heartRate: text },
                  })
                }
                placeholder="bpm"
                keyboardType="numeric"
                required={true}
              />
            </View>
            <View style={styles.vitalSignCell}>
              <FormTextField
                label="Respiratory Rate"
                value={generalExamination.vitalSigns.respiratoryRate}
                onChangeText={(text) =>
                  onUpdateGeneral({
                    vitalSigns: { ...generalExamination.vitalSigns, respiratoryRate: text },
                  })
                }
                placeholder="breaths/min"
                keyboardType="numeric"
                required={true}
              />
            </View>
          </View>

          <View style={styles.vitalSignRow}>
            <View style={styles.vitalSignCell}>
              <FormTextField
                label="Blood Pressure"
                value={generalExamination.vitalSigns.bloodPressure}
                onChangeText={(text) =>
                  onUpdateGeneral({
                    vitalSigns: { ...generalExamination.vitalSigns, bloodPressure: text },
                  })
                }
                placeholder="120/80 mmHg"
                required={true}
              />
            </View>
            <View style={styles.vitalSignCell}>
              <FormTextField
                label="Temperature"
                value={generalExamination.vitalSigns.temperature}
                onChangeText={(text) =>
                  onUpdateGeneral({
                    vitalSigns: { ...generalExamination.vitalSigns, temperature: text },
                  })
                }
                placeholder="°C"
                keyboardType="numeric"
                required={true}
              />
            </View>
          </View>

          <FormTextField
            label="Oedema"
            value={generalExamination.vitalSigns.oedema || ''}
            onChangeText={(text) =>
              onUpdateGeneral({
                vitalSigns: { ...generalExamination.vitalSigns, oedema: text },
              })
            }
            placeholder="Document any oedema"
          />

          <FormTextField
            label="Lymph Nodes"
            value={generalExamination.vitalSigns.lymphNodes || ''}
            onChangeText={(text) =>
              onUpdateGeneral({
                vitalSigns: { ...generalExamination.vitalSigns, lymphNodes: text },
              })
            }
            placeholder="Document lymph node findings"
          />
        </View>
      </FormSection>

      {/* STATE OF CLOTHING */}
      <FormSection
        title="STATE OF CLOTHING"
        subtitle="Torn/damaged/blood stained/soiled. Indicate if clothes were changed."
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Description"
          value={generalExamination.stateOfClothing.description}
          onChangeText={(text) =>
            onUpdateGeneral({
              stateOfClothing: { ...generalExamination.stateOfClothing, description: text },
            })
          }
          placeholder="Describe condition of clothing - torn, damaged, bloodstained, soiled. Indicate if clothes were changed since incident."
          rows={3}
          required={true}
          error={errors.general?.stateOfClothing}
        />

        <FormTextArea
          label="Describe the stains/debris"
          value={generalExamination.stateOfClothing.stainsDebrisDescription || ''}
          onChangeText={(text) =>
            onUpdateGeneral({
              stateOfClothing: {
                ...generalExamination.stateOfClothing,
                stainsDebrisDescription: text,
              },
            })
          }
          placeholder="e.g., white colored discharge possibly semen, blood stains on pants, mud on shirt"
          rows={2}
          helpText="Be specific about color, location, and nature of stains"
        />

        <FormRadioGroup
          label="Clothing Collected For Forensic Analysis"
          options={[
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          value={
            generalExamination.stateOfClothing.clothingCollectedForForensicAnalysis ? 'yes' : 'no'
          }
          onValueChange={(value) =>
            onUpdateGeneral({
              stateOfClothing: {
                ...generalExamination.stateOfClothing,
                clothingCollectedForForensicAnalysis: value === 'yes',
              },
            })
          }
          horizontal={true}
          required={true}
        />

        {!generalExamination.stateOfClothing.clothingCollectedForForensicAnalysis && (
          <FormTextField
            label="IF NO GIVE REASONS"
            value={generalExamination.stateOfClothing.reasonIfNotCollected || ''}
            onChangeText={(text) =>
              onUpdateGeneral({
                stateOfClothing: {
                  ...generalExamination.stateOfClothing,
                  reasonIfNotCollected: text,
                },
              })
            }
            placeholder="Explain why clothing was not collected"
            required={true}
          />
        )}
      </FormSection>

      {/* PHYSICAL APPEARANCE AND BEHAVIOR */}
      <FormSection
        title="Describe the physical appearance and behavior"
        subtitle="e.g., orientation, grooming, coherent, anxious"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Physical Appearance and Behavior"
          value={generalExamination.physicalAppearanceAndBehavior}
          onChangeText={(text) => onUpdateGeneral({ physicalAppearanceAndBehavior: text })}
          placeholder="Document patient's orientation, level of consciousness, grooming, hygiene, coherence, emotional state (anxious, calm, distressed, cooperative, uncooperative)"
          rows={4}
          required={true}
          error={errors.general?.physicalAppearanceAndBehavior}
        />

        <View style={styles.measurementsRow}>
          <View style={styles.measurementCell}>
            <FormTextField
              label="Height"
              value={generalExamination.height || ''}
              onChangeText={(text) => onUpdateGeneral({ height: text })}
              placeholder="cm"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.measurementCell}>
            <FormTextField
              label="Weight"
              value={generalExamination.weight || ''}
              onChangeText={(text) => onUpdateGeneral({ weight: text })}
              placeholder="kg"
              keyboardType="numeric"
            />
          </View>
        </View>

        <FormRadioGroup
          label="General Body Build"
          options={[
            { label: 'Frail', value: 'frail' },
            { label: 'Normal', value: 'normal' },
            { label: 'Obese', value: 'obese' },
            { label: 'Other', value: 'other' },
          ]}
          value={generalExamination.generalBodyBuild}
          onValueChange={(value) => onUpdateGeneral({ generalBodyBuild: value as any })}
          horizontal={false}
          required={true}
        />

        {generalExamination.generalBodyBuild === 'other' && (
          <FormTextField
            label="Specify Other Body Build"
            value={generalExamination.generalBodyBuildOther || ''}
            onChangeText={(text) => onUpdateGeneral({ generalBodyBuildOther: text })}
            placeholder="Describe body build"
            required={true}
          />
        )}

        <FormTextField
          label="Percentiles (Children Only)"
          value={generalExamination.percentiles || ''}
          onChangeText={(text) => onUpdateGeneral({ percentiles: text })}
          placeholder="Growth percentiles for children"
          helpText="Document height/weight percentiles for pediatric patients"
        />

        <FormTextArea
          label="Other Relevant Information"
          value={generalExamination.otherRelevantInformation || ''}
          onChangeText={(text) => onUpdateGeneral({ otherRelevantInformation: text })}
          placeholder="Any other relevant observations"
          rows={2}
        />
      </FormSection>

      {/* CLINICAL EVIDENCE OF INTOXICATION */}
      <FormSection
        title="Clinical evidence of intoxication"
        subtitle="e.g., slurred speech, dilated pupils, ataxia, altered consciousness etc"
        required={false}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Intoxication Evidence"
          value={generalExamination.clinicalEvidenceOfIntoxication || ''}
          onChangeText={(text) => onUpdateGeneral({ clinicalEvidenceOfIntoxication: text })}
          placeholder="Document any signs of drug or alcohol intoxication: slurred speech, dilated/constricted pupils, ataxia, altered consciousness, smell of alcohol, etc."
          rows={3}
        />
      </FormSection>

      {/* SAMPLES COLLECTED FOR TOXICOLOGY */}
      <FormSection
        title="SAMPLES COLLECTED FOR TOXICOLOGY WHERE RELEVANT"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.toxicologySamples}>
          <FormRadioGroup
            label="BLOOD"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={generalExamination.toxicologySamples.blood ? 'yes' : 'no'}
            onValueChange={(value) =>
              onUpdateGeneral({
                toxicologySamples: {
                  ...generalExamination.toxicologySamples,
                  blood: value === 'yes',
                },
              })
            }
            horizontal={true}
            required={true}
          />

          <FormRadioGroup
            label="URINE"
            options={[
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ]}
            value={generalExamination.toxicologySamples.urine ? 'yes' : 'no'}
            onValueChange={(value) =>
              onUpdateGeneral({
                toxicologySamples: {
                  ...generalExamination.toxicologySamples,
                  urine: value === 'yes',
                },
              })
            }
            horizontal={true}
            required={true}
          />
        </View>
      </FormSection>

      {/* PHYSICAL EXAMINATION - Body Regions */}
      <View style={styles.physicalExamHeader}>
        <Text style={styles.physicalExamTitle}>PHYSICAL EXAMINATION</Text>
        <Text style={styles.physicalExamSubtitle}>
          Describe the nature, position, shape, extent of injuries on the body. The general
          position of all injuries must be denoted on the annexed body charts. Note any traditional
          marks/ornaments. Photographs must be documented. Refer to annexes for labelled diagram of
          anatomy
        </Text>
      </View>

      <FormSection title="Head and Neck" required={true} defaultExpanded={true}>
        <FormTextArea
          label="Head and Neck Examination"
          value={physicalExamination.headAndNeck}
          onChangeText={(text) => onUpdatePhysical({ headAndNeck: text })}
          placeholder="Document findings: injuries, swelling, bruising, abrasions, lacerations"
          rows={3}
          required={true}
          error={errors.physical?.headAndNeck}
        />
      </FormSection>

      <FormSection
        title="Oral"
        subtitle="note any injuries in the mouth"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Oral Examination"
          value={physicalExamination.oral}
          onChangeText={(text) => onUpdatePhysical({ oral: text })}
          placeholder="Document oral cavity findings: tears, bruising, dental injuries, palate injuries"
          rows={3}
          required={true}
          error={errors.physical?.oral}
        />
      </FormSection>

      <FormSection
        title="Eye/Orbit"
        subtitle="Left and Right, including petechiae, intraorbital/retinal hemorrhage"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Eye/Orbit Examination"
          value={physicalExamination.eyeOrbit}
          onChangeText={(text) => onUpdatePhysical({ eyeOrbit: text })}
          placeholder="Document findings for both eyes: petechiae, subconjunctival hemorrhage, periorbital bruising, retinal hemorrhage"
          rows={3}
          required={true}
          error={errors.physical?.eyeOrbit}
        />
      </FormSection>

      <FormSection title="Scalp" required={true} defaultExpanded={true}>
        <FormTextArea
          label="Scalp Examination"
          value={physicalExamination.scalp}
          onChangeText={(text) => onUpdatePhysical({ scalp: text })}
          placeholder="Document scalp findings: swelling, hematoma, lacerations, hair pulling"
          rows={2}
          required={true}
          error={errors.physical?.scalp}
        />
      </FormSection>

      <FormSection
        title="ENT"
        subtitle="including any injuries within and around the ears"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="ENT Examination"
          value={physicalExamination.ent}
          onChangeText={(text) => onUpdatePhysical({ ent: text })}
          placeholder="Document ear, nose, throat findings: tympanic membrane, nasal septum, pharynx"
          rows={3}
          required={true}
          error={errors.physical?.ent}
        />
      </FormSection>

      <FormSection
        title="CNS"
        subtitle="level of consciousness – A.V.P.U, Gait, other"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="CNS Examination"
          value={physicalExamination.cns}
          onChangeText={(text) => onUpdatePhysical({ cns: text })}
          placeholder="Document neurological findings: AVPU (Alert/Voice/Pain/Unresponsive), gait, coordination, reflexes, focal deficits"
          rows={3}
          required={true}
          error={errors.physical?.cns}
          helpText="AVPU: Alert, responds to Voice, responds to Pain, Unresponsive"
        />
      </FormSection>

      <FormSection
        title="Chest"
        subtitle="note any distension, tenderness, abnormality, irregular breathing, cardiac disorders"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Chest Examination"
          value={physicalExamination.chest}
          onChangeText={(text) => onUpdatePhysical({ chest: text })}
          placeholder="Document chest findings: bruising, tenderness, breath sounds, cardiac rhythm"
          rows={3}
          required={true}
          error={errors.physical?.chest}
        />
      </FormSection>

      <FormSection
        title="Abdomen"
        subtitle="note any distension, tenderness, abnormality"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Abdomen Examination"
          value={physicalExamination.abdomen}
          onChangeText={(text) => onUpdatePhysical({ abdomen: text })}
          placeholder="Document abdominal findings: distension, tenderness, guarding, masses, organomegaly"
          rows={3}
          required={true}
          error={errors.physical?.abdomen}
        />
      </FormSection>

      <FormSection title="Upper Limbs" required={true} defaultExpanded={true}>
        <FormTextArea
          label="Upper Limbs Examination"
          value={physicalExamination.upperLimbs}
          onChangeText={(text) => onUpdatePhysical({ upperLimbs: text })}
          placeholder="Document findings on arms, forearms, hands: bruising, defensive injuries, fractures, range of motion"
          rows={3}
          required={true}
          error={errors.physical?.upperLimbs}
        />
      </FormSection>

      <FormSection title="Lower Limbs" required={true} defaultExpanded={true}>
        <FormTextArea
          label="Lower Limbs Examination"
          value={physicalExamination.lowerLimbs}
          onChangeText={(text) => onUpdatePhysical({ lowerLimbs: text })}
          placeholder="Document findings on thighs, legs, feet: bruising, abrasions, fractures, range of motion"
          rows={3}
          required={true}
          error={errors.physical?.lowerLimbs}
        />
      </FormSection>

      {/* INJURY ASSESSMENT */}
      <FormSection
        title="INJURY ASSESSMENT"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="ESTIMATE AGE OF INJURY(S)"
          value={physicalExamination.estimateAgeOfInjuries}
          onChangeText={(text) => onUpdatePhysical({ estimateAgeOfInjuries: text })}
          placeholder="e.g., Fresh (< 24 hours), Recent (1-7 days), Old (> 7 days). Base on color, swelling, healing stage"
          rows={2}
          required={true}
          error={errors.physical?.estimateAgeOfInjuries}
        />

        <FormTextArea
          label="PROBABLE MECHANISM OF INJURY(S)"
          value={physicalExamination.probableMechanismOfInjuries}
          onChangeText={(text) => onUpdatePhysical({ probableMechanismOfInjuries: text })}
          placeholder="e.g., Blunt force trauma, Sharp force, Strangulation, Burns. Document pattern and distribution"
          rows={3}
          required={true}
          error={errors.physical?.probableMechanismOfInjuries}
        />

        <FormRadioGroup
          label="DEGREE OF INJURY (S)"
          options={[
            { label: 'HARM', value: 'harm' },
            { label: 'GRIEVOUS HARM', value: 'grievous_harm' },
            { label: 'MAIM', value: 'maim' },
          ]}
          value={physicalExamination.degreeOfInjury || ''}
          onValueChange={(value) => onUpdatePhysical({ degreeOfInjury: value as any })}
          horizontal={false}
          required={true}
          helpText="Applies only to Section B"
        />

        <View style={styles.definitionsBox}>
          <Text style={styles.definitionsTitle}>DEFINITIONS:</Text>
          <Text style={styles.definitionText}>
            <Text style={styles.definitionTerm}>"Harm"</Text> Means any bodily hurt, disease or
            disorder whether permanent or temporary.
          </Text>
          <Text style={styles.definitionText}>
            <Text style={styles.definitionTerm}>"Maim"</Text> means the destruction or permanent
            disabling of any external or organ, member or sense
          </Text>
          <Text style={styles.definitionText}>
            <Text style={styles.definitionTerm}>"Grievous Harm"</Text> Means any harm which amounts
            to maim, or endangers life, or seriously or permanently injures health, or which is
            likely so to injure health, or which extends to permanent disfigurement, or to any
            permanent, or serious injury to external or organ.
          </Text>
        </View>
      </FormSection>

      {/* ADDITIONAL NOTES */}
      <FormSection
        title="ADDITIONAL NOTES INCLUDING PREVIOUS TREATMENT AT OTHER FACILITIES"
        required={false}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Additional Notes"
          value={physicalExamination.additionalNotes || ''}
          onChangeText={(text) => onUpdatePhysical({ additionalNotes: text })}
          placeholder="Document any previous treatment, transfer notes, medications given, complications"
          rows={3}
        />
      </FormSection>

      {/* TREATMENT/REFERRAL PLAN */}
      <FormSection
        title="TREATMENT/REFERRAL PLAN"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Treatment and Referral Plan"
          value={physicalExamination.treatmentReferralPlan}
          onChangeText={(text) => onUpdatePhysical({ treatmentReferralPlan: text })}
          placeholder="Document treatment provided, medications given, referrals made, follow-up plans"
          rows={4}
          required={true}
          error={errors.physical?.treatmentReferralPlan}
        />
      </FormSection>

      {/* DECLARATION */}
      <FormSection
        title="PRACTITIONER DECLARATION"
        required={true}
        defaultExpanded={true}
      >
        <View style={styles.declarationBox}>
          <Text style={styles.declarationText}>
            I conducted the above examination on the{' '}
            <Text style={styles.declarationField}>{physicalExamination.examinationDate || '__/__/__'}</Text>{' '}
            and declare that the contents of this form is true to the best of my knowledge and
            belief and I am making this statement knowing that, if it were tendered in evidence, I
            would be liable to prosecution if I willfully stated in it anything I knew to be false
            or which I do not believe to be true.
          </Text>

          <FormTextField
            label="Date of Examination"
            value={physicalExamination.examinationDate}
            onChangeText={(text) => onUpdatePhysical({ examinationDate: text })}
            placeholder="DD/MM/YYYY"
            required={true}
            error={errors.physical?.examinationDate}
          />

          <FormTextField
            label="Name of medical practitioner (full names)"
            value={physicalExamination.medicalPractitionerName}
            onChangeText={(text) => onUpdatePhysical({ medicalPractitionerName: text })}
            placeholder="Full name"
            required={true}
            error={errors.physical?.medicalPractitionerName}
          />

          <FormTextField
            label="Signature"
            value={physicalExamination.medicalPractitionerSignature || ''}
            onChangeText={(text) => onUpdatePhysical({ medicalPractitionerSignature: text })}
            placeholder="Digital signature or 'SIGNED'"
            helpText="Enter 'SIGNED' or initials to confirm"
          />
        </View>
      </FormSection>

      {/* Page Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageNumber}>Page 3-5 of 11</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#424242',
    fontStyle: 'italic',
  },
  vitalSignsGrid: {
    gap: 12,
  },
  vitalSignRow: {
    flexDirection: 'row',
    gap: 12,
  },
  vitalSignCell: {
    flex: 1,
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  measurementCell: {
    flex: 1,
  },
  toxicologySamples: {
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    gap: 12,
  },
  physicalExamHeader: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  physicalExamTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  physicalExamSubtitle: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 16,
  },
  definitionsBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  definitionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 11,
    color: '#424242',
    marginBottom: 6,
    lineHeight: 16,
  },
  definitionTerm: {
    fontWeight: '600',
    color: '#F57F17',
  },
  declarationBox: {
    padding: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  declarationText: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 16,
    marginBottom: 16,
  },
  declarationField: {
    fontWeight: '600',
    textDecorationLine: 'underline',
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
