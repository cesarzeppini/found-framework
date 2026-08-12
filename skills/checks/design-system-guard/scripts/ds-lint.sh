#!/usr/bin/env bash
# design-system-guard mechanical linter.
# Usage: ds-lint.sh <file-or-dir> [...]  (defaults to src/)
# Prints file:line hits for violations that can be detected textually.
# Exit 1 when any hit is found, 0 when clean.

set -uo pipefail

# --added-markers <git-range>: list every @approved marker added in that range.
# Used by the full-diff pass at review so a marker cannot be added silently —
# these are reported whether or not any stage said it added one.
if [ "${1:-}" = "--added-markers" ]; then
  RANGE="${2:-main...HEAD}"
  FOUND=$(git diff --unified=0 "$RANGE" 2>/dev/null \
          | awk '/^\+\+\+ /{f=substr($0,7)} /^\+/ && /@approved/ && !/^\+\+\+/{print f}' \
          | sort -u)
  if [ -n "$FOUND" ]; then
    echo "== @approved markers added in $RANGE"
    printf '%s\n' "$FOUND" | sed 's/^/  /'
    echo
    echo "   Report each of these in the final report as a Needs-you item, naming who"
    echo "   asked for it — including when a human did ask."
    exit 1
  fi
  echo "No @approved markers added in $RANGE"
  exit 0
fi

TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=()
  [ -d src/routes ] && TARGETS+=("src/routes")
  [ -d src/components ] && TARGETS+=("src/components")
  [ ${#TARGETS[@]} -eq 0 ] && TARGETS=("src")
fi

if command -v rg >/dev/null 2>&1; then
  GREP() { rg -n --no-heading -g '*.tsx' -g '*.jsx' -g '!*/ui/*' "$@"; }
else
  GREP() { pat="$1"; shift; grep -rniE --include='*.tsx' --include='*.jsx' -n "$pat" "$@"; }
fi


# Where the design system's components live. Approval is not location — it is the
# @approved marker inside each file (see below). Resolved here because report()
# uses it to skip the components' own sources.
COMPONENTS_DIR=$(grep -m1 -E '^components:' context/STACK.md 2>/dev/null | sed -E 's/^components:[[:space:]]*//')
[ -z "${COMPONENTS_DIR:-}" ] && COMPONENTS_DIR="src/components/ui"

HITS=0
report() { # label pattern
  local label="$1" pat="$2" out
  out=$(GREP -e "$pat" "${TARGETS[@]}" 2>/dev/null \
        | awk -F: -v dir="$COMPONENTS_DIR" '$1 !~ dir' || true)
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

# Approved components carry an @approved marker in a comment in the first few
# lines of their own file. A human puts it there; this script only reads it.
if [ -d "$COMPONENTS_DIR" ]; then
  APPROVED=""
  while IFS= read -r f; do
    if head -5 "$f" 2>/dev/null | grep -qE '(^|[[:space:]/*#{])@approved([[:space:]]|$)'; then
      base=$(basename "$f"); base="${base%.*}"
      APPROVED+="$base"$'\n'
    fi
  done < <(find "$COMPONENTS_DIR" -type f \( -name '*.tsx' -o -name '*.jsx' -o -name '*.ts' \) 2>/dev/null)
  APPROVED=$(printf '%s' "$APPROVED" | sort -u)

  if [ -z "$APPROVED" ]; then
    echo "== no component in $COMPONENTS_DIR carries an @approved marker"
    echo "   Every component below is therefore unapproved. If that looks wrong, a human"
    echo "   marks components — agents never add @approved on their own initiative."
    echo
  fi

  UNAPPROVED=""
  while IFS= read -r line; do
    file="${line%%:*}"
    mod=$(printf '%s' "$line" | sed -E 's|.*/components/ui/([a-zA-Z0-9-]+)".*|\1|')
    if ! printf '%s\n' "$APPROVED" | grep -qx "$mod"; then
      UNAPPROVED+="$file  ->  @/components/ui/$mod"$'\n'
    fi
  # Exclude by FILE path only — the import path also contains /components/ui/,
  # so filtering the whole line would drop every hit.
  done < <(grep -rEn 'from "@/components/ui/[a-zA-Z0-9-]+"' --include='*.tsx' --include='*.jsx' "${TARGETS[@]}" 2>/dev/null \
           | awk -F: -v dir="$COMPONENTS_DIR" '$1 !~ dir' || true)
  if [ -n "$UNAPPROVED" ]; then
    echo "== component used but not marked @approved"
    printf '%s' "$UNAPPROVED" | sort -u
    echo
    HITS=1
  fi
else
  echo "== component directory not found (set components: in context/STACK.md) — approval cannot be verified"
  echo
  HITS=1
fi

if [ "$HITS" -eq 0 ]; then
  echo "Design system check: clean"
fi
exit "$HITS"
