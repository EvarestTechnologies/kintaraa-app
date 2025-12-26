# Kintaraa System Architecture

## Executive Summary

This document outlines the recommended production architecture for the Kintaraa GBV support platform, addressing the separation of concerns between survivor-facing mobile apps and provider-facing dashboards.

## Recommended Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Survivor App    │  │  Provider Web    │  │  CHW Mobile  │ │
│  │  (React Native)  │  │  Dashboard       │  │  (Optional)  │ │
│  │  - iOS/Android   │  │  (React/Next.js) │  │  (RN Lite)   │ │
│  │  - Emergency     │  │  - Case Mgmt     │  │  - Field     │ │
│  │  - Reporting     │  │  - Analytics     │  │    Work      │ │
│  │  - Resources     │  │  - Admin Tools   │  │  - Outreach  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│         │                      │                     │          │
└─────────┼──────────────────────┼─────────────────────┼──────────┘
          │                      │                     │
          └──────────────────────┴─────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API Gateway         │
                    │  - Auth/Rate Limiting   │
                    │  - Load Balancing       │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┴─────────────────────┐
          │                                            │
┌─────────▼────────┐                        ┌─────────▼────────┐
│  REST API        │                        │  WebSocket       │
│  (Django/FastAPI)│                        │  (Real-time)     │
│  - CRUD Ops      │                        │  - Notifications │
│  - Business Logic│                        │  - Chat          │
│  - Validation    │                        │  - Status Update │
└─────────┬────────┘                        └─────────┬────────┘
          │                                            │
          └──────────────────────┬─────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Backend Services      │
                    │  - Auth Service         │
                    │  - Incident Service     │
                    │  - Provider Routing     │
                    │  - Notification Service │
                    │  - File Storage Service │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼─────────────────────┐
          │                      │                     │
┌─────────▼────────┐  ┌─────────▼────────┐  ┌────────▼────────┐
│  PostgreSQL      │  │  Redis Cache     │  │  S3/Storage     │
│  - User Data     │  │  - Sessions      │  │  - Evidence     │
│  - Cases         │  │  - Real-time     │  │  - Documents    │
│  - Messages      │  │  - Queue         │  │  - Photos       │
└──────────────────┘  └──────────────────┘  └─────────────────┘
```

## Key Architectural Decision: Mobile vs Web for Providers

### ✅ RECOMMENDED: Hybrid Approach

**Survivor App: Mobile-Only (React Native)**

- **Why:** Survivors need immediate access, emergency features, location services
- **Platform:** iOS + Android native apps
- **Key Features:**
  - Emergency SOS button
  - Anonymous reporting
  - Offline capability
  - Biometric security
  - Location services
  - Quick exit feature
  - Voice recording

**Provider Dashboards: Primarily Web-Based**

| Provider Type          | Primary Platform                   | Mobile Support            | Reasoning                                                                    |
| ---------------------- | ---------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| **Police**             | Web (Desktop)                      | View-only mobile          | Complex evidence management, report writing, integration with police systems |
| **Legal Aid**          | Web (Desktop)                      | View-only mobile          | Document management, case law research, court filing systems                 |
| **Healthcare**         | Web (Primary) + Mobile (Secondary) | Full mobile for field     | Desktop for detailed records, mobile for appointments/consultations          |
| **Counseling**         | Web (Primary) + Mobile (Secondary) | Session notes mobile      | Desktop for treatment plans, mobile for session notes                        |
| **Social Services**    | Web (Desktop)                      | View-only mobile          | Resource management, benefit coordination, extensive paperwork               |
| **GBV Rescue Centers** | Web (Primary) + Mobile (Secondary) | Emergency response mobile | Desktop for coordination, mobile for emergency response teams                |
| **CHW**                | Mobile (Primary) + Web (Reports)   | Full mobile               | Field work, community outreach, location-based services                      |

### Why Web for Most Provider Dashboards?

1. **Screen Real Estate:** Complex case management needs larger screens
2. **Multi-tasking:** Providers juggle multiple systems, browser tabs work better
3. **Integration:** Easier to integrate with existing institutional systems
4. **Data Entry:** Extensive form filling is easier on desktop
5. **Security:** Institutional devices often have better security controls
6. **Cost:** One web app vs maintaining multiple native apps
7. **Updates:** Web apps update instantly, no app store approval needed

### Why Mobile for Survivors?

1. **Accessibility:** Many survivors don't have consistent computer access
2. **Privacy:** Easier to use discreetly on personal device
3. **Emergency:** Immediate access in crisis situations
4. **Notifications:** Push notifications for urgent updates
5. **Location:** GPS for emergency services, safe locations
6. **Biometrics:** Face ID/fingerprint for quick secure access
7. **Offline:** Can work without internet in some areas

## Recommended System Architecture

### Phase 1: MVP (3-6 months)

```
Survivor Mobile App (Current) → Backend API → Provider Web Dashboard
```

**Components:**

1. **Survivor Mobile App** (React Native - already built)

   - Polish existing features
   - Remove provider dashboards
   - Focus on survivor UX
   - Add offline support
   - Implement security features

2. **Backend API** (New - Django/FastAPI)

   - User authentication (JWT)
   - Incident management
   - Provider routing/assignment
   - Real-time notifications
   - File uploads
   - PostgreSQL database

3. **Provider Web Dashboard** (New - React/Next.js)
   - Unified dashboard for all provider types
   - Role-based access control
   - Case management interface
   - Real-time updates
   - Analytics and reporting
   - Document management

### Phase 2: Enhanced (6-12 months)

```
Survivor App → Backend → Provider Web + CHW Mobile + Admin Portal
```

**New Components:** 4. **CHW Mobile App** (React Native - lightweight)

- Stripped-down version for field workers
- Offline-first architecture
- Location tracking
- Quick case notes
- Referral management

5. **Admin Portal** (Web)
   - System configuration
   - User management
   - Analytics dashboard
   - Audit logs

### Phase 3: Scale (12+ months)

```
Multi-region deployment + AI features + Advanced integrations
```

## Data Flow Architecture

### Survivor Reports Incident

```
1. Survivor opens mobile app
2. Fills out incident report (with optional anonymity)
3. Mobile app → POST /api/incidents
4. Backend validates and stores in database
5. Backend triggers provider routing algorithm
6. Backend creates provider assignments
7. Backend sends push notifications to assigned providers
8. Provider Web Dashboard receives WebSocket notification
9. Provider opens case in web browser
10. Provider accepts/declines assignment
11. Backend updates case status
12. Mobile app receives status update via WebSocket/push notification
```

### Real-time Communication Flow

```
┌─────────────┐                  ┌─────────────┐
│  Survivor   │◄────────────────►│   Backend   │
│  Mobile App │   WebSocket      │  WebSocket  │
└─────────────┘                  │   Server    │
                                 │             │
