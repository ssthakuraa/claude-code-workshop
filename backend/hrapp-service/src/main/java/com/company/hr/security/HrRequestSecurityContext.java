package com.company.hr.security;

import com.company.hr.common.log.HrLogHelper;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.Set;

/**
 * Request-scoped JAX-RS security context populated from JWT claims.
 */
public class HrRequestSecurityContext implements SecurityContext {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrRequestSecurityContext.class);
    private final Principal principal;
    private final Set<String> roles;
    private final boolean secure;

    public HrRequestSecurityContext(Principal principal, Set<String> roles, boolean secure) {
        this.principal = principal;
        this.roles = roles;
        this.secure = secure;
    }

    @Override
    public Principal getUserPrincipal() {
        return principal;
    }

    @Override
    public boolean isUserInRole(String role) {
        if (role == null || role.isBlank()) {
            return false;
        }
        String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return roles.contains(role) || roles.contains(normalized);
    }

    @Override
    public boolean isSecure() {
        return secure;
    }

    @Override
    public String getAuthenticationScheme() {
        return "Bearer";
    }
}
