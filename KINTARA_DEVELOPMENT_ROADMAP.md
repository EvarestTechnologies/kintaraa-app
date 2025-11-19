# Kintara Platform - Development Roadmap

**Last Updated:** November 19, 2025
**Document Type:** Product Requirements Document (PRD)
**Status:** In Development

---

## Executive Summary

The Kintara platform is a Gender-Based Violence (GBV) support system with **8 dashboards** serving different user roles. Currently, authentication is fully functional and incident reporting works for survivors. **The primary objective is to connect all dashboards to backend APIs and replace all mock data with real data.**

---

## Current State

### ✅ What's Working
- **Authentication System** - Registration, login, JWT tokens, biometric auth
- **Survivor Incident Reporting** - Full 5-step wizard connected to backend
- **Survivor View Reports** - List and view incidents from real API
- **User Profiles** - All user types can view/edit profiles

### ❌ What's NOT Working
- **Messaging System** - UI exists but no backend API
- **Provider Dashboards** - Using mock data, no real case assignments
- **File Uploads** - Voice recordings and evidence not stored
- **Real-time Updates** - WebSocket infrastructure ready but not connected
- **Notifications** - No push notification system
- **Cross-Dashboard Collaboration** - Providers can't coordinate on cases

---

## Tech Stack

**Frontend:**
- React Native 0.81.4 + Expo SDK 54
- TypeScript 5.9.2 (strict mode)
- Expo Router v6 (file-based routing)
- React Query v5 + Context API
- React Native StyleSheet

**Backend:**
- Django 4.2.24 + Django REST Framework 3.14.0
- PostgreSQL / SQLite (dev)
- Redis (caching)
- Celery (async tasks)
- Django Channels 4.0.0 (WebSocket)
- AWS S3 (file storage)
- JWT authentication

---

## Priority 1: Critical Features (Backend + Frontend)

These features are essential for the platform to function. Each task requires both backend and frontend work.

### 1.1 Provider Case Assignment System

**Business Value:** Providers need to receive and manage assigned cases from survivors.

**Backend Requirements:**
- Create `CaseAssignment` model with fields:
  - `incident` (ForeignKey to Incident)
  - `provider` (ForeignKey to User)
  - `assigned_at` (DateTimeField)
  - `accepted_at` (DateTimeField, nullable)
  - `status` (pending/accepted/rejected)
  - `notes` (TextField)

- Create auto-assignment algorithm:
  - Match provider type to required services
  - Consider provider availability/workload
  - Support manual assignment override

- API Endpoints:
  - `POST /api/incidents/{id}/assign/` - Assign provider to case
  - `GET /api/providers/assigned-cases/` - Get cases assigned to me
  - `PATCH /api/incidents/{id}/accept/` - Accept case assignment
  - `PATCH /api/incidents/{id}/reject/` - Reject case assignment
  - `GET /api/providers/available/` - List available providers by type

**Frontend Requirements:**
- Remove mock data from `/providers/ProviderContext.tsx` (Lines 113-476)
- Connect to assignment APIs
- Update all provider dashboard `DashboardOverview.tsx` to show real assigned cases
- Add "Accept" / "Reject" buttons for pending assignments
- Show assignment status on survivor incident view

**Affected Dashboards:** All 7 provider dashboards

**Database Migration:** Yes - new CaseAssignment model

**Testing Requirements:**
- Assign case to healthcare provider
- Provider accepts/rejects case
- Survivor sees assigned provider info
- Multiple providers can be assigned to one case

---

### 1.2 Real-Time Messaging System

**Business Value:** Survivors need to communicate with assigned providers securely.

**Backend Requirements:**
- Create models:
  - `ChatRoom` (one per incident, links survivor to providers)
  - `Message` with fields:
    - `room` (ForeignKey to ChatRoom)
    - `sender` (ForeignKey to User)
    - `content` (TextField)
    - `sent_at` (DateTimeField)
    - `read_at` (DateTimeField, nullable)
    - `is_deleted` (BooleanField)

- WebSocket Consumer:
  - Connect to Django Channels
  - Handle `send_message`, `mark_read`, `typing_indicator` events
  - Broadcast to all room participants

