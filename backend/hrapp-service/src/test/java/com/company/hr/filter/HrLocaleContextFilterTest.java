package com.company.hr.filter;

import com.company.hr.common.i18n.HrLocaleContextHolder;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrJwtConfig;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.repository.HrUserPreferencesJdbcRepository;
import com.company.hr.security.HrJwtRequestFilter;
import com.company.hr.security.HrJwtService;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class HrLocaleContextFilterTest extends JerseyTest {

    private HrJwtService jwtService;

    @Override
    protected Application configure() {
        HrJwtConfig jwtConfig = new HrJwtConfig();
        jwtConfig.setSecret("test-secret-for-locale-filter-should-be-long-enough");
        jwtConfig.setExpiration(1_800_000L);
        jwtConfig.setRefreshExpiration(604_800_000L);
        jwtService = new HrJwtService(jwtConfig);

        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new HrJwtRequestFilter(jwtService))
                .register(new HrLocaleContextFilter(new StubUserPreferencesRepository()))
                .register(HrApplicationExceptionMapper.class)
                .register(LocaleResource.class);
    }

    @Test
    void publicRequestUsesAcceptLanguageWhenNoUserPreferenceExists() {
        Response response = target("/auth/locale")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("Accept-Language", "fr-FR,fr;q=0.8,en;q=0.5")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<String> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).isEqualTo("fr-FR");
        assertThat(response.getHeaderString("Content-Language")).isEqualTo("fr-FR");
    }

    @Test
    void authenticatedRequestPrefersSavedLocaleOverAcceptLanguage() {
        String accessToken = jwtService.generateToken("steven.king", List.of("ROLE_ADMIN"), 100);

        Response response = target("/secure/locale")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept-Language", "fr-FR,fr;q=0.8")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<String> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).isEqualTo("hi-IN");
        assertThat(response.getHeaderString("Content-Language")).isEqualTo("hi-IN");
    }

    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public static class LocaleResource {

        @GET
        @Path("/auth/locale")
        public HrApiResponse<String> publicLocale() {
            return HrApiResponse.success(HrLocaleContextHolder.getLocaleCode());
        }

        @GET
        @Path("/secure/locale")
        public HrApiResponse<String> securedLocale() {
            return HrApiResponse.success(HrLocaleContextHolder.getLocaleCode());
        }
    }

    private static final class StubUserPreferencesRepository extends HrUserPreferencesJdbcRepository {

        @Override
        public Optional<String> findLanguageForUsername(String username) {
            if ("steven.king".equalsIgnoreCase(username)) {
                return Optional.of("hi-IN");
            }
            return Optional.empty();
        }
    }
}
