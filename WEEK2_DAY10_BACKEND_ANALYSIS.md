# Day 10 Backend API Analysis

**Date**: February 15, 2026
**Analysis**: Backend assignment and messaging endpoints

---

## 🔍 Backend API Status

### ✅ Assignment System - FULLY IMPLEMENTED

The backend has **complete** provider assignment functionality:

#### Available Endpoints

1. **GET /api/providers/assigned-cases/**
   - Returns all cases assigned to authenticated provider
   - Query params: `status` (pending|accepted|rejected)
   - Permission: Provider role only
   - View: `GetAssignedCasesView`

2. **POST /api/incidents/{incident_id}/assign/**
   - Manually assign a provider to an incident
   - Body: `{"provider_id": "uuid"}`
   - Permission: Incident owner or admin
   - View: `AssignProviderView`

3. **PATCH /api/incidents/{incident_id}/accept/**
   - Provider accepts a case assignment
   - Body: `{"notes": "optional notes"}`
   - Permission: Assigned provider only
   - View: `AcceptAssignmentView`

4. **PATCH /api/incidents/{incident_id}/reject/**
   - Provider rejects a case assignment
   - Body: `{"reason": "reason for rejection"}`
   - Permission: Assigned provider only
   - View: `RejectAssignmentView`

5. **GET /api/providers/available/**
   - Get list of available providers by type
   - Query params: `provider_type` (required)
   - Permission: Authenticated users
   - View: `GetAvailableProvidersView`

#### Backend Models

**CaseAssignment Model** (`apps/incidents/models.py`):
```python
class CaseAssignment(BaseModel):
    incident = ForeignKey(Incident)
    provider = ForeignKey(User)
    status = CharField(choices=['pending', 'accepted', 'rejected'])
    assigned_at = DateTimeField(auto_now_add=True)
    accepted_at = DateTimeField(null=True, blank=True)
    rejected_at = DateTimeField(null=True, blank=True)
    notes = TextField(blank=True)
    rejection_reason = TextField(blank=True)

    # Methods:
    - accept(notes='')
    - reject(reason='')
```

#### Backend Serializers

- `CaseAssignmentSerializer` - Full assignment details
- `AssignedCaseSerializer` - Case data for provider view
- `AssignProviderSerializer` - Assignment request
- `AcceptAssignmentSerializer` - Accept request
- `RejectAssignmentSerializer` - Reject request
- `AvailableProviderSerializer` - Provider listing

#### Hybrid Assignment Service

**File**: `apps/incidents/services.py`
**Class**: `HybridAssignmentService`

Automatically called when incident is created:

- **Urgent/Immediate cases**: Auto-assigned to GBV Rescue provider
- **Routine cases**: Queued for dispatcher manual assignment

---

### ❌ Messaging System - NOT IMPLEMENTED

The messaging system is **NOT yet implemented** in the backend:

#### Current Status

- ❌ No Message model exists
- ❌ No message endpoints
- ❌ No message serializers
- ❌ `apps/messaging/` app exists but is empty (placeholder)

#### What's Missing

1. **Message Model**
   - Sender/Recipient fields
   - Message content
   - Attachment support
   - Read status
   - Timestamps

2. **Message Endpoints**
   - GET `/api/incidents/{id}/messages/` - List messages
   - POST `/api/incidents/{id}/messages/` - Send message
   - PATCH `/api/messages/{id}/read/` - Mark as read
   - GET `/api/messages/unread-count/` - Unread count

3. **Real-time System**
   - WebSocket support (or polling)
   - Message notifications
   - Read receipts

---

## 🎯 Day 10 Implementation Strategy

### Priority 1: Test Assignment Workflow ⭐ (Can do now!)

Backend is ready! We can test:

1. **Create provider test accounts**
2. **Test incident assignment flow**
   - Create incident as survivor
   - Check if auto-assignment happens (urgent cases)
   - Login as provider
   - Check `/api/providers/assigned-cases/`
   - Accept or reject assignment

3. **Test manual assignment**
   - Login as dispatcher
   - Assign provider manually
   - Verify assignment created

### Priority 2: Fix Dispatcher Routing Bug ⭐ (Independent task)

Can be done without backend changes:

- File: `app/(tabs)/_layout.tsx`
- Issue: Dispatcher redirects to survivor dashboard
- Fix: Update routing logic for dispatcher role

### Priority 3: Messaging System 🚧 (Backend work required)

**Cannot test** until backend messaging is implemented.

**Options:**
A. Skip messaging for now (focus on assignment)
B. Implement basic backend messaging models/endpoints
C. Create frontend mock for messaging UI testing

### Priority 4: Voice Recording 🎵 (Backend ready!)

Backend has voice upload endpoint:

- Endpoint: POST `/api/incidents/upload-voice/`
- Parser: MultiPartParser, FormParser
- Validation: File type and size checks
- Returns: File info for incident attachment

Can test this now!

---

## 📊 Day 10 Recommended Tasks

### Morning Session (2-3 hours)

#### Task 1: Create Provider Test Accounts
```bash
cd ../kintara-backend
python manage.py shell

from django.contrib.auth import get_user_model
User = get_user_model()

# Create healthcare provider
provider = User.objects.create_user(
    email='provider.healthcare@kintara.com',
    password='provider123',
    first_name='Jane',
    last_name='Provider',
    role='provider',
    provider_type='healthcare'
)

# Create GBV rescue provider
gbv_provider = User.objects.create_user(
    email='provider.gbv@kintara.com',
    password='provider123',
    first_name='Sarah',
    last_name='Rescuer',
    role='provider',
    provider_type='gbv_rescue'
)

# Create dispatcher
dispatcher = User.objects.create_user(
    email='dispatcher@kintara.com',
    password='dispatcher123',
    first_name='John',
    last_name='Dispatcher',
    role='dispatcher'
)
```

#### Task 2: Create Assignment Service (Frontend)

Create `services/assignments.ts` to call backend assignment APIs:

```typescript
// GET /api/providers/assigned-cases/
export const getAssignedCases = async () => {...}

// PATCH /api/incidents/{id}/accept/
export const acceptAssignment = async (incidentId, notes) => {...}

// PATCH /api/incidents/{id}/reject/
export const rejectAssignment = async (incidentId, reason) => {...}

// GET /api/providers/available/?provider_type=healthcare
export const getAvailableProviders = async (providerType) => {...}
```

#### Task 3: Update ProviderContext

Replace mock polling with real API calls:

```typescript
// Replace this:
const assignments = ProviderRoutingService.getProviderAssignments(providerId);

// With this:
const { data: assignments } = useQuery({
  queryKey: ['assigned-cases', user?.id],
  queryFn: () => getAssignedCases(),
  refetchInterval: 5000, // Poll every 5 seconds
  enabled: user?.role === 'provider'
});
```

#### Task 4: Test Assignment Flow

1. Login as survivor → Create urgent incident
2. Check database → Verify auto-assignment to GBV provider
3. Login as GBV provider → See pending assignment
4. Accept assignment → Verify status changes
5. Check survivor view → See provider assigned

### Afternoon Session (2-3 hours)

#### Task 5: Fix Dispatcher Routing

Update `app/(tabs)/_layout.tsx`:

```typescript
if (user?.role === 'dispatcher') {
  router.replace('/(dashboard)/dispatcher');
} else if (user?.role === 'provider') {
  // Provider routing logic
} else {
  router.replace('/(dashboard)/survivor');
}
```

#### Task 6: Test Voice Recording Upload

1. Record voice in incident form
2. Call `/api/incidents/upload-voice/`
3. Attach file info to incident
4. Verify voice stored in backend
5. Test playback

#### Task 7: Document Findings

Create `WEEK2_DAY10_COMPLETE.md` with:
- Assignment workflow test results
- API integration details
- Any issues encountered
- Next steps for messaging

---

## 🔧 Frontend Files to Create/Modify

### New Files

1. **services/assignments.ts**
   - Assignment API service
   - Accept/reject methods
   - Provider listing

2. **types/assignments.ts** (optional)
   - Assignment type definitions
   - API response types

### Files to Modify

3. **providers/ProviderContext.tsx**
   - Replace mock assignment polling
   - Call real API endpoints
   - Update types to match backend

4. **app/(tabs)/_layout.tsx**
   - Fix dispatcher routing bug

5. **app/(dashboard)/[provider]/**.tsx
   - Test assignment notification UI
   - Accept/reject assignment buttons

---

## ✅ Success Criteria for Day 10

### Must Have
- [ ] Provider test accounts created
- [ ] Assignment service implemented
- [ ] ProviderContext uses real API
- [ ] Can create incident → Provider sees assignment
- [ ] Can accept/reject assignment
- [ ] Dispatcher routing fixed

### Nice to Have
- [ ] Voice recording upload tested
- [ ] Assignment notifications working
- [ ] Provider statistics accurate
- [ ] Assignment status updates in real-time

### Document
- [ ] Test results documented
- [ ] Known issues listed
- [ ] Messaging system plan created
- [ ] Day 10 completion report

---

## 🐛 Known Limitations

1. **Messaging not implemented** - Backend work required
2. **WebSocket not available** - Using polling instead
3. **Push notifications** - Not configured yet
4. **File evidence upload** - Not implemented yet

---

## 📝 Next Steps After Day 10

### If Assignment Works ✅
- Day 11: Implement backend messaging system
- Day 12: Test messaging end-to-end
- Day 13: Add file upload support

### If Assignment Needs Work 🚧
- Debug assignment creation
- Fix permission issues
- Improve error handling
- Add loading states

---

**Summary**: Backend assignment system is **fully ready** for testing! 🎉
**Action**: Create frontend service to call backend APIs and test the flow.
