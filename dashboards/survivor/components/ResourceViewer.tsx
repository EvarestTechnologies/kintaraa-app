import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  X,
  Download,
  Share2,
  Bookmark,
  CheckSquare,
  Phone,
  Shield,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

// Asset mappings for local PDF files
const assetMappings: { [key: string]: any } = {
  'Kenya_Police_P3_Form_2024.pdf': require('../../../assets/documents/forms/p3-form/Kenya_Police_P3_Form_2024.pdf'),
  'Kenya_MOH_PRC_Form_363.pdf': require('../../../assets/documents/forms/prc-form/Kenya_MOH_PRC_Form_363.pdf'),
};

interface ResourceContent {
  [key: string]: {
    title: string;
    content: string;
    sections?: { title: string; content: string }[];
    checklist?: string[];
    emergencyNumbers?: { name: string; number: string }[];
    downloadUrl?: string;
    fileName?: string;
    localAssetPath?: string;
    isLocalFile?: boolean;
  };
}

const resourceContent: ResourceContent = {
  'safety-plan-guide': {
    title: 'Personal Safety Planning Guide',
    content: 'A safety plan is a personalized, practical plan that includes ways to remain safe while in a relationship, planning to leave, or after you leave.',
    sections: [
      {
        title: 'Emergency Contacts',
        content: 'Keep these numbers easily accessible on your phone:\n\n• Police: 999\n• GBV Helpline: 1195\n• Childline: 116\n• Trusted friend or family member\n• Nearest hospital\n• Legal aid organization'
      },
      {
        title: 'Safe Places to Go',
        content: 'Identify safe places you can go in an emergency:\n\n• Friend or family member\'s house\n• Women\'s shelter\n• Church or community center\n• Police station\n• Hospital\n• Public place with security'
      },
      {
        title: 'Important Documents',
        content: 'Keep copies of these documents in a safe place:\n\n• National ID\n• Passport\n• Birth certificates (yours and children\'s)\n• Marriage certificate\n• Medical records\n• Bank account information\n• Insurance documents\n• School records for children'
      },
      {
        title: 'Emergency Bag',
        content: 'Pack a bag with essentials and keep it hidden:\n\n• Change of clothes for you and children\n• Medications\n• Keys (house, car)\n• Phone charger\n• Cash\n• Toiletries\n• Comfort items for children'
      }
    ],
    checklist: [
      'Program emergency numbers into phone',
      'Identify safe places to go',
      'Make copies of important documents',
      'Pack emergency bag',
      'Plan escape routes',
      'Inform trusted person of your plan',
      'Practice your safety plan'
    ]
  },

  'gbv-awareness-content': {
    title: 'Understanding Gender-Based Violence',
    content: 'Gender-based violence (GBV) is violence directed against a person because of their gender. It includes physical, sexual, emotional, economic, and psychological abuse.',
    sections: [
      {
        title: 'Types of GBV',
        content: 'Physical Violence:\n• Hitting, slapping, punching\n• Throwing objects\n• Using weapons\n• Restraining or confining\n\nSexual Violence:\n• Forced sexual acts\n• Sexual harassment\n• Rape or attempted rape\n\nEmotional/Psychological Abuse:\n• Threats and intimidation\n• Isolation from friends/family\n• Constant criticism\n• Controlling behavior\n\nEconomic Abuse:\n• Preventing access to money\n• Sabotaging employment\n• Stealing or destroying property\n• Controlling financial resources'
      },
      {
        title: 'Warning Signs',
        content: 'Early warning signs to watch for:\n\n• Extreme jealousy or possessiveness\n• Controlling behavior\n• Explosive temper\n• Threatens violence\n• Forces sexual acts\n• Isolates you from others\n• Monitors your activities\n• Blames you for their behavior\n• Humiliates you publicly\n• Destroys your belongings'
      },
      {
        title: 'Cycle of Violence',
        content: 'Violence often follows a pattern:\n\n1. Tension Building:\n• Minor incidents\n• Victim tries to calm abuser\n• Walking on eggshells\n\n2. Acute Violence:\n• Major violent incident\n• Physical, sexual, or emotional abuse\n\n3. Honeymoon Period:\n• Apologies and promises\n• Gifts and affection\n• Promises to change\n\n4. Calm Period:\n• Period of peace\n• Victim may think abuse is over\n\nThen the cycle repeats, often getting worse over time.'
      }
    ]
  },

  'p3-form': {
    title: 'P3 Form (Kenya Police Medical Examination Report)',
    content: 'The P3 Form is the official medical examination report required by the Kenya Police for documenting injuries in criminal cases. This form is essential for legal proceedings and is free of charge.',
    localAssetPath: 'assets/documents/forms/p3-form/',
    fileName: 'Kenya_Police_P3_Form_2024.pdf',
    isLocalFile: true,
    sections: [
      {
        title: 'Form Overview',
        content: 'Official Name: Kenya Police Medical Examination Report Form P3\nUpdated Version: 15-page comprehensive form (2024/2025)\nPrevious Version: 4-page form (pre-2021)\nIssued By: National Police Service of Kenya\nCost: Free of charge'
      },
      {
        title: 'When to Use P3 Form',
        content: '• Physical assault cases\n• Road accident injuries\n• Sexual assault documentation\n• Domestic violence incidents\n• Any criminal case involving bodily harm\n• Court evidence collection\n• Insurance compensation claims\n• Child abuse cases'
      },
      {
        title: 'Form Structure and Sections',
        content: 'Part 1: Police Officer Information\n• Officer requesting examination details\n• Case reference numbers\n• Date and time of request\n\nPart 2: Patient Information\n• Personal details (name, age, address)\n• ID numbers and contact information\n• Next of kin details\n\nPart 3: Incident Details\n• Date, time, and location of incident\n• Circumstances surrounding the assault\n• Relationship to perpetrator\n\nPart 4: Medical Examination\n• General physical examination\n• Injury documentation and mapping\n• Photographs and evidence collection\n• Medical assessment and treatment'
      },
      {
        title: 'Medical Examination Components',
        content: 'General Physical Examination:\n• Overall appearance and demeanor\n• Signs of drug or alcohol use\n• Mental state assessment\n\nInjury Documentation:\n• Detailed description of all injuries\n• Location mapping on body diagrams\n• Approximate age of injuries (hours/days/weeks)\n• Probable weapon type causing injuries\n• Assessment of injury severity\n\nClinical Assessment:\n• Immediate medical findings\n• Degree of harm classification\n• Treatment provided or recommended\n• Prognosis and recovery timeline'
      },
      {
        title: 'Where to Obtain P3 Form',
        content: 'Government Facilities (Free):\n• Any government hospital\n• District hospitals\n• County referral hospitals\n• Health centers with medical officers\n• Police stations (will direct you)\n\nPrivate Facilities:\n• Private hospitals (may charge fees)\n• Private clinics with licensed practitioners\n\nRequirements:\n• Must be completed by licensed medical practitioner\n• Doctor, clinical officer, or qualified nurse\n• All pages must be signed and stamped'
      },
      {
        title: 'Legal Requirements and Process',
        content: 'Documentation Requirements:\n• Three copies must be completed\n• Can be filled electronically or manually\n• Must be in CLEAR and LEGIBLE handwriting\n• Every page requires signatures from both officer and medical practitioner\n\nEvidence Chain:\n• Original copy goes to investigating officer\n• One copy retained by medical facility\n• One copy for court proceedings\n• Patient receives copy for records\n\nLegal Validity:\n• Admissible as evidence in court\n• Required for assault and battery cases\n• Essential for compensation claims\n• Mandatory for criminal prosecution'
      },
      {
        title: 'Important Guidelines',
        content: 'Before Examination:\n• Seek medical attention immediately\n• Do not delay medical care\n• Inform medical staff about police case\n• Bring police request letter if available\n\nDuring Examination:\n• Be honest about all injuries\n• Report any pain or discomfort\n• Ask questions if unclear\n• Request female medical officer if preferred\n\nAfter Examination:\n• Keep your copy safely\n• Follow medical treatment advice\n• Report to police as directed\n• Follow up with medical care as needed'
      }
    ]
  },

  'prc-form': {
    title: 'Post Rape Care (PRC) Form - MOH 363',
    content: 'The PRC Form (MOH 363) is the official Ministry of Health form for documenting medical examination and care provided to survivors of rape and sexual violence in Kenya.',
    localAssetPath: 'assets/documents/forms/prc-form/',
    fileName: 'Kenya_MOH_PRC_Form_363.pdf',
    isLocalFile: true,
    sections: [
      {
        title: 'Form Overview',
        content: 'Official Name: Ministry of Health Post Rape Care Form (MOH 363)\nPurpose: Clinical documentation for rape/sexual violence survivors\nUse: Guide for P3 form completion and clinical notes\nRevised: 2011 National Guidelines on Management of Sexual Violence\nFilled By: Doctor, Clinical Officer, or Nurse'
      },
      {
        title: 'Purpose and Legal Framework',
        content: 'Primary Purpose:\n• Document medical examination of rape survivors\n• Record laboratory analysis results\n• Guide healthcare provider management decisions\n• Serve as clinical notes for treatment\n\nLegal Requirements:\n• Must be completed for each survivor\n• Attached to P3 form for police cases\n• Completed BEFORE P3 form\n• Stored at medical facilities\n• Part of evidence chain for prosecution'
      },
      {
        title: 'Who Can Complete the Form',
        content: 'Authorized Healthcare Providers:\n• Medical doctors (any specialization)\n• Clinical officers (qualified)\n• Registered nurses (trained in sexual assault examination)\n\nTraining Requirements:\n• Specialized training in sexual violence examination\n• Knowledge of evidence collection procedures\n• Understanding of trauma-informed care\n• Familiarity with legal documentation requirements\n\nNote: Previously only doctors could complete this form, but 2011 guidelines expanded to include clinical officers and nurses.'
      },
      {
        title: 'Form Sections and Content',
        content: 'Administrative Section:\n• County, Sub-county, Landmark details\n• Health facility information\n• Date and time of examination\n• Healthcare provider details\n\nChief Complaints:\n• Survivor\'s primary concerns\n• Presenting symptoms\n• Reason for seeking care\n\nIncident Circumstances:\n• Details of the assault\n• Location and timing\n• Number of perpetrators\n• Type of sexual violence\n• Use of force or weapons'
      },
      {
        title: 'Medical Examination Components',
        content: 'General Physical Examination:\n• Overall health assessment\n• Vital signs and general appearance\n• Mental state and trauma signs\n• Documentation of any visible injuries\n\nSpecialized Examination:\n• Genital examination (external and internal)\n• Anal examination if indicated\n• Documentation of tears, bruising, swelling\n• Collection of forensic evidence\n• STI screening and testing\n\nBody Mapping:\n• Detailed injury mapping on body diagrams\n• Location of all injuries, marks, bruises\n• Photographic documentation if consented\n• Evidence of struggle or defense wounds'
      },
      {
        title: 'Laboratory and Evidence Collection',
        content: 'Laboratory Tests:\n• STI screening (HIV, syphilis, gonorrhea, chlamydia)\n• Pregnancy test\n• Forensic specimen collection\n• DNA evidence collection\n• Drug/alcohol testing if indicated\n\nEvidence Collection:\n• Clothing collection and labeling\n• Swab collection from various sites\n• Fingernail scrapings\n• Hair samples if indicated\n• Photography of injuries\n• Chain of custody documentation'
      },
      {
        title: 'Treatment and Prophylaxis',
        content: 'Immediate Treatment:\n• Emergency contraception (within 120 hours)\n• HIV post-exposure prophylaxis (PEP) within 72 hours\n• STI prophylactic treatment\n• Wound care and tetanus prophylaxis\n• Pain management\n• Psychological first aid\n\nFollow-up Care:\n• HIV testing schedule (baseline, 6 weeks, 3 months, 6 months)\n• STI follow-up testing\n• Pregnancy monitoring\n• Mental health referrals\n• Social support services\n• Legal support referrals'
      },
      {
        title: 'Documentation Requirements',
        content: 'Completion Standards:\n• All sections must be filled completely\n• Use clear, legible handwriting\n• Medical terminology should be explained\n• All findings must be objective\n• Time and date all entries\n• Sign and stamp all pages\n\nConfidentiality:\n• Maintain strict patient confidentiality\n• Secure storage of forms\n• Limited access to authorized personnel\n• Follow data protection guidelines\n• Obtain consent before sharing information'
      },
      {
        title: 'Integration with P3 Form',
        content: 'Relationship to P3 Form:\n• PRC form completed FIRST\n• Provides detailed clinical information for P3\n• PRC attached to P3 for police submission\n• PRC remains at health facility\n• P3 goes to police and court\n\nInformation Transfer:\n• Key findings summarized in P3\n• Medical recommendations included\n• Injury descriptions transferred\n• Treatment provided documented\n• Follow-up needs identified'
      }
    ]
  },

  'healing-journey-workbook': {
    title: 'Healing Journey Workbook',
    content: 'Healing from trauma is a personal journey. These exercises can help you process your experiences and build resilience.',
    sections: [
      {
        title: 'Understanding Your Feelings',
        content: 'It\'s normal to experience:\n\n• Anger, fear, sadness\n• Confusion and numbness\n• Guilt or shame (not your fault)\n• Difficulty sleeping or eating\n• Feeling overwhelmed\n• Loss of trust\n\nRemember: These feelings are normal reactions to abnormal situations.'
      },
      {
        title: 'Grounding Techniques',
        content: 'When feeling overwhelmed, try:\n\n5-4-3-2-1 Technique:\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\nDeep Breathing:\n• Breathe in for 4 counts\n• Hold for 4 counts\n• Breathe out for 6 counts\n• Repeat 5-10 times'
      },
      {
        title: 'Building Self-Compassion',
        content: 'Practice positive self-talk:\n\n• "I am brave for seeking help"\n• "I deserve to be treated with respect"\n• "My feelings are valid"\n• "I am not responsible for others\' actions"\n• "I am stronger than I know"\n• "I have the right to feel safe"\n• "My healing is important"'
      },
      {
        title: 'Daily Affirmations',
        content: 'Start each day with:\n\n• "Today I choose to care for myself"\n• "I am worthy of love and respect"\n• "I have the strength to face today"\n• "I am building a better future"\n• "I trust my instincts"\n• "I am not alone in this journey"'
      }
    ]
  },

  'support-network-guide': {
    title: 'Building Your Support Network',
    content: 'A strong support network is crucial for safety and healing. Learn how to identify and connect with people who can help.',
    sections: [
      {
        title: 'Identifying Trusted People',
        content: 'Look for people who:\n\n• Listen without judgment\n• Respect your decisions\n• Keep information confidential\n• Offer practical help\n• Make you feel safe\n• Support your independence\n\nMay include:\n• Family members\n• Close friends\n• Religious leaders\n• Counselors\n• Support group members\n• Colleagues'
      },
      {
        title: 'What Support Looks Like',
        content: 'Emotional Support:\n• Listening and believing you\n• Offering encouragement\n• Being available when needed\n\nPractical Support:\n• Help with childcare\n• Transportation\n• Temporary housing\n• Financial assistance\n• Accompanying you to appointments\n\nInformational Support:\n• Sharing resources\n• Providing advice\n• Connecting you with services'
      },
      {
        title: 'How to Ask for Help',
        content: 'Starting the conversation:\n\n• "I need to talk to someone I trust"\n• "I\'m going through a difficult time"\n• "I could use some support right now"\n• "Would you be willing to help me?"\n\nBe specific about what you need:\n• "Can you help me find a counselor?"\n• "Could I stay at your place tonight?"\n• "Would you come with me to the police station?"\n• "Can you keep my important documents safe?"'
      }
    ]
  },

  'police-reporting-guide': {
    title: 'Reporting to Police',
    content: 'Reporting GBV to police can be intimidating. This guide explains what to expect and how to prepare.',
    sections: [
      {
        title: 'Before You Go',
        content: 'Prepare:\n• Write down what happened (dates, times, details)\n• Gather any evidence (photos, messages, witnesses)\n• Bring a trusted friend for support\n• Know you have the right to request a female officer\n• Bring your ID\n• If injured, get P3 form from hospital first'
      },
      {
        title: 'At the Police Station',
        content: 'What will happen:\n• You\'ll be asked to make a statement\n• Officer will record details in Occurrence Book (OB)\n• You\'ll receive an OB number\n• If there are injuries, you\'ll be referred for P3 form\n• Case may be assigned for investigation\n\nYour rights:\n• Right to be treated with respect\n• Right to privacy during interview\n• Right to have support person present\n• Right to female officer if preferred\n• Right to interpreter if needed'
      },
      {
        title: 'What Information to Provide',
        content: '• Date, time, and location of incident\n• Detailed description of what happened\n• Names of any witnesses\n• Previous incidents (if any)\n• Relationship to the perpetrator\n• Any threats made\n• Evidence you have\n• Impact on you and your children'
      },
      {
        title: 'Follow-up',
        content: '• Keep your OB number safe\n• Ask for updates on your case\n• You can call to check progress\n• Inform police of any new incidents\n• Let them know if you move or change contact\n• Consider getting legal representation'
      }
    ],
    emergencyNumbers: [
      { name: 'Police Emergency', number: '999' },
      { name: 'GBV Helpline', number: '1195' },
      { name: 'Childline', number: '116' }
    ]
  },

  'emergency-contacts': {
    title: 'Emergency Helplines',
    content: '24/7 confidential support numbers for immediate assistance. Save these numbers in your phone for quick access during emergencies.',
    sections: [
      {
        title: 'National Emergency Numbers',
        content: 'Police Emergency: 999\nAmbulance/Medical: 999\nFire Department: 999\n\nThese are free calls from any network in Kenya.'
      },
      {
        title: 'GBV Support Helplines',
        content: 'GBV Helpline: 1195\n• Free, confidential 24/7 support\n• Available in multiple languages\n• Connects to trained counselors\n• Can provide referrals to local services\n\nChildline Kenya: 116\n• Free support for children and adolescents\n• 24/7 counseling and referrals\n• Anonymous and confidential'
      },
      {
        title: 'How to Use Emergency Numbers',
        content: 'When calling emergency services:\n• Stay calm and speak clearly\n• Give your exact location\n• Describe the emergency briefly\n• Follow dispatcher instructions\n• Don\'t hang up until told to do so\n• Keep your phone charged and accessible'
      }
    ],
    emergencyNumbers: [
      { name: 'Police Emergency', number: '999' },
      { name: 'GBV Helpline', number: '1195' },
      { name: 'Childline Kenya', number: '116' }
    ]
  },

  'occurrence-book-form': {
    title: 'OB Form Template',
    content: 'The Occurrence Book (OB) form is used to report incidents at police stations. This guide helps you prepare the information needed.',
    localAssetPath: 'assets/documents/forms/ob-form/',
    fileName: 'OB_Form_Template.pdf',
    isLocalFile: true,
    sections: [
      {
        title: 'What is an OB Number',
        content: 'An Occurrence Book (OB) number is a unique reference number assigned when you report an incident to police.\n\n• It tracks your case in the police system\n• Required for follow-up and court proceedings\n• Helps police organize and prioritize cases\n• Keep this number safe for future reference'
      },
      {
        title: 'Information to Prepare',
        content: 'Personal Details:\n• Your full names and ID number\n• Contact information (phone, address)\n• Occupation and next of kin\n\nIncident Details:\n• Date, time, and exact location\n• Detailed description of what happened\n• Names and contacts of witnesses\n• Description of perpetrator(s)\n• Any evidence you have (photos, messages, etc.)'
      },
      {
        title: 'Reporting Process',
        content: 'At the Police Station:\n1. Go to the report desk or inquiry office\n2. Request to make a statement\n3. Provide all relevant information\n4. Officer will record in the Occurrence Book\n5. You will receive an OB number\n6. Keep this number for all future reference\n\nYour Rights:\n• Right to be treated with respect\n• Right to request female officer\n• Right to have support person present\n• Right to receive copy of your statement'
      },
      {
        title: 'After Reporting',
        content: 'Follow-up Steps:\n• Keep your OB number safe\n• Ask for investigating officer\'s contact\n• Inquire about case progress regularly\n• Report any new incidents or threats\n• Provide additional evidence if available\n• Attend court when required'
      }
    ]
  },

  'protection-order-application': {
    title: 'Protection Order Application',
    content: 'A protection order is a legal document that prohibits someone from contacting, approaching, or harming you. Learn how to apply.',
    localAssetPath: 'assets/documents/forms/protection-order/',
    fileName: 'Protection_Order_Application.pdf',
    isLocalFile: true,
    sections: [
      {
        title: 'What is a Protection Order',
        content: 'A protection order is a court order that:\n• Prohibits the abuser from contacting you\n• Prevents them from coming near your home/work\n• May grant temporary custody of children\n• Can order them to leave shared residence\n• Violation is a criminal offense\n\nTypes Available:\n• Temporary Protection Order (immediate, short-term)\n• Interim Protection Order (pending full hearing)\n• Final Protection Order (after full court hearing)'
      },
      {
        title: 'Who Can Apply',
        content: 'You can apply if you are:\n• Spouse or former spouse\n• Person in intimate relationship\n• Family member related by blood/marriage\n• Person sharing or who shared residence\n• Person with children together\n\nMinors can apply through:\n• Parent or guardian\n• Social services\n• Any adult on their behalf'
      },
      {
        title: 'Required Documents',
        content: 'Documents Needed:\n• National ID or passport\n• Affidavit describing the abuse\n• Medical reports (if injured)\n• Police reports (OB numbers)\n• Witness statements\n• Photos of injuries or property damage\n• Children\'s birth certificates (if applicable)\n\nNote: You don\'t need a lawyer, but legal assistance is recommended.'
      },
      {
        title: 'Application Process',
        content: 'Steps to Apply:\n1. Go to the nearest Magistrate\'s Court\n2. Complete application forms\n3. File sworn affidavit with details\n4. Submit supporting documents\n5. Court may grant temporary order immediately\n6. Full hearing scheduled within days\n7. Serve order to respondent\n8. Attend hearing for final order\n\nCourt Fees:\n• Application fee required (varies by court)\n• Fee waiver available for indigent applicants\n• Legal aid may be available'
      },
      {
        title: 'What Protection Orders Can Include',
        content: 'The court can order the abuser to:\n• Stop all forms of abuse\n• Not contact you directly or indirectly\n• Stay away from your home, work, school\n• Not come within specified distance\n• Leave shared residence\n• Attend counseling programs\n• Pay compensation for damages\n• Surrender weapons\n\nViolation Consequences:\n• Criminal charges can be filed\n• Arrest warrant may be issued\n• Fine or imprisonment\n• Contempt of court charges'
      }
    ]
  },

  'trauma-recovery': {
    title: 'Healing Journey Workbook',
    content: 'Healing from trauma is a personal journey. These exercises can help you process your experiences and build resilience.',
    sections: [
      {
        title: 'Understanding Your Feelings',
        content: 'It\'s normal to experience:\n\n• Anger, fear, sadness\n• Confusion and numbness\n• Guilt or shame (not your fault)\n• Difficulty sleeping or eating\n• Feeling overwhelmed\n• Loss of trust\n\nRemember: These feelings are normal reactions to abnormal situations.'
      },
      {
        title: 'Grounding Techniques',
        content: 'When feeling overwhelmed, try:\n\n5-4-3-2-1 Technique:\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\nDeep Breathing:\n• Breathe in for 4 counts\n• Hold for 4 counts\n• Breathe out for 6 counts\n• Repeat 5-10 times'
      },
      {
        title: 'Building Self-Compassion',
        content: 'Practice positive self-talk:\n\n• "I am brave for seeking help"\n• "I deserve to be treated with respect"\n• "My feelings are valid"\n• "I am not responsible for others\' actions"\n• "I am stronger than I know"\n• "I have the right to feel safe"\n• "My healing is important"'
      }
    ]
  },

  'mindfulness-guide': {
    title: 'Mindfulness and Breathing Exercises',
    content: 'Simple mindfulness practices and breathing techniques you can do anywhere, anytime to manage stress and anxiety.',
    sections: [
      {
        title: 'Basic Breathing Exercises',
        content: 'Box Breathing (4-4-4-4):\n• Inhale for 4 counts\n• Hold for 4 counts\n• Exhale for 4 counts\n• Hold empty for 4 counts\n• Repeat 5-10 times\n\nCalming Breath (4-7-8):\n• Inhale through nose for 4 counts\n• Hold breath for 7 counts\n• Exhale through mouth for 8 counts\n• Repeat 3-4 times'
      },
      {
        title: 'Body Scan Meditation',
        content: 'Progressive Relaxation:\n1. Lie down or sit comfortably\n2. Close your eyes\n3. Start with your toes\n4. Notice any tension or sensation\n5. Consciously relax each body part\n6. Move slowly up your body\n7. End with your head and face\n8. Take 10-20 minutes'
      },
      {
        title: 'Mindful Moments',
        content: 'Daily Mindfulness Practices:\n\nMindful Eating:\n• Eat slowly and deliberately\n• Notice colors, textures, flavors\n• Chew thoroughly\n• Put utensils down between bites\n\nMindful Walking:\n• Walk slower than usual\n• Feel your feet touching ground\n• Notice your surroundings\n• Coordinate with breathing'
      }
    ]
  },

  'self-care-checklist': {
    title: 'Daily Self-Care Checklist',
    content: 'Practical daily self-care activities for physical, emotional, and mental wellbeing. Healing requires consistent care for yourself.',
    sections: [
      {
        title: 'Physical Self-Care',
        content: 'Daily Basics:\n□ Get adequate sleep (7-9 hours)\n□ Eat nutritious meals regularly\n□ Drink plenty of water\n□ Take medications as prescribed\n□ Engage in gentle exercise\n□ Maintain personal hygiene\n□ Get fresh air and sunlight\n\nWeekly:\n□ Medical check-ups as needed\n□ Relaxing bath or shower\n□ Massage or gentle stretching'
      },
      {
        title: 'Emotional Self-Care',
        content: 'Daily Practices:\n□ Acknowledge your feelings\n□ Practice self-compassion\n□ Set healthy boundaries\n□ Express emotions safely\n□ Practice gratitude\n□ Connect with supportive people\n□ Limit negative news/media\n\nWeekly:\n□ Journal or write feelings\n□ Engage in creative activities\n□ Practice mindfulness or meditation'
      },
      {
        title: 'Mental Self-Care',
        content: 'Daily Habits:\n□ Practice positive self-talk\n□ Challenge negative thoughts\n□ Learn something new\n□ Read or listen to uplifting content\n□ Organize your space\n□ Plan your day\n□ Celebrate small wins\n\nWeekly:\n□ Reflect on progress made\n□ Set achievable goals\n□ Practice problem-solving skills'
      },
      {
        title: 'Social Self-Care',
        content: 'Connection Activities:\n□ Talk to trusted friend/family\n□ Join support groups\n□ Participate in community activities\n□ Help others when possible\n□ Maintain healthy relationships\n□ Set boundaries with difficult people\n□ Seek professional help when needed'
      }
    ],
    checklist: [
      'Eat three nutritious meals',
      'Drink 8 glasses of water',
      'Get 7-9 hours of sleep',
      'Take time for relaxation',
      'Connect with someone supportive',
      'Practice gratitude',
      'Do something enjoyable',
      'Take prescribed medications',
      'Practice breathing exercises',
      'Acknowledge your feelings'
    ]
  },

  'communication-guide': {
    title: 'Talking to Family and Friends',
    content: 'Scripts and tips for discussing your situation with trusted family members and friends. Building support requires honest communication.',
    sections: [
      {
        title: 'Choosing Who to Tell',
        content: 'Consider telling people who:\n• You trust completely\n• Have shown support before\n• Can keep information confidential\n• Won\'t blame or judge you\n• Can offer practical help\n• Make you feel safe\n\nStart with one trusted person:\n• Close friend or family member\n• Religious leader\n• Counselor or therapist\n• Supportive colleague'
      },
      {
        title: 'How to Start the Conversation',
        content: 'Opening Phrases:\n• "I need to talk to someone I trust about something important"\n• "I\'m going through a difficult time and could use support"\n• "I have something serious to share with you"\n• "I trust you and need your help with something"\n\nChoose the Right Time:\n• When you have privacy\n• When they have time to listen\n• When you feel emotionally ready\n• In a safe, comfortable environment'
      },
      {
        title: 'What to Say',
        content: 'Be as specific as you\'re comfortable:\n• "My partner has been hurting me"\n• "I\'m in an abusive relationship"\n• "Someone close to me is threatening me"\n• "I\'ve been sexually assaulted"\n\nExplain what you need:\n• "I just need someone to listen"\n• "I need help making a safety plan"\n• "Can you help me find resources?"\n• "Would you come with me to report this?"\n• "Can I stay with you if needed?"'
      },
      {
        title: 'Dealing with Different Reactions',
        content: 'If they\'re supportive:\n• Thank them for listening\n• Be specific about help needed\n• Set boundaries about what to share\n• Let them know how to best support you\n\nIf they react poorly:\n• Remember it\'s not your fault\n• Their reaction reflects their limitations\n• You can end the conversation\n• Seek support from someone else\n• Consider professional counseling'
      },
      {
        title: 'Maintaining Your Safety',
        content: 'Safety Considerations:\n• Don\'t tell people who might inform the abuser\n• Be careful about social media posts\n• Consider who has access to your communications\n• Have a code word for emergencies\n• Plan what to do if support person is unavailable\n\nBoundary Setting:\n• You control what information to share\n• You decide the pace of disclosure\n• You choose what help to accept\n• You have right to change your mind'
      }
    ]
  },

  'emergency-contacts-list': {
    title: 'Emergency Contact Numbers',
    content: 'Complete list of emergency numbers for immediate assistance. Save these in your phone and keep written copies in safe places.',
    emergencyNumbers: [
      { name: 'Police Emergency', number: '999' },
      { name: 'GBV Helpline', number: '1195' },
      { name: 'Childline Kenya', number: '116' },
      { name: 'Kenya Red Cross', number: '1199' },
      { name: 'AA Emergency', number: '999' }
    ],
    sections: [
      {
        title: 'When to Call Emergency Numbers',
        content: 'Call 999 immediately if:\n• You are in immediate physical danger\n• Someone is threatening to hurt you\n• You have been seriously injured\n• Someone has broken into your home\n• You witness a violent crime\n• You need police, ambulance, or fire services'
      },
      {
        title: 'GBV Support Services',
        content: 'GBV Helpline (1195):\n• 24/7 free confidential support\n• Trained counselors available\n• Referrals to local services\n• Crisis intervention\n• Available in multiple languages\n• Anonymous if preferred\n\nChildline Kenya (116):\n• Support for children and adolescents\n• 24/7 counseling services\n• Child protection services\n• Educational support\n• Family mediation services'
      },
      {
        title: 'How to Use Emergency Services',
        content: 'When calling emergency numbers:\n• State your emergency clearly\n• Give your exact location\n• Provide your name and phone number\n• Follow dispatcher instructions\n• Stay on the line until told to hang up\n• Keep your phone charged\n• Know your location/address\n\nIf you can\'t speak:\n• Try to make noise\n• Use text/SMS if available\n• Have someone else call for you\n• Use emergency apps if available'
      }
    ]
  }
};

