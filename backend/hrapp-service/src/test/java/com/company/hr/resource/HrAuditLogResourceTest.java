package com.company.hr.resource;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityContext;
import com.company.hr.common.security.HrSecurityContextHolder;
import com.company.hr.dto.response.HrAuditLogDTO;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.repository.HrAuditLogJdbcRepository;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HrAuditLogResourceTest extends JerseyTest {

    @Override
    protected Application configure() {
        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(new StubAuditLogRepository()).to(HrAuditLogJdbcRepository.class);
                    }
                })
                .register(HrApplicationExceptionMapper.class)
                .register(TestSecurityFilter.class)
                .register(HrAuditLogResource.class);
    }

    @Test
    void adminCanViewAuditLogs() {
        Response response = target("/audit-logs")
                .queryParam("page", 0)
                .queryParam("size", 20)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Test-Roles", "ROLE_ADMIN")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrPagedResponse<HrAuditLogDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).hasSize(1);
        assertThat(payload.getData().get(0).getTableName()).isEqualTo("employees");
    }

    @Test
    void employeeCannotViewAuditLogs() {
        Response response = target("/audit-logs")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Test-Roles", "ROLE_EMPLOYEE")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.FORBIDDEN.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("ACCESS_DENIED");
    }

    private static final class StubAuditLogRepository extends HrAuditLogJdbcRepository {
        @Override
        public HrPagedResponse<HrAuditLogDTO> findAll(int page, int size, String tableName) {
            HrAuditLogDTO dto = new HrAuditLogDTO();
            dto.setAuditId(1L);
            dto.setTableName("employees");
            dto.setRecordId("101");
            dto.setAction("UPDATE");
            dto.setChangedBy(100);
            dto.setChangedAt(Instant.parse("2026-04-11T08:15:00Z"));
            return HrPagedResponse.of(List.of(dto), 1, 1, 0, 20);
        }
    }

    @Provider
    public static final class TestSecurityFilter implements ContainerRequestFilter, ContainerResponseFilter {

        @Override
        public void filter(ContainerRequestContext requestContext) {
            HrSecurityContextHolder.clear();
            String rolesHeader = requestContext.getHeaderString("X-Test-Roles");
            List<String> roles = rolesHeader == null || rolesHeader.isBlank()
                    ? List.of()
                    : List.of(rolesHeader.split(","));
            HrSecurityContextHolder.setContext(new HrSecurityContext("tester", 100, roles));
        }

        @Override
        public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
            HrSecurityContextHolder.clear();
        }
    }
}
