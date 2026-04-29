# Environment Setup Instructions

These instructions are for Claude Code. The student has already pasted the
setup prompt and you are now reading this file as directed. Follow every phase
in order. Do not read any source code outside the files explicitly named here.

---

## Minimum versions required

| Tool | Minimum | Purpose |
|------|---------|---------|
| Claude Code | any | you are already running |
| git | 2.x | cloning and lab branching |
| Java JDK | 21 | Jersey/JAX-RS backend |
| Maven | 3.8 | backend build system |
| Node.js | 20 | Vite dev server and frontend build |
| npm | 9 | frontend package management |
| PostgreSQL server | 14 | application database |
| psql (client) | 14 | schema loading and verification |

Higher versions of every tool are fine. Do not ask the student to downgrade.

---

## Phase 1 — Detect OS and package manager

Run:
```bash
uname -s && cat /etc/os-release 2>/dev/null | grep -E "^(ID|ID_LIKE|NAME)=" | head -3
```

From the output, determine the primary package manager:
- Ubuntu / Debian / Pop!_OS / Mint → `apt`
- Fedora / RHEL / Rocky / AlmaLinux → `dnf`
- older CentOS → `yum`
- Arch / Manjaro → `pacman`
- macOS → `brew`
- other → note it and use best judgement

Keep this value in mind for install suggestions throughout.

---

## Phase 2 — Check each tool

For each tool below, run the version check. If the tool is missing or below
minimum, print a clearly formatted install suggestion using the detected
package manager, then STOP and tell the student:

> "Please run the install command above in a separate terminal, then come back
> and tell me when it is done. I will continue from here."

Wait for the student to confirm before moving to the next tool.

If the tool is present and at or above minimum, print a single ✓ line and
continue.

### git
```bash
git --version
```
Install if missing:
- apt: `sudo apt install git`
- dnf: `sudo dnf install git`
- brew: `brew install git`

### Java JDK ≥ 21
```bash
java -version 2>&1
```
Extract the major version number. Accept any value ≥ 21.
Install if missing or below 21:
- apt: `sudo apt install openjdk-21-jdk`
- dnf: `sudo dnf install java-21-openjdk-devel`
- brew: `brew install openjdk@21`

### Maven ≥ 3.8
```bash
mvn -version 2>&1 | head -1
```
Install if missing or below 3.8:
- apt: `sudo apt install maven`
- dnf: `sudo dnf install maven`
- brew: `brew install maven`

### Node.js ≥ 20
```bash
node --version
```
Extract the major version number. Accept any value ≥ 20.
Install if missing or below 20:
- apt: `sudo apt install nodejs npm` (or use nvm for a newer version)
- dnf: `sudo dnf install nodejs npm`
- brew: `brew install node`
- nvm (any distro): `nvm install --lts`

### npm ≥ 9
```bash
npm --version
```
npm ships with Node. If Node is ≥ 20, npm is almost always ≥ 9 already.

### PostgreSQL server ≥ 14
```bash
pg_lsclusters 2>/dev/null || pg_ctl --version 2>/dev/null || postgres --version 2>/dev/null
```
If not installed:
- apt: `sudo apt install postgresql`
- dnf: `sudo dnf install postgresql-server && sudo postgresql-setup --initdb && sudo systemctl enable --now postgresql`
- brew: `brew install postgresql@14 && brew services start postgresql@14`

After install, verify the service is running:
```bash
pg_isready 2>/dev/null || systemctl is-active postgresql 2>/dev/null || brew services list 2>/dev/null | grep postgresql
```

### psql client ≥ 14
```bash
psql --version
```
Install if missing (usually installs with the server):
- apt: `sudo apt install postgresql-client`
- dnf: `sudo dnf install postgresql`

---

## Phase 3 — Detect real JAVA_HOME

Run:
```bash
java_bin=$(readlink -f $(which java) 2>/dev/null || which java)
java_home=$(dirname $(dirname $java_bin))
echo "Detected JAVA_HOME: $java_home"
java -version 2>&1
```

Use the detected `$java_home` value everywhere below. Do not hardcode any
path like `/usr/lib/jvm/java-21-openjdk`. The path varies by distro and
version — always derive it at runtime.

---

