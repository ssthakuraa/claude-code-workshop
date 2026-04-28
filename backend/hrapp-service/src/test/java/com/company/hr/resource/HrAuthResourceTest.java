package com.company.hr.resource;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.repository.HrAuthJdbcRepository;
import com.company.hr.repository.HrAuthUserRecord;
import com.company.hr.security.HrPasswordHasher;
import com.company.hr.security.HrJwtService;
import com.company.hr.service.HrAuthService;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class HrAuthResourceTest extends JerseyTest {

    private static final String PASSWORD_HASH = HrPasswordHasher.hash("password123");

    @Override
    protected Application configure() {
        HrJwtConfig jwtConfig = new HrJwtConfig();
        jwtConfig.setSecret("test-secret-for-auth-resource-should-be-long-enough");
        jwtConfig.setExpiration(1_800_000L);
        jwtConfig.setRefreshExpiration(604_800_000L);

        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(new HrAuthService(
                                new HrJwtService(jwtConfig),
                                jwtConfig,
                                new StubAuthRepository()
                        )).to(HrAuthService.class);
                    }
                })
                .register(HrAuthResource.class)
                .register(HrApplicationExceptionMapper.class);
    }

    @Test
    void loginReturnsEnvelope() {
        HrLoginRequest request = new HrLoginRequest();
        request.setUsername("steven.king");
        request.setPassword("password123");

        Response response = target("/auth/login")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<HrLoginResponse> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData().getUser().getUsername()).isEqualTo("steven.king");
        assertThat(payload.getData().getUser().getRole()).isEqualTo("ADMIN");
        assertThat(payload.getData().getExpiresIn()).isEqualTo(1_800_000L);
        assertThat(payload.getData().getToken()).isNotBlank();
        assertThat(payload.getData().getRefreshToken()).isNotBlank();
    }

    @Test
    void loginValidationFailureReturnsFieldErrors() {
        HrLoginRequest request = new HrLoginRequest();
        request.setUsername(" ");
        request.setPassword("");

        Response response = target("/auth/login")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("VALIDATION_FAILED");
        assertThat(payload.getFieldErrors()).containsEntry("username", "VALIDATION_REQUIRED");
        assertThat(payload.getFieldErrors()).containsEntry("password", "VALIDATION_REQUIRED");
    }

    @Test
    void refreshRequiresHeader() {
        Response response = target("/auth/refresh")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity("", MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("VALIDATION_FAILED");
        assertThat(payload.getFieldErrors()).containsEntry("refreshToken", "VALIDATION_REQUIRED");
    }

    @Test
    void refreshRejectsAccessToken() {
        HrJwtConfig jwtConfig = new HrJwtConfig();
        jwtConfig.setSecret("test-secret-for-auth-resource-should-be-long-enough");
        jwtConfig.setExpiration(1_800_000L);
        jwtConfig.setRefreshExpiration(604_800_000L);
        String accessToken = new HrJwtService(jwtConfig).generateToken("steven.king", List.of("ROLE_ADMIN"), 100);

        Response response = target("/auth/refresh")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Refresh-Token", accessToken)
                .post(Entity.entity("", MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("REFRESH_TOKEN_INVALID");
        assertThat(payload.getError()).isEqualTo("Invalid or expired refresh token.");
    }

    @Test
    void invalidCredentialsReturnUnauthorizedEnvelope() {
        HrLoginRequest request = new HrLoginRequest();
        request.setUsername("steven.king");
        request.setPassword("wrong-password");

        Response response = target("/auth/login")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("INVALID_CREDENTIALS");
        assertThat(payload.getError()).isEqualTo("Invalid username or password.");
    }

    private static final class StubAuthRepository extends HrAuthJdbcRepository {

        @Override
        public Optional<HrAuthUserRecord> findByUsername(String username) {
            return Optional.of(new HrAuthUserRecord(
                    1,
                    100,
                    username,
                    PASSWORD_HASH,
                    true,
                    Instant.parse("2026-03-25T08:15:00Z"),
                    "Steven King",
                    List.of("ROLE_ADMIN", "ROLE_MANAGER")
            ));
        }

        @Override
        public void updateLastLogin(Integer userId, Instant lastLogin) {
            // No-op for resource contract tests.
        }
    }
}
