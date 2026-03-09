# 🛡️ Kintaraa - GBV Support & Prevention Mobile App

> **A comprehensive React Native application connecting GBV survivors with specialized service providers through intelligent, role-based interfaces.**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📱 About Kintaraa

Kintaraa is a mobile-first platform designed to bridge the gap between Gender-Based Violence (GBV) survivors and the support services they need. The app features intelligent role-based interfaces that adapt to seven different types of service providers, ensuring each user gets the tools and workflows most relevant to their role.

### 🎯 Mission

To provide immediate, accessible, and comprehensive support for GBV survivors while empowering service providers with the tools they need to deliver effective assistance.

## ✨ Key Features

### 🚨 For Survivors

- **Anonymous Reporting** - Report incidents without creating an account
- **Emergency Features** - Quick access to emergency contacts and services
- **Voice Recording** - Speech-to-text incident reporting for accessibility
- **Safety Planning** - Personalized safety plans and emergency protocols
- **Wellbeing Tracking** - Mental health journaling and mood tracking
- **Resource Discovery** - AI-powered recommendations for support services

### 👥 For Service Providers (7 Specializations)

- **Healthcare Providers** - Patient management, appointments, medical records
- **Legal Aid** - Case law, court dates, document management
- **Law Enforcement** - Evidence tracking, case reports, investigations
- **Counselors/Therapists** - Client sessions, therapy resources, progress tracking
- **Social Services** - Resource coordination, benefit assistance
- **GBV Rescue Centers** - Crisis intervention, hotline management, rapid response
- **Community Health Workers** - Mobile-first interface, location-based outreach

### 🤖 AI-Powered Features

- **Smart Case Assignment** - Intelligent matching of cases to appropriate providers
- **Risk Assessment** - Automated danger level evaluation
- **Performance Analytics** - Provider effectiveness metrics
- **Predictive Insights** - Early warning systems for high-risk cases

## 🏗️ Technical Architecture

### Core Technologies

```json
{
  "framework": "React Native + Expo",
  "language": "TypeScript (Strict Mode)",
  "navigation": "Expo Router v6 (File-based)",
  "state": "React Query + Context API",
  "styling": "NativeWind (Tailwind CSS)",
  "auth": "Expo Local Authentication (Biometric)",
  "storage": "AsyncStorage (Local Persistence)"
}
```

### Project Structure

```
📦 Kintaraa
├── 📁 app/                    # Expo Router pages
│   ├── 📁 (auth)/            # Authentication flows
│   ├── 📁 (dashboard)/       # Provider dashboard routes
│   ├── 📁 (tabs)/            # Dynamic tab navigation
│   ├── 📁 components/        # Shared app components
│   ├── 📁 case-details/      # Dynamic case routing
│   ├── 📁 messages/          # Message/chat routes
│   ├── 📁 utils/             # Utility functions
│   └── 📄 *.tsx              # Global route pages
├── 📁 dashboards/            # Provider business logic
│   ├── 📁 [provider]/        # Each provider type
│   │   ├── 📁 components/    # Provider-specific components
│   │   └── 📄 index.tsx      # Types & exports
├── 📁 providers/             # React Context providers
├── 📁 constants/             # Data models & configuration
│   ├── 📁 domains/           # Domain-organized constants
│   │   ├── 📁 config/        # API & app configuration
│   │   ├── 📁 health/        # Health & wellbeing data
│   │   ├── 📁 safety/        # Safety & security data
│   │   └── 📁 social/        # Social services data
│   ├── 📄 DummyData.ts       # General mock data
│   └── 📄 index.ts           # Unified exports
├── 📁 hooks/                 # Custom React hooks
└── 📁 assets/               # Static resources
```

## 🚀 Quick Start

### Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | **20+** | Node 12/14/16 will fail — Expo CLI requires Node 20+ |
| **npm** | 10+ | Comes with Node 20 |
| **Expo Go** | SDK 54 | Install on phone for device testing |
| **iOS Simulator** | Xcode 15+ | macOS only — optional |
| **Android Emulator** | Android Studio | Optional |

