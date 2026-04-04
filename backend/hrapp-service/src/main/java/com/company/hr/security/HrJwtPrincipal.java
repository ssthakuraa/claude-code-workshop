package com.company.hr.security;

import com.company.hr.common.security.HrSecurityUtil;

/**
 * JWT-based principal carrying username and employeeId.
 * Used by HrJwtAuthenticationFilter when setting the SecurityContext.
 */
public class HrJwtPrincipal implements HrSecurityUtil.HrPrincipal {

    private final String username;
    private final Integer employeeId;

    public HrJwtPrincipal(String username, Integer employeeId) {
        this.username = username;
        this.employeeId = employeeId;
    }

    public String getUsername() { return username; }

    @Override
    public Integer getEmployeeId() { return employeeId; }

    @Override
    public String toString() { return username; }
}
