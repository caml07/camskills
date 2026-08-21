#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RN="$ROOT/skills/mobile/impeccable-rn"

case "${1:-check}" in
  check|--check|-c)
    echo "# Curated upstream check"
    echo "upstream: pbakaus/impeccable"
    echo "base: f88b2837a7d7c3182e46307bbbb091a1ed547571"
    echo "mode: manual intake; no automatic merge"
    echo "license: inspect upstream license before importing files"
    echo "active files:"
    git -C "$ROOT" ls-files "skills/mobile/impeccable-rn/SKILL.md" "skills/mobile/impeccable-rn/FORK.md" "skills/mobile/impeccable-rn/reference/*.md"
    echo "excluded: browser, HTML/CSS, CSP, live, detector, hooks, comps"
    ;;
  update|--update|-u)
    echo "No automatic update is performed for the curated RN fork."
    echo "Review the upstream diff, import RN-relevant changes manually, update FORK.md, then run --check."
    ;;
  *)
    echo "Usage: $0 [--check|--update]"
    exit 2
    ;;
esac
