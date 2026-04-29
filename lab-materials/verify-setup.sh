#!/usr/bin/env bash
# Run this after Claude Code completes the environment setup.
# It prints a receipt confirming everything that was configured.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

GREEN='\033[0;32m'
RED='\033[0;91m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

pass() { printf "  ${GREEN}✓${RESET}  %s\n" "$1"; }
fail() { printf "  ${RED}✗${RESET}  %s\n" "$1"; FAILURES=$((FAILURES + 1)); }
warn() { printf "  ${YELLOW}~${RESET}  %s\n" "$1"; }
header() { printf "\n${BOLD}${CYAN}%s${RESET}\n" "$1"; }

FAILURES=0

printf "\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
printf "${BOLD}          Claude Code Workshop — Setup Receipt          ${RESET}\n"
printf "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"

# ── Workspace ────────────────────────────────────────────────────────────────
header "Workspace"
printf "  ${BOLD}Root:${RESET}  %s\n" "${REPO_ROOT}"
if [[ -f "${REPO_ROOT}/CLAUDE.md" && -d "${REPO_ROOT}/backend" && -d "${REPO_ROOT}/frontend" ]]; then
  pass "Workspace root looks correct"
else
  fail "Workspace root missing expected directories (backend/, frontend/, CLAUDE.md)"
fi

# ── Tool versions ─────────────────────────────────────────────────────────────
header "Tool Versions"

# git
if git_ver=$(git --version 2>/dev/null); then
  pass "git          ${git_ver}"
else
  fail "git          not found"
fi

# Java
if java_ver=$(java -version 2>&1 | head -1); then
  major=$(echo "$java_ver" | grep -oE '"[0-9]+' | tr -d '"' | head -1)
  if [[ "${major:-0}" -ge 21 ]]; then
    java_home=$(dirname $(dirname $(readlink -f $(which java) 2>/dev/null || which java)) 2>/dev/null || echo "unknown")
    pass "Java         ${java_ver}  (JAVA_HOME: ${java_home})"
  else
    fail "Java         ${java_ver}  (need ≥ 21)"
  fi
else
  fail "Java         not found"
fi

# Maven
if mvn_ver=$(mvn -version 2>/dev/null | head -1); then
  pass "Maven        ${mvn_ver}"
else
  fail "Maven        not found"
fi

# Node
if node_ver=$(node --version 2>/dev/null); then
  major=$(echo "$node_ver" | tr -d 'v' | cut -d. -f1)
  if [[ "${major:-0}" -ge 20 ]]; then
    pass "Node.js      ${node_ver}"
  else
    fail "Node.js      ${node_ver}  (need ≥ v20)"
  fi
else
  fail "Node.js      not found"
fi

# npm
if npm_ver=$(npm --version 2>/dev/null); then
  pass "npm          v${npm_ver}"
else
  fail "npm          not found"
fi

# psql
if psql_ver=$(psql --version 2>/dev/null); then
  pass "psql         ${psql_ver}"
else
  fail "psql         not found"
fi

# Claude Code
if claude_ver=$(claude --version 2>/dev/null | head -1); then
  pass "Claude Code  ${claude_ver}"
else
  warn "Claude Code  (version check not available — you are running it right now)"
fi

# ── Environment config files ──────────────────────────────────────────────────
header "Environment Config"

if [[ -f "${REPO_ROOT}/backend/.env.local" ]]; then
  java_home_val=$(grep "^JAVA_HOME=" "${REPO_ROOT}/backend/.env.local" | head -1 | cut -d= -f2- | tr -d '[:space:]')
  port_val=$(grep "^HR_APP_PORT=" "${REPO_ROOT}/backend/.env.local" | head -1 | cut -d= -f2- | tr -d '[:space:]')
  pass "backend/.env.local exists"
  printf "         JAVA_HOME = %s\n" "${java_home_val:-not set}"
  printf "         HR_APP_PORT = %s\n" "${port_val:-not set}"
  if [[ -n "${java_home_val}" && -x "${java_home_val}/bin/java" ]]; then
    pass "JAVA_HOME path is valid and java binary exists"
  else
    fail "JAVA_HOME path '${java_home_val}' does not contain a java binary"
  fi