> **Node version manager**: If you have `nvm`, run `nvm use 20` before starting.
> The system Node on some Linux distros (e.g. Ubuntu) defaults to Node 12, which is incompatible.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/kintaraa-app.git
   cd kintaraa-app
   ```

2. **Install dependencies**

   ```bash
   # --force is required to resolve React 19 peer dependency conflicts
   npm install --force
   ```

3. **Configure the backend API URL**

   Open `constants/domains/config/ApiConfig.ts` and set:

   ```ts
   API_BASE_URL: 'http://<your-local-ip>:8000/api'   // local dev
   // or
   API_BASE_URL: 'https://api-kintara.onrender.com/api' // production
   ```

   > The backend is a separate Django project (`kintara-backend`). See the backend README for setup instructions.

4. **Start the development server**

   ```bash
   npx expo start
   ```

   The QR code and interactive menu will appear in your terminal.

### Opening the App

#### On your phone (recommended)

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
2. Make sure your phone and computer are on the **same WiFi network**
3. Run `npx expo start` — scan the QR code that appears in the terminal with Expo Go

**Different networks / hotspot?** Use tunnel mode:
```bash
npx expo start --tunnel
```

#### On an emulator / simulator

With `npx expo start` running, press:
- `a` — open on Android emulator (requires Android Studio)
- `i` — open on iOS simulator (requires Xcode, macOS only)
- `w` — open in web browser (limited functionality)

### Test Accounts

Seeded by `python manage.py seed_test_data` (runs automatically on `docker compose up`).

```
survivor@kintara.com      / survivor123
dispatcher@kintara.com    / dispatcher123
gbv@kintara.com           / provider123
healthcare@kintara.com    / provider123
legal@kintara.com         / provider123
police@kintara.com        / provider123
counseling@kintara.com    / provider123
social@kintara.com        / provider123
chw@kintara.com           / provider123
```

See [TEST_ACCOUNTS.md](TEST_ACCOUNTS.md) for full workflow testing guide.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `SyntaxError: Unexpected token '?'` on start | Node version too old — upgrade to Node 20+ (`nvm use 20`) |
| `expo-notifications not installed` error | Run `npm install --force` |
| QR code doesn't connect | Use `npx expo start --tunnel` for cross-network |
| Metro won't start | `rm -rf .expo node_modules/.cache && npx expo start` |
| SDK mismatch warning | Non-blocking — app still runs; run `npx expo install --fix` to resolve |

**Full reset:**
```bash
pkill -f expo
rm -rf .expo node_modules/.cache
npm install --force
npx expo start
```

## 📱 Platform Support

| Platform    | Status             | Features                                             |
| ----------- | ------------------ | ---------------------------------------------------- |
| **iOS**     | ✅ Full Support    | Face ID, Push Notifications, Background Location     |
| **Android** | ✅ Full Support    | Fingerprint, Push Notifications, Background Location |
| **Web**     | ✅ Limited Support | Core functionality (no biometric/location)           |

## 🔧 Development

### Available Scripts

```bash
# Start dev server (phone + emulator)
npx expo start

# Start with tunnel (cross-network / hotspot)
npx expo start --tunnel

# Web only
npx expo start --web

