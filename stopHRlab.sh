#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BACKEND_PID_FILE="${SCRIPT_DIR}/.startHRlab-backend.pid"
FRONTEND_PID_FILE="${SCRIPT_DIR}/.startHRlab-frontend.pid"
BACKEND_META_FILE="${SCRIPT_DIR}/.startHRlab-backend.meta"
FRONTEND_META_FILE="${SCRIPT_DIR}/.startHRlab-frontend.meta"
BACKEND_PORT="${HR_APP_PORT:-18082}"
FRONTEND_PORT="${HR_DEV_SERVER_PORT:-5182}"

remove_state() {
  local pid_file="$1"
  local meta_file="$2"

  [[ -n "${pid_file}" ]] && rm -f "${pid_file}"
  [[ -n "${meta_file}" ]] && rm -f "${meta_file}"
}

stop_pid() {
  local pid="$1"
  local pid_file="${2:-}"
  local meta_file="${3:-}"
  local label="$4"

  if ! kill -0 "${pid}" 2>/dev/null; then
    if [[ -n "${pid_file}" || -n "${meta_file}" ]]; then
      remove_state "${pid_file}" "${meta_file}"
    fi
    echo "${label} PID ${pid} is not running."
    return
  fi

  kill "${pid}"

  for _ in $(seq 1 15); do
    if ! kill -0 "${pid}" 2>/dev/null; then
      if [[ -n "${pid_file}" || -n "${meta_file}" ]]; then
        remove_state "${pid_file}" "${meta_file}"
      fi
      echo "Stopped ${label} PID ${pid}."
      return
    fi
    sleep 1
  done

  kill -9 "${pid}" 2>/dev/null || true
  if [[ -n "${pid_file}" || -n "${meta_file}" ]]; then
    remove_state "${pid_file}" "${meta_file}"
  fi
  echo "Force stopped ${label} PID ${pid}."
}

find_repo_pid_by_command() {
  local label="$1"

  if [[ "${label}" == "HRLab frontend" ]]; then
    ps -eo pid=,comm=,args= \
      | awk -v repo="${SCRIPT_DIR}" '
        index($0, repo) && ($2 == "npm" || $2 == "node") && ($0 ~ /npm run dev|vite/) { print $1 }
      ' \
      | head -n 1
    return
  fi

  ps -eo pid=,comm=,args= \
    | awk -v repo="${SCRIPT_DIR}" '
      index($0, repo) && $2 == "java" && $0 ~ /com\.company\.hr\.HrMain/ { print $1 }
    ' \
    | head -n 1
}

find_repo_pid_by_port() {
  local port="$1"

  while IFS= read -r pid; do
    [[ -n "${pid}" ]] || continue
    if ps -p "${pid}" -o args= | grep -Fq "${SCRIPT_DIR}"; then
      echo "${pid}"
      return
    fi
  done < <(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)
}

find_repo_pid() {
  local label="$1"
  local port="$2"
  local pid=""

  pid="$(find_repo_pid_by_command "${label}")"
  if [[ -n "${pid}" ]]; then
    echo "${pid}"
    return
  fi

  find_repo_pid_by_port "${port}"
}

stop_pid_file() {
  local pid_file="$1"
  local meta_file="$2"
  local label="$3"
  local port="$4"

  if [[ ! -f "${pid_file}" ]]; then
    local discovered_pid
    discovered_pid="$(find_repo_pid "${label}" "${port}")"
    if [[ -n "${discovered_pid}" ]]; then
      echo "No ${label} PID file found. Stopping discovered repo process ${discovered_pid}."
      stop_pid "${discovered_pid}" "" "${meta_file}" "${label}"
      return
    fi
    echo "No ${label} PID file found and no repo-owned process was detected."
    return
  fi

  local pid
  pid="$(tr -d '[:space:]' < "${pid_file}")"

  if [[ -z "${pid}" ]]; then
    remove_state "${pid_file}" "${meta_file}"
    echo "Removed empty ${label} PID file."
    return
  fi

  stop_pid "${pid}" "${pid_file}" "${meta_file}" "${label}"
}

stop_pid_file "${FRONTEND_PID_FILE}" "${FRONTEND_META_FILE}" "HRLab frontend" "${FRONTEND_PORT}"
stop_pid_file "${BACKEND_PID_FILE}" "${BACKEND_META_FILE}" "HRLab backend" "${BACKEND_PORT}"
