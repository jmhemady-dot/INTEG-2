# MERN Constitution Version Policy

For INTEG-2 migration governance, retain manifest-declared framework versions as evidence and defer
target runtime/version approval to architecture assessment.

## What Happened

Task t1 found a partial React/Vite and Express/Mongoose project, but the clarification explicitly
left concrete target versions for later assessment. Treating the existing package ranges as
automatic upgrade authorization would conflict with the user's no-arbitrary-versions constraint.

## Takeaway

State the user-approved stack and scope in the constitution, preserve current manifest declarations
provisionally, and require architecture to verify runtime compatibility before fixing the final
version set. Record unknown runtime/DB versions as deferred rather than guessing.

## History
- 2026-11-17 (INTEG-2/t1): initial
