#!/usr/bin/env bash
# start-day.sh — Prepare your environment for the start of a given day.
# Usage: bash scripts/start-day.sh <day>   where day = 1, 2, 3, or 4
#
# What this does:
#   1. Reloads the database (schema + demo data)
#   2. Verifies the backend compiles

set -e

DAY=${1:-}

if [[ -z "$DAY" || ! "$DAY" =~ ^[1-4]$ ]]; then
  echo "Usage: bash scripts/start-day.sh <day>"
  echo "  day must be 1, 2, 3, or 4"
  exit 1
fi

echo "=========================================="
echo "  Preparing Day ${DAY}"
echo "=========================================="

# Step 1: Reload the database
echo ""
echo "[1/2] Reloading database (hr_db)..."
if mysql -u hrapp -phrapp_pass hr_db < database/schema.sql 2>/dev/null; then
  echo "      schema.sql loaded OK"
else
  echo "      WARNING: schema.sql load had errors. Check MySQL connection."
  echo "      Manual fallback:"
  echo "        mysql -u hrapp -phrapp_pass hr_db < database/schema.sql"
  echo "        mysql -u hrapp -phrapp_pass hr_db < database/demo.sql"
fi

if mysql -u hrapp -phrapp_pass hr_db < database/demo.sql 2>/dev/null; then
  echo "      demo.sql loaded OK"
else
  echo "      WARNING: demo.sql load had errors. Check MySQL connection."
fi

# Step 2: Compile check
echo ""
echo "[2/2] Verifying backend compiles..."
if mvn compile -f backend/pom.xml -q; then
  echo "      Backend: OK"
else
  echo "      Backend compile FAILED. Fix compilation errors before starting the lab."
  echo "      Run:  mvn compile -f backend/pom.xml  to see full output."
  exit 1
fi

echo ""
echo "=========================================="
echo "  Day ${DAY} ready. Begin with:"
case $DAY in
  1) echo "  labs/lab-01-claudemd.md" ;;
  2) echo "  labs/lab-05-hooks.md" ;;
  3) echo "  labs/lab-09-mcp-playwright.md" ;;
  4) echo "  labs/lab-11-cicd-permissions.md" ;;
esac
echo "=========================================="
