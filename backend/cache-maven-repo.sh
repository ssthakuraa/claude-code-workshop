#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)
PREFERRED_JAVA_HOME="${PREFERRED_JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
JAVA_BIN="${JAVA_HOME:+${JAVA_HOME}/bin/java}"
MVN_BIN="${MVN_BIN:-$(command -v mvn || true)}"
MAVEN_REPO_LOCAL="${MAVEN_REPO_LOCAL:-${HOME}/.m2/repository}"
MAVEN_SETTINGS_FILE="${MAVEN_SETTINGS_FILE:-}"

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

mkdir -p "${MAVEN_REPO_LOCAL}"

if [ -z "${JAVA_HOME:-}" ]; then
  JAVA_HOME="$(cd "$(dirname "${JAVA_BIN}")/.." && pwd)"
fi

if [ -z "${MAVEN_SETTINGS_FILE}" ] && [ -f "${HOME}/.m2/settings.xml" ]; then
  MAVEN_SETTINGS_FILE="${HOME}/.m2/settings.xml"
fi

MAVEN_ARGS=(
  -Dmaven.repo.local="${MAVEN_REPO_LOCAL}"
  -pl hrapp-service
  -am
  -DskipTests
  dependency:go-offline
  install
)

if [ -n "${MAVEN_SETTINGS_FILE}" ]; then
  if [ ! -f "${MAVEN_SETTINGS_FILE}" ]; then
    echo "Maven settings file not found at ${MAVEN_SETTINGS_FILE}" >&2
    exit 1
  fi
  MAVEN_ARGS=(-s "${MAVEN_SETTINGS_FILE}" "${MAVEN_ARGS[@]}")
fi

export JAVA_HOME
export PATH="$(dirname "${JAVA_BIN}"):${PATH}"

cd "${SCRIPT_DIR}"
exec "${MVN_BIN}" "${MAVEN_ARGS[@]}"