┌─────────────┐                  │             │
│  Provider   │◄────────────────►│             │
│  Web App    │   WebSocket      │             │
└─────────────┘                  └─────────────┘

- Real-time chat messages
- Case status updates
- Emergency alerts
- Assignment notifications
```

## Mobile App Offline Storage & Syncing Strategy

### ✅ Critical Decision: NO Separate Mobile Backend

**The mobile app communicates DIRECTLY with the main backend API.**

There is **NO intermediate backend** for the mobile app. All offline storage happens on the device, and syncing happens directly with the main backend when internet is available.

**Why no separate mobile backend?**

- ❌ Adds unnecessary complexity and cost
- ❌ Creates data consistency problems
- ❌ Doubles infrastructure requirements
- ❌ Slower to develop and maintain
- ✅ Modern frameworks handle offline/sync natively

### Three-Layer Storage Architecture

```
┌─────────────────────────────────────────────────────────┐
│      SURVIVOR'S PHONE (Works 100% Offline)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ LAYER 1: SQLite Database (Permanent Storage)     │ │
│  │                                                    │ │
│  │  Purpose: Store ALL app data locally              │ │
│  │  Location: Phone's internal storage               │ │
│  │  Capacity: ~500MB typical usage                   │ │
│  │  Technology: WatermelonDB (SQLite wrapper)        │ │
│  │                                                    │ │
│  │  What's Stored:                                    │ │
│  │  ✓ Incident reports                                │ │
│  │  ✓ Chat messages                                   │ │
│  │  ✓ Safety plans                                    │ │
│  │  ✓ Emergency contacts                              │ │
│  │  ✓ Provider responses                              │ │
│  │  ✓ Sync queue (pending operations)                │ │
│  │                                                    │ │
│  │  Each record tracks:                               │ │
│  │  • Local ID (UUID generated on device)            │ │
│  │  • Server ID (null until synced)                  │ │
│  │  • Sync Status (pending/syncing/synced)           │ │
│  │  • Timestamps (created/updated)                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ LAYER 2: React Query Cache (Fast Access)         │ │
│  │                                                    │ │
│  │  Purpose: Temporary in-memory cache               │ │
│  │  Location: Phone's RAM                             │ │
│  │  Capacity: ~50MB                                   │ │
│  │                                                    │ │
│  │  Features:                                         │ │
│  │  ✓ Instant data access                             │ │
│  │  ✓ Automatic cache invalidation                   │ │
│  │  ✓ Optimistic UI updates                          │ │
│  │  ✓ Background refetching                          │ │
│  │  ✓ Cleared when app closes                        │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ LAYER 3: File System (Media Storage)             │ │
│  │                                                    │ │
│  │  Purpose: Store photos, audio, documents          │ │
│  │  Location: App's private directory                │ │
│  │  Capacity: Limited by phone storage               │ │
│  │  Technology: Expo FileSystem                      │ │
│  │                                                    │ │
│  │  What's Stored:                                    │ │
│  │  ✓ Evidence photos                                 │ │
│  │  ✓ Audio recordings                                │ │
│  │  ✓ Document attachments                           │ │
│  │  ✓ Files remain until uploaded                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│         ↓ SYNCS WITH (when internet available) ↓      │
└─────────┼───────────────────────────────────────┼──────┘
          │                                       │
          │         HTTP/WebSocket                │
          │                                       │
