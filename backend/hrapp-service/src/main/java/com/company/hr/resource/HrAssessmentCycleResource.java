package com.company.hr.resource;

import com.company.hr.common.exception.HrAccessDeniedException;
import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.request.HrAssessmentCycleRequest;
import com.company.hr.dto.response.HrAssessmentCycleDTO;
import com.company.hr.repository.HrAssessmentCycleJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Exposes assessment-cycle setup APIs for admin and HR specialist users.
 */
@Path("/assessment-cycles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HrAssessmentCycleResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAssessmentCycleResource.class);
    private static final Set<String> PERIOD_TYPES = Set.of("ANNUAL", "HALF", "QUARTER");
    private static final Set<String> CYCLE_STATUSES = Set.of("PLANNED", "OPEN", "CLOSED");
    private static final Set<String> SUPPORTED_LOCALES = Set.of("es-MX", "fr-FR", "hi-IN");

    private final HrAssessmentCycleJdbcRepository repository;

    public HrAssessmentCycleResource() {
        this(new HrAssessmentCycleJdbcRepository());
    }

    @Inject
    HrAssessmentCycleResource(HrAssessmentCycleJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrAssessmentCycleDTO>> findAll() {
        requireAdminOrHrSpecialist();
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load assessment cycles", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    public HrApiResponse<HrAssessmentCycleDTO> create(HrAssessmentCycleRequest request) {
        requireAdminOrHrSpecialist();
        validate(request, null);
        try {
            LOGGER.info("Creating assessment cycle {}", request.getCycleCode());
            return HrApiResponse.created(repository.create(request), "Assessment cycle created.");
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to create assessment cycle {}", request == null ? null : request.getCycleCode(), ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @PUT
    @Path("/{cycleCode}")
    public HrApiResponse<HrAssessmentCycleDTO> update(@PathParam("cycleCode") String cycleCode,
                                                      HrAssessmentCycleRequest request) {
        requireAdminOrHrSpecialist();
        validate(request, cycleCode);
        try {
            LOGGER.info("Updating assessment cycle {}", cycleCode);
            return HrApiResponse.success(repository.update(cycleCode, request), "Assessment cycle updated.");
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to update assessment cycle {}", cycleCode, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private void requireAdminOrHrSpecialist() {
        if (!HrSecurityUtil.isAdminOrHrSpecialist()) {
            LOGGER.warn("Rejected assessment-cycle setup access for non-privileged caller");
            throw new HrAccessDeniedException();
        }
    }

    private void validate(HrAssessmentCycleRequest request, String cycleCodePath) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
            throw new HrValidationException(fieldErrors);
        }

        requireNotBlank(fieldErrors, "cycleCode", request.getCycleCode(), "VALIDATION_REQUIRED");
        requireNotBlank(fieldErrors, "defaultLabel", request.getDefaultLabel(), "VALIDATION_REQUIRED");
        requireNotBlank(fieldErrors, "periodType", request.getPeriodType(), "VALIDATION_REQUIRED");
        requireNotBlank(fieldErrors, "cycleStatus", request.getCycleStatus(), "VALIDATION_REQUIRED");
        requireNotBlank(fieldErrors, "startDate", request.getStartDate(), "VALIDATION_REQUIRED");
        requireNotBlank(fieldErrors, "endDate", request.getEndDate(), "VALIDATION_REQUIRED");

        if (request.getDisplayOrder() == null || request.getDisplayOrder() <= 0) {
            fieldErrors.put("displayOrder", "VALIDATION_POSITIVE_NUMBER");
        }

        if (request.getPeriodType() != null && !request.getPeriodType().isBlank()) {
            String normalizedPeriodType = request.getPeriodType().trim().toUpperCase(Locale.ROOT);
            if (!PERIOD_TYPES.contains(normalizedPeriodType)) {
                fieldErrors.put("periodType", "VALIDATION_INVALID_PERIOD_TYPE");
            }
        }

        if (request.getCycleStatus() != null && !request.getCycleStatus().isBlank()) {
            String normalizedStatus = request.getCycleStatus().trim().toUpperCase(Locale.ROOT);
            if (!CYCLE_STATUSES.contains(normalizedStatus)) {
                fieldErrors.put("cycleStatus", "VALIDATION_INVALID_STATUS");
            }
        }

        LocalDate startDate = parseDate(fieldErrors, "startDate", request.getStartDate());
        LocalDate endDate = parseDate(fieldErrors, "endDate", request.getEndDate());
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            fieldErrors.put("endDate", "VALIDATION_DATE_RANGE");
        }

        if (cycleCodePath != null
                && request.getCycleCode() != null
                && !request.getCycleCode().isBlank()
                && !cycleCodePath.trim().equalsIgnoreCase(request.getCycleCode().trim())) {
            fieldErrors.put("cycleCode", "VALIDATION_CODE_IMMUTABLE");
        }

        Map<String, String> translations = request.getTranslations();
        if (translations != null) {
            for (String locale : translations.keySet()) {
                if (!SUPPORTED_LOCALES.contains(locale)) {
                    fieldErrors.put("translations." + locale, "VALIDATION_UNSUPPORTED_LOCALE");
                }
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

    private LocalDate parseDate(Map<String, String> fieldErrors, String field, String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException ex) {
            fieldErrors.put(field, "VALIDATION_INVALID_DATE");
            return null;
        }
    }
}
