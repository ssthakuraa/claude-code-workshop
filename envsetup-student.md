# Lab Environment Setup — Student Guide

> Complete this before Day 1. Takes approximately 20–30 minutes.
> If you get stuck, flag your instructor — do not skip steps.

---

## What You Need

| Tool | Required Version |
|---|---|
| Java (JDK) | 21 |
| Maven | 3.9+ |
| Node.js | 20+ |
| npm | 10+ |
| MySQL | 8.0 |
| Claude Code CLI | latest |
| Git | any recent |
| make | any |

---

## Step 1 — Verify Tools Already Installed

Run this one-liner. Everything should print a version number with no errors:

```bash
java -version && javac -version && mvn -version && node --version && npm --version && mysql --version && git --version && make --version
```

If anything is missing, see the installation section below.

---

## Step 2 — Install Missing Tools

### Java 21

```bash
sudo apt-get update
sudo apt-get install -y openjdk-21-jdk
```

### Maven 3.9+

```bash
sudo apt-get install -y maven
mvn -version   # confirm 3.9+
```

### Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # confirm v20+
```

### Git and make

```bash
sudo apt-get install -y git make jq
```

### MySQL client tools

```bash
sudo apt-get install -y mysql-client
```

---

## Step 3 — Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

**Authenticate:**

```bash
claude
```

Follow the browser login flow. You need an Anthropic account with Claude Code access.

> **Important — do NOT run `claude init`.**
> When you open Claude Code inside the `~/app/training/` project, it may offer to generate a `CLAUDE.md`
> file. **Decline or skip this.** The project already has a `CLAUDE.md` that the labs depend on.
> Generating a new one will break Lab 1 and interfere with subsequent exercises.

---

## Step 4 — Verify Database Access

Your instructor has already created the database and users. Confirm you can connect:

```bash
# App user (read/write)
mysql -u root -proot123 -e "SELECT COUNT(*) FROM hr_db.employees;"

# Read-only user (used in Lab 10 — MySQL MCP)
mysql -u hr_readonly -preadonly_pass -e "SELECT COUNT(*) FROM hr_db.employees;"
```

Both commands should return a number (the employee count from seed data). If either fails, contact your instructor before proceeding.

---

## Step 5 — Environment File

```bash
cd ~/app/training
ls .env
```

The `.env` file should already exist. If it does not:

```bash
cp .env.example .env
```

Then ask your instructor for the `HR_JWT_SECRET` value and fill it in.

---

## Step 6 — Smoke Test

Run each command and confirm the expected result. **Do not move to Day 1 until all pass.**

### Backend compile

```bash
cd ~/app/training
cd backend && mvn clean compile -q
```

Expected: ends with `BUILD SUCCESS`

### Frontend install and build

```bash
cd frontend && npm ci --silent && npm run build
```

Expected: no errors; a `frontend/dist/` directory is created

### Database row counts

```bash
mysql -u root -proot123 -e "
  SELECT table_name, table_rows
  FROM information_schema.tables
  WHERE table_schema = 'hr_db'
  ORDER BY table_name;"
```

Expected: 10+ tables listed with non-zero row counts

### Claude Code project awareness

```bash
cd ~/app/training
claude --print "What file governs your behavior in this project? Answer in one sentence."
```

Expected: Claude references `CLAUDE.md`

### Git checkpoint branches

```bash
cd ~/app/training
git branch | grep checkpoint
```

Expected output (all four lines):
```
  checkpoint/day1-start
  checkpoint/day2-start
  checkpoint/day3-start
  checkpoint/day4-start
```

---

## All Checks Pass?

You are ready. See you in the workshop.

---

## Troubleshooting

**`make backend-build` fails with compiler error**
Confirm `java -version` shows Java 21. If it shows a different version, your `JAVA_HOME` may point to the wrong JDK.

```bash
sudo update-alternatives --config java   # pick Java 21
```

**`make frontend-install` fails**
Confirm `node --version` is v20+. If it shows v18 or lower, re-run the NodeSource install from Step 2.

**MySQL `Access denied`**
Your instructor needs to verify the database user was created. Do not attempt to create users yourself — you may not have the required permissions.

**`checkpoint/*` branches missing**
Do not create them yourself. Contact your instructor to restore from the reference clone.

**Claude Code keeps asking to generate CLAUDE.md**
Type `n` or press Escape to skip. If it already generated one, run:

```bash
cd ~/app/training
git checkout CLAUDE.md
```

**Claude Code login not persisting**
Make sure you completed the full browser OAuth flow. Try:

```bash
claude auth status
```

If it says not authenticated, run `claude` again and complete login.
