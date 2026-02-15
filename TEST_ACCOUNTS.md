# Test Accounts for Kintara GBV Platform

This document contains login credentials for testing the Kintara mobile application. These accounts are pre-configured with different roles to test the complete workflow.

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

- **Email**: `gbv.rescue@kintara.com`
- **Password**: `provider123`
- **Role**: GBV Rescue Provider
- **Provider Type**: GBV Rescue Center
- **Features**:
  - Receive urgent case assignments (auto-assigned)
  - 24/7 emergency response
  - Hotline support management
  - Crisis intervention tracking
  - Emergency case prioritization

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

### Workflow 1: Complete Incident Reporting & Assignment

1. **Login as Survivor** (`survivor@kintara.com`)
   - Navigate to "Report Incident"
   - Fill in incident details
   - Select incident type (e.g., Physical, Sexual, Emotional)
   - Set urgency level (Routine, Urgent, or Immediate)
   - Submit the report

2. **Check Auto-Assignment** (for urgent/immediate cases)
   - If urgency is **Urgent** or **Immediate**, the system auto-assigns to GBV Rescue provider
   - If urgency is **Routine**, case goes to dispatcher queue

3. **Login as GBV Rescue Provider** (`gbv.rescue@kintara.com`)
   - Check for new assignments
   - View case details
   - Accept or reject the assignment

4. **Login as Dispatcher** (`dispatcher@kintara.com`)
   - View all cases in the system
   - Manually assign providers to routine cases
   - Reassign cases if needed
   - Monitor system statistics

---

### Workflow 2: Provider Assignment & Case Management

1. **Login as Dispatcher** (`dispatcher@kintara.com`)
   - Navigate to "Cases" tab
   - Filter cases by status: "Pending Dispatcher Review"
   - Select a case
   - Click "Assign Provider"
   - Choose appropriate provider type (Healthcare, Legal, Counseling, etc.)
   - Assign provider

2. **Login as Healthcare Provider** (`healthcare@kintara.com`)
   - View assigned cases
   - Accept the assignment
   - Update case status as you work through it
   - Mark case as completed when done

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

## 🔄 Testing Case Status Flow

Cases follow this status flow:

```
new
  → pending_dispatcher_review (routine cases)
  → assigned (after provider assignment)
  → in_progress (after provider accepts)
  → completed
  → closed
```

**OR** for urgent cases:

```
new
  → assigned (auto-assigned to GBV Rescue)
  → in_progress (after provider accepts)
  → completed
  → closed
```

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
**Frontend Version**: Expo SDK 54
**Status**: Day 10 - Provider Assignment Testing

---

## 📧 Support

For issues or questions:
- Check the main [README.md](README.md)
- Review [CLAUDE.md](CLAUDE.md) for development guidelines
- Check progress docs: `WEEK2_DAY10_STATUS.md`
- Contact: dev@rork.com
