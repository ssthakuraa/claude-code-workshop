#!/usr/bin/env bash
# start-day.sh — Reset your working directory to the start of a given day.
# Usage: bash scripts/start-day.sh <day>   where day = 1, 2, 3, or 4
#
# What this does:
#   1. Stashes any unsaved changes (so you don't lose them)
#   2. Checks out the day's starting checkpoint branch
#   3. Reloads the database (schema + demo data)
#   4. Verifies the backend compiles
#
# IMPORTANT: This will switch branches. Any uncommitted work is stashed, not deleted.
# Run  git stash pop  to recover it later if needed.

set -e

DAY=${1:-}

if [[ -z "$DAY" || ! "$DAY" =~ ^[1-4]$ ]]; then
  echo "Usage: bash scripts/start-day.sh <day>"
  echo "  day must be 1, 2, 3, or 4"
  exit 1
fi

BRANCH="checkpoint/day${DAY}-start"

echo "=========================================="
echo "  Starting Day ${DAY} — branch: ${BRANCH}"
echo "=========================================="

# Step 1: Stash any in-progress changes
echo ""
echo "[1/4] Saving in-progress work (git stash)..."
STASH_RESULT=$(git stash 2>&1)
if echo "$STASH_RESULT" | grep -q "No local changes"; then
  echo "      Nothing to stash — working tree is clean."
else
  echo "      Stashed: $STASH_RESULT"
  echo "      To recover later: git stash pop"
fi

# Step 2: Check out the checkpoint branch
echo ""
echo "[2/4] Switching to ${BRANCH}..."
if ! git checkout "$BRANCH" 2>&1; then
  echo ""
  echo "ERROR: Branch '$BRANCH' not found."
  echo "  Make sure you have run: git fetch origin"
  echo "  And that the branch exists: git branch -r | grep checkpoint"
  exit 1
fi
echo "      Now on branch: $(git rev-parse --abbrev-ref HEAD)"

# Step 3: Reload the database
echo ""
echo "[3/4] Reloading database (hr_db)..."
if mysql -u hrapp -phrapp_pass hr_db < database/schema.sql 2>/dev/null; then
  echo "      schema.sql loaded OK"
else
  echo "      WARNING: schema.sql load had errors. Trying with sudo..."
  sudo mysql hr_db < database/schema.sql 2>/dev/null || echo "      schema.sql load FAILED — check MySQL connection"
fi

if mysql -u hrapp -phrapp_pass hr_db < database/demo.sql 2>/dev/null; then
  echo "      demo.sql loaded OK"
else
  echo "      WARNING: demo.sql load had errors. Check MySQL connection."
  echo "      Manual fallback:"
  echo "        mysql -u hrapp -phrapp_pass hr_db < database/schema.sql"
  echo "        mysql -u hrapp -phrapp_pass hr_db < database/demo.sql"
fi

# Step 4: Compile check
echo ""
echo "[4/4] Verifying backend compiles..."
if mvn compile -f backend/pom.xml -q 2>&1; then
  echo "      Backend: OK"
else
  echo "      Backend compile FAILED. Fix compilation errors before starting the lab."
  echo "      Run:  mvn compile -f backend/pom.xml  to see full output."
  exit 1
fi

echo ""
echo "=========================================="
echo "  Day ${DAY} ready. You are on: $(git rev-parse --abbrev-ref HEAD)"
echo "  Start with: labs/lab-$(printf '%02d' $(( (DAY-1)*3+1 )))-*.md"
echo "=========================================="
