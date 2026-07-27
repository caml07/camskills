---
name: no-commit-secrets
description: >-
  Prevents API keys, tokens, passwords, and secrets from being committed to git.
  When a user provides a credential: save it to vault/Config/ (never in source
  code), verify vault/Config/ is in .gitignore, before every commit scan staged
  files for secret patterns, and block the commit if found. Uses a script for
  deterministic scanning. Covers: OpenAI, OpenRouter, Anthropic, AWS, GitHub,
  JWT, SSH keys, and generic credential patterns.
license: MIT
compatibility: opencode
metadata:
  vault-path: "{{VAULT_PATH}}"
  repo-path: "{{REPO_PATH}}"
---
# No-Commit-Secrets

## Why This Matters

A committed secret is compromised. Git history never forgets — even if you delete the file, the secret lives in the commit log. Rotating a key takes hours, costs money, and may leave a window where your infrastructure is exposed.

This skill prevents that at the point of entry: when you receive a secret, when you edit config files, and before every commit.

---

## Persistent Behavior

### 1. When You Receive a Secret

Every time the user mentions or pastes an API key, token, password, or credential:

- Save it to `vault/Config/` as an Obsidian note
- The note should contain only enough context to identify usage (not the full conversation)
- NEVER put the literal secret in source code, `.env` files in code, `opencode.json`, AGENTS.md, or any git-tracked file
- If the user asks you to put it in a config file, use a placeholder like `"<OPENROUTER_API_KEY>"` and reference the vault note

### 2. .gitignore Verification

- Check that `vault/Config/` is in the project's `.gitignore`
- If missing, add it immediately
- Also verify common patterns: `.env`, `.env.local`, `*.pem`, `*.key`

### 3. Before Every Commit

- Run `scripts/scan-staged.js` to check all staged files for secret patterns
- If secrets are found: **block the commit**, list the offending files and patterns, and suggest remediation

### 4. Editing Config Files

When editing `opencode.json`, AGENTS.md, `.env`, or any configuration:
- Never write literal secrets
- Use placeholders: `"<OPENROUTER_API_KEY>"`
- Reference the vault note path if the user needs to find the actual value

### 5. Auto-Remediation

If a secret is found in staging:
1. Warn the user with specific file paths and pattern matches
2. Offer to `git restore --staged <file>` to unstage it
3. Suggest saving the secret to `vault/Config/` instead
4. Do NOT commit — not even "just this once"

### 6. No Exceptions

This applies to all branches, all environments, all files. Temporary code, scratch files, and "I'll fix it later" are not exceptions.

### 7. User's Words

> "Manténlo sin commitear TODO el tiempo" — psistema

If you see the user about to commit something sensitive, remind them of this.

---

## Resources

- `scripts/scan-staged.js` — deterministic CLI scanner for pre-commit use
- `agents/secret-scanner.md` — subagent instructions for scanning
- `references/secret-patterns.md` — expanded regex patterns for all secret types
- `evals/evals.json` — test cases for this skill
- `assets/pre-commit-hook.sh` — git hook template
