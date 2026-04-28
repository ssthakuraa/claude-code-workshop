#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)
PREFERRED_JAVA_HOME="${PREFERRED_JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
JAVA_BIN="${JAVA_HOME:+${JAVA_HOME}/bin/java}"
MVN_BIN="${MVN_BIN:-$(command -v mvn || true)}"
MAVEN_REPO_LOCAL="${MAVEN_REPO_LOCAL:-${HOME}/.m2/repository}"
MAVEN_OFFLINE="${MAVEN_OFFLINE:-false}"
MAVEN_TEST_SKIP="${MAVEN_TEST_SKIP:-false}"

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

GOALS=("$@")
if [ ${#GOALS[@]} -eq 0 ]; then
  GOALS=(clean install)
fi

SKIP_TESTS=true
NEEDS_CLEAN=false
for goal in "${GOALS[@]}"; do
  case "${goal}" in
    test|verify|integration-test)
      SKIP_TESTS=false
      NEEDS_CLEAN=true
      break
      ;;
  esac
done

if [ "${NEEDS_CLEAN}" = "true" ]; then
  HAS_CLEAN=false
  for goal in "${GOALS[@]}"; do
    if [ "${goal}" = "clean" ]; then
      HAS_CLEAN=true
      break
    fi
  done

  if [ "${HAS_CLEAN}" = "false" ]; then
    GOALS=(clean "${GOALS[@]}")
  fi
fi

MAVEN_ARGS=(
  -Dmaven.repo.local="${MAVEN_REPO_LOCAL}"
)

if [ "${SKIP_TESTS}" = "true" ]; then
  if [ "${MAVEN_TEST_SKIP}" = "true" ]; then
    MAVEN_ARGS+=(-Dmaven.test.skip=true)
  else
    MAVEN_ARGS+=(-DskipTests)
  fi
fi

if [ "${MAVEN_OFFLINE}" = "true" ]; then
  MAVEN_ARGS=(-o "${MAVEN_ARGS[@]}")
fi

cd "${SCRIPT_DIR}"
exec "${MVN_BIN}" "${MAVEN_ARGS[@]}" "${GOALS[@]}"