┌─────────▼───────────────────────────────────────▼──────┐
│              MAIN BACKEND (Cloud Server)               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │  PostgreSQL     │  │    Redis    │  │   AWS S3 │  │
│  │  (Permanent DB) │  │   (Cache)   │  │  (Files) │  │
│  │                 │  │             │  │          │  │
│  │  All user data  │  │  Sessions   │  │  Photos  │  │
│  │  All incidents  │  │  Real-time  │  │  Audio   │  │
│  │  All messages   │  │  Job queue  │  │  Docs    │  │
│  └─────────────────┘  └─────────────┘  └──────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### How Syncing Works: Step-by-Step

#### Step 1: Survivor Reports Incident (OFFLINE)

```
User fills out report → No internet connection

┌──────────────────────────────────┐
│  1. Generate local UUID          │
│     id: "local-uuid-12345"       │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  2. Save to SQLite Database      │
│     • serverId: null             │
│     • syncStatus: "pending"      │
│     • createdAt: 2024-12-10...   │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  3. Save photos to File System   │
│     /pending/local-uuid-12345/   │
│     • photo1.jpg                 │
│     • photo2.jpg                 │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  4. Add to Sync Queue            │
│     • type: "create_incident"    │
│     • localId: "local-uuid..."   │
│     • priority: "high"           │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  5. Show success to user         │
│     "Report saved! Will sync     │
│      when you're online."        │
└──────────────────────────────────┘
```

**Key Point:** User can submit unlimited reports offline. Everything is stored locally and queued for sync.

#### Step 2: Phone Detects Internet (AUTO-SYNC)

```
Network becomes available → App detects connection

┌────────────────────────────────────────────────┐
│  Network Detection Service (Always Running)    │
│  • Monitors WiFi/cellular connection           │
│  • Triggers sync when online detected          │
│  • Also polls every 30 seconds if online       │
└────────────────┬───────────────────────────────┘
                 │
                 │ INTERNET AVAILABLE
                 ▼
┌────────────────────────────────────────────────┐
│  Sync Service Starts (Background Process)      │
└────────────────┬───────────────────────────────┘
                 │
        ┌────────┴────────┬───────────────────┐
        │                 │                   │
        ▼                 ▼                   ▼
┌───────────────┐  ┌──────────────┐  ┌────────────────┐
│ Step 1:       │  │ Step 2:      │  │ Step 3:        │
│ Sync Data     │  │ Upload Files │  │ Pull Updates   │
└───────────────┘  └──────────────┘  └────────────────┘
```

**Step 1: Sync Data to Server**

```
For each pending record in SQLite:

1. Mark as "syncing" (prevent duplicate uploads)

2. Send to backend API
   POST /api/incidents
   Body: { type, description, location... }

3. Backend responds with server ID
   Response: { id: "incident-789", ... }

4. Update local SQLite
   • serverId: "incident-789"
   • syncStatus: "synced"
   • Mark as synchronized

If sync fails:
   • Reset syncStatus to "pending"
   • Will retry on next sync cycle
   • User data remains safe locally
```

**Step 2: Upload Files**

