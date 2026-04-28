package com.company.hr.test;

import com.company.hr.common.response.HrApiResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JerseyFoundationTest extends JerseyTest {

    @Override
    protected ResourceConfig configure() {
        return new ResourceConfig(TestHealthResource.class)
                .property(ServerProperties.WADL_FEATURE_DISABLE, true);
    }

    @Test
    void healthEndpoint_returnsHrApiResponseEnvelope() {
        Response response = target("/app/hr/api/v1/test/health")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<String> payload = response.readEntity(new GenericType<HrApiResponse<String>>() {});
        assertThat(payload.getStatus()).isEqualTo(200);
        assertThat(payload.getData()).isEqualTo("ok");
        assertThat(payload.getError()).isNull();
    }

    @Path("/app/hr/api/v1/test")
    @Produces(MediaType.APPLICATION_JSON)
    public static class TestHealthResource {

        @GET
        @Path("health")
        public Response check() {
            return Response.ok(HrApiResponse.success("ok")).build();
        }
    }
}
