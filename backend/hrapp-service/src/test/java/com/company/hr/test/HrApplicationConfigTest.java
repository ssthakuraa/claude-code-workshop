package com.company.hr.test;

import com.company.hr.HrApplicationConfig;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrRuntimeConfig;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class HrApplicationConfigTest extends JerseyTest {

    private static String originalAllowRestrictedHeaders;

    private HrRuntimeConfig runtimeConfig;
    private HrApplicationConfig applicationConfig;

    @BeforeAll
    static void allowOriginHeaderInJerseyClient() {
        originalAllowRestrictedHeaders = System.getProperty("sun.net.http.allowRestrictedHeaders");
        System.setProperty("sun.net.http.allowRestrictedHeaders", "true");
    }

    @AfterAll
    static void restoreRestrictedHeaderSetting() {
        if (originalAllowRestrictedHeaders == null) {
            System.clearProperty("sun.net.http.allowRestrictedHeaders");
            return;
        }
        System.setProperty("sun.net.http.allowRestrictedHeaders", originalAllowRestrictedHeaders);
    }

    @Override
    protected Application configure() {
        runtimeConfig = new HrRuntimeConfig(
                "localhost",
                0,
                "/app/hr/api/v1",
                List.of("http://localhost:5182", "http://127.0.0.1:*")
        );
        applicationConfig = new HrApplicationConfig(runtimeConfig);
        return applicationConfig;
    }

    @Test
    void healthEndpointUsesBasePathAndDefaultCorsOrigin() {
        Response response = target("/health")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        assertThat(applicationConfig.getProperty("hr.runtime.basePath"))
                .isEqualTo(runtimeConfig.basePath());

        HrApiResponse<Map<String, Object>> payload = response.readEntity(new GenericType<>() {
        });

        assertThat(payload.getStatus()).isEqualTo(200);
        assertThat(payload.getData()).containsEntry("service", "hrapp-service").containsEntry("status", "UP");
        assertThat(response.getHeaderString("Access-Control-Allow-Origin")).isEqualTo("http://localhost:5182");
        assertThat(response.getHeaderString("Content-Language")).isEqualTo("en-US");
        assertThat(response.getHeaderString("Vary")).isEqualTo("Origin");
    }

    @Test
    void healthEndpointAllowsLoopbackAlternatePortOrigin() throws Exception {
        URI uri = target("/health").getUri();
        HttpRequest request = HttpRequest.newBuilder(uri)
                .header("Accept", MediaType.APPLICATION_JSON)
                .header("Origin", "http://127.0.0.1:5189")
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(Response.Status.OK.getStatusCode());
        assertThat(response.headers().firstValue("Access-Control-Allow-Origin"))
                .hasValue("http://127.0.0.1:5189");
        assertThat(response.headers().firstValue("Vary")).hasValue("Origin");
    }
}
