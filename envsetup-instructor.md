# Environment Setup Guide — Instructor Reference

> Pre-workshop setup checklist. Complete this before students arrive.
> Student-facing version: `envsetup-student.md`

---

## Overview

Each student workstation needs:
- Ubuntu 22.04+ (or comparable Debian-based Linux)
- Java 21, Maven 3.9+, Node 20+, npm 10+
- MySQL 8.0 with `hr_db` database, `hrapp` app user, and `hr_readonly` read-only user
- Claude Code CLI (authenticated)
- Git configured

The student repo lives at `/home/<user>/app/training/` — this single directory contains both the HR app code (on checkpoint branches) and all training materials (on main).

---

## 1. System Packages

```bash
sudo apt-get update
sudo apt-get install -y \
  git \
  curl \
  wget \
  unzip \
  build-essential \
  make \
  jq \
  mysql-server \
  mysql-client
```

> `jq` is required by the Lab 5 hooks — do not skip it.

---

## 2. Java 21

```bash
sudo apt-get install -y openjdk-21-jdk

java -version    # Expected: openjdk version "21.x.x"
javac -version   # Expected: javac 21.x.x
```

Set `JAVA_HOME` if not already set:

```bash
echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 3. Maven 3.9+

```bash
sudo apt-get install -y maven
mvn -version   # Expected: Apache Maven 3.9.x
```

If the apt version is older than 3.9:

```bash
wget https://downloads.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
tar -xzf apache-maven-3.9.9-bin.tar.gz -C /opt
sudo ln -s /opt/apache-maven-3.9.9 /opt/maven
echo 'export M2_HOME=/opt/maven' >> ~/.bashrc
echo 'export PATH=$M2_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 4. Node.js 20+ and npm 10+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version   # Expected: v20.x.x
npm --version    # Expected: 10.x.x
```

---

## 5. Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

**Authentication — each student must run:**

```bash
claude
# Follow the OAuth login flow in the browser.
# Students need an Anthropic account with Claude Code access.
```

> **IMPORTANT — Skip `claude init`:**
> When students first open Claude Code in `~/app/training/`, it may offer to generate a `CLAUDE.md`.
> **Instruct students to decline.** The workshop's `CLAUDE.md` is already on the checkpoint branches
> and is the foundation for Lab 1. An auto-generated one will break the lab.

---

## 6. MySQL 8.0 — Database Setup

**One block. Run it once. Everything is created in the correct order.**

```bash
sudo systemctl start mysql
sudo systemctl enable mysql

sudo mysql << 'SQL'
-- Database
CREATE DATABASE IF NOT EXISTS hr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- App user (used by Spring Boot — credentials stored in .env)
CREATE USER IF NOT EXISTS 'hrapp'@'localhost' IDENTIFIED BY 'hrapp_pass';
GRANT ALL PRIVILEGES ON hr_db.* TO 'hrapp'@'localhost';

-- Read-only user (used by MySQL MCP in Lab 10)
-- Granted for both socket (@localhost) and TCP (@127.0.0.1) — MCP connects via TCP
CREATE USER IF NOT EXISTS 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';
CREATE USER IF NOT EXISTS 'hr_readonly'@'127.0.0.1' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'127.0.0.1';

FLUSH PRIVILEGES;

-- Verify
SELECT user, host FROM mysql.user WHERE user IN ('hrapp', 'hr_readonly') ORDER BY user, host;
SQL
```

Expected output — 3 rows:

```
+-----------+-----------+
| user      | host      |
+-----------+-----------+
| hr_readonly | 127.0.0.1 |
| hr_readonly | localhost |
| hrapp     | localhost |
+-----------+-----------+
```

### Load seed data

```bash
cd /home/<user>/app/training
git checkout checkpoint/day4-start

# Seed via the app user (no password warning suppressed with -s flag pattern)
mysql -u hrapp -phrapp_pass hr_db < database/demo.sql 2>/dev/null
echo "Exit: $?"   # Expected: 0
```

> Note: `schema.sql` is a read-only DDL reference. The actual schema is applied automatically
> by Flyway when the Spring Boot app first starts — do not manually run `schema.sql`.

---

## 7. Environment File

```bash
cd /home/<user>/app/training
git checkout checkpoint/day1-start
cp .env.example .env
```

Fill in the JWT secret:

```bash
# Generate a secret and write it into .env in one command
sed -i "s|HR_JWT_SECRET=.*|HR_JWT_SECRET=$(openssl rand -base64 32)|" .env
cat .env   # Verify all values look correct
```

The `.env` file is how Claude Code knows your DB credentials — it reads this file
when asked to run queries or verify data during labs.

---

## 8. Git Configuration (per student)

```bash
git config --global user.name "Student Name"
git config --global user.email "student@example.com"
```

---

## 9. Verify Checkpoint Branches Exist

```bash
cd /home/<user>/app/training
git branch | grep checkpoint
```

Expected:
```
  checkpoint/day1-start
  checkpoint/day2-start
  checkpoint/day3-start
  checkpoint/day4-start
```

---

## 10. Instructor Smoke Test

```bash
cd /home/<user>/app/training

# 1. Toolchain versions
java -version 2>&1 | head -1
mvn -version | head -1
node --version && npm --version
claude --version
mysql --version | cut -d' ' -f1-5

# 2. DB connectivity — app user
mysql -u hrapp -phrapp_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;" 2>/dev/null
# Expected: a number (e.g. 20)

# 3. DB connectivity — read-only user (socket)
mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;" 2>/dev/null
# Expected: same number

# 4. DB connectivity — read-only user (TCP — same path MCP uses)
mysql -h 127.0.0.1 -u hr_readonly -preadonly_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;" 2>/dev/null
# Expected: same number

# 5. Backend compile
git checkout checkpoint/day1-start -q
cd backend && mvn clean compile -q && echo "Backend: OK" && cd ..

# 6. Frontend build (day3-start has frontend)
git checkout checkpoint/day3-start -q
cd frontend && npm ci --silent && npm run build 2>&1 | tail -2 && cd ..

# 7. Claude Code project awareness
git checkout checkpoint/day1-start -q
claude --print "What file governs your behavior in this project? One sentence." 2>/dev/null
# Expected: references CLAUDE.md

git checkout main -q
echo "Smoke test complete."
```

---

## Common Issues

| Symptom | Fix |
|---|---|
| `mvn: command not found` after install | `source ~/.bashrc` or open a new terminal |
| MySQL `Access denied for 'hrapp'` | Re-run the SQL block in step 6; confirm `FLUSH PRIVILEGES` ran |
| `jq: command not found` during Lab 5 hooks | `sudo apt-get install -y jq` |
| Frontend build fails with Node version error | Confirm `node --version` is v20+; re-run NodeSource install |
| Claude Code auth loop | `claude auth logout` then `claude` to re-authenticate |
| `checkpoint/day*` branches missing | Restore from instructor reference clone |
| Flyway errors on first Spring Boot start | Confirm `hr_db` exists and `hrapp` user has ALL PRIVILEGES |
| Student ran `claude init` by mistake | `git checkout CLAUDE.md` to restore the correct file |
