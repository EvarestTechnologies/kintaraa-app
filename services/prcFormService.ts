/**
 * PRC Form Service (MOH 363)
 * Post-Rape Care Form - Ministry of Health Kenya
 * Handles form creation, submission, and PDF generation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, apiRequest } from './api';

// Storage keys
const STORAGE_KEYS = {
  PRC_FORMS: 'prc_forms',
  PENDING_SUBMISSIONS: 'prc_pending_submissions',
};

// Types based on MOH 363 PRC Form structure
export interface PRCFormData {
  id: string;
  caseId: string;
  incidentId: string;
  facilityName: string;
  facilityCode: string;
  dateOfExamination: string; // ISO 8601
  timeOfExamination: string; // HH:mm

  // Section 1: Survivor Demographics
  survivorDetails: {
    name: string;
    age: number;
    dateOfBirth?: string;
    gender: 'female' | 'male' | 'other';
    idNumber?: string;
    phoneNumber?: string;
    address: string;
    nextOfKin?: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
  };

  // Section 2: Incident Details
  incidentDetails: {
    dateOfIncident: string;
    timeOfIncident?: string;
    placeOfIncident: string;
    reportedToPolice: boolean;
    policeStationName?: string;
    obNumber?: string;
    numberOfAssailants: number;
    assailantKnown: boolean;
    assailantDescription?: string;
  };

  // Section 3: Medical History
  medicalHistory: {
    lastMenstrualPeriod?: string;
    pregnant: boolean;
    currentPregnancyWeeks?: number;
    usingContraception: boolean;
    contraceptionMethod?: string;
    hivStatus: 'positive' | 'negative' | 'unknown';
    onARVs: boolean;
    chronicIllnesses?: string[];
    currentMedications?: string[];
    allergies?: string[];
  };

  // Section 4: Clinical Examination
  clinicalExamination: {
    generalAppearance: string;
    mentalState: string;
    vitalSigns: {
      bloodPressure?: string;
      pulse?: number;
      temperature?: number;
      respiratoryRate?: number;
    };
    injuries: {
      type: 'bruise' | 'laceration' | 'bite_mark' | 'other';
      location: string;
      description: string;
    }[];
    genitalExamination?: {
      findings: string;
      swabsTaken: boolean;
      photographsTaken: boolean;
    };
  };

  // Section 5: Specimens Collected
  specimens: {
    highVaginalSwab: boolean;
    lowVaginalSwab: boolean;
    analSwab: boolean;
    oralSwab: boolean;
    bloodSample: boolean;
    urineSample: boolean;
    nailClippings: boolean;
    hairSamples: boolean;
    clothingSamples: boolean;
    other?: string;
    chainOfCustody: {
      collectedBy: string;
      witnessedBy: string;
      dateTime: string;
      storedAt: string;
    };
  };

  // Section 6: Laboratory Tests
  laboratoryTests: {
    pregnancyTest: {
      done: boolean;
      result?: 'positive' | 'negative';
    };
    hivTest: {
      done: boolean;
      result?: 'positive' | 'negative';
      counselingProvided: boolean;
    };
    stiScreening: {
      done: boolean;
      tests: string[];
      results?: Record<string, string>;
    };
    hepatitisB: {
      done: boolean;
      result?: 'positive' | 'negative';
    };
  };

  // Section 7: Treatment Provided
  treatment: {
    // Post-Exposure Prophylaxis (PEP) - Time-critical: 72 hours
    pep: {
      administered: boolean;
      startTime?: string;
      regimen?: string;
      hoursAfterIncident?: number;
      withinWindow: boolean; // Within 72 hours
    };
    // Emergency Contraception (EC) - Time-critical: 120 hours
    emergencyContraception: {
      administered: boolean;
      startTime?: string;
      type?: 'levonorgestrel' | 'ulipristal' | 'copper_iud';
      hoursAfterIncident?: number;
      withinWindow: boolean; // Within 120 hours
    };
    // STI Prophylaxis
    stiProphylaxis: {
      administered: boolean;
      medications?: string[];
    };
    // Hepatitis B Vaccination
    hepatitisB: {
      administered: boolean;
      dose?: number;
    };
    // Tetanus Prophylaxis
    tetanus: {
      administered: boolean;
    };
    // Pain Management
    painManagement: {
      administered: boolean;
      medications?: string[];
    };
    // Wound Care
    woundCare: {
      provided: boolean;
      description?: string;
    };
  };

  // Section 8: Psychosocial Support
  psychosocialSupport: {
    counselingProvided: boolean;
    counselorName?: string;
    referredForCounseling: boolean;
    referralFacility?: string;
    crisisInterventionProvided: boolean;
  };

  // Section 9: Follow-up Plan
  followUp: {
    appointments: {
      date: string;
      purpose: string;
    }[];
    pepFollowUpScheduled: boolean;
    hivTestFollowUpScheduled: boolean;
    stiFollowUpScheduled: boolean;
    counselingFollowUpScheduled: boolean;
  };

  // Section 10: Healthcare Provider Details
  provider: {
    name: string;
    designation: string;
    signature?: string;
    date: string;
  };

  // Metadata
  status: 'draft' | 'completed' | 'submitted';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  pdfUrl?: string;
}

export interface CreatePRCFormRequest {
  caseId: string;
  incidentId: string;
  facilityName: string;
  facilityCode: string;
  autoPopulate?: boolean; // Auto-populate from incident data
}

export interface UpdatePRCFormRequest {
  formData: Partial<PRCFormData>;
}

/**
 * PRC Form Service Class
 */