## Phase 4 — Capture workspace root

Run:
```bash
pwd
```

This is `WORKSHOP_ROOT`. Use it for all absolute path references in this
session. Never assume a hardcoded path.

---

## Phase 5 — Write environment config files

Run the bootstrap script which creates `backend/.env.local` and
`frontend/.env.local` using the detected JAVA_HOME:

```bash
bash lab-materials/setup-local-config.sh
```

If it reports any missing tool, that tool was missed in Phase 2. Install it
now following the same pattern, then re-run the script.

After it succeeds, show the student both files:
```bash
cat backend/.env.local
cat frontend/.env.local
```

Confirm that `JAVA_HOME` in `backend/.env.local` matches the value found in
Phase 3. If it does not match, update the file to use the correct path.

---

## Phase 6 — Set up PostgreSQL database

Read `dbdetails.md` for the connection values. Do not print the password.

First check if the database connection already works:
```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "select current_user, current_database();" 2>&1
```

If the connection works, skip to Phase 7.

If it fails with "role does not exist" or "database does not exist", print
these commands and tell the student:

> "Please run these two commands in a separate terminal — they require
> PostgreSQL superuser access. Tell me when you are done."

```bash
sudo -u postgres psql -c "CREATE USER hrapp WITH PASSWORD 'hrapp';"
sudo -u postgres psql -c "CREATE DATABASE hrdb OWNER hrapp;"
```

After the student confirms, verify the connection again before continuing.

---

## Phase 7 — Load schema and demo data

Run sequentially. Wait for each to complete before running the next.

```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -f database/hrschema.sql
```

Then:
```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -f database/hrdemo.sql
```

Verify:
```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "SELECT COUNT(*) AS employee_count FROM aihr_employees;"
```

Expected: 121 rows. If the count is 0 or the table is missing, stop and report
the exact error.

---

## Phase 8 — Build and test the backend

```bash
bash backend/build-jersey-service.sh clean test
```

This script auto-detects JAVA_HOME from `backend/.env.local`. Do not override
it manually.

Expected result: `BUILD SUCCESS` with all tests passing. If any test fails,
report the failing test name and error — do not scan application source code
to investigate.

---

## Phase 9 — Install and build the frontend

Install dependencies (safe to run on an existing install):
```bash
cd frontend && npm ci
```

Then build:
```bash
cd frontend && rm -rf dist && npm run build
```

Expected result: build completes with no errors and a `dist/` directory is
created.

---

## Phase 10 — Start services

Start the backend:
```bash
bash backend/run-jersey-service.sh &
```

Wait 8 seconds, then verify it is healthy:
```bash
sleep 8 && curl -s http://127.0.0.1:18082/app/hr/api/v1/health
```

Expected: JSON response with `"status":"UP"`.

Start the frontend dev server:
```bash
cd frontend && npm run dev &
```

Wait 5 seconds, then verify it responds:
```bash
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5182/
```

Expected: `200`.

---

## Phase 11 — Smoke test

```bash
cd frontend && HR_UI_BASE_URL=http://127.0.0.1:5182 HR_UI_HEADLESS=true npm run test:e2e:ui-check
```

Expected: JSON output showing `loginUrl`, `dashboardUrl`, and
`firstEmployeeRow` — confirming login works and the employee list loads from
the live database.

If Playwright browsers are not installed, run:
```bash
cd frontend && npx playwright install chromium
```
Then re-run the smoke test.

---

## Phase 12 — Summary

Print a clear summary in this format:

```
╔══════════════════════════════════════════════════════╗
║           Claude Code Setup — Complete               ║
╠══════════════════════════════════════════════════════╣
║  Java         <detected version and path>            ║
║  Maven        <version>                              ║
║  Node.js      <version>                              ║
║  npm          <version>                              ║
║  PostgreSQL   <version>                              ║
║  Backend      UP on port 18082                       ║
║  Frontend     UP on port 5182                        ║
║  Database     121 employees loaded                   ║
╠══════════════════════════════════════════════════════╣
║  Run this to confirm your setup receipt:             ║
║  bash lab-materials/verify-setup.sh                  ║
╚══════════════════════════════════════════════════════╝
```

Tell the student they are ready to start Lab 01.
