# Backend Integration Testing Guide

Complete testing guide for verifying frontend-backend connectivity for the Kintaraa GBV Support App.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Testing Environment Setup](#testing-environment-setup)
3. [API Endpoint Testing](#api-endpoint-testing)
4. [Frontend Integration Testing](#frontend-integration-testing)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

---

## Prerequisites

### Required Tools
- **Mobile Device or Simulator/Emulator**
  - iOS: Physical iPhone or Xcode Simulator
  - Android: Physical Android device or Android Studio Emulator
  - Expo Go app installed (for testing)

### Backend Requirements
✅ Backend API running at: `https://api-kintara.onrender.com/api`
✅ CORS configured to allow mobile app requests
⚠️ WebSocket support (optional, for real-time features)
⚠️ Provider assignment endpoints (optional, currently using client-side logic)

### Check Backend Status
Before starting, verify your backend is accessible:
```bash
# Health check
curl https://api-kintara.onrender.com/api/auth/health/

# Expected response:
# {"success":true,"message":"Kintara Authentication API is running","timestamp":"..."}
```

---

## Testing Environment Setup

### 1. Start Development Server

```bash
# Navigate to project directory
cd /path/to/kintaraa-app

# Install dependencies if needed
npm install --force

# Start Expo development server
npx expo start
```

### 2. Connect Your Device

**Option A: Physical Device (Same WiFi)**
1. Ensure your device and computer are on the same WiFi network
2. Open Expo Go app on your device
3. Scan the QR code from terminal

**Option B: Physical Device (Different Network)**
```bash
npx expo start --tunnel
```
Scan the QR code that appears in the terminal.

**Option C: iOS Simulator**
```bash
# Press 'i' in the Expo terminal
# Or: npx expo start --ios
```

**Option D: Android Emulator**
```bash
# Press 'a' in the Expo terminal
# Or: npx expo start --android
```

### 3. Verify App Configuration

The app automatically detects production vs development:
- **Development mode (`__DEV__ = true`)**: Uses local backend or dev server
- **Production mode (`__DEV__ = false`)**: Uses `https://api-kintara.onrender.com/api`

To test with production backend in development:
1. Build for production: `eas build --profile preview`
2. Or manually update `constants/config.ts` temporarily

---

## API Endpoint Testing

### Test Authentication Endpoints

#### 1. Health Check
```bash
curl -X GET https://api-kintara.onrender.com/api/auth/health/ \
  -H "Content-Type: application/json"

# Expected: {"success":true,"message":"Kintara Authentication API is running",...}
```

#### 2. User Registration
```bash
curl -X POST https://api-kintara.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345",
    "confirm_password": "Test@12345",
    "first_name": "Test",
    "last_name": "User",
    "role": "survivor",
    "is_anonymous": false
  }'

# Expected:
# {
#   "success": true,
#   "message": "User registered successfully",
#   "user": {...},
#   "tokens": {
#     "access": "...",
#     "refresh": "..."
#   }
# }
```

#### 3. User Login
```bash
curl -X POST https://api-kintara.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'

# Expected: Same structure as registration
```

#### 4. Token Refresh
```bash
# Save refresh token from login/register
REFRESH_TOKEN="<your_refresh_token>"

curl -X POST https://api-kintara.onrender.com/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d "{\"refresh\": \"$REFRESH_TOKEN\"}"

# Expected:
# {
#   "success": true,
#   "access": "new_access_token",
#   "refresh": "new_refresh_token" (optional)
# }
```

#### 5. Get User Profile (Authenticated)
```bash
ACCESS_TOKEN="<your_access_token>"

curl -X GET https://api-kintara.onrender.com/api/auth/me/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: {"success":true,"user":{...}}
```

### Test Incident Endpoints

#### 1. List Incidents (Empty for New User)
```bash
ACCESS_TOKEN="<your_access_token>"

curl -X GET https://api-kintara.onrender.com/api/incidents/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: [] or list of incidents
```

#### 2. Create Incident
```bash
ACCESS_TOKEN="<your_access_token>"

curl -X POST https://api-kintara.onrender.com/api/incidents/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "type": "physical",
    "incident_date": "2025-11-08",
    "incident_time": "14:30:00",
    "description": "Test incident report",
    "location": {
      "address": "123 Test Street",
      "coordinates": {
        "latitude": -1.286389,
        "longitude": 36.817223
      },
      "description": "Near test landmark"
    },
    "severity": "medium",
    "support_services": ["medical", "counseling"],
    "urgency_level": "urgent",
    "is_anonymous": false
  }'

# Expected:
# {
#   "id": "...",
#   "case_number": "KIN-20251108001",
#   "status": "new",
#   ...
# }
```

#### 3. Get Incident Details
```bash
ACCESS_TOKEN="<your_access_token>"
INCIDENT_ID="<incident_id_from_create>"

curl -X GET https://api-kintara.onrender.com/api/incidents/$INCIDENT_ID/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: Full incident details
```

#### 4. Update Incident
```bash
ACCESS_TOKEN="<your_access_token>"
INCIDENT_ID="<incident_id>"

curl -X PATCH https://api-kintara.onrender.com/api/incidents/$INCIDENT_ID/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "description": "Updated description with more details"
  }'

# Expected: Updated incident object
```

---

## Frontend Integration Testing

### Test Flow 1: Survivor Registration & Incident Reporting

**Steps:**
1. **Launch App**
   - App should show welcome screen

2. **Register New Account**
   - Tap "Get Started" or "Register"
   - Fill in:
     - Email: `survivor1@test.com`
     - Password: `Test@12345` (confirm)
     - First Name: `Jane`
     - Last Name: `Doe`
     - Role: Select "Survivor"
   - Tap "Create Account"

   **Expected Result:**
   - ✅ Registration succeeds
   - ✅ Redirects to survivor dashboard
   - ✅ Dashboard shows "Welcome, Jane"

3. **Create Incident Report**
   - Navigate to "Report" tab
   - Fill in incident details:
     - Type: Select "Physical Violence"
     - Date: Today
     - Time: Current time
     - Location: Enter address or use location picker
     - Description: "Test incident report from mobile app"
     - Severity: Medium
     - Support Services: Select "Medical" and "Counseling"
     - Urgency: Urgent
   - Tap "Submit Report"

   **Expected Result:**
   - ✅ Success message appears
   - ✅ Case number displayed (e.g., KIN-20251108001)
   - ✅ Redirects to "My Cases" showing the new incident

4. **View Incident Details**
   - Tap on the newly created incident in "My Cases"

   **Expected Result:**
   - ✅ All incident details displayed correctly
   - ✅ Status shows "New" or "Pending"
   - ✅ Case number matches

5. **Logout and Login**
   - Navigate to Profile → Logout
   - Tap "Login"
   - Enter credentials: `survivor1@test.com` / `Test@12345`
   - Tap "Sign In"

   **Expected Result:**
   - ✅ Login succeeds
   - ✅ Redirects to survivor dashboard
   - ✅ Previous incident still visible in "My Cases"

---

### Test Flow 2: Provider Registration & Dashboard

**Steps:**
1. **Register as Provider**
   - Tap "Register" from welcome screen
   - Fill in:
     - Email: `provider1@test.com`
     - Password: `Test@12345`
     - First Name: `Dr. Sarah`
     - Last Name: `Johnson`
     - Role: Select "Service Provider"
     - Provider Type: Select "Healthcare"
   - Tap "Create Account"

   **Expected Result:**
   - ✅ Registration succeeds
   - ✅ Redirects to healthcare provider dashboard
   - ✅ Dashboard shows provider-specific tabs

2. **View Provider Dashboard**
   - Check dashboard stats

   **Expected Result:**
   - ✅ Shows "Active Cases: 0" (no assignments yet)
   - ✅ Shows provider profile information
   - ⚠️ **Note:** Provider assignments currently use mock data until backend implements provider endpoints

3. **Check Notifications**
   - Navigate to Notifications tab

   **Expected Result:**
   - ✅ No errors
   - ⚠️ Real-time notifications require WebSocket backend support

---

### Test Flow 3: Error Handling

**Test Network Errors:**
1. Enable airplane mode on device
2. Try to register/login

   **Expected Result:**
   - ✅ Shows "Network error. Please check your internet connection."
   - ✅ App doesn't crash

**Test Invalid Credentials:**
1. Try to login with wrong password

   **Expected Result:**
   - ✅ Shows error message from backend
   - ✅ Doesn't log in

**Test Form Validation:**
1. Try to register with:
   - Invalid email
   - Password too short
   - Mismatched passwords

   **Expected Result:**
   - ✅ Shows validation errors
   - ✅ Prevents submission

---

## Troubleshooting

### Issue: "Network error" on all API calls

**Solution 1: Check Backend CORS**
```bash
# Test if backend is accessible
curl -i https://api-kintara.onrender.com/api/auth/health/

# Look for CORS headers in response:
# Access-Control-Allow-Origin: *
```

If 403 "Access denied":
- Update Render environment: `CORS_ALLOW_ALL_ORIGINS=True`
- Or add specific origins to `CORS_ALLOWED_ORIGINS`

**Solution 2: Check Backend is Running**
- Go to Render dashboard
- Check service status
- View logs for errors

**Solution 3: Check API URL**
```typescript
// In app, check console logs
// Should see: "🔧 API Configuration: { baseUrl: 'https://api-kintara.onrender.com/api' }"
```

### Issue: Registration succeeds but can't see data

**Check Backend Database:**
- Go to Render dashboard → PostgreSQL
- Verify users table has the new user
- Check incidents table for created incidents

### Issue: Can't connect on device

**For Same WiFi Connection:**
```bash
# Ensure firewall allows Expo port 8081
# Restart Expo server
npx expo start -c
```

**For Different Networks:**
```bash
# Use tunnel mode
npx expo start --tunnel
```

### Issue: App shows old data after backend update

**Clear App Cache:**
1. Close app completely
2. Reopen and pull to refresh
3. Or restart Expo server: `npx expo start -c`

---

## Next Steps

### ✅ Currently Working (Integrated with Backend)
- [x] User authentication (register, login, logout, profile)
- [x] Incident management (create, list, update, view details)
- [x] Token refresh and session management
- [x] Error handling and user feedback

### ⚠️ Pending Backend Implementation

#### 1. Provider Assignment Endpoints
**Backend needs to implement:**
```
POST   /api/providers/                     # Create provider profile
GET    /api/providers/                     # List providers
GET    /api/providers/me/                  # Get my provider profile
PUT    /api/providers/me/update/           # Update provider profile
GET    /api/providers/assignments/         # Get my assignments
POST   /api/providers/assignments/{id}/accept/   # Accept case
POST   /api/providers/assignments/{id}/decline/  # Decline case
```

**Frontend ready:**
- `services/providers.ts` - Complete API service ready to use
- `services/api.ts` - Endpoints defined (commented out)

**To enable:**
1. Backend implements provider endpoints
2. Uncomment provider endpoints in `services/api.ts` (lines 37-50)
3. Update `ProviderContext.tsx` to use `services/providers.ts`
4. Test provider assignment flow

#### 2. WebSocket Real-Time Updates
**Backend needs to implement:**
```
WS     wss://api-kintara.onrender.com/ws/notifications/
```

**Frontend ready:**
- `hooks/useWebSocket.ts` - Complete WebSocket implementation
- Automatic reconnection with exponential backoff
- Token-based authentication

**To enable:**
1. Backend implements Django Channels or similar WebSocket support
2. Configure Redis for WebSocket connections
3. Test with `useWebSocket` hook

#### 3. File Upload Support
**Backend needs:**
- S3 or file storage configured (currently shows placeholder credentials)
- Evidence upload endpoint for incidents
- Document attachment endpoints

**Frontend ready:**
- `services/incidents.ts` - `uploadVoiceRecording()` function ready
- Form data handling implemented

#### 4. Messaging System
**Backend needs:**
```
GET    /api/incidents/{id}/messages/       # Get messages for incident
POST   /api/incidents/{id}/messages/       # Send message
```

**Frontend ready:**
- Message UI components in dashboard
- Message state management in providers

---

## Testing Checklist

### API Connectivity
- [ ] Health check endpoint responds
- [ ] Registration creates user in database
- [ ] Login returns valid JWT tokens
- [ ] Token refresh works before expiry
- [ ] Authenticated endpoints require token
- [ ] Logout invalidates tokens

### Incident Management (Survivor)
- [ ] Can create new incident
- [ ] Incident appears in "My Cases"
- [ ] Can view incident details
- [ ] Can update incident description
- [ ] Case number generated correctly
- [ ] Location data saved properly
- [ ] Support services selection works

### Authentication Flow
- [ ] Can register as survivor
- [ ] Can register as provider
- [ ] Can login after registration
- [ ] Can logout and login again
- [ ] Profile displays correct user data
- [ ] Anonymous registration works

### Error Handling
- [ ] Network errors show user-friendly message
- [ ] Invalid credentials show error
- [ ] Form validation prevents bad submissions
- [ ] App handles backend errors gracefully
- [ ] Offline mode shows appropriate message

### Provider Features (Limited)
- [ ] Provider can register
- [ ] Provider dashboard loads
- [ ] ⚠️ Provider assignments use mock data (backend not ready)
- [ ] ⚠️ Real-time notifications not available (WebSocket not ready)

---

## Manual Testing Script

```bash
# Run this script to test all backend endpoints
./scripts/test-backend-api.sh
```

This automated script tests:
1. Health check
2. User registration
3. User login
4. Token refresh
5. Get profile
6. Create incident
7. List incidents
8. Update incident
9. Get incident details

---

## Production Readiness

### Before App Store Launch:
1. ✅ Backend API accessible from internet
2. ✅ CORS properly configured
3. ✅ Authentication working
4. ✅ Incidents API working
5. ⚠️ Configure real S3 credentials (currently placeholders)
6. ⚠️ Implement provider assignment endpoints
7. ⚠️ Configure WebSocket/Redis for real-time features
8. ⚠️ Set up proper database backups
9. ⚠️ Configure monitoring (Sentry, logging)
10. ⚠️ SSL certificate valid

### Testing Environments
- **Development:** Local Django server
- **Staging:** Render.com with test database
- **Production:** Render.com with production database

---

## Support

If you encounter issues:
1. Check backend logs in Render dashboard
2. Check app console logs in Expo Dev Tools
3. Verify environment variables in Render
4. Test endpoints with curl/Postman
5. Review error messages in Sentry (once configured)

## Summary

**Current Status:**
- ✅ Authentication: **Fully Integrated**
- ✅ Incidents: **Fully Integrated**
- ⚠️ Provider Assignments: **Frontend Ready, Backend Pending**
- ⚠️ WebSocket: **Frontend Ready, Backend Pending**
- ⚠️ File Uploads: **Frontend Ready, Backend Storage Pending**

The app is **production-ready for survivors** to register, login, and submit incident reports. Provider features will be fully functional once backend implements provider assignment endpoints.
