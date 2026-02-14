# Quick Start Checklist - MVP Development

**Target**: January 15, 2026 (31 days)
**Goal**: 3 Working Dashboards (Survivor + Dispatch + GBV Rescue)

---

## 🚀 Week 1: Foundation (Days 1-7)

### Backend Setup (Days 1-2)
```bash
□ cd ~/Documents/Work/Evarest/kintara-backend
□ python -m venv venv && source venv/bin/activate
□ pip install -r requirements.txt
□ cp .env.example .env  # Edit with your values
□ docker-compose up -d db redis
□ python manage.py migrate
□ python manage.py createsuperuser
□ python manage.py runserver 8000
□ Visit http://localhost:8000/swagger/
```

### Frontend Connection (Days 3-4)
```typescript
□ Update constants/domains/config/ApiConfig.ts
  - API_BASE_URL = 'http://localhost:8000/api'
□ Test login from frontend to backend
□ Verify JWT tokens stored in AsyncStorage
□ Test registration flow (all roles)
```

### Integration Testing (Days 5-7)
```bash
□ Survivor: Register → Login → Create Incident
□ Provider: Login → View Assigned Cases → Accept
□ Dispatcher: Login → View All Cases → Assign
□ End-to-end flow works
```

---

## 💬 Week 2: Messaging & Notifications (Days 8-14)

### Messaging System (Days 8-10)
```python
□ Create apps/messaging/models.py (Message model)
□ Create serializers and views
□ Add URLs to kintara/urls.py
□ Run python manage.py makemigrations && migrate
□ Test: POST /api/messages/ (send message)
□ Frontend: Update app/messages/[id].tsx
□ Implement HTTP polling (5 seconds)
```

### Push Notifications (Days 11-13)
```python
□ Create FCMDevice model in authentication app
□ Create Celery tasks for notifications
□ Start: celery -A kintara worker --loglevel=info
□ Test provider assignment notification
□ Test dispatcher new case notification
□ Frontend: Register device token on login
```

### Remove Mock Data (Day 14)
```typescript
□ providers/ProviderContext.tsx → real API
□ providers/IncidentProvider.tsx → real API
□ All dashboards show real data
```

---

## ⚡ Week 3: Enhanced Features (Days 15-21)

### WebSocket (Optional - Days 15-17)
```python
□ Create apps/messaging/consumers.py
□ Configure kintara/routing.py
□ Start: daphne -p 8000 kintara.asgi:application
□ Frontend: hooks/useWebSocket.ts
□ Real-time messaging works
```

### Voice Transcription (Optional - Days 18-19)
```python
□ Choose provider (Google/AWS/Azure)
□ Create transcription service
□ Celery task for async transcription
□ Display transcription in frontend
```

### Evidence Upload (Days 20-21)
```python
□ Create Evidence model
□ Build upload endpoints
□ Configure S3 for production
□ Frontend: Image picker + upload
```

---

## 🧪 Week 4: Testing & Polish (Days 22-28)

### Testing (Days 22-25)
```bash
□ Backend: python manage.py test (80%+ coverage)
□ Integration: Test all user flows
□ Performance: API < 200ms, App < 3s load
□ Security: Input validation, rate limiting
```

### Bug Fixes (Days 26-28)
```bash
□ Handle expired tokens
□ Network error handling
□ Edge cases (no providers, etc.)
□ Security hardening
```

---

## 🚢 Week 5: Deployment (Days 29-31)

### Production Deploy (Day 29)
```bash
□ Setup production environment vars
□ Deploy backend (AWS/Heroku/DigitalOcean)
□ Setup Nginx + SSL
□ Start Celery workers
□ Build mobile apps (eas build)
```

### Final Testing (Day 30)
```bash
□ Smoke test all critical flows
□ Load test production
□ Update documentation
```

### Launch (Day 31)
```bash
□ Submit to App Stores
□ Soft launch (limited users)
□ Monitor for issues
□ Full launch
```

---

## 📋 Minimum Viable Features (Must Have)

### Survivor Dashboard
✅ Register & Login
✅ Report incident (with voice)
✅ View own incidents
✅ Track case status
✅ Message provider
✅ Receive notifications

### Dispatch Dashboard
✅ View all cases
✅ Filter by status/urgency
✅ Manual assignment
✅ Reassignment
✅ System statistics

### GBV Rescue Dashboard
✅ View assigned cases
✅ Accept/reject assignments
✅ Message survivor
✅ Update case status
✅ Receive notifications

---

## ⚠️ Can Drop if Time Runs Short

1. WebSocket real-time (keep HTTP polling)
2. Voice transcription (manual for now)
3. Evidence upload (defer to post-MVP)
4. Advanced analytics
5. Other 6 provider types

---

## 🔥 Critical Path (Can't Skip)

1. Backend setup + Database
2. Frontend-backend connection
3. Authentication working
4. Incident creation
5. Case assignment
6. Basic messaging (HTTP)
7. Push notifications
8. Production deployment

---

## 📞 Quick Commands Reference

### Backend
```bash
# Start everything
cd ~/Documents/Work/Evarest/kintara-backend
source venv/bin/activate
docker-compose up -d
python manage.py runserver 8000
celery -A kintara worker --loglevel=info

# Database
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Tests
python manage.py test
python manage.py test apps.incidents
```

### Frontend
```bash
# Start dev server
cd ~/Documents/Work/Evarest/kintaraa-app
npx expo start

# Mobile
npx expo start --tunnel

# Web
npx expo start --web --offline

# Build
eas build --platform ios
eas build --platform android
```

---

## 🎯 Daily Check-in Questions

**Every Evening Ask:**
1. What critical features did I complete today?
2. Am I on track with the weekly goals?
3. Any blocking issues?
4. What's tomorrow's top priority?

**Every Monday Ask:**
1. Did I hit last week's milestones?
2. What's this week's must-have?
3. Any risks to timeline?
4. Do I need to drop features?

---

## 🆘 If You're Behind Schedule

**Week 2 (Day 14):**
- Drop WebSocket → Keep HTTP polling
- Drop voice transcription → Manual
- Focus on messaging basics

**Week 3 (Day 21):**
- Drop evidence upload
- Drop advanced features
- Polish existing features

**Week 4 (Day 28):**
- Minimum testing only
- Fix critical bugs only
- Prepare for emergency launch

---

**Remember**: MVP = Minimum VIABLE Product

Ship working software. Iterate later. Quality > Features.

**Next Step**: Start with Day 1 backend setup! 🚀
