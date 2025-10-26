# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kintaraa is a React Native + Expo mobile application designed to connect GBV (Gender-Based Violence) survivors with specialized service providers. The app features **intelligent role-based interfaces** for 7 different provider types (healthcare, legal, police, counseling, social services, GBV rescue centers, and community health workers) plus survivor dashboards.

**Current Status:** Frontend 98% complete, awaiting backend API integration.

## Development Commands

### Starting the Development Server

```bash
# Recommended: For mobile device testing with Expo Go
npx expo start

# For web development only (no mobile features)
npx expo start --web --offline

# For local network development (same WiFi)
npx expo start

# Alternative: Custom scripts (requires Bun runtime)
npm run start          # Start with tunnel (uses bunx rork)
npm run start-web      # Start web only
```

**Important Notes:**

- Use `--tunnel` flag for device testing across different networks
- QR code appears in the terminal (not browser) for Expo Go connection
- Web mode has limited functionality (no biometric, location, or native features)
- Always use `npm install --force` due to React 19 compatibility issues

### Code Quality

```bash
npm run lint           # Run ESLint
```

### Testing

Currently, the app uses mock data and manual testing. No automated test suite is implemented yet.

## Architecture Overview

### Technology Stack

- **Framework:** React Native 0.81.4 + Expo SDK 54
- **Language:** TypeScript 5.9.2 (strict mode)
- **Navigation:** Expo Router v6 (file-based routing)
- **State Management:** React Query + Context API
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Authentication:** Expo Local Authentication (biometric)
- **Storage:** AsyncStorage (local persistence)

### Core Architecture Patterns

#### 1. File-Based Routing (Expo Router v6)

The app uses Expo Router's file-based routing system where the file structure in `app/` directly maps to routes:

- **Route Groups:** `(auth)`, `(dashboard)`, `(tabs)` - directories wrapped in parentheses don't appear in URL
- **Dynamic Routes:** `[id].tsx` - dynamic route segments (e.g., `/case-details/123`)
- **Layout Routes:** `_layout.tsx` - shared layouts for nested routes

**Navigation Flow:**

```
Root Layout (_layout.tsx)
  ├── (auth) - Authentication flow
  │   ├── welcome.tsx
  │   ├── login.tsx
  │   └── register.tsx
  ├── (tabs) - Tab navigation router (redirects based on user role)
  └── (dashboard) - Provider-specific dashboards
      ├── survivor/
      ├── healthcare/
      ├── legal/
      ├── police/
      ├── counseling/
      ├── social/
      ├── gbv_rescue/
      └── chw/
```

#### 2. Context-Based State Management

The app uses multiple context providers that wrap the entire app in `app/_layout.tsx`:

**Provider Hierarchy (from outer to inner):**

```
SafeAreaProvider
  └── ErrorBoundary
      └── QueryClientProvider (React Query)
          └── GestureHandlerRootView
              └── AuthProvider (user authentication)
                  └── SafetyProvider (safety plans)
                      └── IncidentProvider (incident reports)
                          └── ProviderContext (provider assignments)
                              └── WellbeingProvider (mental health)
                                  └── RecommendationProvider (AI)
```

**Key Contexts:**

- `AuthProvider` - User authentication, login/logout, biometric auth
- `IncidentProvider` - Incident/case management, CRUD operations
- `ProviderContext` - Provider assignments, notifications, case routing
- `WellbeingProvider` - Mental health tracking, mood logs, journaling
- `SafetyProvider` - Safety plans, emergency contacts
- `RecommendationProvider` - AI-powered service recommendations

#### 3. Domain-Organized Constants

Constants are organized by feature domain in `constants/domains/`:

```
constants/
  ├── domains/
  │   ├── config/       # API config, app settings
  │   ├── health/       # Health data, CHW resources
  │   ├── safety/       # Safety plans, emergency contacts
  │   └── social/       # Social services, community resources
  ├── DummyData.ts      # General mock data
  └── index.ts          # Unified exports
```

**Usage:** Import from `@/constants` for unified access to all constants.

#### 4. Dashboard Architecture

Each provider type has its own dashboard module in `dashboards/[provider]/`:

```
dashboards/
  └── [provider]/
      ├── components/         # Provider-specific components
      │   ├── DashboardOverview.tsx
      │   ├── [Feature]List.tsx
      │   └── [Provider]Profile.tsx
      └── index.tsx           # Types and exports
```

**Provider Types:**