- API Endpoints:
  - `GET /api/incidents/{id}/messages/` - Get message history
  - `POST /api/incidents/{id}/messages/` - Send message (also via WebSocket)
  - `PATCH /api/messages/{id}/read/` - Mark message as read
  - `GET /api/incidents/{id}/chatroom/` - Get chatroom participants

**Frontend Requirements:**
- Create `/services/websocket.ts` - WebSocket connection service
- Connect `IncidentProvider.addMessage()` to API (currently throws error at Line 543)
- Implement real-time message updates in chat UI
- Add typing indicators
- Add message status (sent, delivered, read)
- Add unread message count badges

**Affected Dashboards:** Survivor + all provider dashboards

**Database Migration:** Yes - ChatRoom and Message models

**Testing Requirements:**
- Survivor sends message to provider
- Provider receives message in real-time
- Read receipts update correctly
- Offline messages sync when connection restored

---

### 1.3 File Upload & Evidence Management

**Business Value:** Survivors need to submit evidence (photos, voice recordings) for cases.

**Backend Requirements:**
- Configure S3 bucket with proper permissions
- Implement multipart file upload handling
- Create `Evidence` model:
  - `incident` (ForeignKey to Incident)
  - `file_url` (CharField - S3 URL)
  - `file_type` (image/audio/video/document)
  - `uploaded_by` (ForeignKey to User)
  - `uploaded_at` (DateTimeField)
  - `description` (TextField)

- API Endpoints:
  - `POST /api/incidents/{id}/upload-evidence/` - Upload file to S3
  - `POST /api/incidents/upload-voice/` - Upload voice recording
  - `GET /api/incidents/{id}/evidence/` - List all evidence
  - `DELETE /api/evidence/{id}/` - Delete evidence (soft delete)

**Frontend Requirements:**
- Create `/services/fileUpload.ts` - File upload service
- Connect voice recording upload in `/app/report.tsx`
- Implement upload progress indicators
- Add file preview functionality
- Handle upload errors and retries
- Add file size/type validation (max 10MB for images, 50MB for audio)

**Affected Dashboards:** Survivor, Police, Legal

**Database Migration:** Yes - Evidence model

**Testing Requirements:**
- Upload image evidence from survivor dashboard
- Upload voice recording during incident report
- Police view evidence for assigned case
- Files stored in S3, URLs returned correctly

---

### 1.4 Provider-Specific Data Models & APIs

**Business Value:** Each provider type needs to track domain-specific data.

**Backend Requirements:**

**Healthcare Provider:**
- `MedicalRecord` model:
  - `incident` (ForeignKey)
  - `provider` (ForeignKey to User)
  - `examination_date` (DateTimeField)
  - `diagnosis` (TextField)
  - `treatment_plan` (TextField)
  - `follow_up_date` (DateField)

- Endpoints:
  - `POST /api/healthcare/records/` - Create medical record
  - `GET /api/healthcare/records/` - List my medical records
  - `GET /api/healthcare/patients/` - List my patients (survivors with assigned cases)

**Legal Provider:**
- `LegalCase` model:
  - `incident` (ForeignKey)
  - `provider` (ForeignKey to User)
  - `case_type` (civil/criminal/protective_order)
  - `court_date` (DateTimeField)
  - `case_status` (filed/pending/active/closed)
  - `legal_notes` (TextField)

- Endpoints:
  - `POST /api/legal/cases/` - Create legal case
  - `GET /api/legal/cases/` - List my cases
  - `PATCH /api/legal/cases/{id}/` - Update case

**Police Provider:**
- `EvidenceLog` model:
  - `incident` (ForeignKey)
  - `officer` (ForeignKey to User)
  - `evidence_type` (physical/digital/testimonial)
  - `logged_at` (DateTimeField)
  - `chain_of_custody` (JSONField)
  - `notes` (TextField)

- Endpoints:
  - `POST /api/police/evidence/` - Log evidence
  - `GET /api/police/cases/` - List my cases
  - `GET /api/police/evidence/` - List evidence logs

**Counseling Provider:**
- `CounselingSession` model:
  - `incident` (ForeignKey)
  - `counselor` (ForeignKey to User)
  - `session_date` (DateTimeField)
  - `session_type` (individual/group/family)
  - `session_notes` (TextField - encrypted)
  - `next_session` (DateTimeField)

