# Setup: Environment & Student-Specific Bring-Up

**Duration:** 20 to 30 minutes

---

## What You Will Achieve

This chapter gets your learner machine and your local repo workspace ready before Lab 01. You will verify local prerequisites, confirm the current PostgreSQL details, and prove that the application can build, run, and open successfully with the repo's current command surface.

Most steps are things you will ask Claude Code to do and then review. A few steps are
intentionally manual, such as checking your machine details, confirming
database values, and restarting Claude Code when a later chapter requires it.

Before you begin:

- read [Start Here: Learner Workspace Guide](./student-workspace-guide.md)
- stay on the current repo commands and reserved lab ports
- treat this lab as bring-up only, not feature work

## Choose Your Workspace Root

You can start from either:

- a normal Git clone of the repo
- a GitHub zip that you extract locally

Use any directory that works on your machine, for example:

```bash
mkdir -p "$HOME/projects"
cd "$HOME/projects"

# Option A: Git clone
git clone <repo-url> claude-workshop
cd claude-workshop

# Option B: GitHub zip
# Extract the zip somewhere local, then cd into the extracted repo root
```

From this point on, "workspace root" means your actual local repo path, for example:

- `/home/yourname/projects/claude-workshop`
- `/scratch/training/claude-workshop`

The only requirement is that your workspace root contains:

- `CLAUDE.md`
- `backend/`
- `frontend/`
- `database/`
- `lab-materials/`
- `lab-materials/docs/` within it

## Setup Checklist

These are mostly manual learner checks before the main Claude Code bring-up prompts
begin.

- [ ] Open a terminal in the workspace root
  - Now change into that workspace before running the commands below:
  ```bash
  cd /absolute/path/to/claude-workshop
  pwd
  ```
- [ ] If you used a Git clone, confirm Git is available:
  ```bash
  git --version
  ```
  Expected result:
  - a recent Git version prints successfully
- [ ] Confirm Claude Code launches:
  ```bash
  claude --help
  ```
  Expected result:
  - help text prints successfully; you are not starting the interactive Claude Code session yet

  If Claude Code is not installed, install it first:
  ```bash
  # Option A: npm (CLI)
  npm install -g @anthropic-ai/claude-code
  # Option B: download the desktop app from claude.ai/code
  ```
  Config directory for Claude Code is `.claude/` in the workspace root.
- [ ] Confirm the machine name:
  ```bash
  hostname
  ```
  Expected result:
  - a single machine name
- [ ] Confirm the network identity that other machines may need:
  ```bash
  hostname -f || hostname
  hostname -I || ip addr || ifconfig
  ```
  Any one successful command is enough for this checklist step.
  This step is optional if you will only review the app inside the Linux VM.
  It matters when you want Claude Code to adjust frontend host settings so
  `hostname:port` works from another machine.
- [ ] Confirm JDK 21 is available for backend work:
  ```bash
  JAVA_HOME=/usr/lib/jvm/java-21-openjdk PATH=/usr/lib/jvm/java-21-openjdk/bin:$PATH java -version
  ```
  Expected result:
  - Java 21 prints successfully
- [ ] Confirm Maven is available:
  ```bash
  mvn -version
  ```
  Expected result:
  - Maven prints successfully
- [ ] Confirm Node and npm are available for the frontend:
  ```bash
  node --version
  npm --version
  ```
  Expected result:
  - both commands print successfully
- [ ] Confirm `psql` is available for the active PostgreSQL workflow:
  ```bash
  psql --version
  ```
  Expected result:
  - PostgreSQL client version prints successfully
- [ ] Confirm the repo control-plane directory can exist for later labs:
  ```bash
  test -f .claude && echo ".claude is a file and must be corrected before continuing"
  mkdir -p .claude
  ```
  Expected result:
  - `.claude/` exists as a directory in the workspace root
