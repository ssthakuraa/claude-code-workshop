DECLARE
    PROCEDURE drop_table_if_exists(p_table_name IN VARCHAR2) IS
        l_count NUMBER;
    BEGIN
        SELECT COUNT(*)
          INTO l_count
          FROM user_tables
         WHERE table_name = UPPER(p_table_name);

        IF l_count > 0 THEN
            EXECUTE IMMEDIATE 'DROP TABLE ' || p_table_name || ' CASCADE CONSTRAINTS PURGE';
        END IF;
    END;
BEGIN
    drop_table_if_exists('hr_idempotency_keys');
    drop_table_if_exists('hr_notifications');
    drop_table_if_exists('hr_employee_documents');
    drop_table_if_exists('hr_audit_logs');
    drop_table_if_exists('hr_user_preferences');
    drop_table_if_exists('hr_user_roles');
    drop_table_if_exists('hr_users');
    drop_table_if_exists('hr_roles');
    drop_table_if_exists('job_history');
    drop_table_if_exists('employees');
    drop_table_if_exists('departments');
    drop_table_if_exists('locations');
    drop_table_if_exists('countries');
    drop_table_if_exists('jobs');
    drop_table_if_exists('regions');
END;
/
