package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrRegionDTO;
import com.company.hr.repository.HrRegionJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Provides the read-only region endpoint while the repository is being implemented.
 */
@Path("/regions")
@Produces(MediaType.APPLICATION_JSON)
public class HrRegionResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrRegionResource.class);
    private final HrRegionJdbcRepository repository;

    public HrRegionResource() {
        this(new HrRegionJdbcRepository());
    }

    @Inject
    HrRegionResource(HrRegionJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrRegionDTO>> findAll() {
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load regions", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
