package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.repository.HrJobJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Covers job lookups until the repository layer is ready.
 */
@Path("/jobs")
@Produces(MediaType.APPLICATION_JSON)
public class HrJobResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrJobResource.class);
    private final HrJobJdbcRepository repository;

    public HrJobResource() {
        this(new HrJobJdbcRepository());
    }

    @Inject
    HrJobResource(HrJobJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrJobDTO>> findAll() {
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load jobs", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
