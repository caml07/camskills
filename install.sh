#!/usr/bin/env bash
# Legacy launcher: use ./setup for the interactive installer or ./setup install -y.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$ROOT/setup" install "$@"
