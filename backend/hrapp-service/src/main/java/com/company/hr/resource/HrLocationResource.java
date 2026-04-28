package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrLocationDTO;
import com.company.hr.repository.HrLocationJdbcRepository;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Exposes read-only location reference data for the Jersey runtime.
 */
@Path("/locations")
@Produces(MediaType.APPLICATION_JSON)
public class HrLocationResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrLocationResource.class);
    private final HrLocationJdbcRepository repository;

    public HrLocationResource() {
        this(new HrLocationJdbcRepository());
    }

    HrLocationResource(HrLocationJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrLocationDTO>> findAll() {
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load locations", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
