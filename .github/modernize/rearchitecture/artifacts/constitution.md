<!--
Sync Impact Report
- Version change: no prior constitution -> 1.0.0 (initial adoption; new governance baseline).
- Modified principles: none; five initial principles established below.
- Added sections: MongoDB and Data Migration Constraints; Delivery and Quality Gates.
- Removed sections: none.
- Templates checked: creating-implementation-plan/templates/plan-template.md — aligned; no edit needed.
  feature-inventory/templates/spec-template.md — aligned; no edit needed.
  breaking-down-tasks/templates/tasks-template.md — unavailable in the installed skill set; pending
  verification when the task-breakdown format is selected.
- Project runtime guidance: no project-level constitution or root README was present; the client
  README is the unmodified Vite starter guide and is not project governance.
- Deferred: confirm the ratification date with the project owner; architect must confirm effective
  supported runtime/dependency versions, and DBA must define the MongoDB data migration plan.
-->

# INTEG-2 Migration Constitution

## Migration Mode

**Mode**: REWRITE

**Justification**: The user selected full-project scope, MongoDB, and replacement/removal of PHP.
The target is a single MERN application delivered in place, not a PHP/MERN coexistence model.
Existing React, Express, and Mongoose work may be retained when it satisfies the approved
architecture and parity requirements. Unrelated or pre-existing worktree changes must be preserved.

## Core Principles

### I. User-Selected Scope and PHP Removal

All in-scope application behavior must run in the MERN application when migration is complete.
Production routes, pages, persistence configuration, and runtime dependencies must not require PHP.
Do not introduce a PHP fallback or dual-runtime deployment. Keep non-runtime backups or historical
materials only when the approved implementation plan identifies their purpose and confirms they
cannot be mistaken for active application code.

### II. Behavioral and UX Parity

Treat the existing application and approved feature inventory as the behavioral reference. Preserve
user-visible journeys, route paths and methods, authentication and authorization outcomes, validation,
status and error behavior, data meanings, upload behavior, and responsive presentation unless an
approved requirement explicitly changes them. Do not infer missing product rules: record the
ambiguity and obtain a decision from the user or product owner before implementing it. A change to
behavior is acceptable only when it is traceable to an approved requirement.

### III. MongoDB Data Fidelity

MongoDB is the target application's authoritative persistence store. Model documents and indexes to
preserve the existing entities, relationships, required/optional distinctions, uniqueness rules,
ordering, and lifecycle semantics. Before migration, document source-to-target mappings, treatment
of existing records and uploaded files, repeatability, validation/reconciliation evidence, and a
recovery approach. Do not silently drop, reinterpret, or irreversibly transform existing data;
document and obtain approval for any unavoidable loss or semantic change.

### IV. MERN Boundaries and Version Discipline

Use React for the client and Node.js/Express for the server, with MongoDB accessed through the
approved data layer. The browser communicates with server-owned APIs; database access and secrets
remain server-side. Preserve current manifest-declared versions until architecture assessment
confirms compatibility and the supported target set. The current declarations are evidence, not
authorization for an arbitrary upgrade. Record and justify every necessary version change before
implementation; do not add a UI/component framework without explicit approval.

### V. Testable Delivery and Security

Capture existing behavior before replacement and verify the migrated behavior at client, API, and
persistence boundaries. Each changed journey must have automated or repeatable acceptance evidence;
tests must exercise MongoDB-backed behavior where persistence is involved. Run the full applicable
build, lint, test, and runtime/API checks before declaring completion, and report exact commands,
results, and limitations. Preserve or strengthen authentication, authorization, input validation,
upload controls, and rate limits. Keep secrets out of source control and use documented environment
configuration. Do not waive a failed gate without an explicit decision and recorded risk acceptance.

## Target Technology Stack

