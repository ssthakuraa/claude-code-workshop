#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PID_FILE="${SCRIPT_DIR}/.run-jersey-service.pid"

find_repo_backend_pid() {
  ps -ef \
    | rg "${SCRIPT_DIR}/hrapp-service/target/classes" \
    | rg "com\\.company\\.hr\\.HrMain" \
    | rg -v "rg " \
    | awk '{print $2}' \
    | head -n 1 \
    || true
}

wait_for_exit() {
  local pid="$1"
  local attempt=0

  while kill -0 "${pid}" 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ "${attempt}" -ge 15 ]; then
      return 1
    fi
    sleep 1
  done
}

TARGET_PID=""
if [[ -f "${PID_FILE}" ]]; then
  TARGET_PID="$(tr -d '[:space:]' < "${PID_FILE}")"
fi

if [[ -z "${TARGET_PID}" ]] || ! kill -0 "${TARGET_PID}" 2>/dev/null; then
  TARGET_PID="$(find_repo_backend_pid)"
fi

if [[ -z "${TARGET_PID}" ]]; then
  rm -f "${PID_FILE}"
  echo "No running Jersey backend process was found for this repo."
  exit 0
fi

kill "${TARGET_PID}"

if ! wait_for_exit "${TARGET_PID}"; then
  kill -9 "${TARGET_PID}"
  wait_for_exit "${TARGET_PID}" || true
fi

rm -f "${PID_FILE}"
echo "Stopped Jersey backend process ${TARGET_PID}."
