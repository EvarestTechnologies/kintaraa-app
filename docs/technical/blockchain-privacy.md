# Blockchain & Privacy

<!-- TODO: No blockchain components were found in the codebase. This page covers the privacy architecture and data isolation model actually implemented. If blockchain features are planned, this page should be updated with specifics. -->

Kintaraa does not currently use blockchain technology. This page documents the privacy architecture that protects survivor data across the platform.

## Privacy by design

The platform applies privacy-by-design at multiple levels: the data model, access control, local storage, and transmission.

### Anonymous reporting

Survivors can submit incident reports without creating an account. The system issues a temporary session token valid for 24 hours. Anonymous user records are retained for 90 days to allow survivors to return to their case, after which they are eligible for deletion.

The `User` model has an `is_anonymous` flag:

```python
# apps/authentication/models.py
is_anonymous = models.BooleanField(
    default=False,
    help_text="Whether this is an anonymous user account"
)
```

Anonymous users' data is treated with the same access controls as registered users — no provider can see more than they are assigned to see.

### Data isolation by role

Every data access in the system is scoped by role and case assignment. Providers can only retrieve cases assigned to them. The Django permission layer enforces this at the API level, not just the UI level.

A provider querying their assigned cases sees only:

```
GET /api/providers/assigned-cases/
→ Returns: only CaseAssignment records where provider == request.user
```

No provider can enumerate other providers' caseloads or access survivor records outside their assignments.

### Field-level sensitivity

Certain data fields are flagged as requiring heightened protection:

| Field | Model | Sensitivity | Current handling |
|---|---|---|---|
| Voice transcription | Incident | High | Stored in database; encryption planned |
| Session notes | CounselingSession (planned) | High | Field-level encryption planned |
| Journal entries | JournalEntry (planned) | High | Field-level encryption planned |
| Location coordinates | Incident (JSONField) | Medium | Access-controlled; not exposed to non-assigned providers |
| Medical records | MedicalRecord (planned) | High | Role-scoped; encryption planned |

### Local storage encryption

On the mobile device, the `EncryptedStorage` service wraps `AsyncStorage` with a configurable encryption layer. Sensitive storage keys (defined in `SENSITIVE_STORAGE_KEYS`) are Base64-encoded before being written to local storage.

```typescript
// services/encryptedStorage.ts
private shouldEncrypt(key: string): boolean {
  if (!offlineConfig.get('features').encryption_enabled) {
    return false;
  }
  return SENSITIVE_STORAGE_KEYS.includes(key as any);
}
```

**Current limitation:** The encryption implementation uses Base64 encoding, which is encoding, not encryption. The codebase explicitly notes this is a development placeholder and documents the intended production implementation using `expo-crypto` with AES. This must be upgraded before production deployment.

### Data in transit

All communication between the mobile app and backend API uses HTTPS. JWT tokens are passed in request headers and are never logged in plaintext (the logging layer redacts token values from response logs).

### Offline data

When a survivor submits a report offline, the data is stored locally on their device. It is not uploaded until the device reconnects. This means:
- Sensitive data lives on the survivor's device until sync
- If the device is compromised before sync, data could be exposed
- Production deployment should evaluate enabling SQLite-level encryption for the local store

## What is not yet implemented

| Privacy control | Status |
|---|---|
| End-to-end message encryption | Planned |
| AES encryption for local sensitive storage | Planned (Base64 placeholder in place) |
| Field-level database encryption (journal, session notes) | Planned |
| Signed S3 URLs with expiration for evidence files | Planned |
| Data deletion on survivor request (right to erasure) | Planned |
| Formal privacy impact assessment | Not started |

## Session and token management

| Parameter | Value |
|---|---|
| JWT access token lifetime | 30 minutes |
| JWT refresh token lifetime | 7 days |
| Biometric session timeout | 5 minutes |
| Max biometric attempts | 3 |
| Anonymous session duration | 24 hours |
| Anonymous data retention | 90 days |

These values are defined in `apps/authentication/constants.py` and can be adjusted per deployment.