| Component | Target Version | Notes |
|-----------|---------------|-------|
| Node.js | Unspecified; architecture confirmation required | Available shell reports v26.13.1; this is not target approval. |
| Express | Existing manifest declaration: `^5.3.0` | Confirm effective and supported version during architecture assessment. |
| React | Existing manifest declaration: `^19.3.1` | Preserve current UI and component choices. |
| MongoDB | User-selected; server version unspecified | DBA defines schema, indexes, migration, and recovery strategy. |
| Mongoose | Existing manifest declaration: `^9.12.1` | Confirm compatibility with the selected MongoDB/runtime versions. |
| Client build | Existing manifest declaration: Vite `^8.3.6` | Preserve unless a documented compatibility blocker requires change. |

## MongoDB and Data Migration Constraints

- The DBA owns the source-to-MongoDB mapping, indexes, data conversion, migration/reconciliation
  process, and recovery evidence; implementation tasks must consume the approved data artifacts.
- Backend tasks must use the authoritative MongoDB connection/configuration defined by architecture.
  Duplicate or conflicting connection settings must be consolidated or explicitly justified.
- Preserve upload bytes and their association with application records unless product approval
  specifies another outcome. File storage location and MongoDB reference strategy are architecture
  decisions, not assumptions made by individual implementation tasks.
- Seed/test data must be isolated from production data. Migration validation must compare counts
  and relevant field-level invariants, not only confirm that a database connection succeeds.

## Delivery and Quality Gates

- Architecture and feature requirements must precede implementation planning; implementation work
  must cite the applicable requirement and design/data contract.
- Changes must be scoped to the migration. Inspect and preserve unrelated user changes; do not
  overwrite or revert them to simplify the rewrite.
- Validate the end-to-end app, including startup, API responses, database persistence, critical
  user journeys, and responsive UI where applicable. A successful build alone is insufficient.
- Evidence must identify the exact command or procedure, pass/fail outcome, and any skipped checks.
  Quality-gate verdicts are binary: PASS or FAIL. Any HIGH or CRITICAL finding is FAIL; missing
  required evidence is not a pass.
- Product ambiguities that affect routes, data semantics, or user outcomes block the affected work
  until resolved. Non-blocking implementation details may be settled by the responsible architect
  and recorded as decisions without changing approved behavior.

## Governance

This constitution governs migration planning, implementation, and validation for INTEG-2. To amend
it, the proposing role must identify the affected principles, rationale, compatibility impact, and
downstream artifacts; the team lead records the approved change, increments the semantic version,
updates this sync report, and notifies affected roles. MAJOR denotes incompatible principle changes,
MINOR adds or materially expands a principle or section, and PATCH clarifies wording without
changing obligations.

Every downstream plan and implementation review must check the applicable principles and cite
evidence. The team lead owns governance and quality-gate conformance; each implementation owner
produces evidence for their changes, and independent gate tasks review it. A constitution violation
is CRITICAL and must be corrected or explicitly resolved through an approved amendment before work
can pass.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm initial adoption date with project owner | **Last Amended**: 2026-11-17

## Upstream Artifacts Consumed

- `.github/modernize/rearchitecture/clarification.md` — confirmed scope and deferred framework/version
  specifics.
- `.github/modernize/rearchitecture/clarification-answers.md` — user-confirmed full-project scope,
  MongoDB target, PHP replacement/removal, and in-place location.
- `.github/modernize/rearchitecture/artifacts/project-profile.yaml` — existing mixed PHP/React/
  Express/Mongoose structure and rewrite classification.
- `client/package.json` and `server/package.json` — current framework/build declarations, treated as
  evidence rather than authorization to upgrade.

## Evidence Mapping

- `clarification.md#Generic` and `clarification-answers.md#Clarification-Answers` → Migration Mode
  and Principles I–II (in-place full-project rewrite; PHP must not coexist at runtime).
- `clarification.md#Backend` and `clarification-answers.md#Clarification-Answers` → Principle III
  and MongoDB and Data Migration Constraints (MongoDB selected; migration details deferred to DBA).
- `clarification.md#Frontend` and `clarification.md#Backend` → Principle IV and Target Technology
  Stack (preserve current UI and manifest declarations; defer unresolved target versions to
  architecture assessment).
- `project-profile.yaml#project.structure` plus client/server package manifests → Justification and
  Target Technology Stack (existing React, Express, and Mongoose work may be retained when it
  satisfies the approved architecture and parity requirements).
