# Our Approach

Kintaraa is built on three principles: put the survivor in control, reduce friction for providers, and let data improve the system over time.

## 1. Survivor-first design

Every design decision starts with the question: does this make things safer and easier for the survivor?

**Anonymous by default.** Survivors can report incidents without creating an account. Anonymous sessions persist for 24 hours; data is retained for 90 days to allow for follow-up if the survivor returns.

**Mobile-first.** The app runs on iOS and Android. It works on low-end devices. It works without a consistent internet connection — reports submitted offline are queued locally and synced automatically when connectivity is restored.

**Voice recording.** Survivors who cannot or prefer not to type can record their account verbally. The platform supports audio upload and transcription.

**Quick exit.** The interface is designed to be exited quickly if a survivor's safety requires it.

**No forced re-telling.** Once a survivor submits a report, all assigned providers see the same case record. The survivor does not need to repeat their story to each provider.

## 2. Intelligent case routing

When a survivor submits an incident report, the platform applies a hybrid assignment model:

- **Urgent and immediate cases** are automatically assigned to the best available GBV rescue provider, selected by current caseload and average response time. The system targets assignment within 15 minutes.
- **Routine cases** enter a dispatcher queue for manual review and assignment.
- **Fallback logic** applies if no provider is available for an urgent case: the system escalates to dispatcher review rather than leaving the case unassigned.

Providers are matched based on:
- Their specialization (healthcare, legal, police, counseling, social, GBV rescue, CHW)
- Current caseload relative to capacity
- Availability status and working hours
- Average response time (tracked per provider)
- Geographic proximity (planned for future release)

## 3. Role-specific interfaces

Providers do not all need the same tools. A police officer managing evidence does not need a counselor's session notes interface. Each of the seven provider types gets a dashboard built for their specific workflow:

```
Healthcare  → Patients, appointments, medical records
Legal       → Cases, court dates, document management
Police      → Evidence logs, investigation reports
Counseling  → Client sessions, therapy resources
Social      → Resource allocation, benefits coordination
GBV Rescue  → Emergency response, hotline, crisis intervention
CHW         → Field visits, outreach, location-based case tracking
```

Role-based access control ensures providers only see cases assigned to them and data relevant to their role.

## 4. Offline-first architecture

Survivors in rural or low-connectivity areas cannot be excluded. The app is built offline-first:

- All submitted data is stored locally on the device (SQLite layer)
- A sync queue tracks pending operations
- When connectivity is restored, data is automatically uploaded to the backend
- Conflict resolution prioritizes server data to ensure provider updates are never overwritten

Sync is transparent to the user: the app shows sync status and retries on failure with exponential backoff.

## 5. Data informs improvement

Every case generates structured data: incident type, severity, time to assignment, provider response time, case outcome. This data — aggregated and anonymized — gives organizations visibility into how their response system is actually performing.

Over time, the platform's recommendation engine can surface patterns: which provider types are overloaded, which incident types correlate with high re-occurrence, which response times correlate with better survivor outcomes.

## What we are not doing

- We are not building a surveillance tool. Location data is optional and only used to help connect survivors to nearby services.
- We are not replacing human judgment. The platform coordinates; providers decide.
- We are not centralizing survivor data in a way that creates a single point of failure or exposure. Access is scoped strictly by role and case assignment.
