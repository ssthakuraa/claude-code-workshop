package com.company.hr.resource;

import com.company.hr.common.exception.HrAccessDeniedException;
import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.repository.HrAuditLogJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/**
 * Exposes paged audit-log queries for privileged HR users in the Jersey runtime.
 */
@Path("/audit-logs")
@Produces(MediaType.APPLICATION_JSON)
public class HrAuditLogResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuditLogResource.class);
    private final HrAuditLogJdbcRepository repository;

    public HrAuditLogResource() {
        this(new HrAuditLogJdbcRepository());
    }

    @Inject
    HrAuditLogResource(HrAuditLogJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrPagedResponse<com.company.hr.dto.response.HrAuditLogDTO> findAll(@DefaultValue("0") @QueryParam("page") int page,
                                                                               @DefaultValue("20") @QueryParam("size") int size,
                                                                               @QueryParam("tableName") String tableName) {
        requireAdminOrHrSpecialist();
        try {
            return repository.findAll(page, size, tableName);
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load audit logs for tableName={}", tableName, ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private void requireAdminOrHrSpecialist() {
        if (!HrSecurityUtil.isAdminOrHrSpecialist()) {
            LOGGER.warn("Rejected audit-log access for non-privileged caller");
            throw new HrAccessDeniedException();
        }
    }
}
