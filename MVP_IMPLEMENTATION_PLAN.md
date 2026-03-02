# Kintaraa MVP Implementation Plan
## 3-Dashboard System: Survivor, Dispatch Center & GBV Rescue

**Original Target Date**: January 15, 2026
**Days Available**: 20 days (December 26, 2025 - January 15, 2026)
**Last Updated**: March 1, 2026 (progress audit)
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

### 1.1 Current State (as of March 1, 2026)

**Frontend (React Native)**:
- ✅ 98% complete UI/UX implementation
- ✅ Auth, incidents, provider assignment, dispatcher — all real API
- ✅ Messaging — real API (REST + WebSocket hybrid)
- ✅ Provider real-time updates — WebSocket (ws/providers/) + 60s polling fallback
- ❌ Notifications — in-memory mock, no backend registration
- ❌ Wellbeing (mood/sleep/journal) — AsyncStorage/mock only
- ❌ Safety plans — AsyncStorage/mock only
- ❌ Provider routing service — still client-side algorithm (providerRouting.ts)
- ❌ Zero automated test coverage

**Backend (Django)**:
- ✅ 100% auth system
- ✅ 100% incident reporting (CRUD, case numbers, voice upload, hybrid assignment)
- ✅ 100% provider assignment (CaseAssignment, accept/reject, HybridAssignmentService)
- ✅ 100% dispatcher dashboard API
- ✅ 100% messaging system (Conversation, Message, CaseActivity, PushToken models + full REST API + WebSocket consumers)
- ✅ WebSocket infrastructure (Django Channels, Redis, ASGI, ws/conversations/<uuid>/, ws/providers/)
- ✅ Push notification infrastructure (PushToken model, Celery task, Expo Push API)
- ✅ Signal handlers (auto-create conversation on case acceptance, push WS events to provider)
- ✅ Message encryption services
- ❌ GBVRescueResponse model + endpoints — NOT implemented
- ❌ Separate Notifications app — not created (push infra lives in messaging app)
- ❌ sanitize_user_input() — stub only
- ❌ log_security_event() — stub only
- ❌ FCM (pyfcm) — replaced by Expo Push API approach
- ❌ Evidence file uploads — not implemented
- ❌ Zero test coverage

### 1.2 Gap Analysis (Updated March 1, 2026)

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| User Authentication | ✅ Complete | ✅ Complete | ✅ Done |
| Incident Reporting | ✅ Complete | ✅ Complete | ✅ Done |
| Case Assignment (provider) | ✅ Real API | ✅ Complete | ✅ Done |
| Dispatcher Dashboard | ✅ Real API | ✅ Complete | ✅ Done |
| Hybrid Assignment Logic | ✅ Backend-driven | ✅ Complete | ✅ Done |
| Messaging (REST) | ✅ services/messaging.ts | ✅ ConversationViewSet + MessageViewSet | ✅ Done |
| Messaging (WebSocket) | ✅ useChatSocket.ts | ✅ ConversationConsumer | ✅ Done |
| Provider WS Notifications | ✅ useProviderWebSocket.ts | ✅ ProviderConsumer + signals | ✅ Done |
| Push Notifications | ❌ Not registering tokens | ✅ PushToken + Celery + Expo API | ⚠️ Backend ready, frontend pending |
| GBV Rescue Features | ✅ UI ready | ❌ GBVRescueResponse missing | ❌ Backend needed |
| Wellbeing Tracking | ❌ Mock only | ❌ No models | ❌ Post-MVP |
| Safety Plans | ❌ Mock only | ❌ No models | ❌ Post-MVP |
| Evidence File Upload | ✅ UI ready | ❌ No API | ❌ Backend needed |
| Tests | ❌ None | ❌ None | ❌ Critical gap |

### 1.3 MVP Strategy (Revised)

**Decision**: Keep monolith. **Core MVP is functionally complete** for auth, incidents, assignment, dispatch, and messaging. Two gaps remain before true MVP: push notifications (frontend token registration) and GBVRescueResponse model.

---

## 2. Critical Issues Found

### 2.1 Security Issues

