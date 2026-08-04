#!/usr/bin/env node
/**
 * Scan staged files for secret patterns.
 *
 * Usage:
 *   node scan-staged.js [--path <repo-path>]
 *
 * Returns exit code 0 if no secrets found, 1 otherwise.
 * Outputs a JSON report of findings.
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const SECRET_PATTERNS = [
  // OpenRouter / OpenAI
  { pattern: /sk-or-v1-[A-Za-z0-9]{20,}/, name: "OpenRouter API Key" },
  { pattern: /sk-[A-Za-z0-9]{20,}/, name: "OpenAI API Key (sk-)" },
  { pattern: /sk-ant-[A-Za-z0-9]{20,}/, name: "Anthropic API Key" },

  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/, name: "AWS Access Key ID" },
  { pattern: /aws_secret_access_key\s*[:=]\s*["'][A-Za-z0-9\/+=]{40}["']/i, name: "AWS Secret Access Key" },

  // GitHub
  { pattern: /ghp_[A-Za-z0-9]{36}/, name: "GitHub Personal Access Token" },
  { pattern: /gho_[A-Za-z0-9]{36}/, name: "GitHub OAuth Token" },
  { pattern: /github_pat_[A-Za-z0-9]{22,}/, name: "GitHub Fine-Grained Token" },

  // SSH
  { pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, name: "Private Key (PEM)" },

  // JWT
  { pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, name: "JWT Token" },

  // Generic
  { pattern: /(api_key|apikey|secret|password|token|credential)\s*[:=]\s*["'][A-Za-z0-9_\-\.\/+=]{8,}["']/i, name: "Generic Credential" },
]

function getStagedFiles(repoPath) {
  try {
    const output = execSync("git diff --cached --name-only", {
      cwd: repoPath,
      encoding: "utf-8",
    })
    return output.split("\n").filter(Boolean)
  } catch {
    return []
  }
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, "utf-8")
  const findings = []

  for (const { pattern, name } of SECRET_PATTERNS) {
    const match = content.match(pattern)
    if (match) {
      findings.push({
        pattern: name,
        match: match[0].substring(0, 20) + "...", // truncate for safety
        line: getLineNumber(content, match.index),
      })
    }
  }

  return findings
}

function getLineNumber(content, index) {
  return content.substring(0, index).split("\n").length
}

function main() {
  const args = process.argv.slice(2)
  const repoPath =
    args.find((a, i) => a === "--path" && args[i + 1])
      ? args[args.indexOf("--path") + 1]
      : process.cwd()

  console.error(`Scanning staged files in: ${repoPath}`)
  const stagedFiles = getStagedFiles(repoPath)

  if (!stagedFiles.length) {
    console.error("No staged files to scan.")
    process.exit(0)
  }

  const allFindings = []
  for (const file of stagedFiles) {
    const fullPath = path.resolve(repoPath, file)
    if (!fs.existsSync(fullPath)) continue
    const findings = scanFile(fullPath)
    if (findings.length) {
      allFindings.push({ file, findings })
    }
  }

  const report = {
    scanned_files: stagedFiles.length,
    secrets_found: allFindings.length > 0,
    results: allFindings,
  }

  console.log(JSON.stringify(report, null, 2))

  if (allFindings.length > 0) {
    console.error("\n⚠️  SECRETS FOUND IN STAGED FILES. Blocking commit.")
    for (const { file, findings } of allFindings) {
      for (const f of findings) {
        console.error(`  ${file}:${f.line} — ${f.pattern}`)
      }
    }
    process.exit(1)
  }

  console.error("✓ No secrets found in staged files.")
  process.exit(0)
}

main()
