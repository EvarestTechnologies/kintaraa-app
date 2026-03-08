# AI Components

Kintaraa uses rule-based algorithmic logic — referred to in the codebase as "AI-powered" — to score providers, route cases, generate survivor recommendations, and surface performance insights. These are deterministic scoring systems, not machine learning models. This page documents exactly what each system does.

## 1. Provider scoring algorithm

**Location:** `providers/RecommendationProvider.tsx` — `calculateProviderScore()`

When a case needs to be assigned, the system scores each available provider against the incident using a weighted formula.

### Scoring weights

| Factor | Weight | Logic |
|---|---|---|
| Service match | 40% | Proportion of requested services that the provider offers |
| Availability | 25% | Whether provider is available; scaled by unused capacity |
| Provider rating | 20% | Provider's rating score out of 5 |
| Response time | 15% | Faster response time = higher score; baseline 120 minutes |
| Bonus: emergency capable | +10 pts | Applied when incident is critical AND provider response time ≤ 15 min |
| Bonus: geographic proximity | +5 pts | Applied when provider location is within ~10km of incident |

### Scoring formula

```typescript
// Service match (40% weight)
serviceMatch = matchingServices / totalRequestedServices
score += serviceMatch * 40

// Availability (25% weight)
availabilityScore = isAvailable ? unusedCapacityRatio * 25 : 0
score += availabilityScore

// Performance (20% weight)
score += (rating / 5) * 20

// Response time (15% weight)
score += Math.max(0, (120 - responseTimeMinutes) / 120) * 15
```

Confidence is calculated as `min(100, score + reasons.length * 5)`, where `reasons` is the list of positive matching factors.

### Output

The algorithm returns a ranked list of up to 5 provider recommendations per case, each with:
- `score` (0–100)
- `confidence` (0–100)
- `reasons` — human-readable list of why this provider was recommended

## 2. Automatic case assignment

**Location:** `kintara-backend/apps/incidents/services.py` — `HybridAssignmentService`

This is the backend-side assignment logic that actually creates `CaseAssignment` records.

### Assignment decision tree

```
New incident received
  ├── urgency_level == 'immediate' or 'urgent'
  │     └── Find best available GBV Rescue provider
  │           ├── Provider found → auto-assign → status: 'assigned'
  │           └── No provider found → escalate to dispatcher queue
  └── urgency_level == 'routine'
        └── Queue for dispatcher review → status: 'pending_dispatcher_review'
```

### Provider selection criteria (urgent cases)

```python
# apps/incidents/services.py — ProviderAssignmentService.find_best_gbv_rescue_provider()
providers = User.objects.filter(
    role='provider',
    provider_type='gbv_rescue',
    is_active=True,
    provider_profile__is_currently_available=True
).exclude(
    provider_profile__current_case_load__gte=F('provider_profile__max_case_load')
).order_by(
    'provider_profile__current_case_load',       # Least busy first
    'provider_profile__average_response_time_minutes'  # Fastest first
)
```

The system assigns to `providers.first()` — the best match by the above ordering.

### Dispatcher recommendations

When dispatchers are manually assigning cases, the system provides ranked provider recommendations via `ProviderAssignmentService.get_provider_recommendations()`, which applies the same ordering logic across all provider types.

## 3. Survivor recommendation engine

**Location:** `providers/RecommendationProvider.tsx` — `generateSurvivorRecommendations()`

When a survivor views their dashboard, the system generates:

- **Recommended resources** — based on the most recent incident type
- **Safety tips** — contextual to the incident type
- **Next steps** — based on case status and requested services
- **Risk assessment** — a risk level and contributing factors

### Resource recommendations by incident type

| Incident type | Primary resource recommended |
|---|---|
| Physical violence | Emergency medical care (911), restraining order assistance |
| Emotional abuse | Trauma counseling (hotline: 1-800-799-7233) |
| All types | National Domestic Violence Hotline (always included) |

### Risk assessment

```
Risk level = 'medium' (default)
  ├── priority == 'critical'  → level = 'critical'
  ├── type == 'physical'      → level = max('high', current)
  └── incidents.length > 1   → factor: 'Multiple incidents reported'
```

### Survivor next steps

The system generates next steps dynamically:
- If no provider is assigned → "Wait for case worker assignment (typically within 24 hours)"
- If medical service requested → "Schedule medical evaluation if not already done"
- If legal service requested → "Consult with legal aid about your options"
- Always → "Document any new incidents or evidence" + "Stay connected with your support network"

## 4. Pattern analysis (AI insights)

**Location:** `providers/RecommendationProvider.tsx` — `analyzePatterns()`

This runs in the background and generates insights for both providers and survivors.

### For providers
- **Response time alert:** If average response time across assigned cases > 60 minutes, a `performance` insight is generated
- **Specialization insight:** Identifies the most common incident type in the provider's caseload and suggests relevant training

### For survivors
- **Safety pattern alert:** If a survivor has multiple incidents within a 30-day average gap, a high-priority safety alert is generated

These insights are surfaced in the dashboard as actionable cards. The analysis currently runs client-side with a simulated async delay.

## Limitations and planned improvements

| Limitation | Notes |
|---|---|
| No machine learning | All scoring is rule-based; weights are hardcoded |
| No geographic optimization (backend) | Location proximity is a frontend-only bonus; backend assignment does not yet use location |
| No survivor satisfaction feedback loop | Provider ratings are mock values; no mechanism yet to collect real feedback |
| Analysis runs client-side | Pattern analysis should move to the backend for scale and consistency |
| No model versioning | Rules changes are not versioned; difficult to audit what logic was applied to a given case |

<!-- TODO: Document planned ML pipeline if one is designed — e.g., for risk prediction or recurrence detection -->
