/**
 * PRC Form MOH 363 - Type Definitions
 * Post-Rape Care Form - Ministry of Health Kenya
 *
 * This type system matches the official MOH 363 PDF form exactly.
 * Structure follows PART A (Medical/Forensic) and PART B (Psychological Assessment)
 */

// ============================================================================
// PART A: MEDICAL/FORENSIC DOCUMENTATION
// ============================================================================

/**
 * Facility & Administrative Information (Header)
 */
export interface PRCFormHeader {
  county: string;
  subCounty: string;
  facility: string;
  facilityMFLCode: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
}

/**
 * Section 1: Patient Demographics
 */
export interface PRCPatientDemographics {
  // Three Names (as per PDF)
  names: string;

  // Date of Birth
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };

  // Gender
  gender: 'male' | 'female';

  // Codes
  countyCode: string;
  subCountyCode: string;

  // OP/IP Number
  opIpNumber: string;

  // Contacts
  residenceAndPhone: string;

  // Additional Information
  citizenship: string;
  maritalStatus: string;
  disabilities?: string;
  orphanedVulnerableChild: boolean;
}

/**
 * Section 2: Incident Details & Circumstances
 */
export interface PRCIncidentDetails {
  // Date and Time of Examination
  examinationDate: {
    day: string;
    month: string;
    year: string;
  };
  examinationTime: {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
  };

  // Date and Time of Incident
  incidentDate: {
    day: string;
    month: string;
    year: string;
  };
  incidentTime: {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
  };

  // Date and Time of Report
  reportDate: {
    day: string;
    month: string;
    year: string;
  };
  reportTime: {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
  };

  // Alleged Perpetrators
  perpetratorStatus: 'unknown' | 'known';
  perpetratorRelationship?: string; // If known
  numberOfPerpetrators: number;
  perpetratorGender: 'male' | 'female';
  perpetratorEstimatedAge: string;

  // Where Incident Occurred
  incidentLocation: {
    county: string;
    subCounty: string;
    landmark: string;
  };

  // Chief Complaints
  chiefComplaintsObserved: string;
  chiefComplaintsReported: string;

  // Circumstances
  circumstancesSurroundingIncident: string; // Survivor account - penetration details

  // Type of Sexual Violence
  typeOfSexualViolence: {
    oral: boolean;
    vaginal: boolean;
    anal: boolean;
    other: boolean;
    otherSpecify?: string;
  };

  // Use of Condom
  useOfCondom: 'yes' | 'no' | 'unknown';

  // Police Report
  incidentReportedToPolice: boolean;
  policeStationName?: string;

  // Previous Health Facility Visit
  attendedHealthFacilityBefore: boolean;
  previousFacilityName?: string;
  previouslyTreated: boolean;
  givenReferralNotes: boolean;

  // Medical History
  significantMedicalSurgicalHistory: string;
}

/**
 * Section 3: Forensic Information
 */
export interface PRCForensicInformation {
  // Survivor Changed Clothes?
  survivorChangedClothes: boolean;
  stateOfClothes?: string; // stains, torn, color, where taken

  // How Clothes Transported?
  clothesTransportMethod?: 'plastic_bag' | 'non_plastic_bag' | 'other';
  clothesTransportOther?: string;
  clothesHandedToPolice: boolean;

  // Survivor Bath/Clean
  survivorHadBath: boolean;
  bathDetails?: string;

  // Survivor Toilet
  survivorWentToToilet: boolean;
  toiletType?: 'long_call' | 'short_call';

  // Marks on Perpetrator
  survivorLeftMarksOnPerpetrator: boolean;
  marksDetails?: string;
}

/**
 * Section 4: OB/GYN History
 */
export interface PRCOBGYNHistory {
  parity: number;
  contraceptionType: string;
  lastMenstrualPeriod: {
    day: string;
    month: string;
    year: string;
  };
  knownPregnancy: boolean;
  dateOfLastConsensualIntercourse: {
    day: string;
    month: string;
    year: string;
  };
}

/**
 * Section 5: General Physical Examination
 */
export interface PRCGeneralPhysicalExamination {
  // General Condition
  generalCondition: string;

  // Vital Signs
  bloodPressure: string;
  pulseRate: number;
  respiratoryRate: number;
  temperature: number;

  // Demeanor
  demeanorLevelOfAnxiety: 'calm' | 'not_calm';
}

