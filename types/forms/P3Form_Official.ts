/**
 * P3 Form - Official Type Definitions
 * Kenya Police Medical Examination Report (P3)
 * 11-page official form matching the PDF exactly
 *
 * Structure:
 * - PART ONE: Police Officer Section (Pages 1-2)
 * - PART TWO: Medical Practitioner Section (Pages 2-7)
 *   - Section A: Medical History
 *   - Section B: General Examination
 *   - Section C: Sexual Offences Examination
 * - Appendices: Body charts and anatomical diagrams (Pages 8-11)
 */

import { BodyMapInjury } from './PRCFormMOH363';

// ============================================================================
// PART ONE - POLICE OFFICER SECTION (Pages 1-2)
// ============================================================================

/**
 * PART ONE: Details of Complaint/Incident
 * Completed by police officer requesting forensic medical examination
 */
export interface P3PartOne {
  // Nature of Alleged Offence/Incident
  natureOfAllegedOffence: string;
  dateAndTimeOfAllegedOffence: string; // Full datetime
  dateAndTimeReportedToPolice: string; // Full datetime
  dateOfIssueOfPoliceForm: string;
  policeOccurrenceBookNumber: string;

  // Police Officer Details
  policeStation: string;
  investigatingOfficer: {
    serviceNumber: string;
    name: string;
    signature?: string;
  };

  // Medical Facility
  medicalFacilityName: string;

  // Request Type
  examinationType: 'complainant' | 'accused';

  // Patient Details
  patientName: string;
  age: number;
  sex: 'male' | 'female' | 'intersex';
  idOrBirthCertificateNumber?: string;
  contactMobileNumber?: string;
  placeOfResidence: string;

  // Date Sent to Medical Facility
  dateSentToMedicalFacility: string;

  // Escorted By
  escortedBy: {
    policeOfficer?: {
      name: string;
      serviceNumber: string;
      signature?: string;
    };
    authorizedGuardian1?: {
      name: string;
      idNumber: string;
    };
    authorizedGuardian2?: {
      contactMobileNumber: string;
    };
  };

  // Brief Details of Alleged Offence/Incident
  briefDetailsOfAllegedOffence: string;

  // Purpose of Examination
  purposeOfExamination: string;

  // Police Officer Commanding Station
  commandingOfficer: {
    name: string;
    signature?: string;
  };
}

// ============================================================================
// PART TWO - MEDICAL PRACTITIONER SECTION
// ============================================================================

/**
 * Section A: Details of Practitioner and Facility
 */
export interface P3PractitionerDetails {
  // Practitioner Information
  practitionerName: string;
  registrationNumber: string;
  qualifications: string;
  telephoneContact: string;

  // Facility Information
  medicalFacilityName: string;
  patientRecordNumber: string;
  facilityTelephoneContact: string;
  facilityPhysicalAddress: string;

  // Medical/Forensic Facility Reference
  medicalForensicFacilityReferenceNumber: string;
}

/**
 * Section B: Patient Information & Consent
 */
export interface P3PatientConsent {
  // Consent Given
  consentGiven: boolean;

  // Full Names
  patientFullNames: string;
  authorizedGuardianFullNames?: string; // For minors

  // Signature and Date
  patientSignature?: string;
  guardianSignature?: string;
  consentDate: string;

  // If Consent Not Given
  consentNotGivenReason?: string;

  // Patient Demographics
  dateOfBirth: string;
  age: number;
  sex: 'male' | 'female' | 'intersex';

  // Accompanied By
  patientAccompaniedBy?: string;

  // Persons Present During Examination
  personsPresent: string[]; // Max 2
}

/**
 * Section A: Relevant Medical History
 */
export interface P3MedicalHistory {
  // General Medical History
  relevantMedicalHistory: string; // Note disabilities/impairments

  // Additional Medical History Relevant to Sexual Offences
  sexualOffenceHistory: {
    changedClothes: boolean;
    condomUsed: 'yes' | 'no' | 'unknown';
    bathedWashedShowered: boolean;
    urinated: boolean;
    defecated: boolean;
    wiped: boolean;
    currentlyPregnant: 'yes' | 'no' | 'unknown';
    currentlyMenstruating: boolean;
    notes?: string;
  };

  // History Given By
  historyGivenBy: {
    name: string;
    relationship: string;
    signature?: string;
  };
}

