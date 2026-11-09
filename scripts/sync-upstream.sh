#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RN="$ROOT/skills/mobile/impeccable-rn"

case "${1:-check}" in
  check|--check|-c)
    echo "# Curated upstream check"
    echo "upstream: pbakaus/impeccable"
    echo "base: c0f495212236129c2e92aaf7714a3a9914569d13"
    echo "reviewed: f866ce13beb3a065fabfce90f8c784eedad84117"
    echo "mode: manual intake; no automatic merge"
    echo "license: inspect upstream license before importing files"
    echo "active files:"
    git -C "$ROOT" ls-files "skills/mobile/impeccable-rn/SKILL.md" "skills/mobile/impeccable-rn/FORK.md" "skills/mobile/impeccable-rn/NOTICE.md" "skills/mobile/impeccable-rn/reference/*.md"
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