| Issue | Severity | Status |
|-------|----------|--------|
| AllowAny Permissions | 🔴 CRITICAL | ✅ Fixed — IsAuthenticated default + role permissions |
| No Rate Limiting | 🔴 CRITICAL | ✅ Fixed — DRF throttling configured |
| Weak Secret Key | 🟡 HIGH | ✅ Fixed — .env-driven |
| No Input Sanitization | 🟡 HIGH | ❌ sanitize_user_input() is still a stub |
| File Upload No Validation | 🟡 HIGH | ⚠️ Voice upload has basic checks; evidence uploads not yet built |

### 2.2 Backend Missing Features (Remaining)

| Feature | Status | Required For |
|---------|--------|--------------|
| GBVRescueResponse model | ❌ Missing | GBV Rescue dashboard response logging |
| GBV rescue endpoints | ❌ Missing | Response CRUD, dashboard stats |
| Evidence file upload API | ❌ Missing | Evidence management |
| Frontend push token registration | ❌ Missing | Background push notifications |
| Test suite (all apps) | ❌ Empty | Quality assurance |
| sanitize_user_input() | ❌ Stub | XSS protection |

### 2.3 Frontend Issues (Remaining)

| Issue | Severity | Status |
|-------|----------|--------|
| Push token not registered with backend | 🟡 HIGH | ❌ Open |
| providerRouting.ts client-side algorithm | 🟡 HIGH | ⚠️ Backend does real routing; service used for fallback only |
| Wellbeing/Safety Plans mock data | 🟢 LOW (post-MVP) | ❌ Open (deferred) |
| Zero automated tests | 🟡 HIGH | ❌ Open |

---

## 3. MVP Scope Definition

### 3.1 In-Scope Features

#### **Survivor Dashboard** (Core Flow)

```
1. Registration/Login
   → Email + password  ✅ Done
   → Biometric unlock  ✅ Done

2. Create Incident Report
   → Incident type, description, location, severity  ✅ Done
   → Voice recording upload                          ✅ Done (transcription TODO)
   → Auto-assigns to GBV Rescue (urgent)             ✅ Done

3. View My Cases
   → List all incidents, filter by status            ✅ Done
   → View case details + assigned provider info      ✅ Done

4. Message Provider
   → Send/receive text messages                      ✅ Done
   → WebSocket real-time + REST fallback             ✅ Done
   → Conversation auto-created on case acceptance    ✅ Done

5. Track Case Status
   → See status updates                              ✅ Done
   → Push notifications on status changes            ⚠️ Backend ready, frontend pending
```

#### **GBV Center Dispatch Dashboard** (Command Center)

```
1. Login as dispatcher         ✅ Done
2. View ALL incidents          ✅ Done
3. Unassigned urgent cases     ✅ Done
4. Assign/reassign cases       ✅ Done
5. View provider availability  ✅ Done
6. Override auto-assignments   ✅ Done
7. Dashboard statistics        ✅ Done
```

#### **GBV Rescue Dashboard** (First Responder)

```
1. Login as provider                      ✅ Done
2. View assigned cases                    ✅ Done (WS push + 60s fallback)
3. Accept/reject case assignment          ✅ Done
4. Update case status                     ✅ Done
5. Message survivor                       ✅ Done
6. Log response (GBVRescueResponse)       ❌ Backend model missing
7. Dashboard stats                        ❌ Backend endpoint missing
```

### 3.2 MVP User Stories

**Survivor User Stories**:
- **US-1**: ✅ Register and login
- **US-2**: ✅ Report an incident
- **US-3**: ✅ See reported cases and track progress
- **US-4**: ✅ Message assigned provider (WebSocket + REST fallback — COMPLETED March 1)
- **US-5**: ⚠️ Receive push notifications — backend infrastructure done; frontend must register token

**Dispatcher User Stories**:
- **US-6**: ✅ Login to GBV Center command dashboard
- **US-7**: ✅ See ALL incoming cases
- **US-8**: ✅ View unassigned urgent cases
- **US-9**: ✅ Assign cases to available providers
- **US-10**: ✅ Reassign cases
- **US-11**: ✅ See provider availability
- **US-12**: ✅ Override auto-assignments
- **US-13**: ✅ Monitor active cases

