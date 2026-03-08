# Outcomes

This page defines the outcome metrics the platform is designed to measure, and documents the current state of data collection.

## Target outcomes

### For survivors

| Outcome | Indicator | Target |
|---|---|---|
| Timely initial response | Time from incident submission to first provider assignment | < 15 minutes (urgent), < 24 hours (routine) |
| Appropriate service match | Cases where requested services align with assigned provider types | > 80% |
| Case completion | Cases that reach 'completed' or 'closed' status | > 70% of assigned cases |
| Survivor re-engagement | Survivors who return to the app after initial report | Tracked, no target set |

### For providers

| Outcome | Indicator | Target |
|---|---|---|
| Provider response rate | Assignments accepted vs. declined | > 85% acceptance rate |
| Response time | Time from assignment to acceptance | < 15 minutes (urgent), < 60 minutes (routine) |
| Caseload management | Providers operating below max capacity | Tracked per provider |
| Multi-provider coordination | Cases with 2+ provider types engaged | Tracked |

### Platform-level

| Outcome | Indicator | Target |
|---|---|---|
| Incident reporting rate | Reports submitted per month | Tracked over time |
| Anonymous reporting usage | Proportion of reports from anonymous sessions | Tracked |
| Offline submission usage | Reports submitted while offline | Tracked |
| Sync success rate | Offline reports successfully synced | > 95% |

## Current data collection status

The platform is in active development. Outcome data is not yet being collected from real cases. The following table shows what is in place and what is planned.

| Metric | Data source | Status |
|---|---|---|
| Time to assignment | `assigned_at` in `CaseAssignment` model | Model exists; API endpoints active |
| Provider acceptance rate | `acceptance_rate` in `ProviderProfile` model | Model exists; calculation implemented |
| Provider current caseload | `current_case_load` in `ProviderProfile` | Tracked; updated on assignment |
| Average provider response time | `average_response_time_minutes` in `ProviderProfile` | Stored; update mechanism TBD |
| Case status progression | `status` field in `Incident` model | Tracked across all status changes |
| Anonymous reporting rate | `is_anonymous` flag in `Incident` model | Tracked |
| Survivor wellbeing over time | `MoodEntry` model | Planned — model not yet built |
| Provider satisfaction ratings | Provider `rating` field | Currently mock data |

## Technical metrics (platform reliability)

The development roadmap defines the following technical targets that must be met before the platform can reliably measure impact:

| Metric | Target |
|---|---|
| API response time (95th percentile) | < 300ms |
| Real-time message delivery latency | < 500ms |
| File upload success rate | > 95% |
| Assignment within 15 minutes (urgent) | > 90% of cases |
| Offline sync success rate | > 95% |

## Evaluation approach

<!-- TODO: Define the evaluation methodology — who conducts it, at what frequency, using what data collection tools. This section requires input from M&E partners. -->

A formal evaluation framework has not yet been defined. Before the platform is deployed in a production context, the following should be established:

1. **Baseline data** — prevalence of GBV reports in the target area, existing response times, current provider capacity
2. **Data collection cadence** — monthly or quarterly reporting cycles
3. **Aggregation and anonymization** — how individual case data is combined to produce aggregate indicators without exposing survivor identity
4. **Independent review** — who reviews outcome data outside the development team
5. **Feedback loops** — how outcome data informs platform changes and provider training

## What the platform cannot directly measure

- Whether survivors are actually safer after using the platform
- Whether violence recurrence rates change
- Provider quality of care (the platform tracks assignment and response, not clinical outcomes)
- Long-term psychological recovery

These outcomes require complementary research methods: surveys, follow-up interviews, and coordination with health and legal systems that track case outcomes over time.
