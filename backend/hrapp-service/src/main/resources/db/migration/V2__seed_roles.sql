-- V2: Seed RBAC Roles
INSERT INTO hr_roles (role_name, description) VALUES
    ('ROLE_ADMIN',         'Full system access — user management, all CRUD, audit logs'),
    ('ROLE_HR_SPECIALIST', 'HR operations — hire, promote, transfer, terminate, view all employees'),
    ('ROLE_MANAGER',       'Team management — view and manage direct/indirect reports only'),
    ('ROLE_EMPLOYEE',      'Self-service — view own profile, submit requests, view own documents');
