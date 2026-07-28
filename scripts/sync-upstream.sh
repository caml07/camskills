#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS="$ROOT/skills"

check_upstream() {
  local skill="$1"
  local upstream="$2"
  local fetch_cmd="$3"

  echo "=== $skill ==="
  if [ -n "$upstream" ]; then
    echo "  upstream: $upstream"
  fi
  if [ -n "$fetch_cmd" ]; then
    echo "  fetch:    $fetch_cmd"
  fi
  echo ""
}

check_each() {
  echo "# Upstream Check — $(date)"
  echo ""

  check_upstream "impeccable" \
    "ecosistema opencode (npx/skill registry)" \
    "npx skills add https://github.com/<upstream>/impeccable --check"

  check_upstream "impeccable-rn" \
    "fork de impeccable (no hay upstream independiente)" \
    "revisar cambios en impeccable primero"

  check_upstream "mobile-app-ui-design" \
    "ceorkm/mobile-app-ui-design" \
    "npx skills add https://github.com/ceorkm/mobile-app-ui-design --skill mobile-app-ui-design"

  check_upstream "ponytail" \
    "@dietrichgebert/ponytail (npm)" \
    "npm view @dietrichgebert/ponytail version"

  check_upstream "context7-mcp" \
    "Context7 MCP ecosistema" \
    "verificar versión del MCP server"

  echo "# End"
}

case "${1:-help}" in
  --check|-c|check)
    check_each
    ;;
  --update|-u|update)
    echo "Update mode — fetch from upstreams"
    echo "impeccable:     npx skills add <url> --force"
    echo "ponytail:       npm update @dietrichgebert/ponytail"
    echo ""
    echo "Run '--check' first to see what changed."
    ;;
  *)
    echo "Usage: $0 [--check|--update]"
    echo "  --check   report upstream status of third-party skills"
    echo "  --update  pull latest from upstream sources"
    ;;
esac
