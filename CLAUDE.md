# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kintaraa is a React Native mobile application for Gender-Based Violence (GBV) support and prevention. It connects GBV survivors with specialized service providers through role-based interfaces. The app supports 7 different provider types (healthcare, legal, police, counseling, social services, GBV rescue centers, community health workers) plus survivor-facing features.

**Tech Stack:**
- React Native 0.81.4 + Expo SDK 54
- TypeScript 5.9.2 (strict mode)
- Expo Router v6 (file-based routing)
- TanStack React Query for state management
- AsyncStorage for local persistence
- Expo Local Authentication for biometric auth

## Development Commands

### Running the App

```bash
# Recommended: Mobile development with tunnel (connects across networks)
npx expo start --tunnel

# Local network development (phone and computer on same WiFi)
npx expo start

# Web development only
npx expo start --web --offline

# With custom port
npx expo start --port 8085

# Legacy scripts (requires Bun runtime)
npm run start        # Uses bunx rork with tunnel
npm run start-web    # Web with tunnel
```

### Code Quality

```bash
# Linting
npm run lint
```

### Important Installation Notes

- Always install dependencies with `--force` flag due to React 19 compatibility:
  ```bash
  npm install --force
  ```
- The app uses React 19 but some dependencies expect React 18
- Expo SDK 54 is required for Expo Go compatibility

## Architecture Overview

### File-Based Routing Structure

The app uses Expo Router v6 with file-based routing. Routes are organized in the `app/` directory:

```
app/
├── (auth)/              # Authentication flow - login, register, welcome
├── (dashboard)/         # Provider-specific dashboards (8 role types)
│   ├── healthcare/
│   ├── legal/
│   ├── police/
│   ├── counseling/
│   ├── social/
│   ├── gbv_rescue/
│   ├── chw/
│   └── survivor/
├── (tabs)/              # Dynamic tab navigation (redirects to appropriate dashboard)
├── case-details/[id].tsx    # Dynamic case detail route
├── messages/[id].tsx        # Message/chat routes
├── components/              # Shared app-level components
├── report.tsx              # Incident reporting form (modal)
├── emergency.tsx           # Emergency modal
├── recommendations.tsx     # AI recommendations
└── _layout.tsx            # Root layout with providers
```

**Navigation Flow:**
1. Unauthenticated users → `/(auth)/welcome`
2. Authenticated providers → `/(dashboard)/[providerType]` based on their role
3. Authenticated survivors → `/(dashboard)/survivor`

### Provider System Architecture

The app uses React Context providers for global state, wrapped in the root layout:

```typescript
// Nesting order (from outermost to innermost):
<SafeAreaProvider>
  <ErrorBoundary>
    <QueryClientProvider>         // TanStack React Query
      <GestureHandlerRootView>
        <AuthProvider>             // User authentication & session
          <SafetyProvider>         // Emergency & safety features
            <IncidentProvider>     // Report management
              <ProviderContext>    // Provider-specific data
                <WellbeingProvider>    // Mental health tracking
                  <RecommendationProvider>  // AI suggestions
```

**Key Providers:**
- `AuthProvider` (`providers/AuthProvider.tsx`) - Manages authentication state, login/logout, biometric auth, and integrates with backend API
- `IncidentProvider` (`providers/IncidentProvider.tsx`) - Manages incident reports
- `SafetyProvider` (`providers/SafetyProvider.tsx`) - Emergency contacts and safety features
- `WellbeingProvider` (`providers/WellbeingProvider.tsx`) - Mental health and mood tracking
- `RecommendationProvider` (`providers/RecommendationProvider.tsx`) - AI-powered recommendations

### Backend Integration

The app integrates with a Django REST API backend. Key service files:

- `services/api.ts` - Core HTTP client with authentication, token refresh, and error handling
- `services/authService.ts` - Authentication endpoints (login, register, profile, biometric)
- `services/index.ts` - Service aggregation and exports

**API Configuration:**
- Development: `http://127.0.0.1:8000/api` (local Django server)
- Production: `https://api-kintara.onrender.com/api`
- Config location: `constants/config.ts` → `APP_CONFIG.API.BASE_URL`
- Current mode: Both dev and prod use production URL (see `constants/config.ts:22`)

**Authentication Flow:**
1. Login/register via `authService.ts`
2. Tokens stored in AsyncStorage
3. AuthProvider manages user state
4. API client automatically includes Bearer token in requests
5. Automatic token refresh on 401 responses

### Dashboard Architecture

Each provider type has its own dashboard in `dashboards/[type]/`:

```
dashboards/
├── healthcare/
│   ├── components/        # Healthcare-specific UI components
│   │   ├── DashboardOverview.tsx
│   │   ├── PatientsList.tsx
│   │   ├── AppointmentsList.tsx
│   │   └── MedicalRecords.tsx
│   └── index.tsx          # Type definitions and exports
├── legal/
├── police/
├── counseling/
├── social/
├── gbv_rescue/
├── chw/
└── survivor/
```

**Dashboard Organization Pattern:**
1. Each `dashboards/[type]/index.tsx` exports components and TypeScript interfaces
2. Components are imported in `app/(dashboard)/[type].tsx` route files
3. Dashboards are tab-based with role-specific features

### Constants Organization

Constants are organized by domain in `constants/domains/`:

```
constants/
├── domains/
│   ├── config/          # API & app configuration
│   ├── health/          # Health & wellbeing data
│   ├── safety/          # Safety & security data
│   └── social/          # Social services data
├── DummyData.ts         # Mock data for development
└── index.ts             # Unified exports
```

