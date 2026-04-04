-- MySQL Compatible Schema
-- Converted from Oracle HR schema

USE hrdb;

CREATE TABLE regions (
    region_id INT NOT NULL,
    region_name VARCHAR(25),
    PRIMARY KEY (region_id)
) COMMENT = 'Regions table that contains region numbers and names. References with the Countries table.';

CREATE TABLE countries (
    country_id CHAR(2) NOT NULL,
    country_name VARCHAR(60),
    region_id INT,
    PRIMARY KEY (country_id),
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
) COMMENT = 'Country table. References with locations table.';

CREATE TABLE locations (
    location_id INT NOT NULL,
    street_address VARCHAR(40),
    postal_code VARCHAR(12),
    city VARCHAR(30) NOT NULL,
    state_province VARCHAR(25),
    country_id CHAR(2),
    PRIMARY KEY (location_id),
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
) COMMENT = 'Locations table that contains specific address of a specific office, warehouse, and/or production site of a company.';

CREATE TABLE departments (
    department_id INT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    manager_id INT,
    location_id INT,
    PRIMARY KEY (department_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
) COMMENT = 'Departments table that shows details of departments where employees work.';

CREATE TABLE jobs (
    job_id VARCHAR(10) NOT NULL,
    job_title VARCHAR(35) NOT NULL,
    min_salary INT,
    max_salary INT,
    PRIMARY KEY (job_id)
) COMMENT = 'Jobs table with job titles and salary ranges. References with employees and job_history table.';

CREATE TABLE employees (
    employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(20),
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    job_id VARCHAR(10) NOT NULL,
    salary DECIMAL(8,2),
    commission_pct DECIMAL(2,2),
    manager_id INT,
    department_id INT,
    PRIMARY KEY (employee_id),
    UNIQUE KEY uk_email (email),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id),
    CHECK (salary > 0)
) COMMENT = 'Employees table. References with departments, jobs, job_history tables. Contains a self reference.';

ALTER TABLE departments
ADD CONSTRAINT dept_mgr_fk FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

CREATE TABLE job_history (
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    job_id VARCHAR(10) NOT NULL,
    department_id INT,
    PRIMARY KEY (employee_id, start_date),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CHECK (end_date IS NULL OR end_date > start_date)
) COMMENT = 'Table that stores job history of the employees.';

-- ========================
-- Extended tables (RBAC, Audit, Preferences, Documents, Notifications)
-- ========================

CREATE TABLE hr_idempotency_keys (
    idempotency_key VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    response_status INT NOT NULL,
    response_body JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (idempotency_key)
) COMMENT = 'Idempotency keys for hire/create endpoints to prevent duplicate requests.';

CREATE TABLE hr_roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (role_id),
    UNIQUE KEY uk_role_name (role_name)
) COMMENT = 'RBAC roles: ROLE_ADMIN, ROLE_HR_SPECIALIST, ROLE_MANAGER, ROLE_EMPLOYEE.';

CREATE TABLE hr_users (
    user_id INT NOT NULL AUTO_INCREMENT,
    employee_id INT NOT NULL,
    username VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_user_employee (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
) COMMENT = 'Authentication credentials linked to employees.';

CREATE TABLE hr_user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES hr_users(user_id),
    FOREIGN KEY (role_id) REFERENCES hr_roles(role_id)
) COMMENT = 'Many-to-many mapping between users and roles.';

CREATE TABLE hr_user_preferences (
    preference_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    date_format VARCHAR(20) NOT NULL DEFAULT 'YYYY-MM-DD',
    currency_code VARCHAR(3) NOT NULL DEFAULT 'USD',
    number_format VARCHAR(20) NOT NULL DEFAULT '1,000.00',
    PRIMARY KEY (preference_id),
    UNIQUE KEY uk_pref_user (user_id),
    FOREIGN KEY (user_id) REFERENCES hr_users(user_id)
) COMMENT = 'User-specific NLS/MLS settings (language, timezone, currency, formatting).';

CREATE TABLE hr_audit_logs (
    audit_id BIGINT NOT NULL AUTO_INCREMENT,
    table_name VARCHAR(60) NOT NULL,
    record_id VARCHAR(60) NOT NULL,
    action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    old_value JSON,
    new_value JSON,
    changed_by INT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (audit_id),
    FOREIGN KEY (changed_by) REFERENCES hr_users(user_id)
) COMMENT = 'Audit trail capturing all changes to critical tables.';

CREATE TABLE hr_employee_documents (
    document_id INT NOT NULL AUTO_INCREMENT,
    employee_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_category VARCHAR(50) NOT NULL COMMENT 'e.g. Contract, ID, Certificate, Payslip, Other',
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by INT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (document_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (uploaded_by) REFERENCES hr_users(user_id)
) COMMENT = 'Digital documents attached to employee profiles.';

CREATE TABLE hr_notifications (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    recipient_user_id INT NOT NULL,
    notification_type ENUM('PROBATION_ALERT','CONTRACT_EXPIRY','ACTION_COMPLETE','SYSTEM') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_table VARCHAR(60),
    reference_id VARCHAR(60),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id),
    FOREIGN KEY (recipient_user_id) REFERENCES hr_users(user_id)
) COMMENT = 'System notifications and alerts for users.';

-- Add soft-delete and employment metadata to employees
ALTER TABLE employees
    ADD COLUMN employment_status ENUM('ACTIVE','ON_LEAVE','TERMINATED','PROBATION') NOT NULL DEFAULT 'ACTIVE' AFTER department_id,
    ADD COLUMN employment_type ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERN') NOT NULL DEFAULT 'FULL_TIME' AFTER employment_status,
    ADD COLUMN contract_end_date DATE NULL AFTER employment_type,
    ADD COLUMN deleted_at TIMESTAMP NULL AFTER contract_end_date;

-- Add soft-delete and parent hierarchy to departments
ALTER TABLE departments
    ADD COLUMN parent_department_id INT NULL AFTER location_id,
    ADD COLUMN deleted_at TIMESTAMP NULL AFTER parent_department_id,
    ADD CONSTRAINT dept_parent_fk FOREIGN KEY (parent_department_id) REFERENCES departments(department_id);

-- Indexes for performance optimization
CREATE INDEX emp_department_ix ON employees(department_id);
CREATE INDEX emp_job_ix ON employees(job_id);
CREATE INDEX emp_manager_ix ON employees(manager_id);
CREATE INDEX emp_name_ix ON employees(last_name, first_name);
CREATE INDEX dept_location_ix ON departments(location_id);
CREATE INDEX jhist_job_ix ON job_history(job_id);
CREATE INDEX jhist_employee_ix ON job_history(employee_id);
CREATE INDEX jhist_department_ix ON job_history(department_id);
CREATE INDEX loc_city_ix ON locations(city);
CREATE INDEX loc_state_province_ix ON locations(state_province);
CREATE INDEX loc_country_ix ON locations(country_id);
CREATE INDEX audit_table_ix ON hr_audit_logs(table_name, record_id);
CREATE INDEX audit_changed_at_ix ON hr_audit_logs(changed_at);
CREATE INDEX notif_recipient_ix ON hr_notifications(recipient_user_id, is_read);
CREATE INDEX doc_employee_ix ON hr_employee_documents(employee_id);
CREATE INDEX emp_status_ix ON employees(employment_status);
CREATE INDEX emp_deleted_ix ON employees(deleted_at);
