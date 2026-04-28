package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.response.HrDashboardSummaryDTO;
import com.company.hr.repository.HrDashboardSummaryJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Provides dashboard summary metrics targeted by the frontend.
 */
@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class HrDashboardResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrDashboardResource.class);
    private final HrDashboardSummaryJdbcRepository repository;

    public HrDashboardResource() {
        this(new HrDashboardSummaryJdbcRepository());
    }

    @Inject
    HrDashboardResource(HrDashboardSummaryJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    @Path("/summary")
    public HrApiResponse<HrDashboardSummaryDTO> getSummary() {
        try {
            Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
            boolean managerScoped = HrSecurityUtil.isManager() && currentEmployeeId != null && !HrSecurityUtil.isAdminOrHrSpecialist();
            return HrApiResponse.success(repository.fetchSummary(currentEmployeeId, managerScoped));
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load dashboard summary", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
