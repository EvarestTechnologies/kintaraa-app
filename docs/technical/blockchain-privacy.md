# Privacy Architecture

Kintaraa does not use blockchain technology. This page documents the privacy architecture that protects survivor data across the platform.

## Anonymous reporting

Survivors are not required to create an account or disclose their identity to use the platform. Anonymous sessions allow a survivor to submit a report and track their case without registering.

Anonymous session data is retained for 90 days, giving survivors a window to return to their case. After that period, data is eligible for deletion.

Anonymous users are subject to the same access controls as registered users. No provider can see more information about an anonymous survivor than they can about a registered one.

## Data isolation

Every data access is scoped by role and case assignment. The platform enforces this at the API level, meaning it cannot be bypassed from the user interface.

A provider assigned to a case can access that case's record. They cannot query other survivors' records, other providers' caseloads, or cases they have not been assigned to. This is enforced server-side on every request.

## Sensitive data categories

The following categories of data receive heightened protection:

| Data category | Examples | Protection approach |
|---|---|---|
| Incident narratives | Survivor descriptions | Access-controlled by assignment |
| Voice recordings | Audio of survivor account | Private storage, access-controlled |
| Location data | GPS coordinates | Optional collection; access-controlled |
| Counseling session notes | Therapist records | Field-level encryption planned |
| Medical records | Healthcare provider records | Field-level encryption planned |
| Survivor journals | Private notes | Field-level encryption planned |

## On-device privacy

The mobile app stores data locally to support offline use. Sensitive data items are encrypted before being written to local device storage. The encryption implementation will use AES encryption via the device's secure cryptography APIs before production deployment.

## Session and token lifetimes

| Parameter | Value |
|---|---|
| Access token lifetime | 30 minutes |
| Refresh token lifetime | 7 days |
| Biometric session timeout | 5 minutes |
| Anonymous session duration | 24 hours |
| Anonymous data retention | 90 days |

These values can be adjusted per deployment to meet organizational policy requirements.

## What is not yet implemented

| Privacy control | Status |
|---|---|
| End-to-end message encryption | Planned |
| Full local database encryption on device | Planned |
| Field-level encryption for sensitive records | Planned |
| Time-limited URLs for evidence file access | Planned |
| Automated data deletion on survivor request | Planned |
| Formal privacy impact assessment | Required before production |
