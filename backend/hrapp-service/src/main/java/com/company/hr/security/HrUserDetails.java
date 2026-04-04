package com.company.hr.security;

import com.company.hr.common.security.HrSecurityUtil;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring Security UserDetails implementation that also carries employeeId.
 * Implements HrSecurityUtil.HrPrincipal so HrSecurityUtil can extract employeeId.
 */
public class HrUserDetails implements UserDetails, HrSecurityUtil.HrPrincipal {

    private final String username;
    private final String passwordHash;
    private final boolean isActive;
    private final Integer employeeId;
    private final List<String> roles;

    public HrUserDetails(String username, String passwordHash, boolean isActive,
                         Integer employeeId, List<String> roles) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.isActive = isActive;
        this.employeeId = employeeId;
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(
                        role.startsWith("ROLE_") ? role : "ROLE_" + role))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() { return passwordHash; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return isActive; }

    @Override
    public Integer getEmployeeId() { return employeeId; }
}