- [ ] Review the current non-secret database values:
  ```bash
  sed -n '/^AIHR_DB_/p' dbdetails.md | sed '/PASSWORD/d'
  ```
  Expected result:
  - host, port, database, and user are visible
  - password is not echoed

If any required tool is missing, install it before continuing. For a public GitHub workflow, this is normal bring-up work, not a lab defect.

## PostgreSQL Server Preparation

Before you run the local bootstrap script or ask Claude Code to load schema or demo data, make sure your local
PostgreSQL server exists and the learner database values from `dbdetails.md`
already work.

Use this order and do not skip ahead:

1. install PostgreSQL server on your machine if it is not installed yet
2. start the PostgreSQL service
3. create the learner DB user and database from `dbdetails.md`
4. only after that, load `database/hrschema.sql`
5. then load `database/hrdemo.sql`

For the current learner values in this repo, that means:

- database: `hrdb`
- user: `hrapp`
- PostgreSQL port: `5432`

For a normal local PostgreSQL install, `5432` is the usual default port.
If your machine already has PostgreSQL running on a different port, update
`dbdetails.md` first so the learner docs and later `psql` commands match your
real local environment.

One simple local setup example is:

```bash
sudo -u postgres psql -c "CREATE USER hrapp WITH PASSWORD 'hrapp';"
sudo -u postgres psql -c "CREATE DATABASE hrdb OWNER hrapp;"
```

If the role or database already exists, PostgreSQL will tell you. In that case,
inspect the current state and continue with the matching local values instead of
creating duplicates.

Before loading schema or demo data, verify the connection works:

```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "select current_user, current_database();"
```

Expected result:
- current user is `hrapp`
- current database is `hrdb`

If that command does not work, stop there and finish your local PostgreSQL
setup first. Read the PostgreSQL setup instructions for your machine and keep
working until command-line access works with the learner app user and database.

Do not continue to schema or demo-data loading until this kind of command works
cleanly:

```bash
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "select current_user, current_database();"
```

## Required Local Bootstrap

After PostgreSQL is installed, running, and reachable from `psql`, run this
before you start Claude Code, before you start the backend or frontend, and before
you change any local port values:

```bash
./lab-materials/setup-local-config.sh
```

Expected result:
- required tools are found
- `backend/.env.local` exists
- `frontend/.env.local` exists
- the script prints the effective local config values it will use

If the script reports a missing required tool, install that tool first and then
run the script again.

## The First Claude Code Bring-Up Prompt

In this repo, `dbdetails.md` already carries the active local PostgreSQL
connection values. The first learner task is not to convert legacy connection
placeholders. It is to make Claude Code inspect the current workspace conservatively
and prove that the current baseline is ready.

Before you ask Claude Code to do database work:

1. verify the workspace root is your actual local repo path
2. verify the `dbdetails.md` values match your intended local environment
3. verify PostgreSQL server is installed and the DB user/database already exist for those values
4. make sure the app-user `psql -h ... -U ... -d ...` connection check already works before you continue
5. do not ask Claude Code to rewrite unrelated docs or code during setup
6. use `psql` plus `database/hrschema.sql` and `database/hrdemo.sql` as the setup path
7. run the database steps sequentially: connection check, schema, demo data, then verification query
8. do not assume repo-bundled tooling exists under `runtime/`

## Default Lab Ports

Default lab ports are backend `18082` and frontend `5182`. These defaults are reserved to reduce conflicts during lab preparation and validation.

If these defaults work on your machine, do not change anything. Continue to the next step.

If you need different ports, change only your local config files. Do not edit application source code.

Backend local config example in `backend/.env.local`:

```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk
HR_APP_PORT=18082
```

If you want a different backend port, update that file. For example:

```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk
HR_APP_PORT=19082
```

Frontend local config example in `frontend/.env.local`:

```env
HR_DEV_SERVER_PORT=5182
HR_API_PROXY_TARGET=http://127.0.0.1:18082
```

If you want different ports, update that file. For example:

```env
HR_DEV_SERVER_PORT=5192
HR_API_PROXY_TARGET=http://127.0.0.1:19082
```

If you change the backend port, update `HR_API_PROXY_TARGET` in `frontend/.env.local` to match it.

Do not skip the bootstrap step above. `./lab-materials/setup-local-config.sh`
is the required path that creates and aligns these local files before the rest
of Setup.

Before you send the prompts below, start an interactive Claude Code session from the
workspace root:

```bash
cd /absolute/path/to/claude-workshop
claude
```

## Workspace Configuration Prompt

Use this first in your Claude Code session so Claude Code anchors itself to your actual local path:

```text
Treat this as workspace setup only.

My workspace root is: /absolute/path/to/my/local/repo

Read `lab-materials/student-workspace-guide.md`, `CLAUDE.md`, and `dbdetails.md` first.

Tasks:
1. confirm that this path looks like the repo workspace root by checking that it contains `CLAUDE.md`, `backend/`, `frontend/`, `database/`, `lab-materials/`, and `lab-materials/docs/`
2. tell me the exact workspace root you will use for all subsequent commands in this session
3. do not rewrite code or docs in this step
4. if anything about the workspace root is wrong, stop at the smallest real blocker
```

## Verify Lab 01 Readiness

Now that the learner-specific database details are aligned, run these prompts in order.

1. **Baseline database readiness prompt**

```text
Read `lab-materials/student-workspace-guide.md`, `CLAUDE.md`, `dbdetails.md`, and `backend/OFFLINE-JERSEY-BUILD.md` first.

Treat this as Setup environment preparation only.
Do not scan ahead in the labs and do not modify application code.

Tasks:
1. show me the current non-secret database details from `dbdetails.md` and ask me to inspect them before you apply any schema or demo-data script
2. verify first that PostgreSQL is reachable with those values and that the current user/database match
3. apply `database/hrschema.sql`
4. then apply `database/hrdemo.sql`
5. then verify the baseline with a read-only employee count query through `psql`
6. if schema or demo-data application fails, show me the current host, port, database name, and username you used, then stop at the smallest real blocker
7. tell me exactly what you ran and whether the environment is now ready for Lab 01

Important:
- use `psql` plus the active schema/demo scripts for the current PostgreSQL workflow
- treat `database/hrschema.sql` and `database/hrdemo.sql` as the active learner database setup
- do the database work in this order only: connection check, schema, demo data, verification query
- run the schema script first and wait for it to finish before you run the demo-data script
- treat this setup path as a fresh sequential reload for the learner workspace
- use the values from `dbdetails.md` when building `psql` commands
- never print the database password back to me
- use my actual current workspace root instead of assuming a hardcoded path
- if a schema or demo-data command may take a while, tell me to wait for the final result before moving to the next step
```

Expected result:
- Claude Code applies the schema/demo scripts successfully in sequence and then proves the employee count query works

2. **Runtime smoke prompt**

```text
Read `lab-materials/student-workspace-guide.md`, `CLAUDE.md`, `frontend/README.md`, and `backend/OFFLINE-JERSEY-BUILD.md` first.

Treat this as a Setup smoke test only.
Do not scan ahead in the labs and do not rewrite application code unless a real prerequisite defect blocks bring-up.

Tasks:
1. prove a clean backend validation path with `cd backend && JAVA_HOME=/usr/lib/jvm/java-21-openjdk PATH=/usr/lib/jvm/java-21-openjdk/bin:$PATH ./build-jersey-service.sh clean test`
2. if this is a fresh Git clone or extracted zip and frontend dependencies are not installed yet, install them first with `cd frontend && npm ci`
3. then prove a clean frontend validation path by removing generated frontend build artifacts first, then running `cd frontend && npm run build`
4. start the backend on port `18082`
5. start the frontend on port `5182` with API proxy target `http://127.0.0.1:18082`
6. verify `http://127.0.0.1:18082/app/hr/api/v1/health`
7. run the setup browser smoke check with `cd frontend && HR_UI_BASE_URL=http://127.0.0.1:5182 HR_UI_HEADLESS=true npm run test:e2e:ui-check`; do not invent a bundled browser under `runtime/`
8. log in with username `steven.king` and password `password123`, and confirm the dashboard loads
9. show me the exact commands you used, what passed, and any blocker that must be fixed before Lab 01