```
For each incident that was just synced:

1. Find associated files in File System
   /pending/local-uuid-12345/photo1.jpg

2. Upload to backend
   POST /api/incidents/evidence
   • Backend stores in S3
   • Returns file URL

3. Delete local copy (save phone storage)
   • Only after successful upload
   • Keep until confirmed by server
```

**Step 3: Pull Server Updates**

```
Check if provider has responded or case status changed:

1. Get last sync timestamp from storage
   lastSync: "2024-12-10T10:30:00Z"

2. Ask server for updates since then
   GET /api/incidents/updates?since=2024-12-10T10:30:00Z

3. Server returns changes
   • Case status updated: "assigned"
   • New message from provider
   • Assignment information

4. Update local SQLite with server data
   • Merge changes into local database
   • Update timestamps
   • Trigger UI refresh

5. Save new sync timestamp
   lastSync: "2024-12-10T12:45:00Z"
```

#### Step 3: Real-Time Updates (ONLINE)

```
When phone is online, WebSocket provides instant updates

┌─────────────────────────────────────────────────┐
│  WebSocket Connection (Real-time Channel)       │
│  wss://api.kintaraa.com                         │
└────────────────┬────────────────────────────────┘
                 │
                 │ Provider responds to case
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Server pushes update via WebSocket             │
│  Event: "incident.updated"                      │
│  Data: {                                        │
│    incidentId: "incident-789"                   │
│    status: "in_progress"                        │
│    assignedProvider: "Dr. Smith"                │
│  }                                              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Mobile app receives update                     │
│  1. Update SQLite with new status               │
│  2. Invalidate React Query cache                │
│  3. UI automatically refreshes                  │
│  4. Show push notification to user              │
└─────────────────────────────────────────────────┘
```

### Sync Strategy Details

#### Automatic Sync Triggers

```
Sync happens automatically in these scenarios:

1. Network State Change
   Offline → Online = Immediate sync

2. Periodic Sync
   Every 30 seconds when online

3. App Foreground
   User opens app = Check for updates

4. Manual Trigger
   Pull-to-refresh = Force sync

5. After Creating Data
   Submit report = Try sync immediately
```

#### Conflict Resolution Strategy

```
What happens if data conflicts?

Scenario: User edits safety plan offline,
          but server also has updates

Resolution: LAST-WRITE-WINS (Server Priority)

┌─────────────────────────────────────┐
│  Local Change (Offline):            │
│  Safety plan updated at 10:30 AM    │
└──────────────┬──────────────────────┘
               │
               │  Phone comes online
               │  Sync detects conflict
               │
               ▼
┌─────────────────────────────────────┐
│  Server Change (Online):             │
│  Safety plan updated at 10:45 AM    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Resolution: Keep server version    │
│  Reason: Provider may have added    │
│          critical information       │
└─────────────────────────────────────┘

For GBV app: Server data takes priority
to ensure provider updates are never lost
```

#### Handling Sync Failures

```
What if sync fails multiple times?

Attempt 1: Immediate retry
↓ Fails
Wait 5 seconds

Attempt 2: Retry
↓ Fails
Wait 30 seconds

Attempt 3: Retry
↓ Fails
Wait 5 minutes

Attempt 4+: Keep trying on next sync cycle
           Data remains safe in SQLite
           User can continue using app offline

User sees: "Some data hasn't synced yet.
           Will keep trying automatically."
```

### Data Storage Breakdown

| Storage Type     | Purpose          | Location      | Syncs?           | Persists? | Size Limit      |
| ---------------- | ---------------- | ------------- | ---------------- | --------- | --------------- |
| **SQLite**       | All app data     | Phone storage | ✅ Yes → Backend | ✅ Yes    | ~500MB          |
| **AsyncStorage** | Settings, tokens | Phone storage | ❌ No            | ✅ Yes    | ~6MB            |
| **File System**  | Media files      | Phone storage | ✅ Yes → S3      | ✅ Yes    | Phone dependent |
| **React Query**  | API cache        | RAM           | ✅ Auto          | ❌ No     | ~50MB           |

### Key Architectural Benefits

#### 1. Offline-First Design

- Survivor can report incidents anytime, anywhere
- No frustration from "no internet" errors
- Critical for emergency situations
- Data always safe on device

#### 2. Automatic Background Sync

- User never has to manually sync
- Happens transparently in background
- Intelligent retry on failures
- Respects battery and data limits

#### 3. Real-Time When Possible

