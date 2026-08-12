#!/usr/bin/env bash
# design-system-guard mechanical linter.
# Usage: ds-lint.sh <file-or-dir> [...]            (defaults to src/)
#        ds-lint.sh --added-markers <git-range>    (audit markers added in a range)
# Prints file:line hits for violations that can be detected textually.
# Exit 1 when any hit is found, 0 when clean.

set -uo pipefail

# A component is approved when @approved appears in a comment within the first
# MARKER_WINDOW lines of its own file. The window is deliberate: the marker has
# to be where a human opening the file sees it, not buried at the bottom.
MARKER_WINDOW=5
MARKER_RE='(^|[[:space:]/*#{])@approved([[:space:]]|$)'

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

# Where the design system's components live. `components:` in context/STACK.md may
# list several directories, comma- or space-separated — real components and the
# generated plumbing they sit on usually live apart.
COMPONENTS_RAW=$(grep -m1 -E '^components:' context/STACK.md 2>/dev/null | sed -E 's/^components:[[:space:]]*//')
[ -z "${COMPONENTS_RAW:-}" ] && COMPONENTS_RAW="src/components/ui"
COMPONENTS_DIRS=$(printf '%s' "$COMPONENTS_RAW" | tr ',' ' ' | xargs)

# Import specifiers are written with whatever alias the project uses (@/, ~/, ../),
# so match on each directory's path tail rather than assuming one. src/components/ui
# matches @/components/ui/x, ~/components/ui/x, ../../components/ui/x and the raw path.
TAILS=""
for d in $COMPONENTS_DIRS; do
  TAILS="$TAILS $(printf '%s' "$d" | sed -E 's|^\./||; s|^src/||; s|/+$||')"
done
TAIL_ALT=$(printf '%s' "$TAILS" | xargs | tr ' ' '|')
DIR_ALT=$(printf '%s' "$COMPONENTS_DIRS" | xargs | tr ' ' '|')

if command -v rg >/dev/null 2>&1; then
  GREP() { rg -n --no-heading -g '*.tsx' -g '*.jsx' "$@"; }
else
  GREP() { pat="$1"; shift; grep -rniE --include='*.tsx' --include='*.jsx' -n "$pat" "$@"; }
fi

# Skip the components' own sources — they define the system rather than consume it.
strip_own() { awk -F: -v dirs="$DIR_ALT" '$1 !~ dirs'; }

HITS=0
report() { # label pattern
  local label="$1" pat="$2" out
  out=$(GREP -e "$pat" "${TARGETS[@]}" 2>/dev/null | strip_own || true)
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

# Approved components carry an @approved marker near the top of their own file.
# A human puts it there; this script only reads it.
EXISTING_DIRS=""
for d in $COMPONENTS_DIRS; do
  [ -d "$d" ] && EXISTING_DIRS="$EXISTING_DIRS $d"
done
EXISTING_DIRS=$(printf '%s' "$EXISTING_DIRS" | xargs)

if [ -n "$EXISTING_DIRS" ]; then
  APPROVED=""
  for d in $EXISTING_DIRS; do
    tail=$(printf '%s' "$d" | sed -E 's|^\./||; s|^src/||; s|/+$||')
    while IFS= read -r f; do
      if head -"$MARKER_WINDOW" "$f" 2>/dev/null | grep -qE "$MARKER_RE"; then
        base=$(basename "$f"); base="${base%.*}"
        APPROVED+="$tail/$base"$'\n'
      fi
    done < <(find "$d" -type f \( -name '*.tsx' -o -name '*.jsx' -o -name '*.ts' \) 2>/dev/null)
  done
  APPROVED=$(printf '%s' "$APPROVED" | sort -u)

  if [ -z "$APPROVED" ]; then
    echo "== no component in $EXISTING_DIRS carries an @approved marker"
    echo "   (looked in the first $MARKER_WINDOW lines of each file)"
    echo "   Every component below is therefore unapproved. If that looks wrong, a human"
    echo "   marks components — agents never add @approved on their own initiative."
    echo
  fi

  UNAPPROVED=""
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    file="${line%%:*}"
    # grep -oE, not sed: the tail alternation contains "|", which would collide
    # with any sed delimiter.
    key=$(printf '%s' "$line" | grep -oE "($TAIL_ALT)/[A-Za-z0-9_-]+" | head -1)
    if ! printf '%s\n' "$APPROVED" | grep -qx "$key"; then
      UNAPPROVED+="$file  ->  $key"$'\n'
    fi
  done < <(GREP -e "from [\"'][^\"']*($TAIL_ALT)/[A-Za-z0-9_-]+[\"']" "${TARGETS[@]}" 2>/dev/null | strip_own || true)

  if [ -n "$UNAPPROVED" ]; then
    echo "== component used but not marked @approved"
    printf '%s' "$UNAPPROVED" | sort -u
    echo
    HITS=1
  fi
else
  echo "== component directory not found (set components: in context/STACK.md) — approval cannot be verified"
  echo "   looked for: $COMPONENTS_DIRS"
  echo
  HITS=1
fi

if [ "$HITS" -eq 0 ]; then
  echo "Design system check: clean"
fi
exit "$HITS"
