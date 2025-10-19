# Communication System - Testing Guide

## Overview

This document outlines the testing strategy for the Kintaraa Communication System (SMS and voice calls). Test implementation pending Jest setup (Sprint 6).

---

## Test Categories

### 1. Template Management Tests

#### Test: Load Default Templates
```typescript
describe('Template Management', () => {
  it('should load default templates', async () => {
    const templates = await CommunicationService.getTemplates();

    expect(templates).toBeDefined();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0]).toHaveProperty('id');
    expect(templates[0]).toHaveProperty('name');
    expect(templates[0]).toHaveProperty('content');
    expect(templates[0]).toHaveProperty('category');
  });
});
```

**Expected Result**: Returns 6 default templates with all required fields

---

#### Test: Filter Templates by Category
```typescript
it('should filter templates by category', async () => {
  const appointmentTemplates = await CommunicationService.getTemplates('appointment');

  appointmentTemplates.forEach(template => {
    expect(template.category).toBe('appointment');
  });
});
```

**Expected Result**: Only returns templates matching the specified category

---

#### Test: Template Variable Filling
```typescript
it('should fill template with variables', () => {
  const template = {
    id: 'test-1',
    name: 'Test Template',
    content: 'Hello {{survivor_name}}, your case {{case_number}} is ready.',
    category: 'general',
  };

  const variables = {
    survivor_name: 'Jane Doe',
    case_number: 'CASE-123',
  };

  const filled = CommunicationService.fillTemplate(template, variables);
  expect(filled).toBe('Hello Jane Doe, your case CASE-123 is ready.');
});
```

**Expected Result**: Correctly substitutes all template variables

---

#### Test: Handle Missing Variables
```typescript
it('should handle missing variables gracefully', () => {
  const template = {
    content: 'Hello {{survivor_name}}, {{missing_var}}',
  };

  const variables = {
    survivor_name: 'Jane Doe',
  };

  const filled = CommunicationService.fillTemplate(template, variables);
  expect(filled).toContain('{{missing_var}}'); // Placeholder preserved
});
```

**Expected Result**: Keeps placeholder for missing variables instead of breaking

---

### 2. SMS Functionality Tests

#### Test: Phone Number Validation
```typescript
it('should validate phone number format', async () => {
  const validRequest = {
    caseId: 'case-123',
    recipientId: 'user-456',
    recipientPhone: '+254712345678', // Valid E.164 format
    message: 'Test message',
  };

  await expect(
    CommunicationService.sendSMS(validRequest)
  ).resolves.toBeDefined();
});
```

**Test Cases**:
- ✅ Valid: `+254712345678` (Kenya mobile)
- ✅ Valid: `+1234567890` (International)
- ❌ Invalid: `0712345678` (Missing country code)
- ❌ Invalid: `+254` (Too short)
- ❌ Invalid: `abcd1234` (Contains letters)

---

#### Test: SMS Log Storage
```typescript
it('should store SMS logs locally', async () => {
  const request = {
    caseId: 'case-123',
    recipientId: 'user-456',
    recipientPhone: '+254712345678',
    message: 'Test message',
  };

  await CommunicationService.sendSMS(request);

  // Verify AsyncStorage was called
  expect(AsyncStorage.setItem).toHaveBeenCalled();

  // Verify log structure
  const logs = await CommunicationService.getCommunicationHistory('case-123');
  expect(logs[0]).toMatchObject({
    type: 'sms',
    caseId: 'case-123',
    phoneNumber: '+254712345678',
    status: expect.stringMatching(/pending|sent|delivered/),
  });
});
```

**Expected Result**: All SMS messages logged to AsyncStorage with complete metadata

---

#### Test: Message Sanitization
```typescript
it('should sanitize message content', async () => {
  const request = {
    message: 'Test <script>alert("xss")</script> message',
  };

  // Should not crash or execute script
  await CommunicationService.sendSMS(request);
});
```

**Expected Result**: Malicious content handled safely

---

### 3. Voice Call Tests

