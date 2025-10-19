# Production Deployment Guide - Kintaraa GBV Support Platform

## Overview
This guide covers the complete deployment process for the Kintaraa GBV Support Platform to production environments.

**Last Updated**: October 19, 2025
**Version**: 1.0.0
**Target Platforms**: iOS, Android, Web

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [Web Deployment](#web-deployment)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Rollback Procedures](#rollback-procedures)

---

## Pre-Deployment Checklist

### Code Quality
- [x] All TypeScript errors resolved
- [x] ESLint warnings addressed
- [x] No console.log statements in production code
- [x] API endpoints configured
- [x] Environment variables documented

### Security
- [x] Security audit completed ([SECURITY_AUDIT.md](SECURITY_AUDIT.md))
- [ ] API keys moved to secure backend proxy
- [ ] Rate limiting implemented on backend
- [ ] SSL/TLS certificates configured
- [ ] Data Protection Officer assigned

### Testing
- [x] Sprint 3 communication system tested
- [x] Sprint 4 appointment system tested
- [ ] End-to-end user flows tested
- [ ] Performance benchmarks met
- [ ] Cross-platform compatibility verified

### Compliance
- [x] KDPA 2019 requirements documented
- [ ] User consent modals implemented
- [x] Privacy policy prepared ([COMMUNICATION_COMPLIANCE.md](COMMUNICATION_COMPLIANCE.md))
- [ ] Terms of service prepared
- [ ] Data retention policy configured

### Documentation
- [x] API documentation complete
- [x] User guides prepared
- [x] Admin documentation ready
- [x] Security audit report finalized

---

## Environment Setup

### 1. Environment Variables

Create production environment files:

#### `.env.production`
```bash
# API Configuration
API_BASE_URL=https://api.kintaraa.org
API_TIMEOUT=120000

# Expo Configuration
EXPO_PUBLIC_API_URL=https://api.kintaraa.org

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_PERFORMANCE_MONITORING=true

# App Version
APP_VERSION=1.0.0
BUILD_NUMBER=1
```

#### Backend Environment (Django)
```bash
# Django Settings
DEBUG=False
SECRET_KEY=<generate-secure-key>
ALLOWED_HOSTS=api.kintaraa.org,www.kintaraa.org

# Database
DATABASE_URL=postgresql://user:pass@host:5432/kintaraa_prod
DATABASE_SSL=True

# Twilio (SMS/Call)
TWILIO_ACCOUNT_SID=<production-sid>
TWILIO_AUTH_TOKEN=<production-token>
TWILIO_PHONE_NUMBER=<verified-number>

# Africa's Talking (Kenya SMS)
AFRICAS_TALKING_USERNAME=<username>
AFRICAS_TALKING_API_KEY=<production-key>
AFRICAS_TALKING_SENDER_ID=KINTARAA

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<sendgrid-api-key>
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@kintaraa.org

# Storage (AWS S3 or similar)
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_STORAGE_BUCKET_NAME=kintaraa-production
AWS_S3_REGION_NAME=eu-west-1

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000

# Monitoring
SENTRY_DSN=<sentry-dsn>
```

---

## Backend Deployment

### Option 1: Railway (Recommended for MVP)

#### 1. Setup Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Link to GitHub repository
railway link
```

#### 2. Configure Services
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 2,
    "startCommand": "gunicorn config.wsgi:application",
    "healthcheckPath": "/health/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 3. Add PostgreSQL Database
```bash
railway add --database postgresql
```

#### 4. Set Environment Variables
```bash
railway variables set DEBUG=False
railway variables set SECRET_KEY=<key>
# ... (set all variables from above)
```

#### 5. Deploy
```bash
railway up
```

---

### Option 2: DigitalOcean App Platform

#### 1. Create App
- Go to DigitalOcean Dashboard
- Click "Create" → "Apps"
- Connect GitHub repository
- Select branch: `main`

#### 2. Configure Build
```yaml
# .do/app.yaml
name: kintaraa-backend
services:
- name: web
  github:
    repo: your-org/kintaraa-backend
    branch: main
  build_command: pip install -r requirements.txt
  run_command: gunicorn config.wsgi:application
  http_port: 8000
  instance_size_slug: professional-xs
  instance_count: 2

databases:
- name: kintaraa-db
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb
```

#### 3. Deploy
```bash
doctl apps create --spec .do/app.yaml
```

---

### Option 3: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 kintaraa-backend

# Create environment
eb create kintaraa-prod --database.engine postgres

# Deploy
eb deploy
```

---

## Mobile App Deployment

### iOS Deployment (App Store)

#### 1. Prepare Build
```bash
# Update app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "org.kintaraa.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Kintaraa needs camera access to document evidence",
        "NSPhotoLibraryUsageDescription": "Kintaraa needs photo library access to upload evidence",
        "NSLocationWhenInUseUsageDescription": "Kintaraa needs location to find nearby providers"
      }
    }
  }
}
```

#### 2. Build with EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### 3. App Store Connect
1. Login to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill metadata:
   - **Name**: Kintaraa GBV Support
   - **Subtitle**: Survivor Support Platform
   - **Category**: Medical, Social Networking
   - **Age Rating**: 17+ (Medical/Treatment Information)
4. Upload screenshots (6.5" iPhone, 12.9" iPad)
5. Set privacy policy URL
6. Submit for review

---

### Android Deployment (Google Play)

#### 1. Prepare Build
```bash
# Update app.json
{
  "expo": {
    "android": {
      "package": "org.kintaraa.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "CALL_PHONE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#6A2CB0"
      }
    }
  }
}
```

#### 2. Build with EAS
```bash
# Build for production
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

#### 3. Google Play Console
1. Login to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill store listing:
   - **App name**: Kintaraa GBV Support
   - **Short description**: Comprehensive GBV survivor support platform for Kenya
   - **Full description**: [See below]
   - **Category**: Medical, Health & Fitness
   - **Content rating**: Mature 17+
4. Upload APK/AAB
5. Set up pricing (Free)
6. Submit for review

#### Google Play Description
```
Kintaraa is a comprehensive Gender-Based Violence (GBV) support platform designed specifically for Kenya.

Features:
• Connect survivors with healthcare, police, legal, and social services
• Secure communication with service providers
• Appointment scheduling and reminders
• Digital MOH forms (PRC Form 363, P3 Form)
• Real-time provider routing
• Crisis intervention support

Designed for:
• GBV survivors seeking support
• Healthcare providers
• Police officers
• Legal aid providers
• Social workers
• Community Health Workers (CHWs)

Privacy & Security:
• End-to-end encrypted communications
• KDPA 2019 compliant
• Secure data storage
• Role-based access control

Supported by: Ministry of Health Kenya, National Police Service Kenya
```

---

## Web Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Configure Project
```json
// vercel.json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "EXPO_PUBLIC_API_URL": "https://api.kintaraa.org"
  }
}
```

#### 3. Deploy
```bash
vercel --prod
```

#### 4. Configure Custom Domain
```bash
vercel domains add kintaraa.org
vercel domains add www.kintaraa.org
```

---

### Option 2: Netlify

#### 1. Build
```bash
npx expo export --platform web --output-dir dist
```

#### 2. Create `netlify.toml`
```toml
[build]
  command = "npx expo export --platform web"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  EXPO_PUBLIC_API_URL = "https://api.kintaraa.org"