else
  fail "backend/.env.local not found — run setup-local-config.sh"
fi

if [[ -f "${REPO_ROOT}/frontend/.env.local" ]]; then
  dev_port=$(grep "^HR_DEV_SERVER_PORT=" "${REPO_ROOT}/frontend/.env.local" | head -1 | cut -d= -f2- | tr -d '[:space:]')
  proxy=$(grep "^HR_API_PROXY_TARGET=" "${REPO_ROOT}/frontend/.env.local" | head -1 | cut -d= -f2- | tr -d '[:space:]')
  pass "frontend/.env.local exists"
  printf "         HR_DEV_SERVER_PORT = %s\n" "${dev_port:-not set}"
  printf "         HR_API_PROXY_TARGET = %s\n" "${proxy:-not set}"
else
  fail "frontend/.env.local not found — run setup-local-config.sh"
fi

# ── Database ──────────────────────────────────────────────────────────────────
header "Database"

db_ok=false
if PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "" 2>/dev/null; then
  pass "PostgreSQL connection  hrapp@localhost/hrdb"
  db_ok=true
else
  fail "PostgreSQL connection failed — check that the service is running and the hrapp user/database exist"
fi

if [[ "${db_ok}" == true ]]; then
  emp_count=$(PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -t -c "SELECT COUNT(*) FROM aihr_employees;" 2>/dev/null | tr -d ' ')
  if [[ "${emp_count:-0}" -ge 100 ]]; then
    pass "aihr_employees       ${emp_count} rows"
  else
    fail "aihr_employees       ${emp_count:-0} rows  (expected ~121 — re-run schema and demo data load)"
  fi

  tbl_count=$(PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'aihr_%';" 2>/dev/null | tr -d ' ')
  pass "AIHR_* tables        ${tbl_count} found"
fi

# ── Backend ───────────────────────────────────────────────────────────────────
header "Backend Service"

health=$(curl -s --max-time 3 http://127.0.0.1:18082/app/hr/api/v1/health 2>/dev/null || true)
if echo "${health}" | grep -q '"status":"UP"'; then
  pass "Backend health endpoint  UP on port 18082"
else
  warn "Backend is not running  (start with: bash backend/run-jersey-service.sh)"
fi

# ── Frontend ──────────────────────────────────────────────────────────────────
header "Frontend Service"

fe_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:5182/ 2>/dev/null || true)
if [[ "${fe_code}" == "200" ]]; then
  pass "Frontend dev server      UP on port 5182"
else
  warn "Frontend is not running  (start with: cd frontend && npm run dev)"
fi

# ── Backend build artefact ────────────────────────────────────────────────────
header "Build Artefacts"

jar_path="${REPO_ROOT}/backend/hrapp-service/target/hrapp-service-1.0.0-SNAPSHOT.jar"
if [[ -f "${jar_path}" ]]; then
  jar_size=$(du -h "${jar_path}" | cut -f1)
  pass "Backend JAR  ${jar_size}  hrapp-service-1.0.0-SNAPSHOT.jar"
else
  warn "Backend JAR not found — run: bash backend/build-jersey-service.sh"
fi

dist_path="${REPO_ROOT}/frontend/dist"
if [[ -d "${dist_path}" ]] && [[ -n "$(ls -A "${dist_path}" 2>/dev/null)" ]]; then
  asset_count=$(find "${dist_path}" -type f | wc -l | tr -d ' ')
  pass "Frontend dist  ${asset_count} files built"
else
  warn "Frontend dist/ not found — run: cd frontend && npm run build"
fi

# ── Result ────────────────────────────────────────────────────────────────────
printf "\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"

if [[ "${FAILURES}" -eq 0 ]]; then
  printf "${GREEN}${BOLD}  ✓  All checks passed — you are ready for Lab 01      ${RESET}\n"
else
  printf "${RED}${BOLD}  ✗  ${FAILURES} check(s) failed — review the items above      ${RESET}\n"
  printf "     Re-run this script after fixing them.\n"
fi

printf "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n\n"

exit "${FAILURES}"
