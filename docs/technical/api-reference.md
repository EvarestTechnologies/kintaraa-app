# API Reference

The Kintaraa backend exposes a REST API consumed by the mobile app and, in future, by the provider web dashboard. All endpoints are prefixed with `/api/`.

A live interactive API reference (Swagger UI) is available at `/swagger/` on any running backend instance. A ReDoc version is available at `/redoc/`.

## Base URL

```
https://api.kintaraa.com/api/
```

For local development, the default base URL is `http://localhost:8000/api/`.

## Authentication

All endpoints except registration, login, and health check require a valid Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens are short-lived. Use the token refresh endpoint to obtain a new access token without requiring the user to log in again.

---

## Authentication endpoints

### Register

`POST /auth/register/`

Create a new user account.

**Request body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Must meet complexity requirements |
| `confirm_password` | string | Yes | Must match `password` |
| `first_name` | string | Yes | |
| `last_name` | string | Yes | |
| `role` | string | Yes | `survivor` or `provider` |
| `provider_type` | string | Conditional | Required when `role` is `provider` |
| `is_anonymous` | boolean | No | Default `false` |

**Provider types:** `healthcare`, `legal`, `police`, `counseling`, `social`, `gbv_rescue`, `chw`

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { ... },
  "tokens": {
    "access": "<access_token>",
    "refresh": "<refresh_token>"
  }
}
```

---

### Login

`POST /auth/login/`

Authenticate a user and receive tokens.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | string | Yes |
| `password` | string | Yes |

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "tokens": {
    "access": "<access_token>",
    "refresh": "<refresh_token>"
  }
}
```

**Response `401`:** Invalid credentials.

---

### Refresh token

`POST /auth/token/refresh/`

Exchange a valid refresh token for a new access token.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `refresh` | string | Yes |

**Response `200`:**
```json
{
  "success": true,
  "access": "<new_access_token>"
}
```

---

### Logout

`POST /auth/logout/`  _(Authenticated)_

Invalidate the refresh token server-side.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `refresh` | string | Yes |

---

### Get profile

`GET /auth/profile/`  _(Authenticated)_

Returns the current authenticated user's profile.

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "full_name": "Jane Doe",
    "role": "survivor",
    "provider_type": null,
    "is_anonymous": false,
    "biometric_enabled": false,
    "is_active": true,
    "last_login": "2026-03-08T10:00:00Z",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-03-08T10:00:00Z"
  }
}
```

---

### Update profile

`PUT /auth/profile/update/`  _(Authenticated)_

Update first name and/or last name.

---

### Enable / disable biometric

`POST /auth/biometric/enable/`  _(Authenticated)_

`POST /auth/biometric/disable/`  _(Authenticated)_

Toggles the `biometric_enabled` flag on the user account.

---

### Health check

`GET /auth/health/`  _(Public)_

Returns `200` if the API is reachable. No authentication required. Used by the mobile app to detect backend connectivity on startup.

---

## Incident endpoints

### List incidents

`GET /incidents/`  _(Authenticated)_

Returns incidents belonging to the authenticated survivor, or all incidents for dispatchers and administrators.

**Query parameters:**

| Parameter | Type | Notes |
|---|---|---|
| `status` | string | Filter by status |
| `type` | string | Filter by incident type |
| `severity` | string | Filter by severity |

---

### Create incident

`POST /incidents/`  _(Authenticated)_

Submit a new incident report.

**Request body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | Yes | `physical`, `sexual`, `emotional`, `economic`, `online`, `femicide` |
| `incident_date` | date | Yes | `YYYY-MM-DD` |
| `incident_time` | time | Yes | `HH:MM:SS` |
| `description` | string | Yes | |
| `location` | object | Yes | `{address, latitude, longitude}` |
| `severity` | string | No | `low`, `medium` (default), `high` |
| `support_services` | array | No | List of requested service types |
| `urgency_level` | string | No | `routine` (default), `urgent`, `immediate` |
| `is_anonymous` | boolean | No | Default `false` |

**Response `201`:** Full incident object including generated `case_number`.

Case numbers follow the format `KIN-YYYYMMDD-NNN`.

---

### Get incident

`GET /incidents/{id}/`  _(Authenticated)_

Returns a single incident. Access is restricted to the owning survivor, assigned providers, dispatchers, and administrators.

---

### Update incident

`PATCH /incidents/{id}/`  _(Authenticated)_

Update incident fields. Survivors can update their own incidents. Status changes are restricted by role.

---

## Provider endpoints

### List available providers

`GET /providers/`  _(Authenticated — Dispatcher/Admin)_

Returns providers with their current availability and caseload.

**Query parameters:**

| Parameter | Type | Notes |
|---|---|---|
| `provider_type` | string | Filter by specialization |
| `available` | boolean | Filter to currently available providers only |

---

### Get assigned cases

`GET /providers/assigned-cases/`  _(Authenticated — Provider)_

Returns all case assignments for the authenticated provider.

---

### Accept assignment

`POST /incidents/{id}/accept/`  _(Authenticated — Provider)_

Accept a pending case assignment.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `notes` | string | No |

---

### Reject assignment

`POST /incidents/{id}/reject/`  _(Authenticated — Provider)_

Decline a pending case assignment.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `reason` | string | No |

---

## Dispatch endpoints

### Assign provider to case

`POST /dispatch/assign/`  _(Authenticated — Dispatcher/Admin)_

Manually assign a provider to an incident.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `incident_id` | string | Yes |
| `provider_id` | string | Yes |
| `notes` | string | No |

---

## Common response codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Validation error — check `errors` field in response |
| `401` | Unauthenticated — token missing or invalid |
| `403` | Forbidden — authenticated but not authorized |
| `404` | Not found |
| `500` | Server error |

All error responses follow the format:
```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": { ... }
}
```

---

## Planned endpoints

The following endpoints are defined in the development roadmap and will be available in upcoming releases:

| Endpoint | Purpose |
|---|---|
| `GET /incidents/{id}/messages/` | Case message history |
| `POST /incidents/{id}/messages/` | Send message |
| `POST /incidents/{id}/upload-evidence/` | Upload evidence file |
| `GET /notifications/` | Get notifications |
| `POST /notifications/register-token/` | Register push token |
| `GET /incidents/{id}/timeline/` | Case activity timeline |
| `GET /wellbeing/mood/` | Mood history |
| `POST /wellbeing/mood/` | Log mood entry |
| `GET/POST /appointments/` | Appointment management |