#### Test: Call Initiation
```typescript
it('should initiate call with valid phone number', async () => {
  const request = {
    caseId: 'case-123',
    recipientId: 'user-456',
    recipientPhone: '+254712345678',
  };

  const result = await CommunicationService.initiateCall(request);

  expect(result).toBeDefined();
  expect(result.status).toMatch(/initiated|ringing|in_progress/);
});
```

**Expected Result**: Call initiated successfully or falls back to device dialer

---

#### Test: Call Log Storage
```typescript
it('should store call logs with duration', async () => {
  const request = {
    caseId: 'case-123',
    recipientPhone: '+254712345678',
  };

  await CommunicationService.initiateCall(request);

  const logs = await CommunicationService.getCommunicationHistory('case-123');
  const callLog = logs.find(log => log.type === 'call');

  expect(callLog).toBeDefined();
  expect(callLog).toHaveProperty('duration');
  expect(callLog).toHaveProperty('timestamp');
});
```

**Expected Result**: Call metadata logged including duration

---

### 4. Communication History Tests

#### Test: Retrieve Case History
```typescript
it('should retrieve all communications for a case', async () => {
  const history = await CommunicationService.getCommunicationHistory('case-123');

  expect(Array.isArray(history)).toBe(true);
  history.forEach(log => {
    expect(log.caseId).toBe('case-123');
    expect(log.type).toMatch(/sms|call/);
  });
});
```

**Expected Result**: Returns all logs for the specified case only

---

#### Test: Empty History
```typescript
it('should handle empty history gracefully', async () => {
  const history = await CommunicationService.getCommunicationHistory('nonexistent-case');

  expect(history).toBeDefined();
  expect(Array.isArray(history)).toBe(true);
  expect(history.length).toBe(0);
});
```

**Expected Result**: Returns empty array instead of throwing error

---

#### Test: History Sorting
```typescript
it('should sort history by timestamp descending', async () => {
  const history = await CommunicationService.getCommunicationHistory('case-123');

  for (let i = 0; i < history.length - 1; i++) {
    expect(new Date(history[i].timestamp).getTime())
      .toBeGreaterThanOrEqual(new Date(history[i + 1].timestamp).getTime());
  }
});
```

**Expected Result**: Most recent communications appear first

---

### 5. Privacy & Security Tests

#### Test: No PII in Error Messages
```typescript
it('should not expose sensitive data in error logs', async () => {
  const request = {
    recipientPhone: '+254712345678',
    message: 'Sensitive information',
  };

  try {
    await CommunicationService.sendSMS(request); // May fail due to missing fields
  } catch (error) {
    // Error should not contain phone number or message content
    expect(error.message).not.toContain('+254712345678');
    expect(error.message).not.toContain('Sensitive information');
  }
});
```

**Expected Result**: Error messages don't leak sensitive data

---

#### Test: Case Isolation
```typescript
it('should prevent cross-case communication access', async () => {
  // User can only access their assigned cases
  const history1 = await CommunicationService.getCommunicationHistory('case-123');
  const history2 = await CommunicationService.getCommunicationHistory('case-456');

  // Ensure no logs from case-456 appear in case-123 history
  history1.forEach(log => {
    expect(log.caseId).toBe('case-123');
  });
});
```

**Expected Result**: Communication logs isolated by case

---

#### Test: Message Length Limits
```typescript
it('should enforce message length limits', async () => {
  const longMessage = 'a'.repeat(1000);

  const request = {
    caseId: 'case-123',
    recipientPhone: '+254712345678',
    message: longMessage,
  };

  // Should truncate or split message
  await CommunicationService.sendSMS(request);
});
```

**Expected Result**: Messages over 500 chars handled appropriately (truncate or split)

---

### 6. Error Handling Tests

#### Test: AsyncStorage Failure
```typescript
it('should handle AsyncStorage failures gracefully', async () => {
  // Mock storage failure
  AsyncStorage.setItem = jest.fn(() => Promise.reject(new Error('Storage full')));

  const request = {
    caseId: 'case-123',
    recipientPhone: '+254712345678',
    message: 'Test message',
  };

  // Should not throw, but may log error
  await expect(
    CommunicationService.sendSMS(request)
  ).resolves.toBeDefined();
});
```

**Expected Result**: Service continues to function even if local storage fails

---

