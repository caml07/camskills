# Secret Patterns Reference

## API Keys

| Provider | Pattern | Example Start |
|---|---|---|
| OpenAI | `sk-[A-Za-z0-9]{20,}` | `sk-proj-...` |
| OpenRouter | `sk-or-v1-[A-Za-z0-9]{20,}` | `sk-or-v1-...` |
| Anthropic | `sk-ant-[A-Za-z0-9]{20,}` | `sk-ant-...` |
| Google AI | `AIza[0-9A-Za-z_-]{35}` | `AIzaSy...` |
| Mistral | `[A-Za-z0-9]{32}` (context: `mistral`) | - |

## Cloud Provider Keys

| Provider | Pattern | Notes |
|---|---|---|
| AWS Access Key | `AKIA[0-9A-Z]{16}` | Starts with AKIA |
| AWS Secret | `(?i)aws_secret_access_key\s*[:=]\s*["'][^"']{40}["']` | 40-char base64 |
| GCP Service Account | `"type": "service_account"` | JSON key file |
| Azure | `(?i)(azure_.*key|AZURE_.*KEY)\s*[:=]\s*["'][^"']+["']` | - |

## Git Tokens

| Provider | Pattern | Notes |
|---|---|---|
| GitHub PAT | `ghp_[A-Za-z0-9]{36}` | Classic token |
| GitHub OAuth | `gho_[A-Za-z0-9]{36}` | OAuth access |
| GitHub Fine-Grained | `github_pat_[A-Za-z0-9]{22,}` | Fine-grained |
| GitLab | `glpat-[A-Za-z0-9_-]{20,}` | Personal access |

## Cryptographic Keys

| Type | Pattern |
|---|---|
| RSA Private Key | `-----BEGIN RSA PRIVATE KEY-----` |
| EC Private Key | `-----BEGIN EC PRIVATE KEY-----` |
| OpenSSH Private | `-----BEGIN OPENSSH PRIVATE KEY-----` |
| Any Private Key | `-----BEGIN PRIVATE KEY-----` |

## Tokens

| Type | Pattern |
|---|---|
| JWT | `eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}` |
| Slack Bot | `xoxb-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{24}` |
| Slack Webhook | `hooks.slack.com/services/T[A-Z0-9]+/B[A-Z0-9]+/[A-Za-z0-9]+` |
| Discord Bot | `[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}` |

## Generic Patterns

```regex
(?i)(api[_\-]?key|apikey|secret|password|token|credential)\s*[:=]\s*["'][A-Za-z0-9_\-\.\/+=]{8,}["']
```

Matches: `API_KEY=sk-...`, `api_key: "abc123"`, `password = "hunter2"`, `token="ghp_..."`

## Config File Patterns

Always flag these files if they're in staging (they should be in `.gitignore`):

- `.env`, `.env.local`, `.env.production`, `.env.development`
- `*.pem`, `*.key`, `*-private.pem`
- `service-account.json`, `credentials.json`
- `.netrc`, `.npmrc` (if contains auth token)
- `id_rsa`, `id_ed25519`, `id_ecdsa`
