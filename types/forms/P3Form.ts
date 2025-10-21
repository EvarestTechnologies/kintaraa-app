/**
 * P3 Form - Type Definitions
 * Police Medical Examination Form - Kenya Police Service
 *
 * This type system matches the official P3 PDF form structure.
 * Used by police officers for medical examination documentation.
 */

import { BodyMapInjury } from './PRCFormMOH363';

// ============================================================================
// P3 FORM SECTIONS
// ============================================================================

/**
 * Section 1: Examiner Information
 */
export interface P3ExaminerInformation {
  // Police Officer Details
  officerName: string;
  officerRank: string;
  officerServiceNumber: string;
  policeStation: string;

  // Examination Details
  examinationDate: string; // ISO 8601
  examinationTime: string; // HH:mm
  examinationLocation: string;

  // Case Details
  obNumber: string; // Occurrence Book Number
  caseNumber?: string;
}

/**
 * Section 2: Survivor Information
 */
export interface P3SurvivorInformation {
  // Personal Details
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idNumber?: string;
  phoneNumber?: string;
  address: string;

  // Case Reference
  incidentId: string;
  caseId: string;

  // Incident Summary
  incidentDate: string; // ISO 8601
  incidentLocation: string;
  incidentDescription: string;
}

/**
 * Injury Documentation Entry
 */
export interface P3InjuryDocumentation {
  id: string;
  injuryType: 'bruise' | 'laceration' | 'abrasion' | 'bite_mark' | 'burn' | 'fracture' | 'other';
  bodyLocation: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  measurements?: string; // Size/dimensions
  color?: string; // For bruises
  age?: string; // Estimated age of injury (fresh, healing, old)
  photographTaken: boolean;
  photographReference?: string;
}

/**
 * Section 3: Injury Documentation & Body Map
 */
export interface P3InjurySection {
  // Body Map Injuries
  bodyMapInjuries: BodyMapInjury[];

  // Detailed Injury List
  injuryDocumentation: P3InjuryDocumentation[];

  // Photographs
  photographsTaken: boolean;
  numberOfPhotographs?: number;
  photographReferences?: string[];

  // Overall Assessment
  overallInjuryAssessment: string;
  consistentWithAllegations: boolean;
  assessmentNotes?: string;
}

/**
 * Evidence Item
 */
export interface EvidenceItem {
  id: string;
  itemType: 'clothing' | 'swab' | 'blood_sample' | 'hair_sample' | 'nail_clippings' | 'other';
  itemDescription: string;
  collectedDate: string; // ISO 8601
  collectedTime: string; // HH:mm
  collectedBy: string;
  witnessedBy?: string;
  storageLocation: string;
  sealed: boolean;
  sealNumber?: string;
  notes?: string;
}

/**
 * Section 4: Evidence Collection & Chain of Custody
 */
export interface P3EvidenceCollection {
  // Evidence Items
  evidenceItems: EvidenceItem[];

  // Forensic Samples Collected
  forensicSamples: {
    bloodSample: boolean;
    urineSample: boolean;
    vaginalSwabs: boolean;
    oralSwabs: boolean;
    analSwabs: boolean;
    nailClippings: boolean;
    hairSamples: boolean;
    skinSwabs: boolean;
    other: boolean;
    otherSpecify?: string;
  };

  // Chain of Custody
  chainOfCustody: {
    // Collected By
    collectedBy: {
      name: string;
      rank: string;
      serviceNumber: string;
      signature?: string;
      date: string; // ISO 8601
    };

    // Witnessed By
    witnessedBy?: {
      name: string;
      role: string;
      signature?: string;
      date: string;
    };

    // Transferred To
    transferredTo?: {
      name: string;
      organization: string;
      signature?: string;
      date: string;
    };

    // Storage Details
    storageLocation: string;
    storageDate: string;
    storageTemperature?: string;
  };

  // Evidence Notes
  evidenceNotes?: string;
}

/**
 * Medical Officer Statement
 */
export interface P3MedicalOfficerStatement {
  officerName: string;
  officerDesignation: string;
  medicalFacility: string;
  examinationFindings: string;
  medicalOpinion: string;
  signature?: string;
  date: string; // ISO 8601
}

/**
 * Police Officer Statement
 */
export interface P3PoliceOfficerStatement {
  officerName: string;
  officerRank: string;
  serviceNumber: string;
  investigationSummary: string;
  actionsTaken: string;
  signature?: string;
  date: string; // ISO 8601
}

// ============================================================================
// COMPLETE P3 FORM
// ============================================================================

/**
 * Complete P3 Form - Kenya Police Medical Examination Form
 */
export interface P3Form {
  // Form Metadata
  id: string;
  caseId: string;
  incidentId: string;

  // Section 1: Examiner Information
  examinerInformation: P3ExaminerInformation;

  // Section 2: Survivor Information
  survivorInformation: P3SurvivorInformation;

  // Section 3: Injury Documentation
  injuryDocumentation: P3InjurySection;

  // Section 4: Evidence Collection
  evidenceCollection: P3EvidenceCollection;

  // Medical Officer Statement
  medicalOfficerStatement?: P3MedicalOfficerStatement;

  // Police Officer Statement
  policeOfficerStatement: P3PoliceOfficerStatement;

  // Form Status
  status: 'draft' | 'completed' | 'submitted' | 'filed';

  // Timestamps
  createdAt: string; // ISO 8601
  updatedAt: string;
  submittedAt?: string;

  // PDF URL (when generated)
  pdfUrl?: string;
}

/**
 * Request to create a new P3 Form
 */
export interface CreateP3FormRequest {
  caseId: string;
  incidentId: string;
  policeStation: string;
  obNumber: string;
  autoPopulate?: boolean; // Auto-populate from incident/PRC data
}

/**
 * Request to update a P3 Form
 */
export interface UpdateP3FormRequest {
  formData: Partial<P3Form>;
}

/**
 * P3 Form Validation Errors
 */
export interface P3FormValidationErrors {
  examinerInformation?: string[];
  survivorInformation?: string[];
  injuryDocumentation?: string[];
  evidenceCollection?: string[];
  medicalOfficerStatement?: string[];
  policeOfficerStatement?: string[];
}
