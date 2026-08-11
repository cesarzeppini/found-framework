#!/usr/bin/env bash
# design-system-guard mechanical linter.
# Usage: ds-lint.sh <file-or-dir> [...]  (defaults to src/)
# Prints file:line hits for violations that can be detected textually.
# Exit 1 when any hit is found, 0 when clean.

set -uo pipefail

TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=()
  [ -d src/routes ] && TARGETS+=("src/routes")
  [ -d src/components ] && TARGETS+=("src/components")
  [ ${#TARGETS[@]} -eq 0 ] && TARGETS=("src")
fi

if command -v rg >/dev/null 2>&1; then
  GREP() { rg -n --no-heading -g '*.tsx' -g '*.jsx' -g '!*/ui/*' -g '!*design.tsx' "$@"; }
else
  GREP() { pat="$1"; shift; grep -rniE --include='*.tsx' --include='*.jsx' -n "$pat" "$@"; }
fi


HITS=0
report() { # label pattern
  local label="$1" pat="$2" out
  out=$(GREP -e "$pat" "${TARGETS[@]}" 2>/dev/null \
        | grep -v '/components/ui/' \
        | grep -v 'routes/design' || true)
  if [ -n "$out" ]; then
    echo "== $label"
    echo "$out"
    echo
    HITS=1
  fi
}

report "raw hex / rgb / hsl color" '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\('
report "arbitrary-value utility" '(bg|text|border|shadow|rounded|font|ring)-\['
report "non-token color utility" '\b(bg|text|border|ring|from|to|via)-(white|black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[0-9]{2,3})?\b'
report "raw interactive HTML element" '<(button|input|select|textarea)[[:space:]>]'
report "inline style attribute" 'style=\{\{'
report "important override" 'className="[^"]*![a-z-]'

# Components imported from ui/ that are not rendered on the registry page.
# Registry path comes from context/STACK.md (line like: registry: src/routes/design.tsx)
DESIGN_PAGE=$(grep -m1 -E '^registry:' context/STACK.md 2>/dev/null | sed -E 's/^registry:[[:space:]]*//')
[ -n "${DESIGN_PAGE:-}" ] && [ ! -f "$DESIGN_PAGE" ] && DESIGN_PAGE=""
[ -z "${DESIGN_PAGE:-}" ] && DESIGN_PAGE=$(ls src/routes/design.tsx src/routes/design/index.tsx 2>/dev/null | head -1)
if [ -n "${DESIGN_PAGE:-}" ]; then
  APPROVED=$(grep -oE 'from "@/components/ui/[a-z-]+"' "$DESIGN_PAGE" 2>/dev/null \
             | sed -E 's|.*/([a-z-]+)"|\1|' | sort -u)
  UNAPPROVED=""
  while IFS= read -r line; do
    file="${line%%:*}"
    mod=$(printf '%s' "$line" | sed -E 's|.*/components/ui/([a-z-]+)".*|\1|')
    if ! printf '%s\n' "$APPROVED" | grep -qx "$mod"; then
      UNAPPROVED+="$file  ->  @/components/ui/$mod"$'\n'
    fi
  done < <(grep -rEn 'from "@/components/ui/[a-z-]+"' --include='*.tsx' "${TARGETS[@]}" 2>/dev/null \
           | grep -v '/components/ui/' | grep -v 'routes/design' || true)
  if [ -n "$UNAPPROVED" ]; then
    echo "== component used but not present on /design"
    printf '%s' "$UNAPPROVED" | sort -u
    echo
    HITS=1
  fi
else
  echo "== registry page not found (set registry: in context/STACK.md) — cannot be verified"
  echo
  HITS=1
fi

if [ "$HITS" -eq 0 ]; then
  echo "Design system check: clean"
fi
exit "$HITS"
