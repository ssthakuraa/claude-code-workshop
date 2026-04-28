package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrCountryDTO;
import com.company.hr.repository.HrCountryJdbcRepository;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

/**
 * Exposes read-only country reference data for the Jersey runtime.
 */
@Path("/countries")
@Produces(MediaType.APPLICATION_JSON)
public class HrCountryResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrCountryResource.class);
    private final HrCountryJdbcRepository repository;

    public HrCountryResource() {
        this(new HrCountryJdbcRepository());
    }

    HrCountryResource(HrCountryJdbcRepository repository) {
        this.repository = repository;
    }

    @GET
    public HrApiResponse<List<HrCountryDTO>> findAll() {
        try {
            return HrApiResponse.success(repository.findAll());
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to load countries", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }
}