- WebSocket for instant updates when online
- Push notifications for urgent events
- Falls back to polling if WebSocket fails
- Seamless online/offline transitions

#### 4. Data Integrity

- Local UUID prevents duplicate submissions
- Server authoritative for conflicts
- Sync queue prevents data loss
- Retry logic handles network issues

#### 5. Security During Sync

- All sync uses HTTPS encryption
- JWT authentication required
- Files encrypted in transit
- Optional SQLite encryption at rest

### Backend Requirements for Sync

The main backend API must support:

**1. Incremental Sync Endpoint**

```
GET /api/incidents/updates?since=<timestamp>

Returns only changes since last sync
Reduces data transfer and sync time
```

**2. Batch Upload Support**

```
POST /api/sync/batch

Accepts multiple records at once
More efficient than individual uploads
Reduces number of API calls
```

**3. Conflict Detection**

```
Include "updatedAt" in all responses
Backend compares timestamps
Returns 409 Conflict if needed
Client handles resolution
```

**4. Idempotency**

```
Same request can be sent multiple times
Server prevents duplicate creation
Uses client-provided UUID
Safe for retry logic
```

### Performance Expectations

| Operation          | Offline | Online (Good Network) | Online (Slow Network) |
| ------------------ | ------- | --------------------- | --------------------- |
| Submit Report      | 0.1s    | 1-2s                  | 3-5s                  |
| View Reports       | 0.05s   | 0.2s                  | 0.5s                  |
| Send Message       | 0.1s    | 0.5s                  | 2s                    |
| Sync 10 Reports    | N/A     | 3-5s                  | 10-15s                |
| Sync with 5 Photos | N/A     | 5-10s                 | 20-30s                |
| Cold App Start     | 1-2s    | 2-3s                  | 2-3s                  |
| Pull New Updates   | N/A     | 0.5s                  | 1-2s                  |

### User Experience During Sync

**Visual Indicators:**

```
When Data is Syncing:
┌────────────────────────────────┐
│  📤 Syncing...                 │
│  [Progress bar]                │
│  2 of 5 reports uploaded       │
└────────────────────────────────┘

When Offline:
┌────────────────────────────────┐
│  📴 Offline Mode               │
│  Your data is safe and will    │
│  sync when you're online       │
└────────────────────────────────┘

When Synced:
┌────────────────────────────────┐
│  ✅ All data synced            │
│  Last updated: 2 minutes ago   │
└────────────────────────────────┘

When Sync Fails:
┌────────────────────────────────┐
│  ⚠️ Some data not synced       │
│  Will retry automatically      │
│  [Retry Now] button            │
└────────────────────────────────┘
```

### Summary: Why This Architecture Works

✅ **No Separate Backend Needed**

- SQLite runs on the phone, not a server
- Direct communication with main API
- Simpler, cheaper, faster

✅ **Works Completely Offline**

- All features available without internet
- Critical for survivor safety
- Data never lost

✅ **Automatic Syncing**

- Transparent to user
- Happens in background
- Handles failures gracefully

✅ **Scalable & Maintainable**

- Well-established patterns
- Proven libraries (WatermelonDB)
- Industry standard approach

✅ **Secure & Private**

- Data encrypted in transit
- Local storage can be encrypted
- JWT authentication
- HTTPS only

## Technology Stack Recommendation

### Survivor Mobile App (Current)

```
- React Native 0.81+
- Expo SDK 54+
- TypeScript
- React Query
- AsyncStorage
- Expo Location
- Expo Local Authentication
```

### Backend API (To Build)

```python
# Option 1: Django + Django REST Framework (Recommended)
- Django 5.x
- Django REST Framework
- Django Channels (WebSocket)
- PostgreSQL 15+
- Redis (caching, real-time)
- Celery (background tasks)
- AWS S3 / MinIO (file storage)

# Option 2: FastAPI (Modern, Fast)
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- WebSockets built-in
```

### Provider Web Dashboard (To Build)

```typescript
// Option 1: Next.js (Recommended)
- Next.js 14+ (React 18+)
- TypeScript
- TanStack Query
- TailwindCSS
- NextAuth.js
- Socket.io-client
- Recharts (analytics)

// Option 2: Vite + React
- Vite
- React 18+
- React Router
- Similar stack
```

### Database & Infrastructure

```
- PostgreSQL 15+ (Primary database)
- Redis (Cache, sessions, real-time queue)
- AWS S3 / MinIO (File storage)
- AWS CloudFront / Cloudflare (CDN)
- Docker + Kubernetes (Deployment)
- GitHub Actions (CI/CD)
```

