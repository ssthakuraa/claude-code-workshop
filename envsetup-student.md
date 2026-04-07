# Lab Environment Setup — Student Guide

> Complete this before Day 1. Takes approximately 60–90 minutes.
> This training is fully self-guided — there is no instructor.
> This guide assumes
Bash as the default shell. Verify your current shell by running echo $0; if the output shows another shell (e.g., zsh or csh), switch by entering bash and then run echo $0 again to confirm. If you choose to remain on your default shell, you may need to adjust command syntax accordingly.

---

## What You Need

| Tool | Required Version |
|---|---|
| Java (JDK) | 21 |
| Maven | 3.9+ |
| Node.js | 20+ |
| npm | 10+ |
| MySQL Server | 8.0 |
| MySQL client | 8.0 (included with Server) |
| Claude Code CLI | latest |
| Git | any recent |
| make | any |
| jq | any |
| curl | any |

---

## Step 1 — Prepare Directory and Verify Git

### Create Scratch Directory

The lab uses `/scratch` as a convenient location to clone the lab. Create it and set appropriate permissions:

```bash
sudo mkdir -p /scratch
sudo chmod 777 /scratch
cd /scratch
pwd  # Should output: /scratch
```

You'll clone the repository into this directory and the the application and the lab material witll be staged in the directory `/scratch/claude-code-workshop` and this direcotory will be referred to as workspace root or workspace top.

### Verify Git is Installed

```bash
git --version
```

Expected output: `git version x.x.x`

**If git is NOT installed:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y git

# Verify
git --version
```

**If git IS installed:** You're ready to clone the lab repo

git clone https://github.com/ssthakuraa/claude-code-workshop.git
cd claude-code-workshop

---

## Step 2 — Verify All Other Tools

From `/scratch`, verify all required tools:

```bash
java -version && mvn -version && node --version && npm --version && mysql --version && jq --version
```

Everything should print a version. If anything is missing, install it in Step 3.

---

## Step 3 — Install Missing Tools

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

### MySQL Server and client

```bash
# Install MySQL Server
sudo apt-get update
# Use the official MySQL APT repo for 8.0 (Ubuntu 25+ may not ship 8.0 in repos):
sudo apt-get install -y mysql-server mysql-client

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify
mysql --version
```

> On Ubuntu 25+, if `mysql-server` is unavailable in apt, install from [MySQL APT Repository](https://dev.mysql.com/downloads/repo/apt/).

---

## Step 4 — Claude Code CLI
> Change directory to workspace top, in this example /scratch/claude-code-workshop if you cloned the directory in /scratch

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
> When you open Claude Code in the project directory, it may offer to generate a `CLAUDE.md`.
> **Decline.** The project already has a version of `CLAUDE.md` that Lab 1 depends on. if you already did or have it from prior installatin, Lab 1 has instruction to fix this.
---

## Step 5 — MySQL Root Access

On Ubuntu, MySQL root uses `auth_socket` by default. Test:

```bash
sudo mysql -u root -e "SELECT 1;"
```

If this works (returns `1`), you can create the application users below.

If it fails with "Access denied", reset root password:

```bash
# Stop MySQL, start without grant tables, set a password, then restart normally:
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
sleep 3
sudo mysql -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123'; FLUSH PRIVILEGES;"
sudo mysqladmin shutdown
sudo systemctl start mysql
# Now connect:
mysql -u root -proot123 -e "SELECT 1;"
```

> For the remainder of this guide, if root uses `auth_socket`, prefix commands with `sudo`. If a password was set, use `mysql -u root -proot123`.

---

## Step 6 — Create Database and Users

```bash
# Use the root connection method that works for you from Step 5.
# If auth_socket: prefix with sudo
# If password: use mysql -u root -proot123

sudo mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS hr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'hrapp'@'localhost' IDENTIFIED BY 'hrapp_pass';
CREATE USER IF NOT EXISTS 'hrapp'@'127.0.0.1' IDENTIFIED BY 'hrapp_pass';

CREATE USER IF NOT EXISTS 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
CREATE USER IF NOT EXISTS 'hr_readonly'@'127.0.0.1' IDENTIFIED BY 'readonly_pass';

GRANT ALL PRIVILEGES ON hr_db.* TO 'hrapp'@'localhost';
GRANT ALL PRIVILEGES ON hr_db.* TO 'hrapp'@'127.0.0.1';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'127.0.0.1';

FLUSH PRIVILEGES;
SQL
```

Verify both users can connect:

```bash
mysql -u hrapp -phrapp_pass hr_db -e "SELECT 'app user OK';"
mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT 'readonly user OK';"
```

Both should print `OK`.

---

## Step 7 — Load Schema

> Ensure youi are in the workspace top, you should memorize this point as below instruciton use relative path

### Load schema and demo data

```bash
mysql -u hrapp -phrapp_pass < database/schema.sql
mysql -u hrapp -phrapp_pass < database/demo.sql
```

### Verify data loaded

```bash
mysql -u hrapp -phrapp_pass hr_db -e "
SELECT 'regions' as tbl, COUNT(*) as cnt FROM regions
UNION ALL SELECT 'countries', COUNT(*) FROM countries
UNION ALL SELECT 'locations', COUNT(*) FROM locations
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'job_history', COUNT(*) FROM job_history;"
```

Expected counts: regions: 4, countries: 25, locations: 28+, departments: 27+, jobs: 19, employees: 190+.

---
## Step 8 — Environment File

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

---

## Step 9 — Set Up Application Users (Login)

The HR app uses **Argon2id** password hashing. Application users live in `hr_users` table.

You need at least one **admin** account to log in to the frontend for Labs 9–12.

### Generate password hashes and create users

Start a Claude Code session in the project and ask:

```
I need to create admin users for the HR app.

