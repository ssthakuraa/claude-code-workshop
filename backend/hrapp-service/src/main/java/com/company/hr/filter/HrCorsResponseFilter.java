package com.company.hr.filter;

import com.company.hr.common.log.HrLogHelper;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

import java.util.List;
import java.util.Objects;

/**
 * Explicit CORS handling for the Jersey runtime.
 */
@Provider
public class HrCorsResponseFilter implements ContainerResponseFilter {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrCorsResponseFilter.class);
    private final List<String> allowedOrigins;

    public HrCorsResponseFilter(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        String origin = requestContext.getHeaderString("Origin");
        String allowedOrigin = resolveAllowedOrigin(origin);
        if (allowedOrigin != null) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", allowedOrigin);
            responseContext.getHeaders().putSingle("Vary", "Origin");
        }
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
    }

    private String resolveAllowedOrigin(String origin) {
        if (origin == null || origin.isBlank()) {
            return allowedOrigins.isEmpty() ? "*" : allowedOrigins.get(0);
        }
        if (allowedOrigins.contains("*")
                || allowedOrigins.contains(origin)
                || allowedOrigins.stream().filter(Objects::nonNull).anyMatch(pattern -> matchesPattern(pattern, origin))) {
            return origin;
        }
        LOGGER.warn("Rejected CORS origin={}", origin);
        return null;
    }

    private boolean matchesPattern(String pattern, String origin) {
        if (pattern == null || origin == null) {
            return false;
        }
        if (pattern.endsWith(":*")) {
            return origin.startsWith(pattern.substring(0, pattern.length() - 1));
        }
        return false;
    }
}