**GBV Rescue Provider User Stories**:
- **US-14**: ✅ Login to provider dashboard
- **US-15**: ✅ See assigned cases (real-time via WebSocket)
- **US-16**: ✅ Accept case assignment
- **US-17**: ✅ Update case status
- **US-18**: ✅ Message survivors (WebSocket + REST fallback — COMPLETED March 1)

### 3.3 MVP Success Criteria (Current Status)

**Technical**:
- ✅ All core API endpoints return real data (auth, incidents, assignment, dispatch, messaging)
- ✅ Frontend successfully calls backend APIs
- ✅ User can complete full incident reporting flow
- ✅ Provider can accept and manage cases
- ✅ Messaging works (WebSocket primary + REST fallback)
- ⚠️ Push notifications — infrastructure done, frontend token registration pending
- ✅ No critical security vulnerabilities (AllowAny fixed, rate limiting added)
- ⚠️ API response time < 500ms — not benchmarked yet

**Functional**:
- ✅ Survivor: register → login → report incident → see assignment → message provider
- ✅ Dispatcher: login → view all cases → assign to provider → monitor response
- ✅ Provider: login → see assigned cases (real-time) → accept case → update status → message survivor
- ⚠️ Push notifications pending (US-5)
- ✅ Case status flows correctly (new → assigned → in_progress → completed)
- ✅ Hybrid assignment works (auto-assign urgent, manual for routine)

---

## 4. Architecture Decision

### 4.1 Keep Monolith for MVP ✅

**Status**: Confirmed — single codebase, single deployment. No separation done or planned for MVP.

### 4.2 API Strategy (Actual, as built)

**Base URL**: `https://api-kintara.onrender.com/api` (no `/v1/` prefix — original plan was wrong)
**Local dev**: `http://<dynamic_ip>:8000/api`

**Authentication**: JWT Bearer tokens (SimpleJWT with refresh + blacklist rotation)

**Messaging**: WebSocket primary + REST fallback (replaced original plan of HTTP polling)
```
WS:   ws(s)://<host>/ws/conversations/<conversation_id>/?token=<JWT>
WS:   ws(s)://<host>/ws/providers/?token=<JWT>     ← provider assignment events
REST: GET/POST /api/messaging/conversations/
REST: GET/POST /api/messaging/conversations/<id>/messages/
```

**URL Prefixes (actual)**:
```
/api/auth/        → authentication
/api/incidents/   → incidents + assignments
/api/providers/   → provider profiles + available providers
/api/dispatch/    → dispatcher dashboard
/api/messaging/   → conversations + messages + push tokens
```

---

## 5. Implementation Phases

### Phase 1: Foundation & Security (Days 1-3) — ✅ COMPLETE

| Task | Status |
|------|--------|
| Fix AllowAny permissions → IsAuthenticated | ✅ Done |
| Add rate limiting (DRF throttling) | ✅ Done |
| Enforce strong SECRET_KEY via .env | ✅ Done |
| Set up PostgreSQL locally | ✅ Done |
| Configure Redis | ✅ Done |
| Frontend API client with real backend URL | ✅ Done |
| JWT token storage + refresh logic | ✅ Done |
| Test authentication flow end-to-end | ✅ Done |

---

### Phase 2: Dispatch Dashboard & Provider Assignment (Days 4-8) — ✅ COMPLETE

| Task | Status |
|------|--------|
| CaseAssignment model | ✅ Done |
| HybridAssignmentService (urgent auto / routine manual) | ✅ Done |
| CaseAssignment accept/reject/status endpoints | ✅ Done |
| Dispatcher role + IsDispatcher permission | ✅ Done |
| ProviderProfile model (capacity, response time, availability) | ✅ Done |
| Dispatch Dashboard API (GET /api/dispatch/dashboard/, cases, providers) | ✅ Done |
| Dispatch assign/reassign endpoints | ✅ Done |
| Frontend: services/assignments.ts | ✅ Done |
| Frontend: ProviderContext real API + 60s polling fallback | ✅ Done |
| Frontend: Dispatcher dashboard screens | ✅ Done |
| Frontend: Provider accept/reject UI | ✅ Done |
| Seed management command (test users + providers) | ✅ Done |

