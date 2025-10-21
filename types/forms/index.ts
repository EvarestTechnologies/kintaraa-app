/**
 * Form Types - Central Export
 * Kenya MOH and Police Forms
 */

// PRC Form (MOH 363) - Post-Rape Care
export type {
  PRCFormMOH363,
  PRCFormHeader,
  PRCPatientDemographics,
  PRCIncidentDetails,
  PRCForensicInformation,
  PRCOBGYNHistory,
  PRCGeneralPhysicalExamination,
  PRCGenitalExamination,
  PRCImmediateManagement,
  PRCReferrals,
  PRCLaboratorySamples,
  PRCPsychologicalAssessment,
  BodyMapInjury,
  LaboratorySample,
  CreatePRCFormRequest,
  UpdatePRCFormRequest,
  TimeCriticalWindows,
} from './PRCFormMOH363';

// P3 Form - Police Medical Examination
export type {
  P3Form,
  P3ExaminerInformation,
  P3SurvivorInformation,
  P3InjurySection,
  P3InjuryDocumentation,
  P3EvidenceCollection,
  P3MedicalOfficerStatement,
  P3PoliceOfficerStatement,
  EvidenceItem,
  CreateP3FormRequest,
  UpdateP3FormRequest,
  P3FormValidationErrors,
} from './P3Form';
