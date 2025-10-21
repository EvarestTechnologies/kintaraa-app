/**
 * PRC Form - PART B: Psychological Assessment
 * MOH 363 - PART B
 *
 * Comprehensive mental health evaluation with 12 subsections
 * Includes signatures from examining officer and police officer
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  FormSection,
  FormTextArea,
  FormRadioGroup,
  FormTextField,
  FormDateTimePicker,
} from '@/components/forms/common';
import { PRCPsychologicalAssessment, DateValue, TimeValue } from '@/types/forms';

interface PRCPartBProps {
  assessmentData: PRCPsychologicalAssessment;
  onUpdate: (data: Partial<PRCPsychologicalAssessment>) => void;
  errors?: Partial<Record<keyof PRCPsychologicalAssessment, string>>;
}

export const PRCPartB_PsychologicalAssessment: React.FC<PRCPartBProps> = ({
  assessmentData,
  onUpdate,
  errors = {},
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* PART B Header */}
      <View style={styles.partBHeader}>
        <Text style={styles.partBTitle}>PART B</Text>
        <Text style={styles.partBSubtitle}>PSYCHOLOGICAL ASSESSMENT</Text>
        <Text style={styles.partBDescription}>
          Comprehensive mental health evaluation to assess psychological impact and determine appropriate interventions
        </Text>
      </View>

      {/* 1. General Appearance and Behavior */}
      <FormSection
        sectionNumber="1"
        title="General Appearance and Behavior"
        subtitle="Observe and document overall presentation"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="General appearance and behavior"
          value={assessmentData.generalAppearanceAndBehavior}
          onChangeText={(text) => onUpdate({ generalAppearanceAndBehavior: text })}
          placeholder="Describe patient's overall appearance, grooming, hygiene, posture, eye contact, level of activity, psychomotor activity (agitated, retarded, normal), cooperativeness"
          rows={4}
          required={true}
          error={errors.generalAppearanceAndBehavior}
          helpText="Include: grooming, hygiene, posture, eye contact, psychomotor activity"
        />
      </FormSection>

      {/* 2. Rapport */}
      <FormSection
        sectionNumber="2"
        title="Rapport"
        subtitle="Quality of therapeutic relationship"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Rapport established"
          options={[
            { label: 'Good', value: 'good' },
            { label: 'Fair', value: 'fair' },
            { label: 'Poor', value: 'poor' },
            { label: 'Unable to establish', value: 'unable' },
          ]}
          value={assessmentData.rapport}
          onValueChange={(value) => onUpdate({ rapport: value as any })}
          required={true}
          horizontal={false}
          error={errors.rapport}
          helpText="Assess ease of interaction and trust level"
        />

        <FormTextArea
          label="Rapport comments"
          value={assessmentData.rapportComments || ''}
          onChangeText={(text) => onUpdate({ rapportComments: text })}
          placeholder="Additional observations about rapport (e.g., patient seems guarded, gradually opening up, responding well to support)"
          rows={2}
          helpText="Note any factors affecting rapport"
        />
      </FormSection>

      {/* 3. Mood */}
      <FormSection
        sectionNumber="3"
        title="Mood"
        subtitle="Patient's subjective emotional state"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Mood"
          options={[
            { label: 'Euthymic (Normal)', value: 'euthymic' },
            { label: 'Depressed', value: 'depressed' },
            { label: 'Anxious', value: 'anxious' },
            { label: 'Irritable', value: 'irritable' },
            { label: 'Fearful', value: 'fearful' },
            { label: 'Angry', value: 'angry' },
            { label: 'Other', value: 'other' },
          ]}
          value={assessmentData.mood}
          onValueChange={(value) => onUpdate({ mood: value as any })}
          required={true}
          horizontal={false}
          error={errors.mood}
          helpText="Patient's own description of their emotional state"
        />

        {assessmentData.mood === 'other' && (
          <FormTextField
            label="Specify other mood"
            value={assessmentData.moodOtherSpecify || ''}
            onChangeText={(text) => onUpdate({ moodOtherSpecify: text })}
            placeholder="Describe the mood"
            required={true}
          />
        )}

        <FormTextArea
          label="Mood comments"
          value={assessmentData.moodComments || ''}
          onChangeText={(text) => onUpdate({ moodComments: text })}
          placeholder="Additional details (e.g., 'Patient reports feeling numb', 'Describes overwhelming sadness')"
          rows={2}
          helpText="Patient's own words describing their mood"
        />
      </FormSection>

      {/* 4. Affect */}
      <FormSection
        sectionNumber="4"
        title="Affect"
        subtitle="Clinician's objective observation of emotional expression"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Affect"
          options={[
            { label: 'Appropriate', value: 'appropriate' },
            { label: 'Flat', value: 'flat' },
            { label: 'Blunted', value: 'blunted' },
            { label: 'Labile', value: 'labile' },
            { label: 'Restricted', value: 'restricted' },
            { label: 'Incongruent', value: 'incongruent' },
          ]}
          value={assessmentData.affect}
          onValueChange={(value) => onUpdate({ affect: value as any })}
          required={true}
          horizontal={false}
          error={errors.affect}
          helpText="Your observation of emotional expression and range"
        />

        <FormTextArea
          label="Affect comments"
          value={assessmentData.affectComments || ''}
          onChangeText={(text) => onUpdate({ affectComments: text })}
          placeholder="Describe emotional range, intensity, appropriateness to situation, and changes during interview"
          rows={2}
          helpText="Note congruence with mood and situation"
        />
      </FormSection>

      {/* 5. Speech */}
      <FormSection
        sectionNumber="5"
        title="Speech"
        subtitle="Quality and characteristics of verbal communication"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Speech rate"
          options={[
            { label: 'Normal', value: 'normal' },
            { label: 'Slow', value: 'slow' },
            { label: 'Fast', value: 'fast' },
            { label: 'Pressured', value: 'pressured' },
          ]}
          value={assessmentData.speechRate || 'normal'}
          onValueChange={(value) =>
            onUpdate({
              speech: {
                ...assessmentData.speech,
                rate: value as any,
              },
            })
          }
          horizontal={true}
        />

        <FormRadioGroup
          label="Speech volume"
          options={[
            { label: 'Normal', value: 'normal' },
            { label: 'Soft', value: 'soft' },
            { label: 'Loud', value: 'loud' },
          ]}
          value={assessmentData.speechVolume || 'normal'}
          onValueChange={(value) =>
            onUpdate({
              speech: {
                ...assessmentData.speech,
                volume: value as any,
              },
            })
          }
          horizontal={true}
        />

        <FormRadioGroup
          label="Speech quality"
          options={[
            { label: 'Clear', value: 'clear' },
            { label: 'Slurred', value: 'slurred' },
            { label: 'Hesitant', value: 'hesitant' },
            { label: 'Spontaneous', value: 'spontaneous' },
          ]}
          value={assessmentData.speechQuality || 'clear'}
          onValueChange={(value) =>
            onUpdate({
              speech: {
                ...assessmentData.speech,
                quality: value as any,
              },
            })
          }
          horizontal={false}
        />

        <FormTextArea
          label="Speech comments"
          value={assessmentData.speechComments || ''}
          onChangeText={(text) => onUpdate({ speechComments: text })}
          placeholder="Additional observations (e.g., articulation, fluency, language barriers)"
          rows={2}
          helpText="Note any unusual patterns or difficulties"
        />
      </FormSection>

      {/* 6. Perception */}
      <FormSection
        sectionNumber="6"
        title="Perception"
        subtitle="Hallucinations, illusions, or perceptual disturbances"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Perceptual disturbances present"
          options={[
            { label: 'None', value: 'none' },
            { label: 'Visual hallucinations', value: 'visual_hallucinations' },
            { label: 'Auditory hallucinations', value: 'auditory_hallucinations' },
            { label: 'Tactile hallucinations', value: 'tactile_hallucinations' },
            { label: 'Illusions', value: 'illusions' },
            { label: 'Flashbacks', value: 'flashbacks' },
          ]}
          value={assessmentData.perception}
          onValueChange={(value) => onUpdate({ perception: value as any })}
          required={true}
          horizontal={false}
          error={errors.perception}
          helpText="Screen for hallucinations or intrusive memories"
        />

        <FormTextArea
          label="Perception details"
          value={assessmentData.perceptionComments || ''}
          onChangeText={(text) => onUpdate({ perceptionComments: text })}
          placeholder="If present, describe content, frequency, intensity, and impact on functioning"
          rows={3}
          helpText="Include details about any flashbacks or intrusive thoughts"
        />
      </FormSection>

      {/* 7. Thought Content */}
      <FormSection
        sectionNumber="7"
        title="Thought Content"
        subtitle="What the patient is thinking about"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Thought content"
          value={assessmentData.thoughtContent}
          onChangeText={(text) => onUpdate({ thoughtContent: text })}
          placeholder="Document presence of: suicidal ideation, homicidal ideation, obsessions, preoccupations, delusions, phobias, guilt, shame, self-blame"
          rows={4}
          required={true}
          error={errors.thoughtContent}
          helpText="Screen specifically for suicidal/homicidal ideation"
        />

        {/* Suicidal Ideation Screening */}
        <View style={styles.riskAssessmentBox}>
          <Text style={styles.riskAssessmentTitle}>⚠️ Suicide Risk Assessment</Text>
          <FormRadioGroup
            label="Suicidal ideation present"
            options={[
              { label: 'No', value: 'no' },
              { label: 'Passive (wishes to die)', value: 'passive' },
              { label: 'Active (has plan/intent)', value: 'active' },
            ]}
            value={assessmentData.suicidalIdeation || 'no'}
            onValueChange={(value) => onUpdate({ suicidalIdeation: value as any })}
            required={true}
            horizontal={false}
          />

          {(assessmentData.suicidalIdeation === 'passive' ||
            assessmentData.suicidalIdeation === 'active') && (
            <FormTextArea
              label="Suicide risk details"
              value={assessmentData.suicidalIdeationDetails || ''}
              onChangeText={(text) => onUpdate({ suicidalIdeationDetails: text })}
              placeholder="Document plan, means, intent, protective factors, previous attempts"
              rows={3}
              required={true}
              helpText="IMMEDIATE psychiatric referral if active ideation with plan"
            />
          )}
        </View>
      </FormSection>

      {/* 8. Thought Process */}
      <FormSection
        sectionNumber="8"
        title="Thought Process"
        subtitle="How the patient thinks and organizes thoughts"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Thought process"
          options={[
            { label: 'Linear and goal-directed', value: 'linear_goal_directed' },
            { label: 'Circumstantial', value: 'circumstantial' },
            { label: 'Tangential', value: 'tangential' },
            { label: 'Flight of ideas', value: 'flight_of_ideas' },
            { label: 'Loose associations', value: 'loose_associations' },
            { label: 'Blocking', value: 'blocking' },
          ]}
          value={assessmentData.thoughtProcess}
          onValueChange={(value) => onUpdate({ thoughtProcess: value as any })}
          required={true}
          horizontal={false}
          error={errors.thoughtProcess}
          helpText="Assess organization and coherence of thinking"
        />

        <FormTextArea
          label="Thought process comments"
          value={assessmentData.thoughtProcessComments || ''}
          onChangeText={(text) => onUpdate({ thoughtProcessComments: text })}
          placeholder="Additional observations about logical flow and coherence of thoughts"
          rows={2}
        />
      </FormSection>

      {/* 9. For Children - Wishes/Dreams, Art/Play Therapy */}
      <FormSection
        sectionNumber="9"
        title="For Children - Wishes/Dreams, Art/Play Therapy"
        subtitle="Child-specific assessment techniques"
        required={false}
        defaultExpanded={false}
      >
        <FormTextArea
          label="Wishes and dreams"
          value={assessmentData.forChildren?.wishesAndDreams || ''}
          onChangeText={(text) =>
            onUpdate({
              forChildren: {
                ...assessmentData.forChildren,
                wishesAndDreams: text,
              },
            })
          }
          placeholder="Document child's expressed wishes, dreams, fears, and fantasies"
          rows={3}
          helpText="Use age-appropriate language and play-based techniques"
        />

        <FormTextArea
          label="Art/Play therapy observations"
          value={assessmentData.forChildren?.artPlayTherapyObservations || ''}
          onChangeText={(text) =>
            onUpdate({
              forChildren: {
                ...assessmentData.forChildren,
                artPlayTherapyObservations: text,
              },
            })
          }
          placeholder="Document themes in play, drawings, or other creative expressions. Note any trauma-related themes, aggressive play, or regressive behaviors"
          rows={4}
          helpText="Include themes observed in drawings, play patterns, symbols"
        />
      </FormSection>

      {/* 10. Cognitive Function */}
      <FormSection
        sectionNumber="10"
        title="Cognitive Function"
        subtitle="Mental status examination components"
        required={true}
        defaultExpanded={true}
      >
        {/* Memory */}
        <View style={styles.cognitiveSubsection}>
          <Text style={styles.cognitiveSubsectionTitle}>Memory</Text>
          <FormRadioGroup
            label="Recent memory"
            options={[
              { label: 'Intact', value: 'intact' },
              { label: 'Impaired', value: 'impaired' },
            ]}
            value={assessmentData.cognitiveFunction.memory.recent || 'intact'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  memory: {
                    ...assessmentData.cognitiveFunction.memory,
                    recent: value as any,
                  },
                },
              })
            }
            horizontal={true}
          />

          <FormRadioGroup
            label="Remote memory"
            options={[
              { label: 'Intact', value: 'intact' },
              { label: 'Impaired', value: 'impaired' },
            ]}
            value={assessmentData.cognitiveFunction.memory.remote || 'intact'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  memory: {
                    ...assessmentData.cognitiveFunction.memory,
                    remote: value as any,
                  },
                },
              })
            }
            horizontal={true}
          />

          <FormTextArea
            label="Memory comments"
            value={assessmentData.cognitiveFunction.memory.comments || ''}
            onChangeText={(text) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  memory: {
                    ...assessmentData.cognitiveFunction.memory,
                    comments: text,
                  },
                },
              })
            }
            placeholder="Note any specific memory difficulties or gaps"
            rows={2}
          />
        </View>

        {/* Orientation */}
        <View style={styles.cognitiveSubsection}>
          <Text style={styles.cognitiveSubsectionTitle}>Orientation</Text>
          <FormRadioGroup
            label="Orientation to person"
            options={[
              { label: 'Oriented', value: 'oriented' },
              { label: 'Disoriented', value: 'disoriented' },
            ]}
            value={assessmentData.cognitiveFunction.orientation.person || 'oriented'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  orientation: {
                    ...assessmentData.cognitiveFunction.orientation,
                    person: value as any,
                  },
                },
              })
            }
            horizontal={true}
          />

          <FormRadioGroup
            label="Orientation to place"
            options={[
              { label: 'Oriented', value: 'oriented' },
              { label: 'Disoriented', value: 'disoriented' },
            ]}
            value={assessmentData.cognitiveFunction.orientation.place || 'oriented'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  orientation: {
                    ...assessmentData.cognitiveFunction.orientation,
                    place: value as any,
                  },
                },
              })
            }
            horizontal={true}
          />

          <FormRadioGroup
            label="Orientation to time"
            options={[
              { label: 'Oriented', value: 'oriented' },
              { label: 'Disoriented', value: 'disoriented' },
            ]}
            value={assessmentData.cognitiveFunction.orientation.time || 'oriented'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  orientation: {
                    ...assessmentData.cognitiveFunction.orientation,
                    time: value as any,
                  },
                },
              })
            }
            horizontal={true}
          />
        </View>

        {/* Concentration */}
        <View style={styles.cognitiveSubsection}>
          <Text style={styles.cognitiveSubsectionTitle}>Concentration</Text>
          <FormRadioGroup
            label="Concentration"
            options={[
              { label: 'Good', value: 'good' },
              { label: 'Fair', value: 'fair' },
              { label: 'Poor', value: 'poor' },
            ]}
            value={assessmentData.cognitiveFunction.concentration || 'good'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  concentration: value as any,
                },
              })
            }
            horizontal={true}
          />
        </View>

        {/* Intelligence */}
        <View style={styles.cognitiveSubsection}>
          <Text style={styles.cognitiveSubsectionTitle}>Intelligence</Text>
          <FormRadioGroup
            label="Intelligence (estimated)"
            options={[
              { label: 'Above average', value: 'above_average' },
              { label: 'Average', value: 'average' },
              { label: 'Below average', value: 'below_average' },
            ]}
            value={assessmentData.cognitiveFunction.intelligence || 'average'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  intelligence: value as any,
                },
              })
            }
            horizontal={false}
          />
        </View>

        {/* Judgment */}
        <View style={styles.cognitiveSubsection}>
          <Text style={styles.cognitiveSubsectionTitle}>Judgment</Text>
          <FormRadioGroup
            label="Judgment"
            options={[
              { label: 'Good', value: 'good' },
              { label: 'Fair', value: 'fair' },
              { label: 'Poor', value: 'poor' },
            ]}
            value={assessmentData.cognitiveFunction.judgment || 'good'}
            onValueChange={(value) =>
              onUpdate({
                cognitiveFunction: {
                  ...assessmentData.cognitiveFunction,
                  judgment: value as any,
                },
              })
            }
            horizontal={true}
          />
        </View>

        <FormTextArea
          label="Overall cognitive function comments"
          value={assessmentData.cognitiveFunction.overallComments || ''}
          onChangeText={(text) =>
            onUpdate({
              cognitiveFunction: {
                ...assessmentData.cognitiveFunction,
                overallComments: text,
              },
            })
          }
          placeholder="Summary of cognitive functioning and any areas of concern"
          rows={3}
          helpText="Note impact of trauma on cognitive functioning"
        />
      </FormSection>

      {/* 11. Insight Level */}
      <FormSection
        sectionNumber="11"
        title="Insight Level"
        subtitle="Patient's understanding of their situation and need for help"
        required={true}
        defaultExpanded={true}
      >
        <FormRadioGroup
          label="Insight level"
          options={[
            { label: 'Good - Full understanding', value: 'good' },
            { label: 'Fair - Partial understanding', value: 'fair' },
            { label: 'Poor - Limited understanding', value: 'poor' },
            { label: 'Absent - No understanding', value: 'absent' },
          ]}
          value={assessmentData.insightLevel}
          onValueChange={(value) => onUpdate({ insightLevel: value as any })}
          required={true}
          horizontal={false}
          error={errors.insightLevel}
          helpText="Assess awareness of trauma impact and need for treatment"
        />

        <FormTextArea
          label="Insight comments"
          value={assessmentData.insightComments || ''}
          onChangeText={(text) => onUpdate({ insightComments: text })}
          placeholder="Describe patient's understanding of their experience, symptoms, and need for support/treatment"
          rows={3}
          helpText="Note readiness for therapeutic interventions"
        />
      </FormSection>

      {/* 12. Recommendation Following Assessment */}
      <FormSection
        sectionNumber="12"
        title="Recommendation Following Assessment"
        subtitle="Clinical recommendations and treatment plan"
        required={true}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Recommendations"
          value={assessmentData.recommendationFollowingAssessment}
          onChangeText={(text) => onUpdate({ recommendationFollowingAssessment: text })}
          placeholder="Document recommended interventions: individual therapy, group therapy, medication evaluation, inpatient care, safety planning, follow-up frequency, specific therapeutic approaches (CBT, EMDR, etc.)"
          rows={5}
          required={true}
          error={errors.recommendationFollowingAssessment}
          helpText="Include specific interventions, frequency, and urgency"
        />
      </FormSection>

      {/* 13. Referral Points */}
      <FormSection
        sectionNumber="13"
        title="Referral Points"
        subtitle="Recommended external services"
        required={false}
        defaultExpanded={true}
      >
        <FormTextArea
          label="Referral points"
          value={assessmentData.referralPoints || ''}
          onChangeText={(text) => onUpdate({ referralPoints: text })}
          placeholder="List specific referrals: psychiatry, specialized trauma counseling, group therapy programs, support groups, social services, legal aid, shelter services"
          rows={4}
          helpText="Include contact information if available"
        />
      </FormSection>

      {/* 14. Referral Uptake Since Last Visit */}
      <FormSection
        sectionNumber="14"
        title="Referral Uptake Since Last Visit"
        subtitle="Follow-up on previous referrals"
        required={false}
        defaultExpanded={false}
      >
        <FormRadioGroup
          label="Has patient attended previous referrals?"
          options={[
            { label: 'N/A - First visit', value: 'na_first_visit' },
            { label: 'Yes - All attended', value: 'yes_all' },
            { label: 'Partial - Some attended', value: 'partial' },
            { label: 'No - None attended', value: 'no_none' },
          ]}
          value={assessmentData.referralUptakeSinceLastVisit || 'na_first_visit'}
          onValueChange={(value) => onUpdate({ referralUptakeSinceLastVisit: value as any })}
          horizontal={false}
        />

        <FormTextArea
          label="Referral uptake details"
          value={assessmentData.referralUptakeDetails || ''}
          onChangeText={(text) => onUpdate({ referralUptakeDetails: text })}
          placeholder="Document which referrals were attended, outcomes, barriers to attendance, patient feedback on services received"
          rows={3}
          helpText="Note any barriers to accessing recommended services"
        />
      </FormSection>

      {/* Signatures Section */}
      <View style={styles.signaturesSection}>
        <Text style={styles.signaturesSectionTitle}>✍️ Signatures</Text>
        <Text style={styles.signaturesSectionSubtitle}>
          PART B must be signed by both examining officer and police officer
        </Text>

        {/* Examining Officer Signature */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureBlockTitle}>Examining Officer</Text>

          <FormTextField
            label="Name of examining officer"
            value={assessmentData.examiningOfficerName}
            onChangeText={(text) => onUpdate({ examiningOfficerName: text })}
            placeholder="Full name"
            required={true}
            error={errors.examiningOfficerName}
          />

          <FormTextField
            label="Professional designation"
            value={assessmentData.examiningOfficerDesignation || ''}
            onChangeText={(text) => onUpdate({ examiningOfficerDesignation: text })}
            placeholder="e.g., Clinical Psychologist, Psychiatrist, Counselor"
            helpText="Include license number if applicable"
          />

          <FormTextField
            label="Signature"
            value={assessmentData.examiningOfficerSignature || ''}
            onChangeText={(text) => onUpdate({ examiningOfficerSignature: text })}
            placeholder="Digital signature or initials"
            helpText="In digital form, enter initials or 'SIGNED' to confirm"
          />

          <FormDateTimePicker
            label="Date & Time"
            mode="both"
            dateValue={assessmentData.examiningOfficerDate}
            timeValue={assessmentData.examiningOfficerTime}
            onDateChange={(date) => onUpdate({ examiningOfficerDate: date })}
            onTimeChange={(time) => onUpdate({ examiningOfficerTime: time })}
            required={true}
          />
        </View>

        {/* Police Officer Signature */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureBlockTitle}>Police Officer</Text>

          <FormTextField
            label="Name of police officer"
            value={assessmentData.policeOfficerName}
            onChangeText={(text) => onUpdate({ policeOfficerName: text })}
            placeholder="Full name"
            required={true}
            error={errors.policeOfficerName}
          />

          <FormTextField
            label="Police station"
            value={assessmentData.policeStation || ''}
            onChangeText={(text) => onUpdate({ policeStation: text })}
            placeholder="Station name and OB number"
            helpText="Include OB number for case tracking"
          />

          <FormTextField
            label="Signature"
            value={assessmentData.policeOfficerSignature || ''}
            onChangeText={(text) => onUpdate({ policeOfficerSignature: text })}
            placeholder="Digital signature or initials"
            helpText="In digital form, enter initials or 'SIGNED' to confirm"
          />

          <FormDateTimePicker
            label="Date & Time"
            mode="both"
            dateValue={assessmentData.policeOfficerDate}
            timeValue={assessmentData.policeOfficerTime}
            onDateChange={(date) => onUpdate({ policeOfficerDate: date })}
            onTimeChange={(time) => onUpdate({ policeOfficerTime: time })}
            required={true}
          />
        </View>
      </View>

      {/* Clinical Guidelines */}
      <View style={styles.guidelinesSection}>
        <Text style={styles.guidelinesTitle}>📋 Clinical Guidelines - PART B</Text>
        <Text style={styles.guidelinesText}>
          • PART B should be completed by a qualified mental health professional (psychologist,
          psychiatrist, or trained counselor)
        </Text>
        <Text style={styles.guidelinesText}>
          • Assessment should be conducted in a private, safe environment
        </Text>
        <Text style={styles.guidelinesText}>
          • Use trauma-informed approach throughout assessment
        </Text>
        <Text style={styles.guidelinesText}>
          • Screen for suicidal ideation - immediate referral if active with plan
        </Text>
        <Text style={styles.guidelinesText}>
          • Assess for PTSD symptoms: re-experiencing, avoidance, hyperarousal
        </Text>
        <Text style={styles.guidelinesText}>
          • Consider cultural context and language barriers
        </Text>
        <Text style={styles.guidelinesText}>
          • For children: use age-appropriate techniques and involve caregiver when appropriate
        </Text>
        <Text style={styles.guidelinesText}>
          • Document in patient's own words when possible
        </Text>
        <Text style={styles.guidelinesText}>
          • Coordinate care with medical team and other service providers
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  partBHeader: {
    padding: 20,
    backgroundColor: '#6A2CB0',
    borderRadius: 12,
    marginBottom: 16,
  },
  partBTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  partBSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  partBDescription: {
    fontSize: 14,
    color: '#F3E5F5',
    lineHeight: 20,
  },
  riskAssessmentBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  riskAssessmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 12,
  },
  cognitiveSubsection: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  cognitiveSubsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 8,
  },
  signaturesSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  signaturesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  signaturesSectionSubtitle: {
    fontSize: 14,
    color: '#558B2F',
    marginBottom: 16,
  },
  signatureBlock: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  signatureBlockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  guidelinesSection: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 6,
    lineHeight: 18,
  },
});
