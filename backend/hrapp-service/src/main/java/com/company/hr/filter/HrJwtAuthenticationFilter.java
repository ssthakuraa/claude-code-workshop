package com.company.hr.filter;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.security.HrJwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HrJwtAuthenticationFilter extends OncePerRequestFilter {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJwtAuthenticationFilter.class);

    private final HrJwtService jwtService;

    public HrJwtAuthenticationFilter(HrJwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            final String username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (!jwtService.isTokenExpired(jwt)) {
                    List<String> roles = jwtService.extractRoles(jwt);
                    Integer employeeId = jwtService.extractEmployeeId(jwt);

                    var authorities = roles.stream()
                            .map(r -> new SimpleGrantedAuthority(r.startsWith("ROLE_") ? r : "ROLE_" + r))
                            .collect(Collectors.toList());

                    // Create a principal that carries employeeId
                    var principal = new com.company.hr.security.HrJwtPrincipal(username, employeeId);

                    var authToken = new UsernamePasswordAuthenticationToken(
                            principal, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            LOGGER.warn("JWT processing failed: {}", e.getMessage());
            // Don't set authentication — request will be rejected by Spring Security if route is protected
        }

        filterChain.doFilter(request, response);
    }
}
