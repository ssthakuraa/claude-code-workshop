package com.company.hr.filter;

import com.company.hr.common.i18n.HrLocaleContext;
import com.company.hr.common.i18n.HrLocaleContextHolder;
import com.company.hr.common.i18n.HrSupportedLocale;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.repository.HrUserPreferencesJdbcRepository;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.util.Optional;

/**
 * Resolves the effective request locale from saved preferences, request headers, and defaults.
 */
@Provider
@Priority(Priorities.AUTHORIZATION)
public class HrLocaleContextFilter implements ContainerRequestFilter, ContainerResponseFilter {

    static final String LOCALE_CODE_PROPERTY = "hr.locale.code";

    private static final HrLogHelper LOGGER = new HrLogHelper(HrLocaleContextFilter.class);

    private final HrUserPreferencesJdbcRepository userPreferencesRepository;

    public HrLocaleContextFilter() {
        this(new HrUserPreferencesJdbcRepository());
    }

    public HrLocaleContextFilter(HrUserPreferencesJdbcRepository userPreferencesRepository) {
        this.userPreferencesRepository = userPreferencesRepository;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        HrLocaleContextHolder.clear();

        HrSupportedLocale resolvedLocale = resolveLocale(requestContext);
        HrLocaleContextHolder.set(HrLocaleContext.from(resolvedLocale));
        requestContext.setProperty(LOCALE_CODE_PROPERTY, resolvedLocale.code());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        Object localeCode = requestContext.getProperty(LOCALE_CODE_PROPERTY);
        if (localeCode instanceof String code && !code.isBlank()) {
            responseContext.getHeaders().putSingle(HttpHeaders.CONTENT_LANGUAGE, code);
        } else {
            responseContext.getHeaders().putSingle(HttpHeaders.CONTENT_LANGUAGE, HrSupportedLocale.defaultLocale().code());
        }
        HrLocaleContextHolder.clear();
    }

    private HrSupportedLocale resolveLocale(ContainerRequestContext requestContext) {
        Optional<HrSupportedLocale> userPreferenceLocale = findAuthenticatedUserPreferenceLocale();
        if (userPreferenceLocale.isPresent()) {
            return userPreferenceLocale.get();
        }

        String acceptLanguage = requestContext.getHeaderString(HttpHeaders.ACCEPT_LANGUAGE);
        HrSupportedLocale resolved = HrSupportedLocale.resolveAcceptLanguage(acceptLanguage);
        LOGGER.debug("Resolved locale {} from request header", resolved.code());
        return resolved;
    }

    private Optional<HrSupportedLocale> findAuthenticatedUserPreferenceLocale() {
        String username = HrSecurityUtil.getCurrentUsername();
        if (username == null || username.isBlank()) {
            return Optional.empty();
        }
        try {
            return userPreferencesRepository.findLanguageForUsername(username).map(HrSupportedLocale::normalize);
        } catch (IllegalStateException ex) {
            LOGGER.warn("Unable to resolve saved locale for current user: {}", ex.getMessage());
            return Optional.empty();
        }
    }
}
