---
name: fix-debug
description: >-
  Auto-fetches Context7 documentation for debugging and fixing tasks. Triggers
  on 'fix', 'debug', 'arreglar', 'depurar', 'solucionar'. Works for any
  library/stack. Decision tree: simple fixes (typos, syntax, obvious config)
  skip Context7; complex bugs (runtime errors, API misuse, regressions, auth
  failures, performance issues) fetch docs first. Per-stack references for React
  Native, Prisma, and Python debugging.
license: MIT
compatibility: opencode
---

# Fix-Debug

## Why This Approach

Context7 queries cost time and tokens. The decision tree exists to spend that budget only where it helps. Simple typos and missing imports are obvious from context — a doc search won't add value. Runtime errors, API misuse, and regressions benefit from fresh documentation because:
- Library APIs change between versions
- Error messages are often misleading (the real cause is something else)
- StackOverflow answers may be outdated; official docs are not

---

## Trigger Patterns (case-insensitive)

| Pattern | Example |
|---|---|
| `^fix\s+(.+)$` | "fix the auth flow" |
| `^debug\s+(.+)$` | "debug memory leak" |
| `^arregla(r)?\s+(.+)$` | "arregla el hook" / "arreglar login" |
| `^depura(r)?\s+(.+)$` | "depura el crash" / "depurar error" |
| `^soluciona(r)?\s+(.+)$` | "soluciona el bug" / "solucionar build" |

Extract `target` = capture group 1 (what needs fixing).

---

## Decision: Use Context7?

**Skip Context7 (simple fixes):**
- Typos, syntax errors, missing imports
- Obvious config values (wrong port, env var name)
- One-line logic errors visible in context

**Use Context7 (complex):**
- Runtime errors, crashes, exceptions
- API misuse, wrong signatures, version mismatches
- Auth failures, build/deploy errors, performance issues
- "Worked before" regressions, memory leaks
- Any "debug X" / "depurar X" where cause unclear

---

## Workflow

### 1. Identify Library/Stack

Priority:
1. Explicit in message: "fix React useEffect", "debug Prisma"
2. Current file imports / `package.json` dependencies
3. Project config (expo, next.js, react-native, etc.)
4. Ask if ambiguous: "Which library is this for?"

### 2. Per-Stack References

If the library has a reference file in `references/`, check it for common issues before querying Context7:

```
references/
├── react-native-debug.md
├── prisma-debug.md
└── python-debug.md
```

These contain recurrent debugging patterns specific to each stack.

### 3. Context7 Resolution

```javascript
context7_resolve-library-id({
  libraryName: "<identified library>",
  query: "How to debug/fix <target> in <library>"
})
```

Select: official > community, highest benchmark score, version match if specified.

### 4. Context7 Query

```javascript
context7_query-docs({
  libraryId: "<selected ID>",
  query: "Debug/fix <target>: common causes, solutions, code examples"
})
```

### 5. Response Format

```
## Debugging <target> in <library>

**Common Causes** (from docs):
- Cause 1
- Cause 2

**Solutions**:
1. Fix 1
2. Fix 2

**Code Example** (from docs):
```typescript
// corrected pattern
```

**Docs**: <library>@<version>
```

### 6. Verify

After providing a fix, check if the solution works:
- "Does this fix compile/run?"
- If the user says the fix didn't work, go back to step 1 with the new error

---

## Fallback

- No Context7 results → General debugging principles + ask for clarification
- Multiple libraries → Use primary from `package.json` or ask
- User says "never mind" / "ya está" → Stop

---

## Resources

- `agents/fix-verifier.md` — subagent to verify fixes
- `references/` — per-stack debugging reference files
- `evals/evals.json` — test prompts for this skill