#### Test: Network Failure Fallback
```typescript
it('should fallback to local storage on network failure', async () => {
  // Mock network error
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

  const request = {
    caseId: 'case-123',
    recipientPhone: '+254712345678',
    message: 'Test message',
  };

  const result = await CommunicationService.sendSMS(request);

  // Should return result with 'pending' status
  expect(result.status).toBe('pending');
});
```

**Expected Result**: Messages queued locally when API unavailable

---

## Manual Testing Checklist

### SMS Testing
- [ ] Send SMS with appointment template
- [ ] Send SMS with custom message
- [ ] Verify delivery status updates
- [ ] Test with invalid phone number (expect error)
- [ ] Test with missing case ID (expect error)
- [ ] Verify message appears in Communication History
- [ ] Test with Twilio API credentials
- [ ] Test with Africa's Talking credentials
- [ ] Test fallback when API unavailable

### Call Testing
- [ ] Initiate call to valid Kenyan number (+254...)
- [ ] Verify call log created with timestamp
- [ ] Test device dialer fallback
- [ ] Verify call duration tracked (if API-based)
- [ ] Test with invalid phone number (expect error)

### UI Component Testing
- [ ] CommunicationActions buttons visible and clickable
- [ ] MessageCompositionModal opens on SMS button click
- [ ] Template selector loads all 6 templates
- [ ] Template selection fills message input
- [ ] Character counter shows 0/500 initially
- [ ] Character counter updates as user types
- [ ] Send button disabled when message empty
- [ ] Loading indicator shows during send
- [ ] Success alert after message sent
- [ ] CommunicationHistory shows all logs
- [ ] History refreshes on pull-down
- [ ] QuickResponseTemplates displays in grid/list mode
- [ ] Quick-send works without opening modal

### Privacy Testing
- [ ] Phone numbers masked in UI (where appropriate)
- [ ] Logs don't expose to unauthorized users
- [ ] Error messages don't contain PII
- [ ] Templates don't reveal sensitive case details

---

## Performance Benchmarks

| Operation | Target Time | Acceptable Max |
|-----------|-------------|----------------|
| Load templates | < 100ms | < 500ms |
| Send SMS (API) | < 2s | < 5s |
| Initiate call | < 1s | < 3s |
| Load history (50 logs) | < 200ms | < 1s |
| Template filling | < 10ms | < 50ms |

---

## Test Environment Setup

### Required Configuration
```bash
# .env.test
TWILIO_ACCOUNT_SID=test_sid
TWILIO_AUTH_TOKEN=test_token
TWILIO_PHONE_NUMBER=+1234567890
AFRICAS_TALKING_USERNAME=test_user
AFRICAS_TALKING_API_KEY=test_key
```

### Mock Data
```typescript
// Mock case for testing
const mockCase = {
  id: 'case-test-123',
  survivorPhone: '+254700000000',
  assignedProvider: 'provider-test-456',
};

// Mock templates
const mockTemplates = [
  {
    id: 'template-1',
    name: 'Test Appointment',
    content: 'Your appointment is on {{appointment_date}}',
    category: 'appointment',
  },
];
```

---

## Integration Testing (Backend Required)

### End-to-End SMS Flow
1. Provider composes message in MessageCompositionModal
2. Message sent via API to backend
3. Backend forwards to Twilio/Africa's Talking
4. Delivery status webhook received
5. Status updated in database
6. Frontend polls and updates UI
7. Communication History reflects delivery

### End-to-End Call Flow
1. Provider clicks call button
2. API initiates call via Twilio
3. Call connects to survivor
4. Call duration tracked
5. Call ends
6. Log created with metadata
7. History updated in UI

---

## Accessibility Testing

- [ ] Screen reader announces SMS send result
- [ ] Call button has accessible label
- [ ] Templates keyboard-navigable
- [ ] Error messages announced to screen reader
- [ ] Loading states communicated

---

## Next Steps

1. **Sprint 6**: Install Jest + React Native Testing Library
2. Implement all test cases above
3. Add integration tests with backend
4. Set up CI/CD test automation
5. Achieve 80%+ code coverage

---

**Document Version**: 1.0
**Last Updated**: October 19, 2025
**Owner**: Development Team
