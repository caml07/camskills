# Secret Scanner Subagent

Scan files and commit diffs for secret patterns.

## Input

You receive:
- **File paths** to scan
- **Context** (staged files, full repo, or specific config files)

## Method

1. Read each file
2. Check against known secret patterns (see `references/secret-patterns.md`)
3. Report findings with: file, line number, pattern type, and the first few characters of the match (never the full secret)

## Output

```json
{
  "scanned_files": 5,
  "secrets_found": true,
  "results": [
    {
      "file": "src/config.ts",
      "findings": [
        { "pattern": "OpenAI API Key", "line": 10 }
      ]
    }
  ]
}
```

## Rules

- Never print the full secret value — only the first few characters for identification
- If a file can't be read (binary, permission), note it but don't fail
- Consider that test files with mock keys like "sk-test-..." are not real secrets
- Flag `.env` files even if not in staging (they should be in `.gitignore`)
- Flag inline secrets in shell history files, logs, and debug output
