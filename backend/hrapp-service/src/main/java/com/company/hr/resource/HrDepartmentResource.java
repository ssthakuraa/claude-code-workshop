package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrDepartmentDTO;
import com.company.hr.repository.HrDepartmentJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Exposes department data to the Jersey runtime while the JDBC-based repositories are being built.
 */
@Path("/departments")
@Produces(MediaType.APPLICATION_JSON)
public class HrDepartmentResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrDepartmentResource.class);
    private final HrDepartmentJdbcRepository repository;

    public HrDepartmentResource() {
        this(new HrDepartmentJdbcRepository());
    }

    @Inject
    HrDepartmentResource(HrDepartmentJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrDepartmentDTO>> findAll() {
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load departments", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
