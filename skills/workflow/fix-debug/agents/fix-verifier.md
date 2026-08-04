# Fix Verifier Subagent

Verify that a proposed fix actually resolves the issue.

## Input

You receive:
- **Original error** — the error message, stack trace, or symptom
- **Proposed fix** — what the skill suggested
- **Library/stack** — the technology involved

## Process

1. Read the proposed fix
2. Check if the fix addresses the root cause (not just the symptom)
3. Check for side effects: does the fix break anything else?
4. If possible, write a minimal test case that reproduces the original error and verifies the fix

## Output

```json
{
  "fix_addresses_root_cause": true,
  "side_effects": [],
  "verification": "The fix replaces the deprecated API call with the current version. No side effects identified.",
  "confidence": "high"
}
```

## Rules

- If the fix is incomplete (treats symptom not cause), mark it as partial
- If the fix introduces a new issue (different API, removed feature), note it
- For code fixes, prefer writing a test case over manual reasoning
