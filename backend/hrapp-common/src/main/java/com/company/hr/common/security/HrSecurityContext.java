package com.company.hr.common.security;

import com.company.hr.common.log.HrLogHelper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Lightweight, immutable authentication context that Jersey filters can populate.
 */
public final class HrSecurityContext {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrSecurityContext.class);
    private final String username;
    private final Integer employeeId;
    private final List<String> roles;

    public HrSecurityContext(String username, Integer employeeId, List<String> roles) {
        this.username = username;
        this.employeeId = employeeId;
        if (roles == null || roles.isEmpty()) {
            this.roles = Collections.emptyList();
        } else {
            this.roles = Collections.unmodifiableList(new ArrayList<>(roles));
        }
    }

    public static HrSecurityContext empty() {
        return new HrSecurityContext(null, null, Collections.emptyList());
    }

    public String getUsername() {
        return username;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public List<String> getRoles() {
        return roles;
    }

    public boolean hasRole(String role) {
        if (role == null) {
            LOGGER.warn("Role check requested with null role");
            return false;
        }
        String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return roles.stream().anyMatch(r -> r.equals(normalized) || r.equals(role));
    }

    @Override
    public String toString() {
        return "HrSecurityContext{" +
                "username='" + username + '\'' +
                ", employeeId=" + employeeId +
                ", roles=" + roles +
                '}';
    }
}
