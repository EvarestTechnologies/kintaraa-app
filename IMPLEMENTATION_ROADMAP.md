# Kintaraa Implementation Roadmap
## Backend Integration & MVP Completion Plan

**Target Date**: January 15, 2026
**Days Available**: 31 days
**Current Status**: Frontend 98% | Backend 70% | Integration 0%
**MVP Scope**: 3 Dashboards (Survivor + Dispatch Center + GBV Rescue)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Phase 1: Foundation & Integration (Days 1-7)](#phase-1-foundation--integration-days-1-7)
4. [Phase 2: Core Features (Days 8-14)](#phase-2-core-features-days-8-14)
5. [Phase 3: Enhanced Features (Days 15-21)](#phase-3-enhanced-features-days-15-21)
6. [Phase 4: Testing & Refinement (Days 22-28)](#phase-4-testing--refinement-days-22-28)
7. [Phase 5: Deployment & Launch (Days 29-31)](#phase-5-deployment--launch-days-29-31)
8. [Success Criteria](#success-criteria)
9. [Risk Mitigation](#risk-mitigation)

---

## Executive Summary

### What We Have
- ✅ **Frontend**: 98% complete with offline-first architecture
- ✅ **Backend**: 70% complete with solid authentication and incident management
- ✅ **Infrastructure**: Docker, PostgreSQL, Redis, Celery configured

### What's Missing
- ❌ **Backend-Frontend Integration**: API endpoints not connected
- ❌ **Messaging System**: Complete absence of messaging functionality
- ❌ **Push Notifications**: Infrastructure exists but not implemented
- ❌ **Real-time Updates**: WebSocket configured but not used
- ❌ **Testing**: 0% coverage on both frontend and backend

### The Gap
**31 days** to close the integration gap and deliver a working MVP for 3 dashboards.

---

## Current State Analysis

### Backend Status (70% Complete)

#### ✅ Production-Ready Components
- **Authentication System**: 100% (JWT, roles, biometric support)
- **Incident Management**: 90% (CRUD, status workflow, voice upload)
- **Case Assignment**: 95% (hybrid auto/manual assignment)
- **Provider Profiles**: 100% (capacity, availability, metrics)
- **Dispatch Dashboard**: 100% (statistics, filtering, assignment)

#### ❌ Missing Critical Features
- **Messaging System**: 0% (no models, no endpoints)
- **Push Notifications**: 5% (FCM configured, not implemented)
- **WebSocket/Real-time**: 10% (Channels installed, no consumers)
- **Voice Transcription**: 0% (stubbed, returns None)
- **Evidence Upload**: 30% (S3 configured, no endpoints)
- **Testing**: 0% (no test cases)

### Frontend Status (98% Complete)

#### ✅ Production-Ready Components
- **7 Provider Dashboards**: Complete UI
- **Survivor Dashboard**: Complete UI
- **Offline-First**: Sync queue, encryption, conflict resolution
- **Authentication**: Biometric, JWT ready
- **Components**: Reusable, well-organized

#### ⚠️ Using Mock Data
- All provider contexts using dummy data
- No real API integration
- AsyncStorage only (no server sync)

### Integration Gap (0% Complete)
- ❌ API endpoints not connected
- ❌ Frontend services ready but not called
- ❌ Environment variables not configured
- ❌ No end-to-end testing

---

## Phase 1: Foundation & Integration (Days 1-7)
**Goal**: Get backend running and connect to frontend for basic authentication and incident flow

### Day 1-2: Backend Environment Setup

#### Backend Setup Checklist
- [ ] **Install Python Dependencies**
  ```bash
  cd ~/Documents/Work/Evarest/kintara-backend
  python -m venv venv
  source venv/bin/activate  # Linux/Mac
  pip install -r requirements.txt
  ```

- [ ] **Configure Environment Variables**
  ```bash
  cp .env.example .env
  # Edit .env with:
  # - DATABASE_URL
  # - REDIS_URL
  # - SECRET_KEY
  # - FCM_SERVER_KEY
  # - AWS credentials (for production)
  ```

- [ ] **Setup PostgreSQL Database**
  ```bash
  # Option 1: Docker
  docker-compose up -d db redis

  # Option 2: Local PostgreSQL
  sudo -u postgres createdb kintara_db
  sudo -u postgres createuser kintara_user
  sudo -u postgres psql -c "ALTER USER kintara_user WITH PASSWORD 'secure_password';"
  ```

- [ ] **Run Database Migrations**
  ```bash
  python manage.py migrate
  python manage.py createsuperuser
  # Email: admin@kintara.com
  # Password: (create secure password)
  ```

- [ ] **Create Test Users**
  ```bash
  python manage.py shell
  # Create:
  # - 1 survivor: survivor@test.com
  # - 1 dispatcher: dispatcher@test.com
  # - 3 GBV rescue providers: gbv1@test.com, gbv2@test.com, gbv3@test.com
  ```

- [ ] **Start Backend Server**
  ```bash
  # Development
  python manage.py runserver 8000

  # Or with Docker
  docker-compose up backend
  ```

- [ ] **Verify Backend Health**
  ```bash
  curl http://localhost:8000/api/auth/health/
  # Should return: {"status": "ok", "timestamp": "..."}
  ```

- [ ] **Access API Documentation**
  - Swagger UI: http://localhost:8000/swagger/
  - ReDoc: http://localhost:8000/redoc/
  - Verify all endpoints visible

### Day 3-4: Frontend-Backend Connection

#### Frontend Configuration
- [ ] **Update API Base URL**
  ```typescript
  // constants/domains/config/ApiConfig.ts
  export const API_BASE_URL = 'http://localhost:8000/api';
  export const WEBSOCKET_URL = 'ws://localhost:8000/ws';
  ```

- [ ] **Test Authentication Flow**
  - [ ] Frontend login calls backend `/api/auth/login/`
  - [ ] JWT tokens stored in AsyncStorage
  - [ ] Token refresh works automatically
  - [ ] Logout blacklists token
  - [ ] Biometric enable/disable works

- [ ] **Test Registration Flow**
  - [ ] Register survivor account
  - [ ] Register provider account (GBV Rescue)
  - [ ] Register dispatcher account
  - [ ] Verify role assignment
  - [ ] Verify provider_type assignment

- [ ] **Update AuthService**
  ```typescript
  // services/authService.ts
  // Remove all mock data
  // Connect to real API endpoints
  // Test all auth functions
  ```

#### Integration Testing
- [ ] **Survivor Flow**
  - [ ] Login as survivor
  - [ ] Create new incident
  - [ ] Verify incident appears in backend
  - [ ] View incident list
  - [ ] Update incident
  - [ ] Soft delete incident

- [ ] **Provider Flow**
  - [ ] Login as GBV rescue provider
  - [ ] View assigned cases
  - [ ] Accept assignment
  - [ ] Reject assignment
  - [ ] Update profile/availability

- [ ] **Dispatcher Flow**
  - [ ] Login as dispatcher
  - [ ] View all cases
  - [ ] Filter by status/urgency
  - [ ] Manually assign case to provider
  - [ ] Reassign case
  - [ ] View statistics

### Day 5-7: Incident Management Integration

#### Replace Mock Data in IncidentProvider
- [ ] **Update IncidentProvider.tsx**
  ```typescript
  // providers/IncidentProvider.tsx
  // Line 113-476: Remove DUMMY_INCIDENTS mock data
  // Connect to real API:
  // - GET /api/incidents/
  // - POST /api/incidents/
  // - PATCH /api/incidents/{id}/
  // - DELETE /api/incidents/{id}/
  ```

- [ ] **Implement Voice Upload**
  - [ ] Test voice recording in app
  - [ ] Upload to backend `/api/incidents/upload-voice/`
  - [ ] Verify file storage
  - [ ] Display recording in incident details

- [ ] **Test Case Assignment**
  - [ ] Create urgent incident → auto-assigns to GBV Rescue
  - [ ] Create routine incident → pending_dispatcher_review
  - [ ] Dispatcher manually assigns routine case
  - [ ] Provider receives assignment notification (console log for now)

- [ ] **Update Statistics**
  - [ ] Connect survivor dashboard stats to `/api/incidents/stats/`
  - [ ] Connect dispatch dashboard to `/api/dispatch/dashboard/`
  - [ ] Verify real-time data updates

#### End-to-End Test
- [ ] **Complete User Journey**
  1. Survivor registers and logs in
  2. Survivor reports urgent incident
  3. System auto-assigns to available GBV Rescue provider
  4. Provider logs in and sees assignment
  5. Provider accepts assignment
  6. Incident status changes to `assigned`
  7. Dispatcher can view the case in their dashboard
  8. All statistics update correctly

---

## Phase 2: Core Features (Days 8-14)
**Goal**: Implement messaging system and push notifications

### Day 8-10: Messaging System

#### Backend: Message Model & Endpoints
- [ ] **Create Message Model**
  ```python
  # apps/messaging/models.py
  class Message(BaseModel):
      conversation_id = models.UUIDField()  # Groups messages
      incident = models.ForeignKey(Incident)
      sender = models.ForeignKey(User)
      receiver = models.ForeignKey(User)
      content = models.TextField()
      message_type = models.CharField()  # text, image, audio, file
      attachment = models.FileField(blank=True, null=True)
      is_read = models.BooleanField(default=False)
      read_at = models.DateTimeField(null=True, blank=True)

      class Meta:
          ordering = ['created_at']
          indexes = [
              models.Index(fields=['conversation_id', 'created_at']),
              models.Index(fields=['incident', 'created_at']),
              models.Index(fields=['sender', 'receiver']),
          ]
  ```

- [ ] **Create Message Serializers**
  ```python
  # apps/messaging/serializers.py
  class MessageSerializer(serializers.ModelSerializer):
      sender_name = serializers.CharField(source='sender.email', read_only=True)
      receiver_name = serializers.CharField(source='receiver.email', read_only=True)
  ```

- [ ] **Create Message ViewSet**
  ```python
  # apps/messaging/views.py
  class MessageViewSet(viewsets.ModelViewSet):
      # POST /api/messages/ - Send message
      # GET /api/messages/conversations/ - List conversations
      # GET /api/messages/?conversation_id=xxx - Get conversation messages
      # PATCH /api/messages/{id}/read/ - Mark as read
  ```

- [ ] **Add Message URLs**
  ```python
  # kintara/urls.py
  path('api/messages/', include('apps.messaging.urls')),
  ```

- [ ] **Run Migrations**
  ```bash
  python manage.py makemigrations messaging
  python manage.py migrate
  ```

#### Frontend: Message Integration
- [ ] **Update MessageService**
  ```typescript
  // services/messageService.ts
  // Remove mock implementation
  // Connect to real endpoints
  export const sendMessage = async (conversationId, receiverId, content)
  export const getConversation = async (conversationId)
  export const getConversations = async ()
  export const markAsRead = async (messageId)
  ```

- [ ] **Update Message UI**
  ```typescript
  // app/messages/[id].tsx
  // Connect to real API
  // Implement HTTP polling (every 5 seconds)
  // Show real messages, not mock data
  ```

- [ ] **Test Messaging**
  - [ ] Survivor sends message to provider
  - [ ] Provider receives and replies
  - [ ] Dispatcher can view conversation
  - [ ] Read status updates correctly
  - [ ] Polling updates messages every 5 seconds

### Day 11-13: Push Notifications

#### Backend: Notification System
- [ ] **Create Notification Tasks**
  ```python
  # apps/incidents/tasks.py
  from celery import shared_task
  from pyfcm import FCMNotification

  @shared_task
  def notify_provider_assignment(assignment_id):
      # Send FCM to provider when assigned
      pass

  @shared_task
  def notify_dispatcher_new_case(incident_id):
      # Send FCM to dispatcher on new urgent case
      pass

  @shared_task
  def notify_survivor_status_update(incident_id):
      # Send FCM to survivor on status change
      pass
  ```

- [ ] **Create FCM Device Model**
  ```python
  # apps/authentication/models.py
  class FCMDevice(BaseModel):
      user = models.ForeignKey(User, related_name='fcm_devices')
      registration_token = models.CharField(max_length=255, unique=True)
      device_type = models.CharField()  # ios, android, web
      is_active = models.BooleanField(default=True)
  ```

- [ ] **Add Device Registration Endpoint**
  ```python
  # apps/authentication/views.py
  @api_view(['POST'])
  def register_device(request):
      # Save FCM token for user
      pass
  ```

- [ ] **Trigger Notifications**
  ```python
  # apps/incidents/views.py
  # In create_incident():
  if urgency == 'urgent':
      notify_dispatcher_new_case.delay(incident.id)

  # In assign_provider():
  notify_provider_assignment.delay(assignment.id)

  # In update_incident_status():
  notify_survivor_status_update.delay(incident.id)
  ```

- [ ] **Start Celery Worker**
  ```bash
  celery -A kintara worker --loglevel=info
  ```

#### Frontend: Notification Setup
- [ ] **Configure Expo Notifications**
  ```typescript
  // services/notificationService.ts
  // Request permissions
  // Get FCM token
  // Register token with backend
  // Handle notification taps
  ```

- [ ] **Register Device on Login**
  ```typescript
  // providers/AuthProvider.tsx
  // After successful login:
  const token = await getExpoPushToken();
  await registerDevice(token);
  ```

- [ ] **Handle Notification Tap**
  ```typescript
  // Navigate to appropriate screen:
  // - Provider: assigned case details
  // - Survivor: incident details
  // - Dispatcher: case list
  ```

#### Testing Notifications
- [ ] **Test Provider Assignment Notification**
  1. Create urgent incident as survivor
  2. Verify provider receives push notification
  3. Tap notification → opens case details
  4. Verify notification appears in system tray

- [ ] **Test Dispatcher Notification**
  1. Create urgent incident
  2. Verify dispatcher receives notification
  3. Tap notification → opens case list

- [ ] **Test Survivor Notification**
  1. Provider accepts assignment
  2. Verify survivor receives "case assigned" notification
  3. Provider updates status to in_progress
  4. Verify survivor receives "status update" notification

### Day 14: Provider Context Integration

#### Replace Mock Data in ProviderContext
- [ ] **Update ProviderContext.tsx**
  ```typescript
  // providers/ProviderContext.tsx
  // Remove all mock data
  // Connect to:
  // - GET /api/providers/assigned-cases/
  // - PATCH /api/incidents/{id}/accept/
  // - PATCH /api/incidents/{id}/reject/
  ```

- [ ] **Stop Polling, Use Notifications**
  ```typescript
  // Remove 5-second polling
  // Rely on push notifications for new assignments
  // Refetch on app focus or pull-to-refresh
  ```

- [ ] **Update All Provider Dashboards**
  - [ ] Healthcare dashboard (show assigned cases)
  - [ ] Legal dashboard
  - [ ] Police dashboard
  - [ ] Counseling dashboard
  - [ ] Social services dashboard
  - [ ] GBV Rescue dashboard
  - [ ] CHW dashboard

---

## Phase 3: Enhanced Features (Days 15-21)
**Goal**: Add WebSocket, voice transcription, and evidence upload

### Day 15-17: Real-time WebSocket

#### Backend: WebSocket Implementation
- [ ] **Create WebSocket Consumers**
  ```python
  # apps/messaging/consumers.py
  class MessageConsumer(AsyncWebsocketConsumer):
      async def connect(self):
          # Join conversation room
          pass

      async def receive(self, text_data):
          # Handle incoming message
          # Broadcast to receiver
          pass

      async def disconnect(self, close_code):
          # Leave room
          pass
  ```

- [ ] **Configure WebSocket Routing**
  ```python
  # kintara/routing.py
  from channels.routing import ProtocolTypeRouter, URLRouter
  from django.urls import path

  websocket_urlpatterns = [
      path('ws/messages/<uuid:conversation_id>/', MessageConsumer.as_asgi()),
      path('ws/cases/<uuid:incident_id>/', CaseUpdateConsumer.as_asgi()),
  ]
  ```

- [ ] **Update Settings for Channels**
  ```python
  # kintara/settings.py
  CHANNEL_LAYERS = {
      'default': {
          'BACKEND': 'channels_redis.core.RedisChannelLayer',
          'CONFIG': {
              'hosts': [('localhost', 6379)],
          },
      },
  }
  ```

- [ ] **Start Channels Server**
  ```bash
  daphne -b 0.0.0.0 -p 8000 kintara.asgi:application
  ```

#### Frontend: WebSocket Integration
- [ ] **Implement useWebSocket Hook**
  ```typescript
  // hooks/useWebSocket.ts
  export const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState([]);

    // Connect, send, disconnect logic
  }
  ```

- [ ] **Update Message Screen**
  ```typescript
  // app/messages/[id].tsx
  const { socket, sendMessage } = useWebSocket(`ws://localhost:8000/ws/messages/${conversationId}/`);

  // Remove HTTP polling
  // Use WebSocket for instant messaging
  ```

- [ ] **Real-time Case Updates**
  ```typescript
  // app/case-details/[id].tsx
  const { socket } = useWebSocket(`ws://localhost:8000/ws/cases/${incidentId}/`);

  // Listen for status changes
  // Update UI in real-time
  ```

#### Testing WebSocket
- [ ] **Test Real-time Messaging**
  1. Open conversation on two devices
  2. Send message from device A
  3. Verify instant delivery to device B
  4. No page refresh needed

- [ ] **Test Case Updates**
  1. Open case details on survivor's device
  2. Provider updates status on their device
  3. Verify survivor sees update instantly

### Day 18-19: Voice Transcription

#### Backend: Speech-to-Text Integration
- [ ] **Choose Provider** (Google Cloud Speech / AWS Transcribe / Azure)
  ```bash
  # For Google Cloud Speech:
  pip install google-cloud-speech
  ```

- [ ] **Implement Transcription Service**
  ```python
  # apps/incidents/services/transcription.py
  from google.cloud import speech

  def transcribe_audio(audio_file_path):
      client = speech.SpeechClient()
      # Load audio file
      # Call transcription API
      # Return text
      pass
  ```

- [ ] **Create Celery Task**
  ```python
  # apps/incidents/tasks.py
  @shared_task
  def transcribe_voice_recording(incident_id):
      incident = Incident.objects.get(id=incident_id)
      if incident.voice_recording:
          text = transcribe_audio(incident.voice_recording.path)
          incident.voice_transcription = text
          incident.save()
  ```

- [ ] **Update Voice Upload Endpoint**
  ```python
  # apps/incidents/views.py
  @action(detail=False, methods=['post'])
  def upload_voice(self, request):
      # Save file
      # Trigger transcription task
      transcribe_voice_recording.delay(incident.id)
      return Response({'status': 'processing'})
  ```

#### Frontend: Transcription Display
- [ ] **Show Transcription Status**
  ```typescript
  // app/report.tsx
  // After voice upload:
  // - Show "Processing..." while transcribing
  // - Poll for transcription result
  // - Display transcribed text when ready
  ```

- [ ] **Allow Editing Transcription**
  ```typescript
  // Let user edit transcription before final submit
  // Useful for correcting errors
  ```

### Day 20-21: Evidence Upload

#### Backend: Evidence Model & Endpoints
- [ ] **Create Evidence Model**
  ```python
  # apps/incidents/models.py
  class Evidence(BaseModel):
      incident = models.ForeignKey(Incident, related_name='evidence_files')
      file = models.FileField(upload_to='evidence/')
      file_type = models.CharField()  # image, video, document, audio
      description = models.TextField(blank=True)
      uploaded_by = models.ForeignKey(User)
      is_encrypted = models.BooleanField(default=False)

      class Meta:
          ordering = ['-created_at']
  ```

- [ ] **Create Evidence ViewSet**
  ```python
  # apps/incidents/views.py
  class EvidenceViewSet(viewsets.ModelViewSet):
      # POST /api/incidents/{id}/evidence/ - Upload
      # GET /api/incidents/{id}/evidence/ - List
      # DELETE /api/incidents/{id}/evidence/{id}/ - Delete
  ```

- [ ] **Configure S3 for Production**
  ```python
  # kintara/settings.py
  if not DEBUG:
      DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
      AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
  ```

#### Frontend: Evidence Upload UI
- [ ] **Add Evidence Upload Screen**
  ```typescript
  // app/incident-evidence/[id].tsx
  // - Take photo
  // - Record video
  // - Select from gallery
  // - Upload documents
  ```

- [ ] **Update Incident Details**
  ```typescript
  // app/case-details/[id].tsx
  // Show list of evidence files
  // Allow viewing/downloading
  ```

- [ ] **Test Evidence Upload**
  - [ ] Upload photo from camera
  - [ ] Upload photo from gallery
  - [ ] Upload document (PDF)
  - [ ] Verify file appears in incident details
  - [ ] Verify file stored in S3 (production)

---

## Phase 4: Testing & Refinement (Days 22-28)
**Goal**: Comprehensive testing, bug fixes, and performance optimization

### Day 22-23: Unit Testing

#### Backend Tests
- [ ] **Authentication Tests**
  ```python
  # apps/authentication/tests/test_views.py
  class AuthenticationTestCase(APITestCase):
      def test_register_survivor(self):
          # Test successful registration
          pass

      def test_login_with_valid_credentials(self):
          # Test login flow
          pass

      def test_token_refresh(self):
          # Test token refresh
          pass

      def test_logout(self):
          # Test token blacklist
          pass
  ```

- [ ] **Incident Tests**
  ```python
  # apps/incidents/tests/test_views.py
  class IncidentTestCase(APITestCase):
      def test_create_incident(self):
          # Test incident creation
          pass

      def test_auto_assignment_urgent(self):
          # Test automatic assignment for urgent cases
          pass

      def test_manual_queue_routine(self):
          # Test manual queue for routine cases
          pass
  ```

- [ ] **Messaging Tests**
  ```python
  # apps/messaging/tests/test_views.py
  class MessagingTestCase(APITestCase):
      def test_send_message(self):
          pass

      def test_get_conversation(self):
          pass

      def test_mark_as_read(self):
          pass
  ```

- [ ] **Run All Backend Tests**
  ```bash
  python manage.py test
  # Target: 80%+ coverage
  ```

#### Frontend Tests (Optional - Time Permitting)
- [ ] **Setup Jest + React Native Testing Library**
  ```bash
  npm install --save-dev jest @testing-library/react-native
  ```

- [ ] **Test Authentication Context**
  ```typescript
  // providers/__tests__/AuthProvider.test.tsx
  describe('AuthProvider', () => {
    it('should login successfully', async () => {
      // Test login flow
    });
  });
  ```

- [ ] **Test Offline Sync**
  ```typescript
  // services/__tests__/syncService.test.ts
  describe('SyncService', () => {
    it('should queue operations when offline', () => {
      // Test sync queue
    });
  });
  ```

### Day 24-25: Integration Testing

#### End-to-End User Flows
- [ ] **Survivor Journey**
  1. Register as survivor
  2. Enable biometric authentication
  3. Report urgent incident with voice recording
  4. Wait for auto-assignment
  5. Receive notification of assignment
  6. Send message to provider
  7. Receive response
  8. Upload evidence photo
  9. View case status updates
  10. Mark case as completed

- [ ] **Provider Journey (GBV Rescue)**
  1. Register as GBV rescue provider
  2. Set availability and capacity
  3. Receive assignment notification
  4. View case details
  5. Accept assignment
  6. Send message to survivor
  7. Update case status to in_progress
  8. View evidence files
  9. Update case status to completed
  10. View performance metrics

- [ ] **Dispatcher Journey**
  1. Login as dispatcher
  2. View dashboard statistics
  3. See pending routine case in queue
  4. View available providers
  5. Manually assign provider
  6. Monitor case progress
  7. Reassign case if needed
  8. View system-wide analytics

#### Cross-Role Testing
- [ ] **Multi-User Scenarios**
  - [ ] 3 survivors create incidents simultaneously
  - [ ] 5 providers with varying availability
  - [ ] 1 dispatcher managing all cases
  - [ ] Verify correct assignment algorithm
  - [ ] Check notification delivery to all users

- [ ] **Offline Testing**
  - [ ] Create incident while offline
  - [ ] Verify queued in sync queue
  - [ ] Go online
  - [ ] Verify automatic sync
  - [ ] Check server received incident

- [ ] **Conflict Resolution**
  - [ ] Edit incident on device A (offline)
  - [ ] Edit same incident on device B (offline)
  - [ ] Both go online
  - [ ] Verify conflict detection
  - [ ] Test merge strategy

### Day 26-27: Performance Optimization

#### Backend Optimization
- [ ] **Database Query Optimization**
  ```python
  # Use select_related and prefetch_related
  Incident.objects.select_related('survivor').prefetch_related('assignments__provider')

  # Add database indexes
  # Review Django Debug Toolbar for N+1 queries
  ```

- [ ] **API Response Caching**
  ```python
  # Cache provider availability list (5 minutes)
  @cache_page(60 * 5)
  def available_providers(request):
      pass
  ```

- [ ] **Pagination for Large Lists**
  ```python
  # apps/incidents/views.py
  class IncidentViewSet(viewsets.ModelViewSet):
      pagination_class = PageNumberPagination
      page_size = 20
  ```

- [ ] **Celery Task Optimization**
  ```python
  # Use task priority queues
  # Set task time limits
  # Implement task retries with exponential backoff
  ```

#### Frontend Optimization
- [ ] **Reduce Bundle Size**
  ```bash
  npx expo-doctor
  # Review dependencies
  # Remove unused packages
  ```

- [ ] **Optimize Images**
  ```typescript
  // Use expo-image instead of Image
  import { Image } from 'expo-image';
  // Implement lazy loading
  ```

- [ ] **React Query Optimization**
  ```typescript
  // Increase staleTime for static data
  useQuery(['providers'], fetchProviders, {
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
  ```

- [ ] **Implement Code Splitting**
  ```typescript
  // Lazy load heavy screens
  const ReportScreen = React.lazy(() => import('./app/report'));
  ```

#### Performance Testing
- [ ] **Load Testing (Backend)**
  ```bash
  # Use Locust or Apache Bench
  locust -f load_test.py --host=http://localhost:8000

  # Targets:
  # - 100 concurrent users
  # - < 200ms response time for GET requests
  # - < 500ms for POST requests
  ```

- [ ] **App Performance (Frontend)**
  - [ ] Measure app load time (target: < 3 seconds)
  - [ ] Test on low-end Android device
  - [ ] Verify smooth scrolling (60fps)
  - [ ] Check memory usage (< 150MB)

### Day 28: Bug Fixes & Edge Cases

#### Known Issues to Address
- [ ] **Handle Expired JWT Tokens**
  - [ ] Auto-refresh on 401 response
  - [ ] Logout user if refresh fails
  - [ ] Show "Session Expired" message

- [ ] **Network Error Handling**
  - [ ] Show user-friendly error messages
  - [ ] Implement retry logic
  - [ ] Queue operations when offline

- [ ] **Voice Recording Edge Cases**
  - [ ] Handle file size exceeding 50MB
  - [ ] Handle unsupported audio formats
  - [ ] Handle transcription failures

- [ ] **Assignment Edge Cases**
  - [ ] No available providers
  - [ ] All providers at capacity
  - [ ] Provider rejects multiple times
  - [ ] Automatic reassignment logic

- [ ] **Messaging Edge Cases**
  - [ ] WebSocket disconnection
  - [ ] Message delivery failures
  - [ ] Very long messages
  - [ ] Rapid message sending

#### Security Hardening
- [ ] **Input Validation**
  - [ ] Sanitize all user inputs
  - [ ] Validate file uploads (type, size)
  - [ ] Prevent SQL injection
  - [ ] Prevent XSS attacks

- [ ] **Rate Limiting**
  ```python
  # kintara/settings.py
  REST_FRAMEWORK = {
      'DEFAULT_THROTTLE_CLASSES': [
          'rest_framework.throttling.AnonRateThrottle',
          'rest_framework.throttling.UserRateThrottle'
      ],
      'DEFAULT_THROTTLE_RATES': {
          'anon': '100/hour',
          'user': '1000/hour'
      }
  }
  ```

- [ ] **HTTPS Enforcement**
  ```python
  # Force HTTPS in production
  SECURE_SSL_REDIRECT = True
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  ```

- [ ] **Sensitive Data Encryption**
  - [ ] Encrypt voice recordings
  - [ ] Encrypt evidence files
  - [ ] Secure message content

---

## Phase 5: Deployment & Launch (Days 29-31)
**Goal**: Deploy to production and prepare for launch

### Day 29: Production Deployment

#### Backend Deployment (AWS/Heroku/DigitalOcean)
- [ ] **Prepare Production Environment**
  ```bash
  # Set environment variables
  export DEBUG=False
  export DATABASE_URL=postgresql://...
  export REDIS_URL=redis://...
  export AWS_STORAGE_BUCKET_NAME=kintara-production
  export FCM_SERVER_KEY=...
  export SECRET_KEY=... (generate strong key)
  ```

- [ ] **Database Migration**
  ```bash
  python manage.py migrate --settings=kintara.settings.production
  python manage.py createsuperuser
  ```

- [ ] **Collect Static Files**
  ```bash
  python manage.py collectstatic --noinput
  ```

- [ ] **Setup Gunicorn**
  ```bash
  pip install gunicorn
  gunicorn kintara.wsgi:application --bind 0.0.0.0:8000 --workers 4
  ```

- [ ] **Setup Nginx Reverse Proxy**
  ```nginx
  server {
      listen 80;
      server_name api.kintara.com;

      location / {
          proxy_pass http://localhost:8000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }

      location /ws/ {
          proxy_pass http://localhost:8000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
      }
  }
  ```

- [ ] **Setup SSL Certificate**
  ```bash
  sudo certbot --nginx -d api.kintara.com
  ```

- [ ] **Start Celery Workers**
  ```bash
  celery -A kintara worker --loglevel=info --concurrency=4
  celery -A kintara beat --loglevel=info
  ```

- [ ] **Setup Monitoring**
  - [ ] Configure Sentry for error tracking
  - [ ] Setup logging to CloudWatch/Papertrail
  - [ ] Configure uptime monitoring (UptimeRobot)

#### Frontend Deployment
- [ ] **Update Production API URL**
  ```typescript
  // constants/domains/config/ApiConfig.ts
  export const API_BASE_URL = 'https://api.kintara.com/api';
  export const WEBSOCKET_URL = 'wss://api.kintara.com/ws';
  ```

- [ ] **Build Production App**
  ```bash
  # For iOS
  eas build --platform ios --profile production

  # For Android
  eas build --platform android --profile production
  ```

- [ ] **Submit to App Stores**
  - [ ] iOS: App Store Connect
    - [ ] Create app listing
    - [ ] Upload screenshots
    - [ ] Submit for review

  - [ ] Android: Google Play Console
    - [ ] Create app listing
    - [ ] Upload screenshots
    - [ ] Submit for review

- [ ] **Web Deployment (Optional)**
  ```bash
  npx expo export:web
  # Deploy to Vercel/Netlify
  ```

### Day 30: Final Testing & Documentation

#### Production Smoke Testing
- [ ] **Test All Critical Flows**
  - [ ] User registration (all roles)
  - [ ] Incident creation
  - [ ] Case assignment
  - [ ] Messaging
  - [ ] Notifications
  - [ ] Evidence upload

- [ ] **Test on Multiple Devices**
  - [ ] iOS iPhone (latest)
  - [ ] Android (Samsung, Google Pixel)
  - [ ] Different network conditions (WiFi, 4G, 3G)
  - [ ] Different screen sizes

- [ ] **Load Testing in Production**
  ```bash
  # Simulate 50 concurrent users
  locust -f production_load_test.py --host=https://api.kintara.com
  ```

#### Documentation
- [ ] **API Documentation**
  - [ ] Ensure Swagger docs are accurate
  - [ ] Add example requests/responses
  - [ ] Document error codes

- [ ] **User Documentation**
  - [ ] Create user guides for each role
  - [ ] Record demo videos
  - [ ] Create FAQ page

- [ ] **Developer Documentation**
  - [ ] Update README.md
  - [ ] Document environment setup
  - [ ] Add troubleshooting guide
  - [ ] Document deployment process

- [ ] **Update CLAUDE.md**
  - [ ] Reflect new architecture
  - [ ] Update file structure
  - [ ] Add backend integration notes

### Day 31: Launch Preparation

#### Final Checks
- [ ] **Security Audit**
  - [ ] Review all API endpoints
  - [ ] Check for exposed secrets
  - [ ] Verify HTTPS everywhere
  - [ ] Test authentication bypass attempts
  - [ ] Validate file upload restrictions

- [ ] **Performance Check**
  - [ ] API response times < 200ms
  - [ ] App load time < 3 seconds
  - [ ] No memory leaks
  - [ ] Smooth UI performance

- [ ] **Backup Strategy**
  - [ ] Setup automated database backups
  - [ ] Test backup restoration
  - [ ] Document recovery procedures

#### Launch Checklist
- [ ] **Backend**
  - [ ] Production server running
  - [ ] Database migrated
  - [ ] Celery workers active
  - [ ] Redis cache working
  - [ ] SSL certificates valid
  - [ ] Monitoring active

- [ ] **Frontend**
  - [ ] Apps submitted to stores
  - [ ] Production API URLs configured
  - [ ] Analytics configured
  - [ ] Crash reporting active

- [ ] **Team Preparation**
  - [ ] Admin accounts created
  - [ ] Test provider accounts ready
  - [ ] Support email configured
  - [ ] Incident response plan documented

- [ ] **Go/No-Go Decision**
  - [ ] All critical features working
  - [ ] No blocking bugs
  - [ ] Performance acceptable
  - [ ] Security validated
  - [ ] Team ready

#### Launch!
- [ ] **Soft Launch** (Limited Users)
  - [ ] 10 test survivors
  - [ ] 5 GBV rescue providers
  - [ ] 2 dispatchers
  - [ ] Monitor for 48 hours

- [ ] **Full Launch**
  - [ ] Announce to wider audience
  - [ ] Monitor error rates
  - [ ] Respond to user feedback
  - [ ] Fix critical issues immediately

---

## Success Criteria

### MVP Must-Haves (Jan 15, 2026)
- ✅ Survivor can register, login, and report incidents
- ✅ GBV Rescue providers can view and accept assignments
- ✅ Dispatchers can manually assign routine cases
- ✅ Urgent cases auto-assign to available providers
- ✅ Push notifications for assignments and updates
- ✅ Basic messaging between survivor and provider
- ✅ Evidence upload (photos)
- ✅ Voice recording upload (transcription optional)
- ✅ Dashboard statistics for all roles
- ✅ Apps deployed to production

### Technical Success Metrics
- 🎯 API response time < 200ms (95th percentile)
- 🎯 App load time < 3 seconds
- 🎯 Push notification delivery > 95%
- 🎯 Test coverage > 70% (backend)
- 🎯 Zero critical security vulnerabilities
- 🎯 Uptime > 99.5%

### User Success Metrics
- 🎯 Survivor can report incident in < 5 minutes
- 🎯 Urgent case assigned in < 2 minutes
- 🎯 Provider responds within 15 minutes
- 🎯 Message delivery < 2 seconds (WebSocket)
- 🎯 All roles can complete core workflows

---

## Risk Mitigation

### High-Risk Areas

#### 1. WebSocket Implementation (Day 15-17)
**Risk**: Complex, unfamiliar technology
**Mitigation**:
- Start with simple HTTP polling as fallback
- WebSocket is "nice to have", not critical for MVP
- Can defer to post-MVP if time runs short

#### 2. Push Notifications (Day 11-13)
**Risk**: Device-specific issues, FCM configuration
**Mitigation**:
- Test on both iOS and Android early
- Have email notifications as backup
- Keep notification logic simple

#### 3. Voice Transcription (Day 18-19)
**Risk**: Third-party API costs, accuracy issues
**Mitigation**:
- Make transcription optional for MVP
- Can manually transcribe for initial users
- Defer if time constrained

#### 4. App Store Approval (Day 29-31)
**Risk**: Rejection, delays in review
**Mitigation**:
- Submit early (Day 25)
- Have clear privacy policy
- Ensure compliance with guidelines
- Use TestFlight/Internal Testing first

### Contingency Plans

#### If Behind Schedule (Day 20)
**Drop from MVP**:
1. WebSocket real-time (keep HTTP polling)
2. Voice transcription (manual for now)
3. Evidence upload (photos only, defer docs/videos)
4. Advanced provider recommendations

**Keep Mandatory**:
1. Authentication
2. Incident creation
3. Case assignment
4. Messaging (HTTP polling)
5. Push notifications

#### If Backend Issues (Day 15)
**Temporary Workarounds**:
1. Keep using mock data
2. Focus on frontend polish
3. Parallel team works on backend
4. Aggressive integration in final week

#### If Integration Fails (Day 25)
**Emergency Plan**:
1. Identify blocking issues
2. Create minimal viable integration
3. Deploy with limited features
4. Plan rapid patches post-launch

---

## Daily Progress Tracking

### Week 1: Foundation
- [ ] Day 1: Backend setup complete
- [ ] Day 2: Test users created, API accessible
- [ ] Day 3: Frontend connected to backend
- [ ] Day 4: Authentication flow working
- [ ] Day 5: Incident creation integrated
- [ ] Day 6: Case assignment working
- [ ] Day 7: End-to-end test passes

### Week 2: Core Features
- [ ] Day 8: Message model created
- [ ] Day 9: Message endpoints working
- [ ] Day 10: Messaging UI integrated
- [ ] Day 11: FCM device model created
- [ ] Day 12: Notification tasks implemented
- [ ] Day 13: Push notifications working
- [ ] Day 14: All mock data removed

### Week 3: Enhanced Features
- [ ] Day 15: WebSocket consumers created
- [ ] Day 16: WebSocket routing configured
- [ ] Day 17: Real-time messaging working
- [ ] Day 18: Transcription service integrated
- [ ] Day 19: Voice transcription working
- [ ] Day 20: Evidence model created
- [ ] Day 21: Evidence upload working

### Week 4: Testing & Deployment
- [ ] Day 22: Backend tests passing
- [ ] Day 23: Frontend tests passing
- [ ] Day 24: Integration tests complete
- [ ] Day 25: Performance optimized
- [ ] Day 26: Security hardened
- [ ] Day 27: All bugs fixed
- [ ] Day 28: Edge cases handled

### Week 5: Launch
- [ ] Day 29: Production deployed
- [ ] Day 30: Documentation complete
- [ ] Day 31: Launch successful

---

## Post-MVP Roadmap (After Jan 15, 2026)

### Phase 6: Expand Provider Types (Feb 2026)
- Add remaining 6 provider dashboards
- Healthcare provider workflows
- Legal aid case management
- Police evidence tracking
- Counseling session management
- Social services coordination
- CHW community outreach

### Phase 7: Advanced Features (Mar 2026)
- AI-powered risk assessment
- Predictive analytics
- Location-based provider matching
- Advanced reporting and analytics
- Multi-language support
- Offline video evidence

### Phase 8: Scale & Optimize (Apr 2026)
- Microservices architecture
- Separate mobile apps per role
- Advanced caching strategies
- CDN for media files
- Multi-region deployment

---

## Notes & Assumptions

### Assumptions
1. Backend developer available for parallel work
2. Firebase account already set up
3. AWS account available for S3
4. PostgreSQL database available
5. Redis instance available
6. Domain name registered (api.kintara.com)
7. App Store developer accounts ready

### Dependencies
- Backend framework: Django 4.2.24
- Frontend framework: React Native 0.81.4 + Expo 54
- Database: PostgreSQL 15
- Cache: Redis 7
- Message Queue: Celery + Redis
- Push Notifications: Firebase Cloud Messaging
- File Storage: AWS S3
- Real-time: Django Channels + WebSocket

### Team Roles (Assumed)
- Full-stack developer (you): Frontend + Backend integration
- Backend specialist: API development
- DevOps: Deployment and infrastructure
- QA: Testing and bug reporting
- Project Manager: Timeline and stakeholder management

---

**Last Updated**: February 14, 2026
**Status**: Planning Phase
**Next Review**: Day 7 (Feb 21, 2026)

---

**Remember**: This is an aggressive timeline. Focus on MVP essentials. Quality over features. Ship working software, iterate later.

**Motto**: "Make it work, make it right, make it fast" - in that order.