---

### Phase 3: Messaging System (Days 9-11) — ✅ COMPLETE

> **Note**: Exceeded MVP plan — implemented full WebSocket messaging (not just HTTP polling).

**Backend (completed)**:

| Task | Status |
|------|--------|
| Conversation model (OneToOne with Incident, ManyToMany participants) | ✅ Done |
| Message model (content, message_type, encryption-ready) | ✅ Done |
| MessageReadReceipt model | ✅ Done |
| CaseActivity timeline model | ✅ Done |
| PushToken model (Expo push token per user) | ✅ Done |
| ConversationViewSet (list, detail, auto-create for existing accepted cases) | ✅ Done |
| MessageViewSet (list, create, edit, delete, mark-read) | ✅ Done |
| PushTokenView (POST /api/messaging/push-token/) | ✅ Done |
| ConversationConsumer (WebSocket ws/conversations/<uuid>/) | ✅ Done |
| ProviderConsumer (WebSocket ws/providers/) | ✅ Done |
| Signal: auto-create conversation + add provider on case acceptance | ✅ Done |
| Signal: push case_assigned / case_updated WS events to provider | ✅ Done |
| Message encryption services | ✅ Done |
| Activity logging service | ✅ Done |
| Push notification Celery task (Expo Push API) | ✅ Done |
| WebSocket routing (kintara/routing.py) | ✅ Done |
| ASGI configured (kintara/asgi.py) | ✅ Done |
| Registered at /api/messaging/ | ✅ Done |

**Frontend (completed)**:

| Task | Status |
|------|--------|
| services/messaging.ts (getConversationForIncident, getConversationMessages, sendMessageRest, push token) | ✅ Done |
| hooks/useChatSocket.ts (WS client: send, receive, typing, mark-read) | ✅ Done |
| hooks/useProviderWebSocket.ts (WS client: case_assigned, case_updated events with exponential backoff) | ✅ Done |
| app/messages/[id].tsx (real API: WS primary + REST fallback) | ✅ Done |
| IncidentProvider.tsx: addMessage uses real API | ✅ Done |
| ProviderContext.tsx: useProviderWebSocket hook integrated, 60s fallback | ✅ Done |

---

### Phase 4: Notifications (Days 12-13) — ⚠️ PARTIALLY COMPLETE

| Task | Backend | Frontend |
|------|---------|----------|
| PushToken model | ✅ Done | — |
| POST /api/messaging/push-token/ endpoint | ✅ Done | — |
| Celery task: send_push_notification (Expo Push API) | ✅ Done | — |
| Register Expo push token on login | — | ❌ Not done |
| Handle incoming notifications (foreground/background) | — | ❌ Not done |
| In-app notification list | — | ❌ Mock only (notificationService.ts) |

> **Note**: Backend chose Expo Push API over pyfcm/FCM. FCM is no longer the approach.
> Frontend still needs to call POST /api/messaging/push-token/ after login.

---

### Phase 5: GBV Rescue Dashboard (Days 14-15) — ❌ INCOMPLETE

| Task | Status | Notes |
|------|--------|-------|
| GBVRescueResponse model | ❌ Missing | Not in providers/models.py |
| POST /api/gbv-rescue/responses/ | ❌ Missing | |
| GET /api/gbv-rescue/responses/ | ❌ Missing | |
| GET /api/gbv-rescue/dashboard-stats/ | ❌ Missing | |
| Frontend: response logging form | ❌ Not connected | |
| Frontend: dashboard statistics | ❌ Not connected | |

> **Core provider flow (accept/reject/status/message) works end-to-end.**
> Only GBV-rescue-specific response logging is missing.

---

### Phase 6: Testing & Bug Fixes (Days 16-18) — ❌ NOT STARTED

