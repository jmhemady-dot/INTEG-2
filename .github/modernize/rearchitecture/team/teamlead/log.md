## [t1] Established initial MERN migration constitution
- Codebase/domain discoveries: clarification confirms full-project in-place rewrite, MongoDB, and no PHP coexistence. Existing client/server manifests already declare React, Vite, Express, and Mongoose; target/runtime compatibility still requires architecture confirmation. The client has no test script and the server's test script is a failing placeholder. There is no root README or prior constitution/context/decisions/teamlead history.
- Wrong assumptions and corrections: do not treat existing dependency declarations as user authorization to upgrade or as a confirmed supported target set. Node shell version is evidence only.
- Debugging dead-ends and what actually worked: `npm --version` is blocked by PowerShell execution policy in this shell; `node --version` succeeds. This task needed no dependency installation or code tests.
- Techniques/patterns worth reusing for future tasks: use clarification answers as authoritative scope; preserve dirty worktree state; defer unresolved version/data-migration decisions to architect/DBA; make constitutional gates independently verifiable.
- Learnings consumed: []
