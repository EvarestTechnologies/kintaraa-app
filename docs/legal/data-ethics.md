# Data Ethics

This page states the platform's ethical commitments around data, and documents where those commitments are currently met, partially met, or not yet met.

## Core principles

### 1. Data minimization

We collect only the data needed to deliver services. Survivors are not asked for information beyond what is needed to route their case to appropriate providers.

**How it is applied:**
- Location is optional — not required to submit a report
- Identity is optional — anonymous reporting is supported
- Only the fields needed for case routing and service delivery are in the incident model

**Gap:** The incident model collects `voice_recording` and `voice_transcription`. Transcriptions processed by third-party services may be subject to those services' data practices. This must be reviewed if external speech-to-text APIs are used in production.

### 2. Purpose limitation

Data collected for incident response is not used for any other purpose.

**How it is applied:**
- No analytics tracking of survivor behavior in the current codebase
- JWT tokens do not include data beyond user ID, role, and provider type
- No third-party advertising or analytics SDKs are included

**Gap:** Sentry error monitoring is listed as a planned integration (`SENTRY_DSN` in the environment variable template). Sentry can capture request data in error reports. Its configuration must be reviewed to ensure survivor data is not included in error payloads before production.

### 3. Access only for authorized parties

Survivor data is accessible only to:
- The survivor themselves
- Providers assigned to their case
- Dispatchers (for case routing purposes)
- Administrators (with audit logging — planned)

**How it is applied:**
- Django API enforces provider-scoped queries; providers query only their assigned cases
- Role-based middleware prevents cross-role data access
- Anonymous users are not identifiable across sessions

**Gap:** Audit logging for admin access is planned but not yet implemented. Until it is, there is no accountability trail for admin data access.

### 4. Informed use

Survivors should know what data is collected, how it is used, and who can see it. They should not need to read a legal document to understand the basics.

**Gap:** No in-app privacy notice or consent flow is currently implemented. Before the platform collects real survivor data, it must include:
- A plain-language explanation of what is collected
- Who can see it
- How long it is retained
- How to request deletion

### 5. No re-identification

Aggregate data used for reporting or impact measurement must not be traceable back to individual survivors.

**Gap:** Aggregation and anonymization for reporting are not yet implemented. Before publishing any outcome data, a formal anonymization review is required.

---

## Sensitive data categories

The following categories of data are handled by the platform and require heightened protection:

| Data category | Examples | Current protection | Required additional protection |
|---|---|---|---|
| Incident narratives | Survivor descriptions of violence | Role-scoped API access | Encryption at rest |
| Voice recordings | Audio of survivor account | S3 private bucket | Signed URL expiry, content encryption |
| Location data | GPS coordinates in incident report | Optional collection; stored as JSON | Separate encryption, strict access log |
| Counseling notes | Therapist session records (planned) | Not yet in system | Field-level encryption required |
| Medical records | Healthcare provider records (planned) | Not yet in system | Field-level encryption required |
| Journal entries | Survivor private notes (planned) | Not yet in system | Field-level encryption required |

---

## Data retention

| Data type | Retention period | Current implementation |
|---|---|---|
| Anonymous user sessions | 24 hours (session) / 90 days (data) | Configured in constants |
| Incident records | Not yet defined | No automated deletion |
| Evidence files (S3) | Not yet defined | No lifecycle policy configured |
| JWT refresh tokens (blacklisted) | 7 days | Managed by simplejwt |
| Audit logs | Not yet defined | Not yet implemented |

Retention policies for incident records and evidence files must be defined in consultation with partner organizations and legal counsel before production deployment.

---

## Third-party data processors

| Service | Purpose | Data shared | Risk |
|---|---|---|---|
| AWS S3 | Evidence file storage | Voice recordings, photos | Bucket is private; encryption at rest required |
| Firebase FCM | Push notifications | Device token, notification payload | Do not include incident content in notification body |
| Sentry | Error monitoring (planned) | Error context, possibly request data | Must configure to exclude PII from error reports |
| Redis | Session cache | Session tokens | Scoped to server; no survivor data should be cached |

---

## Ethical red lines

The following uses of the platform are prohibited regardless of who requests them:

- Sharing survivor identity or incident details with perpetrators or their representatives
- Using survivor data to build profiles for law enforcement without explicit survivor consent
- Exporting survivor data to third parties for research without individual informed consent and ethics approval
- Using the platform to monitor survivors (e.g., tracking their location without their knowledge)
- Operating the platform in a jurisdiction where reporting GBV is criminalized, without survivor-specific legal protections in place

<!-- TODO: Develop a formal data ethics review process for deployment in new jurisdictions -->