### WebSocket Events

```javascript
// Client → Server
{
  type: 'message.send',
  incidentId: 'incident-123',
  content: 'Hello...',
  senderId: 'user-456'
}

{
  type: 'status.update',
  incidentId: 'incident-123',
  status: 'in_progress'
}

// Server → Client
{
  type: 'message.received',
  incidentId: 'incident-123',
  message: { ... }
}

{
  type: 'assignment.new',
  assignment: { ... },
  urgency: 'high'
}

{
  type: 'notification.push',
  notification: { ... }
}
```

## Security Considerations

### Survivor App Security

- Biometric authentication
- End-to-end encryption for sensitive data
- Quick exit/disguise feature
- No local storage of sensitive evidence
- Location data optional and encrypted
- Anonymous mode support

### Provider Dashboard Security

- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Audit logging for all actions
- Session timeout after inactivity
- IP whitelisting (optional for police/legal)
- Data encryption at rest and in transit

### Backend Security

- JWT with refresh tokens
- Rate limiting
- SQL injection prevention (ORM)
- XSS/CSRF protection
- Input validation and sanitization
- Regular security audits
- GDPR/privacy compliance

## Deployment Architecture

### Recommended Infrastructure

```
                    ┌──────────────┐
                    │   CloudFlare │
                    │   CDN + WAF   │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │ Load Balancer│
                    └───────┬──────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
    │  API Server  │ │  API      │ │  WebSocket  │
    │  (Django)    │ │  Server   │ │  Server     │
    │  Container 1 │ │  Cont. 2  │ │  (Node.js)  │
    └───────┬──────┘ └─────┬─────┘ └──────┬──────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼──────┐ ┌────▼────┐ ┌───────▼──────┐
    │  PostgreSQL  │ │  Redis  │ │   AWS S3     │
    │  (Primary)   │ │ (Cache) │ │ (Files)      │
    └──────────────┘ └─────────┘ └──────────────┘
```

### Environment Setup

```bash
# Development
- Local Docker Compose
- SQLite/PostgreSQL
- Local file storage

# Staging
- AWS/Azure/GCP
- Single region
- Managed services

# Production
- Multi-region deployment
- Auto-scaling
- CDN
- Database replication
- Automated backups
```

## Migration Strategy: Current App → Production Architecture

### Step 1: Extract Survivor App (Week 1-2)

```
Current Mobile App → Split → Survivor App (clean) + Provider Code (archive)
```

- Remove all provider-specific code from mobile app
- Keep only survivor features
- Simplify navigation
- Enhance security features

### Step 2: Build Backend MVP (Month 1-2)

```
- Set up Django + PostgreSQL
- Implement authentication
- Create incident CRUD APIs
- Basic provider routing
- File upload system
```

### Step 3: Build Provider Web Dashboard (Month 2-3)

```
- Next.js setup
- Authentication integration
- Case management UI
- Provider-specific views
- Real-time WebSocket integration
```

### Step 4: Connect Everything (Month 3-4)

```
- Mobile app → Backend integration
- Web dashboard → Backend integration
- WebSocket real-time features
- Push notifications
- Testing and QA
```

### Step 5: Deploy and Iterate (Month 4+)

```
- Staging deployment
- User acceptance testing
- Production deployment
- Monitor and optimize
- Add CHW mobile later
```

## Conclusion

### ✅ Recommended Approach

1. **Survivor App:** Mobile-only (React Native) - keep and refine current codebase
2. **Provider Dashboards:** Web-based (Next.js) - build new from scratch
3. **CHW Workers:** Mobile app later (lightweight React Native)
4. **Backend:** Django + PostgreSQL + Redis - build from scratch
5. **Architecture:** Traditional client-server with WebSocket for real-time

### Why This Works

- **Survivors get best mobile experience** with native features
- **Providers get best desktop experience** for complex workflows
- **Cost-effective:** One web app vs 7 mobile apps
- **Faster development:** Web is easier to iterate
- **Better security:** Institutional devices for sensitive data
- **Easier integration:** Web integrates better with existing systems

### Next Steps

1. **Create backend API specification** (OpenAPI/Swagger)
2. **Design provider web dashboard wireframes**
3. **Set up backend development environment**
4. **Refactor mobile app to remove provider features**
5. **Start backend MVP development**

This architecture follows industry best practices for crisis support systems and scales effectively from MVP to enterprise deployment.
