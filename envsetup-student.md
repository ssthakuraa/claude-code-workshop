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
| MySQL client | 8.0 |
| Claude Code CLI | latest |
| Git | any recent |
| make | any |
| jq | any |

---

## Step 1 — Verify Tools Already Installed

```bash
java -version && mvn -version && node --version && npm --version && mysql --version && git --version && jq --version
```

Everything should print a version. If anything is missing, install it in Step 2.

---

## Step 2 — Install Missing Tools

### Java 21

```bash
sudo apt-get update
sudo apt-get install -y openjdk-21-jdk
java -version   # confirm 21
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

### Git, make, jq

```bash
sudo apt-get install -y git make jq
```

> `jq` is required by Lab 5 hooks. Do not skip it.

### MySQL client

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
# Follow the browser login flow.
# You need an Anthropic account with Claude Code access.
```

> **Important — do NOT run `claude init`.**
> When you open Claude Code in `~/app/training/`, it may offer to generate a `CLAUDE.md`.
> **Decline.** The project already has a `CLAUDE.md` that Lab 1 depends on.
> If it already generated one: `git checkout CLAUDE.md`

---

## Step 4 — Environment File

```bash
cd ~/app/training
git checkout checkpoint/day1-start
cp .env.example .env

# Fill in the JWT secret
sed -i "s|HR_JWT_SECRET=.*|HR_JWT_SECRET=$(openssl rand -base64 32)|" .env
cat .env   # verify it looks right
```

Your `.env` should look like:

```
HR_DB_USER=hrapp
HR_DB_PASS=hrapp_pass
HR_JWT_SECRET=<a long base64 string>

VITE_API_BASE_URL=http://localhost:8080/app/hr/api/v1
VITE_USE_MOCK=true

HR_DB_READONLY_USER=hr_readonly
HR_DB_READONLY_PASS=readonly_pass
```

This file is how Claude Code knows your database credentials during labs.

---

## Step 5 — Verify Database Access

Your instructor has already created the database users. Confirm you can connect:

```bash
# App user
mysql -u hrapp -phrapp_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;" 2>/dev/null

# Read-only user
mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;" 2>/dev/null
```

Both should return a row count. If either fails, contact your instructor.

---

## Step 6 — Smoke Test

Run each check. **Do not start Day 1 until all pass.**

### Backend compile

```bash
cd ~/app/training
git checkout checkpoint/day1-start -q
cd backend && mvn clean compile -q && echo "Backend: OK"
```

Expected: `Backend: OK`

### Frontend build

```bash
cd ~/app/training
git checkout checkpoint/day3-start -q
cd frontend && npm ci --silent && npm run build 2>&1 | tail -2
```

Expected: `✓ built in ...`

### Claude Code project awareness

```bash
cd ~/app/training
git checkout checkpoint/day1-start -q
claude --print "What file governs your behavior in this project? One sentence."
```

Expected: Claude references `CLAUDE.md`

### Checkpoint branches

```bash
cd ~/app/training && git checkout main -q
git branch | grep checkpoint
```

Expected — all four lines:
```
  checkpoint/day1-start
  checkpoint/day2-start
  checkpoint/day3-start
  checkpoint/day4-start
```

---

## All Checks Pass?

Return to main and you are ready:

```bash
cd ~/app/training && git checkout main -q
```

---

## Troubleshooting

**Backend compile fails — wrong Java version**
```bash
sudo update-alternatives --config java   # select Java 21
```

**Frontend build fails — wrong Node version**
Re-run the NodeSource install from Step 2.

**MySQL access denied**
Your instructor needs to verify the `hrapp` user was created. Do not attempt to create it yourself.

**Claude Code login not persisting**
```bash
claude auth logout && claude
```

**`jq: command not found` during a lab hook**
```bash
sudo apt-get install -y jq
```

**Claude Code generated a CLAUDE.md**
```bash
git checkout CLAUDE.md
```