- `healthcare` - Patient management, appointments, medical records
- `legal` - Case law, court dates, document management
- `police` - Evidence tracking, investigations
- `counseling` - Client sessions, therapy resources
- `social` - Resource coordination, benefit assistance
- `gbv_rescue` - Crisis intervention, hotline management
- `chw` - Community health, mobile-first outreach

#### 5. Shared Components

Reusable components are in `app/components/`:

- `_StatCard.tsx` - Dashboard statistics cards
- `_RouteErrorBoundary.tsx` - Route-level error handling
- `_Toast.tsx` - Toast notification component

**Note:** Component files are prefixed with `_` so Expo Router ignores them as routes.

### Data Flow Architecture

#### Authentication Flow

1. User enters credentials in `(auth)/login.tsx`
2. `AuthProvider` calls `AuthService.login()` (real API)
3. JWT tokens stored in AsyncStorage
4. User data cached in React Query
5. `(tabs)/_layout.tsx` redirects based on role:
   - Providers → `/(dashboard)/[providerType]`
   - Survivors → `/(dashboard)/survivor`

#### Provider Assignment Flow

1. Survivor submits incident via `report.tsx`
2. `IncidentProvider` creates incident (currently mock, will be API)
3. `ProviderRoutingService` intelligently assigns providers based on:
   - Provider type match
   - Geographic proximity
   - Availability
   - Response time
   - Workload
4. `ProviderContext` polls for new assignments every 5 seconds
5. Provider receives notification via `NotificationService`
6. Provider accepts/declines assignment
7. Case appears in provider's dashboard

#### Real-time Updates (Planned)

Currently polling-based; will use WebSocket for real-time:

- Case assignments
- Messages
- Status updates
- Emergency alerts

Use `useWebSocket` hook (in `hooks/useWebSocket.ts`) when backend is ready.

## Important Development Guidelines

### TypeScript Strict Mode

The project uses **strict mode** TypeScript:

- No `any` types allowed
- All props must be typed
- Null checks required
- Use type definitions from provider contexts and dashboard index files

### Import Paths

Use the `@/` alias for absolute imports:

```typescript
import { useAuth } from "@/providers/AuthProvider";
import { DUMMY_INCIDENTS } from "@/constants";
import { StatCard } from "@/app/components/_StatCard";
import { Toast } from "@/app/components/_Toast";
```

### Error Handling Pattern

Always wrap async operations with try-catch and provide user feedback:

```typescript
try {
  await someOperation();
} catch (error) {
  console.error("Operation failed:", error);
  // Show user-friendly error message
  Alert.alert("Error", "Failed to complete operation");
}
```

### Loading States

Use React Query's loading states for async operations:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["key"],
  queryFn: async () => {
    /* fetch data */
  },
});

if (isLoading) return <ActivityIndicator />;
if (error) return <ErrorView error={error} />;
```

### Navigation

Use Expo Router's navigation hooks:

```typescript
import { useRouter, useLocalSearchParams } from "expo-router";

const router = useRouter();
router.push("/(dashboard)/healthcare");

// For dynamic routes
const { id } = useLocalSearchParams();
```

### Styling with NativeWind

Use Tailwind-style classes via `className` prop:

```typescript
<View className="flex-1 bg-purple-50 p-4">
  <Text className="text-xl font-bold text-purple-900">Title</Text>