| Task | Status |
|------|--------|
| Backend model tests | ❌ All test files empty |
| Backend API tests | ❌ All test files empty |
| Frontend component tests | ❌ None |
| Manual test checklist | ⚠️ Partial (flows work, not formally documented) |
| Load testing | ❌ Not done |

---

### Phase 7: Deployment & Polish (Day 19) — ⚠️ PARTIAL

| Task | Status |
|------|--------|
| Dockerfile configured | ✅ Done |
| docker-compose.yml (Redis + Django + Celery) | ✅ Done |
| Makefile for local dev | ✅ Done |
| Backend deploy to Render | ⚠️ URL configured (api-kintara.onrender.com), status unknown |
| S3 for voice recordings | ❌ Not done |
| Sentry error monitoring | ❌ Not done |
| Swagger/OpenAPI docs | ✅ Done (/swagger/, /redoc/) |

---

### Phase 8: Launch Preparation (Day 20) — ❌ NOT STARTED

Pre-launch checklist remains open pending test suite + GBVRescueResponse model.

---

## 6. Detailed Task Breakdown

### 6.1 Backend Remaining Tasks

#### **P0 - Must Complete Before MVP Launch**

| Task | Notes |
|------|-------|
| GBVRescueResponse model | `apps/providers/models.py` |
| GBV rescue CRUD endpoints | `apps/providers/views.py` |
| GBV rescue dashboard stats | `GET /api/gbv-rescue/dashboard-stats/` |
| Frontend: register Expo push token after login | `providers/AuthProvider.tsx` |

#### **P1 - Important**

| Task | Notes |
|------|-------|
| Implement sanitize_user_input() | Currently stub in serializers |
| Write backend API tests (P0 paths) | All test files are empty |
| Voice transcription | TODO comment in incident view |
| Evidence file upload API | Not implemented |

#### **P2 - Post-MVP**

| Task | Notes |
|------|-------|
| Wellbeing models + API | Deferred to post-MVP |
| Safety plans models + API | Deferred to post-MVP |
| Load testing | 100 concurrent users target |

---

### 6.2 Frontend Remaining Tasks

#### **P0 - Must Complete Before MVP Launch**

| Task | Files |
|------|-------|
| Register Expo push token after login | `providers/AuthProvider.tsx` |
| Handle foreground/background push notifications | Expo notifications handler |
| Connect GBV rescue response logging form | `dashboards/gbv_rescue/` |
| Connect GBV rescue dashboard stats to real API | `dashboards/gbv_rescue/` |

#### **P1 - Important**

| Task | Files |
|------|-------|
| Remove providerRouting.ts (replace with backend routing) | `services/providerRouting.ts` |
| Replace notificationService.ts in-memory mock | `services/notificationService.ts` |
| Write component tests | `__tests__/` |

---

## 7. Testing Strategy

### 7.1 Manual Test Plan (Current Priority)

**Survivor Flow**:
- [x] Register with valid email/password
- [x] Login successfully
- [x] Create incident report
- [x] View incident in list
- [x] See assigned provider
- [x] Send/receive message (WebSocket)
- [ ] Receive push notification (pending token registration)

**Provider Flow**:
- [x] Login as provider
- [x] View assigned cases (real-time via WebSocket)
- [x] Accept case assignment
- [x] Update case status
- [x] Send/receive message
- [ ] Log GBV response (pending model)

**Dispatcher Flow**:
- [x] Login as dispatcher
- [x] View all cases
- [x] Manually assign provider to case
- [x] View dashboard statistics

### 7.2 Automated Test Coverage Target

**Target**: 80% on critical paths (auth, incidents, assignment, messaging)
**Current**: 0% — all test files empty

---

## 8. Risk Mitigation

| Risk | Status |
|------|--------|
| Token refresh bugs | ✅ Mitigated — auto-refresh on 401 in api.ts |
| WebSocket connection drops | ✅ Mitigated — exponential backoff + 60s REST fallback |
| Messaging backend not ready | ✅ Resolved — fully implemented |
| GBVRescueResponse missing | 🔴 Open — blocks Phase 5 completion |
| Zero test coverage | 🔴 Open — quality risk |
| Push notifications not wired | 🟡 Open — backend ready, frontend pending |

