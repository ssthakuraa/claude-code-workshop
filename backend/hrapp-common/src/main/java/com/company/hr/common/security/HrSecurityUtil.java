package com.company.hr.common.security;

import com.company.hr.common.log.HrLogHelper;

import java.util.List;

/**
 * Centralized RBAC and data-visibility helpers for the Jersey runtime.
 */
public class HrSecurityUtil {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrSecurityUtil.class);

    /**
     * Returns the username of the currently authenticated user.
     */
    public static String getCurrentUsername() {
        HrSecurityContext jerseyContext = HrSecurityContextHolder.getContext();
        if (jerseyContext != null && jerseyContext.getUsername() != null && !jerseyContext.getUsername().isBlank()) {
            return jerseyContext.getUsername();
        }
        return null;
    }

    /**
     * Returns the roles of the currently authenticated user.
     */
    public static List<String> getCurrentRoles() {
        HrSecurityContext jerseyContext = HrSecurityContextHolder.getContext();
        if (jerseyContext == null) {
            return List.of();
        }
        return jerseyContext.getRoles();
    }

    /**
     * Returns true if the current user has the given role.
     */
    public static boolean hasRole(String role) {
        if (role == null || role.isBlank()) {
            LOGGER.warn("Role check requested with blank role");
            return false;
        }
        return getCurrentRoles().stream()
                .anyMatch(currentRole -> currentRole.equals("ROLE_" + role)
                        || currentRole.equals(role));
    }

    /**
     * Returns true if current user is ADMIN or HR_SPECIALIST.
     */
    public static boolean isAdminOrHrSpecialist() {
        return hasRole("ROLE_ADMIN") || hasRole("ROLE_HR_SPECIALIST")
               || hasRole("ADMIN") || hasRole("HR_SPECIALIST");
    }

    /**
     * Returns true if current user is MANAGER.
     */
    public static boolean isManager() {
        return hasRole("ROLE_MANAGER") || hasRole("MANAGER");
    }

    /**
     * Returns true if current user can view salary for the given employeeId.
     * - ADMIN / HR_SPECIALIST: always
     * - MANAGER: only for their direct/indirect reports (caller must pass isReport=true)
     * - EMPLOYEE: only for themselves
     */
    public static boolean canViewSalary(Integer targetEmployeeId, Integer currentEmployeeId, boolean isReport) {
        if (isAdminOrHrSpecialist()) return true;
        if (isManager() && isReport) return true;
        return targetEmployeeId != null && targetEmployeeId.equals(currentEmployeeId);
    }

    /**
     * Simplified: can current user view PII of targetEmployee?
     */
    public static boolean canViewPii(Integer targetEmployeeId, Integer currentEmployeeId) {
        if (isAdminOrHrSpecialist()) return true;
        return targetEmployeeId != null && targetEmployeeId.equals(currentEmployeeId);
    }

    /**
     * Extract employeeId claim from authentication principal.
     * Returns null if not available (e.g., during tests without full JWT setup).
     */
    public static Integer getCurrentEmployeeId() {
        HrSecurityContext jerseyContext = HrSecurityContextHolder.getContext();
        if (jerseyContext != null && jerseyContext.getEmployeeId() != null) {
            return jerseyContext.getEmployeeId();
        }
        return null;
    }

    /**
     * Marker interface retained while legacy security classes are still present.
     */
    public interface HrPrincipal {
        Integer getEmployeeId();
    }
}
