# Setup: Environment & Student-Specific Bring-Up

**Duration:** 20 to 30 minutes

---

## What You Will Achieve

By the end of this chapter your machine will have all required tools installed,
the application database loaded, and the backend and frontend running. You will
confirm everything with a single verification command that prints a setup
receipt.

The setup is done by Claude Code — not by a long manual checklist. This is
intentional: watching Claude Code diagnose and configure a real environment is
itself the first lesson of this workshop.

---

## Before You Begin

Read [Start Here: Learner Workspace Guide](./student-workspace-guide.md) first.
It explains the workspace layout and the rules that apply across all labs.

---

## Step 1 — Install Claude Code

Claude Code is the only thing you need to install manually. Everything else is
handled by the setup prompt in Step 3.

```bash
npm install -g @anthropic-ai/claude-code
```

Or download the desktop app from **claude.ai/code**.

Verify it is installed:

```bash
claude --help
```

Expected result: help text prints. You are not starting an interactive session
yet.

---

## Step 2 — Clone the repo and open your workspace

Clone to any directory on your machine:

```bash
git clone <repo-url>
cd claude-code-workshop
```

The examples throughout the labs refer to the workshop root — use whatever directory name you chose when cloning. After the `cd`, confirm you are inside the right directory:

```bash
pwd
ls CLAUDE.md backend frontend database lab-materials
```

All five items should be present. This directory is your **workspace root** for
the entire workshop. Keep a terminal here.

---

## Step 3 — Run the Claude Code setup prompt

Start Claude Code from your workspace root:

```bash
claude
```

Open `lab-materials/envsetup-prompt.md`, copy the prompt inside the box, and
paste it into your Claude Code session.

Claude Code will:

1. Check that all required tools are installed and meet the minimum versions
2. Tell you if anything is missing and give you the exact install command for
   your operating system — run those commands in a separate terminal, then tell
   Claude Code when you are done
3. Detect your actual tool paths and write the correct environment config files
4. Set up the PostgreSQL database — it will ask you to run two commands that
   need `sudo` access, then continue automatically
5. Build and test the backend
6. Install and build the frontend
7. Start both services
8. Run a smoke test confirming the app is live and the database is loaded

Follow Claude Code's instructions. The only things you need to do yourself are
any commands it flags as requiring `sudo`.

---

## Step 4 — Confirm your setup receipt

Once Claude Code says setup is complete, open a **new terminal** in your
workspace root and run:

```bash
bash lab-materials/verify-setup.sh
```

You will see a printout of every component that was configured — tool versions,
environment files, database state, and service health. All items should show ✓.

Example output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          Claude Code Workshop — Setup Receipt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workspace
  ✓  Workspace root looks correct

Tool Versions
  ✓  git          git version 2.51.0
  ✓  Java         openjdk version "21.0.6"  (JAVA_HOME: /usr/lib/jvm/...)
  ✓  Maven        Apache Maven 3.9.9
  ✓  Node.js      v24.14.0
  ✓  npm          v11.9.0
  ✓  psql         psql (PostgreSQL) 18.3

Environment Config
  ✓  backend/.env.local exists
  ✓  frontend/.env.local exists
  ✓  JAVA_HOME path is valid

Database
  ✓  PostgreSQL connection  hrapp@localhost/hrdb
  ✓  aihr_employees  121 rows
  ✓  AIHR_* tables   14 found

Backend Service
  ✓  Backend health endpoint  UP on port 18082

Frontend Service
  ✓  Frontend dev server  UP on port 5182

Build Artefacts
  ✓  Backend JAR  built
  ✓  Frontend dist  built

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓  All checks passed — you are ready for Lab 01
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If any item shows ✗, read Claude Code's earlier output for that step, fix the
issue, and re-run `verify-setup.sh`.

---

## Demo Accounts

Once the app is running, open the frontend in your browser:

- **UI:** `http://127.0.0.1:5182/hr/login`
- **API base:** `http://127.0.0.1:18082/app/hr/api/v1`

Two demo accounts are pre-loaded by the database setup:

- `steven.king` / `password123` — locale `en-US`
- `valeria.cruz` / `password123` — locale `es-MX`, role `HR_SPECIALIST`
  - UI renders in Mexican Spanish; timezone `America/Mexico_City`, currency `MXN`
  - Labs that cover localization use this account

---

## Optional — Access from another machine

If you want to open the frontend from a browser on a different machine while
the app runs on this one, paste this prompt into Claude Code:

```text
I want to access the HR frontend from another machine on the same network.

Update only the minimal frontend host settings needed for cross-machine access.
Do not change database settings or backend config.

My machine hostname or IP for cross-machine access is: <your-hostname-or-ip>
```

Verify the app still loads in a local browser after Claude Code makes the
change.

---

## Success Criteria

- [ ] Claude Code is installed and `claude --help` works
- [ ] Workspace root contains `CLAUDE.md`, `backend/`, `frontend/`, `database/`, `lab-materials/`
- [ ] Setup prompt was pasted and Claude Code completed all phases
- [ ] `bash lab-materials/verify-setup.sh` shows all ✓
- [ ] You can state what to verify before starting Lab 01