Important:
- for backend build validation, use the backend helper script, not a direct `mvn` command
- explicitly set JDK 21 for backend commands; do not trust the shell-default Java
- for persistent backend startup settings, prefer `backend/.env.local`; `backend/run-jersey-service.sh` reads it automatically
- for persistent frontend startup settings, prefer `frontend/.env.local`
- for frontend validation and dev-server commands, use the checked-in `package.json` scripts
- on a fresh Git clone or extracted zip, expect frontend dependency installation to be part of setup
- for frontend validation, remove generated artifacts such as `dist` before the build so the smoke test proves a clean build path
- do not download alternate runtime tooling for this smoke test
- if `18082` or `5182` are already in use, stop only stale repo-owned processes and then restart cleanly on the reserved ports
- for repo-owned backend cleanup, use `cd backend && ./stop-jersey-service.sh`
- for setup browser verification, prefer `npm run test:e2e:ui-check`; broader scripts such as `manual-qa` or `live-pages` belong to later labs that explicitly ask for them
- if browser automation is unavailable in the current Claude Code surface, say so clearly and give me the exact login URL for a manual check instead of inventing a packaged browser path
- use my actual current workspace root instead of assuming a hardcoded path
- after each build, test, or startup command, wait for the final result or ready signal before issuing the next command

If something fails, stop at the smallest real blocker and explain it clearly instead of scanning the whole codebase.
```

Expected result:
- backend wrapper test passes
- frontend build passes
- the health endpoint returns success on the reserved lab ports
- dashboard login is confirmed either through the current browser tool path or a clear manual-check handoff

If browser verification is blocked by the current execution surface, capture the
concrete error and keep that separate from repo defects. The right next step is
to retry the same current repo/browser path or perform a manual browser check,
not to switch to a made-up bundled runtime.

## Optional Cross-Machine Browser Access Prompt

This step is optional.
Only do it if you want to open the frontend URL from another machine while the
app is running on the learner VM.

If you are opening the app in a browser inside the learner VM itself, skip this step.

Use the sample below only as a formatting example:

```text
I want to access the HR frontend from another machine while it runs on this learner VM.

Update only the minimal frontend host/access settings needed for cross-machine browser access.
Do not change database settings.

Use these inputs exactly as provided for my environment:
- machine name / hostname: learner-vm-01
- VM host for cross-machine browser access: learner-vm-01.example.internal
```

When you prepare your real optional prompt for Claude Code, use your own values in the same structure, then issue that prompt to Claude Code.

After Claude Code makes the optional frontend-host changes, verify:

- the app still works inside the learner VM browser
- if Claude Code created or updated `frontend/.env`, the values look reasonable for this repo
- the expected frontend host variables are described in `frontend/README.md`
- if the URL still does not work from another machine, first check the frontend host settings, then check VM firewall, network security rules, proxy, or other network exposure outside the app

## Success Criteria

- [ ] Learner VM identity is known
- [ ] Claude Code is available from the workspace root
- [ ] JDK 21, Maven, Node/npm, and `psql` are available
- [ ] Current non-secret PostgreSQL details were reviewed from `dbdetails.md`
- [ ] PostgreSQL server is installed locally and the learner DB user/database already exist for the `dbdetails.md` values
- [ ] Claude Code has been prompted once to verify or prepare the baseline PostgreSQL schema and demo data
- [ ] Claude Code has been prompted once to prove backend build, frontend build, runtime startup, and dashboard login
- [ ] The learner can state what to verify before starting Lab 01
