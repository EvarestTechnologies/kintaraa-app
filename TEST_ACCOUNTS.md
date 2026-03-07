# Test Accounts for Kintara GBV Platform

This document contains login credentials for testing the Kintara mobile application. These accounts are pre-configured with different roles to test the complete workflow.

---

## 📋 Quick Reference Table

| Role | Email | Password | Dashboard Features |
|------|-------|----------|-------------------|
| 👤 **Survivor** | `survivor@kintara.com` | `survivor123` | Report incidents, wellbeing tools, safety plans |
| 🏥 **Healthcare** | `healthcare@kintara.com` | `provider123` | Accept assignments via notification bell |
| 🆘 **GBV Rescue** | `gbv@kintara.com` | `provider123` | Emergency cases, dispatch teams |
| ⚖️ **Legal** | `legal@kintara.com` | `provider123` | Accept assignments via notification bell |
| 👮 **Police** | `police@kintara.com` | `provider123` | Accept assignments via notification bell |
| 🧠 **Counseling** | `counseling@kintara.com` | `provider123` | Accept assignments via notification bell |
| 🤝 **Social Services** | `social@kintara.com` | `provider123` | Accept assignments via notification bell |
| 🏥 **CHW** | `chw@kintara.com` | `provider123` | Accept assignments via notification bell |
| 📋 **Dispatcher** | `dispatcher@kintara.com` | `dispatcher123` | Assign cases, view all incidents, monitor system |

---

## 🔐 Test Account Credentials

### 👤 Survivor Account
**Use this account to test incident reporting and survivor dashboard features.**

- **Email**: `survivor@kintara.com`
- **Password**: `survivor123`
- **Role**: Survivor
- **Features**:
  - Report new incidents
  - View incident history
  - Access wellbeing tools (mood tracking, journaling)
  - Create safety plans
  - View assigned providers
  - Message providers (when messaging is implemented)

---

### 🏥 Healthcare Provider
**Use this account to test healthcare provider workflows.**

- **Email**: `healthcare@kintara.com`
- **Password**: `provider123`
- **Role**: Healthcare Provider
- **Provider Type**: Healthcare
- **Features**:
  - View assigned cases
  - Accept/reject case assignments
  - Manage patient appointments
  - Access medical records
  - Update case status

---

### 🆘 GBV Rescue Provider
**Use this account to test emergency response workflows.**

- **Email**: `gbv@kintara.com`
- **Password**: `provider123`
- **Role**: GBV Rescue Provider
- **Provider Type**: GBV Rescue Center
- **Features**:
  - Receive urgent case assignments (manual dispatcher assignment)
  - View pending assignments via Emergency Cases tab
  - Dispatch emergency response teams
  - Accept assignments via "Dispatch Team" modal
  - 24/7 emergency response capability
  - Crisis intervention tracking
  - Emergency case prioritization

---

### ⚖️ Legal Provider
**Use this account to test legal service workflows.**

- **Email**: `legal@kintara.com`
- **Password**: `provider123`
- **Role**: Legal Provider
- **Provider Type**: Legal Services
- **Features**:
  - Receive case assignments via notification bell
  - Accept/reject legal case assignments
  - Manage court hearings and legal documentation
  - Track case law and legal precedents
  - Document review and management

---

### 👮 Police Provider
**Use this account to test law enforcement workflows.**

- **Email**: `police@kintara.com`
- **Password**: `provider123`
- **Role**: Police Provider
- **Provider Type**: Police/Law Enforcement
- **Features**:
  - Receive case assignments via notification bell
  - Accept/reject investigation assignments
  - Evidence tracking and management
  - Case investigation workflow
  - Generate police reports

---

### 🧠 Counseling Provider
**Use this account to test counseling/therapy workflows.**

- **Email**: `counseling@kintara.com`
- **Password**: `provider123`
- **Role**: Counseling Provider
- **Provider Type**: Counseling/Therapy
- **Features**:
  - Receive case assignments via notification bell
  - Accept/reject counseling assignments
  - Manage therapy sessions
  - Client mental health tracking
  - Session notes and progress tracking

---

### 🤝 Social Services Provider
**Use this account to test social work workflows.**

- **Email**: `social@kintara.com`
- **Password**: `provider123`
- **Role**: Social Services Provider
- **Provider Type**: Social Services
- **Features**:
  - Receive case assignments via notification bell
  - Accept/reject social service assignments
  - Resource coordination
  - Benefit assistance management
  - Community resource allocation

---

### 🏥 Community Health Worker (CHW)
**Use this account to test community health workflows.**

- **Email**: `chw@kintara.com`
- **Password**: `provider123`
- **Role**: Community Health Worker
- **Provider Type**: Community Health Worker
- **Features**:
  - Receive case assignments via notification bell
  - Accept/reject health outreach assignments
  - Mobile-first community outreach
  - Health education and awareness
  - Referral management

---

### 📋 Dispatcher Account
**Use this account to test system administration and case management.**

