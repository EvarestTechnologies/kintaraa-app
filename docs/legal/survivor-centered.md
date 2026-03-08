# Survivor-Centered Design

Survivor-centered design means the platform makes decisions based on what is safest and most useful for the person who has experienced violence — not what is most convenient for providers, administrators, or developers.

This page documents the specific design choices in Kintaraa that reflect this principle.

## Anonymity as a default option

Survivors are not required to identify themselves to use the platform. The registration flow offers an explicit anonymous option. Anonymous sessions:
- Issue a temporary token valid for 24 hours
- Store data for 90 days to allow return access
- Are subject to the same access controls as registered accounts — no provider can see more than they are entitled to see

The mobile app flags anonymous users via `is_anonymous: true` in both the frontend user model and the backend `User` model. This flag persists through the session.

## No forced re-telling

Once a survivor submits a report, the case record is shared with all assigned providers. The survivor does not need to re-explain what happened to each provider separately. The incident description, type, severity, and voice recording (if submitted) are all visible to assigned providers in a single shared record.

## Consent over location

Location data is optional throughout the platform. The `SafetyProvider` requests foreground location permission, but the user can deny it. If denied, the app continues to function. Location is only used to:
- Assist with emergency contact alerts (survivor-triggered)
- Support geographic case routing (planned, not yet implemented)

Location is never passively collected in the background.

## Voice as an alternative to text

Survivors who cannot type — due to literacy barriers, injury, distress, or time pressure — can submit their account as a voice recording. The `Incident` model includes:

```python
voice_recording = models.FileField(
    upload_to='voice_recordings/%Y/%m/%d/', null=True, blank=True
)
voice_recording_duration = models.IntegerField(null=True, blank=True)
voice_transcription = models.TextField(null=True, blank=True)
```

Voice recordings are stored separately from text and can be accessed by assigned providers.

## Emergency access designed for crisis

The emergency flow is designed to work in seconds, not minutes:
- A single button triggers emergency mode
- Haptic feedback confirms activation
- The survivor's primary emergency contact is identified automatically
- A Google Maps link to the survivor's current location is generated and included in the alert

The emergency contact system does not require account creation — contacts are stored locally on the device against the user's ID.

## Biometric authentication protects and enables

Biometric authentication (Face ID, fingerprint) serves two purposes: security and speed. A survivor who needs to access the app quickly in a dangerous situation should not have to type a password. Biometric access provides quick, secure entry.

The biometric check is performed by the device OS. Kintaraa does not store or transmit biometric data.

## Quick exit (planned)

The design documentation references a "quick exit" feature for survivor safety — the ability to immediately exit and disguise the app if the survivor is observed by their abuser. This is standard practice in GBV digital tools.

<!-- TODO: Quick exit is referenced in ARCHITECTURE.md but not yet visible in the current codebase. Implementation status should be confirmed and documented here. -->

## Survivor controls their own data

Survivors can:
- View all their own incident records
- Delete their account (right to erasure — data deletion must be implemented before production)
- Choose whether to share their location
- Choose whether to attach their identity to a report

Survivors cannot:
- Access other survivors' records
- See provider notes marked as internal
- Be identified to other survivors by the platform

## Feedback mechanism (planned)

The platform does not yet have a mechanism for survivors to provide feedback on provider quality or service received. This is a gap — without survivor feedback, provider performance metrics are based only on response time and acceptance rate, not quality of care.

<!-- TODO: Design survivor feedback collection in a way that is safe (not mandatory, not identifiable, not visible to the provider being reviewed) -->

## What survivor-centered design does not yet fully achieve

| Gap | Status |
|---|---|
| End-to-end encrypted messaging | Planned |
| Survivor-controlled data deletion | Planned |
| Quick exit / disguise mode | Planned |
| Feedback on provider quality | Planned |
| Accessibility features (screen reader, high contrast) | Not documented; status unknown |
| Multilingual support | Not in current codebase; required for broad deployment |
