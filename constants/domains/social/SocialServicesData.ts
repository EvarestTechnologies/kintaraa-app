// Mock data for Social Services Dashboard
import {
  SocialServicesStats,
  SocialClient,
  SocialService,
  CommunityResource,
  CommunityProgram,
  ServiceAssessment
} from '@/dashboards/social';

export const mockSocialServicesStats: SocialServicesStats = {
  totalClients: 247,
  activeServices: 89,
  completedReferrals: 156,
  pendingAssessments: 23,
  communityPrograms: 12,
  resourcesProvided: 342,
  averageServiceTime: 18,
  clientSatisfactionRate: 94,
};

export const mockSocialClients: SocialClient[] = [
  {
    id: 'client-1',
    name: 'Maria Rodriguez',
    age: 34,
    gender: 'Female',
    familySize: 4,
    primaryNeeds: ['Housing', 'Childcare', 'Job Training'],
    status: 'active',
    riskLevel: 'high',
    lastContact: '2024-12-14',
    nextAppointment: '2024-12-18',
    phone: '(555) 123-4567',
    email: 'maria.r@email.com',
    address: '123 Oak Street, Apt 2B, Springfield, IL 62701',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '(555) 987-6543',
      relationship: 'Spouse',
    },
    caseId: 'SS-2024-001',
    assignedWorker: 'Sarah Johnson',
    notes: 'Recently escaped domestic violence situation. Needs immediate housing assistance.',
    vulnerabilities: ['Domestic Violence Survivor', 'Limited English', 'No Transportation'],
    supportNetwork: ['Sister in Chicago', 'Church Community'],
  },
  {
    id: 'client-2',
    name: 'James Thompson',
    age: 28,
    gender: 'Male',
    familySize: 1,
    primaryNeeds: ['Employment', 'Mental Health', 'Transportation'],
    status: 'pending',
    riskLevel: 'medium',
    lastContact: '2024-12-12',
    phone: '(555) 234-5678',
    address: '456 Pine Avenue, Springfield, IL 62702',
    emergencyContact: {
      name: 'Linda Thompson',
      phone: '(555) 876-5432',
      relationship: 'Mother',
    },
    caseId: 'SS-2024-002',
    assignedWorker: 'Michael Chen',
    notes: 'Veteran seeking employment assistance and mental health support.',
    vulnerabilities: ['PTSD', 'Unemployment', 'Social Isolation'],
    supportNetwork: ['Veterans Group', 'Mother'],
  },
  {
    id: 'client-3',
    name: 'Angela Davis',
    age: 42,
    gender: 'Female',
    familySize: 3,
    primaryNeeds: ['Healthcare', 'Financial Aid', 'Education'],
    status: 'completed',
    riskLevel: 'low',
    lastContact: '2024-12-10',
    phone: '(555) 345-6789',
    email: 'angela.davis@email.com',
    address: '789 Maple Drive, Springfield, IL 62703',
    emergencyContact: {
      name: 'Robert Davis',
      phone: '(555) 765-4321',
      relationship: 'Brother',
    },
    caseId: 'SS-2024-003',
    assignedWorker: 'Lisa Martinez',
    notes: 'Successfully completed job training program and found stable employment.',
    vulnerabilities: ['Single Parent', 'Chronic Health Condition'],
    supportNetwork: ['Extended Family', 'Neighborhood Association'],
  },
];

export const mockSocialServices: SocialService[] = [
  {
    id: 'service-1',
    clientId: 'client-1',
    clientName: 'Maria Rodriguez',
    serviceType: 'housing',
    status: 'approved',
    priority: 'urgent',
    requestDate: '2024-12-10',
    approvalDate: '2024-12-11',
    description: 'Emergency housing assistance for domestic violence survivor with 3 children',
    eligibilityCriteria: ['Domestic Violence Survivor', 'Income Below 50% AMI', 'Children Present'],
    documentsRequired: ['ID', 'Proof of Income', 'Police Report', 'Children Birth Certificates'],
    documentsSubmitted: ['ID', 'Proof of Income', 'Police Report'],
    provider: 'Safe Haven Housing Authority',
    cost: 2400,
    fundingSource: 'Emergency Housing Fund',
    notes: 'Temporary housing approved for 90 days while permanent solution is found.',
    caseId: 'SS-2024-001',
  },
  {
    id: 'service-2',
    clientId: 'client-2',
    clientName: 'James Thompson',
    serviceType: 'job_training',
    status: 'in_progress',
    priority: 'medium',
    requestDate: '2024-12-08',
    approvalDate: '2024-12-09',
    description: 'IT certification training program for veterans',
    eligibilityCriteria: ['Veteran Status', 'Unemployed', 'High School Diploma'],
    documentsRequired: ['DD-214', 'ID', 'High School Diploma'],
    documentsSubmitted: ['DD-214', 'ID', 'High School Diploma'],
    provider: 'Veterans Career Center',
    cost: 3500,
    fundingSource: 'Workforce Development Grant',
    notes: 'Started CompTIA A+ certification course. Expected completion in 8 weeks.',
    caseId: 'SS-2024-002',
  },
  {
    id: 'service-3',
    clientId: 'client-3',
    clientName: 'Angela Davis',
    serviceType: 'healthcare_referral',
    status: 'completed',
    priority: 'high',
    requestDate: '2024-11-15',
    approvalDate: '2024-11-16',
    completionDate: '2024-12-05',
    description: 'Specialist referral for chronic condition management',
    eligibilityCriteria: ['Medicaid Eligible', 'Chronic Health Condition'],
    documentsRequired: ['Medicaid Card', 'Medical Records', 'Referral Form'],
    documentsSubmitted: ['Medicaid Card', 'Medical Records', 'Referral Form'],
    provider: 'Springfield Medical Center',
    notes: 'Successfully connected with endocrinologist. Treatment plan established.',
    caseId: 'SS-2024-003',
  },
];

