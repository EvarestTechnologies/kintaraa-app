# Compliance

This page documents the compliance obligations relevant to the Kintaraa platform, and the current status of each.

## Applicable frameworks

The platform's compliance obligations depend on where it is deployed and who it serves. Based on the codebase and design context (Kenya, survivor data, healthcare and legal integrations), the following frameworks are relevant:

| Framework | Jurisdiction | Relevance |
|---|---|---|
| Kenya Data Protection Act (2019) | Kenya | Primary — survivor data is personal and sensitive data under this act |
| GDPR | EU / International | Applies if the platform serves EU-based survivors or is operated by EU-based entities |
| Kenya Mental Health Act (2022) | Kenya | Relevant to counseling sessions and mental health data |
| Kenya Sexual Offences Act | Kenya | Governs how sexual violence cases are handled by providers |
| Kenya Evidence Act | Kenya | Relevant to evidence chain-of-custody features used by law enforcement |
| HIPAA | USA | Applicable only if US-based healthcare providers are involved |

<!-- TODO: Confirm applicable frameworks with legal counsel in each deployment jurisdiction before launch -->

---

## Kenya Data Protection Act (2019)

The Kenya DPA governs the collection, processing, and storage of personal data. Key obligations:

### Registration
Organizations processing personal data must register with the Office of the Data Protection Commissioner (ODPC). The deploying organization must complete this registration before the platform goes live.

### Lawful basis for processing
The platform relies on two lawful bases:
- **Consent** — survivors provide consent when submitting a report (explicit for registered users; implied for anonymous sessions, which requires review)
- **Vital interests** — processing may be justified on vital interests grounds when immediate safety is at risk

**Gap:** The current app does not present a formal consent mechanism at registration or at the point of anonymous report submission. A consent flow must be implemented.

### Sensitive personal data
Incident reports, voice recordings, location data, medical information, and counseling notes are all sensitive personal data under the Kenya DPA. They require explicit consent and additional technical and organizational safeguards.

**Status:** Technical safeguards (access control, planned encryption) are partially in place. Organizational safeguards (policies, staff training, incident response procedures) are not yet documented.

### Data subject rights

| Right | Required response time | Platform support |
|---|---|---|
| Right to access | Without undue delay | Partial — survivors can view own records in-app |
| Right to rectification | Without undue delay | Not implemented |
| Right to erasure | Without undue delay | Not implemented |
| Right to data portability | Without undue delay | Not implemented |
| Right to object | Without undue delay | Not implemented |

These rights must be implemented before the platform processes real survivor data.

### Data Protection Impact Assessment (DPIA)

A DPIA is required when processing is likely to result in high risk to individuals. Given that the platform processes sensitive personal data of vulnerable individuals, a DPIA is required. None has been conducted.

**Action:** A DPIA must be conducted and documented before production deployment.

---

## Healthcare data

The platform's healthcare provider module will capture medical records linked to survivors. In Kenya:
- Medical records are governed by the Health Act (2017) and professional codes of conduct
- Records must be kept confidential and accessible only to authorized medical personnel
- Patient consent is required for sharing records across providers

**Gap:** The consent model for sharing medical records between a healthcare provider and, for example, a legal provider on the same case has not been defined. The platform currently allows all providers assigned to a case to view the incident record, but domain-specific records (medical, legal, counseling) are designed to be access-controlled per provider type. This must be confirmed in the implementation before launch.

---

## Evidence handling (law enforcement)

The Kenya Evidence Act governs the admissibility of evidence in court. For the platform's law enforcement module:
- Chain-of-custody documentation must be complete and auditable
- Digital evidence must be stored in a way that prevents tampering

The `EvidenceLog` model (planned) includes a `chain_of_custody` JSONField. Before evidence collected through the platform is used in legal proceedings, legal counsel must confirm that digital chain-of-custody records meet Kenyan court standards.

---

## Official forms

The repository includes three official Kenyan legal and medical forms:

| Form | Authority | Purpose |
|---|---|---|
| Kenya MOH PRC Form 363 | Ministry of Health | Post-Rape Care documentation |
| P3 Form | Kenya Police / Courts | Medical examination record for assault; required for prosecution |
| OB Form | Kenya Police | Occurrence Book — official police incident record |
| Protection Order | Judiciary | Application for protection order under the Protection Against Domestic Violence Act |

These forms confirm that the platform is designed for integration with formal Kenyan legal and health systems. Any digitization or pre-filling of these forms within the platform must comply with requirements set by the issuing authorities.

---

## Compliance checklist before production

| Item | Status |
|---|---|
| ODPC registration | Not started |
| Data Protection Impact Assessment | Not started |
| Survivor consent flow implemented | Not started |
| Privacy notice (plain language, in-app) | Not started |
| Data subject rights implemented (erasure, access, portability) | Not started |
| Data retention policies defined and automated | Not started |
| Staff data protection training | Not started |
| Incident response procedure documented | Not started |
| Penetration test completed | Not started |
| AES encryption for local storage | Not started |
| End-to-end message encryption | Not started |
| Signed S3 URLs with expiration | Not started |
| Audit logging for admin access | Not started |
| Legal review of evidence chain-of-custody approach | Not started |
| Legal review of cross-provider data sharing model | Not started |

<!-- TODO: Assign owners and target dates for each compliance item before the platform onboards real users -->
