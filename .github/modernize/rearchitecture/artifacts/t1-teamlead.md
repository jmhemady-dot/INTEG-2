# t1 — INTEG-2 Migration Constitution

## Summary

Established the initial governance baseline for a full-project PHP-to-MERN rewrite. The constitution
captures PHP removal, behavioral parity, MongoDB data fidelity, version discipline, and verification
requirements. It is an initial adoption (version 1.0.0).

## Deliverable

- [constitution.md](./constitution.md) — normative migration principles, stack constraints, data
  migration requirements, delivery gates, and governance.

## Upstream Artifacts Consumed

- `.github/modernize/rearchitecture/clarification.md` — scope and confirmed constraints.
- `.github/modernize/rearchitecture/clarification-answers.md` — user-confirmed full-project scope,
  MongoDB target, PHP replacement/removal, and in-place location.
- `.github/modernize/rearchitecture/artifacts/project-profile.yaml` — existing mixed PHP/React/
  Express/Mongoose structure and rewrite classification.
- `client/package.json` and `server/package.json` — currently declared framework/build versions;
  treated as evidence, not as permission to upgrade.

## Evidence Mapping

- `clarification.md#Generic` and `clarification-answers.md#Clarification-Answers` → `constitution.md`
  Migration Mode and Principles I–II (in-place full-project rewrite; PHP must not coexist at runtime).
- `clarification.md#Backend` and `clarification-answers.md#Clarification-Answers` → `constitution.md`
  Principle III and MongoDB and Data Migration Constraints (MongoDB selected; migration details
  deferred to DBA).
- `clarification.md#Frontend` and `clarification.md#Backend` → `constitution.md` Principle IV and
  Target Technology Stack (preserve existing UI/manifest declarations; defer unresolved target
  versions to architecture assessment).
- `project-profile.yaml#project.structure` plus client/server package manifests → `constitution.md`
  Justification and stack table (existing React, Express, and Mongoose work may be reused when
  consistent with approved design).

## Validation

- Checked the constitution template tokens: all values are filled; only the explicitly deferred
  ratification-date TODO remains.
- Checked the implementation-plan and feature-spec templates: their Constitution Check and
  constitution reference are aligned; no template edits are needed.
- The task-breakdown template path is not present in the installed skill set; verify the selected
  breakdown format when planning begins.
- No source files or pre-existing user changes were modified.

## Open Follow-ups

- Project owner: confirm the original ratification date.
- Architect: confirm the supported runtime and dependency versions before implementation planning.
- DBA: define MongoDB schema, data migration, upload-reference, and reconciliation details.
- Coordinator: supply the task-breakdown template or confirm the format used for this run.
- Planning/test owners: client manifest has no `test` script; server manifest's current `test` script
  is an intentional failure placeholder and must be replaced or covered by an approved test harness.