interface ResourceViewerProps {
  visible: boolean;
  resourceId: string;
  onClose: () => void;
}

export function ResourceViewer({ visible, resourceId, onClose }: ResourceViewerProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const resource = resourceContent[resourceId];

  if (!resource) return null;

  const handleDownload = async () => {
    if (resource.isLocalFile && resource.fileName && assetMappings[resource.fileName]) {
      Alert.alert(
        'Download Form',
        `Would you like to download ${resource.fileName} to your device?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                // Load the asset
                const asset = Asset.fromModule(assetMappings[resource.fileName!]);
                await asset.downloadAsync();

                if (asset.localUri) {
                  // Use the asset URI directly for sharing
                  const fileUri = asset.localUri;

                  // Share the file
                  if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri, {
                      mimeType: 'application/pdf',
                      dialogTitle: `Download ${resource.title}`,
                    });
                  } else {
                    Alert.alert(
                      'File Saved',
                      `${resource.fileName} has been saved to your device's Documents folder.`,
                      [{ text: 'OK' }]
                    );
                  }
                } else {
                  throw new Error('Asset not available');
                }
              } catch (error) {
                console.error('Download error:', error);
                Alert.alert(
                  'Download Error',
                  'Unable to download the form. Please try again later.',
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } else if (resource.isLocalFile && resource.fileName) {
      Alert.alert(
        'Form Information',
        `${resource.title} information and instructions are available in this resource viewer. The PDF file should be available in the app assets.`,
        [{ text: 'OK' }]
      );
    } else if (resource.downloadUrl) {
      Alert.alert(
        'Download Form',
        `Would you like to download ${resource.fileName || resource.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                await Linking.openURL(resource.downloadUrl!);
                Alert.alert(
                  'Download Started',
                  'The form is being downloaded. Check your browser downloads or device downloads folder.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert(
                  'Download Error',
                  'Unable to download the form. Please check your internet connection and try again.',
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Information Available',
        'This resource information is available for offline viewing within the app. For actual PDF forms, please check the legal documents section.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${resource.title}\n\n${resource.content}`,
        title: resource.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share this resource.');
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    Alert.alert(
      bookmarked ? 'Removed from Bookmarks' : 'Bookmarked',
      bookmarked ? 'Resource removed from your bookmarks.' : 'Resource saved to your bookmarks for quick access.'
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#341A52" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{resource.title}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
              <Bookmark color={bookmarked ? "#E24B95" : "#49455A"} size={20} fill={bookmarked ? "#E24B95" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share2 color="#49455A" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
              <Download color="#6A2CB0" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>{resource.content}</Text>

          {/* Sections */}
          {resource.sections?.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          {/* Checklist */}
          {resource.checklist && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Safety Plan Checklist</Text>
              {resource.checklist.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <CheckSquare color="#43A047" size={16} />
                  <Text style={styles.checklistText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Emergency Numbers */}
          {resource.emergencyNumbers && (
            <View style={styles.emergencySection}>
              <View style={styles.emergencyHeader}>
                <Phone color="#E53935" size={20} />
                <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
              </View>
              {resource.emergencyNumbers.map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.emergencyContact}
                  onPress={() => {
                    Alert.alert(
                      'Call ' + contact.name,
                      `Would you like to call ${contact.number}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Call', onPress: () => {} }, // In real app, would call Linking.openURL
                      ]
                    );
                  }}
                >
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Safety Reminder */}
          <View style={styles.safetyReminder}>
            <View style={styles.safetyHeader}>
              <Shield color="#26A69A" size={20} />
              <Text style={styles.safetyTitle}>Safety Reminder</Text>
            </View>
            <Text style={styles.safetyText}>
              Your safety is the most important thing. Trust your instincts. If you feel unsafe at any time, remove this content from your device and seek immediate help.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CEE8',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#49455A',
    lineHeight: 24,
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    color: '#49455A',
    lineHeight: 22,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
  emergencySection: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  emergencyContact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  safetyReminder: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#26A69A',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#26A69A',
  },
  safetyText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
});