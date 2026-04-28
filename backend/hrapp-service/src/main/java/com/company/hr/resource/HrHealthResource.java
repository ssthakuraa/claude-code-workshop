package com.company.hr.resource;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.time.Instant;
import java.util.Map;

/**
 * Minimal smoke endpoint for Jersey startup verification.
 */
@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HrHealthResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrHealthResource.class);

    @GET
    public HrApiResponse<Map<String, Object>> getHealth() {
        LOGGER.debug("Health check requested");
        return HrApiResponse.success(
                Map.of(
                        "status", "UP",
                        "service", "hrapp-service",
                        "timestamp", Instant.now().toString()
                )
        );
    }
}
