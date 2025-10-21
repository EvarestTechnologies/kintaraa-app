# MOH Forms Testing Guide
**PRC Form (MOH 363) & P3 Form Official Testing Instructions**

Last Updated: October 20, 2025
Forms Version: Complete (Days 1-8 Implementation)

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Testing PRC Form (MOH 363)](#testing-prc-form-moh-363)
3. [Testing P3 Form (Official 11-Page)](#testing-p3-form-official-11-page)
4. [Dashboard Integration](#dashboard-integration)
5. [Test Scenarios](#test-scenarios)
6. [Troubleshooting](#troubleshooting)
7. [Expected Behavior](#expected-behavior)

---

## 🚀 Quick Start

### Prerequisites
1. **Start the Expo Development Server:**
   ```bash
   cd /home/achar/Desktop/Projects/kintaraa-app
   npx expo start --tunnel
   ```

2. **Login as Healthcare Provider or Police Officer:**
   - Healthcare: `doctor@test.com` / any password
   - Police: `police@test.com` / any password
   - (Using mock authentication from `constants/DummyData.ts`)

3. **Access Forms:**
   - **PRC Form**: Healthcare Dashboard → "PRC Form (MOH 363)" button (green)
   - **P3 Form**: Police Dashboard → "P3 Form" button (blue)

---

## 🏥 Testing PRC Form (MOH 363)

### **Form Location:**
- **Route:** `/forms/prc/new`
- **Dashboard Access:** Healthcare Dashboard → Quick Actions → "PRC Form (MOH 363)"
- **Files:**
  - Route: `app/forms/prc/[id].tsx`
  - Layout: `components/forms/prc/PRCFormLayout.tsx`
  - Sections: `components/forms/prc/sections/` (9 section files)

### **Test Plan:**

#### **1. Form Navigation & Initialization** ✅
- [ ] Click "PRC Form (MOH 363)" button in Healthcare Dashboard
- [ ] Verify form loads with 11 sections in navigation
- [ ] Check that form initializes with empty data
- [ ] Verify progress indicator shows "Section 1 of 11"

**Expected:** Form opens with Section 1 (Patient Demographics) visible

#### **2. Section 1: Patient Demographics** ✅
- [ ] Fill in patient name (text input)
- [ ] Enter age (number input)
- [ ] Select sex (radio: Male/Female/Intersex)
- [ ] Add ID/Birth Certificate number
- [ ] Enter phone number
- [ ] Add residence/address
- [ ] Click "Next" to proceed to Section 2

**Expected:** All fields accept input correctly, Next button navigates to Section 2

#### **3. Section 2: Incident Details** ✅
- [ ] Enter incident date/time
- [ ] Enter reporting date/time
- [ ] Add incident location
- [ ] Describe nature of incident (textarea)
- [ ] Test time-critical alerts appear (if within 72h/120h windows)
- [ ] Click "Next"

**Expected:** Time alerts show PEP (72h) and EC (120h) countdown if applicable

#### **4. Section 3: Forensic Examination** ✅
- [ ] Select examination types (checkboxes)
- [ ] Document general appearance
- [ ] Record mental state observations
- [ ] Add forensic notes
- [ ] Click "Next"

**Expected:** Checkboxes toggle correctly, text areas accept input

#### **5. Section 4: OB/GYN History** (Female/Intersex patients) ✅
- [ ] Enter LMP (Last Menstrual Period) date
- [ ] Record gravida/para information
- [ ] Add contraception details
- [ ] Document pregnancy history
- [ ] Click "Next"

**Expected:** Section appears for female/intersex patients only

#### **6. Section 5: Physical Examination** ✅
- [ ] Record vital signs (BP, HR, RR, Temp)
- [ ] Document general examination findings
- [ ] Use interactive body map to mark injuries
- [ ] Click injury locations on body diagram
- [ ] Add injury descriptions
- [ ] Click "Next"

**Expected:** Body map allows clicking to add injury markers, descriptions save

#### **7. Section 6: Genital Examination** ✅
- [ ] Document external genital findings (gender-specific)
- [ ] Record internal examination (if applicable)
- [ ] Note any trauma or abnormalities
- [ ] Add detailed examination notes
- [ ] Click "Next"

**Expected:** Gender-appropriate examination fields appear

#### **8. Section 7: Immediate Management** ✅
- [ ] Check PEP (Post-Exposure Prophylaxis) - if within 72h
- [ ] Check EC (Emergency Contraception) - if within 120h
- [ ] Check Tetanus Toxoid
- [ ] Check Hepatitis B vaccination
- [ ] Record dosages and times administered
- [ ] Document other medications given
- [ ] Click "Next"

**Expected:** Time-critical medications highlighted if within window

#### **9. Section 8: Referrals** ✅
- [ ] Select referral types (checkboxes):
  - Laboratory
  - Legal
  - Trauma Counseling
  - Safe Shelter
  - OPD/CCC/HIV Clinic
  - Other
- [ ] Add referral notes
- [ ] Click "Next"

**Expected:** Multiple referrals can be selected

#### **10. Section 9: Laboratory Samples** ✅
- [ ] Select sample types collected (checkboxes)
- [ ] Choose tests for each sample
- [ ] Select lab type (National/Health Facility)
- [ ] Fill chain of custody section:
  - Samples packed by (name, signature)
  - Samples issued to (police officer name, signature)
  - Date fields
- [ ] Click "Next"

**Expected:** Chain of custody tracks evidence properly

#### **11. PART B: Psychological Assessment** ✅
- [ ] Document general appearance and behavior
- [ ] Record rapport, mood, affect
- [ ] Note speech patterns
- [ ] Document perception and thought content
- [ ] Assess cognitive function (memory, orientation, concentration)
- [ ] Add recommendations
- [ ] Record referral points
- [ ] Add examining officer signature
- [ ] Final section - shows "Submit" button

**Expected:** All psychological assessment fields available, Submit button appears

#### **12. Save & Submit** ✅
- [ ] Click "💾 Save Draft" button
- [ ] Verify success message appears
- [ ] Close and reopen form
- [ ] Verify data persists (loaded from AsyncStorage)
- [ ] Fill remaining required fields
- [ ] Click "✓ SUBMIT COMPLETED FORM"
- [ ] Confirm submission dialog
- [ ] Verify form status changes to "submitted"

**Expected:** Form saves to AsyncStorage, data persists, submission succeeds

---

## 👮 Testing P3 Form (Official 11-Page)

### **Form Location:**
- **Route:** `/forms/p3/new`
- **Dashboard Access:** Police Dashboard → Quick Actions → "P3 Form"
- **Files:**
  - Route: `app/forms/p3/[id].tsx`
  - Layout: `components/forms/p3-official/P3FormLayout_Official.tsx`
  - Sections: `components/forms/p3-official/` (7 component files)

### **Test Plan:**

#### **1. Form Navigation & Initialization** ✅
- [ ] Click "P3 Form" button in Police Dashboard
- [ ] Verify form loads with 6 sections in navigation
- [ ] Check color-coded tabs (blue=police, green=medical, pink=sexual, orange=custody)
- [ ] Verify progress bar shows "Section 1 of 6"

**Expected:** Form opens with PART ONE (Police Section) visible

#### **2. PART ONE: Police Officer Section** (Pages 1-2) ✅
- [ ] Enter nature of alleged offence
- [ ] Add date/time of alleged offence
- [ ] Add date/time reported to police
- [ ] Enter OB (Occurrence Book) number
- [ ] Add police station name
- [ ] Enter investigating officer details (service number, name)
- [ ] Add medical facility name
- [ ] Select examination type (Complainant/Accused)
- [ ] Enter patient details:
  - Name
  - Age
  - Sex (Male/Female/Intersex)
  - ID/Birth Certificate number
  - Contact number
  - Place of residence
- [ ] Add date sent to medical facility
- [ ] Fill escort details (police officer + authorized guardians)
- [ ] Add brief details of alleged offence (textarea)
- [ ] Enter purpose of examination
- [ ] Add commanding officer name
- [ ] Click "Next"

**Expected:** All fields accept input, blue police branding visible

#### **3. Section A: Practitioner Details & Consent** (Pages 2-3) ✅
- [ ] Enter practitioner name
- [ ] Add registration number
- [ ] Add qualifications
- [ ] Enter telephone contact
- [ ] Add medical facility name
- [ ] Enter patient record number
- [ ] Add facility contact and address
- [ ] Enter medical/forensic facility reference number
- [ ] Read 7-point consent declaration
- [ ] Mark "Consent Given" (Yes/No radio)
- [ ] If No: add reason for no consent
- [ ] Enter patient full names
- [ ] Add guardian name (if minor)
- [ ] Enter date of birth and age
- [ ] Add persons present during examination
- [ ] Click "Next"

**Expected:** Consent declaration displays all 7 points, guardian fields show for minors

#### **4. Section A: Medical History** (Page 3) ✅
- [ ] Enter relevant medical history (textarea)
- [ ] Complete sexual offence history checklist:
  - Changed clothes (Yes/No)
  - Condom used (Yes/No/Unknown)
  - Bathed/washed/showered (Yes/No)
  - Urinated (Yes/No)
  - Defecated (Yes/No)
  - Wiped (Yes/No)
  - Currently pregnant (Yes/No/Unknown)
  - Currently menstruating (Yes/No)
- [ ] Add history notes
- [ ] Enter "History given by" (name, relationship)
- [ ] Click "Next"

**Expected:** 8-item checklist toggles correctly, yellow section styling

#### **5. Section B: General Examination** (Pages 3-5) ✅
- [ ] Record vital signs:
  - Heart rate
  - Respiratory rate
  - Blood pressure
  - Temperature
  - Oedema
  - Lymph nodes
- [ ] Document state of clothing:
  - Description
  - Stains/debris description
  - Forensic collection done (Yes/No)
  - Reason if not collected
- [ ] Record physical appearance and behavior
- [ ] Enter body measurements:
  - Height
  - Weight
  - General body build (frail/normal/obese/other)
  - Percentiles (for children)
- [ ] Document clinical evidence of intoxication
- [ ] Select toxicology samples (blood/urine)
- [ ] Complete detailed examination by 10 body regions:
  - Head and Neck
  - Oral cavity
  - Eye/Orbit (petechiae, hemorrhage)
  - Scalp
  - ENT
  - CNS (AVPU scale, gait)
  - Chest
  - Abdomen
  - Upper Limbs
  - Lower Limbs
- [ ] Estimate age of injuries
- [ ] Describe probable mechanism of injuries
- [ ] Select degree of injury (Harm/Grievous Harm/Maim)
- [ ] Read legal definitions box
- [ ] Add additional notes
- [ ] Document treatment/referral plan
- [ ] Add practitioner name and signature
- [ ] Click "Next"

**Expected:** 10 body region fields, legal definitions visible, green medical branding

#### **6. Section C: Sexual Offences Examination** (Pages 5-7) ✅

**For Female/Intersex Patients:**
- [ ] Enter Tanner stage (if child)
- [ ] Document labia majora
- [ ] Document labia minora
- [ ] Examine clitoris and peri-urethral area
- [ ] Document vestibule
- [ ] **CRITICAL:** Describe hymen (posterior rim, edges, tears by clock face, fourchette)
- [ ] Document vagina
- [ ] Document cervix
- [ ] Note discharge/blood/infection
- [ ] Select position during examination (supine/left lateral/knee chest)
- [ ] Mark speculum used (Yes/No)

**For Male/Intersex Patients:**
- [ ] Enter Tanner stage (if child)
- [ ] Document prepuce/frenulum (circumcision status)
- [ ] Document shaft
- [ ] Document scrotum
- [ ] Document anus
- [ ] Add discharge notes

**Specimen Collection (All patients):**
- [ ] Medical samples:
  - Blood (Yes/No)
  - Urine (Yes/No)
- [ ] Forensic serology samples (12 types):
  - Reference sample (buccal swab/blood)
  - Oral swab (ejaculation)
  - Bite mark swab
  - Pubic hair (combed/shaved/plucked)
  - Low vaginal swab (female)
  - High vaginal swab (female)
  - Endo-cervical swab (female)
  - Anal swab
  - Rectal swab (male)
  - Finger nail clippings/scrapings

**Medication & Recommendations:**
- [ ] Record medication administered:
  - PEP (dosage, time) - 72h window
  - EC (dosage, time) - 120h window
  - TT (dosage, time)
  - Hep B (dosage, time)
- [ ] Add additional remarks/conclusion
- [ ] Document recommendations/referrals
- [ ] Click "Next"

**Expected:** Gender-specific fields appear, 12 specimen types, pink section branding

#### **7. Chain of Custody** (Page 7) ✅
- [ ] Add evidence items to tracking table:
  - Serial number (auto-increments)
  - Evidence description
  - Received from
  - Delivered to
  - Date
  - Comments
- [ ] Click "+ Add Evidence Item" to add more rows
- [ ] Fill "Specimens Collected By" (Medical Practitioner):
  - Practitioner name
  - Date collected
  - Time collected
  - Medical facility
  - Signature
  - Facility stamp
- [ ] Fill "Specimens Received By" (Police Officer):
  - Police officer name
  - Service number
  - Date received
  - Time received
  - Police station
  - OB number
  - Signature
  - Police station stamp
- [ ] Read legal declaration
- [ ] Final section reached - "Submit" button appears

**Expected:** Evidence table allows multiple rows, dual signatures, orange branding

#### **8. Save & Submit** ✅
- [ ] Click "💾 Save Draft" button
- [ ] Verify success alert appears
- [ ] Close and reopen form (`/forms/p3/[formId]`)
- [ ] Verify all data persists from AsyncStorage
- [ ] Navigate to last section (Chain of Custody)
- [ ] Fill all required fields
- [ ] Click "✓ SUBMIT COMPLETED FORM"
- [ ] Confirm submission in alert dialog
- [ ] Verify form status changes to "submitted"
- [ ] Verify navigation back to dashboard

**Expected:** Form saves/loads correctly, submission succeeds, returns to dashboard

---

## 📱 Dashboard Integration

### **Healthcare Provider Dashboard**
**Location:** `/(dashboard)/healthcare`

**Test:**
1. [ ] Login as healthcare provider (`doctor@test.com`)
2. [ ] Navigate to Healthcare Dashboard
3. [ ] Verify "PRC Form (MOH 363)" button appears in Quick Actions
4. [ ] Button should be green (#2E7D32)
5. [ ] Subtitle: "GBV examination"
6. [ ] Click button → navigates to `/forms/prc/new`

**Expected:** Green button visible, navigation works

### **Police Officer Dashboard**
**Location:** `/(dashboard)/police`

**Test:**
1. [ ] Login as police officer (`police@test.com`)
2. [ ] Navigate to Police Dashboard
3. [ ] Verify "P3 Form" button appears in Quick Actions
4. [ ] Button should be blue (#1565C0)
5. [ ] Click button → navigates to `/forms/p3/new`

**Expected:** Blue button visible, navigation works

---

## 🧪 Test Scenarios

### **Scenario 1: Complete PRC Form End-to-End** ⏱️ ~15 minutes
**Purpose:** Test full PRC form workflow from start to finish

**Steps:**
1. Login as healthcare provider
2. Click "PRC Form (MOH 363)" from dashboard
3. Fill ALL 11 sections sequentially
4. Use body map to mark 2-3 injuries
5. Check all time-critical medications (PEP, EC, TT, Hep B)
6. Add chain of custody details
7. Complete psychological assessment
8. Save draft
9. Close form
10. Reopen form from saved drafts list
11. Submit completed form

**Expected Results:**
- ✅ All sections accept input without errors
- ✅ Navigation works (Previous/Next buttons)
- ✅ Progress tracking updates correctly
- ✅ Body map injuries save
- ✅ Time-critical alerts display
- ✅ Draft saves to AsyncStorage
- ✅ Form reloads with all data intact
- ✅ Submission succeeds

### **Scenario 2: Complete P3 Form End-to-End** ⏱️ ~20 minutes
**Purpose:** Test full P3 form workflow from start to finish

**Steps:**
1. Login as police officer
2. Click "P3 Form" from dashboard
3. Fill PART ONE (Police Section) completely
4. Fill Section A (Practitioner Details & Consent)
5. Fill Section A (Medical History) with checklist
6. Fill Section B (General Examination) - all 10 body regions
7. Fill Section C (Sexual Offences) - choose patient sex, fill gender-specific examination
8. Select 5+ specimen types from collection list
9. Add medication administered (PEP, EC, TT, Hep B)
10. Fill Chain of Custody with 3 evidence items
11. Add dual signatures (practitioner + police)
12. Save draft
13. Close and reopen
14. Submit completed form

**Expected Results:**
- ✅ PART ONE/TWO navigation works
- ✅ Color-coded sections display correctly
- ✅ Gender-specific fields appear based on patient sex
- ✅ 12 specimen types available
- ✅ Evidence table allows multiple rows
- ✅ Legal definitions display
- ✅ Draft saves with official AsyncStorage key
- ✅ Form reloads with all sections intact
- ✅ Submission succeeds

### **Scenario 3: Time-Critical Alerts** ⏱️ ~5 minutes
**Purpose:** Test PEP and EC countdown alerts

**Steps:**
1. Open PRC form
2. In Section 2 (Incident Details), enter incident date/time = **TODAY** at 2 hours ago
3. Proceed to Section 7 (Immediate Management)
4. Check if PEP alert shows "70 hours remaining"
5. Check if EC alert shows "118 hours remaining"
6. Go back to Section 2
7. Change incident date to 80 hours ago
8. Return to Section 7
9. Check if PEP alert shows "expired" or warning

**Expected Results:**
- ✅ PEP shows 72h - (hours since incident)
- ✅ EC shows 120h - (hours since incident)
- ✅ Alerts turn red/warning after expiry
- ✅ Calculations are accurate

### **Scenario 4: Gender-Specific Sections** ⏱️ ~3 minutes
**Purpose:** Test conditional rendering based on patient sex

**PRC Form:**
1. Create new PRC form
2. In Section 1, select Sex = "Male"
3. Navigate to Section 4 (OB/GYN History)
4. Verify section is hidden or shows message "Not applicable for male patients"
5. Navigate to Section 6 (Genital Examination)
6. Verify male-specific examination fields appear
7. Go back to Section 1
8. Change Sex to "Female"
9. Return to Section 4
10. Verify OB/GYN section now appears
11. Navigate to Section 6
12. Verify female-specific examination fields appear

**P3 Form:**
1. Create new P3 form
2. In PART ONE, select Sex = "Female"
3. Navigate to Section C (Sexual Offences)
4. Verify female genital examination fields appear (labia, hymen, vagina, cervix)
5. Verify female-only specimen types appear (low/high vaginal swab, endo-cervical)
6. Go back to PART ONE
7. Change Sex to "Male"
8. Return to Section C
9. Verify male genital examination fields appear (prepuce, shaft, scrotum)
10. Verify male-only specimen types appear (rectal swab)

**Expected Results:**
- ✅ OB/GYN section hidden for male patients
- ✅ Gender-appropriate genital exam fields display
- ✅ Specimen collection options match patient sex
- ✅ No errors when switching between sexes

### **Scenario 5: AsyncStorage Persistence** ⏱️ ~5 minutes
**Purpose:** Test offline draft saving and recovery

**Steps:**
1. Create new PRC form (`/forms/prc/new`)
2. Fill first 3 sections with data
3. Click "Save Draft"
4. Note the form ID from the URL
5. Close the form (navigate away)
6. Open React Native Debugger or use AsyncStorage viewer
7. Check for key: `prc_form_${formId}`
8. Verify JSON data is stored
9. Navigate to `/forms/prc/[formId]` with the saved ID
10. Verify all 3 sections load with correct data
11. Make changes to Section 4
12. Save draft again
13. Verify updates are persisted

**Expected Results:**
- ✅ Form saves to AsyncStorage with correct key
- ✅ JSON structure matches PRCFormMOH363 type
- ✅ Form loads from storage on navigation
- ✅ Updates overwrite previous draft
- ✅ No data loss

### **Scenario 6: Form Validation** ⏱️ ~5 minutes
**Purpose:** Test required field validation

**Steps:**
1. Create new form (PRC or P3)
2. Try to click "Next" on first section without filling required fields
3. Verify validation errors appear
4. Fill only some required fields
5. Try to submit at end
6. Verify submission blocked with validation alert
7. Fill all required fields
8. Verify submission succeeds

**Expected Results:**
- ✅ Required fields marked with red asterisk (*)
- ✅ Validation prevents navigation if critical fields empty
- ✅ Submission blocked until all required fields filled
- ✅ Clear error messages displayed

---

## 🐛 Troubleshooting

### **Issue 1: Form doesn't load / Blank screen**

**Possible Causes:**
- Route not configured correctly
- Import errors in component files
- TypeScript compilation errors

**Solutions:**
1. Check Expo terminal for errors
2. Verify route exists: `app/forms/prc/[id].tsx` and `app/forms/p3/[id].tsx`
3. Run TypeScript check: `npx tsc --noEmit`
4. Check imports in layout files
5. Restart Expo server: `npx expo start --clear`

### **Issue 2: "Form not found" error when editing**

**Possible Causes:**
- AsyncStorage key mismatch
- Form ID doesn't exist

**Solutions:**
1. Check AsyncStorage keys:
   - PRC: `prc_form_${id}`
   - P3: `p3_form_official_${id}`
2. Verify ID is valid (use `/forms/prc/new` to create new)
3. Clear AsyncStorage and start fresh:
   ```javascript
   // In React Native Debugger console
   AsyncStorage.clear()
   ```

### **Issue 3: Data doesn't persist after save**

**Possible Causes:**
- AsyncStorage not saving
- Form ID changing between saves
- JSON serialization errors

**Solutions:**
1. Check browser/mobile logs for AsyncStorage errors
2. Verify form ID stays constant
3. Check JSON structure matches type definitions
4. Test AsyncStorage manually:
   ```javascript
   // In console
   AsyncStorage.getItem('prc_form_12345').then(console.log)
   ```

### **Issue 4: Navigation buttons (Previous/Next) not working**

**Possible Causes:**
- State management issue
- Section index out of bounds
- Layout component error

**Solutions:**
1. Check console for state errors
2. Verify section indices are correct (0-based)
3. Check layout component's navigation logic
4. Verify all sections are in sections array

### **Issue 5: Gender-specific fields not showing/hiding**

**Possible Causes:**
- Patient sex not set correctly
- Conditional rendering logic error
- Props not passed down

**Solutions:**
1. Check patient sex value in form state
2. Verify conditional rendering in component:
   ```typescript
   {patientSex === 'female' && <FemaleExamination />}
   ```
3. Check props being passed to section components
4. Add console.log to verify sex value

### **Issue 6: Time-critical alerts not calculating correctly**

**Possible Causes:**
- Date parsing error
- Timezone issues
- Calculation logic error

**Solutions:**
1. Check incident date format (ISO 8601)
2. Verify current time vs incident time
3. Check calculation logic in component
4. Test with known dates:
   - PEP: incident 24h ago should show ~48h remaining
   - EC: incident 24h ago should show ~96h remaining

---

## ✅ Expected Behavior

### **PRC Form (MOH 363)**

**General:**
- 11 sections total (9 in PART A + 1 in PART B + 1 chain of custody)
- Green medical theme (#2E7D32)
- Progress indicator: "Section X of 11"
- Previous/Next navigation buttons
- Save Draft button always visible
- Submit button only on last section

**Specific Sections:**
- **Section 1-3:** Available for all patients
- **Section 4 (OB/GYN):** Only for female/intersex patients
- **Section 5 (Physical Exam):** Body map allows clicking to add injuries
- **Section 6 (Genital Exam):** Gender-specific fields
- **Section 7 (Management):** Time-critical medications highlighted
- **Section 8 (Referrals):** Multiple checkboxes
- **Section 9 (Lab Samples):** Chain of custody with dual signatures
- **PART B:** Psychological assessment with cognitive function subsections

**Data Persistence:**
- Saves to: `AsyncStorage: prc_form_${id}`
- List key: `prc_forms_list_${userId}`
- Auto-saves on draft button click
- Loads on form open

### **P3 Form (Official)**

**General:**
- 6 sections total (PART ONE + 5 sections in PART TWO)
- Color-coded sections:
  - Blue (#1565C0): Police
  - Green (#2E7D32): Medical general
  - Pink (#C2185B): Sexual offences
  - Orange (#FF6F00): Chain of custody
- Tab navigation at top
- Progress bar
- Previous/Next buttons
- Save Draft button
- Submit button on last section

**Specific Sections:**
- **PART ONE:** Blue police branding, 10 subsections
- **Section A (Consent):** 7-point declaration, consent given/not given
- **Section A (History):** 8-item sexual offence checklist
- **Section B (General):** 10 body regions, legal definitions box
- **Section C (Sexual):** Gender-specific examinations, 12 specimen types
- **Chain of Custody:** Evidence table with multiple rows, dual signatures

**Data Persistence:**
- Saves to: `AsyncStorage: p3_form_official_${id}`
- List key: `p3_forms_official_list_${userId}`
- Complete type safety with P3FormOfficial interface
- All nested sections persist

---

## 📊 Test Results Template

Use this template to document your testing:

```markdown
# Form Testing Results

**Date:** [Date]
**Tester:** [Name]
**Device:** [iOS/Android/Web]
**Expo Version:** [Version]

## PRC Form Testing

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| Form loads correctly | ✅ / ❌ | |
| All 11 sections accessible | ✅ / ❌ | |
| Navigation works | ✅ / ❌ | |
| Body map functional | ✅ / ❌ | |
| Time alerts display | ✅ / ❌ | |
| Save draft works | ✅ / ❌ | |
| Data persists | ✅ / ❌ | |
| Submit succeeds | ✅ / ❌ | |

## P3 Form Testing

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| Form loads correctly | ✅ / ❌ | |
| All 6 sections accessible | ✅ / ❌ | |
| Color-coded tabs work | ✅ / ❌ | |
| Gender fields conditional | ✅ / ❌ | |
| Specimen collection works | ✅ / ❌ | |
| Chain of custody table | ✅ / ❌ | |
| Save draft works | ✅ / ❌ | |
| Submit succeeds | ✅ / ❌ | |

## Issues Found

1. [Issue description]
2. [Issue description]

## Overall Assessment

- [ ] Forms are production-ready
- [ ] Forms need minor fixes
- [ ] Forms need major fixes
```

---

## 🎯 Success Criteria

**Consider testing successful when:**

✅ Both forms load without errors
✅ All sections are accessible via navigation
✅ All input fields accept data correctly
✅ Gender-specific sections show/hide appropriately
✅ Time-critical alerts calculate correctly
✅ Body map (PRC) allows injury marking
✅ Evidence table (P3) allows multiple rows
✅ Save Draft persists data to AsyncStorage
✅ Form reloads from saved draft with all data intact
✅ Submit changes form status to "submitted"
✅ No TypeScript errors in console
✅ No runtime errors during form interaction
✅ Forms match official PDFs exactly

---

## 📞 Support

**If you encounter issues:**

1. Check this guide's Troubleshooting section
2. Review console errors in Expo terminal
3. Verify TypeScript compilation: `npx tsc --noEmit`
4. Check AsyncStorage contents via React Native Debugger
5. Report issues with:
   - Device type (iOS/Android/Web)
   - Exact steps to reproduce
   - Console error messages
   - Screenshots if applicable

**Key Files for Reference:**
- PRC Form Types: `types/forms/PRCFormMOH363.ts`
- P3 Form Types: `types/forms/P3Form_Official.ts`
- PRC Layout: `components/forms/prc/PRCFormLayout.tsx`
- P3 Layout: `components/forms/p3-official/P3FormLayout_Official.tsx`
- Healthcare Dashboard: `dashboards/healthcare/components/DashboardOverview.tsx`
- Police Dashboard: `dashboards/police/components/DashboardOverview.tsx`

---

**Last Updated:** October 20, 2025
**Version:** 1.0 (Sprint 5 Complete)
**Status:** Ready for Testing ✅