- **Email**: `dispatcher@kintara.com`
- **Password**: `dispatcher123`
- **Role**: Dispatcher
- **Features**:
  - View all incidents system-wide
  - Manually assign providers to cases
  - Reassign cases to different providers
  - View provider availability and capacity
  - Dashboard with system statistics
  - Case filtering and search

---

## 🧪 Testing Workflows

### Workflow 1: Complete Dispatcher-to-Provider Assignment Flow (Week 2, Day 10)

1. **Login as Survivor** (`survivor@kintara.com`)
   - Navigate to "Report Incident"
   - Fill in incident details
   - Select incident type (e.g., Physical, Sexual, Emotional)
   - Set urgency level (Routine, Urgent, or Immediate)
   - Submit the report
   - ✅ **All cases now go to dispatcher queue** (manual assignment only)

2. **Login as Dispatcher** (`dispatcher@kintara.com`)
   - Dashboard shows system statistics:
     - Total Cases
     - New Cases (pending_dispatcher_review)
     - Assigned Cases (assigned to provider)
     - In Progress (provider accepted)
     - Completed Cases
   - Navigate to "Assignments" tab
   - See cases pending assignment
   - Click "Assign" on a case
   - Select appropriate provider from available providers
   - Provider receives notification

3. **Login as Provider** (any provider type)
   - **Notification bell** shows badge with pending assignment count
   - Click **bell icon** to see pending assignments
   - View case details (case number, type, urgency, description)
   - Click **"Accept"** button
   - Assignment sent to backend API
   - Case status updates to "in_progress"

4. **Return to Dispatcher Dashboard**
   - Within 10 seconds, dashboard updates automatically
   - Case moves from "Assigned" → "In Progress"
   - Case card shows:
     - ✅ Provider name (e.g., "Dr. John Smith")
     - ✅ Provider type badge with color coding
     - ✅ Acceptance timestamp

---

### Workflow 2: Testing All Provider Types

**Test each provider dashboard can receive and accept assignments:**

1. **GBV Rescue Provider** (`gbv@kintara.com`)
   - Go to **Emergency Cases** tab
   - See pending high-priority cases
   - Click **"Dispatch Team"**
   - Select a team from the modal
   - Assignment accepted automatically
   - Case status updates to "in_progress"

2. **Healthcare Provider** (`healthcare@kintara.com`)
   - Look for **notification bell** (top-right)
   - Badge shows pending assignment count
   - Click bell → Modal shows pending cases
   - Click **"Accept"** button
   - Success! Case accepted

3. **Legal Provider** (`legal@kintara.com`)
   - Same notification bell pattern
   - Accept legal case assignments
   - Manage court hearings

4. **Police Provider** (`police@kintara.com`)
   - Notification bell for investigations
   - Accept evidence tracking cases

5. **Counseling Provider** (`counseling@kintara.com`)
   - Notification bell for therapy cases
   - Accept counseling assignments

6. **Social Services** (`social@kintara.com`)
   - Notification bell for social work
   - Accept resource coordination cases

7. **CHW Provider** (`chw@kintara.com`)
   - Notification bell for health outreach
   - Accept community health cases

---

### Workflow 3: Dispatcher Monitoring & Reassignment

1. **Login as Dispatcher** (`dispatcher@kintara.com`)
   - Navigate to **"Cases"** tab
   - Filter by status:
     - **All Cases** - See everything
     - **New Cases** - Pending assignment
     - **Assigned** - Waiting for provider acceptance
     - **In Progress** - Provider accepted and working
     - **Completed** - Finished cases
   - Click any **in-progress** case
   - See full provider details:
     - Provider name
     - Provider type (color-coded badge)
     - Date/time accepted
   - Can reassign if needed via "Reassign" button

---

### Workflow 3: Survivor Support Services

1. **Login as Survivor** (`survivor@kintara.com`)
   - Navigate to "Wellbeing" tab
   - Log mood entries
   - Write journal entries
   - Navigate to "Safety" tab
   - Create safety plan
   - Add emergency contacts
   - View assigned providers and case status

---

## 🔄 Testing Case Status Flow (Updated for Day 10)

**All cases now follow centralized dispatcher workflow:**

```
1. Survivor submits incident
   ↓
   Status: new

2. System queues for dispatcher
   ↓
   Status: pending_dispatcher_review

3. Dispatcher assigns provider
   ↓
   Status: assigned
   Backend: CaseAssignment.status = 'pending'

4. Provider accepts assignment
   ↓
   Status: in_progress
   Backend: CaseAssignment.status = 'accepted'

5. Provider completes work
   ↓
   Status: completed

6. Case closed
   ↓
   Status: closed
```

**Key Points:**
- ✅ **All cases** go through dispatcher (no auto-assignment)
- ✅ **Dual status system**:
  - `Incident.status`: new → pending_dispatcher_review → assigned → in_progress → completed → closed
  - `CaseAssignment.status`: pending → accepted/rejected
- ✅ **Real-time updates**:
  - Providers poll every 5 seconds for new assignments
  - Dispatcher dashboard polls every 10 seconds for status changes

---

## 🌐 API Endpoints for Testing