- Endpoints:
  - `POST /api/counseling/sessions/` - Create session
  - `GET /api/counseling/sessions/` - List my sessions
  - `GET /api/counseling/clients/` - List my clients

**Social Services Provider:**
- `ResourceAllocation` model:
  - `incident` (ForeignKey)
  - `social_worker` (ForeignKey to User)
  - `resource_type` (shelter/financial/food/childcare)
  - `allocated_at` (DateTimeField)
  - `status` (requested/approved/delivered)
  - `notes` (TextField)

- Endpoints:
  - `POST /api/social/resources/` - Allocate resource
  - `GET /api/social/resources/` - List allocations
  - `GET /api/social/clients/` - List my clients

**GBV Rescue Provider:**
- `EmergencyResponse` model:
  - `incident` (ForeignKey)
  - `responder` (ForeignKey to User)
  - `response_time` (DateTimeField)
  - `response_type` (hotline/field/shelter)
  - `outcome` (TextField)

- Endpoints:
  - `POST /api/gbv/responses/` - Log emergency response
  - `GET /api/gbv/responses/` - List responses
  - `GET /api/gbv/active-cases/` - List active emergency cases

**CHW Provider:**
- `OutreachVisit` model:
  - `incident` (ForeignKey)
  - `chw` (ForeignKey to User)
  - `visit_date` (DateTimeField)
  - `location` (JSONField - GPS coordinates)
  - `services_provided` (JSONField)
  - `referrals_made` (JSONField)

- Endpoints:
  - `POST /api/chw/visits/` - Log visit
  - `GET /api/chw/visits/` - List visits
  - `GET /api/chw/clients/` - List clients

**Frontend Requirements:**
- Create `/services/` files for each provider type:
  - `healthcareService.ts`
  - `legalService.ts`
  - `policeService.ts`
  - `counselingService.ts`
  - `socialService.ts`
  - `gbvService.ts`
  - `chwService.ts`

- Remove mock data from all provider dashboard components
- Connect each dashboard's list views to real APIs
- Implement forms for creating records (medical records, legal cases, etc.)

**Affected Dashboards:** All 7 provider dashboards

**Database Migration:** Yes - 7 new models

**Testing Requirements:**
- Healthcare provider creates medical record
- Legal provider schedules court date
- Police officer logs evidence
- Counselor creates session notes
- Social worker allocates shelter resource
- GBV rescue logs emergency response
- CHW logs community visit

---

### 1.5 Notification System

**Business Value:** Users need to be notified of case updates, new messages, and assignments.

**Backend Requirements:**
- Create `Notification` model:
  - `user` (ForeignKey to User)
  - `type` (case_assigned/message_received/status_updated/appointment_reminder)
  - `title` (CharField)
  - `message` (TextField)
  - `data` (JSONField - additional context)
  - `read_at` (DateTimeField, nullable)
  - `created_at` (DateTimeField)

- Integrate Firebase Cloud Messaging (FCM):
  - Store FCM tokens in User model
  - Send push notifications on:
    - New case assignment
    - New message received
    - Case status update
    - Appointment reminder (24 hours before)

- API Endpoints:
  - `POST /api/notifications/register-token/` - Register FCM token
  - `GET /api/notifications/` - Get my notifications
  - `PATCH /api/notifications/{id}/read/` - Mark as read
  - `PATCH /api/notifications/read-all/` - Mark all as read
  - `DELETE /api/notifications/{id}/` - Delete notification

**Frontend Requirements:**
- Create `/services/notificationService.ts` (exists but incomplete)
- Create `/providers/NotificationProvider.tsx`
- Request notification permissions on app launch
- Register FCM token with backend
- Handle foreground notifications
- Display unread count badges
- Deep linking from notifications to relevant screens

**Affected Dashboards:** All dashboards

**Database Migration:** Yes - Notification model

**Testing Requirements:**
- Provider assigned to case receives notification
- Survivor receives notification when message sent
- Notification badge count updates correctly
- Tap notification navigates to correct screen

---

## Priority 2: Essential Features