**Key Configuration Files:**
- `constants/config.ts` - Central app configuration (API URLs, feature flags, validation rules)
- `constants/DummyData.ts` - Mock users, cases, messages for development

## Key Development Patterns

### TypeScript Usage

- **Strict mode is enabled** - All code must have proper types
- No `any` types allowed without explicit justification
- Use type inference when obvious, explicit types for function signatures
- Provider types: `'healthcare' | 'legal' | 'police' | 'counseling' | 'social' | 'gbv_rescue' | 'chw'`
- User roles: `'survivor' | 'provider' | 'admin'`

### Context Hook Pattern

Custom hooks are created using `@nkzw/create-context-hook`:

```typescript
import createContextHook from '@nkzw/create-context-hook';

export const [MyProvider, useMyContext] = createContextHook(() => {
  // Hook logic here
  return { /* context value */ };
});
```

### React Query Usage

- Default stale time: 5 minutes
- Default retry: 3 attempts
- Use mutations for write operations
- Invalidate queries after mutations to refresh data

### Path Aliases

Import paths use `@/` alias mapped to project root:

```typescript
import { useAuth } from '@/providers/AuthProvider';
import { APP_CONFIG } from '@/constants/config';
import { DashboardOverview } from '@/dashboards/healthcare';
```

### Styling Approach

- Use React Native StyleSheet API (not NativeWind/Tailwind)
- Define styles at component level with `StyleSheet.create()`
- Color constants available in `constants/config.ts` → `COLORS`
- Brand colors: Primary Purple (#6A2CB0), Secondary Pink (#E24B95)

## Important Implementation Details

### Authentication & Biometric

- Biometric auth only works on native platforms (not web)
- Check `Platform.OS === 'web'` before using biometric features
- Biometric flow: `LocalAuthentication.authenticateAsync()` → verify → call API
- Tokens automatically refreshed on 401 responses

### Mock Data vs Real API

The app is designed to work with both mock data (development) and real API (production):

- Mock data: `constants/DummyData.ts` contains test users and cases
- API integration: Services in `services/` directory
- Feature flag: `APP_CONFIG.FEATURES` in `constants/config.ts`

**Test Accounts (mock data):**
- Survivors: `survivor@test.com` / any password
- Providers: `doctor@test.com`, `legal@test.com`, `police@test.com`, etc.

### Error Handling

- Root-level error boundary in `app/_layout.tsx`
- Route-level error boundary: `app/components/RouteErrorBoundary.tsx`
- API errors: `ApiError` class in `services/api.ts` with detailed error messages
- Loading states managed via React Query `isPending` and `isLoading`

### Form Validation

Validation rules in `constants/config.ts` → `APP_CONFIG.VALIDATION`:
- Password: min 8 chars, must include uppercase, lowercase, numbers, special chars
- Email: Standard email regex validation

## Platform-Specific Considerations

### iOS
- Face ID permission in Info.plist
- Location permissions for background tracking
- Audio permissions for voice recording
- Bundle ID: `app.rork.kintaraa`

### Android
- Fingerprint/biometric permissions
- Location permissions (foreground + background)
- Audio recording permissions
- Package name: `app.rork.kintaraa`

### Web
- Limited support (no biometric, limited location services)
- Use `Platform.OS === 'web'` checks for platform-specific features
- Primarily for testing UI components

## Common Development Tasks

### Adding a New Route

1. Create file in `app/` directory (e.g., `app/new-feature.tsx`)
2. Add Stack.Screen in `app/_layout.tsx` if needed
3. Import required providers via `useAuth()`, `useIncident()`, etc.
4. Follow existing route patterns for authentication checks

### Adding a New Provider Type

1. Update `PROVIDER_TYPES` in `constants/config.ts`
2. Create dashboard directory: `dashboards/[new-type]/`
3. Create dashboard route: `app/(dashboard)/[new-type].tsx`
4. Add Stack.Screen in `app/(dashboard)/_layout.tsx`
5. Update navigation logic in `app/(tabs)/_layout.tsx`

### Working with the Incident Report Form

The incident report form (`app/report.tsx`) is a comprehensive multi-step form:
- Presented as a modal (`presentation: "modal"` in Stack.Screen)
- Uses multiple sections: incident details, location, medical info, evidence
- Integrates with `IncidentProvider` for state management
- Supports voice recording and file attachments

## Environment Variables & Configuration

The app uses centralized configuration in `constants/config.ts`:

```typescript
APP_CONFIG.API.BASE_URL          // API endpoint
APP_CONFIG.FEATURES              // Feature flags
APP_CONFIG.VALIDATION            // Validation rules
APP_CONFIG.STORAGE               // Storage keys
```

No `.env` file is currently used - configuration is code-based.

## Known Issues & Workarounds

1. **React 19 Compatibility:** Some dependencies expect React 18. Always use `npm install --force`
2. **Tunnel Mode Fetch Errors:** Dependency validation warnings can be ignored when using `--tunnel`
3. **Expo Go SDK Compatibility:** Ensure Expo Go app is SDK 54+ for proper functionality
4. **Platform-Specific Features:** Always check `Platform.OS` before using biometric, location, or audio features

## Testing Strategy

Currently manual testing with mock data. Future implementation needed for:
- Unit tests (Jest + React Native Testing Library)
- Integration tests for API services
- E2E tests with Detox or Maestro

## Deployment Considerations

- **iOS:** App Store Connect, requires Apple Developer account
- **Android:** Google Play Console
- **Web:** Can be deployed to Vercel/Netlify but has limited functionality
- **Backend:** Requires Django API server at configured BASE_URL

## Additional Resources

- React Native docs: https://reactnative.dev/
- Expo docs: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- TanStack Query: https://tanstack.com/query/latest
