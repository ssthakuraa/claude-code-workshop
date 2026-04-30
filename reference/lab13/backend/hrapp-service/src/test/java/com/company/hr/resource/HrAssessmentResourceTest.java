package com.company.hr.resource;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityContext;
import com.company.hr.common.security.HrSecurityContextHolder;
import com.company.hr.dto.response.HrAssessmentDirectoryRowDTO;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.repository.HrAssessmentDirectoryJdbcRepository;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HrAssessmentResourceTest extends JerseyTest {

    @Override
    protected Application configure() {
        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(new StubAssessmentDirectoryRepository()).to(HrAssessmentDirectoryJdbcRepository.class);
                    }
                })
                .register(HrApplicationExceptionMapper.class)
                .register(TestSecurityFilter.class)
                .register(HrAssessmentResource.class);
    }

    @Test
    void hrSpecialistCanViewAssessmentsDirectory() {
        Response response = target("/assessments")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Test-Roles", "ROLE_HR_SPECIALIST")
                .header("X-Test-Employee-Id", "205")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrPagedResponse<HrAssessmentDirectoryRowDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).hasSize(1);
        assertThat(payload.getData().get(0).getEmployeeName()).isEqualTo("Lex De Haan");
    }

    @Test
    void managerCanViewAssessmentsDirectory() {
        Response response = target("/assessments")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Test-Roles", "ROLE_MANAGER")
                .header("X-Test-Employee-Id", "101")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
    }

    @Test
    void employeeCannotViewAssessmentsDirectory() {
        Response response = target("/assessments")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("X-Test-Roles", "ROLE_EMPLOYEE")
                .header("X-Test-Employee-Id", "104")
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.FORBIDDEN.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("ACCESS_DENIED");
    }

    private static final class StubAssessmentDirectoryRepository extends HrAssessmentDirectoryJdbcRepository {
        @Override
        public HrPagedResponse<HrAssessmentDirectoryRowDTO> findAll(int page,
                                                                    int size,
                                                                    String search,
                                                                    String reviewStatus,
                                                                    String cycleCode,
                                                                    Integer departmentId,
                                                                    Integer reviewerUserId,
                                                                    Integer currentEmployeeId,
                                                                    boolean managerScoped) {
            HrAssessmentDirectoryRowDTO dto = new HrAssessmentDirectoryRowDTO();
            dto.setAssessmentId(501L);
            dto.setEmployeeId(102);
            dto.setEmployeeName("Lex De Haan");
            dto.setDepartmentId(90);
            dto.setDepartmentName("Executive");
            dto.setCycleCode("FY2026-H1");
            dto.setCycleLabel("FY2026 H1");
            dto.setReviewStatus("SUBMITTED");
            dto.setReviewerUserId(7);
            dto.setReviewerName("Steven King");
            dto.setSubmittedAt(LocalDateTime.parse("2026-04-10T09:00:00"));
            dto.setUpdatedAt(LocalDateTime.parse("2026-04-10T09:30:00"));
            return HrPagedResponse.of(List.of(dto), 1, 1, 0, size);
        }
    }

    @Provider
    public static final class TestSecurityFilter implements ContainerRequestFilter, ContainerResponseFilter {

        @Override
        public void filter(ContainerRequestContext requestContext) {
            HrSecurityContextHolder.clear();
            String rolesHeader = requestContext.getHeaderString("X-Test-Roles");
            String employeeIdHeader = requestContext.getHeaderString("X-Test-Employee-Id");
            List<String> roles = rolesHeader == null || rolesHeader.isBlank()
                    ? List.of()
                    : List.of(rolesHeader.split(","));
            Integer employeeId = employeeIdHeader == null || employeeIdHeader.isBlank()
                    ? null
                    : Integer.parseInt(employeeIdHeader);
            HrSecurityContextHolder.setContext(new HrSecurityContext("tester", employeeId, roles));
        }

        @Override
        public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
            HrSecurityContextHolder.clear();
        }
    }
}