### 2.1 Wellbeing Data Persistence

**Business Value:** Survivors need to track mental health progress over time.

**Backend Requirements:**
- `MoodEntry` model:
  - `user` (ForeignKey to User)
  - `mood` (very_sad/sad/okay/good/great)
  - `logged_at` (DateTimeField)
  - `notes` (TextField, optional)

- `JournalEntry` model:
  - `user` (ForeignKey to User)
  - `content` (TextField - encrypted)
  - `created_at` (DateTimeField)

- Endpoints:
  - `POST /api/wellbeing/mood/` - Log mood
  - `GET /api/wellbeing/mood/` - Get mood history
  - `POST /api/wellbeing/journal/` - Save journal
  - `GET /api/wellbeing/journal/` - Get journals

**Frontend Requirements:**
- Remove mock data from `/providers/WellbeingProvider.tsx`
- Connect mood tracking to API
- Persist journal entries

**Affected Dashboards:** Survivor

---

### 2.2 Appointment Scheduling

**Business Value:** Providers and survivors need to schedule appointments.

**Backend Requirements:**
- `Appointment` model:
  - `incident` (ForeignKey)
  - `provider` (ForeignKey to User)
  - `survivor` (ForeignKey to User)
  - `appointment_type` (medical/legal/counseling)
  - `scheduled_at` (DateTimeField)
  - `duration_minutes` (IntegerField)
  - `location` (CharField)
  - `status` (scheduled/confirmed/completed/cancelled)
  - `notes` (TextField)

- Endpoints:
  - `POST /api/appointments/` - Create appointment
  - `GET /api/appointments/` - List appointments
  - `PATCH /api/appointments/{id}/` - Update appointment
  - `DELETE /api/appointments/{id}/` - Cancel appointment

**Frontend Requirements:**
- Connect appointment modals in Healthcare, Legal, Counseling dashboards
- Add calendar sync
- Implement appointment reminders via notifications

**Affected Dashboards:** Healthcare, Legal, Counseling, Survivor

---

### 2.3 Case Timeline & Activity Feed

**Business Value:** Track all actions taken on a case for transparency and accountability.

**Backend Requirements:**
- `CaseActivity` model:
  - `incident` (ForeignKey)
  - `user` (ForeignKey to User)
  - `action_type` (created/assigned/message_sent/status_changed/evidence_added)
  - `description` (TextField)
  - `metadata` (JSONField)
  - `created_at` (DateTimeField)

- Auto-create activities on:
  - Incident creation
  - Provider assignment
  - Status changes
  - Evidence uploads
  - Messages sent

- Endpoint:
  - `GET /api/incidents/{id}/timeline/` - Get case timeline

**Frontend Requirements:**
- Create timeline component for incident detail views
- Show chronological activity feed
- Display user avatars and timestamps

**Affected Dashboards:** All dashboards

---

### 2.4 Multi-Provider Collaboration

**Business Value:** Cases often require coordination between multiple provider types.

**Backend Requirements:**
- `CaseTeam` model:
  - `incident` (ForeignKey)
  - `members` (ManyToManyField to User)
  - `created_at` (DateTimeField)

- Update ChatRoom to support multiple providers
- Add referral system between providers

- Endpoints:
  - `POST /api/incidents/{id}/add-provider/` - Add provider to team
  - `GET /api/incidents/{id}/team/` - Get case team
  - `POST /api/incidents/{id}/refer/` - Refer to another provider type

**Frontend Requirements:**
- Show all team members on incident detail
- Allow providers to invite other providers to case
- Shared messaging in case chatroom

**Affected Dashboards:** All provider dashboards

---

## Priority 3: Administrative Features

### 3.1 Admin Dashboard & Analytics

**Backend Requirements:**
- Admin-only endpoints:
  - `GET /api/admin/stats/` - Platform statistics (total users, cases, by status)
  - `GET /api/admin/users/` - User management
  - `GET /api/admin/incidents/all/` - All incidents (with filters)
  - `GET /api/admin/reports/` - Generate reports (CSV/PDF)

**Frontend Requirements:**
- Create admin dashboard in `/app/(dashboard)/admin/`
- Display charts and statistics
- User management interface

