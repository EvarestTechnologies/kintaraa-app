# Week 2, Day 9 - Incident Management Integration

**Date**: February 15, 2026
**Focus**: Connect Incident Provider to Real Backend API
**Status**: 🚧 In Progress

---

## 🎯 Day 9 Goals

### Morning Tasks (2-3 hours)
- [ ] Remove mock data from IncidentProvider
- [ ] Connect to GET `/api/incidents/` endpoint
- [ ] Connect to POST `/api/incidents/` endpoint
- [ ] Test incident creation from mobile app
- [ ] Verify incidents appear in backend database

### Afternoon Tasks (2-3 hours)
- [ ] Test voice recording upload
- [ ] Test incident update/edit
- [ ] Test incident soft delete
- [ ] Verify survivor can view own incidents
- [ ] Test incident filtering

**End of Day Goal**: Survivors can create and manage incidents through real API

---

## 📊 Current Status

### What's Already Working ✅
- ✅ Authentication on web and mobile
- ✅ Backend running with CORS configured
- ✅ 4 sample incidents seeded in database
- ✅ JWT tokens being sent with requests
- ✅ Mobile app connecting to backend via network IP

### What Needs Work 🚧
- 🚧 IncidentProvider currently using mock data
- 🚧 No real API calls for incident CRUD
- 🚧 Voice upload not implemented
- 🚧 File evidence upload not tested

### Known Issues 🐛
- 🐛 Dispatcher routing redirects to survivor dashboard
- 🐛 Need to verify incident serializer format matches frontend expectations

---

## 🔧 Technical Plan

### Step 1: Review Backend Incident Endpoints

**Available Endpoints** (from backend):
```
POST   /api/incidents/              Create incident
GET    /api/incidents/              List incidents (filtered by user)
GET    /api/incidents/{id}/         Get incident detail
PUT    /api/incidents/{id}/         Update incident
PATCH  /api/incidents/{id}/         Partial update
DELETE /api/incidents/{id}/         Soft delete
POST   /api/incidents/upload-voice/ Upload voice recording
GET    /api/incidents/stats/        Get incident statistics
```

### Step 2: Review Frontend Incident Types

**Current Frontend Incident Interface** (from IncidentProvider):
```typescript
interface Incident {
  id: string;
  caseNumber: string;
  type: string;
  description: string;
  location: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedAt: Date;
  assignedProvider?: Provider;
}
```

**Backend Response Format** (needs verification):
```json
{
  "id": "uuid",
  "case_number": "KIN-241210001",
  "type": "physical_abuse",
  "description": "...",
  "location": {...},
  "status": "new",
  "urgency_level": "immediate",
  "created_at": "2024-12-10T10:00:00Z"
}
```

### Step 3: Create API Service for Incidents

**File**: `services/incidentService.ts` (to be created)

Methods needed:
- `createIncident(data)` - POST to /api/incidents/
- `getIncidents()` - GET /api/incidents/
- `getIncidentById(id)` - GET /api/incidents/{id}/
- `updateIncident(id, data)` - PATCH /api/incidents/{id}/
- `deleteIncident(id)` - DELETE /api/incidents/{id}/
- `uploadVoiceRecording(file)` - POST /api/incidents/upload-voice/

### Step 4: Update IncidentProvider

**Changes needed**:
1. Import `incidentService` instead of using mock data
2. Update `createIncident` to call real API
3. Update `useQuery` to fetch from real API
4. Map backend response format to frontend types
5. Handle API errors properly

### Step 5: Test Incident Creation Flow

**Test Scenario**:
1. Login as `survivor@kintara.com`
2. Navigate to "Report Incident" screen
3. Fill out incident form
4. Submit incident
5. Verify:
   - API call successful (200 response)
   - Incident appears in backend database
   - Incident appears in frontend list
   - Case number generated correctly

---

## 🧪 Testing Checklist

### Incident Creation
- [ ] Create physical abuse incident
- [ ] Create emotional abuse incident
- [ ] Create sexual violence incident
- [ ] Verify all required fields validated
- [ ] Check location data sent correctly
- [ ] Verify anonymous reporting works

### Incident Listing
- [ ] Survivor sees only their own incidents
- [ ] Provider sees assigned incidents
- [ ] Dispatcher sees all incidents
- [ ] Filtering by status works
- [ ] Filtering by type works
- [ ] Sorting by date works

### Incident Details
- [ ] Can view full incident details
- [ ] Can update incident status
- [ ] Can add notes/updates
- [ ] Evidence attachments displayed

### Error Handling
- [ ] Network error shows user-friendly message
- [ ] Validation errors display on form
- [ ] Unauthorized access redirects to login
- [ ] Empty states handled gracefully

---

## 📂 Files to Modify

### Frontend
1. **services/incidentService.ts** (NEW)
   - Create incident API service

2. **providers/IncidentProvider.tsx**
   - Remove DUMMY_INCIDENTS import
   - Replace mock data with API calls
   - Add error handling
   - Update types if needed

3. **app/(dashboard)/survivor/report.tsx**
   - Connect form submission to API
   - Add loading states
   - Handle success/error feedback

4. **constants/DummyData.ts**
   - Can remove DUMMY_INCIDENTS (or keep for offline fallback)

### Backend (Verify Only)
5. **kintara-backend/apps/incidents/views.py**
   - Verify endpoints work as expected
   - Check permissions (survivor can only see own)

---

## 🚀 Implementation Steps

### Phase 1: Setup (30 min)
1. Create `services/incidentService.ts`
2. Review backend API response format
3. Create type mappings if needed

### Phase 2: Read Operations (1 hour)
1. Implement `getIncidents()` API call
2. Update IncidentProvider to use real API
3. Test incident listing
4. Fix any type mismatches

### Phase 3: Create Operations (1 hour)
1. Implement `createIncident()` API call
2. Update report form submission
3. Test incident creation
4. Verify backend storage

### Phase 4: Update/Delete Operations (1 hour)
1. Implement `updateIncident()` and `deleteIncident()`
2. Add UI controls for update/delete
3. Test workflow
4. Handle optimistic updates

### Phase 5: Testing & Polish (1 hour)
1. Test all CRUD operations
2. Add loading states
3. Improve error messages
4. Test edge cases

---

## 🔗 Backend API Reference

**Base URL**: `http://192.168.0.12:8000/api` (mobile) or `http://127.0.0.1:8000/api` (web)

**Authentication**: Bearer token in Authorization header

**Endpoints**:
- Swagger docs: http://localhost:8000/swagger/
- API root: http://localhost:8000/api/

**Test with curl**:
```bash
# Get incidents (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/incidents/

# Create incident
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "physical_abuse", "description": "Test incident"}' \
  http://localhost:8000/api/incidents/
```

---

## ✅ Success Criteria

**Must Have (End of Day 9)**:
- ✅ IncidentProvider using real API (not mock data)
- ✅ Survivors can create incidents from mobile app
- ✅ Incidents stored in backend database
- ✅ Incidents retrieved and displayed in app
- ✅ Basic CRUD operations working

**Nice to Have**:
- ✅ Voice recording upload working
- ✅ Evidence file upload working
- ✅ Incident update/edit working
- ✅ Soft delete working
- ✅ Filtering and sorting working

---

## 📝 Notes

- Backend already has 4 sample incidents seeded
- Frontend incident types may need mapping to backend format
- Consider offline support (store locally, sync later)
- Voice recording uses expo-av for recording
- File uploads need multipart/form-data handling

---

**Ready to start implementing!** 🚀

Next action: Create `services/incidentService.ts` and review backend response format.
