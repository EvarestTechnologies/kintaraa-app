import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  User,
  FileText,
  Heart,
  Brain,
  Check,
  Calendar,
  Clock,
  ChevronDown,
} from 'lucide-react-native';

interface ConsultationFormProps {
  caseId: string;
  patientName?: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function ConsultationForm({
  caseId,
  patientName = 'Patient',
  onClose,
  onComplete
}: ConsultationFormProps) {
  const [showIncidentDatePicker, setShowIncidentDatePicker] = useState(false);
  const [showIncidentTimePicker, setShowIncidentTimePicker] = useState(false);
  const [showExaminationDatePicker, setShowExaminationDatePicker] = useState(false);
  const [showExaminationTimePicker, setShowExaminationTimePicker] = useState(false);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showLmpPicker, setShowLmpPicker] = useState(false);

  // Dropdown states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showContraceptionDropdown, setShowContraceptionDropdown] = useState(false);
  const [showPregnancyDropdown, setShowPregnancyDropdown] = useState(false);
  const [showViolenceFormDropdown, setShowViolenceFormDropdown] = useState(false);
  const [showViolenceTypeDropdown, setShowViolenceTypeDropdown] = useState(false);
  const [showCondomDropdown, setShowCondomDropdown] = useState(false);
  const [showPoliceDropdown, setShowPoliceDropdown] = useState(false);
  const [showClothingDropdown, setShowClothingDropdown] = useState(false);
  const [showBathingDropdown, setShowBathingDropdown] = useState(false);
  const [showToiletDropdown, setShowToiletDropdown] = useState(false);
  const [showPepDropdown, setShowPepDropdown] = useState(false);
  const [showEcpDropdown, setShowEcpDropdown] = useState(false);
  const [showFollowUpTypeDropdown, setShowFollowUpTypeDropdown] = useState(false);

  // Dropdown options
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const contraceptionOptions = ['None', 'Pills (Oral contraceptives)', 'IUD (Intrauterine device)', 'Injection (Depo)', 'Implant', 'Condoms', 'Natural methods', 'Sterilization', 'Emergency contraceptive', 'Other'];
  const pregnancyOptions = ['Yes', 'No', 'Unknown', 'Possible'];
  const violenceFormOptions = [
    'Physical Violence',
    'Sexual Violence',
    'Emotional/Psychological Abuse',
    'Economic Abuse',
    'Online Gender-Based Violence',
    'Femicide/Attempted Femicide'
  ];
  const violenceTypeOptions = ['Oral', 'Vaginal', 'Anal', 'Multiple', 'Other', 'Unknown'];
  const yesNoOptions = ['Yes', 'No'];
  const yesNoUnknownOptions = ['Yes', 'No', 'Unknown'];
  const pepOptions = [
    'Yes - Tablets given',
    'Yes - Injection given',
    'No - Patient declined',
    'No - Not indicated',
    'No - Not available'
  ];
  const ecpOptions = [
    'Yes - Tablets given',
    'No - Patient declined',
    'No - Not indicated (>120 hours)',
    'No - Already pregnant',
    'No - Not available'
  ];
  const followUpTypeOptions = [
    'Phone call',
    'In-person visit',
    'Video consultation',
    'Home visit',
    'Text message',
    'Email',
    'No follow-up needed'
  ];