---

### 3.2 Audit Logging

**Backend Requirements:**
- Log all sensitive actions:
  - Data access (who viewed what case)
  - Data modifications
  - User authentications
  - File uploads/downloads

---

## Database Schema Summary

### New Models Required (Priority 1):
1. `CaseAssignment` - Provider case assignments
2. `ChatRoom` - Messaging rooms
3. `Message` - Chat messages
4. `Evidence` - File uploads
5. `MedicalRecord` - Healthcare data
6. `LegalCase` - Legal cases
7. `EvidenceLog` - Police evidence
8. `CounselingSession` - Therapy sessions
9. `ResourceAllocation` - Social services
10. `EmergencyResponse` - GBV rescue
11. `OutreachVisit` - CHW visits
12. `Notification` - Push notifications

### New Models Required (Priority 2):
13. `MoodEntry` - Wellbeing tracking
14. `JournalEntry` - Private journals
15. `Appointment` - Scheduling
16. `CaseActivity` - Timeline/audit
17. `CaseTeam` - Multi-provider teams

---

## API Endpoints Summary

### Priority 1 Endpoints (Must Have):
- `/api/incidents/{id}/assign/` - Assign provider
- `/api/providers/assigned-cases/` - Get my cases
- `/api/incidents/{id}/messages/` - Messaging
- `/api/incidents/{id}/upload-evidence/` - File uploads
- `/api/healthcare/records/` - Medical records
- `/api/legal/cases/` - Legal cases
- `/api/police/evidence/` - Evidence logs
- `/api/counseling/sessions/` - Counseling sessions
- `/api/social/resources/` - Resource allocation
- `/api/gbv/responses/` - Emergency responses
- `/api/chw/visits/` - CHW visits
- `/api/notifications/` - Notifications

### Priority 2 Endpoints (Should Have):
- `/api/wellbeing/mood/` - Mood tracking
- `/api/wellbeing/journal/` - Journal entries
- `/api/appointments/` - Scheduling
- `/api/incidents/{id}/timeline/` - Case timeline
- `/api/incidents/{id}/team/` - Case team

---

## Implementation Plan

### Phase 1: Core Connectivity (Weeks 1-3)
**Goal:** All dashboards show real data, no mock data remains

**Week 1:**
- Backend: Implement CaseAssignment model and assignment API
- Frontend: Connect provider dashboards to assignment API
- Testing: Assign cases, accept/reject assignments

**Week 2:**
- Backend: Implement messaging system (ChatRoom, Message, WebSocket)
- Frontend: Connect messaging UI to WebSocket
- Testing: Real-time messaging between survivor and providers

**Week 3:**
- Backend: Implement file upload to S3, Evidence model
- Frontend: Connect file upload in report form
- Testing: Upload and retrieve evidence files

### Phase 2: Provider Features (Weeks 4-6)
**Goal:** Each provider type can perform domain-specific tasks

**Week 4:**
- Backend: Implement Healthcare, Legal, Police models and APIs
- Frontend: Connect respective dashboards

**Week 5:**
- Backend: Implement Counseling, Social, GBV models and APIs
- Frontend: Connect respective dashboards

**Week 6:**
- Backend: Implement CHW model and notification system
- Frontend: Connect CHW dashboard and push notifications
- Testing: End-to-end case flow across all provider types

### Phase 3: Enhancement (Weeks 7-8)
**Goal:** Improve user experience and data tracking

**Week 7:**
- Backend: Wellbeing APIs, appointment scheduling
- Frontend: Connect wellbeing and appointment features

**Week 8:**
- Backend: Case timeline, multi-provider collaboration
- Frontend: Timeline UI, team management
- Testing: Complete system integration testing

### Phase 4: Admin & Polish (Week 9-10)
**Goal:** Admin oversight and production readiness

**Week 9:**
- Backend: Admin endpoints, audit logging
- Frontend: Admin dashboard

**Week 10:**
- Security audit
- Performance optimization
- Production deployment

---

## Success Metrics

### Technical Metrics:
- [ ] Zero mock data in production
- [ ] All 8 dashboards connected to backend APIs
- [ ] Real-time messaging latency < 500ms
- [ ] File upload success rate > 95%
- [ ] API response time < 300ms (95th percentile)