export const mockCommunityResources: CommunityResource[] = [
  {
    id: 'resource-1',
    name: 'Springfield Food Bank',
    category: 'food',
    description: 'Provides emergency food assistance to families and individuals in need',
    address: '100 Community Drive, Springfield, IL 62701',
    phone: '(555) FOOD-HELP',
    email: 'info@springfieldfoodbank.org',
    website: 'https://springfieldfoodbank.org',
    hours: 'Mon-Fri 9AM-5PM, Sat 9AM-2PM',
    eligibility: ['Income Below 185% FPL', 'Springfield Resident', 'Valid ID Required'],
    services: ['Emergency Food Boxes', 'Fresh Produce', 'Baby Formula', 'Pet Food'],
    capacity: 500,
    currentAvailability: 125,
    waitingList: 0,
    lastUpdated: '2024-12-14',
    isActive: true,
    contactPerson: 'Jennifer Walsh',
    notes: 'Accepts walk-ins on weekdays, appointments preferred for weekends.',
  },
  {
    id: 'resource-2',
    name: 'Safe Harbor Shelter',
    category: 'housing',
    description: 'Emergency shelter and transitional housing for individuals and families',
    address: '250 Shelter Lane, Springfield, IL 62702',
    phone: '(555) SHELTER1',
    email: 'intake@safeharbor.org',
    website: 'https://safeharbor.org',
    hours: '24/7 Intake Available',
    eligibility: ['Homeless or At Risk', 'Background Check', 'Sobriety Agreement'],
    services: ['Emergency Shelter', 'Transitional Housing', 'Case Management', 'Job Placement'],
    capacity: 75,
    currentAvailability: 8,
    waitingList: 12,
    lastUpdated: '2024-12-14',
    isActive: true,
    contactPerson: 'Mark Stevens',
    notes: 'Priority given to families with children and domestic violence survivors.',
  },
  {
    id: 'resource-3',
    name: 'Bright Futures Childcare Center',
    category: 'childcare',
    description: 'Subsidized childcare for low-income working families',
    address: '75 Learning Way, Springfield, IL 62703',
    phone: '(555) KIDS-123',
    email: 'enrollment@brightfutures.org',
    hours: 'Mon-Fri 6AM-7PM',
    eligibility: ['Working Parent', 'Income Below 200% FPL', 'Age 6 weeks - 12 years'],
    services: ['Full-Day Care', 'After School Program', 'Summer Camp', 'Meals Included'],
    capacity: 120,
    currentAvailability: 15,
    waitingList: 25,
    lastUpdated: '2024-12-13',
    isActive: true,
    contactPerson: 'Dr. Patricia Moore',
    notes: 'Currently accepting applications for toddler and preschool programs.',
  },
];

