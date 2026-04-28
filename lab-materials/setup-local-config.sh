#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)

BACKEND_EXAMPLE="${REPO_ROOT}/backend/.env.local.example"
BACKEND_LOCAL="${REPO_ROOT}/backend/.env.local"
FRONTEND_EXAMPLE="${REPO_ROOT}/frontend/.env.example"
FRONTEND_LOCAL="${REPO_ROOT}/frontend/.env.local"

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Missing required tool: ${command_name}" >&2
    return 1
  fi
}

extract_key() {
  local line="$1"
  line="${line#export }"
  printf '%s\n' "${line%%=*}"
}

sync_env_file() {
  local example_file="$1"
  local target_file="$2"
  local label="$3"
  local line=""
  local key=""

  if [ ! -f "${example_file}" ]; then
    echo "Missing example config for ${label}: ${example_file}" >&2
    return 1
  fi

  if [ ! -f "${target_file}" ]; then
    cp "${example_file}" "${target_file}"
    echo "Created ${label} config: ${target_file}"
    return 0
  fi

  while IFS= read -r line || [ -n "${line}" ]; do
    case "${line}" in
      ""|\#*)
        continue
        ;;
    esac

    key="$(extract_key "${line}")"
    if ! rg -n "^[[:space:]]*(export[[:space:]]+)?${key}=" "${target_file}" >/dev/null 2>&1; then
      printf '\n%s\n' "${line}" >> "${target_file}"
      echo "Added missing ${label} key ${key} to ${target_file}"
    fi
  done < "${example_file}"
}

print_effective_value() {
  local key="$1"
  local file="$2"
  local value=""

  value="$(sed -n "s/^[[:space:]]*${key}=//p" "${file}" | tail -n 1)"
  if [ -n "${value}" ]; then
    printf '%s=%s\n' "${key}" "${value}"
  fi
}

main() {
  cd "${REPO_ROOT}"

  require_command git
  require_command claude
  require_command java
  require_command mvn
  require_command node
  require_command npm
  require_command psql

  mkdir -p .claude

  sync_env_file "${BACKEND_EXAMPLE}" "${BACKEND_LOCAL}" "backend"
  sync_env_file "${FRONTEND_EXAMPLE}" "${FRONTEND_LOCAL}" "frontend"

  echo
  echo "Effective backend local config:"
  print_effective_value JAVA_HOME "${BACKEND_LOCAL}"
  print_effective_value HR_APP_PORT "${BACKEND_LOCAL}"

  echo
  echo "Effective frontend local config:"
  print_effective_value HR_DEV_SERVER_PORT "${FRONTEND_LOCAL}"
  print_effective_value HR_PREVIEW_PORT "${FRONTEND_LOCAL}"
  print_effective_value HR_API_PROXY_TARGET "${FRONTEND_LOCAL}"

  echo
  echo "Local config sync complete."
}

main "$@"