/**
 * Body Map Injury Annotation
 */
export interface BodyMapInjury {
  id: string;
  type: 'bruise' | 'laceration' | 'bite_mark' | 'burn' | 'other';
  location: string; // Description of body location
  coordinates?: {
    x: number; // Percentage position on body map
    y: number;
  };
  view: 'anterior' | 'posterior';
  bodyPart: string; // e.g., "left arm", "chest", "back"
  description: string;
}

/**
 * Section 6: Genital Examination of the Survivor
 */
export interface PRCGenitalExamination {
  // Overall Description
  physicalStatusDescription: string;

  // Physical Injuries (references body map)
  physicalInjuries: BodyMapInjury[];

  // Specific Examinations
  outerGenitalia: string;
  vagina: string;
  hymen: string;
  anus: string;
  otherSignificantOrifices: string;

  // Comments
  comments: string;
}

/**
 * Section 7: Immediate Management
 */
export interface PRCImmediateManagement {
  // PEP (Post-Exposure Prophylaxis)
  pepFirstDose: boolean;

  // ECP (Emergency Contraceptive Pills)
  ecpGiven: boolean;
  ecpNumberOfTablets?: number;

  // Stitching/Surgical Toilet
  stitchingSurgicalToiletDone: boolean;
  stitchingComments?: string;

  // STI Treatment
  stiTreatmentGiven: boolean;
  stiTreatmentComments?: string;

  // Other Treatment
  otherTreatmentMedicationGiven?: string;

  // Comments
  comments: string;
}

/**
 * Section 8: Referrals
 */
export interface PRCReferrals {
  policeStation: boolean;
  hivTest: boolean;
  laboratory: boolean;
  legal: boolean;
  traumaCounseling: boolean;
  safeShelter: boolean;
  opdCccHivClinic: boolean;
  other: boolean;
  otherSpecify?: string;
}

/**
 * Laboratory Sample Type with Tests
 */
export interface LaboratorySample {
  sampleType: string;
  tests: {
    wetPrepMicroscopy: boolean;
    dna: boolean;
    cultureAndSensitivity: boolean;
    pregnancyTest: boolean;
    microscopy: boolean;
    drugsAndAlcohol: boolean;
    haemoglobin: boolean;
    hivTest: boolean;
    sgptGot: boolean;
    vdrl: boolean;
    other: boolean;
    otherSpecify?: string;
  };
  labDestination: 'national_government_lab' | 'health_facility_lab';
  comments?: string;
}

/**
 * Section 9: Laboratory Samples & Chain of Custody
 */
export interface PRCLaboratorySamples {
  // Sample Types (checkboxes)
  samples: {
    outerGenitalSwab: LaboratorySample | null;
    highVaginalSwab: LaboratorySample | null;
    analSwab: LaboratorySample | null;
    skinSwab: LaboratorySample | null;
    oralSwab: LaboratorySample | null;
    urine: LaboratorySample | null;
    blood: LaboratorySample | null;
    pubicHair: LaboratorySample | null;
    nailClippings: LaboratorySample | null;
    foreignBodies: LaboratorySample | null;
    other: LaboratorySample | null;
    otherSpecify?: string;
  };

  // Chain of Custody
  chainOfCustody: {
    samplesPackedAndIssued: 'all' | 'some' | 'these';
    samplesSpecify?: string;

    // By (Examining Officer)
    examiningOfficerName: string;
    examiningOfficerSignature?: string; // Base64 image or signature data
    examiningOfficerDate: {
      day: string;
      month: string;
      year: string;
    };

    // To (Police Officer)
    policeOfficerName: string;
    policeOfficerSignature?: string;
    policeOfficerDate: {
      day: string;
      month: string;
      year: string;
    };
  };
}

// ============================================================================
// PART B: PSYCHOLOGICAL ASSESSMENT
// ============================================================================

/**
 * PART B - Complete Psychological Assessment Section
 */
export interface PRCPsychologicalAssessment {
  // 1. General Appearance and Behavior
  generalAppearanceAndBehavior: string;

  // 2. Rapport
  rapport: string; // Easy to establish, initially difficult but easier over time, difficult

  // 3. Mood
  mood: string; // Happy, sad, hopeless, euphoric, elevated, depressed, irritable, anxious, angry, easily upset

  // 4. Affect
  affect: string; // Labile, blunt/flat, appropriate/inappropriate to content

