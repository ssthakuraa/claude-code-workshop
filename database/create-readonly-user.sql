-- create-readonly-user.sql
-- Creates a read-only MySQL user for the MySQL MCP server.
-- Run this once as root after the database is created:
--   mysql -u root -p hr_db < database/create-readonly-user.sql

CREATE USER IF NOT EXISTS 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';
FLUSH PRIVILEGES;

-- Verify:
-- SHOW GRANTS FOR 'hr_readonly'@'localhost';
