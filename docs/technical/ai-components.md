# AI Components

Kintaraa uses intelligent routing and recommendation systems to match survivors with the right providers, surface relevant resources, and help providers manage their caseloads effectively.

## Provider matching

When a case is submitted, the platform evaluates all available providers and ranks them based on multiple factors. The matching system considers:

- **Service alignment** — whether the provider's specialization matches the services the survivor has requested
- **Availability** — whether the provider is currently active and has capacity for new cases
- **Performance** — the provider's track record, including how quickly they respond and how consistently they accept assignments
- **Proximity** — the provider's location relative to the incident, where location data is available

Providers are ranked and the best match is selected. For urgent and immediate cases, this happens automatically. For routine cases, the ranking is presented to a dispatcher who makes the final assignment decision.

## Automatic case routing

The platform uses a hybrid assignment model:

**Urgent and immediate cases** are assigned automatically to the best available GBV rescue provider. If no eligible provider is found, the case escalates to a dispatcher queue rather than going unassigned.

**Routine cases** enter a dispatcher queue directly, where a human coordinator reviews the case and makes the assignment.

The routing logic prioritizes providers who are least busy and have the fastest response times, ensuring cases do not stack on already-loaded providers.

## Survivor recommendations

When a survivor accesses their dashboard, the platform generates personalized guidance based on their reported incident:

- **Relevant resources** — services and contacts matched to the incident type (e.g., medical resources for physical violence, legal resources for economic abuse)
- **Safety guidance** — contextual safety tips based on the nature of the incident
- **Next steps** — actionable guidance based on the current case status and what services have been requested
- **Risk assessment** — a risk level indicator based on incident characteristics, used to flag cases that may need expedited attention

## Caseload and pattern insights

Providers receive automated insights to help manage their work:

- Alerts when response times are trending longer than normal
- Identification of patterns in their caseload (e.g., predominant incident types) that may inform training or specialization
- Capacity indicators to help dispatchers see who is available

For survivors, the system detects patterns across multiple incidents — such as increasing frequency — and surfaces safety alerts prompting enhanced safety planning.

## What the system does not do

- It does not make final decisions. Assignment is confirmed by a provider accepting a case or a dispatcher approving it.
- It does not use machine learning or train on survivor data. All matching logic is deterministic and rule-based.
- It does not share individual survivor data with other survivors or with unassigned providers.
- It does not score or rank survivors. Only providers are ranked, for assignment purposes.
