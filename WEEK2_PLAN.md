# Week 2: Messaging & Notifications Implementation

**Dates**: February 15-21, 2026
**Goal**: Implement messaging system and push notifications for MVP

---

## 📋 Week 2 Overview

### **Phase 2: Core Features (Days 8-14)**

This week we'll build the essential communication layer:
1. **Messaging System** - Backend models, endpoints, and frontend integration
2. **Push Notifications** - FCM setup and notification delivery
3. **Real-time Updates** - HTTP polling (WebSocket deferred to Week 3)
4. **Provider Context Integration** - Remove all mock data

---

## 🗓️ Day-by-Day Breakdown

### **Day 8 (Feb 15) - Frontend-Backend Authentication Integration**

**Morning (2-3 hours)**
- [ ] Test login from React Native app
- [ ] Connect AuthProvider to real backend
- [ ] Verify JWT token storage in AsyncStorage
- [ ] Test token refresh mechanism
- [ ] Test logout flow

**Afternoon (2-3 hours)**
- [ ] Test user registration (survivor, provider, dispatcher)
- [ ] Verify role assignment works correctly
- [ ] Test biometric authentication setup
- [ ] Fix any authentication issues

**End of Day Goal**: Complete authentication working end-to-end

---

### **Day 9 (Feb 16) - Incident Management Integration**

**Morning**
- [ ] Remove mock data from IncidentProvider
- [ ] Connect to GET /api/incidents/
- [ ] Connect to POST /api/incidents/
- [ ] Test incident creation from app
- [ ] Verify incidents appear in backend

**Afternoon**
- [ ] Test voice recording upload
- [ ] Test incident update/edit
- [ ] Test incident soft delete
- [ ] Verify survivor can view own incidents
- [ ] Test incident filtering

**End of Day Goal**: Survivors can create and manage incidents

---

### **Day 10 (Feb 17) - Case Assignment & Provider Integration**

**Morning**
- [ ] Remove mock data from ProviderContext
- [ ] Connect to GET /api/providers/assigned-cases/
- [ ] Test case assignment (urgent auto-assign)
- [ ] Test case assignment (routine manual)
- [ ] Verify provider receives assignments

**Afternoon**
- [ ] Test provider accept assignment
- [ ] Test provider reject assignment
- [ ] Update case status workflow
- [ ] Test dispatcher manual assignment
- [ ] Verify assignment notifications (console logs for now)

**End of Day Goal**: Case assignment workflow functional

---

### **Day 11 (Feb 18) - Messaging System Backend**

**Morning - Backend Work**
- [ ] Create Message model in apps/messaging/models.py
- [ ] Create MessageSerializer
- [ ] Create MessageViewSet with endpoints:
  - POST /api/messages/ - Send message
  - GET /api/messages/conversations/ - List conversations
  - GET /api/messages/?conversation_id=xxx - Get messages
  - PATCH /api/messages/{id}/read/ - Mark as read
- [ ] Run makemigrations and migrate

**Afternoon - Test Endpoints**
- [ ] Test send message endpoint with curl/Postman
- [ ] Test get conversation endpoint
- [ ] Test mark as read endpoint
- [ ] Verify message storage in database

**End of Day Goal**: Messaging API endpoints working

---

### **Day 12 (Feb 19) - Messaging System Frontend**

**Morning**
- [ ] Create MessageService in services/messageService.ts
- [ ] Remove mock data from message screens
- [ ] Connect app/messages/[id].tsx to real API
- [ ] Implement HTTP polling (every 5 seconds)

**Afternoon**
- [ ] Test survivor → provider messaging
- [ ] Test provider → survivor messaging
- [ ] Test message delivery and receipt
- [ ] Test read status updates
- [ ] Fix any messaging issues

**End of Day Goal**: Basic messaging working with polling

---

### **Day 13 (Feb 20) - Push Notifications Setup**

**Morning - Backend**
- [ ] Create FCMDevice model
- [ ] Create device registration endpoint
- [ ] Create Celery tasks for notifications:
  - notify_provider_assignment
  - notify_dispatcher_new_case
  - notify_survivor_status_update
- [ ] Start Celery worker

**Afternoon - Frontend**
- [ ] Configure Expo push notifications
- [ ] Request notification permissions
- [ ] Get FCM token on login
- [ ] Register device token with backend
- [ ] Handle notification taps

