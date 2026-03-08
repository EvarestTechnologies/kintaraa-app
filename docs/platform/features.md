# Features

This page lists the features available in the current platform, organized by user type.

## Survivor features

### Incident reporting
- Structured 5-step report form covering incident type, date, location, description, severity, and services needed
- Support for 6 incident types: physical violence, sexual violence, emotional abuse, economic abuse, online harassment, femicide/attempted
- Voice recording input — survivors can speak their account instead of typing
- Optional anonymity — no account or real name required
- Offline submission — reports saved locally and synced when internet is available

### Case tracking
- View all submitted incidents with current status
- Case number system: `KIN-YYYYMMDD-NNN`
- Status visibility: new → assigned → in progress → completed → closed
- View which providers are assigned to each case

### Communication
- In-app messaging with assigned providers, scoped to each case
- Real-time delivery when online; queued delivery when offline

### Safety tools
- Personal safety plan creation and storage
- Emergency contacts management (with primary contact designation)
- Emergency mode — triggers haptic alert, shows location-based emergency link, prompts call to primary contact
- Location services integration (optional; used only with consent)

### Wellbeing tracking
- Mood logging with historical view
- Private journal entries (stored locally; planned for encrypted backend persistence)
- Sleep tracking
- Progress tracking for recovery milestones

### Resource discovery
- AI-powered service recommendations based on incident type and severity
- Links to local and national support resources
- Learning resources library

### Security
- Biometric authentication (Face ID on iOS, fingerprint on Android)
- Anonymous session support
- Encrypted local storage for sensitive fields

---

## Provider features

All providers share a common set of dashboard capabilities, with type-specific modules layered on top.

### Common to all providers
- Dashboard overview with case statistics and pending assignments
- Case list: all assigned cases with status and priority
- Accept / decline new case assignments
- In-app messaging with survivors and other providers on the case
- Profile management
- Notification system for new assignments and case updates

### Healthcare providers
- Patient list — survivors with assigned medical cases
- Appointment scheduling and management
- Medical records creation and access
- Consultation forms

### Legal providers
- Legal case management (case type: civil, criminal, protective order)
- Court date tracking
- Document management
- Case status tracking (filed, pending, active, closed)

### Law enforcement
- Evidence logging with chain-of-custody tracking
- Case reports
- Investigation status management

### Counselors / therapists
- Client session notes (flagged for encryption at rest)
- Session scheduling (individual, group, family)
- Therapy resource library
- Client progress tracking

### Social services
- Resource allocation tracking (shelter, financial, food, childcare)
- Benefit coordination
- Client case management

### GBV rescue centers
- Emergency response logging
- Hotline management
- Crisis intervention case tracking
- Response type classification (hotline, field, shelter)

### Community health workers (CHW)
- Field visit logging with GPS coordinates
- Outreach case tracking
- Referral management
- Location-based case assignment view

---

## Dispatcher features

Dispatchers are a distinct role responsible for manual case assignment and queue management.

- View all incoming incidents pending review
- See provider availability across all types: current caseload, max caseload, response time, availability status
- Assign one or more providers to a case
- Override or reassign existing assignments
- Monitor active case statuses

---

## Platform-level features

| Feature | Status |
|---|---|
| Offline-first data storage | Implemented |
| Automatic background sync | Implemented |
| Conflict resolution (server-priority) | Implemented |
| JWT authentication with refresh | Implemented |
| Biometric authentication | Implemented |
| Anonymous reporting | Implemented |
| Role-based access control | Implemented |
| AI-powered case recommendations | Implemented (frontend) |
| AI-powered provider scoring | Implemented (frontend) |
| Real-time WebSocket messaging | Infrastructure ready; backend integration in progress |
| Push notifications (FCM) | Backend configured; frontend integration in progress |
| File uploads to S3 | Backend configured; frontend integration in progress |
| Provider web dashboard | Planned |
| Admin analytics dashboard | Planned |
| Audit logging | Planned |
| End-to-end encryption | Planned |
