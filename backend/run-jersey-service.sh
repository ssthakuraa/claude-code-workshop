#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)
LOCAL_ENV_FILE="${SCRIPT_DIR}/.env.local"
PID_FILE="${SCRIPT_DIR}/.run-jersey-service.pid"
PREFERRED_JAVA_HOME="${PREFERRED_JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
JAVA_BIN="${JAVA_HOME:+${JAVA_HOME}/bin/java}"
MVN_BIN="${MVN_BIN:-$(command -v mvn || true)}"
MAVEN_REPO_LOCAL="${MAVEN_REPO_LOCAL:-${HOME}/.m2/repository}"
MAVEN_OFFLINE="${MAVEN_OFFLINE:-false}"
CLASSPATH_FILE="${SCRIPT_DIR}/hrapp-service/target/runtime.classpath"
DB_DETAILS_FILE="${REPO_ROOT}/dbdetails.md"

load_local_env_file() {
  local file_path="$1"
  local line=""
  local key=""
  local value=""

  [ -f "${file_path}" ] || return 0

  while IFS= read -r line || [ -n "${line}" ]; do
    line="${line%$'\r'}"
    case "${line}" in
      ""|\#*)
        continue
        ;;
      export\ *)
        line="${line#export }"
        ;;
    esac

    if [[ "${line}" != *=* ]]; then
      continue
    fi

    key="${line%%=*}"
    value="${line#*=}"

    if [[ "${value}" == \"*\" && "${value}" == *\" ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "${value}" == \'*\' && "${value}" == *\' ]]; then
      value="${value:1:${#value}-2}"
    fi

    export "${key}=${value}"
  done < "${file_path}"
}

load_local_env_file "${LOCAL_ENV_FILE}"
JAVA_BIN="${JAVA_HOME:+${JAVA_HOME}/bin/java}"

if [[ -f "${PID_FILE}" ]]; then
  EXISTING_PID="$(tr -d '[:space:]' < "${PID_FILE}")"
  if [[ -n "${EXISTING_PID}" ]] && kill -0 "${EXISTING_PID}" 2>/dev/null; then
    echo "Backend appears to already be running with PID ${EXISTING_PID}. Use ./stop-jersey-service.sh first." >&2
    exit 1
  fi
  rm -f "${PID_FILE}"
fi

if [ -z "${JAVA_HOME:-}" ] && [ -x "${PREFERRED_JAVA_HOME}/bin/java" ]; then
  JAVA_HOME="${PREFERRED_JAVA_HOME}"
  JAVA_BIN="${JAVA_HOME}/bin/java"
fi

if [ -z "${JAVA_HOME:-}" ]; then
  for candidate in /usr/lib/jvm/java-21-openjdk-amd64 /usr/lib/jvm/java-21-openjdk /usr/lib/jvm/openjdk-21; do
    if [ -x "${candidate}/bin/java" ]; then
      JAVA_HOME="${candidate}"
      JAVA_BIN="${JAVA_HOME}/bin/java"
      break
    fi
  done
fi

if [ -z "${JAVA_BIN}" ] || [ ! -x "${JAVA_BIN}" ]; then
  JAVA_BIN="$(command -v java || true)"
fi

if [ -z "${JAVA_BIN}" ] || [ ! -x "${JAVA_BIN}" ]; then
  echo "Java runtime not found. Install Java or set JAVA_HOME." >&2
  exit 1
fi

if [ -z "${MVN_BIN}" ] || [ ! -x "${MVN_BIN}" ]; then
  echo "Maven executable not found. Install Maven or set MVN_BIN." >&2
  exit 1
fi

if [ -z "${JAVA_HOME:-}" ]; then
  JAVA_HOME="$(cd "$(dirname "${JAVA_BIN}")/.." && pwd)"
fi

mkdir -p "${MAVEN_REPO_LOCAL}"

export JAVA_HOME
export PATH="$(dirname "${JAVA_BIN}"):${PATH}"

if [[ -f "${DB_DETAILS_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${DB_DETAILS_FILE}"
  export AIHR_DB_HOSTNAME="${AIHR_DB_HOSTNAME:-${DB_HOSTNAME:-${DB_HOST:-}}}"
  export AIHR_DB_PORT="${AIHR_DB_PORT:-${DB_PORT:-}}"
  export AIHR_DB_NAME="${AIHR_DB_NAME:-${DB_NAME:-${AIHR_DB_SERVICE_NAME:-${DB_SERVICE_NAME:-${DB_NAME:-${DB_SSID:-}}}}}}"
  export AIHR_DB_SERVICE_NAME="${AIHR_DB_SERVICE_NAME:-${DB_SERVICE_NAME:-${DB_NAME:-${DB_SSID:-}}}}"
  export AIHR_DB_USER="${AIHR_DB_USER:-${DB_APP_USER:-${DB_USER:-}}}"
  export AIHR_DB_PASSWORD="${AIHR_DB_PASSWORD:-${DB_APP_PASSWORD:-${DB_PASSWORD:-}}}"
fi

MAVEN_TEST_SKIP=true "${SCRIPT_DIR}/build-jersey-service.sh" clean install

cd "${SCRIPT_DIR}"
MAVEN_ARGS=(
  -q
  -Dmaven.repo.local="${MAVEN_REPO_LOCAL}"
  -pl hrapp-service
  -DskipTests
  org.apache.maven.plugins:maven-dependency-plugin:3.6.1:build-classpath
  -Dmdep.includeScope=runtime
  -Dmdep.outputFile="${CLASSPATH_FILE}"
  -Dmdep.pathSeparator=:
)

if [ "${MAVEN_OFFLINE}" = "true" ]; then
  MAVEN_ARGS=(-o "${MAVEN_ARGS[@]}")
fi

"${MVN_BIN}" "${MAVEN_ARGS[@]}"

RUNTIME_CLASSPATH=$(tr -d '\n' < "${CLASSPATH_FILE}")

printf '%s\n' "$$" > "${PID_FILE}"

exec "${JAVA_BIN}" \
  -cp "${SCRIPT_DIR}/hrapp-service/target/classes:${SCRIPT_DIR}/hrapp-common/target/classes:${RUNTIME_CLASSPATH}" \
  com.company.hr.HrMain
