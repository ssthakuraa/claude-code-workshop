#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
LOG_DIR="${SCRIPT_DIR}/logs"
BACKEND_PID_FILE="${SCRIPT_DIR}/.startHRlab-backend.pid"
FRONTEND_PID_FILE="${SCRIPT_DIR}/.startHRlab-frontend.pid"
BACKEND_META_FILE="${SCRIPT_DIR}/.startHRlab-backend.meta"
FRONTEND_META_FILE="${SCRIPT_DIR}/.startHRlab-frontend.meta"
BACKEND_LOG_FILE="${LOG_DIR}/hrlab-backend.log"
FRONTEND_LOG_FILE="${LOG_DIR}/hrlab-frontend.log"
BACKEND_PORT="${HR_APP_PORT:-18082}"
FRONTEND_PORT="${HR_DEV_SERVER_PORT:-5182}"

mkdir -p "${LOG_DIR}"

is_running() {
  local pid_file="$1"
  if [[ -f "${pid_file}" ]]; then
    local pid
    pid="$(tr -d '[:space:]' < "${pid_file}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      return 0
    fi
    rm -f "${pid_file}"
  fi
  return 1
}

remove_state() {
  local pid_file="$1"
  local meta_file="$2"

  rm -f "${pid_file}" "${meta_file}"
}

write_metadata() {
  local meta_file="$1"
  local label="$2"
  local pid="$3"
  local port="$4"
  local command="$5"
  local log_file="$6"

  cat > "${meta_file}" <<META
label=${label}
pid=${pid}
port=${port}
started_at=$(date -Iseconds)
workdir=${SCRIPT_DIR}
command=${command}
log_file=${log_file}
META
}

wait_for_startup() {
  local pid="$1"
  local pid_file="$2"
  local meta_file="$3"
  local label="$4"
  local log_file="$5"

  for _ in $(seq 1 5); do
    if ! kill -0 "${pid}" 2>/dev/null; then
      remove_state "${pid_file}" "${meta_file}"
      echo "${label} exited during startup. Check ${log_file}."
      return 1
    fi
    sleep 1
  done

  return 0
}

start_service() {
  local pid_file="$1"
  local meta_file="$2"
  local label="$3"
  local port="$4"
  local log_file="$5"
  local command="$6"

  if is_running "${pid_file}"; then
    echo "${label} is already running with PID $(cat "${pid_file}")."
    return
  fi

  (
    cd "${SCRIPT_DIR}"
    exec ${command}
  ) >"${log_file}" 2>&1 &

  local pid
  pid="$!"
  echo "${pid}" > "${pid_file}"
  write_metadata "${meta_file}" "${label}" "${pid}" "${port}" "${command}" "${log_file}"

  if ! wait_for_startup "${pid}" "${pid_file}" "${meta_file}" "${label}" "${log_file}"; then
    return 1
  fi

  echo "Started ${label} on port ${port} with PID ${pid}."
  echo "State: ${pid_file} and ${meta_file}"
}

start_backend() {
  start_service \
    "${BACKEND_PID_FILE}" \
    "${BACKEND_META_FILE}" \
    "HRLab backend" \
    "${BACKEND_PORT}" \
    "${BACKEND_LOG_FILE}" \
    "./start-hrlab-backend.sh"
}

start_frontend() {
  start_service \
    "${FRONTEND_PID_FILE}" \
    "${FRONTEND_META_FILE}" \
    "HRLab frontend" \
    "${FRONTEND_PORT}" \
    "${FRONTEND_LOG_FILE}" \
    "./start-hrlab-frontend.sh"
}

start_backend
start_frontend

echo "Logs:"
echo "  ${BACKEND_LOG_FILE}"
echo "  ${FRONTEND_LOG_FILE}"