```

#### 3. Deploy
```bash
netlify deploy --prod
```

---

## Post-Deployment

### 1. DNS Configuration
```
# A Records
kintaraa.org         → Vercel IP
www.kintaraa.org     → Vercel IP
api.kintaraa.org     → Railway/DO IP

# CNAME Records
_acme-challenge.kintaraa.org → (for SSL verification)
```

### 2. SSL/TLS Setup
- Vercel/Netlify: Auto-configured ✅
- Backend: Use Let's Encrypt or cloud provider SSL

### 3. Monitoring Setup

#### Sentry (Error Tracking)
```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

#### Analytics (Firebase or Mixpanel)
```bash
# Install Firebase
npx expo install @react-native-firebase/app @react-native-firebase/analytics

# Or Mixpanel
npm install mixpanel-react-native
```

### 4. Health Checks
```bash
# Backend health
curl https://api.kintaraa.org/health/

# Expected response:
{"status": "healthy", "database": "connected", "version": "1.0.0"}
```

---

## Monitoring & Analytics

### Metrics to Track
1. **Performance**:
   - API response times
   - App load time
   - Bundle size

2. **Usage**:
   - Daily active users (DAU)
   - Monthly active users (MAU)
   - Feature adoption rates
   - Appointment completion rate

3. **Errors**:
   - Crash rate
   - API error rate
   - Failed communications

4. **Business**:
   - Cases created
   - Provider response time
   - Form completion rate
   - Time to PEP administration

### Alerting Rules
```
- API error rate > 5% → Page on-call engineer
- Crash rate > 1% → Investigate immediately
- SMS delivery failure > 10% → Check Twilio status
- Database CPU > 80% → Scale up
```

---

## Rollback Procedures

### Mobile Apps
```bash
# iOS: Submit expedited review with previous version
# Android: Rollback in Google Play Console

# Or use EAS Update for immediate fix
eas update --branch production --message "Hotfix: Critical bug"
```

### Backend
```bash
# Railway
railway rollback

# DigitalOcean
doctl apps deployment rollback <app-id> <deployment-id>

# AWS
eb deploy --version <previous-version>
```

### Web
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## Production Support Contacts

**Technical Lead**: dev@kintaraa.org
**Security Issues**: security@kintaraa.org
**24/7 On-Call**: +254-XXX-XXXX
**Data Protection Officer**: dpo@kintaraa.org

---

## Deployment Timeline

### Week 1: Backend
- Day 1-2: Deploy Django backend
- Day 3: Configure database
- Day 4: Set up monitoring
- Day 5: Load testing

### Week 2: Mobile Apps
- Day 1-2: Build iOS/Android
- Day 3: Submit to app stores
- Day 4-7: App review process

### Week 3: Web & Final
- Day 1: Deploy web app
- Day 2: DNS configuration
- Day 3: End-to-end testing
- Day 4: Staff training
- Day 5: Soft launch

### Week 4: Full Launch
- Public announcement
- Monitor metrics
- Gather feedback
- Hot fixes as needed

---

**Deployment Checklist Complete**: ✅ Ready for Production

