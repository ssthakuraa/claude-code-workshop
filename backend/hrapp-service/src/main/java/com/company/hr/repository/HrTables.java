package com.company.hr.repository;

/**
 * Centralized AIHR runtime table names for explicit SQL repositories.
 */
public final class HrTables {

    public static final String REGIONS = "AIHR_REGIONS";
    public static final String COUNTRIES = "AIHR_COUNTRIES";
    public static final String LOCATIONS = "AIHR_LOCATIONS";
    public static final String DEPARTMENTS = "AIHR_DEPARTMENTS";
    public static final String JOBS = "AIHR_JOBS";
    public static final String EMPLOYEES = "AIHR_EMPLOYEES";
    public static final String JOB_HISTORY = "AIHR_JOB_HISTORY";
    public static final String USERS = "AIHR_USERS";
    public static final String ROLES = "AIHR_ROLES";
    public static final String USER_ROLES = "AIHR_USER_ROLES";
    public static final String USER_PREFERENCES = "AIHR_USER_PREFERENCES";
    public static final String AUDIT_LOGS = "AIHR_AUDIT_LOGS";
    public static final String IDEMPOTENCY_KEYS = "AIHR_IDEMPOTENCY_KEYS";
    public static final String NOTIFICATIONS = "AIHR_NOTIFICATIONS";
    public static final String TRANSLATIONS = "AIHR_TRANSLATIONS";
    public static final String ASSESSMENT_CYCLES = "AIHR_ASSESSMENT_CYCLES";
    public static final String ASSESSMENTS = "AIHR_EMPLOYEE_ASSESSMENTS";

    private HrTables() {
    }
}