The app uses Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8().
Hash the password "password123" with this encoder.

Then run these SQL commands as the hrapp user:

INSERT INTO hr_users (username, password_hash, employee_id, is_active) VALUES
('steven.king', '<ARGON2_HASH>', 100, 1),
('admin', '<ARGON2_HASH>', NULL, 1);

INSERT INTO hr_user_roles (user_id, role_id) VALUES
((SELECT user_id FROM hr_users WHERE username = 'steven.king'), 1),
((SELECT user_id FROM hr_users WHERE username = 'admin'), 1);

Verify with: SELECT u.username, r.role_name
FROM hr_users u JOIN hr_user_roles ur ON u.user_id = ur.user_id JOIN hr_roles r ON ur.role_id = r.role_id;
```

Claude Code will hash the password and run the SQL via the MySQL shell.

Verify users exist:

```bash
mysql -u hrapp -phrapp_pass hr_db -e "
SELECT u.username, u.employee_id, r.role_name
FROM hr_users u
JOIN hr_user_roles ur ON u.user_id = ur.user_id
JOIN hr_roles r ON ur.role_id = r.role_id;"
```

You should see steven.king and admin with ROLE_ADMIN.

---


## Step 10 — Build Backend and Frontend

Run each check. **Do not start Day 1 until all pass.**

### Backend compile

```bash
> cd to your workspace top akd project root directory
cd backend && mvn clean compile -q && echo "Backend: OK"
```

Expected: `Backend: OK`

### Frontend build

```bash
cd ../frontend && npm ci --silent && npm run build 2>&1 | tail -2
```

Expected: `✓ built in ...`

### Claude Code project awareness

```bash
cd claude-code-workshop
claude --print "What file governs your behavior in this project? One sentence."
```

Expected: Claude references `CLAUDE.md`


## Step 11 — Deploy and Smoke test of the backend and front end : Convenience Scripts

> **Important:** All commands in this step assume you are in the **workspace root directory** — the directory that contains `backend/`, `frontend/`, and `scripts/`. This is the directory you `cd` into after cloning the repository.

For example, if you cloned to `/scratch/claude-code-workshop`, that is your workspace root:

```bash
cd /scratch/claude-code-workshop   # workspace root
pwd  # should show the directory containing backend/, frontend/, scripts/
ls   # should list these directories
```

### Start Application

From the workspace root, run:

```bash
bash scripts/startApp.sh
```

This script:
- Ensures the database is running
- Starts the backend Spring Boot service (port 8080)
- Starts the frontend development server (port 5173) 
- Waits for both services to be ready
- Reports status and URLs

### Verification (Recommended even when using scripts)

After starting the application, verify everything is working:

# 1. Check backend health (should return {"status":"UP"})
curl -s http://localhost:8080/actuator/health | jq '.status'

# 2. Check API docs are accessible
curl -s http://localhost:8080/app/hr/api-docs | jq '.info.version'

# 3. Login and get a token
TOKEN=$(curl -s -X POST http://localhost:8080/app/hr/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"steven.king","password":"password123"}' | jq -r '.data.token')
echo "Token: ${TOKEN:0:30}..."

# 4. Test a protected endpoint (departments should return ~27+)
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/app/hr/api/v1/departments" | jq '.data | length'

# 5. Check frontend is serving HTML
curl -s http://localhost:5173 | head -5

All checks should return valid data without errors.

# 6. Optionally you can check from the broser of your choice by navigating to the url http://localhost:5173, login user: steven.king password:password123

---
### Stop Application

```bash
bash scripts/stopApp.sh
```

This script:
- Stops the backend Spring Boot service
- Stops the frontend development server


## Step 13 — Manual Control

If you prefer to start and stop services manually, follow these exact steps from the **workspace root** directory.

### Start Backend

```bash
cd backend
nohup mvn spring-boot:run -pl hrapp-service > ../backend.log 2>&1 &
```

Backend starts on http://localhost:8080/app/hr/api/v1/

### Start Frontend

```bash
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
```

Frontend dev server starts on http://localhost:5173

### Verification (Same as script)

Run the verification commands from Step 12 above to confirm both services are working.

### Stop/Shutdown (Manual)

To stop the running services:

```bash
# Stop backend
pkill -f "hrapp-service"

# Stop frontend
pkill -f "vite"

# Verify no processes remain
ps aux | grep -E "(hrapp-service|vite)" | grep -v grep
```

If `pkill` doesn't work, find the PIDs and kill them:

```bash
# Find backend PID
pgrep -f "hrapp-service"
# Then: kill <PID>

# Find frontend PID
pgrep -f "vite"
# Then: kill <PID>
```

You can also use: `kill $(pgrep -f "hrapp-service")` and `kill $(pgrep -f "vite")`

---

## All Checks Pass?

You are ready for Day 1. Open `labs/lab-01-claudemd.md` and begin.

---

## Troubleshooting (deployment/runtime)

**Backend fails to start — port already in use**
```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

**Frontend dev server fails — port already in use**
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Backend logs show database connection errors**
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env` file
- Test connection: `mysql -u hrapp -phrapp_pass hr_db`

**Frontend build fails — missing dependencies**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm ci --silent
npm run build
```

**API calls return 401 Unauthorized**
- Verify you are sending the JWT token in the `Authorization: Bearer <token>` header
- Ensure `.env` has the correct `HR_JWT_SECRET`
- Check that the user exists in `hr_users` table and is active

**CORS errors in browser console**
The backend CORS configuration allows `http://localhost:5173` (dev) and the backend itself. If you're using different ports, update `application.yml`:
```yaml
hr:
  security:
    cors-origins: http://localhost:5173
```

