package com.company.hr.resource;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrDashboardSummaryDTO;
import com.company.hr.dto.response.HrDepartmentDTO;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.repository.HrDashboardSummaryJdbcRepository;
import com.company.hr.repository.HrDepartmentJdbcRepository;
import com.company.hr.repository.HrJobJdbcRepository;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HrReadOnlyResourceTest extends JerseyTest {

    @Override
    protected Application configure() {
        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(new StubJobRepository()).to(HrJobJdbcRepository.class);
                        bind(new StubDepartmentRepository()).to(HrDepartmentJdbcRepository.class);
                        bind(new StubDashboardRepository()).to(HrDashboardSummaryJdbcRepository.class);
                    }
                })
                .register(HrJobResource.class)
                .register(HrDepartmentResource.class)
                .register(HrDashboardResource.class);
    }

    @Test
    void jobsEndpointReturnsEnvelope() {
        Response response = target("/jobs")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<List<HrJobDTO>> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).hasSize(1);
        assertThat(payload.getData().get(0).getJobId()).isEqualTo("IT_PROG");
    }

    @Test
    void departmentsEndpointReturnsEnvelope() {
        Response response = target("/departments")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<List<HrDepartmentDTO>> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).hasSize(1);
        assertThat(payload.getData().get(0).getDepartmentName()).isEqualTo("Engineering");
    }

    @Test
    void dashboardSummaryEndpointReturnsEnvelope() {
        Response response = target("/dashboard/summary")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<HrDashboardSummaryDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData().getTotalHeadcount()).isEqualTo(42);
        assertThat(payload.getData().getHeadcountByStatus()).hasSize(1);
    }

    private static final class StubJobRepository extends HrJobJdbcRepository {
        @Override
        public List<HrJobDTO> findAll() {
            return List.of(new HrJobDTO("IT_PROG", "Software Engineer", new BigDecimal("4000"), new BigDecimal("11000")));
        }
    }

    private static final class StubDepartmentRepository extends HrDepartmentJdbcRepository {
        @Override
        public List<HrDepartmentDTO> findAll() {
            return List.of(new HrDepartmentDTO(
                    60,
                    "Engineering",
                    104,
                    "Alexander Hunold",
                    1400,
                    "Southlake",
                    90,
                    "Executive Leadership",
                    List.of(),
                    14
            ));
        }
    }

    private static final class StubDashboardRepository extends HrDashboardSummaryJdbcRepository {
        @Override
        public HrDashboardSummaryDTO fetchSummary() {
            return buildSummary();
        }

        @Override
        public HrDashboardSummaryDTO fetchSummary(Integer currentEmployeeId, boolean managerScoped) {
            return buildSummary();
        }

        private HrDashboardSummaryDTO buildSummary() {
            HrDashboardSummaryDTO dto = new HrDashboardSummaryDTO();
            dto.setTotalHeadcount(42);
            dto.setActiveCount(40);
            dto.setOnLeaveCount(1);
            dto.setProbationCount(1);
            dto.setHeadcountByStatus(List.of(new HrDashboardSummaryDTO.StatusCount("ACTIVE", 40)));
            dto.setHeadcountByDepartment(List.of(new HrDashboardSummaryDTO.DeptCount("Engineering", 20)));
            return dto;
        }
    }
}