# Code quality
npm run lint
```

### Key Development Files

| File                         | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `app/_layout.tsx`            | Root layout with providers and navigation     |
| `app/(tabs)/_layout.tsx`     | Dynamic tab navigation based on user role     |
| `app/report.tsx`             | Comprehensive incident reporting (37K+ lines) |
| `providers/AuthProvider.tsx` | Authentication and user management            |
| `constants/DummyData.ts`     | Mock data for development and testing         |

### Environment Configuration

The API URL is configured in `constants/domains/config/ApiConfig.ts` — no `.env` file needed for the frontend. Update `API_BASE_URL` and `WS_BASE_URL` directly in that file for local vs production targets.

## 🏃‍♂️ Current Status

### ✅ Completed (March 2026)

**Frontend:**
- ✅ Multi-role authentication (JWT + biometric)
- ✅ Dynamic provider dashboards (7 specializations)
- ✅ Comprehensive incident reporting with voice upload
- ✅ Real-time messaging — WebSocket primary, REST fallback (`hooks/useChatSocket.ts`)
- ✅ Provider real-time case notifications — WebSocket with exponential back-off (`hooks/useProviderWebSocket.ts`)
- ✅ Push notification token registration on login (`app/_layout.tsx`)
- ✅ Dispatcher dashboard — view all cases, assign/reassign providers
- ✅ Shared provider case management — accept/reject, status updates, case details modal
- ✅ Full backend API integration (auth, incidents, assignments, dispatch, messaging)

**Backend (`kintara-backend`):**
- ✅ Django 4.2 + Django Channels + Celery + Redis + PostgreSQL
- ✅ JWT authentication (SimpleJWT with refresh + blacklist)
- ✅ Incident CRUD, voice upload, case number generation
- ✅ Hybrid case assignment (urgent auto-assign / routine manual via dispatcher)
- ✅ WebSocket consumers: `ws/providers/` and `ws/conversations/<uuid>/`
- ✅ Full messaging REST API + push notifications via Expo Push API
- ✅ Fernet message encryption at rest
- ✅ Deployed at `https://api-kintara.onrender.com`

### 🚧 Remaining (P0)

- ❌ GBVRescueResponse model + endpoints (backend) — blocks GBV Rescue response logging
- ❌ Backend test suite (0% coverage)

### ❌ Post-MVP

- ❌ Wellbeing tracking (mood/sleep/journal) — currently mock only
- ❌ Safety plans — currently mock only
- ❌ Evidence file uploads
- ❌ Voice transcription

## 🔌 Backend API Reference

**Base URL:** `https://api-kintara.onrender.com/api` (production) or `http://<ip>:8000/api` (local)

```
# Auth
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/token/refresh/
POST   /api/auth/logout/
GET    /api/auth/me/

# Incidents
GET    /api/incidents/
POST   /api/incidents/
GET    /api/incidents/<id>/
PATCH  /api/incidents/<id>/
POST   /api/incidents/upload-voice/

# Provider Cases
GET    /api/providers/assigned-cases/
PATCH  /api/incidents/<id>/accept/
PATCH  /api/incidents/<id>/reject/

# Dispatch
GET    /api/dispatch/dashboard/
GET    /api/dispatch/cases/
POST   /api/dispatch/cases/<id>/assign/
GET    /api/dispatch/providers/

# Messaging
GET    /api/messaging/conversations/
GET    /api/messaging/conversations/<id>/messages/
POST   /api/messaging/conversations/<id>/send_message/
POST   /api/messaging/conversations/<id>/mark-all-read/
POST   /api/messaging/push-token/

# WebSocket
ws(s)://<host>/ws/conversations/<id>/?token=<JWT>
ws(s)://<host>/ws/providers/?token=<JWT>
```

## 🔒 Security & Privacy

### Implemented Security Features

- ✅ Biometric authentication (Face ID/Fingerprint)
- ✅ Role-based access control
- ✅ Anonymous user support
- ✅ Secure local storage
- ✅ Input validation & TypeScript safety

### Privacy Features

- ✅ Anonymous incident reporting
- ✅ Data minimization principles
- ✅ User control over data sharing
- ✅ Secure communication protocols (planned)

### Implemented on Backend

- ✅ JWT Bearer token authentication (SimpleJWT)
- ✅ Role-based permissions (IsAuthenticated + custom role guards)
- ✅ API rate limiting (DRF throttling)
- ✅ Message encryption at rest (Fernet AES-128)

### Pending

- ❌ Input sanitization (stub only)
- ❌ Secure evidence file storage
- ❌ Security audit & penetration testing

## 📊 Performance

### Current Metrics

| Metric         | Target      | Status       |
| -------------- | ----------- | ------------ |
| App Load Time  | < 3 seconds | ✅ Achieved  |
| Tab Navigation | < 200ms     | ✅ Optimized |
| Memory Usage   | < 150MB     | ✅ Efficient |
| Bundle Size    | < 50MB      | ✅ Optimized |

### Optimization Features

