package com.company.hr.security;

import com.company.hr.common.i18n.HrMessageSource;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityContext;
import com.company.hr.common.security.HrSecurityContextHolder;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Validates bearer tokens and populates Jersey request security state from JWT claims.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class HrJwtRequestFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJwtRequestFilter.class);
    private final HrJwtService jwtService;

    public HrJwtRequestFilter(HrJwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        HrSecurityContextHolder.clear();

        if (isPublicRequest(requestContext)) {
            return;
        }

        String authorization = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            requestContext.abortWith(unauthorizedResponse());
            return;
        }

        String token = authorization.substring("Bearer ".length());
        try {
            if (jwtService.isTokenExpired(token) || !jwtService.isAccessToken(token)) {
                requestContext.abortWith(unauthorizedResponse());
                return;
            }
            String username = jwtService.extractUsername(token);
            List<String> roles = jwtService.extractRoles(token);
            Integer employeeId = jwtService.extractEmployeeId(token);
            List<String> safeRoles = roles == null ? List.of() : roles;
            Set<String> normalizedRoles = normalizeRoles(safeRoles);
            boolean secure = requestContext.getSecurityContext() != null
                    && requestContext.getSecurityContext().isSecure();

            HrJwtPrincipal principal = new HrJwtPrincipal(username, employeeId);
            HrSecurityContextHolder.setContext(new HrSecurityContext(
                    username,
                    employeeId,
                    List.copyOf(normalizedRoles)
            ));
            requestContext.setSecurityContext(new HrRequestSecurityContext(
                    principal,
                    normalizedRoles,
                    secure
            ));
        } catch (JwtException ex) {
            LOGGER.warn("JWT validation failed: {}", ex.getMessage());
            HrSecurityContextHolder.clear();
            requestContext.abortWith(unauthorizedResponse());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        HrSecurityContextHolder.clear();
    }

    private Set<String> normalizeRoles(List<String> roles) {
        Set<String> normalized = new HashSet<>();
        for (String role : roles) {
            if (role == null || role.isBlank()) {
                continue;
            }
            normalized.add(role);
            if (!role.startsWith("ROLE_")) {
                normalized.add("ROLE_" + role);
            }
        }
        return normalized;
    }

    private boolean isPublicRequest(ContainerRequestContext requestContext) {
        String path = requestContext.getUriInfo() == null ? "" : requestContext.getUriInfo().getPath(false);
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            return true;
        }
        return path.equals("health") || path.startsWith("auth");
    }

    private Response unauthorizedResponse() {
        return Response.status(Response.Status.UNAUTHORIZED)
                .entity(HrApiResponse.error(
                        Response.Status.UNAUTHORIZED.getStatusCode(),
                        HrMessageSource.get("hr.error.auth.required"),
                        "AUTH_REQUIRED"))
                .build();
    }
}
