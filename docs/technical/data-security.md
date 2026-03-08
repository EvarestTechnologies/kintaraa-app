# Data Security

This page describes how the Kintaraa platform protects survivor and provider data — at rest, in transit, and in access.

## Authentication

### Mobile app

The mobile app uses token-based authentication. On login, the server issues a short-lived access token and a longer-lived refresh token. The access token is used for all API requests. When it expires, the refresh token is used to obtain a new one silently, without requiring the user to log in again.

Logging out invalidates the refresh token server-side, preventing further use even if the token itself is not yet expired.

Tokens are stored securely on the device using encrypted local storage.

### Biometric authentication

Face ID (iOS) and fingerprint (Android) are supported as a login method. The biometric check is performed entirely by the device operating system — Kintaraa never receives or stores biometric data. A successful biometric check unlocks the stored credentials to authenticate with the server.

### Password policy

Passwords must meet minimum complexity requirements including minimum length, uppercase and lowercase characters, numbers, and special characters.

## Authorization

Access to data is enforced at the API layer, not just the user interface. This means:

- Survivors can only access their own incident records
- Providers can only access cases that have been explicitly assigned to them
- Dispatchers have read access to all cases for routing purposes
- Administrators have full access, with all actions subject to audit logging (planned)

Provider specialization is enforced at the account level — a healthcare provider cannot access legal case records, even if they are assigned to the same incident.

## Data in transit

All communication between the mobile app and the backend uses HTTPS/TLS. Plaintext HTTP is not permitted.

Sensitive values such as authentication tokens and passwords are never written to logs.

## Data at rest

### Backend database

All incident records, user accounts, case assignments, and messages are stored in a managed relational database. Database-level encryption at rest is enabled at the infrastructure level.

Field-level encryption for particularly sensitive content — counseling session notes, journal entries, and medical records — is planned for a future release.

### Evidence and media files

Voice recordings and evidence photos uploaded by survivors are stored in a private cloud storage bucket. Files are not publicly accessible. Access is controlled via time-limited signed URLs (planned — in active development).

### On-device storage

The mobile app stores data locally to support offline use. This storage is organized in three layers:

| Layer | Purpose | Encryption status |
|---|---|---|
| Secure key store | Auth tokens, sensitive settings | Encrypted |
| Local database | Offline incident records and sync queue | Planned |
| File system | Voice recordings, photos pending upload | OS-level protection only |

Full local database encryption is planned before production deployment.

## What is in place

| Control | Status |
|---|---|
| HTTPS for all API traffic | Yes |
| Token-based authentication with server-side invalidation | Yes |
| Biometric authentication (no biometric data stored) | Yes |
| Role-based access control enforced at the API level | Yes |
| Password complexity enforcement | Yes |
| Anonymous reporting (no identity required) | Yes |
| Sensitive values redacted from server logs | Yes |

## What is in progress before production

| Control | Priority |
|---|---|
| Full local database encryption on device | Critical |
| Time-limited signed URLs for evidence files | Critical |
| End-to-end message encryption | High |
| Field-level encryption for counseling notes, journals, and medical records | High |
| File type and virus scanning before storage | High |
| Rate limiting on authentication endpoints | High |
| Multi-factor authentication for provider accounts | Medium |
| Formal security penetration test | Required before launch |

## Configuration and secrets management

All sensitive configuration (database credentials, storage keys, push notification keys, encryption keys) is managed through environment variables. No secrets are hardcoded in the application. Deployment environments use secret management tooling appropriate to the hosting provider.

## Incident response

A formal incident response procedure — covering breach detection, notification obligations, and data preservation — must be defined in partnership with the deploying organization before the platform goes live with real survivor data.
