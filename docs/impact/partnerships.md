# Partnerships

<!-- TODO: This page requires input from the Kintaraa team. No formal partnership data was found in the codebase. The sections below define what partnership information should be documented here. -->

## Current partnership status

No formal partnership agreements are documented in the codebase or project files reviewed. The platform references Kenya as its primary deployment context (based on the inclusion of Kenya Ministry of Health PRC Form 363 and references to Kenyan legal forms in `assets/documents/forms/`), but no partner organizations are named.

This page should be updated with:
- Named partner organizations (GBV rescue centers, hospitals, legal aid clinics, police units, NGOs)
- Their role in the platform (provider network, data governance, deployment support)
- Geographic coverage of each partner
- Any formal MOU or data-sharing agreements

## Types of partnerships the platform requires

For Kintaraa to function in any deployment context, three categories of partnerships are required:

### 1. Provider network partners

These are the organizations whose staff become service providers on the platform. Each partner organization's staff must be:
- Registered with appropriate role and provider type
- Trained on the platform and their case management workflow
- Committed to response time and availability standards

**Required partner types:**
- Healthcare facilities (hospitals, clinics)
- Legal aid organizations
- Law enforcement (police units with GBV desks)
- Counseling and psychosocial support organizations
- Social services agencies
- GBV rescue and shelter organizations
- Community health worker programs

### 2. Data governance partners

Given the sensitivity of survivor data, the platform should operate under a data governance agreement with:
- The deploying organization or consortium
- Relevant government ministries (health, gender, justice)
- A designated data protection officer or oversight body

Data governance agreements should specify:
- Who has administrative access to the platform
- Data retention periods
- Procedures for survivor data deletion requests
- Breach notification obligations
- Audit access for oversight bodies

### 3. Technical and funding partners

Organizations that support platform development, deployment, and maintenance:
- Technology partners (infrastructure hosting, security audits)
- Funders (grants, impact investment)
- Research partners (evaluation, M&E)

## Included legal forms

The repository includes the following official forms in `assets/documents/forms/`, indicating intent to support formal legal and medical documentation processes:

| Form | Description |
|---|---|
| Kenya MOH PRC Form 363 | Post-Rape Care form (PDF included) |
| OB Form | Occurrence Book form (police report) |
| P3 Form | Medical examination form for assault (used in Kenyan courts) |
| Protection Order | Protection order application |

These forms suggest the platform is designed for or has been piloted in the Kenyan GBV response context. Partner organizations in Kenya who use these forms are the natural first integration targets.

## What partners should know before joining

1. **Data responsibilities** — Provider organizations are responsible for ensuring their staff use the platform appropriately and within their professional codes of conduct
2. **Response time commitments** — GBV rescue providers on the platform are expected to respond within 15 minutes on urgent cases; failure to do so affects automatic assignment
3. **Data retention** — Case data remains in the system; organizations should review the data retention policy and ensure it meets their legal obligations
4. **Security requirements** — Staff devices should meet minimum security requirements (PIN/biometric lock, up-to-date OS)
5. **Training requirement** — All platform users require onboarding training before activation

<!-- TODO: Add formal partnership application process once established -->
<!-- TODO: Add contact information for partnership inquiries -->