### Functional Metrics:
- [ ] Survivor can report incident and receive provider assignment within 15 minutes
- [ ] Providers can view all assigned cases
- [ ] Messages delivered in real-time
- [ ] Evidence files accessible to authorized users only
- [ ] Notifications delivered within 30 seconds

---

## Security & Compliance

### Critical Requirements:
1. **Data Encryption:**
   - All data encrypted at rest (database encryption)
   - All data encrypted in transit (HTTPS/TLS)
   - Sensitive fields (journal entries, medical notes) double-encrypted

2. **Access Control:**
   - Role-based permissions (survivor cannot access provider data)
   - Case-level permissions (provider only sees assigned cases)
   - Audit logging for all data access

3. **Privacy:**
   - Anonymous reporting supported
   - User data deletion on request (GDPR compliance)
   - No sharing of survivor data without consent

4. **File Security:**
   - Signed S3 URLs with expiration
   - Virus scanning on upload
   - File type and size validation

---

## Risk Mitigation

### Technical Risks:
| Risk | Impact | Mitigation |
|------|--------|------------|
| WebSocket scalability | High | Use Redis for Channels layer, horizontal scaling |
| S3 costs | Medium | Implement file size limits, cleanup old files |
| Database performance | High | Proper indexing, query optimization, connection pooling |
| Real-time messaging reliability | High | Message queue for offline delivery, retry logic |

### Product Risks:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Provider adoption | High | User training, onboarding tutorials |
| Data quality | Medium | Validation rules, required fields |
| User privacy concerns | High | Clear privacy policy, anonymous mode, encryption |

---

## Open Questions

1. **Auto-assignment algorithm:** What criteria determine which provider gets assigned? (location, availability, specialization)
2. **Multi-provider chat:** Should all providers share one chatroom per case or have separate survivor-provider channels?
3. **File retention:** How long should evidence files be stored in S3?
4. **Notification frequency:** What's the maximum notification frequency to avoid spam?
5. **Offline mode:** Should the app support full offline functionality with sync?

---

## Appendix: File Structure

### Backend Files to Create/Modify:
```
/kintara-backend/apps/
├── incidents/
│   ├── models.py (add CaseAssignment, Evidence, CaseActivity, CaseTeam)
│   ├── views.py (add assignment, evidence endpoints)
│   └── serializers.py
├── messaging/
│   ├── models.py (add ChatRoom, Message)
│   ├── consumers.py (WebSocket consumer)
│   └── views.py
├── providers/
│   ├── healthcare/
│   │   ├── models.py (MedicalRecord)
│   │   └── views.py
│   ├── legal/ (similar structure)
│   ├── police/
│   ├── counseling/
│   ├── social/
│   ├── gbv_rescue/
│   └── chw/
├── notifications/
│   ├── models.py (Notification)
│   ├── views.py
│   └── fcm.py (Firebase integration)
└── wellbeing/
    ├── models.py (MoodEntry, JournalEntry)
    └── views.py
```

### Frontend Files to Create/Modify:
```
/services/
├── websocket.ts (new)
├── fileUpload.ts (new)
├── healthcareService.ts (new)
├── legalService.ts (new)
├── policeService.ts (new)
├── counselingService.ts (new)
├── socialService.ts (new)
├── gbvService.ts (new)
├── chwService.ts (new)
└── notificationService.ts (update existing)

/providers/
├── IncidentProvider.tsx (remove mock data)
├── ProviderContext.tsx (remove mock data)
├── WellbeingProvider.tsx (remove mock data)
└── NotificationProvider.tsx (new)

/dashboards/
├── healthcare/components/* (connect to APIs)
├── legal/components/* (connect to APIs)
├── police/components/* (connect to APIs)
├── counseling/components/* (connect to APIs)
├── social/components/* (connect to APIs)
├── gbv_rescue/components/* (connect to APIs)
└── chw/components/* (connect to APIs)
```

---

**Document Version:** 2.0
**Next Review:** After Phase 1 completion
**Owner:** Development Team
**Status:** Active Development

---

*This is a living document. Update as features are completed or requirements change.*
