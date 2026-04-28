package com.company.hr.resource;

import com.company.hr.common.security.HrSecurityContext;
import com.company.hr.common.security.HrSecurityContextHolder;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.format.HrFormatter;
import com.company.hr.dto.request.HrEmployeeCreateRequest;
import com.company.hr.dto.request.HrTerminateRequest;
import com.company.hr.dto.response.HrEmployeeDetailDTO;
import com.company.hr.dto.response.HrEmployeeSummaryDTO;
import com.company.hr.dto.response.HrJobHistoryDTO;
import com.company.hr.exception.HrApplicationExceptionMapper;
import com.company.hr.repository.HrEmployeeCommandJdbcRepository;
import com.company.hr.repository.HrEmployeeJdbcRepository;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.client.Entity;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class HrEmployeeResourceTest extends JerseyTest {

    private final StubEmployeeRepository employeeRepository = new StubEmployeeRepository();

    @Override
    protected Application configure() {
        return new ResourceConfig()
                .property(ServerProperties.WADL_FEATURE_DISABLE, true)
                .register(HrApplicationExceptionMapper.class)
                .register(TestAdminSecurityFilter.class)
                .register(new AbstractBinder() {
                    @Override
                    protected void configure() {
                        bind(employeeRepository).to(HrEmployeeJdbcRepository.class);
                        bind(new StubEmployeeCommandRepository()).to(HrEmployeeCommandJdbcRepository.class);
                        bind(new HrFormatter()).to(HrFormatter.class);
                    }
                })
                .register(HrEmployeeResource.class);
    }

    @Test
    void employeesEndpointReturnsPagedEnvelopeAndManagerId() {
        Response response = target("/employees")
                .queryParam("page", 0)
                .queryParam("size", 10)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrPagedResponse<HrEmployeeSummaryDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData()).hasSize(1);
        assertThat(payload.getTotalElements()).isEqualTo(1);
        assertThat(payload.getData().get(0).getManagerId()).isEqualTo(100);
        assertThat(payload.getData().get(0).getSalary()).isNull();
        assertThat(payload.getData().get(0).getEmail()).contains("@");
    }

    @Test
    void employeesEndpointAcceptsDashboardDrillDownFilters() {
        Response response = target("/employees")
                .queryParam("search", "india")
                .queryParam("status", "ACTIVE")
                .queryParam("hireDateFrom", "2026-04-01")
                .queryParam("hireDateTo", "2026-04-30")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
        assertThat(employeeRepository.lastSearch).isEqualTo("india");
        assertThat(employeeRepository.lastStatus).isEqualTo("ACTIVE");
        assertThat(employeeRepository.lastHireDateFrom).isEqualTo(LocalDate.parse("2026-04-01"));
        assertThat(employeeRepository.lastHireDateTo).isEqualTo(LocalDate.parse("2026-04-30"));
    }

    @Test
    void employeeDetailEndpointReturnsEmbeddedJobHistory() {
        Response response = target("/employees/101")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());

        HrApiResponse<HrEmployeeDetailDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getData().getEmployeeId()).isEqualTo(101);
        assertThat(payload.getData().getJobHistory()).hasSize(1);
        assertThat(payload.getData().getJobHistory().get(0).getJobId()).isEqualTo("AD_VP");
    }

    @Test
    void hireEndpointReturnsCreatedEnvelope() {
        HrEmployeeCreateRequest request = new HrEmployeeCreateRequest();
        request.setFirstName("Neena");
        request.setLastName("Kochhar");
        request.setEmail("neena.kochhar@example.com");
        request.setHireDate(LocalDate.parse("2015-09-21"));
        request.setJobId("AD_VP");
        request.setInitialPassword("password123");
        request.setIdempotencyKey("hire-1");

        Response response = target("/employees")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.CREATED.getStatusCode());

        HrApiResponse<HrEmployeeDetailDTO> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getMessage()).isNull();
        assertThat(payload.getData().getEmployeeId()).isEqualTo(101);
    }

    @Test
    void terminateEndpointValidatesBody() {
        HrTerminateRequest request = new HrTerminateRequest();
        request.setEmployeeId(101);

        Response response = target("/employees/terminate")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());

        HrApiResponse<Void> payload = response.readEntity(new GenericType<>() {
        });
        assertThat(payload.getErrorCode()).isEqualTo("VALIDATION_FAILED");
        assertThat(payload.getFieldErrors()).isEqualTo(Map.of(
                "reason", "VALIDATION_REQUIRED",
                "idempotencyKey", "VALIDATION_REQUIRED"
        ));
    }

    private static final class StubEmployeeRepository extends HrEmployeeJdbcRepository {
        private String lastSearch;
        private String lastStatus;
        private LocalDate lastHireDateFrom;
        private LocalDate lastHireDateTo;

        @Override
        public EmployeePage findAll(int page, int size, String sort, String search, Integer departmentId, String status) {
            return findAll(page, size, sort, search, departmentId, status, null, null);
        }

        @Override
        public EmployeePage findAll(int page,
                                    int size,
                                    String sort,
                                    String search,
                                    Integer departmentId,
                                    String status,
                                    LocalDate hireDateFrom,
                                    LocalDate hireDateTo) {
            lastSearch = search;
            lastStatus = status;
            lastHireDateFrom = hireDateFrom;
            lastHireDateTo = hireDateTo;
            HrEmployeeSummaryDTO employee = new HrEmployeeSummaryDTO();
            employee.setEmployeeId(101);
            employee.setFirstName("Neena");
            employee.setLastName("Kochhar");
            employee.setFullName("Neena Kochhar");
            employee.setEmail("neena.kochhar@example.com");
            employee.setJobId("AD_VP");
            employee.setJobTitle("Administration Vice President");
            employee.setDepartmentId(90);
            employee.setDepartmentName("Executive");
            employee.setManagerId(100);
            employee.setManagerName("Steven King");
            employee.setEmploymentStatus("ACTIVE");
            employee.setEmploymentType("FULL_TIME");
            employee.setSalary(new BigDecimal("17000"));
            employee.setHireDate(LocalDate.parse("2015-09-21"));
            return new EmployeePage(List.of(employee), 1, 1, 0, 10);
        }

        @Override
        public Optional<HrEmployeeDetailDTO> findById(Integer employeeId) {
            if (!Integer.valueOf(101).equals(employeeId)) {
                return Optional.empty();
            }

            HrEmployeeDetailDTO employee = new HrEmployeeDetailDTO();
            employee.setEmployeeId(101);
            employee.setFirstName("Neena");
            employee.setLastName("Kochhar");
            employee.setFullName("Neena Kochhar");
            employee.setEmail("neena.kochhar@example.com");
            employee.setPhoneNumber("515.123.4568");
            employee.setHireDate(LocalDate.parse("2015-09-21"));
            employee.setJobId("AD_VP");
            employee.setJobTitle("Administration Vice President");
            employee.setSalary(new BigDecimal("17000"));
            employee.setCommissionPct(new BigDecimal("0.10"));
            employee.setManagerId(100);
            employee.setManagerName("Steven King");
            employee.setDepartmentId(90);
            employee.setDepartmentName("Executive");
            employee.setLocationCity("Seattle");
            employee.setEmploymentStatus("ACTIVE");
            employee.setEmploymentType("FULL_TIME");

            HrJobHistoryDTO history = new HrJobHistoryDTO();
            history.setStartDate(LocalDate.parse("2015-09-21"));
            history.setEndDate(LocalDate.parse("2016-09-20"));
            history.setJobId("AD_VP");
            history.setJobTitle("Administration Vice President");
            history.setDepartmentId(90);
            history.setDepartmentName("Executive");
            employee.setJobHistory(List.of(history));

            return Optional.of(employee);
        }
    }

    private static final class StubEmployeeCommandRepository extends HrEmployeeCommandJdbcRepository {
        @Override
        public Integer hireEmployee(HrEmployeeCreateRequest request) {
            return 101;
        }
    }

    @Provider
    public static final class TestAdminSecurityFilter implements ContainerRequestFilter, ContainerResponseFilter {

        @Override
        public void filter(ContainerRequestContext requestContext) {
            HrSecurityContextHolder.clear();
            if ("POST".equalsIgnoreCase(requestContext.getMethod())) {
                HrSecurityContextHolder.setContext(new HrSecurityContext("admin", 100, List.of("ROLE_ADMIN")));
            }
        }

        @Override
        public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
            HrSecurityContextHolder.clear();
        }
    }
}
