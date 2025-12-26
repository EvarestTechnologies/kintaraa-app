# Kintaraa MVP Implementation Plan
## 3-Dashboard System: Survivor, Dispatch Center & GBV Rescue

**Target Date**: January 15, 2026
**Days Available**: 20 days (December 26, 2025 - January 15, 2026)
**Scope**: Functional Survivor Dashboard + GBV Center Dispatch Dashboard + GBV Rescue Dashboard with real backend integration

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Issues Found](#2-critical-issues-found)
3. [MVP Scope Definition](#3-mvp-scope-definition)
4. [Architecture Decision](#4-architecture-decision)
5. [Implementation Phases](#5-implementation-phases)
6. [Detailed Task Breakdown](#6-detailed-task-breakdown)
7. [Testing Strategy](#7-testing-strategy)
8. [Risk Mitigation](#8-risk-mitigation)
9. [Post-MVP Roadmap](#9-post-mvp-roadmap)

---

## 1. Executive Summary

### 1.1 Current State

**Frontend (React Native)**:
- ✅ 98% complete UI/UX implementation
- ❌ Using mock data (AsyncStorage)
- ❌ No real backend integration
- ❌ Zero test coverage
- ⚠️ Large unmaintainable files (36K+ lines)

**Backend (Django)**:
- ✅ 95% complete authentication system
- ✅ 70% complete incident reporting
- ❌ 0% provider management
- ❌ 0% messaging system
- ❌ 0% real-time features
- ❌ Critical security gaps
- ❌ Zero test coverage

### 1.2 Gap Analysis

| Feature | Frontend | Backend | Gap |
|---------|----------|---------|-----|
| User Authentication | ✅ Complete | ✅ Complete | ✅ Ready to integrate |
| Incident Reporting | ✅ Complete | ✅ Mostly done | ⚠️ Voice upload incomplete |
| Case Assignment | ✅ UI ready | ❌ No API | ❌ Backend needed |
| Messaging | ✅ UI ready | ❌ No WebSocket | ❌ Backend needed |
| File Upload (Evidence) | ✅ UI ready | ❌ No API | ❌ Backend needed |
| Notifications | ✅ UI ready | ❌ No FCM | ❌ Backend needed |
| Provider Dashboard | ✅ UI ready | ❌ No models | ❌ Backend needed |
| GBV Rescue Features | ✅ UI ready | ❌ No models | ❌ Backend needed |

### 1.3 MVP Strategy

**Decision**: **DO NOT separate apps** for MVP. Focus on getting **3 dashboards working end-to-end** in the existing monolith.

**Rationale**:
- 20 days is insufficient for app separation + feature development
- Separation adds complexity (3 codebases, 3 deployments)
- Can separate post-MVP when stable
- Faster time to market with monolith
- Dispatch center is critical for quality control and coordination

**MVP Features** (Minimal Viable):
1. ✅ User authentication (3 roles: survivor, dispatcher, provider)
2. ✅ Survivor creates incident
3. ✅ **Dispatch center receives and assigns cases** (NEW)
4. ✅ Hybrid assignment: auto-assign urgent, manual for routine
5. ✅ GBV Rescue accepts/views assigned cases
6. ✅ Basic messaging (HTTP polling, NOT WebSocket)
7. ✅ Case status updates
8. ✅ Push notifications (basic)
9. ✅ **Dispatch monitoring and coordination** (NEW)

**Deferred to Post-MVP**:
- ❌ Real-time WebSocket messaging
- ❌ Other 6 provider types (healthcare, legal, police, counseling, social, CHW)
- ❌ Wellbeing tracking
- ❌ Appointments
- ❌ Evidence file uploads (beyond voice)
- ❌ App separation

---

## 2. Critical Issues Found

### 2.1 Security Issues (MUST FIX IMMEDIATELY)

| Issue | Severity | Location | Impact |
|-------|----------|----------|--------|
| **AllowAny Permissions** | 🔴 CRITICAL | `backend/kintara/settings.py:169` | Anyone can access all endpoints |
| **No Rate Limiting** | 🔴 CRITICAL | Settings | API abuse, DDoS risk |
| **Weak Secret Key** | 🟡 HIGH | `settings.py:17` | Session/token security |
| **No Input Sanitization** | 🟡 HIGH | All serializers | XSS risk |
| **File Upload No Validation** | 🟡 HIGH | Voice upload | Malware risk |

### 2.2 Backend Missing Features

| Feature | Status | Required For |
|---------|--------|--------------|
| CaseAssignment model | ❌ Missing | Provider assignment |
| **Dispatcher role & permissions** | ❌ Missing | Dispatch dashboard |
| **Dispatch dashboard API** | ❌ Missing | Central command center |
| **Hybrid assignment service** | ❌ Missing | Auto + manual assignment |
| ChatRoom & Message models | ❌ Missing | Messaging |
| Evidence model | ❌ Missing | File uploads |
| Notification model | ❌ Missing | Push notifications |
| GBVRescueResponse model | ❌ Missing | GBV Rescue dashboard |
| Provider assignment API | ❌ Missing | Auto-routing |
| Messaging API | ❌ Missing | Communication |
| FCM integration | ❌ Missing | Push notifications |

### 2.3 Frontend Issues

| Issue | Severity | Location | Impact |
|-------|----------|----------|--------|
| **No Backend Integration** | 🔴 CRITICAL | All API calls | Using mock data |
| **Large Component Files** | 🟡 HIGH | `survivor/*.tsx` (36K lines) | Unmaintainable |
| **No Tests** | 🟡 HIGH | Entire codebase | Quality risk |
| **Provider Routing in Frontend** | 🟡 HIGH | `services/providerRouting.ts` | Should be backend |

---

## 3. MVP Scope Definition

### 3.1 In-Scope Features

#### **Survivor Dashboard** (Core Flow)

```
1. Registration/Login
   → Email + password
   → Biometric unlock (if enabled)

2. Create Incident Report
   → Incident type selection
   → Description (text + voice)
   → Location (GPS coordinates)
   → Severity/urgency selection
   → Submit → Auto-assigns to GBV Rescue

3. View My Cases
   → List all incidents
   → Filter by status
   → View case details
   → See assigned provider info

4. Message Provider
   → Send text messages
   → View message history
   → Get notifications on new messages

5. Track Case Status
   → See status updates (new → assigned → in_progress → completed)
   → Receive push notifications on status changes
```

#### **GBV Center Dispatch Dashboard** (Command Center) - NEW

```
1. Login (as dispatcher/admin)
   → GBV Center staff access

2. View ALL Incidents
   → See all cases (not just assigned)
   → Unassigned urgent cases highlighted
   → Filter by status/urgency/date
   → Real-time updates

3. Assign Cases to Providers
   → View provider availability and capacity
   → See algorithm recommendations
   → Manually assign/reassign cases
   → Override auto-assignments

4. Monitor Active Cases
   → Real-time case tracking
   → Provider status (on-site, en route, available)
   → Response time tracking
   → Multi-provider coordination

5. Dashboard Statistics
   → System-wide metrics
   → Provider performance
   → Response time analytics
   → Case volume trends
```

#### **GBV Rescue Dashboard** (First Responder)

```
1. Login (as provider)
   → Provider account setup

2. View Assigned Cases
   → List of cases assigned to me
   → Filter by urgency/status
   → Sort by date

3. Case Management
   → Accept assignment
   → View survivor info (anonymized if needed)
   → View incident details
   → Update case status
   → Add response notes

4. Messaging
   → Message survivor
   → View conversation history

5. Dashboard Stats
   → Total active cases
   → Cases by urgency
   → Response time metrics
```

### 3.2 MVP User Stories

**Survivor User Stories**:
- **US-1**: As a survivor, I can register and login so I can access the app
- **US-2**: As a survivor, I can report an incident so I can get help
- **US-3**: As a survivor, I can see my reported cases so I can track progress
- **US-4**: As a survivor, I can message my assigned provider so I can communicate
- **US-5**: As a survivor, I can receive notifications when my case is updated

**Dispatcher User Stories** (NEW):
- **US-6**: As a dispatcher, I can login to access the GBV Center command dashboard
- **US-7**: As a dispatcher, I can see ALL incoming cases so I can monitor the system
- **US-8**: As a dispatcher, I can view unassigned urgent cases so I can prioritize them
- **US-9**: As a dispatcher, I can assign cases to available providers so cases get handled
- **US-10**: As a dispatcher, I can reassign cases if needed so I can optimize response
- **US-11**: As a dispatcher, I can see provider availability so I can make informed assignments
- **US-12**: As a dispatcher, I can override auto-assignments so I have control
- **US-13**: As a dispatcher, I can monitor active cases in real-time so I can coordinate response

**GBV Rescue Provider User Stories**:
- **US-14**: As a GBV Rescue provider, I can login to access my dashboard
- **US-15**: As a GBV Rescue provider, I can see assigned cases so I can respond
- **US-16**: As a GBV Rescue provider, I can accept a case assignment
- **US-17**: As a GBV Rescue provider, I can update case status to track progress
- **US-18**: As a GBV Rescue provider, I can message survivors so I can provide support

### 3.3 MVP Success Criteria

**Technical**:
- ✅ All API endpoints return real data (no mocks)
- ✅ Frontend successfully calls backend APIs
- ✅ User can complete full incident reporting flow
- ✅ Provider can accept and manage cases
- ✅ Messaging works (HTTP polling with 30s refresh)
- ✅ Push notifications delivered
- ✅ No critical security vulnerabilities
- ✅ API response time < 500ms (p95)

**Functional**:
- ✅ Survivor can register → login → report incident → see assignment → message provider
- ✅ **Dispatcher can login → view all cases → assign to provider → monitor response**
- ✅ Provider can login → see assigned cases → accept case → update status → message survivor
- ✅ All users receive notifications
- ✅ Case status flows correctly (new → dispatcher review → assigned → in_progress → completed)
- ✅ **Hybrid assignment works (auto-assign urgent, manual for routine)**

---

## 4. Architecture Decision

### 4.1 Keep Monolith for MVP

**Decision**: Use existing `kintaraa-app` as monolith with role-based routing

**Why**:
- ⏱️ **Time constraint**: 20 days insufficient for separation + features
- 🚀 **Faster delivery**: Single codebase, single deployment
- 🔧 **Less complexity**: No need to sync 2 apps
- 📦 **Smaller risk**: Proven architecture already exists
- 🔄 **Reversible**: Can separate post-MVP

### 4.2 API Strategy

**Base URL**: `https://api-kintara.onrender.com/api/v1/`

**Authentication**: JWT Bearer tokens
```
Authorization: Bearer {access_token}
```

**Messaging**: HTTP Polling (NOT WebSocket for MVP)
```
Frontend polls every 30 seconds:
GET /api/v1/messages/?since={last_message_timestamp}
```

---

## 5. Implementation Phases

### Phase 1: Foundation & Security (Days 1-3)

**Goal**: Fix critical security issues, set up development environment

**Backend Tasks**:
1. ✅ Fix AllowAny permissions → IsAuthenticated
2. ✅ Add rate limiting (DRF throttling)
3. ✅ Enforce strong SECRET_KEY
4. ✅ Add input sanitization
5. ✅ Set up PostgreSQL locally
6. ✅ Configure Redis
7. ✅ Create .env file with all secrets

**Frontend Tasks**:
1. ✅ Update API client to use real backend URL
2. ✅ Implement token storage (SecureStore)
3. ✅ Add token refresh logic
4. ✅ Add error handling for API calls
5. ✅ Test authentication flow with backend

**Deliverables**:
- ✅ Backend with proper security
- ✅ Frontend can authenticate with backend
- ✅ Tokens stored securely

---

### Phase 2: Dispatch Dashboard & Provider Assignment (Days 4-8) - EXTENDED

**Goal**: Implement GBV Center Dispatch Dashboard with hybrid assignment flow

**Backend Tasks**:

1. **Create CaseAssignment model** (`apps/incidents/models.py`)
   ```python
   class CaseAssignment(BaseModel):
       incident = ForeignKey(Incident, on_delete=CASCADE)
       provider = ForeignKey(User, on_delete=CASCADE)
       status = CharField(max_length=20, choices=[
           ('pending', 'Pending'),
           ('accepted', 'Accepted'),
           ('rejected', 'Rejected'),
       ])
       assigned_at = DateTimeField(auto_now_add=True)
       accepted_at = DateTimeField(null=True, blank=True)
       rejected_at = DateTimeField(null=True, blank=True)
       notes = TextField(blank=True)
   ```

2. **Create assignment service** (`apps/incidents/services.py`)
   ```python
   def auto_assign_incident(incident):
       """Auto-assign incident to available GBV Rescue provider"""
       # Find first available GBV Rescue provider
       provider = User.objects.filter(
           role='provider',
           provider_type='gbv_rescue',
           is_active=True
       ).first()

       if provider:
           assignment = CaseAssignment.objects.create(
               incident=incident,
               provider=provider,
               status='pending'
           )
           # Trigger notification to provider
           return assignment
       return None
   ```

3. **Add assignment endpoints**
   ```python
   # Survivor endpoints
   POST   /api/v1/incidents/        → Auto-assigns on create

   # Provider endpoints
   GET    /api/v1/provider/cases/              → List assigned cases
   POST   /api/v1/cases/{id}/accept/           → Accept assignment
   POST   /api/v1/cases/{id}/reject/           → Reject assignment
   PATCH  /api/v1/cases/{id}/status/           → Update case status
   ```

4. **Create Dispatcher role and permissions** (NEW)
   ```python
   # apps/authentication/constants.py
   USER_ROLES = [
       ('survivor', 'Survivor'),
       ('provider', 'Service Provider'),
       ('dispatcher', 'GBV Center Dispatcher'),  # NEW
       ('admin', 'Administrator'),
   ]

   # apps/authentication/permissions.py
   class IsDispatcher(permissions.BasePermission):
       """Permission for GBV Center dispatchers"""
       def has_permission(self, request, view):
           return request.user.role in ['dispatcher', 'admin']
   ```

5. **Create ProviderProfile model** (NEW - for intelligent assignment)
   ```python
   # apps/providers/models.py
   class ProviderProfile(BaseModel):
       user = OneToOneField(User, related_name='provider_profile')
       location = JSONField(default=dict)  # {latitude, longitude}
       current_case_load = IntegerField(default=0)
       max_case_load = IntegerField(default=10)
       is_24_7 = BooleanField(default=False)
       working_hours_start = TimeField(default=time(8, 0))
       working_hours_end = TimeField(default=time(17, 0))
       average_response_time_minutes = IntegerField(default=30)
   ```

6. **Create hybrid assignment service** (NEW)
   ```python
   # apps/incidents/services/assignment.py
   class HybridAssignmentService:
       @staticmethod
       def handle_new_incident(incident):
           if incident.urgency_level in ['immediate', 'urgent']:
               # Auto-assign for fast response
               return ProviderAssignmentService.assign_incident_to_provider(incident)
           else:
               # Queue for dispatcher review
               incident.status = 'pending_dispatcher_review'
               incident.save()
               notify_dispatcher_new_case(incident)
   ```

7. **Create Dispatch Dashboard API** (NEW)
   ```python
   # apps/dispatch/views.py

   GET    /api/v1/dispatch/dashboard/           → Dashboard overview + stats
   GET    /api/v1/dispatch/cases/               → All cases (unfiltered)
   GET    /api/v1/dispatch/cases/{id}/          → Case details
   POST   /api/v1/dispatch/cases/{id}/assign/   → Manually assign provider
   POST   /api/v1/dispatch/cases/{id}/reassign/ → Reassign to different provider
   GET    /api/v1/dispatch/providers/           → All providers + status
   GET    /api/v1/dispatch/analytics/           → System analytics
   ```

**Frontend Tasks**:
1. Update `IncidentProvider.tsx` to call real API
2. Remove mock provider routing logic (`services/providerRouting.ts`)
3. Display assigned provider info in case details
4. Add provider acceptance UI (for GBV Rescue dashboard)
5. **Create Dispatch Dashboard screens** (NEW - ~8 hours)
   - Dashboard overview with statistics
   - All cases list with filters
   - Case assignment interface
   - Provider status view
6. **Build case assignment UI** (NEW - ~6 hours)
   - Provider recommendation display
   - Manual assignment controls
   - Reassignment interface
7. **Add real-time monitoring** (NEW - ~4 hours)
   - Active case tracking
   - Provider status updates
   - Polling for dashboard data (every 30s)

**Testing**:
- ✅ Unit test: CaseAssignment model creation
- ✅ Unit test: ProviderProfile model
- ✅ API test: POST /incidents/ creates assignment
- ✅ API test: Provider can accept/reject
- ✅ **API test: Dispatcher can view all cases**
- ✅ **API test: Dispatcher can assign/reassign cases**
- ✅ **API test: Hybrid assignment works (urgent vs routine)**
- ✅ Integration test: Full assignment flow
- ✅ **Integration test: Dispatcher workflow**

**Deliverables**:
- ✅ **Dispatch Dashboard functional (command center)**
- ✅ **Dispatcher can view all cases and provider status**
- ✅ **Dispatcher can manually assign/reassign cases**
- ✅ **Hybrid assignment: urgent auto-assign, routine manual**
- ✅ Provider can view assigned cases
- ✅ Provider can accept/reject assignments
- ✅ Intelligent assignment algorithm considers location, capacity, urgency

---

### Phase 3: Messaging System (Days 9-11) - ADJUSTED

**Goal**: Basic messaging between survivor and provider

**Backend Tasks**:

1. **Create messaging models** (`apps/messaging/models.py`)
   ```python
   class ChatRoom(BaseModel):
       incident = OneToOneField(Incident, on_delete=CASCADE)
       created_at = DateTimeField(auto_now_add=True)

       class Meta:
           db_table = 'chat_rooms'

   class ChatRoomParticipant(models.Model):
       room = ForeignKey(ChatRoom, on_delete=CASCADE)
       user = ForeignKey(User, on_delete=CASCADE)
       joined_at = DateTimeField(auto_now_add=True)

       class Meta:
           unique_together = ('room', 'user')

   class Message(BaseModel):
       room = ForeignKey(ChatRoom, on_delete=CASCADE, related_name='messages')
       sender = ForeignKey(User, on_delete=CASCADE)
       content = TextField()
       sent_at = DateTimeField(auto_now_add=True)
       read_at = DateTimeField(null=True, blank=True)
       is_deleted = BooleanField(default=False)

       class Meta:
           ordering = ['-sent_at']
   ```

2. **Create messaging API** (`apps/messaging/views.py`)
   ```python
   GET    /api/v1/incidents/{id}/messages/     → List messages (paginated)
   POST   /api/v1/incidents/{id}/messages/     → Send message
   PATCH  /api/v1/messages/{id}/read/          → Mark as read
   GET    /api/v1/messages/unread-count/       → Unread count
   ```

3. **Auto-create ChatRoom** when case assigned (signal handler)
   ```python
   @receiver(post_save, sender=CaseAssignment)
   def create_chat_room(sender, instance, created, **kwargs):
       if created and instance.status == 'accepted':
           room = ChatRoom.objects.create(incident=instance.incident)
           # Add survivor and provider as participants
           ChatRoomParticipant.objects.create(
               room=room, user=instance.incident.survivor
           )
           ChatRoomParticipant.objects.create(
               room=room, user=instance.provider
           )
   ```

**Frontend Tasks**:
1. Update `messages/[id].tsx` to call real API
2. Remove mock message data
3. **Implement polling** (fetch new messages every 30s)
   ```typescript
   useEffect(() => {
     const interval = setInterval(() => {
       fetchNewMessages();
     }, 30000); // 30 seconds
     return () => clearInterval(interval);
   }, []);
   ```
4. Add optimistic updates (show message immediately)
5. Display unread message count

**Testing**:
- ✅ API test: Create message
- ✅ API test: List messages with pagination
- ✅ API test: Mark as read
- ✅ Integration test: Survivor → Provider messaging

**Deliverables**:
- ✅ Survivor can message provider
- ✅ Provider can message survivor
- ✅ Message history persists
- ✅ Unread count shows correctly

---

### Phase 4: Notifications (Days 12-13) - ADJUSTED

**Goal**: Push notifications for key events

**Backend Tasks**:

1. **Create Notification model** (`apps/notifications/models.py`)
   ```python
   class FCMToken(BaseModel):
       user = ForeignKey(User, on_delete=CASCADE)
       token = CharField(max_length=255, unique=True)
       platform = CharField(max_length=10, choices=[
           ('ios', 'iOS'),
           ('android', 'Android'),
       ])
       created_at = DateTimeField(auto_now_add=True)
       last_used = DateTimeField(auto_now=True)

   class Notification(BaseModel):
       user = ForeignKey(User, on_delete=CASCADE)
       type = CharField(max_length=50, choices=[
           ('case_assigned', 'Case Assigned'),
           ('case_accepted', 'Case Accepted'),
           ('message_received', 'New Message'),
           ('status_updated', 'Status Updated'),
       ])
       title = CharField(max_length=200)
       message = TextField()
       data = JSONField(default=dict)
       read_at = DateTimeField(null=True, blank=True)
       sent_at = DateTimeField(auto_now_add=True)
   ```

2. **Integrate Firebase Cloud Messaging** (`apps/notifications/fcm.py`)
   ```python
   from pyfcm import FCMNotification

   def send_push_notification(user, notification):
       """Send push notification via FCM"""
       push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)

       tokens = FCMToken.objects.filter(user=user).values_list('token', flat=True)

       for token in tokens:
           result = push_service.notify_single_device(
               registration_id=token,
               message_title=notification.title,
               message_body=notification.message,
               data_message={
                   'notification_id': str(notification.id),
                   'type': notification.type,
                   **notification.data
               }
           )
   ```

3. **Create notification triggers** (signal handlers)
   ```python
   # Incident created → Notify assigned provider
   @receiver(post_save, sender=CaseAssignment)
   def notify_provider_assignment(sender, instance, created, **kwargs):
       if created:
           notification = Notification.objects.create(
               user=instance.provider,
               type='case_assigned',
               title='New Case Assigned',
               message=f'Case {instance.incident.case_number} has been assigned to you',
               data={'incident_id': str(instance.incident.id)}
           )
           send_push_notification(instance.provider, notification)

   # Case accepted → Notify survivor
   # New message → Notify recipient
   # Status updated → Notify survivor
   ```

4. **Add notification endpoints**
   ```python
   POST   /api/v1/notifications/register-token/  → Save FCM token
   GET    /api/v1/notifications/                 → List notifications
   PATCH  /api/v1/notifications/{id}/read/       → Mark as read
   DELETE /api/v1/notifications/{id}/            → Delete notification
   GET    /api/v1/notifications/unread-count/    → Unread count
   ```

**Frontend Tasks**:
1. Request notification permissions on login
2. Register FCM token with backend
3. Handle incoming notifications (foreground + background)
4. Display notifications in UI
5. Navigate to relevant screen on tap

**Testing**:
- ✅ Test FCM token registration
- ✅ Test notification creation
- ✅ Test push notification delivery
- ✅ Integration test: Full notification flow

**Deliverables**:
- ✅ Push notifications work on iOS + Android
- ✅ In-app notification list
- ✅ Unread notification badge

---

### Phase 5: GBV Rescue Dashboard (Days 14-15) - ADJUSTED

**Goal**: Complete GBV Rescue provider features

**Backend Tasks**:

1. **Create GBVRescueResponse model** (`apps/providers/models.py`)
   ```python
   class GBVRescueResponse(BaseModel):
       case_assignment = OneToOneField(CaseAssignment, on_delete=CASCADE)
       response_time = DateTimeField()
       action_taken = TextField()
       follow_up_required = BooleanField(default=False)
       follow_up_notes = TextField(blank=True)
       status = CharField(max_length=30, choices=[
           ('dispatched', 'Dispatched'),
           ('on_site', 'On Site'),
           ('transport_arranged', 'Transport Arranged'),
           ('safe_house', 'Safe House Arranged'),
           ('completed', 'Completed'),
       ])
       completed_at = DateTimeField(null=True, blank=True)
   ```

2. **Add GBV Rescue endpoints** (`apps/providers/views.py`)
   ```python
   POST   /api/v1/gbv-rescue/responses/           → Create response
   GET    /api/v1/gbv-rescue/responses/           → List responses
   PATCH  /api/v1/gbv-rescue/responses/{id}/      → Update response
   GET    /api/v1/gbv-rescue/dashboard-stats/     → Stats
   ```

3. **Dashboard statistics API**
   ```python
   GET /api/v1/gbv-rescue/dashboard-stats/

   Response:
   {
     "active_cases": 5,
     "pending_assignments": 2,
     "completed_today": 3,
     "urgent_cases": 1,
     "average_response_time_minutes": 15,
     "total_responses_this_month": 25
   }
   ```

**Frontend Tasks**:
1. Connect GBV Rescue dashboard to real API
2. Remove mock data from `dashboards/gbv_rescue/`
3. Implement case acceptance flow
4. Add response logging form
5. Display dashboard statistics

**Testing**:
- ✅ API test: Create GBV response
- ✅ API test: Dashboard stats calculation
- ✅ Integration test: Provider workflow

**Deliverables**:
- ✅ GBV Rescue can log responses
- ✅ Dashboard shows real statistics
- ✅ Case management workflow complete

---

### Phase 6: Testing & Bug Fixes (Days 16-18) - ADJUSTED

**Goal**: Comprehensive testing and bug fixing

**Backend Testing**:

1. **Write model tests** (`apps/*/tests/test_models.py`)
   ```python
   def test_incident_case_number_unique()
   def test_assignment_creates_chat_room()
   def test_message_marks_as_read()
   def test_notification_creation()
   ```

2. **Write API tests** (`apps/*/tests/test_api.py`)
   ```python
   def test_create_incident_authenticated()
   def test_create_incident_unauthenticated_fails()
   def test_provider_accept_assignment()
   def test_send_message_to_assigned_case()
   def test_cannot_message_unassigned_case()
   ```

3. **Run coverage report**
   ```bash
   pytest --cov=apps --cov-report=html --cov-report=term
   # Target: 80% coverage on critical paths
   ```

**Frontend Testing**:

1. **Write component tests**
   ```typescript
   // __tests__/IncidentReport.test.tsx
   it('submits incident successfully', async () => {});
   it('shows validation errors for missing fields', () => {});
   ```

2. **Manual testing checklist**:
   - [ ] Full survivor flow (register → report → message → track)
   - [ ] Full provider flow (login → accept → respond → message)
   - [ ] Notifications on both platforms (iOS + Android)
   - [ ] Offline behavior (show error, retry)
   - [ ] Voice recording upload
   - [ ] Multiple simultaneous users

**Performance Testing**:
- [ ] Load test: 100 concurrent users
- [ ] API response times < 500ms
- [ ] Database query optimization

**Deliverables**:
- ✅ 80%+ test coverage on critical paths
- ✅ All P0/P1 bugs fixed
- ✅ Performance benchmarks met

---

### Phase 7: Deployment & Polish (Day 19) - ADJUSTED

**Goal**: Deploy to production, final polish

**Backend Deployment**:

1. **Set up production environment**
   - PostgreSQL database (Render.com managed)
   - Redis instance
   - Environment variables

2. **Configure production settings**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['api-kintara.onrender.com']
   CORS_ALLOWED_ORIGINS = ['exp://...', 'kintaraa://']
   SECURE_SSL_REDIRECT = True
   ```

3. **Set up S3 bucket** for voice recordings
4. **Configure FCM** for production
5. **Run migrations** and create superuser
6. **Deploy backend**

**Frontend Deployment**:
1. Update API URL in config
2. Build production app
   ```bash
   eas build --platform all --profile production
   ```
3. Test production build

**Monitoring**:
1. Set up error monitoring (Sentry)
2. Set up uptime monitoring
3. Create monitoring dashboard

**Documentation**:
1. API documentation (Swagger)
2. User guide
3. Provider onboarding guide
4. Deployment runbook

**Deliverables**:
- ✅ Backend deployed to production
- ✅ Frontend builds successfully
- ✅ Monitoring in place
- ✅ Documentation complete

---

### Phase 8: Launch Preparation (Day 20)

**Goal**: Final checks, prepare for launch

**Pre-Launch Checklist**:

**Backend**:
- [ ] All environment variables set
- [ ] Database backups configured
- [ ] SSL certificate valid
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Logging working
- [ ] Error monitoring active
- [ ] Migrations applied

**Frontend**:
- [ ] API URLs correct
- [ ] FCM tokens registering
- [ ] Push notifications working
- [ ] Offline errors handled gracefully
- [ ] Loading states on all API calls

**Testing**:
- [ ] Run full test suite
- [ ] Manual smoke test (both roles)
- [ ] Test on multiple devices
- [ ] Test notifications
- [ ] Test offline/online transitions

**Rollout Plan**:
1. Deploy backend first
2. Test backend health endpoint
3. Deploy frontend update
4. Monitor error rates
5. Test with pilot users (5 people)
6. Fix any critical issues
7. Gradual rollout to all users

---

## 6. Detailed Task Breakdown

### 6.1 Backend Tasks (Priority Order)

#### **P0 - Critical (Must Have)** - 47 hours (~6 days)

| Task | Est. | Files |
|------|------|-------|
| Fix AllowAny permissions | 1h | `settings.py` |
| Add rate limiting | 2h | `settings.py` |
| Create CaseAssignment model | 3h | `apps/incidents/models.py` |
| Create assignment service | 4h | `apps/incidents/services.py` |
| Add assignment endpoints | 4h | `apps/incidents/views.py` |
| Create ChatRoom & Message models | 4h | `apps/messaging/models.py` |
| Add messaging endpoints | 6h | `apps/messaging/views.py` |
| Create Notification model | 2h | `apps/notifications/models.py` |
| Integrate FCM | 4h | `apps/notifications/fcm.py` |
| Add notification endpoints | 3h | `apps/notifications/views.py` |
| Create notification triggers | 4h | Signal handlers |
| Create GBVRescueResponse model | 2h | `apps/providers/models.py` |
| Add GBV endpoints | 4h | `apps/providers/views.py` |
| Write critical API tests | 8h | `apps/*/tests/` |

#### **P1 - Important (Should Have)** - 27 hours (~3.5 days)

| Task | Est. | Files |
|------|------|-------|
| Add input sanitization | 3h | All serializers |
| Voice upload completion | 3h | `apps/incidents/views.py` |
| S3 integration | 4h | Settings, storage |
| Dashboard stats endpoint | 3h | `apps/providers/views.py` |
| Message pagination | 2h | `apps/messaging/views.py` |
| Write model tests | 6h | `apps/*/tests/` |
| Add database indexes | 2h | Migrations |
| Documentation (Swagger) | 4h | Settings |

---

### 6.2 Frontend Tasks (Priority Order)

#### **P0 - Critical (Must Have)** - 45 hours (~6 days)

| Task | Est. | Files |
|------|------|-------|
| Update API client with real URL | 1h | `services/api.ts` |
| Implement token storage | 2h | `providers/AuthProvider.tsx` |
| Add token refresh logic | 3h | `services/api.ts` |
| Connect auth flow to backend | 4h | `app/(auth)/*.tsx` |
| Connect incident creation | 4h | `providers/IncidentProvider.tsx` |
| Remove mock provider routing | 2h | Delete `services/providerRouting.ts` |
| Connect messaging to API | 6h | `app/messages/[id].tsx` |
| Implement message polling | 3h | Custom hook |
| Add FCM token registration | 3h | `providers/AuthProvider.tsx` |
| Handle push notifications | 4h | Notification handler |
| Connect GBV dashboard | 6h | `dashboards/gbv_rescue/` |
| Add error handling | 4h | All API calls |
| Add loading states | 3h | All screens |

#### **P1 - Important (Should Have)** - 32 hours (~4 days)

| Task | Est. | Files |
|------|------|-------|
| Refactor large survivor files | 8h | `app/(dashboard)/survivor/*.tsx` |
| Add optimistic updates | 4h | Message sending |
| Improve error messages | 3h | Error handling |
| Add empty states | 3h | All lists |
| Write component tests | 8h | `__tests__/` |
| Manual testing | 6h | All flows |

---

## 7. Testing Strategy

### 7.1 Backend Test Coverage (Target: 80%)

**Model Tests**:
```python
# apps/incidents/tests/test_models.py
def test_case_number_generation()
def test_incident_soft_delete()
def test_assignment_creates_chat_room()
```

**API Tests**:
```python
# apps/incidents/tests/test_api.py
def test_create_incident_authenticated()
def test_create_incident_unauthenticated_fails()
def test_provider_accept_assignment()
def test_send_message_to_assigned_case()
```

**Permission Tests**:
```python
# apps/authentication/tests/test_permissions.py
def test_survivor_cannot_view_others_incidents()
def test_provider_can_only_view_assigned()
```

### 7.2 Manual Test Plan

**Survivor Flow**:
- [ ] Register with valid email/password
- [ ] Login successfully
- [ ] Create incident report
- [ ] View incident in list
- [ ] See assigned provider
- [ ] Send message to provider
- [ ] Receive push notification

**Provider Flow**:
- [ ] Login as provider
- [ ] View assigned cases
- [ ] Accept case assignment
- [ ] Update case status
- [ ] Send message to survivor
- [ ] Receive notifications

---

## 8. Risk Mitigation

### 8.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Backend deployment fails | Medium | High | Test deployment early (Day 10) |
| FCM not working | Medium | High | Test by Day 11, fallback to in-app only |
| Database performance issues | Low | Medium | Add indexes early, load test by Day 16 |
| Token refresh bugs | Medium | High | Test thoroughly, add robust error handling |

### 8.2 Schedule Risks

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Features take longer | High | Cut P2 features, focus on P0 only |
| Testing reveals major bugs | Medium | Allocate 3 full days for bug fixes (Days 14-16) |
| Deployment issues | Medium | Deploy backend early (Day 10), not Day 17 |

---

## 9. Post-MVP Roadmap

### 9.1 Immediate Post-MVP (Weeks 1-4)

**Week 1-2: Stability**
- Monitor error rates
- Fix P1/P2 bugs
- Collect user feedback
- Optimize performance

**Week 3-4: Core Features**
- Implement WebSocket for real-time messaging
- Add other provider types (healthcare, legal, police)
- Implement evidence file uploads
- Add wellbeing tracking

### 9.2 Long-term (Months 4-6)

**App Separation**:
- Separate into Survivor App + Provider Platform
- Independent deployments
- Optimized bundle sizes

---

## 10. Environment Setup

### 10.1 Backend Setup

```bash
# Clone repo
cd /home/athooh/Documents/kintara-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up .env
cp .env.example .env
# Edit .env with your values

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### 10.2 Frontend Setup

```bash
# Navigate to frontend
cd /home/athooh/Documents/kintaraa-app

# Install dependencies
npm install

# Start dev server
npx expo start
```

---

## 11. Key API Endpoints

**Authentication**:
```
POST   /api/v1/auth/register/
POST   /api/v1/auth/login/
POST   /api/v1/auth/refresh/
POST   /api/v1/auth/logout/
GET    /api/v1/auth/me/
```

**Incidents**:
```
GET    /api/v1/incidents/
POST   /api/v1/incidents/
GET    /api/v1/incidents/{id}/
PATCH  /api/v1/incidents/{id}/
GET    /api/v1/incidents/stats/
```

**Provider Cases**:
```
GET    /api/v1/provider/cases/
POST   /api/v1/cases/{id}/accept/
POST   /api/v1/cases/{id}/reject/
PATCH  /api/v1/cases/{id}/status/
```

**Messaging**:
```
GET    /api/v1/incidents/{id}/messages/
POST   /api/v1/incidents/{id}/messages/
PATCH  /api/v1/messages/{id}/read/
GET    /api/v1/messages/unread-count/
```

**Notifications**:
```
POST   /api/v1/notifications/register-token/
GET    /api/v1/notifications/
PATCH  /api/v1/notifications/{id}/read/
```

**GBV Rescue**:
```
POST   /api/v1/gbv-rescue/responses/
GET    /api/v1/gbv-rescue/responses/
GET    /api/v1/gbv-rescue/dashboard-stats/
```

---

## 12. Success Metrics

**MVP Launch Criteria**:
- ✅ Survivor can complete full incident flow
- ✅ Provider can accept and manage cases
- ✅ Messaging works between both parties
- ✅ Push notifications delivered
- ✅ No P0 bugs, < 5 P1 bugs
- ✅ 80%+ test coverage on critical paths
- ✅ API response time < 500ms (p95)

---

## 13. Final Recommendations

### 13.1 Critical Success Factors

1. **Focus on MVP scope** - No feature creep
2. **Fix security issues first** (Day 1)
3. **Deploy backend early** (Day 10)
4. **Test continuously**
5. **Communicate daily**

### 13.2 Day 1 Kickoff Checklist

- [ ] Team roles clear
- [ ] Daily standup time agreed
- [ ] MVP scope locked
- [ ] Development environments working
- [ ] Backend running locally
- [ ] Frontend running locally
- [ ] First commit pushed

---

**Document Version**: 1.0
**Last Updated**: December 26, 2025
**Next Review**: January 5, 2026

---

## Good luck with the MVP! 🚀

**Remember**: Done is better than perfect. Ship on January 15, iterate after.
