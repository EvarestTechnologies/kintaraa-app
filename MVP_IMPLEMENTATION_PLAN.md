# Kintaraa MVP Implementation Plan
## 3-Dashboard System: Survivor, Dispatch Center & GBV Rescue

**Target Date**: January 15, 2026 (original) — revised to March 21, 2026
**Current Date**: March 7, 2026
**Days Remaining**: ~14 days to complete MVP
**Scope**: Functional Survivor Dashboard + GBV Center Dispatch Dashboard + GBV Rescue Dashboard with real backend integration

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State — As of March 7, 2026](#2-current-state--as-of-march-7-2026)
3. [What Has Been Completed](#3-what-has-been-completed)
4. [What Is Remaining](#4-what-is-remaining)
5. [MVP Scope Definition](#5-mvp-scope-definition)
6. [Architecture Decision](#6-architecture-decision)
7. [Remaining Implementation Plan](#7-remaining-implementation-plan)
8. [Testing Strategy](#8-testing-strategy)
9. [Risk Mitigation](#9-risk-mitigation)
10. [Post-MVP Roadmap](#10-post-mvp-roadmap)

---

## 1. Executive Summary

### 1.1 Progress Since Plan Was Written (Dec 26, 2025)

The MVP has made significant progress. The project is now at approximately **70% overall completion** with the backend infrastructure, authentication, incident management, provider assignment, and messaging backend all functional. The critical remaining work is:

1. **Frontend messaging integration** — backend is complete, frontend still uses mock data
2. **Push notifications** — backend infrastructure exists, frontend registration not done
3. **Dispatcher routing bug** — login redirects to wrong dashboard
4. **End-to-end testing** — integration testing across all flows
5. **Deployment** — production environment not yet configured

### 1.2 Updated Status Summary

| Component | Original Status | Current Status | Gap |
|-----------|----------------|----------------|-----|
| Backend Auth | 95% | ✅ 100% | Done |
| Backend Incidents | 70% | ✅ 100% | Done |
| Backend Assignment | 0% | ✅ 100% | Done |
| Backend Dispatch API | 0% | ✅ 100% | Done |
| Backend Messaging | 0% | ✅ 100% | Done |
| Backend Push Notifications | 0% | ✅ 90% | Celery tasks ready, FCM via Expo |
| Backend WebSocket | 0% | ✅ 85% | ProviderConsumer implemented |
| Backend Provider Profiles | 0% | ✅ 100% | Done |
| Frontend Auth | ✅ | ✅ 100% | Fully integrated |
| Frontend Incidents | ✅ | ✅ 100% | Fully integrated |
| Frontend Assignment | ✅ UI | ✅ 100% | Fully integrated |
| Frontend Dispatcher Dashboard | ✅ UI | ✅ 95% | Routing bug remaining |
| Frontend Messaging | ✅ UI | ❌ 20% | Not integrated with backend |
| Frontend Push Notifications | ✅ UI | ❌ 10% | Token registration not done |
| Deployment | 0% | ❌ 0% | Not started |
| Tests | 0% | ❌ 5% | Minimal test coverage |

---

## 2. Current State — As of March 7, 2026

### 2.1 Backend (kintara-backend)

**Location**: `/home/athooh/Documents/Work/Evarest/kintara-backend`
**Stack**: Django 4.2.24 + PostgreSQL + Redis + Celery + Django Channels

**Confirmed Working (from code analysis + commit history):**

#### Apps Implemented
- `apps/authentication/` — Full JWT auth, user roles (survivor, provider, dispatcher, admin), biometric support
- `apps/incidents/` — Full CRUD, CaseAssignment model, accept/reject workflow, HybridAssignmentService
- `apps/dispatch/` — Full dispatcher API (dashboard stats, case management, manual assignment, reassignment)
- `apps/providers/` — ProviderProfile model, assigned-cases endpoint, available providers endpoint
- `apps/messaging/` — **FULLY IMPLEMENTED** (contrary to earlier analysis): Conversation, Message, MessageReadReceipt, CaseActivity, PushToken models; full REST API + WebSocket consumer; Celery tasks for push notifications; encryption at rest (Fernet/AES-128)

#### Key Backend Endpoints
```
Authentication:
  POST /api/auth/login/
  POST /api/auth/register/
  POST /api/auth/logout/
  POST /api/auth/refresh/
  GET  /api/auth/me/

Incidents (Survivor):
  GET    /api/incidents/
  POST   /api/incidents/
  GET    /api/incidents/{id}/
  PATCH  /api/incidents/{id}/
  DELETE /api/incidents/{id}/
  GET    /api/incidents/stats/
  POST   /api/incidents/upload-voice/
  POST   /api/incidents/{id}/assign/
  PATCH  /api/incidents/{id}/accept/
  PATCH  /api/incidents/{id}/reject/
  GET    /api/incidents/{id}/activity/

Providers:
  GET    /api/providers/assigned-cases/
  GET    /api/providers/available/
  PATCH  /api/providers/cases/{id}/status/

Dispatch:
  GET    /api/dispatch/dashboard/
  GET    /api/dispatch/cases/
  POST   /api/dispatch/cases/{id}/assign/
  POST   /api/dispatch/cases/{id}/reassign/

Messaging:
  GET    /api/messaging/conversations/
  GET    /api/messaging/conversations/{id}/
  POST   /api/messaging/conversations/{id}/send_message/
  POST   /api/messaging/conversations/{id}/mark-all-read/
  GET    /api/messaging/conversations/{id}/unread-count/
  GET    /api/messaging/conversations/{id}/messages/
  PATCH  /api/messaging/messages/{id}/
  DELETE /api/messaging/messages/{id}/
  POST   /api/messaging/messages/{id}/read/
  POST   /api/messaging/push-token/

WebSocket:
  ws/providers/ — Real-time provider notifications (case_assigned, case_updated)
```

#### Backend Architecture Highlights
- **Dual status system**: `Incident.status` + `CaseAssignment.status` for flexible workflow
- **Hybrid assignment**: All incidents queued for dispatcher manual assignment (full control)
- **Message encryption**: Fernet AES-128 encryption at rest for all message content
- **Automatic conversation creation**: Signal fires when provider accepts → conversation auto-created
- **WebSocket**: `ProviderConsumer` — providers get real-time push on new assignments (no polling needed)
- **Expo push notifications**: Celery tasks call `https://exp.host/--/api/v2/push/send` directly
- **CaseActivity timeline**: Full audit trail of case events for dispatcher oversight
- **Soft delete**: Incidents and messages use soft delete (recoverable)

#### Test Accounts (Active)
| Role | Email | Password | Type |
|------|-------|----------|------|
| Survivor | survivor@kintara.com | survivor123 | - |
| Dispatcher | dispatcher@kintara.com | dispatcher123 | - |
| Healthcare | healthcare@kintara.com | provider123 | healthcare |
| GBV Rescue | gbv@kintara.com | provider123 | gbv_rescue |
| Legal | legal@kintara.com | provider123 | legal |
| Police | police@kintara.com | provider123 | police |
| Counseling | counseling@kintara.com | provider123 | counseling |
| Social | social@kintara.com | provider123 | social |
| CHW | chw@kintara.com | provider123 | chw |

### 2.2 Frontend (kintaraa-app)

**Location**: `/home/athooh/Documents/Work/Evarest/kintaraa-app`
**Stack**: React Native 0.81.4 + Expo SDK 54 + TypeScript + NativeWind

**Confirmed Working:**
- Authentication (login/logout/register) — fully integrated with backend
- Incident creation/listing/details — fully integrated
- Provider assignment workflow — all 7 provider types, NotificationFab, accept/reject via real API
- Dispatcher dashboard — case management, manual assignment, provider status display
- API client (`services/api.ts`) — JWT bearer tokens, token refresh on 401
- Assignment service (`services/assignments.ts`) — all assignment endpoints
- Dispatcher service (`services/dispatcher.ts`) — full dispatcher API

**Known Remaining Issues:**
- Messaging screen (`app/messages/[id].tsx`) — uses `incident.messages` from local state, **not calling backend messaging API**
- Dispatcher login routing bug — redirects to survivor dashboard instead of dispatcher dashboard
- Push notification token registration — `services/notificationService.ts` exists but token is not registered with backend on login
- Voice recording upload — endpoint exists but never tested end-to-end

---

## 3. What Has Been Completed

### Week 1 (Feb 15, 2026) — Backend Setup
- [x] Docker infrastructure: PostgreSQL, Redis, Django all running
- [x] Database migrations applied
- [x] Test data seeded (9 test accounts, sample incidents)
- [x] API documentation at `/swagger/` and `/redoc/`
- [x] Frontend API URL updated to `http://localhost:8000/api`
- [x] Node.js v20 configured via `.nvmrc`

### Week 2 Day 8 — Authentication Integration
- [x] Login flow end-to-end (web + mobile)
- [x] JWT token storage in AsyncStorage
- [x] Token refresh on 401
- [x] Environment detection fixed (dev vs prod URL)
- [x] Mobile network access configured (network IP in ALLOWED_HOSTS)

### Week 2 Day 9 — Incident Management Integration
- [x] Incident creation from mobile app
- [x] Incident listing with full details
- [x] Backend serializer updated (description + incident_date in list response)
- [x] Location validation fixed (defaults to Nairobi if no GPS)

### Week 2 Day 10 — Provider Assignment Integration
- [x] All 7 provider types functional
- [x] `_ProviderNotificationFab.tsx` shared component (notification bell, accept/reject modal)
- [x] Dispatcher dashboard shows all cases with provider details
- [x] Color-coded provider badges
- [x] Real-time polling: providers (5s), dispatcher (10s)
- [x] Centralized dispatcher queue — all incidents require dispatcher assignment
- [x] Test accounts reset with correct credentials

### Backend Messaging (most recent — commit `8ce816b` merge)
- [x] Conversation model (OneToOne with Incident)
- [x] Message model (Fernet-encrypted content)
- [x] MessageReadReceipt model
- [x] CaseActivity timeline model
- [x] PushToken model
- [x] Full REST API for conversations + messages
- [x] WebSocket ProviderConsumer (real-time case assignment notifications)
- [x] Signal: auto-create conversation when provider accepts assignment
- [x] Signal: auto-close conversation when incident completed/closed
- [x] Celery tasks for Expo push notifications
- [x] NotificationService: notify on new message, assignment, status change
- [x] Encryption service (Fernet AES-128)
- [x] ActivityLogService for audit trail
- [x] Database migrations applied

---

## 4. What Is Remaining

### 4.1 Critical (P0) — Blocking MVP

| Task | Effort | Owner |
|------|--------|-------|
| **Frontend: Connect messaging screen to backend API** | 4-6h | Frontend |
| **Frontend: Fix dispatcher routing bug** | 30m | Frontend |
| **Frontend: Register push token with backend on login** | 1-2h | Frontend |
| **End-to-end integration test: full survivor flow** | 2h | Both |
| **End-to-end integration test: full dispatcher flow** | 2h | Both |
| **End-to-end integration test: full provider flow** | 2h | Both |

### 4.2 Important (P1) — Should Have for MVP

| Task | Effort | Owner |
|------|--------|-------|
| Implement WebSocket in frontend (replace provider polling) | 3-4h | Frontend |
| Test voice recording upload end-to-end | 1h | Both |
| Handle frontend message encryption/decryption | 2h | Frontend |
| Display case activity timeline in survivor/provider views | 3h | Frontend |
| Add unread message badge on case cards | 1h | Frontend |
| Improve error messages for API failures | 2h | Frontend |

### 4.3 Deployment (P0 for launch)

| Task | Effort | Owner |
|------|--------|-------|
| Backend: Configure production settings | 2h | Backend |
| Backend: Deploy to Render.com | 2h | Backend |
| Backend: Set up S3 for voice recordings | 2h | Backend |
| Backend: Configure Celery worker in production | 1h | Backend |
| Backend: Run migrations on production DB | 30m | Backend |
| Frontend: Update API URL for production | 30m | Frontend |
| Frontend: Build production app (EAS build) | 1h | Frontend |
| Frontend: Test on production backend | 2h | Both |

### 4.4 Testing (P1)

| Task | Effort |
|------|--------|
| Backend: Write model tests (target 60% coverage) | 4h |
| Backend: Write API tests for critical endpoints | 4h |
| Frontend: Manual test checklist execution | 4h |
| Fix bugs found during testing | variable |

---

## 5. MVP Scope Definition

### 5.1 In-Scope (Confirmed Active)

#### Survivor Dashboard — COMPLETE
- Registration/Login with JWT ✅
- Create incident report (text, voice, location, urgency) ✅
- View my cases (list + details) ✅
- Track case status ✅
- See assigned provider ✅
- Message provider ❌ **Needs frontend integration**
- Receive push notifications ❌ **Needs token registration**

#### GBV Center Dispatch Dashboard — COMPLETE
- Login as dispatcher ✅ (routing bug blocks redirect)
- View ALL incoming cases ✅
- Filter by status/urgency ✅
- Manually assign cases to any of 7 provider types ✅
- Reassign cases ✅
- View provider availability + capacity ✅
- Monitor active cases with provider details ✅
- Dashboard statistics ✅

#### GBV Rescue / All Provider Dashboards — COMPLETE
- Login as provider ✅
- Notification bell with pending assignments ✅
- Accept/reject assignment via modal ✅
- Case moves to in_progress on accept ✅
- Message survivor ❌ **Needs frontend integration**
- Update case status ✅ (endpoint exists, UI needs testing)

### 5.2 Deferred to Post-MVP (Unchanged)
- Real-time WebSocket messaging (HTTP polling is ready)
- Evidence file uploads (photos/documents)
- Wellbeing tracking
- Appointments
- App separation into Survivor + Provider apps
- Other provider dashboards (beyond GBV Rescue) for full integration
- Voice transcription

---

## 6. Architecture Decision

**Monolith confirmed** — still the right choice. Backend is a single Django project with:
- `apps/authentication`, `apps/incidents`, `apps/dispatch`, `apps/providers`, `apps/messaging`
- All connected via shared models and signals
- Single API base URL: `http://localhost:8000/api` (dev), `https://api-kintara.onrender.com/api` (prod)
- WebSocket URL: `ws://localhost:8000/ws/` (dev), `wss://api-kintara.onrender.com/ws/` (prod)

**Messaging strategy — Updated**:
- Backend supports BOTH WebSocket (real-time) and REST polling
- WebSocket `ProviderConsumer` handles assignment notifications
- REST API handles conversation/message CRUD
- Frontend should use REST polling for messages (30s) and WebSocket for assignment notifications
- This eliminates the 5s polling for assignments (replace with WebSocket)

---

## 7. Remaining Implementation Plan

### Day 11 (Next) — Messaging Frontend Integration

**Goal**: Connect messaging screen to real backend API

**Tasks**:
1. Create `services/messaging.ts` API service:
   ```typescript
   // GET /api/messaging/conversations/?incident_id={id}
   export const getConversation = async (incidentId: string) => {...}

   // POST /api/messaging/conversations/{id}/send_message/
   export const sendMessage = async (conversationId: string, content: string) => {...}

   // GET /api/messaging/conversations/{id}/messages/
   export const getMessages = async (conversationId: string) => {...}

   // POST /api/messaging/conversations/{id}/mark-all-read/
   export const markAllRead = async (conversationId: string) => {...}

   // POST /api/messaging/push-token/
   export const registerPushToken = async (token: string, platform: string) => {...}
   ```

2. Update `app/messages/[id].tsx`:
   - Query conversation by `incident_id`
   - Load messages from backend
   - Send message via API
   - Poll for new messages (30s interval via React Query)
   - Mark messages as read on view

3. Fix dispatcher routing in `app/(tabs)/_layout.tsx`:
   ```typescript
   if (user?.role === 'dispatcher') {
     router.replace('/(dashboard)/dispatcher');
   }
   ```

4. Register Expo push token on login in `providers/AuthProvider.tsx`:
   ```typescript
   const token = await Notifications.getExpoPushTokenAsync();
   await registerPushToken(token.data, Platform.OS);
   ```

**Note on encryption**: Backend encrypts messages with Fernet. The REST API decrypts before serializing, so the frontend receives plain text. No client-side decryption needed.

**Deliverables**:
- Survivor can send message to provider
- Provider can send message to survivor
- Messages persist in DB
- Unread count works
- Push token registered

---

### Day 12 — Fix Known Issues + WebSocket Integration

**Goal**: Fix dispatcher routing, integrate WebSocket for real-time provider notifications

**Tasks**:
1. Fix dispatcher routing bug (30 min)
2. Implement WebSocket connection for providers using `hooks/useWebSocket.ts`:
   ```typescript
   // Connect to ws/providers/?token={jwt}
   // Handle: case_assigned → trigger React Query refetch
   // Handle: case_updated → update local state
   // Handle: ping → send pong
   ```
3. Replace 5s polling in `_ProviderNotificationFab.tsx` with WebSocket events
4. Test voice recording upload end-to-end
5. Add unread message count badge to case cards in survivor dashboard

**Deliverables**:
- Dispatcher routing fixed
- Real-time assignment notifications (no polling)
- Voice uploads tested

---

### Day 13 — End-to-End Testing

**Goal**: Validate complete workflows for all 3 roles

**Test Scenarios**:

**Survivor Full Flow**:
- [ ] Register new account
- [ ] Login → redirects to survivor dashboard
- [ ] Create incident (text description, location, urgency)
- [ ] Incident appears in case list with correct status
- [ ] Logout

**Dispatcher Full Flow**:
- [ ] Login → redirects to dispatcher dashboard (after fix)
- [ ] New incident appears in "Pending Review" queue
- [ ] Assign to Healthcare provider
- [ ] Case moves to "Assigned" status
- [ ] Provider name + badge visible on case card

**Provider Full Flow**:
- [ ] Login as healthcare@kintara.com
- [ ] Notification bell shows badge count
- [ ] Open modal → see case details
- [ ] Accept assignment → notification disappears from bell
- [ ] Message screen opens → send message to survivor
- [ ] Status updates correctly

**Messaging Full Flow**:
- [ ] Survivor opens assigned case → opens message screen
- [ ] Send message → appears in conversation
- [ ] Provider logs in → sees unread message count
- [ ] Provider replies → survivor sees response
- [ ] Messages persist after app refresh

**Bug Fix Sprint**:
- Fix all issues found during testing

---

### Day 14 — Deployment Preparation

**Backend Deployment**:
1. Update `settings.py` for production:
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['api-kintara.onrender.com']
   CORS_ALLOWED_ORIGINS = ['exp://*', 'kintaraa://*']
   SECURE_SSL_REDIRECT = True
   ```
2. Configure S3 for voice recordings (or use Render disk)
3. Set `CELERY_BROKER_URL` to production Redis
4. Enable `CHANNEL_LAYERS` with production Redis for WebSocket
5. Deploy to Render.com (backend + managed PostgreSQL + Redis)
6. Run `python manage.py migrate`
7. Run `python manage.py reset_test_accounts` to create test users in prod

**Frontend Deployment**:
1. Update `constants/domains/config/ApiConfig.ts` with production URL
2. Switch `const Flag = false` to use production mode
3. Run `eas build --platform all --profile production`
4. Test production build on device

---

### Day 15-16 — Final Testing & Bug Fixes

**Pre-launch Checklist**:
- [ ] All 3 dashboard flows work on production
- [ ] Messaging works on production
- [ ] Push notifications delivered on iOS + Android
- [ ] No P0 bugs
- [ ] API response times < 500ms
- [ ] Error states handled gracefully (offline, network error)

---

## 8. Testing Strategy

### 8.1 Backend Tests (Target: 60% coverage on critical paths)

**Priority tests to write**:
```python
# apps/incidents/tests/test_api.py
test_create_incident_authenticated()
test_create_incident_unauthenticated_fails()
test_incident_queued_for_dispatcher_on_create()
test_provider_accept_assignment()
test_provider_reject_assignment()
test_dispatcher_can_assign_provider()
test_survivor_cannot_see_others_incidents()

# apps/messaging/tests/test_api.py
test_send_message_creates_conversation()
test_only_participants_can_read_messages()
test_mark_all_read_updates_receipts()
test_push_token_registration()

# apps/authentication/tests/test_api.py
test_login_returns_jwt()
test_logout_blacklists_token()
test_role_based_permissions()
```

### 8.2 Manual Test Plan

**Survivor Flow**:
- [ ] Register with valid email/password
- [ ] Login successfully
- [ ] Create incident report
- [ ] View incident in list
- [ ] See assigned provider
- [ ] Send message to provider
- [ ] Receive push notification on provider reply

**Provider Flow**:
- [ ] Login as provider
- [ ] See assignment notification (bell icon)
- [ ] Accept case assignment
- [ ] Update case status
- [ ] Send message to survivor
- [ ] Receive notification on survivor message

**Dispatcher Flow**:
- [ ] Login as dispatcher → reaches dispatcher dashboard
- [ ] View all pending cases
- [ ] Assign case to provider
- [ ] See provider accepted status with timestamp
- [ ] View system statistics

---

## 9. Risk Mitigation

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Messaging encryption breaks frontend | Low | High | Backend decrypts before serializing — frontend receives plain text |
| WebSocket not supported on Render free tier | Medium | Medium | Fall back to 5s polling (already implemented) |
| Celery tasks fail in production | Medium | Medium | Log + retry config; push notifications are non-blocking |
| Voice upload fails (file too large) | Low | Low | Backend validates size and type |
| Dispatcher routing bug causes confusion | Already exists | Medium | Fix is 30 min — prioritize Day 12 |

### 9.2 Schedule Risks

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Messaging integration takes longer | Medium | Scope to basic send/receive only; skip edit/delete |
| WebSocket setup complex | Medium | Keep 5s polling as fallback |
| Deployment issues | Medium | Deploy early (Day 14), leave 2 days for fixes |

---

## 10. Post-MVP Roadmap

### Immediate Post-MVP (Week 1-2 after launch)

- Monitor error rates + fix P1/P2 bugs
- Implement WebSocket-based messaging (replace REST polling)
- Add evidence file uploads (photos, documents)
- Add appointment scheduling
- Wellbeing tracking features

### Core Features (Month 2)

- Other provider dashboards beyond GBV Rescue for full case management
- Provider performance metrics
- AI-powered provider recommendations
- Geolocation-based provider matching
- Multi-provider coordination on single case

### Platform (Month 3-6)

- App separation: Survivor App + Provider Platform
- Independent deployments
- Optimized bundle sizes
- Role-specific feature sets

---

## 11. Environment Setup (Reference)

### Backend
```bash
cd /home/athooh/Documents/Work/Evarest/kintara-backend

# Start all services
make up          # or: docker-compose up -d

# View logs
make logs

# Django shell
make shell

# Create migrations
make makemigrations

# Apply migrations
make migrate

# Seed/reset test accounts
python manage.py reset_test_accounts

# Start Celery worker
celery -A kintara worker --loglevel=info
```

### Frontend
```bash
cd /home/athooh/Documents/Work/Evarest/kintaraa-app

# Ensure correct Node version
source "$HOME/.nvm/nvm.sh" && nvm use 20

# Start web
npx expo start --web --offline

# Start with tunnel (for mobile testing)
npx expo start --tunnel

# Clear cache
npx expo start -c
```

---

## 12. Key API Contracts

### Messaging (NEW — not in original plan)

**Get conversation for incident:**
```
GET /api/messaging/conversations/?incident_id={uuid}
Authorization: Bearer {token}

Response:
{
  "results": [{
    "id": "uuid",
    "incident": {...},
    "participants": [...],
    "last_message_at": "ISO datetime",
    "is_active": true,
    "unread_count": 3
  }]
}
```

**Send message:**
```
POST /api/messaging/conversations/{id}/send_message/
Authorization: Bearer {token}
Content-Type: application/json
Body: {"content": "message text"}

Response: 201 Created
{
  "id": "uuid",
  "sender": {...},
  "content": "decrypted message text",  // Backend decrypts before responding
  "message_type": "user_message",
  "created_at": "ISO datetime",
  "is_read": false
}
```

**Register push token:**
```
POST /api/messaging/push-token/
Authorization: Bearer {token}
Body: {"token": "ExponentPushToken[...]", "platform": "ios|android|web"}

Response: 200/201 {"success": true, "created": false}
```

**WebSocket (provider real-time):**
```
ws://{host}/ws/providers/?token={jwt}

Inbound: {"type": "ping"}
Outbound: {
  "type": "case_assigned",
  "data": {
    "assignment_id": "uuid",
    "incident_id": "uuid",
    "case_number": "KIN-20260215-001",
    "status": "pending"
  }
}
```

---

## 13. Success Metrics

**MVP Launch Criteria**:
- [ ] Survivor can complete full incident flow (register → report → see assignment → message provider)
- [ ] Dispatcher can login → view all cases → assign providers → monitor response
- [ ] Provider can login → see assigned cases → accept → message survivor
- [ ] Messaging persists in database (no mock data)
- [ ] Push notifications delivered on at least one platform
- [ ] No P0 bugs in core flows
- [ ] API response time < 500ms (p95)
- [ ] Backend deployed to production URL

---

## 14. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 26, 2025 | Initial plan |
| 2.0 | Mar 7, 2026 | Comprehensive update: reflects actual backend (messaging fully implemented), frontend status, remaining tasks, revised timeline |

**Last Updated**: March 7, 2026
**Next Review**: March 14, 2026

---

**Current Phase**: Week 2+ — Core feature integration
**Status**: ~70% complete. Messaging frontend integration is the critical path to MVP.
**Critical Blocker**: Frontend messaging screen must be connected to `/api/messaging/` endpoints.
