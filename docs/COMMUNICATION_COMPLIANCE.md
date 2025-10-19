# Communication System - Privacy & Compliance Documentation

## Overview

The Kintaraa GBV Support App implements a comprehensive communication system that enables healthcare providers, police officers, and other service providers to communicate with survivors via SMS and voice calls. This document outlines the privacy safeguards, security measures, and compliance considerations.

---

## 1. Communication Features

### SMS Messaging
- **Purpose**: Send appointment reminders, follow-up messages, and status updates to survivors
- **Channels**: Twilio API, Africa's Talking API (Kenya-specific)
- **Message Length**: Maximum 500 characters
- **Templates**: 6 pre-defined templates (appointment, follow-up, emergency, general, status update, support)
- **Storage**: All messages logged locally and synced to backend

### Voice Calls
- **Purpose**: Direct communication between providers and survivors
- **Channels**: Twilio Voice API, Device phone dialer (fallback)
- **Call Logging**: Duration, timestamp, status tracked
- **Privacy**: No call recording; metadata only

---

## 2. Privacy Safeguards

### Data Minimization
✅ **Only essential data is collected**:
- Case ID (for context)
- Recipient phone number (required for delivery)
- Message content (user-generated)
- Timestamp (for audit trail)
- Status (delivery confirmation)

✅ **Not collected**:
- Message content is NOT analyzed or processed beyond delivery
- No call recordings
- No location tracking during communication
- No behavioral analytics

### Sensitive Data Handling
✅ **Phone Number Protection**:
- Phone numbers stored with case records only
- Not exposed in public logs or error messages
- Masked in non-essential UI (**** **** 5678)

✅ **Message Content**:
- Templates designed to avoid sensitive details
- Variable substitution limits exposure of case details
- No personally identifiable information (PII) in default templates
- Messages stored encrypted at rest (backend)

✅ **Survivor Identity Protection**:
- Templates use generic references ("survivor", "client")
- Case numbers used instead of names where possible
- No survivor details visible in communication history to unauthorized users

---

## 3. Security Measures

### Authentication & Authorization
✅ **Role-Based Access Control (RBAC)**:
- Only authenticated providers can send messages
- Messages tied to specific case assignments
- Cross-case communication blocked
- Audit logs track all communication attempts