**End of Day Goal**: Push notifications infrastructure ready

---

### **Day 14 (Feb 21) - Testing & Notifications Polish**

**Morning**
- [ ] Test provider assignment notification
- [ ] Test dispatcher new case notification
- [ ] Test survivor status update notification
- [ ] Test notification tap navigation
- [ ] Verify notifications on both iOS and Android

**Afternoon - Integration Testing**
- [ ] End-to-end survivor journey
- [ ] End-to-end provider journey
- [ ] End-to-end dispatcher journey
- [ ] Fix all integration bugs
- [ ] Update documentation

**End of Day Goal**: Week 2 complete, all core features working

---

## 🎯 Week 2 Success Criteria

By end of Week 2, we should have:

### **Authentication** ✅
- [x] Login/logout working
- [x] Registration working for all roles
- [x] JWT tokens properly managed
- [x] Biometric auth functional

### **Incident Management** ✅
- [ ] Survivors can create incidents
- [ ] Incidents stored in backend database
- [ ] Voice recordings uploaded
- [ ] Survivors can view/edit own incidents
- [ ] Soft delete working

### **Case Assignment** ✅
- [ ] Urgent cases auto-assign to GBV Rescue
- [ ] Routine cases go to dispatcher queue
- [ ] Dispatcher can manually assign
- [ ] Providers can accept/reject assignments
- [ ] Case status updates work

### **Messaging** ✅
- [ ] Survivor can message provider
- [ ] Provider can reply
- [ ] Messages stored in database
- [ ] HTTP polling delivers messages (5sec intervals)
- [ ] Read status tracked

### **Push Notifications** ✅
- [ ] Providers notified on assignment
- [ ] Dispatchers notified on new urgent cases
- [ ] Survivors notified on status changes
- [ ] Notification taps navigate correctly
- [ ] Works on iOS and Android

---

## 📝 Daily Standup Questions

**Every Morning:**
1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers?

**Every Evening:**
1. Did I hit today's goals?
2. What's blocking me?
3. What's tomorrow's priority?

---

## 🚨 Risk Mitigation

### **If Behind Schedule (Day 12)**

**Can Drop:**
- WebSocket real-time (keep HTTP polling)
- Voice transcription
- Evidence upload
- Advanced notification features

**Must Keep:**
- Basic authentication
- Incident creation
- Case assignment
- Basic messaging (HTTP polling)
- Basic push notifications

### **If Major Blocker (Any Day)**

**Contingency:**
1. Document the issue clearly
2. Try alternative approach
3. Ask for help if stuck > 2 hours
4. Consider simplifying feature
5. Update timeline if needed

---

## 🔧 Useful Commands This Week

### **Backend**
```bash
# View logs
cd ~/Documents/Work/Evarest/kintara-backend
make logs

# Access Django shell
make shell

# Create migrations
make makemigrations

# Run migrations
make migrate

# Start Celery worker
celery -A kintara worker --loglevel=info
```

### **Frontend**
```bash
# Start Expo
cd ~/Documents/Work/Evarest/kintaraa-app
npx expo start

# Clear cache
npx expo start -c

# Check logs
npx expo start --web --offline
```

### **Testing**
```bash
# Test endpoint with curl
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "survivor@kintara.com", "password": "Test123!@#"}'

# Check Docker status
cd ~/Documents/Work/Evarest/kintara-backend
docker-compose ps
```

---

## 📊 Progress Tracking

```
Week 1: Backend Setup                [████████████████████] 100% ✅
Week 2: Core Features                 [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 8:  Authentication Integration  [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 9:  Incident Management         [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 10: Case Assignment             [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 11: Messaging Backend           [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 12: Messaging Frontend          [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 13: Push Notifications          [░░░░░░░░░░░░░░░░░░░░]   0%
  Day 14: Testing & Polish            [░░░░░░░░░░░░░░░░░░░░]   0%
```

---

## 🎓 Learning Resources

### **Django Channels (for future WebSocket)**
- https://channels.readthedocs.io/

### **Expo Push Notifications**
- https://docs.expo.dev/push-notifications/overview/

### **React Query**
- https://tanstack.com/query/latest/docs/react/overview

### **Celery Tasks**
- https://docs.celeryq.dev/en/stable/

---

**Let's build! 🚀**

**Current Status**: Week 2, Day 8 - Ready to start authentication integration!
