# Kintaraa Production Deployment Guide

**Last Updated:** December 2024
**Status:** Production Ready (Pending Backend Verification)

This guide provides step-by-step instructions for deploying the Kintaraa mobile app to production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [iOS Deployment](#ios-deployment)
4. [Android Deployment](#android-deployment)
5. [Backend Configuration](#backend-configuration)
6. [Third-Party Services](#third-party-services)
7. [Testing & Quality Assurance](#testing--quality-assurance)
8. [Production Launch](#production-launch)
9. [Post-Launch Monitoring](#post-launch-monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Code Preparation (COMPLETED)

- [x] Remove duplicate API configuration files
- [x] Set up EAS build configuration (`eas.json`)
- [x] Configure production logger utility
- [x] Replace console.log statements with logger
- [x] Configure Babel to strip console logs in production
- [x] Fix WebSocket authentication (token-based)
- [x] Remove dummy test cases from ProviderContext
- [x] Set up Sentry crash reporting
- [x] Create privacy policy and terms of service

### 🔲 Backend Verification (REQUIRED)

- [ ] Verify backend API is deployed at `https://api-kintara.onrender.com/api`
- [ ] Test all authentication endpoints
- [ ] Test incident creation and retrieval
- [ ] Verify WebSocket server is running
- [ ] Configure file upload storage (S3 or equivalent)
- [ ] Set up push notification service

### 🔲 Third-Party Services (REQUIRED)

- [ ] Create Sentry account and configure DSN
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Configure Apple Push Notification Service (APNS)
- [ ] Host privacy policy and terms of service online
- [ ] Update app.json with hosted URLs

### 🔲 App Store Requirements (REQUIRED)

- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Console Account ($25 one-time)
- [ ] App icons (all sizes)
- [ ] Screenshots (required sizes for both platforms)
- [ ] App descriptions
- [ ] Keywords and categories
- [ ] Age rating questionnaire

---

## Environment Setup

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Log in to Expo

```bash
eas login
```

### 3. Configure EAS Project

```bash
eas init
# Copy the project ID and add to app.json under extra.eas.projectId
```

### 4. Update Environment Variables

Create `.env.production` file (DO NOT commit to git):

```bash
# Backend API
API_BASE_URL=https://api-kintara.onrender.com/api

# Sentry
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Firebase (for push notifications)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id

# External Services
VOICE_TRANSCRIPTION_API=https://toolkit.rork.com/stt/transcribe/
```

---

## iOS Deployment

### Step 1: Apple Developer Account Setup

1. **Create Apple Developer Account**
   - Go to https://developer.apple.com
   - Enroll in Apple Developer Program ($99/year)
   - Complete verification process

2. **Create App ID**
   - Log in to Apple Developer Console
   - Go to Certificates, Identifiers & Profiles
   - Create new identifier: `app.rork.kintaraa`
   - Enable required capabilities:
     - Push Notifications
     - Associated Domains (for deep linking)
     - Sign in with Apple (if implementing)

### Step 2: Generate Credentials

```bash
eas credentials
# Follow prompts to generate:
# - Distribution Certificate
# - Provisioning Profile
# - Push Notification Key
```

### Step 3: Build for iOS

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

### Step 4: TestFlight Beta Testing

```bash
# Submit to TestFlight
eas submit --platform ios --profile production

# Or manually upload to App Store Connect
# 1. Download .ipa file from EAS Build
# 2. Upload via Transporter app or Xcode
```

### Step 5: App Store Submission

1. **App Store Connect Setup**
   - Go to https://appstoreconnect.apple.com
   - Create new app
   - Fill in metadata:
     - Name: Kintaraa
     - Subtitle: GBV Support Platform
     - Primary Category: Health & Fitness or Social Networking
     - Age Rating: 17+ (due to sensitive content)

2. **Required Materials**
   - App Icon: 1024x1024 px
   - Screenshots: Multiple sizes per device
   - App Privacy Details (fill in questionnaire)
   - Description (max 4000 characters)
   - Keywords (100 characters)
   - Support URL: https://kintaraa.com/support
   - Privacy Policy URL: https://kintaraa.com/privacy

3. **Submit for Review**
   - Click "Submit for Review"
   - Answer additional questions
   - Review time: 24-48 hours typically

---

## Android Deployment

### Step 1: Google Play Console Setup

1. **Create Google Play Console Account**
   - Go to https://play.google.com/console
   - Pay $25 one-time registration fee
   - Complete verification

2. **Create New App**
   - Click "Create app"
   - App name: Kintaraa
   - Default language: English
   - App or game: App
   - Free or paid: Free

### Step 2: Generate Signing Keys

```bash
# EAS handles this automatically
eas credentials

# Or manually generate keystore
keytool -genkeypair -v -storetype JKS \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias kintaraa-key \
  -keystore kintaraa.jks
```

### Step 3: Build for Android

```bash
# Development build
eas build --platform android --profile development

# Production build (App Bundle for Play Store)
eas build --platform android --profile production
```

### Step 4: Internal Testing

```bash
# Submit to Internal Testing track
eas submit --platform android --profile production --track internal

# Or manually upload .aab file to Play Console
```

### Step 5: Play Store Submission

1. **Store Listing**
   - App name: Kintaraa
   - Short description (80 chars): GBV survivor support platform
   - Full description (4000 chars): Detailed description
   - Screenshots: Minimum 2, recommend 8
   - Feature graphic: 1024x500 px
   - App icon: 512x512 px

2. **Content Rating**
   - Complete IARC questionnaire
   - Expect MATURE 17+ rating due to sensitive content

3. **App Content**
   - Privacy policy: https://kintaraa.com/privacy
   - Data safety section (complete questionnaire)
   - Permissions declaration

4. **Release**
   - Select countries
   - Start with Internal Testing → Closed Testing → Open Testing → Production
   - Review time: 24-48 hours

---

## Backend Configuration

### Verify Backend Deployment

```bash
# Test production API
curl https://api-kintara.onrender.com/api/auth/health/

# Expected response:
# {"status": "healthy", "version": "1.0.0"}
```

### Configure CORS

Backend must allow origins:
- `https://kintaraa.com`
- `capacitor://localhost` (for mobile)
- `ionic://localhost` (for mobile)

### Database Setup

Ensure production database:
- Is backed up regularly
- Has proper indexes
- Connection pooling configured
- SSL enabled

### WebSocket Configuration

```python
# Django settings.py
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis.production.com", 6379)],
        },
    },
}
```

---

## Third-Party Services

### 1. Sentry Configuration

```bash
# Create Sentry project
# 1. Go to https://sentry.io
# 2. Create new project (React Native)
# 3. Copy DSN

# Update utils/sentry.ts
const SENTRY_DSN = 'https://[key]@[org].ingest.sentry.io/[project]';
```

### 2. Firebase Cloud Messaging

```bash
# iOS Setup
1. Go to Firebase Console
2. Add iOS app with bundle ID: app.rork.kintaraa
3. Download GoogleService-Info.plist
4. Add to project root

# Android Setup
1. Add Android app with package: app.rork.kintaraa
2. Download google-services.json
3. Add to project root

# Install Firebase
npm install @react-native-firebase/app @react-native-firebase/messaging --force
```

### 3. Host Privacy Policy & Terms

**Option 1: GitHub Pages** (Free)
```bash
# Create docs folder
mkdir docs
cp PRIVACY_POLICY.md docs/privacy.md
cp TERMS_OF_SERVICE.md docs/terms.md

# Enable GitHub Pages in repository settings
# Access at: https://[username].github.io/kintaraa-app/privacy
```

**Option 2: Custom Domain**
- Host on your website at kintaraa.com/privacy and kintaraa.com/terms

---

## Testing & Quality Assurance

### Pre-Launch Testing Checklist

#### Functional Testing
- [ ] User registration (survivor and provider)
- [ ] Login with email/password
- [ ] Biometric authentication (Face ID, Fingerprint)
- [ ] Incident reporting (all fields)
- [ ] Voice recording and transcription
- [ ] Location services
- [ ] Provider assignment
- [ ] Messaging
- [ ] Wellbeing tracking
- [ ] Safety plan creation
- [ ] Emergency features

#### Device Testing
- [ ] iOS (iPhone 13, 14, 15)
- [ ] iOS (iPad)
- [ ] Android (Samsung, Google Pixel)
- [ ] Low-end devices (2GB RAM)

#### Network Testing
- [ ] WiFi
- [ ] 4G/5G
- [ ] Poor connection (throttle to 3G)
- [ ] Offline mode (if implemented)

#### Security Testing
- [ ] API authentication
- [ ] Token refresh
- [ ] Logout clears data
- [ ] Anonymous reporting protects identity
- [ ] Sensitive data not logged

---

## Production Launch

### Launch Day Checklist

**T-24 hours:**
- [ ] Final backend deployment
- [ ] Database backup
- [ ] Sentry configured and tested
- [ ] Push notifications tested
- [ ] Privacy policy and terms hosted

**T-4 hours:**
- [ ] Monitor backend API health
- [ ] Check error rates in Sentry
- [ ] Verify push notification service

**T-0 (Launch):**
- [ ] Submit iOS to App Store
- [ ] Submit Android to Play Store
- [ ] Announce on social media (if applicable)
- [ ] Monitor crash reports
- [ ] Monitor backend logs

**T+1 hour:**
- [ ] Check first user registrations
- [ ] Verify incident creation works
- [ ] Check provider assignments

**T+24 hours:**
- [ ] Review crash reports
- [ ] Check user feedback
- [ ] Address critical bugs
- [ ] Plan hotfix if needed

---

## Post-Launch Monitoring

### Metrics to Monitor

**App Health:**
- Crash rate (target: < 0.5%)
- ANR rate (Android Not Responding, target: < 0.1%)
- App startup time (target: < 3 seconds)

**User Engagement:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Incident creation rate
- Provider response time

**Backend Performance:**
- API response time (target: < 200ms p95)
- Error rate (target: < 1%)
- Database query time
- WebSocket connection stability

### Monitoring Tools

1. **Sentry** - Crash and error reporting
2. **Google Analytics for Firebase** - User analytics
3. **Backend monitoring** - Server logs and metrics
4. **App Store Connect** - iOS metrics
5. **Google Play Console** - Android metrics

---

## Troubleshooting

### Build Errors

**Error:** `eas build` fails with credential issues
**Solution:**
```bash
eas credentials
# Delete and regenerate credentials
```

**Error:** Android build fails with Gradle issues
**Solution:**
```bash
cd android
./gradlew clean
cd ..
eas build --platform android --clear-cache
```

### Runtime Errors

**Error:** App crashes on startup
**Check:**
1. Sentry for error logs
2. Ensure backend API is reachable
3. Verify all required permissions granted

**Error:** Push notifications not working
**Check:**
1. FCM/APNS credentials configured
2. User granted notification permission
3. Backend sending notifications correctly

### Deployment Issues

**Error:** App Store rejection
**Common reasons:**
- Missing privacy policy
- Inadequate app description
- Permissions not explained
- Crash during review

**Solution:**
- Address all feedback
- Update metadata
- Resubmit

---

## Rollback Plan

If critical issues found after launch:

### Step 1: Immediate Response
```bash
# Disable new user registrations (backend)
# Display maintenance message in app
```

### Step 2: Hotfix
```bash
# Create fix branch
git checkout -b hotfix/critical-bug

# Make fixes
# Test thoroughly

# Build and deploy
eas build --platform all --profile production
eas submit --platform all
```

### Step 3: Force Update (if needed)
- Implement version check on app startup
- Redirect to app store for update
- Block older versions from API

---

## Contact & Support

**Technical Issues:**
- Developer email: dev@rork.com
- Sentry dashboard: https://sentry.io/kintaraa

**Business Issues:**
- Support email: support@kintaraa.com
- Emergency contact: [PHONE]

---

## Appendix: Quick Reference Commands

```bash
# Build Commands
eas build --platform ios --profile production
eas build --platform android --profile production
eas build --platform all --profile production

# Submit Commands
eas submit --platform ios
eas submit --platform android

# Update Commands (OTA - Over The Air)
eas update --branch production --message "Bug fixes"

# Credentials Management
eas credentials

# Build Status
eas build:list
eas build:view [build-id]
```

---

**End of Deployment Guide**

For questions or issues, consult:
1. Expo documentation: https://docs.expo.dev
2. EAS Build docs: https://docs.expo.dev/build/introduction/
3. App Store guidelines: https://developer.apple.com/app-store/review/guidelines/
4. Play Store policies: https://play.google.com/about/developer-content-policy/