✅ **API Security**:
- HTTPS only for all API calls
- API keys stored in secure environment variables (never in code)
- Token-based authentication for backend communication
- Rate limiting to prevent abuse (Twilio/Africa's Talking built-in)

### Data Transmission
✅ **Encryption in Transit**:
- TLS 1.2+ for all API communications
- Expo Secure Store for local API key storage (when applicable)
- No plain-text transmission of sensitive data

✅ **Encryption at Rest**:
- AsyncStorage for local logs (device-encrypted on iOS/Android)
- Backend database encryption (Django + PostgreSQL)
- Message content encrypted in database

### Input Validation
✅ **Sanitization**:
- Phone numbers validated against E.164 format
- Message content sanitized to prevent injection attacks
- Template variables validated before substitution
- Case ID validation before communication

---

## 4. Compliance Considerations

### Kenya Data Protection Act (KDPA) 2019
✅ **Lawful Processing**:
- Communication serves legitimate interest (survivor support)
- Informed consent obtained during case intake
- Clear purpose limitation (appointment coordination, case updates)

✅ **Data Subject Rights**:
- Survivors can request communication history
- Right to opt-out of non-essential communications
- Data retention policy: 7 years (aligned with medical records)

✅ **Data Controller Responsibilities**:
- Ministry of Health/Police Service as data controllers
- Kintaraa app as data processor
- Data Processing Agreement (DPA) required for deployment

### HIPAA Considerations (if applicable)
⚠️ **Not HIPAA-compliant by default** - Additional measures needed for US deployment:
- Business Associate Agreement (BAA) with Twilio/Africa's Talking
- Enhanced encryption (AES-256)
- Comprehensive audit logs
- Patient consent for electronic communication

### Best Practices for GBV Support
✅ **Trauma-Informed Communication**:
- Templates reviewed for sensitivity and clarity
- No triggering language in default templates
- Option to customize messages before sending
- Professional, supportive tone

✅ **Survivor Safety**:
- Messages designed to be discreet (no obvious GBV references)
- Option for providers to use generic appointment language
- No SMS sent without provider review (except automated reminders)
- Call logs don't expose case details to device call history

---

## 5. Communication Logs

### What is Logged
All communications generate a log entry with:
```typescript
{
  id: string;                  // Unique log ID
  caseId: string;              // Associated case
  type: 'sms' | 'call';       // Communication type
  direction: 'outbound';       // Always outbound for provider-initiated
  recipientId: string;         // User ID (survivor/other provider)
  phoneNumber: string;         // Recipient phone (E.164 format)
  status: string;              // sent, delivered, failed, completed, etc.
  timestamp: string;           // ISO 8601 timestamp
  content?: string;            // Message text (SMS only)
  duration?: number;           // Call duration in seconds
  templateId?: string;         // Template used (if any)
  provider: string;            // Provider who initiated
}
```

### Log Retention
- **Local Storage**: 90 days (then purged from device)
- **Backend Storage**: 7 years (compliance with medical record retention)
- **Audit Logs**: Permanent (administrative/security purposes)

### Access Control
- **Providers**: Can view logs for their assigned cases only
- **Supervisors**: Can view all logs for their department
- **System Admins**: Full access for audit and compliance
- **Survivors**: Can request their communication history via provider

---

## 6. Incident Response

### Privacy Breach Protocol
If unauthorized access to communication logs occurs:

1. **Immediate Actions**:
   - Disable compromised API keys
   - Revoke affected user sessions
   - Lock down affected case records

2. **Investigation**:
   - Review audit logs for unauthorized access
   - Identify scope of data exposure
   - Document incident timeline

3. **Notification**:
   - Notify Data Protection Officer within 24 hours
   - Notify affected survivors within 72 hours (KDPA requirement)
   - Notify Office of the Data Protection Commissioner if high risk

4. **Remediation**:
   - Patch security vulnerabilities
   - Enhance monitoring/logging
   - Conduct staff re-training

---

## 7. User Consent & Transparency

### Consent Collection
✅ **During Case Intake**:
- Survivors informed about communication methods
- Explicit consent for SMS/calls collected
- Option to specify preferred contact method
- Consent documented in case record

### Transparency
✅ **Communication History**:
- Providers can show survivors their message history
- All sent messages visible in Communication History UI
- Timestamps and delivery status clearly displayed

✅ **Opt-Out**:
- Survivors can opt-out of automated reminders
- Emergency communications exempt from opt-out
- Opt-out preference stored in case record

---

## 8. Testing & Validation

### Security Testing
✅ **Completed**:
- Input validation tests (phone format, message length)
- SQL injection prevention (parameterized queries)
- XSS prevention (content sanitization)
- Authentication/authorization tests

⏳ **Pending Backend Integration**:
- End-to-end encryption testing
- API rate limiting validation
- Penetration testing
- Audit log completeness verification

### Privacy Testing
✅ **Completed**:
- PII minimization in templates
- Phone number masking in UI
- Case isolation (no cross-case communication)
- Error messages don't leak sensitive data

---

## 9. Configuration & Deployment

### Environment Variables (Required)
```bash
# Twilio (Primary - International)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Africa's Talking (Kenya-specific)
AFRICAS_TALKING_USERNAME=kintaraa
AFRICAS_TALKING_API_KEY=xxxxxxxxxxxxx
AFRICAS_TALKING_SENDER_ID=KINTARAA

# API Configuration
COMMUNICATIONS_API_URL=https://api.kintaraa.org/communications
API_TIMEOUT_MS=30000
```

### Pre-Deployment Checklist
- [ ] API keys configured in secure environment
- [ ] Backend endpoints deployed and tested
- [ ] Twilio/Africa's Talking accounts verified
- [ ] Phone numbers purchased/registered
- [ ] Database encryption enabled
- [ ] Audit logging configured
- [ ] Data Protection Officer assigned
- [ ] Privacy policy updated
- [ ] User consent forms prepared
- [ ] Staff training completed

---

## 10. Monitoring & Audit

### Metrics to Track
- **Delivery Rate**: % of SMS successfully delivered
- **Failure Rate**: % of failed communications (by reason)
- **Response Time**: Time from send to delivery
- **Call Duration**: Average call length
- **Error Frequency**: API errors, validation failures

### Audit Requirements
- **Quarterly Review**: Communication logs reviewed for anomalies
- **Annual Audit**: Full privacy/security audit
- **Incident Logging**: All security incidents documented
- **Compliance Reports**: KDPA compliance reports generated

---

## 11. Staff Training Requirements

### Required Training Topics
1. **Privacy Fundamentals**:
   - KDPA requirements
   - Survivor confidentiality
   - Data minimization principles

2. **System Usage**:
   - How to send secure messages
   - Template selection and customization
   - Communication history review

3. **Incident Response**:
   - Recognizing privacy breaches
   - Reporting procedures
   - Emergency contact information

### Training Frequency
- **Initial**: Before system access granted
- **Refresher**: Annually
- **Updates**: When system changes occur

---

## 12. Limitations & Future Enhancements

### Current Limitations
- No end-to-end encryption (messages encrypted in transit/rest only)
- No message delivery confirmation from survivor (read receipts)
- Limited to outbound communication (no inbound SMS handling)
- Manual phone number entry (no contact book integration)

### Planned Enhancements
- [ ] End-to-end encryption (Signal Protocol)
- [ ] Delivery receipts and read confirmations
- [ ] Inbound SMS handling for survivor responses
- [ ] Multi-language support (Swahili, Kikuyu)
- [ ] Automated appointment reminders with opt-out
- [ ] Secure file sharing (lab results, prescriptions)

---

## Contact & Support

**Data Protection Officer**: dpo@kintaraa.org
**Security Issues**: security@kintaraa.org
**Technical Support**: support@kintaraa.org

**Office of the Data Protection Commissioner (Kenya)**
Website: https://www.odpc.go.ke
Email: info@odpc.go.ke
Phone: +254 20 2675316

---

**Document Version**: 1.0
**Last Updated**: October 19, 2025
**Next Review**: January 19, 2026
