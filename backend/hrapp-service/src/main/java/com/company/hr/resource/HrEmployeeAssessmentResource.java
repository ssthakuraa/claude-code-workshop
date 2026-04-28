package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrUnauthorizedException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.request.HrEmployeeAssessmentRequest;
import com.company.hr.dto.response.HrEmployeeAssessmentAvailableCycleDTO;
import com.company.hr.dto.response.HrEmployeeAssessmentDetailDTO;
import com.company.hr.dto.response.HrEmployeeAssessmentSummaryDTO;
import com.company.hr.repository.HrEmployeeAssessmentJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Exposes current-user employee assessment summary, draft, and submit flows.
 */
@Path("/assessments/mine")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HrEmployeeAssessmentResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrEmployeeAssessmentResource.class);

    private final HrEmployeeAssessmentJdbcRepository repository;

    public HrEmployeeAssessmentResource() {
        this(new HrEmployeeAssessmentJdbcRepository());
    }

    @Inject
    HrEmployeeAssessmentResource(HrEmployeeAssessmentJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrEmployeeAssessmentSummaryDTO>> findMine() {
        int employeeId = requireCurrentEmployeeId();
        try {
            return HrApiResponse.success(repository.findMine(employeeId));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load assessments for employeeId={}", employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @GET
    @Path("/available-cycles")
    public HrApiResponse<List<HrEmployeeAssessmentAvailableCycleDTO>> findAvailableCycles() {
        int employeeId = requireCurrentEmployeeId();
        try {
            return HrApiResponse.success(repository.findAvailableCycles(employeeId));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load available assessment cycles for employeeId={}", employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @GET
    @Path("/{assessmentId}")
    public HrApiResponse<HrEmployeeAssessmentDetailDTO> findMineById(@PathParam("assessmentId") long assessmentId) {
        int employeeId = requireCurrentEmployeeId();
        try {
            return HrApiResponse.success(repository.findMineById(assessmentId, employeeId));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load assessmentId={} for employeeId={}", assessmentId, employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    public HrApiResponse<HrEmployeeAssessmentDetailDTO> createDraft(HrEmployeeAssessmentRequest request) {
        int employeeId = requireCurrentEmployeeId();
        validateDraftRequest(request, true);
        try {
            LOGGER.info("Creating employee assessment draft for employeeId={} cycleCode={}", employeeId, request.getCycleCode());
            return HrApiResponse.created(repository.createDraft(employeeId, request), "Assessment draft created.");
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to create assessment draft for employeeId={}", employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @PUT
    @Path("/{assessmentId}")
    public HrApiResponse<HrEmployeeAssessmentDetailDTO> updateDraft(@PathParam("assessmentId") long assessmentId,
                                                                    HrEmployeeAssessmentRequest request) {
        int employeeId = requireCurrentEmployeeId();
        validateDraftRequest(request, false);
        try {
            LOGGER.info("Updating employee assessment draft assessmentId={} employeeId={}", assessmentId, employeeId);
            return HrApiResponse.success(repository.updateDraft(assessmentId, employeeId, request), "Assessment draft saved.");
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to update assessment draft assessmentId={} employeeId={}", assessmentId, employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/{assessmentId}/submit")
    public HrApiResponse<HrEmployeeAssessmentDetailDTO> submitDraft(@PathParam("assessmentId") long assessmentId,
                                                                    HrEmployeeAssessmentRequest request) {
        int employeeId = requireCurrentEmployeeId();
        validateSubmitRequest(request);
        try {
            LOGGER.info("Submitting employee assessment assessmentId={} employeeId={}", assessmentId, employeeId);
            return HrApiResponse.success(repository.submitDraft(assessmentId, employeeId, request), "Assessment submitted.");
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to submit assessment assessmentId={} employeeId={}", assessmentId, employeeId, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private int requireCurrentEmployeeId() {
        Integer employeeId = HrSecurityUtil.getCurrentEmployeeId();
        if (employeeId == null) {
            throw new HrUnauthorizedException("AUTH_REQUIRED");
        }
        return employeeId;
    }

    private void validateDraftRequest(HrEmployeeAssessmentRequest request, boolean requireCycleCode) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
            throw new HrValidationException(fieldErrors);
        }

        if (requireCycleCode && isBlank(request.getCycleCode())) {
            fieldErrors.put("cycleCode", "VALIDATION_REQUIRED");
        }
        validateNumericRanges(fieldErrors, request.getGoalCompletionPct(), request.getCompetencyScore());
        if (!fieldErrors.isEmpty()) {
            throw new HrValidationException(fieldErrors);
        }
    }

    private void validateSubmitRequest(HrEmployeeAssessmentRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
            throw new HrValidationException(fieldErrors);
        }

        validateNumericRanges(fieldErrors, request.getGoalCompletionPct(), request.getCompetencyScore());
        requireNotBlank(fieldErrors, "employeeReflection", request.getEmployeeReflection());
        requireNotBlank(fieldErrors, "nextCyclePlan", request.getNextCyclePlan());

        if (!fieldErrors.isEmpty()) {
            throw new HrValidationException(fieldErrors);
        }
    }

    private void validateNumericRanges(Map<String, String> fieldErrors,
                                       BigDecimal goalCompletionPct,
                                       BigDecimal competencyScore) {
        if (goalCompletionPct != null
                && (goalCompletionPct.compareTo(BigDecimal.ZERO) < 0
                || goalCompletionPct.compareTo(new BigDecimal("100")) > 0)) {
            fieldErrors.put("goalCompletionPct", "VALIDATION_PERCENT_RANGE");
        }

        if (competencyScore != null
                && (competencyScore.compareTo(BigDecimal.ZERO) < 0
                || competencyScore.compareTo(new BigDecimal("5")) > 0)) {
            fieldErrors.put("competencyScore", "VALIDATION_SCORE_RANGE");
        }
    }

    private void requireNotBlank(Map<String, String> fieldErrors, String field, String value) {
        if (isBlank(value)) {
            fieldErrors.put(field, "VALIDATION_REQUIRED");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
