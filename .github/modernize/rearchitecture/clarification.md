---
schema: clarification/v1
generated_at: "2026-11-17T12:59:25Z"
scope:
  - frontend
  - backend
  - generic
clarity_score: 0.67
rounds: 1
gaps:
  - F1
  - F3
  - F5
  - F6
  - F7
  - F8
  - F9
  - F10
  - B1
  - B3
  - B4
  - B5
  - G2
  - G3
blocking_gaps:
  - id: F1
    note: "No frontend framework/version was specified. Preserve the existing frontend and do not select an arbitrary version."
  - id: F3
    note: "No screenshot/reference files were supplied. Preserve the current UI; use the existing application as the visual reference during later analysis."
  - id: B1
    note: "PHP must be removed/replaced, but no replacement backend framework/version was selected. Determine it during architecture assessment; do not assume an arbitrary version."
---

# Scenario Clarification

## Frontend

- **Target framework**: Preserve the existing frontend framework and version; do not introduce an arbitrary target version. Confirm the concrete framework/version during architecture assessment.
- **Component library**: Preserve the existing UI/component library; do not introduce a new UI library.
- **Screenshots**: None supplied. Preserve the current UI and use the existing application as the reference during later analysis.
- **Design system**: Match the existing UI and preserve current frontend behavior.
- **Accessibility**: WCAG 2.1 AA (default).
- **Browser targets**: Modern evergreen (default).
- **Responsive strategy**: Mobile-first, existing breakpoints (default).
- **i18n locales**: Preserve current locales (default).
- **State management**: Preserve existing pattern (default).
- **Routing**: Framework default (default).

## Backend

- **Target framework**: Remove/replace PHP. The replacement framework and version are intentionally deferred to architecture assessment; do not select arbitrary versions.
- **API contract preservation**: Must preserve existing API/backend behavior.
- **Data migration strategy**: MongoDB is the selected database. Assess the data migration strategy during the research phase.
- **Auth framework**: Preserve existing (default).
- **SLA targets**: Match current production baseline (default).

## Generic

- **Success definition**: Complete the full-project migration while preserving existing UI and backend/frontend behavior.
- **Out of scope**: None specified; full project is in scope (default/inferred).
- **Existing test posture**: Must pass (default).
- **Output location**: In-place at `C:\Projects\INTEG-2`.
- **Additional constraints**: Complete the full-project migration in place, use MongoDB, and remove/replace the PHP pages and configuration. Preserve the current UI and backend/frontend behavior; do not introduce a new UI library or arbitrary framework versions.

---

## Gaps & Defaults Applied

- id: F1
  resolution: blocking
  note: "Preserve the existing frontend framework/version; concrete version remains to be confirmed during architecture assessment."
- id: F3
  resolution: blocking
  note: "No screenshot/reference supplied; preserve the existing UI and use the application as the later visual reference."
- id: F5
  resolution: default
  default_used: "WCAG 2.1 AA"
- id: F6
  resolution: default
  default_used: "modern evergreen"
- id: F7
  resolution: default
  default_used: "mobile-first, existing breakpoints"
- id: F8
  resolution: default
  default_used: "preserve current locales"
- id: F9
  resolution: default
  default_used: "preserve existing pattern"
- id: F10
  resolution: default
  default_used: "framework default"
- id: B1
  resolution: blocking
  note: "Replace/remove PHP; choose the replacement backend framework/version after architecture assessment."
- id: B3
  resolution: default
  default_used: "TBD / assess in research phase"
- id: B4
  resolution: default
  default_used: "preserve existing"
- id: B5
  resolution: default
  default_used: "match current production baseline"
- id: G2
  resolution: default
  default_used: "agent infers from project structure"
- id: G3
  resolution: default
  default_used: "must pass"

## Downstream Usage Notes

- The user's authoritative decisions are recorded: full-project scope, MongoDB, removal/replacement of PHP, and in-place work at `C:\Projects\INTEG-2`.
- The open form is reconciled; do not reopen it or re-ask these decisions.
- Blocking gaps above concern implementation specifics intentionally deferred by the user. The gate is READY to proceed with architecture assessment; resolve these before selecting implementation frameworks or finalizing visual parity evidence.
- Preserve the current UI and behavior. Do not introduce a new UI library or arbitrary framework versions.
