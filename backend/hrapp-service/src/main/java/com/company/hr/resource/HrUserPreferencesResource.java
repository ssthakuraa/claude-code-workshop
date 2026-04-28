package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.i18n.HrSupportedLocale;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.request.HrUserPreferencesRequest;
import com.company.hr.dto.response.HrUserPreferencesDTO;
import com.company.hr.repository.HrUserPreferencesJdbcRepository;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Exposes current-user preference reads and updates for the Jersey runtime.
 */
@Path("/users/me/preferences")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HrUserPreferencesResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrUserPreferencesResource.class);
    private final HrUserPreferencesJdbcRepository repository;

    public HrUserPreferencesResource() {
        this(new HrUserPreferencesJdbcRepository());
    }

    HrUserPreferencesResource(HrUserPreferencesJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<HrUserPreferencesDTO> findMine() {
        String username = requireCurrentUsername();
        try {
            return HrApiResponse.success(repository.findForUsername(username));
        } catch (IllegalStateException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @PATCH
    public HrApiResponse<HrUserPreferencesDTO> updateMine(HrUserPreferencesRequest request) {
        validate(request);
        String username = requireCurrentUsername();
        try {
            LOGGER.info("Saving user preferences");
            return HrApiResponse.success(repository.upsertForUsername(username, request));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to save user preferences", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private String requireCurrentUsername() {
        String username = HrSecurityUtil.getCurrentUsername();
        if (username == null || username.isBlank()) {
            throw new HrUnauthorizedException("UNAUTHORIZED");
        }
        return username;
    }

    private void validate(HrUserPreferencesRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
        } else {
            requireNotBlank(fieldErrors, "language", request.getLanguage(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "timezone", request.getTimezone(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "dateFormat", request.getDateFormat(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "currency", request.getCurrency(), "VALIDATION_REQUIRED");
            if (request.getLanguage() != null
                    && !request.getLanguage().isBlank()
                    && HrSupportedLocale.fromTag(request.getLanguage()).isEmpty()) {
                fieldErrors.put("language", "VALIDATION_UNSUPPORTED_LOCALE");
            }
        }
        if (!fieldErrors.isEmpty()) {
            throw new HrValidationException(fieldErrors);
        }
    }

    private void requireNotBlank(Map<String, String> fieldErrors, String field, String value, String message) {
        if (value == null || value.isBlank()) {
            fieldErrors.put(field, message);
        }
    }
}
