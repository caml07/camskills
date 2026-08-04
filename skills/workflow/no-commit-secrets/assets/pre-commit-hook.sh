#!/bin/sh
# Pre-commit hook template — copy to .git/hooks/pre-commit
# This hook scans staged files for secrets using the skill's scanner script.

SKILL_DIR="$HOME/.config/opencode/skills/no-commit-secrets"
SCANNER="$SKILL_DIR/scripts/scan-staged.js"

if [ ! -f "$SCANNER" ]; then
  echo "⚠️  Secret scanner not found at $SCANNER"
  echo "   Install the no-commit-secrets skill to enable pre-commit scanning."
  exit 0
fi

# Check if node is available
if ! command -v node >/dev/null 2>&1; then
  echo "⚠️  Node.js required for secret scanning"
  exit 0
fi

node "$SCANNER" --path "$(git rev-parse --show-toplevel)"
exit $?