export const mockCommunityPrograms: CommunityProgram[] = [
  {
    id: 'program-1',
    name: 'Financial Literacy Workshop Series',
    type: 'workshop',
    description: 'Six-week program covering budgeting, saving, credit repair, and homeownership',
    targetAudience: ['Low-Income Families', 'First-Time Homebuyers', 'Credit Repair Seekers'],
    startDate: '2024-12-16',
    endDate: '2025-01-27',
    schedule: 'Mondays 6:00-8:00 PM',
    location: 'Springfield Community Center, Room 201',
    capacity: 25,
    enrolled: 18,
    facilitator: 'Robert Kim, Certified Financial Planner',
    status: 'active',
    objectives: [
      'Create and maintain a household budget',
      'Understand credit scores and repair strategies',
      'Learn about homeownership process and requirements',
      'Develop emergency savings plan'
    ],
    materials: ['Workbook', 'Calculator', 'Budget Templates', 'Resource Directory'],
    feedback: {
      rating: 4.7,
      comments: ['Very helpful information', 'Great presenter', 'Practical tips I can use']
    }
  },
  {
    id: 'program-2',
    name: 'Domestic Violence Support Group',
    type: 'support_group',
    description: 'Weekly support group for survivors of domestic violence',
    targetAudience: ['DV Survivors', 'Women 18+', 'Confidential Setting'],
    startDate: '2024-11-01',
    schedule: 'Thursdays 7:00-8:30 PM',
    location: 'Confidential Location (Address Provided Upon Registration)',
    capacity: 12,
    enrolled: 8,
    facilitator: 'Dr. Maria Santos, LCSW',
    status: 'active',
    objectives: [
      'Provide safe space for sharing experiences',
      'Develop coping strategies and safety planning',
      'Build support network among survivors',
      'Access resources and referrals'
    ],
    materials: ['Safety Planning Workbook', 'Resource Cards', 'Journal'],
    feedback: {
      rating: 4.9,
      comments: ['Life-changing experience', 'Felt heard and supported', 'Amazing facilitator']
    }
  },
  {
    id: 'program-3',
    name: 'Youth Leadership Academy',
    type: 'training',
    description: 'Leadership development program for at-risk youth ages 14-18',
    targetAudience: ['At-Risk Youth', 'Ages 14-18', 'School Referrals Welcome'],
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    schedule: 'Saturdays 10:00 AM - 2:00 PM',
    location: 'Youth Center, 500 Hope Street',
    capacity: 20,
    enrolled: 12,
    facilitator: 'Marcus Johnson, Youth Development Specialist',
    status: 'planning',
    objectives: [
      'Develop leadership and communication skills',
      'Create community service projects',
      'Build college and career readiness',
      'Establish mentorship relationships'
    ],
    materials: ['Leadership Handbook', 'Project Planning Tools', 'College Prep Resources'],
  },
];

export const mockServiceAssessments: ServiceAssessment[] = [
  {
    id: 'assessment-1',
    clientId: 'client-1',
    clientName: 'Maria Rodriguez',
    assessmentType: 'initial',
    assessmentDate: '2024-12-10',
    assessor: 'Sarah Johnson, MSW',
    findings: {
      strengths: ['Strong family bonds', 'Motivated to change situation', 'Bilingual skills'],
      needs: ['Safe housing', 'Childcare', 'English language support', 'Legal assistance'],
      risks: ['Ongoing threats from abuser', 'Financial instability', 'Social isolation'],
      resources: ['Church community support', 'Sister in Chicago', 'Children eligible for school services']
    },
    recommendations: [
      'Immediate emergency housing placement',
      'Safety planning and legal advocacy',
      'Enrollment in ESL classes',
      'Childcare assistance for job searching',
      'Connection to domestic violence support services'
    ],
    servicePlan: {
      goals: [
        'Secure safe permanent housing within 90 days',
        'Obtain protective order within 2 weeks',
        'Enroll children in school within 1 week',
        'Begin job search within 30 days'
      ],
      interventions: [
        'Emergency housing placement',
        'Legal advocacy services',
        'Case management support',
        'Childcare vouchers',
        'Transportation assistance'
      ],
      timeline: '90-day intensive case management',
      reviewDate: '2025-01-10'
    },
    status: 'approved',
    caseId: 'SS-2024-001'
  },
  {
    id: 'assessment-2',
    clientId: 'client-2',
    clientName: 'James Thompson',
    assessmentType: 'follow_up',
    assessmentDate: '2024-12-12',
    assessor: 'Michael Chen, LCSW',
    findings: {
      strengths: ['Military experience and discipline', 'Technical aptitude', 'Committed to recovery'],
      needs: ['Mental health treatment', 'Job training', 'Social connections', 'Transportation'],
      risks: ['PTSD symptoms', 'Social isolation', 'Financial stress'],
      resources: ['VA benefits eligible', 'Veterans support group', 'Family support system']
    },
    recommendations: [
      'Continue mental health counseling',
      'Enroll in IT certification program',
      'Join veterans support group',
      'Apply for transportation assistance'
    ],
    servicePlan: {
      goals: [
        'Complete IT certification within 12 weeks',
        'Attend weekly therapy sessions',
        'Participate in veterans group',
        'Secure employment within 6 months'
      ],
      interventions: [
        'Job training program enrollment',
        'Mental health services',
        'Peer support group',
        'Transportation vouchers'
      ],
      timeline: '6-month support plan',
      reviewDate: '2025-03-12'
    },
    status: 'completed',
    caseId: 'SS-2024-002'
  }
];