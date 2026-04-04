package com.company.hr.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * RBAC and PII access control utilities.
 *
 * Roles: ROLE_ADMIN, ROLE_HR_SPECIALIST, ROLE_MANAGER, ROLE_EMPLOYEE
 *
 * Rules:
 * - ADMIN and HR_SPECIALIST can view all employees, salaries, PII
 * - MANAGER can view own team but salary only for direct reports
 * - EMPLOYEE can only view own record (salary and PII visible for self)
 */
@Component
public class HrSecurityUtil {

    /**
     * Returns the username of the currently authenticated user.
     */
    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return auth.getName();
    }

    /**
     * Returns the roles of the currently authenticated user.
     */
    public static Collection<? extends GrantedAuthority> getCurrentRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return java.util.Collections.emptyList();
        return auth.getAuthorities();
    }

    /**
     * Returns true if the current user has the given role.
     */
    public static boolean hasRole(String role) {
        return getCurrentRoles().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role)
                               || a.getAuthority().equals(role));
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
     * The JWT principal should be an HrUserDetails object with employeeId.
     * Returns null if not available (e.g., during tests without full JWT setup).
     */
    public static Integer getCurrentEmployeeId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof HrPrincipal hrPrincipal) {
            return hrPrincipal.getEmployeeId();
        }
        return null;
    }

    /**
     * Marker interface for principals that carry an employeeId.
     * HrUserDetails (in hrapp-service) will implement this.
     */
    public interface HrPrincipal {
        Integer getEmployeeId();
    }
}
