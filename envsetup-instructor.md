# Environment Setup Guide — Instructor Reference

> Pre-workshop setup checklist. Complete this before students arrive.
> Student-facing version: `envsetup-student.md`

---

## Overview

Each student workstation needs:
- Ubuntu 22.04+ (or comparable Debian-based Linux)
- Java 21, Maven 3.9+, Node 20+, npm 10+
- MySQL 8.0 with `hr_db` database, app user, and read-only user
- Claude Code CLI (authenticated)
- Git configured

The student repo lives at `/home/<user>/app/training/` — this single directory contains both the HR app code and all training materials.

---

## 1. System Packages

```bash
sudo apt-get update
sudo apt-get install -y jq \
  git \
  curl \
  wget \
  unzip \
  build-essential \
  make \
  mysql-server \
  mysql-client
```

---

## 2. Java 21

```bash
sudo apt-get install -y openjdk-21-jdk

# Verify
java -version
# Expected: openjdk version "21.x.x"

javac -version
# Expected: javac 21.x.x
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
# Check if already installed
mvn -version

# If not installed:
sudo apt-get install -y maven

# If apt version is too old (< 3.9), install manually:
wget https://downloads.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
tar -xzf apache-maven-3.9.9-bin.tar.gz -C /opt
sudo ln -s /opt/apache-maven-3.9.9 /opt/maven
echo 'export M2_HOME=/opt/maven' >> ~/.bashrc
echo 'export PATH=$M2_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
mvn -version
# Expected: Apache Maven 3.9.x
```

---

## 4. Node.js 20+ and npm 10+

```bash
# Using NodeSource (recommended over apt default which is often too old)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version   # Expected: v20.x.x
npm --version    # Expected: 10.x.x
```

---

## 5. Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code

# Verify
claude --version
```

**Authentication — each student must run:**

```bash
claude
# Follow the OAuth login flow in the browser.
# Students need an Anthropic account with Claude Code access.
```

> **IMPORTANT — Skip `claude init` (CLAUDE.md generation):**
> When students start Claude Code in the `/home/<user>/app/training/` directory for the first time,
> Claude Code may prompt to run `claude init` to generate a CLAUDE.md.
> **Instruct students to skip or decline this.** The workshop's CLAUDE.md is already in place
> at `/home/<user>/app/training/CLAUDE.md` and is the foundation for Lab 1. Letting Claude Code
> auto-generate a new one will pollute the context and undermine the lab exercises.

---

## 6. MySQL 8.0 — Database Setup

### 6a. Secure MySQL installation

```bash
sudo systemctl start mysql
sudo systemctl enable mysql

# Run the security wizard (set root password, remove anonymous users, etc.)
sudo mysql_secure_installation
```

### 6b. Create the application database and user

```bash
sudo mysql -u root -p
```

Run the following SQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS hr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create app user (used by Spring Boot)
CREATE USER IF NOT EXISTS 'hrapp'@'localhost' IDENTIFIED BY 'hrapp_pass';
GRANT ALL PRIVILEGES ON hr_db.* TO 'hrapp'@'localhost';

-- Create read-only user (used by MySQL MCP in Lab 10)
CREATE USER IF NOT EXISTS 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';

FLUSH PRIVILEGES;

-- Verify users
SELECT user, host FROM mysql.user WHERE user = 'hr_readonly';
```

### 6c. Load schema and seed data

```bash
cd /home/<user>/app/training

# Apply schema
mysql -u root -proot123 hr_db < database/schema.sql

# Load seed data
mysql -u root -proot123 hr_db < database/demo.sql
```

> Note: The HR app uses Flyway for migrations. `schema.sql` is a reference DDL snapshot.
> The actual runtime migrations live in `backend/hrapp-service/src/main/resources/db/migration/`.
> Flyway runs automatically on `spring-boot:run` — it will apply all `V*.sql` files to `hr_db`.

---

## 7. HR App Environment File

```bash
cd /home/<user>/app/training
cp .env.example .env
```

Edit `.env`:

```
HR_DB_USER=root
HR_DB_PASS=root123
HR_JWT_SECRET=<generate with: openssl rand -base64 32>

VITE_API_BASE_URL=http://localhost:8080/app/hr/api/v1
VITE_USE_MOCK=true

HR_DB_READONLY_USER=hr_readonly
HR_DB_READONLY_PASS=readonly_pass
```

Generate the JWT secret per student:

```bash
openssl rand -base64 32
```

---

## 8. Git Configuration (per student)

```bash
git config --global user.name "Student Name"
git config --global user.email "student@example.com"

# Verify the HR app git history is intact
cd /home/<user>/app/training
git log --oneline -5
git branch -a   # checkpoint branches should be listed
```

---

## 9. Pre-flight: Verify Checkpoint Branches Exist

```bash
cd /home/<user>/app/training
git branch | grep checkpoint
```

Expected output:
```
  checkpoint/day1-start
  checkpoint/day2-start
  checkpoint/day3-start
  checkpoint/day4-start
```

If missing, they need to be restored from the instructor's reference clone before the workshop.

---

## 10. Instructor Smoke Test

Run this full sequence to confirm each workstation is ready.
See `envsetup-student.md` for the abridged student version.

```bash
# 1. Toolchain
java -version && javac -version && mvn -version && node --version && npm --version && claude --version && mysql --version && git --version && make --version

# 2. MySQL connectivity
mysql -u root -proot123 -e "SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema='hr_db';"
# Expected: table_count >= 10

mysql -u hr_readonly -preadonly_pass -e "SELECT COUNT(*) FROM hr_db.employees;"
# Expected: returns a row count (confirms seed data loaded and read-only user works)

# 3. Backend build (compile only, no tests — fast)
cd /home/<user>/app/training
cd backend && mvn clean compile -q
# Expected: BUILD SUCCESS

# 4. Frontend install + build
cd frontend && npm ci --silent && npm run build
# Expected: no errors, dist/ created

# 5. Claude Code sanity check
cd /home/<user>/app/training
claude --print "What file governs your behavior in this project? Answer in one sentence."
# Expected: References CLAUDE.md

# 6. Confirm no stray CLAUDE.md was generated anywhere unexpected
find /home/<user>/app/training -name "CLAUDE.md" | sort
# Expected: only /home/<user>/app/training/CLAUDE.md
```

---

## Common Issues

| Symptom | Fix |
|---|---|
| `mvn: command not found` after install | `source ~/.bashrc` or open new terminal |
| MySQL `Access denied for user 'root'` | Confirm `root123` password set during `mysql_secure_installation` |
| `HR_DB_USER` not picked up by Spring Boot | Check `.env` is in `/home/<user>/app/training/`, not a sub-directory |
| Frontend build fails with Node version error | Confirm `node --version` is v20+; re-run NodeSource install |
| Claude Code auth loop | Student may need to clear `~/.claude` and re-authenticate |
| `checkpoint/day*` branches missing | Restore from instructor reference clone |
| Flyway errors on first boot | Confirm `hr_db` exists and root credentials match `application.yml` defaults |
| Student ran `claude init` by mistake | Delete the auto-generated `CLAUDE.md`, restore from git: `git checkout CLAUDE.md` |