---

## 9. Post-MVP Roadmap

### 9.1 Immediate (Next Sprint)

- [ ] **GBVRescueResponse model + endpoints** (finish Phase 5)
- [ ] **Frontend push token registration** (finish Phase 4)
- [ ] **Backend test suite** (Phase 6)
- [ ] **Manual end-to-end smoke test** (all 3 dashboards)
- [ ] **Deploy backend to Render + verify** (Phase 7)

### 9.2 Short-Term (Weeks 3-4)

- [ ] Wellbeing tracking backend models + API
- [ ] Safety plans backend models + API
- [ ] Evidence file uploads (S3)
- [ ] Voice transcription (currently TODO)
- [ ] Sentry error monitoring

### 9.3 Long-term (Months 4-6)

- [ ] App separation (Survivor App + Provider Platform)
- [ ] Independent deployments
- [ ] Optimized bundle sizes
- [ ] All 6 provider types fully connected (healthcare, legal, police, counseling, social, CHW)

---

## 10. Environment Setup

### 10.1 Backend Setup

```bash
cd kintara-backend

# Option A: Docker (recommended — includes Redis + Celery)
make up

# Option B: Manual
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit with secrets
python manage.py migrate
python manage.py seed_test_data  # creates test users + providers
python manage.py runserver
```

### 10.2 Frontend Setup

```bash
cd kintaraa-app
npm install --force   # --force needed for React 19 peer deps
npx expo start        # scan QR in Expo Go for device testing
```

---

## 11. Key API Endpoints (Actual — no /v1/ prefix)

**Authentication**:
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/token/refresh/
POST   /api/auth/logout/
GET    /api/auth/me/
```

**Incidents**:
```
GET    /api/incidents/
POST   /api/incidents/
GET    /api/incidents/<id>/
PATCH  /api/incidents/<id>/
GET    /api/incidents/stats/
POST   /api/incidents/upload-voice/
```

**Provider Cases**:
```
GET    /api/providers/assigned-cases/
GET    /api/providers/available/?provider_type=<type>
PATCH  /api/incidents/<id>/accept/
PATCH  /api/incidents/<id>/reject/
```

**Dispatch**:
```
GET    /api/dispatch/dashboard/
GET    /api/dispatch/cases/
POST   /api/dispatch/cases/<id>/assign/
POST   /api/dispatch/cases/<id>/reassign/
GET    /api/dispatch/providers/
GET    /api/dispatch/analytics/
```

**Messaging**:
```
GET    /api/messaging/conversations/
GET    /api/messaging/conversations/<id>/
GET    /api/messaging/conversations/<id>/messages/
POST   /api/messaging/conversations/<id>/messages/
POST   /api/messaging/conversations/<id>/messages/<id>/read/
POST   /api/messaging/conversations/<id>/mark-all-read/
POST   /api/messaging/push-token/
```

**WebSocket**:
```
ws(s)://<host>/ws/conversations/<conversation_id>/?token=<JWT>
ws(s)://<host>/ws/providers/?token=<JWT>
```

---

## 12. Success Metrics (Current Status)

| Criterion | Status |
|-----------|--------|
| Survivor can complete full incident flow | ✅ Done |
| Provider can accept and manage cases | ✅ Done |
| Messaging works (survivor ↔ provider) | ✅ Done |
| Dispatcher can assign and monitor cases | ✅ Done |
| Real-time case notifications for providers | ✅ Done (WebSocket) |
| Push notifications delivered | ⚠️ Backend ready, frontend pending |
| GBV Rescue response logging | ❌ Backend model missing |
| No P0 bugs | ⚠️ Untested (no test suite) |
| 80%+ test coverage on critical paths | ❌ 0% currently |
| API response time < 500ms (p95) | ⚠️ Not benchmarked |

---

**Document Version**: 2.0
**Originally Created**: December 26, 2025
**Last Updated**: March 1, 2026
**Next Review**: After GBVRescueResponse + push token registration complete
