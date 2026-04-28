package com.company.hr.resource;

import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.repository.HrAuthJdbcRepository;
import com.company.hr.security.HrJwtService;
import com.company.hr.service.HrAuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Jersey authentication endpoints that preserve the existing frontend contract.
 */
@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class HrAuthResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuthResource.class);
    private final HrAuthService authService;

    public HrAuthResource() {
        this(createDefaultService());
    }

    @Inject
    HrAuthResource(HrAuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("/login")
    @jakarta.ws.rs.Consumes(MediaType.APPLICATION_JSON)
    public Response login(HrLoginRequest request) {
        validateLoginRequest(request);
        LOGGER.info("Processing login request");
        HrLoginResponse response = authService.authenticate(request);
        return Response.ok(HrApiResponse.success(response)).build();
    }

    @POST
    @Path("/refresh")
    public Response refresh(@HeaderParam("X-Refresh-Token") String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new HrValidationException(Map.of("refreshToken", "VALIDATION_REQUIRED"));
        }
        LOGGER.info("Processing refresh-token request");
        HrLoginResponse response = authService.refreshToken(refreshToken);
        return Response.ok(HrApiResponse.success(response)).build();
    }

    @POST
    @Path("/logout")
    public Response logout() {
        LOGGER.info("Processing logout request");
        return Response.ok(HrApiResponse.success(null)).build();
    }

    private void validateLoginRequest(HrLoginRequest request) {
        if (request == null) {
            throw new HrValidationException(Map.of("request", "VALIDATION_REQUIRED"));
        }

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            fieldErrors.put("username", "VALIDATION_REQUIRED");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            fieldErrors.put("password", "VALIDATION_REQUIRED");
        }
        if (!fieldErrors.isEmpty()) {
            throw new HrValidationException(fieldErrors);
        }
    }

    private static HrAuthService createDefaultService() {
        HrJwtConfig jwtConfig = HrJwtConfig.fromEnvironment();
        return new HrAuthService(
                new HrJwtService(jwtConfig),
                jwtConfig,
                new HrAuthJdbcRepository()
        );
    }
}