- ✅ React Query caching (5-minute stale time)
- ✅ Lazy loading with Expo Router
- ✅ Error boundaries for graceful failures
- ✅ TypeScript for compile-time optimization

## 🧪 Testing

### Current Testing Status

- ❌ Unit tests (needed)
- ❌ Integration tests (needed)
- ❌ E2E tests (needed)
- ✅ Manual testing with mock data
- ✅ Multi-device testing

### Testing Setup (Future)

```bash
# Test commands (to be implemented)
bun run test              # Run unit tests
bun run test:integration  # Run integration tests
bun run test:e2e         # Run end-to-end tests
```

## 🚀 Deployment

### Development Deployment

```bash
# Expo development build
npx expo run:ios
npx expo run:android

# Web deployment
npx expo export:web
```

### Production Deployment (Future)

- 📱 **iOS**: App Store Connect
- 🤖 **Android**: Google Play Console
- 🌐 **Web**: Vercel/Netlify deployment
- ☁️ **Backend**: AWS/Azure/GCP infrastructure

## 📖 Documentation

### Available Documentation

- 📄 `README.md` - This comprehensive project guide
- 📁 `app/components/` - Component documentation in code
- 📁 `dashboards/*/index.tsx` - Provider type definitions
- 📁 `constants/domains/` - Domain-specific data structures

### Code Architecture

- **File-based Routing**: Uses Expo Router v5 for navigation
- **Component Separation**: Shared components in `app/components/`
- **Domain Organization**: Constants organized by feature domain
- **Type Safety**: Full TypeScript coverage with strict mode

### API Documentation (Needed)

- OpenAPI/Swagger specification
- Authentication flow documentation
- WebSocket event specifications
- File upload guidelines

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode requirements
- Use existing component patterns and naming conventions
- Add error handling for new features
- Test on both iOS and Android platforms
- Update documentation for significant changes

### Code Style

- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: Functional components with hooks
- **Styling**: NativeWind (Tailwind CSS) classes
- **State**: React Query for server state, Context for local state

## 🔗 Related Projects

- **[kintara-backend](../kintara-backend)** — Django REST + Channels backend (local sibling directory)
- **Admin Dashboard** (Planned)
- **Analytics Platform** (Planned)

## 📞 Support & Contact

### Technical Support

- 📧 **Development Team**: dev@rork.com
- 💬 **Issues**: GitHub Issues
- 📚 **Documentation**: Project Wiki

### Emergency Resources

If you are in immediate danger, please contact:

- **National Emergency**: 911 (US), 999 (UK), 112 (EU)
- **National Domestic Violence Hotline**: 1-800-799-7233
- **Crisis Text Line**: Text HOME to 741741

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Rork** - Project development and funding
- **Expo Team** - Excellent React Native framework
- **Community Contributors** - Open source libraries and tools
- **GBV Survivors and Advocates** - Inspiration and requirements guidance

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/your-org/kintaraa-app)
![GitHub last commit](https://img.shields.io/github/last-commit/your-org/kintaraa-app)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/your-org/kintaraa-app)

**Built with ❤️ for social impact**

---

## 📝 Recent Updates

### March 2026 - Full Backend Integration

- ✅ Real-time messaging connected end-to-end (`hooks/useChatSocket.ts` + `services/messaging.ts`)
- ✅ Provider WebSocket notifications with exponential back-off (`hooks/useProviderWebSocket.ts`)
- ✅ Push notification token registration wired in `app/_layout.tsx`
- ✅ Dispatcher dashboard fully connected to backend API
- ✅ Shared provider case management components (`_CaseDetailsModal`, `_MyCases`)
- ✅ Dispatcher routing bug fixed

### September 2025 - Expo SDK 54 + Structure

- ✅ Upgraded to Expo SDK 54 / React Native 0.81.4 / Expo Router v6
- ✅ Domain-organized constants (`constants/domains/`)
- ✅ Shared component library

---

_Last updated: March 7, 2026_
_Version: 2.2_
_React Native: 0.81.4 | Expo: 54 | TypeScript: 5.9.2 | Node.js: 20+ required_
