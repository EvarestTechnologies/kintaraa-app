# Week 2, Day 10 - Provider Assignment & Messaging Integration

**Date**: February 15, 2026
**Focus**: Test and verify provider assignment workflow and messaging system
**Status**: 🚧 In Progress

---

## 🎯 Day 10 Goals

### High Priority Tasks (3-4 hours)

1. **Test Provider Assignment Flow** ⭐
   - Create incident as survivor
   - Verify provider receives assignment notification
   - Test provider accept/reject workflow
   - Check database assignment records

2. **Test Messaging System** ⭐
   - Send message from survivor to provider
   - Receive message as provider
   - Verify message persistence
   - Test real-time updates (polling)

3. **Fix Dispatcher Routing Bug** ⭐
   - Issue: Dispatcher login redirects to survivor dashboard
   - Should redirect to dispatcher dashboard
   - Location: `app/(tabs)/_layout.tsx`

### Medium Priority Tasks (2-3 hours)

4. **Test Voice Recording Upload**
   - Record voice in incident form
   - Submit with incident creation
   - Verify stored in backend
   - Test playback

5. **Test Incident Update Flow**
   - Update incident description
   - Change support services
   - Verify updates persist
   - Test status changes

6. **Test Incident Filtering**
   - Filter by status
   - Filter by type
   - Test search functionality

---

## 📊 Current Implementation Status

### What's Already Implemented ✅

From previous analysis, these features are already coded in frontend:

1. **Provider Assignment**
   - `ProviderContext` in `providers/ProviderContext.tsx`
   - Assignment notification polling (5-second intervals)
   - Accept/reject assignment methods
   - Assignment status tracking

2. **Messaging System**
   - Message context and hooks
   - Message UI components
   - Send/receive message methods
   - Polling for new messages

3. **Provider Routing Service**
   - `services/providerRouting.ts`
   - Intelligent provider matching based on:
     - Provider type
     - Geographic proximity
     - Availability
     - Response time
     - Workload

### What Needs Backend Integration 🚧

1. **Assignment API Endpoints**
   - GET `/api/assignments/` - List assignments
   - POST `/api/assignments/{id}/accept/` - Accept assignment
   - POST `/api/assignments/{id}/reject/` - Reject assignment
   - GET `/api/assignments/stats/` - Assignment statistics

2. **Messaging API Endpoints**
   - GET `/api/incidents/{id}/messages/` - Get messages
   - POST `/api/incidents/{id}/messages/` - Send message
   - WebSocket for real-time (or polling)

3. **Notification System**
   - Push notifications for new assignments
   - Push notifications for new messages
   - In-app notification badges

---

## 🔧 Technical Investigation Plan

### Phase 1: Review Backend APIs (30 min)

Check if backend has:
- Assignment endpoints
- Messaging endpoints
- Proper permissions (provider can only see their assignments)
- Notification system

**Files to check:**
- `kintara-backend/apps/incidents/urls.py`
- `kintara-backend/apps/incidents/views.py`
- `kintara-backend/apps/incidents/serializers.py`
- Backend API documentation

### Phase 2: Review Frontend Implementation (30 min)

Check current state of:
- `providers/ProviderContext.tsx` - Assignment polling
- `services/messages.ts` - Message API (if exists)
- `app/messages/` - Message UI screens
- Assignment notification logic

### Phase 3: Test Provider Assignment (1-2 hours)

**Test Scenario:**
1. Login as survivor (`survivor@kintara.com`)
2. Create new incident
3. Logout, login as provider (need provider credentials)
4. Check if assignment notification appears
5. Accept or reject assignment
6. Verify incident appears in provider dashboard

**What to verify:**
- Assignment created in database
- Provider receives notification
- Accept/reject updates database
- Case appears in correct dashboards

### Phase 4: Test Messaging (1-2 hours)

**Test Scenario:**
1. As survivor, open assigned case
2. Send message to provider
3. Logout, login as provider
4. Check if message received
5. Reply to message
6. Verify both messages persist

**What to verify:**
- Messages stored in database
- Message count updates
- Real-time polling works
- Message thread displays correctly

### Phase 5: Fix Dispatcher Routing (30 min)

**Current Bug:**
- File: `app/(tabs)/_layout.tsx`
- Issue: Dispatcher role redirects to survivor dashboard
- Expected: Should redirect to dispatcher dashboard

**Fix Required:**
```typescript
// Check current routing logic
if (user?.role === 'dispatcher') {
  router.replace('/(dashboard)/dispatcher');  // This line likely missing or incorrect
}
```

---

## 🧪 Testing Checklist

### Provider Assignment Flow

- [ ] Create incident as survivor
- [ ] Backend creates assignment record
- [ ] Provider sees new assignment notification
- [ ] Provider can view assignment details
- [ ] Provider can accept assignment
- [ ] Provider can reject assignment
- [ ] Accepted assignment appears in provider dashboard
- [ ] Survivor sees provider assigned to case
- [ ] Assignment statistics update correctly

### Messaging Flow

- [ ] Survivor can send message
- [ ] Message persists in database
- [ ] Provider receives message notification
- [ ] Provider can view message
- [ ] Provider can reply to message
- [ ] Message count updates on case card
- [ ] Message thread displays chronologically
- [ ] Both users can see full conversation
- [ ] Unread message indicators work

### Dispatcher Routing