export class PRCFormService {
  /**
   * Create a new PRC form
   */
  static async createForm(request: CreatePRCFormRequest): Promise<PRCFormData> {
    try {
      // Attempt API call
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.FORMS.PRC.CREATE,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      if (response.ok) {
        const form = await response.json();
        await this.storeFormLocally(form);
        return this.transformForm(form);
      }

      throw new Error('Failed to create PRC form');
    } catch (error) {
      console.error('API create PRC form failed, using local storage:', error);

      // Fallback to local creation
      const localForm: PRCFormData = {
        id: `local-prc-${Date.now()}`,
        caseId: request.caseId,
        incidentId: request.incidentId,
        facilityName: request.facilityName,
        facilityCode: request.facilityCode,
        dateOfExamination: new Date().toISOString().split('T')[0],
        timeOfExamination: new Date().toTimeString().slice(0, 5),
        survivorDetails: {
          name: '',
          age: 0,
          gender: 'female',
          address: '',
        },
        incidentDetails: {
          dateOfIncident: '',
          placeOfIncident: '',
          reportedToPolice: false,
          numberOfAssailants: 1,
          assailantKnown: false,
        },
        medicalHistory: {
          pregnant: false,
          usingContraception: false,
          hivStatus: 'unknown',
          onARVs: false,
        },
        clinicalExamination: {
          generalAppearance: '',
          mentalState: '',
          vitalSigns: {},
          injuries: [],
        },
        specimens: {
          highVaginalSwab: false,
          lowVaginalSwab: false,
          analSwab: false,
          oralSwab: false,
          bloodSample: false,
          urineSample: false,
          nailClippings: false,
          hairSamples: false,
          clothingSamples: false,
          chainOfCustody: {
            collectedBy: '',
            witnessedBy: '',
            dateTime: '',
            storedAt: '',
          },
        },
        laboratoryTests: {
          pregnancyTest: { done: false },
          hivTest: { done: false, counselingProvided: false },
          stiScreening: { done: false, tests: [] },
          hepatitisB: { done: false },
        },
        treatment: {
          pep: {
            administered: false,
            withinWindow: false,
          },
          emergencyContraception: {
            administered: false,
            withinWindow: false,
          },
          stiProphylaxis: { administered: false },
          hepatitisB: { administered: false },
          tetanus: { administered: false },
          painManagement: { administered: false },
          woundCare: { provided: false },
        },
        psychosocialSupport: {
          counselingProvided: false,
          referredForCounseling: false,
          crisisInterventionProvided: false,
        },
        followUp: {
          appointments: [],
          pepFollowUpScheduled: false,
          hivTestFollowUpScheduled: false,
          stiFollowUpScheduled: false,
          counselingFollowUpScheduled: false,
        },
        provider: {
          name: '',
          designation: '',
          date: new Date().toISOString().split('T')[0],
        },
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storeFormLocally(localForm);

      // Queue for sync
      await this.addToPendingSubmissions({
        action: 'create',
        data: request,
        timestamp: new Date().toISOString(),
      });

      return localForm;
    }
  }

  /**
   * Get all PRC forms
   */
  static async getForms(caseId?: string): Promise<PRCFormData[]> {
    try {
      const url = caseId
        ? `${API_CONFIG.ENDPOINTS.FORMS.PRC.LIST}?case_id=${caseId}`
        : API_CONFIG.ENDPOINTS.FORMS.PRC.LIST;

      const response = await apiRequest(url, { method: 'GET' });

      if (response.ok) {
        const forms = await response.json();
        await this.updateLocalForms(forms.results || forms);
        return (forms.results || forms).map(this.transformForm);
      }

      throw new Error('Failed to fetch PRC forms');
    } catch (error) {
      console.error('API get PRC forms failed, using local storage:', error);
      return this.getLocalForms(caseId);
    }
  }

  /**
   * Get a single PRC form
   */
  static async getForm(id: string): Promise<PRCFormData | null> {
    try {
      const url = API_CONFIG.ENDPOINTS.FORMS.PRC.DETAIL.replace('{id}', id);
      const response = await apiRequest(url, { method: 'GET' });

      if (response.ok) {
        const form = await response.json();
        await this.storeFormLocally(form);
        return this.transformForm(form);
      }

      throw new Error('Failed to fetch PRC form');
    } catch (error) {
      console.error('API get PRC form failed, using local storage:', error);
      const local = await this.getLocalForms();
      return local.find(f => f.id === id) || null;
    }
  }

  /**
   * Update a PRC form
   */
  static async updateForm(id: string, updates: UpdatePRCFormRequest): Promise<PRCFormData> {
    try {
      const url = API_CONFIG.ENDPOINTS.FORMS.PRC.UPDATE.replace('{id}', id);
      const response = await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(updates.formData),
      });

      if (response.ok) {
        const form = await response.json();
        await this.storeFormLocally(form);
        return this.transformForm(form);
      }

      throw new Error('Failed to update PRC form');
    } catch (error) {
      console.error('API update PRC form failed, using local storage:', error);

      // Update locally
      const local = await this.getLocalForms();
      const index = local.findIndex(f => f.id === id);

      if (index === -1) {
        throw new Error('Form not found');
      }

      const updated = {
        ...local[index],
        ...updates.formData,
        updatedAt: new Date().toISOString(),
      };

      local[index] = updated;
      await AsyncStorage.setItem(STORAGE_KEYS.PRC_FORMS, JSON.stringify(local));

      // Queue for sync
      await this.addToPendingSubmissions({
        action: 'update',
        id,
        data: updates.formData,
        timestamp: new Date().toISOString(),
      });

      return updated;
    }
  }

  /**
   * Submit a PRC form
   */
  static async submitForm(id: string): Promise<PRCFormData> {
    try {
      const url = API_CONFIG.ENDPOINTS.FORMS.PRC.SUBMIT.replace('{id}', id);
      const response = await apiRequest(url, {
        method: 'POST',
      });

      if (response.ok) {
        const form = await response.json();
        await this.storeFormLocally(form);
        return this.transformForm(form);
      }

      throw new Error('Failed to submit PRC form');
    } catch (error) {
      console.error('API submit PRC form failed:', error);

      // Update status locally
      const updated = await this.updateForm(id, {
        formData: {
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        },
      });

      // Queue for sync
      await this.addToPendingSubmissions({
        action: 'submit',
        id,
        timestamp: new Date().toISOString(),
      });

      return updated;
    }
  }

  /**
   * Generate PDF for a PRC form
   */
  static async generatePDF(id: string): Promise<string> {
    try {
      const url = API_CONFIG.ENDPOINTS.FORMS.PRC.PDF.replace('{id}', id);
      const response = await apiRequest(url, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        return data.pdfUrl || data.pdf_url;
      }

      throw new Error('Failed to generate PDF');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  /**
   * Check if PEP/EC treatment is within time window
   */
  static checkTimeCriticalWindows(incidentDate: string, incidentTime?: string): {
    pepWithinWindow: boolean;
    ecWithinWindow: boolean;
    hoursAfterIncident: number;
    pepDeadline: string;
    ecDeadline: string;
  } {
    const incident = new Date(`${incidentDate}${incidentTime ? `T${incidentTime}` : ''}`);
    const now = new Date();
    const hoursAfterIncident = (now.getTime() - incident.getTime()) / (1000 * 60 * 60);

    const pepDeadline = new Date(incident.getTime() + 72 * 60 * 60 * 1000);
    const ecDeadline = new Date(incident.getTime() + 120 * 60 * 60 * 1000);

    return {
      pepWithinWindow: hoursAfterIncident <= 72,
      ecWithinWindow: hoursAfterIncident <= 120,
      hoursAfterIncident,
      pepDeadline: pepDeadline.toISOString(),
      ecDeadline: ecDeadline.toISOString(),
    };
  }

  /**
   * Helper: Store form locally
   */
  private static async storeFormLocally(form: PRCFormData): Promise<void> {
    const local = await this.getLocalForms();
    const index = local.findIndex(f => f.id === form.id);

    if (index >= 0) {
      local[index] = form;
    } else {
      local.push(form);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PRC_FORMS, JSON.stringify(local));
  }

  /**
   * Helper: Update local forms
   */
  private static async updateLocalForms(forms: PRCFormData[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PRC_FORMS, JSON.stringify(forms));
  }

  /**
   * Helper: Get local forms
   */
  private static async getLocalForms(caseId?: string): Promise<PRCFormData[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PRC_FORMS);
      let forms: PRCFormData[] = stored ? JSON.parse(stored) : [];

      if (caseId) {
        forms = forms.filter(f => f.caseId === caseId);
      }

      return forms;
    } catch (error) {
      console.error('Failed to get local PRC forms:', error);
      return [];
    }
  }

  /**
   * Helper: Add to pending submissions
   */
  private static async addToPendingSubmissions(item: any): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SUBMISSIONS);
      const pending = stored ? JSON.parse(stored) : [];
      pending.push(item);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to add to pending submissions:', error);
    }
  }

  /**
   * Helper: Transform API response
   */
  private static transformForm(form: any): PRCFormData {
    // Transform snake_case to camelCase if needed
    return form; // Assuming API returns camelCase already
  }
}
