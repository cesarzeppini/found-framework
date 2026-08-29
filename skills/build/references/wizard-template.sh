#!/usr/bin/env bash
# Found wizard template — see ../wizard.md.
# Everything above the STAGES marker is shared plumbing; a generated wizard
# never edits it. Copy this file, then write stage() blocks below the marker.
set -euo pipefail

TOTAL_STAGES="${TOTAL_STAGES:-1}"
STAGE_NUM=0
ENV_FILE="${ENV_FILE:-.env}"

stage() {
  STAGE_NUM=$((STAGE_NUM + 1))
  clear
  echo "== Stage ${STAGE_NUM}/${TOTAL_STAGES}: $1 =="
  echo
}

say() { echo "$1"; echo; }

open_url() {
  local url="$1"
  echo "Opening: ${url}"
  if command -v open >/dev/null 2>&1; then open "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v start >/dev/null 2>&1; then start "" "$url" >/dev/null 2>&1 || true
  else echo "Could not detect a URL opener — open this manually: ${url}"
  fi
}

ask() {
  local prompt="$1" __resultvar="$2" value
  read -r -p "${prompt}: " value
  printf -v "$__resultvar" '%s' "$value"
}

ask_secret() {
  local prompt="$1" __resultvar="$2" value
  read -r -s -p "${prompt} (hidden): " value
  echo
  printf -v "$__resultvar" '%s' "$value"
}

# Idempotent upsert into ENV_FILE — safe to re-run the wizard from any stage.
write_env() {
  local key="$1" value="$2"
  touch "$ENV_FILE"
  if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
    sed -i.bak "s|^${key}=.*|${key}=${value}|" "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
  echo "Wrote ${key} to ${ENV_FILE}"
}

set_secret() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1; then
    echo "$value" | gh secret set "$name" >/dev/null && echo "Set CI secret ${name}"
  else
    echo "gh CLI not found — set the ${name} secret manually in your CI provider."
  fi
}

set_var() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1; then
    gh variable set "$name" --body "$value" >/dev/null && echo "Set CI variable ${name}"
  else
    echo "gh CLI not found — set the ${name} variable manually in your CI provider."
  fi
}

confirm() {
  local prompt="${1:-Continue?}" reply
  read -r -p "${prompt} [y/N]: " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Stopped — re-run the script to pick up from here."; exit 1; }
}

pause() {
  read -r -p "Press Enter once done... " _
}

echo "Found setup wizard — ${TOTAL_STAGES} stage(s) to walk through."
echo

# ===== STAGES — everything below this line is generated per procedure =====

# stage "Create a payments API key"
# say "This key lets the app process payments in test mode."
# open_url "https://dashboard.example.com/test/apikeys"
# ask_secret "Paste the Secret key" api_key
# write_env "PAYMENTS_SECRET_KEY" "$api_key"
# set_secret "PAYMENTS_SECRET_KEY" "$api_key"
# confirm "Key saved — continue?"

echo
echo "All ${TOTAL_STAGES} stage(s) complete."
