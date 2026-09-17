---
name: fix-debug
description: Debug and fix application failures. Use for runtime errors, API misuse, version mismatches, auth failures, build or deployment errors, regressions, and performance issues; use Context7 first when a current dependency API may be involved.
compatibility: Requires a working directory; Context7 is optional but recommended for dependency-specific issues.
---

# Fix Debug

Use the smallest diagnosis loop that can prove the failure and its fix.

1. Identify the affected stack from the error, imports, manifests, and config.
2. For a typo or obvious local mistake, inspect and fix it directly.
3. For runtime, dependency, auth, build, regression, or performance issues, use
   the configured Context7 MCP server to resolve the library and query the
   relevant current documentation.
4. Reproduce or otherwise verify the behavior before changing code.
5. Fix the root cause, then run the smallest project check that would fail if it
   returned.

If Context7 is unavailable, say so and do not present recalled API details as
current documentation.