  const [formData, setFormData] = useState({
    // Patient Demographics
    patientAge: '',
    patientDob: '',
    patientGender: '',
    contactInfo: '',
    citizenship: '',
    maritalStatus: '',
    disabilities: '',

    // Incident Details
    incidentDate: '',
    incidentTime: '',
    examinationDate: '',
    examinationTime: '',
    incidentLocation: '',
    perpetratorKnown: '',
    perpetratorRelationship: '',
    perpetratorCount: '',
    perpetratorAge: '',
    chiefComplaintsObserved: '',
    chiefComplaintsReported: '',
    circumstances: '',
    violenceForm: '',
    violenceType: '',
    condomUsed: '',
    policeReported: '',
    policeStation: '',

    // Medical History
    medicalHistory: '',
    surgicalHistory: '',
    obGynHistory: '',
    parity: '',
    contraception: '',
    lmp: '',
    pregnancy: '',
    lastConsensualIntercourse: '',
    previousFacilityVisit: '',
    previousTreatment: '',

    // Forensic Evidence
    clothingChanged: '',
    clothingState: '',
    bathingStatus: '',
    toiletUse: '',
    marksOnPerpetrator: '',

    // Physical Examination
    generalCondition: '',
    vitalSigns: '',
    bloodPressure: '',
    pulseRate: '',
    respiratoryRate: '',
    temperature: '',
    demeanor: '',
    physicalInjuries: '',
    bodyMapping: '',
    outerGenitalia: '',
    vaginalExam: '',
    hymenExam: '',
    analExam: '',
    otherOrifices: '',
    discharges: '',

    // Laboratory & Samples
    samplesCollected: '',
    genitalSwab: '',
    analSwab: '',
    oralSwab: '',
    bloodSamples: '',
    urineSample: '',
    dnaCollection: '',
    pregnancyTest: '',
    hivTest: '',
    stiTests: '',
    chainOfCustody: '',

    // Treatment & Management
    pepGiven: '',
    ecpGiven: '',
    stiTreatment: '',
    surgicalTreatment: '',
    otherMedications: '',
    painManagement: '',

    // Psychological Assessment
    generalAppearance: '',
    rapport: '',
    mood: '',
    affect: '',
    speech: '',
    perception: '',
    thoughtContent: '',
    thoughtProcess: '',
    suicidalIdeation: '',
    memory: '',
    orientation: '',
    concentration: '',
    intelligence: '',
    judgment: '',
    insightLevel: '',

    // Referrals & Follow-up
    referralsPolice: '',
    referralsLegal: '',
    referralsCounseling: '',
    referralsShelter: '',
    referralsHiv: '',
    referralsLab: '',
    referralsOther: '',
    followUpDate: '',
    followUpType: '',

    // Clinical Notes
    clinicalNotes: '',
    recommendations: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onIncidentDateChange = (event: any, selectedDate?: Date) => {
    setShowIncidentDatePicker(false);
    if (selectedDate) {
      updateField('incidentDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onIncidentTimeChange = (event: any, selectedTime?: Date) => {
    setShowIncidentTimePicker(false);
    if (selectedTime) {
      updateField('incidentTime', selectedTime.toTimeString().split(' ')[0]);
    }
  };

  const onExaminationDateChange = (event: any, selectedDate?: Date) => {
    setShowExaminationDatePicker(false);
    if (selectedDate) {
      updateField('examinationDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onExaminationTimeChange = (event: any, selectedTime?: Date) => {
    setShowExaminationTimePicker(false);
    if (selectedTime) {
      updateField('examinationTime', selectedTime.toTimeString().split(' ')[0]);
    }
  };

  const onFollowUpDateChange = (event: any, selectedDate?: Date) => {
    setShowFollowUpDatePicker(false);
    if (selectedDate) {
      updateField('followUpDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onDobChange = (event: any, selectedDate?: Date) => {
    setShowDobPicker(false);
    if (selectedDate) {
      updateField('patientDob', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onLmpChange = (event: any, selectedDate?: Date) => {
    setShowLmpPicker(false);
    if (selectedDate) {
      updateField('lmp', selectedDate.toISOString().split('T')[0]);
    }
  };


  const handleSave = () => {
    Alert.alert(
      'Save Consultation',
      'Are you sure you want to save this consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            console.log('Consultation saved:', formData);
            onComplete();
          },
        },
      ]
    );
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    placeholder: string,
    isVisible: boolean,
    setVisible: (visible: boolean) => void,
    required: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label} {required && '*'}</Text>}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(!isVisible)}
      >
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <ChevronDown color="#6A2CB0" size={20} />
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderPatientInfo = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <User color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Patient Information</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={formData.patientAge}
              onChangeText={(value) => updateField('patientAge', value)}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.halfInput}>
            {renderDropdown(
              'Gender',
              formData.patientGender,
              genderOptions,
              (value) => updateField('patientGender', value),
              'Select gender',
              showGenderDropdown,
              setShowGenderDropdown,
              true
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDobPicker(true)}
          >
            <Calendar color="#6A2CB0" size={20} />
            <Text style={styles.dateInputText}>
              {formData.patientDob
                ? new Date(formData.patientDob).toLocaleDateString()
                : 'Select date of birth'
              }
            </Text>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              value={formData.patientDob ? new Date(formData.patientDob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDobChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.contactInfo}
            onChangeText={(value) => updateField('contactInfo', value)}
            placeholder="Contact person name, relationship, phone number"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  const renderIncidentDetails = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <FileText color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Incident Details</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Incident *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowIncidentDatePicker(true)}
          >
            <Calendar color="#6A2CB0" size={20} />
            <Text style={styles.dateInputText}>
              {formData.incidentDate
                ? new Date(formData.incidentDate).toLocaleDateString()
                : 'Select incident date'
              }
            </Text>
          </TouchableOpacity>
          {showIncidentDatePicker && (
            <DateTimePicker
              value={formData.incidentDate ? new Date(formData.incidentDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onIncidentDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time of Incident</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowIncidentTimePicker(true)}
          >
            <Clock color="#6A2CB0" size={20} />
            <Text style={styles.dateInputText}>
              {formData.incidentTime || 'Select incident time'}
            </Text>
          </TouchableOpacity>
          {showIncidentTimePicker && (
            <DateTimePicker
              value={formData.incidentTime ? new Date(`2000-01-01T${formData.incidentTime}`) : new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onIncidentTimeChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Examination Date *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowExaminationDatePicker(true)}
          >
            <Calendar color="#6A2CB0" size={20} />
            <Text style={styles.dateInputText}>
              {formData.examinationDate
                ? new Date(formData.examinationDate).toLocaleDateString()
                : 'Select examination date'
              }
            </Text>
          </TouchableOpacity>
          {showExaminationDatePicker && (
            <DateTimePicker
              value={formData.examinationDate ? new Date(formData.examinationDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onExaminationDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Examination Time</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowExaminationTimePicker(true)}
          >
            <Clock color="#6A2CB0" size={20} />
            <Text style={styles.dateInputText}>
              {formData.examinationTime || 'Select examination time'}
            </Text>
          </TouchableOpacity>
          {showExaminationTimePicker && (
            <DateTimePicker
              value={formData.examinationTime ? new Date(`2000-01-01T${formData.examinationTime}`) : new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onExaminationTimeChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location of Incident *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.incidentLocation}
            onChangeText={(value) => updateField('incidentLocation', value)}
            placeholder="Address, landmark, or general area where incident occurred"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type of Violence *</Text>
          {renderDropdown(
            'Violence Form',
            formData.violenceForm,
            violenceFormOptions,
            (value) => updateField('violenceForm', value),
            'Select form of violence',
            showViolenceFormDropdown,
            setShowViolenceFormDropdown,
            true
          )}
        </View>

        {formData.violenceForm === 'Sexual Violence' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type of Sexual Violence</Text>
            {renderDropdown(
              'Violence Type',
              formData.violenceType,
              violenceTypeOptions,
              (value) => updateField('violenceType', value),
              'Select type',
              showViolenceTypeDropdown,
              setShowViolenceTypeDropdown
            )}
          </View>
        )}

        {formData.violenceForm === 'Sexual Violence' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condom Used?</Text>
            {renderDropdown(
              '',
              formData.condomUsed,
              yesNoUnknownOptions,
              (value) => updateField('condomUsed', value),
              'Select option',
              showCondomDropdown,
              setShowCondomDropdown
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Police Reported?</Text>
          {renderDropdown(
            '',
            formData.policeReported,
            yesNoOptions,
            (value) => updateField('policeReported', value),
            'Select option',
            showPoliceDropdown,
            setShowPoliceDropdown
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Perpetrator Information</Text>
          <Text style={styles.sublabel}>Only if patient wishes to share</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.perpetratorRelationship}
            onChangeText={(value) => updateField('perpetratorRelationship', value)}
            placeholder="Relationship to patient, age, description (optional)"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );


  const renderPsychologicalAssessment = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Brain color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Psychological Assessment</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mental State Examination *</Text>
          <Text style={styles.sublabel}>Observe mood, affect, thought process, and trauma response</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.mood}
            onChangeText={(value) => updateField('mood', value)}
            placeholder="Anxious, calm, distressed, confused, alert, withdrawn, etc."
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Coping and Resilience</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.thoughtProcess}
            onChangeText={(value) => updateField('thoughtProcess', value)}
            placeholder="How is the patient managing? Support systems, coping strategies"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Immediate Support Needs *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.referralsCounseling}
            onChangeText={(value) => updateField('referralsCounseling', value)}
            placeholder="Counseling, safe housing, legal aid, family support, medical follow-up"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Risk Assessment</Text>
          <Text style={styles.sublabel}>Suicide risk, ongoing danger, safety concerns</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.suicidalIdeation}
            onChangeText={(value) => updateField('suicidalIdeation', value)}
            placeholder="Low/Medium/High risk. Describe safety concerns or protective factors."
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );


  const renderMedicalHistory = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <FileText color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Medical History</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Significant Medical History *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.medicalHistory}
            onChangeText={(value) => updateField('medicalHistory', value)}
            placeholder="Chronic conditions, current medications, allergies, previous hospitalizations"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OB/GYN History</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.sublabel}>Parity (G_P_)</Text>
              <TextInput
                style={styles.input}
                value={formData.parity}
                onChangeText={(value) => updateField('parity', value)}
                placeholder="G2P1"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.sublabel}>LMP</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowLmpPicker(true)}
              >
                <Calendar color="#6A2CB0" size={20} />
                <Text style={styles.dateInputText}>
                  {formData.lmp
                    ? new Date(formData.lmp).toLocaleDateString()
                    : 'Select LMP date'
                  }
                </Text>
              </TouchableOpacity>
              {showLmpPicker && (
                <DateTimePicker
                  value={formData.lmp ? new Date(formData.lmp) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onLmpChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            {renderDropdown(
              'Contraception Type',
              formData.contraception,
              contraceptionOptions,
              (value) => updateField('contraception', value),
              'Select contraception',
              showContraceptionDropdown,
              setShowContraceptionDropdown
            )}
          </View>
          <View style={styles.halfInput}>
            {renderDropdown(
              'Known Pregnancy?',
              formData.pregnancy,
              pregnancyOptions,
              (value) => updateField('pregnancy', value),
              'Select status',
              showPregnancyDropdown,
              setShowPregnancyDropdown
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderForensicEvidence = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <FileText color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Forensic Evidence</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          {renderDropdown(
            'Clothing Changed?',
            formData.clothingChanged,
            yesNoOptions,
            (value) => updateField('clothingChanged', value),
            'Select option',
            showClothingDropdown,
            setShowClothingDropdown,
            true
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            {renderDropdown(
              'Bath/Cleaning',
              formData.bathingStatus,
              yesNoOptions,
              (value) => updateField('bathingStatus', value),
              'Select option',
              showBathingDropdown,
              setShowBathingDropdown
            )}
          </View>
          <View style={styles.halfInput}>
            {renderDropdown(
              'Toilet Use',
              formData.toiletUse,
              ['Long call', 'Short call', 'No'],
              (value) => updateField('toiletUse', value),
              'Select option',
              showToiletDropdown,
              setShowToiletDropdown
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderPhysicalExamination = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Heart color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Physical Examination</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vital Signs *</Text>
          <View style={styles.row}>
            <View style={styles.quarterInput}>
              <Text style={styles.sublabel}>BP (mmHg)</Text>
              <TextInput
                style={styles.input}
                value={formData.bloodPressure}
                onChangeText={(value) => updateField('bloodPressure', value)}
                placeholder="120/80"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.quarterInput}>
              <Text style={styles.sublabel}>Pulse (bpm)</Text>
              <TextInput
                style={styles.input}
                value={formData.pulseRate}
                onChangeText={(value) => updateField('pulseRate', value)}
                placeholder="72"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.quarterInput}>
              <Text style={styles.sublabel}>RR (per min)</Text>
              <TextInput
                style={styles.input}
                value={formData.respiratoryRate}
                onChangeText={(value) => updateField('respiratoryRate', value)}
                placeholder="20"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.quarterInput}>
              <Text style={styles.sublabel}>Temp (°C)</Text>
              <TextInput
                style={styles.input}
                value={formData.temperature}
                onChangeText={(value) => updateField('temperature', value)}
                placeholder="37.0"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Physical Injuries *</Text>
          <Text style={styles.sublabel}>Document all visible injuries with body mapping</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.physicalInjuries}
            onChangeText={(value) => updateField('physicalInjuries', value)}
            placeholder="Head: none; Neck: bruising 2x3cm left side; Arms: defensive wounds; etc."
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Genital Examination *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.outerGenitalia}
            onChangeText={(value) => updateField('outerGenitalia', value)}
            placeholder="Outer genitalia, vaginal, hymen, anal examination findings"
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  const renderLaboratoryTests = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <FileText color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Laboratory & Samples</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Samples Collected *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.samplesCollected}
            onChangeText={(value) => updateField('samplesCollected', value)}
            placeholder="Genital swab, anal swab, oral swab, blood, urine, nail clippings, etc."
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tests Ordered *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.hivTest}
            onChangeText={(value) => updateField('hivTest', value)}
            placeholder="HIV test, pregnancy test, STI panel, DNA analysis, culture & sensitivity"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Chain of Custody</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.chainOfCustody}
            onChangeText={(value) => updateField('chainOfCustody', value)}
            placeholder="Samples handed to police officer: Name, badge number, date, time"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  const renderTreatmentManagement = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Heart color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Treatment & Management</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>PEP Given</Text>
            {renderDropdown(
              '',
              formData.pepGiven,
              pepOptions,
              (value) => updateField('pepGiven', value),
              'Select option',
              showPepDropdown,
              setShowPepDropdown
            )}
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>ECP Given</Text>
            {renderDropdown(
              '',
              formData.ecpGiven,
              ecpOptions,
              (value) => updateField('ecpGiven', value),
              'Select option',
              showEcpDropdown,
              setShowEcpDropdown
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>STI Treatment *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.stiTreatment}
            onChangeText={(value) => updateField('stiTreatment', value)}
            placeholder="Antibiotics given, dosage, duration"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Surgical Treatment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.surgicalTreatment}
            onChangeText={(value) => updateField('surgicalTreatment', value)}
            placeholder="Stitching, surgical toilet, wound care"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Other Medications</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.otherMedications}
            onChangeText={(value) => updateField('otherMedications', value)}
            placeholder="Pain medication, antibiotics, tetanus shot, etc."
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  const renderReferralsFollowUp = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Check color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Referrals & Follow-up</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Referrals Made *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.referralsOther}
            onChangeText={(value) => updateField('referralsOther', value)}
            placeholder="Police station, legal aid, trauma counseling, safe shelter, HIV clinic, laboratory"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Follow-up Date *</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowFollowUpDatePicker(true)}
            >
              <Calendar color="#6A2CB0" size={16} />
              <Text style={styles.dateInputText}>
                {formData.followUpDate
                  ? new Date(formData.followUpDate).toLocaleDateString()
                  : 'Select date'
                }
              </Text>
            </TouchableOpacity>
            {showFollowUpDatePicker && (
              <DateTimePicker
                value={formData.followUpDate ? new Date(formData.followUpDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onFollowUpDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Follow-up Type</Text>
            {renderDropdown(
              '',
              formData.followUpType,
              followUpTypeOptions,
              (value) => updateField('followUpType', value),
              'Select follow-up type',
              showFollowUpTypeDropdown,
              setShowFollowUpTypeDropdown
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderClinicalNotes = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <FileText color="#6A2CB0" size={24} />
        <Text style={styles.sectionTitle}>Clinical Notes & Recommendations</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Clinical Notes *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.clinicalNotes}
            onChangeText={(value) => updateField('clinicalNotes', value)}
            placeholder="Additional observations, patient concerns, important details, provider assessment"
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recommendations</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.recommendations}
            onChangeText={(value) => updateField('recommendations', value)}
            placeholder="Treatment recommendations, follow-up care, specialist consultations"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft color="#6A2CB0" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Healthcare Consultation</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {renderPatientInfo()}
        {renderIncidentDetails()}
        {renderMedicalHistory()}
        {renderForensicEvidence()}
        {renderPhysicalExamination()}
        {renderLaboratoryTests()}
        {renderTreatmentManagement()}
        {renderPsychologicalAssessment()}
        {renderReferralsFollowUp()}
        {renderClinicalNotes()}
      </ScrollView>
    </SafeAreaView>
  );
}

// Dropdown styles for healthcare consultation form
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  saveButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#6A2CB0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  sectionContent: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  quarterInput: {
    flex: 0.25,
    marginRight: 8,
  },
  subInputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
  },
});