#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export PATH="${JAVA_HOME}/bin:${PATH}"
export AIHR_DB_HOSTNAME="${AIHR_DB_HOSTNAME:-127.0.0.1}"
export AIHR_DB_PORT="${AIHR_DB_PORT:-5432}"
export AIHR_DB_NAME="${AIHR_DB_NAME:-hrdb}"
export AIHR_DB_USER="${AIHR_DB_USER:-hrapp}"
export AIHR_DB_PASSWORD="${AIHR_DB_PASSWORD:-hrapp}"
export HR_APP_PORT="${HR_APP_PORT:-18082}"

exec "${SCRIPT_DIR}/backend/run-jersey-service.sh"