</View>
```

### Mock Data vs Real API

**Current State:** App uses mock data from `constants/DummyData.ts`

**When Backend is Ready:**

1. Replace mock functions in providers with real API calls
2. Use `services/api.ts` and `services/authService.ts` as patterns
3. Update `constants/domains/config/ApiConfig.ts` with real API URLs
4. Test with real data incrementally

**Services Already Prepared for Backend:**

- `services/api.ts` - Base API client with error handling
- `services/authService.ts` - Authentication endpoints
- `services/providerRouting.ts` - Provider assignment logic
- `services/notificationService.ts` - Push notifications
- `services/providerResponseService.ts` - Provider responses

## Common Development Tasks

### Adding a New Provider Dashboard Feature

1. Create component in `dashboards/[provider]/components/NewFeature.tsx`
2. Add types to `dashboards/[provider]/index.tsx`
3. Import and use in dashboard route `app/(dashboard)/[provider]/feature.tsx`
4. Add navigation tab in `app/(dashboard)/[provider]/_layout.tsx`

### Adding a New Route

1. Create file in `app/` directory (e.g., `app/new-feature.tsx`)
2. Add screen config in `app/_layout.tsx` Stack.Screen
3. Navigate using `router.push('/new-feature')`

### Modifying User Types

1. Update `User` interface in `providers/AuthProvider.tsx`
2. Update API response mapping in `convertApiUserToAppUser()`
3. Update backend API contract if needed

### Adding Mock Data

1. Add data to appropriate domain file in `constants/domains/`
2. Export from `constants/index.ts`
3. Use in provider contexts or components

### Testing on Device

1. Install Expo Go app on phone (iOS App Store / Google Play)
2. Run `npx expo start --tunnel`
3. Scan QR code in terminal with Expo Go
4. Hot reload works automatically

### Testing Biometric Authentication

**iOS Simulator:**

- Go to Features → Face ID → Enrolled
- Use Cmd+Shift+M to simulate Face ID

**Android Emulator:**

- Settings → Security → Fingerprint
- Use `adb -e emu finger touch 1` to simulate

## Backend Integration Checklist

When backend API is ready:

### 1. API Configuration

- [ ] Update `API_BASE_URL` in `constants/domains/config/ApiConfig.ts`
- [ ] Update `WEBSOCKET_URL` for real-time features
- [ ] Configure authentication headers

### 2. Authentication

- [ ] Test login/register with real endpoints
- [ ] Verify JWT token refresh flow
- [ ] Test biometric authentication

### 3. Incidents/Cases

- [ ] Replace mock incident creation with API calls
- [ ] Implement real-time case updates via WebSocket
- [ ] Test file uploads for evidence

### 4. Provider Routing

- [ ] Connect `ProviderRoutingService` to backend assignment API
- [ ] Test provider notification delivery
- [ ] Verify assignment acceptance/rejection flow

### 5. Real-time Features

- [ ] Enable WebSocket connections using `useWebSocket` hook
- [ ] Test message delivery
- [ ] Test case status updates
- [ ] Test emergency alerts

### 6. File Uploads

- [ ] Implement evidence upload in `report.tsx`
- [ ] Add profile photo uploads
- [ ] Test document attachments

### 7. Push Notifications

- [ ] Configure Expo push notifications
- [ ] Test notification delivery
- [ ] Handle notification taps

## Troubleshooting

### "Metro bundler not starting"

```bash
rm -rf .expo node_modules/.cache
npx expo start
```

### "SDK version mismatch"

Ensure Expo Go app on device matches Expo SDK 54. Update Expo Go if needed.

### "Can't connect with QR code"

1. Check both devices on same WiFi (or use `--tunnel`)
2. Try manual URL entry in Expo Go
3. Use `npx expo start --tunnel` for cross-network

### "Import path errors"

- Verify `@/` alias in `tsconfig.json` paths
- Restart TypeScript server in IDE
- Run `npx expo start -c` to clear cache

### "React 19 compatibility warnings"

Use `npm install --force` - app uses React 19, some dependencies expect React 18

## Security Considerations

### Sensitive Data

- **Never commit** `.env` files with real API keys
- Use `expo-constants` for environment variables
- Store tokens securely in AsyncStorage (encrypted on device)

### User Privacy

- Respect anonymous user preferences
- Implement data minimization
- Location data should be optional and clearly disclosed

### GBV-Specific Concerns

- Emergency contacts should be quickly accessible
- Consider "quick exit" button for safety
- Handle evidence securely and privately
- Implement proper access controls for sensitive case data

## Project-Specific Patterns

### Case Number Format

`KIN-YYYYMMDDNNN` (e.g., KIN-241210001)

### Status Flow

`pending → assigned → in_progress → completed`

### Priority Levels

`low | medium | high | critical`

### Provider Response Times

- Immediate: < 15 minutes
- Urgent: < 30 minutes
- Routine: < 60 minutes

### Role-Based Access

Check user role before rendering sensitive features:

```typescript
const { user } = useAuth();
if (user?.role === "provider") {
  // Show provider features
}
```

## Known Issues & Limitations

1. **No automated tests** - Manual testing only
2. **Mock data only** - Backend integration pending
3. **No file uploads** - Requires backend storage
4. **No real-time messaging** - Polling-based updates
5. **Limited web support** - Mobile-first, web has reduced features

## Resources

- **Expo Documentation:** https://docs.expo.dev/
- **React Query Docs:** https://tanstack.com/query/latest
- **Expo Router Guide:** https://expo.github.io/router/docs/
- **NativeWind Docs:** https://www.nativewind.dev/

## Getting Help

- Check existing GitHub Issues
- Review comprehensive README.md
- Consult inline code documentation
- Contact development team at dev@rork.com