/**
 * Section B: General Examination
 */
export interface P3GeneralExamination {
  // Vital Signs
  vitalSigns: {
    heartRate: string;
    respiratoryRate: string;
    bloodPressure: string;
    temperature: string;
    oedema?: string;
    lymphNodes?: string;
  };

  // State of Clothing
  stateOfClothing: {
    description: string; // Torn/damaged/bloodstained/soiled, indicate if changed
    stainsDebrisDescription?: string; // e.g., white colored discharge possibly semen
    clothingCollectedForForensicAnalysis: boolean;
    reasonIfNotCollected?: string;
  };

  // Physical Appearance and Behavior
  physicalAppearanceAndBehavior: string; // orientation, grooming, coherent, anxious

  // Body Measurements
  height?: string;
  weight?: string;
  generalBodyBuild: 'frail' | 'normal' | 'obese' | 'other';
  generalBodyBuildOther?: string;
  percentiles?: string; // Children only

  // Other Relevant Information
  otherRelevantInformation?: string;

  // Clinical Evidence of Intoxication
  clinicalEvidenceOfIntoxication?: string; // slurred speech, dilated pupils, ataxia, altered consciousness

  // Samples for Toxicology
  toxicologySamples: {
    blood: boolean;
    urine: boolean;
  };
}

/**
 * Physical Examination - Detailed Body Regions
 */
export interface P3PhysicalExamination {
  // Head and Neck
  headAndNeck: string;

  // Oral (note any injuries in the mouth)
  oral: string;

  // Eye/Orbit (Left and Right, including petechiae, intraorbital/retinal hemorrhage)
  eyeOrbit: string;

  // Scalp
  scalp: string;

  // ENT (including any injuries within and around the ears)
  ent: string;

  // CNS (level of consciousness - A.V.P.U, Gait, other)
  cns: string;

  // Chest (note any distension, tenderness, abnormality, irregular breathing, cardiac disorders)
  chest: string;

  // Abdomen (note any distension, tenderness, abnormality)
  abdomen: string;

  // Upper Limbs
  upperLimbs: string;

  // Lower Limbs
  lowerLimbs: string;

  // Estimate Age of Injury(s)
  estimateAgeOfInjuries: string;

  // Probable Mechanism of Injury(s)
  probableMechanismOfInjuries: string;

  // Degree of Injury
  degreeOfInjury: 'harm' | 'grievous_harm' | 'maim' | null;

  // Additional Notes
  additionalNotes?: string;

  // Treatment/Referral Plan
  treatmentReferralPlan: string;

  // Declaration
  examinationDate: string;
  medicalPractitionerName: string;
  medicalPractitionerSignature?: string;
}

/**
 * Section C: Sexual Offences Examination
 * TO BE COMPLETED IN ALLEGED SEXUAL OFFENCES AFTER SECTIONS A AND B
 */

/**
 * Female Genital Examination
 */
export interface P3FemaleGenitalExamination {
  // Tanner Stage (children - refer to annex)
  tannerStage?: string;

  // Detailed Genital Examination
  labiaMajora: string;
  labiaMinora: string;
  clitorisAndPeriUrethralArea: string;
  vestibule: string;
  hymen: string; // describe posterior rim, edges, posterior fourchette including injuries
  vagina: string;
  cervix: string;

  // Discharge/Blood/Infection
  dischargeBloodInfection?: string;

  // Position During Examination
  positionDuringExamination?: {
    supine: boolean;
    leftLateral: boolean;
    kneeChest: boolean;
  };

  // Speculum Used
  speculumUsed: boolean;
}

/**
 * Male Genital Examination
 */
export interface P3MaleGenitalExamination {
  // Tanner Stage (children - refer to annex)
  tannerStage?: string;

  // Detailed Examination
  prepuceFrenulum: string;
  shaft: string;
  scrotum: string;
  anus: string;

  // Discharge Notes
  dischargeNotes?: string; // presence of discharge from prepuce, around anus, on thighs; recent or long standing
}

/**
 * Specimen Collection (3 swabs per sample)
 */
export interface P3SpecimenCollection {
  // Medical Samples
  medicalSamples: {
    blood: boolean;
    urine: boolean;
  };