  // 5. Speech
  speech: string; // Rate, volume, speed, pressured, quality (clear/mumbling), impoverished

  // 6. Perception
  perception: string; // Hallucination, feeling of unreality

  // 7. Thought Content
  thoughtContent: string; // Suicidal/homicidal ideation, preoccupying thoughts

  // 8. Thought Process
  thoughtProcess: string; // Goal-directed, logical, loosened associations, flight of ideas, illogical, circumstantial

  // 9. For Children - Wishes and Dreams
  childrenWishesAndDreams?: string;
  childrenArtPlayTherapy?: string; // Drawing and play observations
  childrenFeelings?: string; // Feelings and what makes them feel that way

  // 10. Cognitive Function
  cognitiveFunction: {
    // a. Memory
    memory: string; // Recent, long-term, short-term

    // b. Orientation
    orientation: string; // To time, place, person

    // c. Concentration
    concentration: string; // Ability to pay attention, counting/spelling backwards

    // d. Intelligence
    intelligence: string; // Use of vocabulary, above average/average/below average

    // e. Judgment
    judgment: string; // Ability to understand relations between facts and draw conclusions
  };

  // 11. Insight Level
  insightLevel: string; // Present, fair, not present

  // 12. Recommendation Following Assessment
  recommendationFollowingAssessment: string;

  // 13. Referral Point/s
  referralPoints: string;

  // 14. Referral Uptake Since Last Visit
  referralUptakeSinceLastVisit: string;

  // Examining Officer Signature (PART B)
  partBExaminingOfficer: {
    name: string;
    signature?: string;
    date: {
      day: string;
      month: string;
      year: string;
    };
  };

  // Police Officer Signature (PART B)
  partBPoliceOfficer: {
    name: string;
    signature?: string;
    date: {
      day: string;
      month: string;
      year: string;
    };
  };
}

// ============================================================================
// COMPLETE PRC FORM MOH 363
// ============================================================================

/**
 * Complete PRC Form (MOH 363) - Matches PDF Structure Exactly
 */
export interface PRCFormMOH363 {
  // Form Metadata
  id: string;
  caseId: string;
  incidentId: string;

  // Header
  header: PRCFormHeader;

  // PART A: Medical/Forensic Documentation
  partA: {
    // Section 1: Patient Demographics
    patientDemographics: PRCPatientDemographics;

    // Section 2: Incident Details
    incidentDetails: PRCIncidentDetails;

    // Section 3: Forensic Information
    forensicInformation: PRCForensicInformation;

    // Section 4: OB/GYN History
    obgynHistory: PRCOBGYNHistory;

    // Section 5: General Physical Examination
    generalPhysicalExamination: PRCGeneralPhysicalExamination;

    // Section 6: Genital Examination
    genitalExamination: PRCGenitalExamination;

    // Section 7: Immediate Management
    immediateManagement: PRCImmediateManagement;

    // Section 8: Referrals
    referrals: PRCReferrals;

    // Section 9: Laboratory Samples & Chain of Custody
    laboratorySamples: PRCLaboratorySamples;
  };

  // PART B: Psychological Assessment
  partB: PRCPsychologicalAssessment;

  // Form Status
  status: 'draft' | 'part_a_complete' | 'part_b_complete' | 'completed' | 'submitted';

  // Timestamps
  createdAt: string; // ISO 8601
  updatedAt: string;
  submittedAt?: string;

  // PDF URL (when generated)
  pdfUrl?: string;
}

/**
 * Request to create a new PRC Form
 */
export interface CreatePRCFormRequest {
  caseId: string;
  incidentId: string;
  facilityName: string;
  facilityMFLCode: string;
  autoPopulate?: boolean; // Auto-populate from incident data
}

/**
 * Request to update a PRC Form
 */
export interface UpdatePRCFormRequest {
  formData: Partial<PRCFormMOH363>;
}

/**
 * Time-Critical Windows (PEP & EC)
 */
export interface TimeCriticalWindows {
  pepWithinWindow: boolean;  // Within 72 hours
  ecWithinWindow: boolean;   // Within 120 hours
  hoursAfterIncident: number;
  pepDeadline: string;       // ISO 8601
  ecDeadline: string;        // ISO 8601
  pepHoursRemaining: number;
  ecHoursRemaining: number;
  urgencyLevel: 'critical' | 'urgent' | 'warning' | 'expired';
}
