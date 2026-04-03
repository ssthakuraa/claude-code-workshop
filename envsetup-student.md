# Lab Environment Setup — Student Guide

> Complete this before Day 1. Takes approximately 60–90 minutes.
> This training is fully self-guided — there is no instructor.

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
> When you open Claude Code in the project directory, it may offer to generate a `CLAUDE.md`.
> **Decline.** The project already has a `CLAUDE.md` that Lab 1 depends on.
> If it already generated one: `git checkout CLAUDE.md`

---

## Step 4 — MySQL Root Access

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

## Step 5 — Create Database and Users

```bash
# Use the root connection method that works for you from Step 4.
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

## Step 6 — Clone the Repository and Load Schema

```bash
git clone https://github.com/ssthakuraa/claudetraining.git
cd claudetraining
git checkout checkpoint/day1-start
```

### Load schema and demo data

The `database/schema.sql` file contains `USE hrdb;` (missing the underscore). Fix and load:

```bash
sed 's/USE hrdb;/USE hr_db;/' database/schema.sql | mysql -u hrapp -phrapp_pass
sed 's/USE hrdb;/USE hr_db;/' database/demo.sql | mysql -u hrapp -phrapp_pass
```

> These commands use the shell to fix the `USE` statement before piping to MySQL. The files in git still contain `USE hrdb;` — this is intentional so the fix remains a known issue for Lab exercises.

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

## Step 7 — Set Up Application Users (Login)

The HR app uses **Argon2id** password hashing. Application users live in `hr_users` table.

You need at least one **admin** account to log in to the frontend for Labs 9–12.

### Generate password hashes and create users

```bash
# Make sure you're in the project directory
pwd   # should be .../claudetraining
cp .env.example .env
sed -i "s|HR_JWT_SECRET=.*|HR_JWT_SECRET=$(openssl rand -base64 32)|" .env
```

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
((SELECT id FROM hr_users WHERE username = 'steven.king'), 1),
((SELECT id FROM hr_users WHERE username = 'admin'), 1);

Verify with: SELECT u.username, r.role_name
FROM hr_users u JOIN hr_user_roles ur ON u.id = ur.user_id JOIN hr_roles r ON ur.role_id = r.role_id;
```

Claude Code will hash the password and run the SQL via the MySQL shell.

### Manual fallback (if you don't have Claude Code yet)

```bash
# Quick Java program to generate Argon2 hash
mkdir -p /tmp/hashgen/src/main/java
cat > /tmp/hashgen/src/main/java/HashGen.java <<'JAVA'
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
public class HashGen {
    public static void main(String[] args) {
        var enc = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        System.out.println(enc.encode("password123"));
    }
}
JAVA

# Generate and capture hash
HASH=$(cd /tmp/hashgen && mvn -q compile exec:java \
  -Dexec.mainClass=HashGen \
  -Dexecution.classpath.scope=compile 2>/dev/null || \
  cd /tmp/hashgen && mvn -q compile java:run -DmainClass=HashGen 2>/dev/null)
```

Insert users:

```bash
mysql -u hrapp -phrapp_pass hr_db <<SQL
INSERT INTO hr_users (username, password_hash, employee_id, is_active) VALUES
('steven.king', '${HASH}', 100, 1),
('admin', '${HASH}', NULL, 1);

INSERT INTO hr_user_roles (user_id, role_id) VALUES
((SELECT id FROM hr_users WHERE username = 'steven.king'), 1),
((SELECT id FROM hr_users WHERE username = 'admin'), 1);
SQL
```

Verify users exist:

```bash
mysql -u hrapp -phrapp_pass hr_db -e "
SELECT u.username, u.employee_id, r.role_name
FROM hr_users u
JOIN hr_user_roles ur ON u.id = ur.user_id
JOIN hr_roles r ON ur.role_id = r.role_id;"
```

You should see steven.king and admin with ROLE_ADMIN.

---

## Step 8 — Environment File

```bash
cd claudetraining
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

---

## Step 9 — Verify Database Access

```bash
# App user
mysql -u hrapp -phrapp_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;"

# Read-only user
mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT COUNT(*) AS employees FROM employees;"
```

Both should return a row count ~190+.

---

## Step 10 — Smoke Test

Run each check. **Do not start Day 1 until all pass.**

### Backend compile

```bash
cd claudetraining
git checkout checkpoint/day1-start -q
cd backend && mvn clean compile -q && echo "Backend: OK"
```

Expected: `Backend: OK`

### Frontend build

```bash
cd claudetraining
git checkout checkpoint/day3-start -q
cd frontend && npm ci --silent && npm run build 2>&1 | tail -2
```

Expected: `✓ built in ...`

### Claude Code project awareness

```bash
cd claudetraining
git checkout checkpoint/day1-start -q
claude --print "What file governs your behavior in this project? One sentence."
```

Expected: Claude references `CLAUDE.md`

### Checkpoint branches

```bash
cd claudetraining && git checkout main -q
git branch | grep checkpoint
```

Expected — all four lines:
```
  checkpoint/day1-start
  checkpoint/day2-start
  checkpoint/day3-start
  checkpoint/day4-start
```

### Database Access

```bash
mysql -u hrapp -phrapp_pass hr_db -e "SELECT COUNT(*) AS cnt FROM employees;"
mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT COUNT(*) AS cnt FROM employees;"
```

Both should return a count of 190+.

### Application Users

```bash
mysql -u hrapp -phrapp_pass hr_db -e "SELECT COUNT(*) AS cnt FROM hr_users;"
```

Should be >= 2 (steven.king and admin).

---

## All Checks Pass?

Return to main and you are ready for Day 1:

```bash
cd claudetraining && git checkout main
```

---

## Troubleshooting

**Backend compile fails — wrong Java version**
```bash
sudo update-alternatives --config java   # select Java 21
```

**Frontend build fails — wrong Node version**
Re-run the NodeSource install from Step 2.

**MySQL access denied for hrapp**
Re-create the user (Step 5). Check you ran `FLUSH PRIVILEGES;`.

**MySQL access denied for root**
Re-run Step 4 (MySQL root access).

**MySQL client says "Can't connect to local MySQL server through socket"**
```bash
sudo systemctl status mysql   # is it running?
sudo systemctl start mysql    # start it if stopped
```

**Claude Code login not persisting**
```bash
claude auth logout && claude
```

**`jq: command not found` during a lab hook**
```bash
sudo apt-get install -y jq
```

**Claude Code generated a CLAUDE.md — do not let it**
```bash
git checkout CLAUDE.md
```

**Cannot log in to frontend — no admin user**
Run Step 7. Check `mysql -u hrapp -phrapp_pass hr_db -e "SELECT * FROM hr_users;"` to confirm users exist.

**Schema says `USE hrdb` instead of `USE hr_db`**
```bash
sed -i 's/USE hrdb;/USE hr_db;/' database/schema.sql
sed -i 's/USE hrdb;/USE hr_db;/' database/demo.sql
# Reload
mysql -u hrapp -phrapp_pass -e "DROP DATABASE hr_db; CREATE DATABASE hr_db;"
sed 's/USE hrdb;/USE hr_db;/' database/schema.sql | mysql -u hrapp -phrapp_pass
sed 's/USE hrdb;/USE hr_db;/' database/demo.sql | mysql -u hrapp -phrapp_pass
```
