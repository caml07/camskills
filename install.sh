#!/usr/bin/env bash
# CamSkills installer — activa skills seleccionados en ~/.config/opencode/skills/
# Compat: Linux/macOS (symlinks) y Windows/Git-Bash (junctions via PowerShell).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"
OC_DIR="${OPENCODE_SKILLS_DIR:-$HOME/.config/opencode/skills}"

# --- deteccion de plataforma ---
is_windows=0
if command -v cygpath >/dev/null 2>&1 && [ -n "${WINDIR:-}" ]; then is_windows=1; fi

link_skill() { # $1=dest  $2=target
  local dest="$1" target="$2"
  rm -rf "$dest"
  if [ "$is_windows" = 1 ]; then
    local d t
    d=$(cygpath -w "$dest"); t=$(cygpath -w "$target")
    powershell -NoProfile -Command "New-Item -ItemType Junction -Path '$d' -Target '$t' | Out-Null" >/dev/null
  else
    ln -s "$target" "$dest"
  fi
}

# --- listar categorias ---
categories=()
for c in "$SKILLS_DIR"/*/; do [ -d "$c" ] && categories+=("$(basename "$c")"); done
[ ${#categories[@]} -gt 0 ] || { echo "No hay categorías en $SKILLS_DIR"; exit 1; }

echo "=============================================="
echo "           CamSkills installer"
echo "     $HOME/.config/opencode/skills"
echo "=============================================="
echo
echo "Categorias disponibles:"
for i in "${!categories[@]}"; do
  n=$((i+1))
  count=$(find "$SKILLS_DIR/${categories[$i]}" -mindepth 1 -maxdepth 1 -type d | wc -l)
  printf '  %d) %-14s (%d skills)\n' "$n" "${categories[$i]}" "$count"
done
echo "  a) Todas"
echo
printf 'Selecciona (ej: 1 3, o a): '
read -r -a picks

mkdir -p "$OC_DIR"
selected=0
for pick in "${picks[@]}"; do
  if [ "$pick" = "a" ] || [ "$pick" = "A" ]; then
    cats=("${categories[@]}")
  else
    [ "$pick" -ge 1 ] && [ "$pick" -le "${#categories[@]}" ] || continue
    cats=("${categories[$((pick-1))]}")
  fi
  for cat in "${cats[@]}"; do
    for skill_dir in "$SKILLS_DIR/$cat"/*/; do
      [ -f "$skill_dir/SKILL.md" ] || continue
      skill=$(basename "$skill_dir")
      link_skill "$OC_DIR/$skill" "${skill_dir%/}"
      echo "  + $cat/$skill"
      selected=$((selected+1))
    done
  done
done

echo
echo "Activados: $selected skills en $OC_DIR"
echo "Reinicia opencode para que cargue los skills nuevos."