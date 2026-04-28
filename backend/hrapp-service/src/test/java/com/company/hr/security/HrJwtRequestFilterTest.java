package com.company.hr.security;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.exception.HrApplicationExceptionMapper;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HrJwtRequestFilterTest extends JerseyTest {

    private HrJwtService jwtService;

    @Override
    protected Application configure() {
        HrJwtConfig jwtConfig = new HrJwtConfig();
        jwtConfig.setSecret("test-secret-for-filter-should-be-long-enough");
        jwtConfig.setExpiration(1_800_000L);
        jwtConfig.setRefreshExpiration(604_800_000L);
        jwtService = new HrJwtService(jwtConfig);

        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new HrJwtRequestFilter(jwtService))
                .register(HrApplicationExceptionMapper.class)
                .register(TestProtectedResource.class);
    }

    @Test
    void missingBearerTokenReturnsUnauthorizedEnvelope() {
        Response response = target("/protected")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("AUTH_REQUIRED");
        assertThat(payload.getError()).isEqualTo("Authentication is required to perform this action.");
    }

    @Test
    void accessTokenAllowsProtectedRequest() {
        String accessToken = jwtService.generateToken("steven.king", List.of("ROLE_ADMIN"), 100);

        Response response = target("/protected")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("Authorization", "Bearer " + accessToken)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<String> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).isEqualTo("ok");
    }

    @Test
    void refreshTokenCannotBeUsedAsAccessToken() {
        String refreshToken = jwtService.generateRefreshToken("steven.king");

        Response response = target("/protected")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("Authorization", "Bearer " + refreshToken)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());
    }

    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public static class TestProtectedResource {

        @GET
        @Path("/protected")
        public HrApiResponse<String> protectedEndpoint() {
            return HrApiResponse.success("ok");
        }
    }
}