### Base URL
- **Development**: `http://localhost:8000/api`
- **Production**: `https://api.kintaraa.com/api`

### Authentication Endpoints
- Login: `POST /auth/login/`
- Register: `POST /auth/register/`
- Logout: `POST /auth/logout/`
- Refresh Token: `POST /auth/refresh/`
- Profile: `GET /auth/me/`

### Incident Endpoints
- Create Incident: `POST /incidents/`
- List Incidents: `GET /incidents/`
- Get Incident: `GET /incidents/{id}/`
- Update Incident: `PATCH /incidents/{id}/`
- Upload Voice: `POST /incidents/upload-voice/`

### Provider Endpoints
- Assigned Cases: `GET /providers/assigned-cases/`
- Accept Assignment: `PATCH /incidents/{id}/accept/`
- Reject Assignment: `PATCH /incidents/{id}/reject/`
- Available Providers: `GET /providers/available/?provider_type=healthcare`

### Dispatcher Endpoints
- Dashboard Stats: `GET /dispatch/dashboard/`
- All Cases: `GET /dispatch/cases/`
- Assign Provider: `POST /dispatch/cases/{id}/assign/`
- Reassign Provider: `POST /dispatch/cases/{id}/reassign/`
- Provider Recommendations: `GET /dispatch/cases/{id}/recommendations/`

---

## 🔧 API Documentation

### Swagger UI
- **URL**: http://localhost:8000/swagger/
- Interactive API documentation with "Try it out" functionality

### ReDoc
- **URL**: http://localhost:8000/redoc/
- Clean, readable API documentation

---

## 🐛 Troubleshooting

### Network Error on Login
- **Issue**: "Network request failed" or "Cannot connect to server"
- **Solution**: Ensure Django backend is running on `http://localhost:8000`
- **Check**: Run `curl http://localhost:8000/api/auth/health/`
- **Start Backend**:
  ```bash
  cd /Users/stellaoiro/Projects/kintara-backend
  source venv/bin/activate
  python manage.py runserver 0.0.0.0:8000
  ```

### Mobile Device Testing (Same Network)
- **Issue**: Can't connect from mobile device
- **Solution**: Update API URL to use your computer's local IP instead of localhost
- **Find IP**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Update**: Edit `constants/domains/config/ApiConfig.ts` line 4
  ```typescript
  BASE_URL: __DEV__ ? 'http://192.168.x.x:8000/api' : 'https://api.kintaraa.com/api',
  ```

### Mobile Device Testing (Different Network)
- **Issue**: Mobile device on different network than development machine
- **Solution**: Use Expo tunnel mode
- **Command**: `npx expo start --tunnel`

### Invalid Credentials
- **Issue**: "Invalid email or password"
- **Solution**: Double-check you're using the exact credentials from this document
- **Reset**: If needed, recreate test users by running:
  ```bash
  cd /Users/stellaoiro/Projects/kintara-backend
  source venv/bin/activate
  python manage.py shell -c "from apps.authentication.models import User; User.objects.filter(email='survivor@kintara.com').delete()"
  ```
  Then recreate the user.

### Dispatcher Routing Bug
- **Known Issue**: Dispatcher login currently redirects to survivor dashboard
- **Workaround**: This is documented as a known issue in Day 10 progress
- **Fix Pending**: Update `app/(tabs)/_layout.tsx` to handle dispatcher role routing

---

## 📝 Test Data Notes

- All test accounts are created with `is_active=True`
- Provider accounts have associated `ProviderProfile` records
- Provider profiles have default capacity: `max_case_load=10`, `current_case_load=0`
- GBV Rescue providers are marked as `is_currently_available=True` for auto-assignment
- No incidents exist by default - create them as needed for testing

---

## 🔐 Security Notes

⚠️ **IMPORTANT**: These are test accounts for development only!

- **DO NOT** use these credentials in production
- **DO NOT** commit `.env` files with real credentials
- **DO NOT** share production API keys in this file
- All passwords should be changed before production deployment
- Production accounts should use strong, unique passwords
- Consider implementing 2FA for production

---

## 📅 Last Updated

**Date**: February 15, 2026
**Backend Version**: Django 4.2.24
**Frontend Version**: Expo SDK 54, React Native 0.81.4
**Status**: ✅ Week 2, Day 10 - Provider Assignment Workflow COMPLETE

**Latest Features:**
- ✅ All 7 provider types can receive and accept assignments
- ✅ Real-time notification bell with pending assignment counts
- ✅ Dispatcher dashboard shows full provider details for in-progress cases
- ✅ Color-coded provider type badges (GBV Rescue, Healthcare, Legal, Police, Counseling, Social, CHW)
- ✅ Centralized dispatcher queue for all incidents
- ✅ Real backend API integration (no mock data for assignments)
- ✅ Polling-based real-time updates (5s providers, 10s dispatcher)

---

## 📧 Support

For issues or questions:
- Check the main [README.md](README.md)
- Review [CLAUDE.md](CLAUDE.md) for development guidelines
- Check progress docs: `WEEK2_DAY10_STATUS.md`
- Contact: dev@rork.com
