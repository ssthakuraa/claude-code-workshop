package com.company.hr.test;

import com.company.hr.HrApplicationConfig;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.config.HrRuntimeConfig;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies the Jersey bootstrap wiring via the health endpoint.
 */
public class HrHealthResourceIT extends JerseyTest {

    @Override
    protected Application configure() {
        HrRuntimeConfig runtimeConfig = new HrRuntimeConfig("localhost", 0, "/app/hr/api/v1", List.of("*"));
        return new HrApplicationConfig(runtimeConfig);
    }

    @Test
    void healthEndpointReturnsApiEnvelope() {
        Response response = target("/app/hr/api/v1/health")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<Map<String, Object>> payload = response.readEntity(
                new GenericType<>() {
                }
        );

        assertThat(payload.getStatus()).isEqualTo(200);
        assertThat(payload.getData()).containsEntry("status", "UP").containsKey("timestamp");
    }
}
