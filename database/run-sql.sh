#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DB_DETAILS_FILE="${REPO_ROOT}/dbdetails.md"
SQL_BIN="${SQL_BIN:-$(command -v sql || true)}"

if [[ -z "${SQL_BIN}" || ! -x "${SQL_BIN}" ]]; then
    echo "SQLcl binary not found. Install SQLcl or set SQL_BIN to the sql executable path." >&2
    exit 1
fi

if [[ -n "${JAVA_HOME:-}" && -x "${JAVA_HOME}/bin/java" ]]; then
    export PATH="${JAVA_HOME}/bin:${PATH}"
fi

if [[ "${1:-}" == "-version" || "${1:-}" == "--version" ]]; then
    exec "${SQL_BIN}" "$@"
fi

if [[ ! -f "${DB_DETAILS_FILE}" ]]; then
    echo "Database details file not found at ${DB_DETAILS_FILE}" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "${DB_DETAILS_FILE}"

: "${DB_HOSTNAME:?DB_HOSTNAME is required in dbdetails.md}"
: "${DB_PORT:?DB_PORT is required in dbdetails.md}"
: "${DB_APP_USER:?DB_APP_USER is required in dbdetails.md}"
: "${DB_APP_PASSWORD:?DB_APP_PASSWORD is required in dbdetails.md}"

if [[ -n "${DB_SERVICE_NAME:-}" ]]; then
    DEFAULT_CONNECT_STRING="${DB_APP_USER}/${DB_APP_PASSWORD}@//${DB_HOSTNAME}:${DB_PORT}/${DB_SERVICE_NAME}"
else
    : "${DB_SSID:?DB_SSID is required in dbdetails.md when DB_SERVICE_NAME is not set}"
    DEFAULT_CONNECT_STRING="${DB_APP_USER}/${DB_APP_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}:${DB_SSID}"
fi

if [[ $# -eq 0 ]]; then
    exec "${SQL_BIN}" "${DEFAULT_CONNECT_STRING}"
fi

if [[ "${1}" == @* || "${1}" == -* ]]; then
    exec "${SQL_BIN}" "${DEFAULT_CONNECT_STRING}" "$@"
fi

exec "${SQL_BIN}" "$@"