  // Forensic Serology Samples
  forensicSerologysamples: {
    referenceSample: {
      collected: boolean;
      type: 'buccal_swab' | 'blood_sample' | null;
    };
    oralSwab: boolean; // In case of ejaculation
    biteMarkSwab: boolean;
    pubicHair: {
      collected: boolean;
      method: 'combed' | 'shaved' | 'plucked' | null;
    };
    lowVaginalSwab: boolean; // Female only
    highVaginalSwab: boolean; // Female only
    endoCervicalSwab: boolean; // Female only
    analSwab: boolean;
    rectalSwab: boolean; // Male only
    fingerNailClippingsScrapings: boolean;
  };
}

/**
 * Section C: Sexual Offences - Complete
 */
export interface P3SexualOffencesExamination {
  // Gender-specific examination
  femaleExamination?: P3FemaleGenitalExamination;
  maleExamination?: P3MaleGenitalExamination;

  // Specimen Collection
  specimenCollection: P3SpecimenCollection;

  // Additional Remarks/Conclusion
  additionalRemarksConclusion: string;

  // Medication Administered (PEP, EC, TT, Hep B)
  medicationAdministered: string;

  // Recommendations/Referrals
  recommendationsReferrals: string; // e.g., urgent need for children officer/pediatrician review/admission
}

// ============================================================================
// CHAIN OF CUSTODY (Page 7)
// ============================================================================

/**
 * Chain of Custody Entry
 */
export interface P3ChainOfCustodyEntry {
  serialNumber: number;
  evidenceItemDescription: string;
  evidenceReceivedFrom: string;
  evidenceDeliveredTo: string;
  date: string;
  commentsRemarks?: string;
}

/**
 * Chain of Custody - Complete Section
 */
export interface P3ChainOfCustody {
  // List of specimens collected
  entries: P3ChainOfCustodyEntry[];

  // Specimens Collected By Medical Practitioner
  collectedBy: {
    fullName: string;
    collectionDate: string;
    collectionTime: string;
    facilityStamp?: string; // Date clearly marked
  };

  // Specimens Received By Police Officer
  receivedBy: {
    fullNameServiceNumber: string;
    receivedDate: string;
    receivedTime: string;
    facilityStamp?: string; // Date clearly marked
  };

  // Practitioner Signature
  practitionerSignature?: string;

  // Police Officer Signature
  policeOfficerSignature?: string;
}

// ============================================================================
// COMPLETE P3 FORM (Official 11-Page Structure)
// ============================================================================

/**
 * Complete Official P3 Form
 * Matches the 11-page Kenya Police Medical Examination Report exactly
 */
export interface P3FormOfficial {
  // Form Metadata
  id: string;
  caseId: string;
  incidentId: string;

  // PART ONE: Police Officer Section (Pages 1-2)
  partOne: P3PartOne;

  // PART TWO: Medical Practitioner Section
  partTwo: {
    // Section A: Practitioner and Facility Details
    practitionerDetails: P3PractitionerDetails;

    // Section B: Patient Information & Consent
    patientConsent: P3PatientConsent;

    // Section A: Relevant Medical History
    medicalHistory: P3MedicalHistory;

    // Section B: General Examination
    generalExamination: P3GeneralExamination;

    // Section B: Physical Examination (Body Regions)
    physicalExamination: P3PhysicalExamination;

    // Section C: Sexual Offences Examination (if applicable)
    sexualOffencesExamination?: P3SexualOffencesExamination;

    // Chain of Custody
    chainOfCustody: P3ChainOfCustody;
  };

  // Body Chart Data (Appendix 1)
  bodyChart: {
    patientType: 'child' | 'adult';
    sex: 'male' | 'female' | 'intersex';
    injuries: BodyMapInjury[]; // Uses same body map as PRC form
  };

  // Form Status
  status: 'draft' | 'part_one_complete' | 'part_two_complete' | 'completed' | 'submitted';

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;

  // PDF URL (when generated)
  pdfUrl?: string;
}

/**
 * Validation Errors for Official P3 Form
 */
export interface P3FormOfficialValidationErrors {
  partOne?: string[];
  practitionerDetails?: string[];
  patientConsent?: string[];
  medicalHistory?: string[];
  generalExamination?: string[];
  physicalExamination?: string[];
  sexualOffencesExamination?: string[];
  chainOfCustody?: string[];
}
