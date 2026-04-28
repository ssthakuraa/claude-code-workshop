package com.company.hr.resource;

import com.company.hr.common.exception.HrAccessDeniedException;
import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.response.HrAssessmentDirectoryRowDTO;
import com.company.hr.repository.HrAssessmentDirectoryJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/**
 * Exposes the reviewer-facing assessments directory for HR and managers.
 */
@Path("/assessments")
@Produces(MediaType.APPLICATION_JSON)
public class HrAssessmentResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAssessmentResource.class);

    private final HrAssessmentDirectoryJdbcRepository repository;

    public HrAssessmentResource() {
        this(new HrAssessmentDirectoryJdbcRepository());
    }

    @Inject
    HrAssessmentResource(HrAssessmentDirectoryJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrPagedResponse<HrAssessmentDirectoryRowDTO> findAll(@DefaultValue("0") @QueryParam("page") int page,
                                                                @DefaultValue("100") @QueryParam("size") int size,
                                                                @QueryParam("search") String search,
                                                                @QueryParam("status") String reviewStatus,
                                                                @QueryParam("cycleCode") String cycleCode,
                                                                @QueryParam("departmentId") Integer departmentId,
                                                                @QueryParam("reviewerUserId") Integer reviewerUserId) {
        AccessScope accessScope = requireReviewerDirectoryAccess();
        try {
            return repository.findAll(
                    page,
                    size,
                    search,
                    reviewStatus,
                    cycleCode,
                    departmentId,
                    reviewerUserId,
                    accessScope.currentEmployeeId(),
                    accessScope.managerScoped()
            );
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load assessments directory", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private AccessScope requireReviewerDirectoryAccess() {
        Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
        if (HrSecurityUtil.isAdminOrHrSpecialist()) {
            return new AccessScope(currentEmployeeId, false);
        }
        if (HrSecurityUtil.isManager() && currentEmployeeId != null) {
            return new AccessScope(currentEmployeeId, true);
        }
        LOGGER.warn("Rejected assessments directory access for unauthorized caller");
        throw new HrAccessDeniedException();
    }

    private record AccessScope(Integer currentEmployeeId, boolean managerScoped) {
    }
}