- [ ] Create dispatcher test account (if needed)
- [ ] Login as dispatcher
- [ ] Verify redirects to dispatcher dashboard
- [ ] Dispatcher can view all incidents
- [ ] Dispatcher can manually assign cases
- [ ] Dispatcher can view system statistics

### Voice Recording

- [ ] Record voice in incident form
- [ ] Voice recording indicator shows
- [ ] Can play back recording before submit
- [ ] Can delete and re-record
- [ ] Voice uploads with incident
- [ ] Voice stored in backend
- [ ] Can play voice from incident detail

---

## 📂 Files to Review/Modify

### Frontend Files

1. **providers/ProviderContext.tsx**
   - Review assignment polling logic
   - Check accept/reject methods
   - Verify API integration

2. **services/messages.ts** (check if exists)
   - Message API service
   - Send/receive methods
   - Real-time polling

3. **app/(tabs)/_layout.tsx**
   - Fix dispatcher routing
   - Add proper role-based redirect

4. **app/messages/** (check structure)
   - Message list screen
   - Message thread screen
   - Message input component

5. **app/(dashboard)/[provider]/** (all providers)
   - Assignment notification UI
   - Accept/reject buttons
   - Assigned cases list

### Backend Files to Check

6. **kintara-backend/apps/incidents/models.py**
   - Assignment model
   - Message model
   - Notification model

7. **kintara-backend/apps/incidents/views.py**
   - Assignment viewset
   - Message viewset
   - Notification endpoints

8. **kintara-backend/apps/incidents/serializers.py**
   - AssignmentSerializer
   - MessageSerializer
   - NotificationSerializer

9. **kintara-backend/apps/incidents/urls.py**
   - Assignment endpoints
   - Message endpoints
   - Notification endpoints

---

## 🔗 Backend API Endpoints (Expected)

### Assignment Endpoints
```
GET    /api/assignments/              # List provider's assignments
GET    /api/assignments/{id}/         # Assignment detail
POST   /api/assignments/{id}/accept/  # Accept assignment
POST   /api/assignments/{id}/reject/  # Reject assignment
GET    /api/assignments/stats/        # Assignment statistics
```

### Message Endpoints
```
GET    /api/incidents/{id}/messages/  # List messages for incident
POST   /api/incidents/{id}/messages/  # Send message
GET    /api/messages/unread-count/    # Unread message count
PATCH  /api/messages/{id}/read/       # Mark message as read
```

### Notification Endpoints
```
GET    /api/notifications/            # List user's notifications
PATCH  /api/notifications/{id}/read/  # Mark notification as read
POST   /api/notifications/mark-all-read/  # Mark all as read
```

---

## 🚀 Implementation Steps

### Step 1: Investigate Backend (30 min)

Check backend for:
- Assignment model and endpoints
- Message model and endpoints
- Notification system
- Test with API browser or Swagger

### Step 2: Review Frontend Code (30 min)

Check:
- ProviderContext assignment logic
- Message service implementation
- Current polling mechanism
- UI components for assignments/messages

### Step 3: Create Test Accounts (15 min)

Need test accounts for:
- Survivor (already have: `survivor@kintara.com`)
- Healthcare provider
- Dispatcher
- Other provider types (optional)

### Step 4: Test Assignment Flow (1 hour)

End-to-end test:
- Create incident
- Verify assignment
- Accept/reject
- Check dashboards

### Step 5: Test Messaging Flow (1 hour)

End-to-end test:
- Send messages
- Receive messages
- Verify persistence
- Check notifications

### Step 6: Fix Dispatcher Bug (30 min)

- Locate bug in `(tabs)/_layout.tsx`
- Add proper dispatcher routing
- Test dispatcher login
- Verify dispatcher dashboard loads

### Step 7: Document Findings (30 min)

- Create completion document
- Note any issues found
- Document what works
- List remaining tasks

---

## ✅ Success Criteria (Day 10)

### Must Have:
- [ ] Provider receives assignment when incident created
- [ ] Provider can accept/reject assignment
- [ ] Messaging works between survivor and provider
- [ ] Messages persist in database
- [ ] Dispatcher routing works correctly

### Nice to Have:
- [ ] Real-time notifications working
- [ ] Voice recording upload tested
- [ ] Incident filtering working
- [ ] Assignment statistics accurate

### Stretch Goals:
- [ ] WebSocket real-time messaging (instead of polling)
- [ ] Push notifications configured
- [ ] Evidence file upload tested
- [ ] Incident update flow tested

---

## 🐛 Known Issues from Day 9

1. **Dispatcher Routing Bug** ⚠️
   - Dispatcher login redirects to survivor dashboard
   - Needs fix in `app/(tabs)/_layout.tsx`

2. **Voice Recording Upload** ⏳
   - Endpoint exists: `/api/incidents/upload-voice/`
   - Frontend has recording capability
   - Never tested end-to-end

3. **File Evidence Upload** ⏳
   - Backend model has fields
   - Frontend UI exists
   - Upload logic needs implementation

---

## 📝 Day 10 Progress Log

**Starting Status:**
- Backend: 85% integrated
- Frontend: 80% integrated
- Day 9 completed successfully

**Next Action:** Review backend assignment and messaging endpoints

---

**Branch**: `main`
**Backend**: Running on `http://localhost:8000`
**Test Users**:
- Survivor: `survivor@kintara.com` / `survivor123`
- Provider: TBD (need to create or find existing)
- Dispatcher: TBD (need to create or find existing)

Let's begin! 🚀
