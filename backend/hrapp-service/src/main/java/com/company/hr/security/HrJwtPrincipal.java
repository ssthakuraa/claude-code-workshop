package com.company.hr.security;

import com.company.hr.common.security.HrSecurityUtil;

import java.security.Principal;

/**
 * JWT-based principal carrying username and employeeId for Jersey requests.
 */
public class HrJwtPrincipal implements Principal, HrSecurityUtil.HrPrincipal {

    private final String username;
    private final Integer employeeId;

    public HrJwtPrincipal(String username, Integer employeeId) {
        this.username = username;
        this.employeeId = employeeId;
    }

    @Override
    public String getName() {
        return username;
    }

    public String getUsername() { return username; }

    @Override
    public Integer getEmployeeId() { return employeeId; }

    @Override
    public String toString() { return username; }
}
