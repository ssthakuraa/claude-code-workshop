package com.company.hr.resource;

import com.company.hr.common.exception.HrApplicationException;
import com.company.hr.common.exception.HrAccessDeniedException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.exception.HrValidationException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.common.format.HrFormatter;
import com.company.hr.dto.request.HrEmployeeCreateRequest;
import com.company.hr.dto.request.HrPromoteRequest;
import com.company.hr.dto.request.HrTerminateRequest;
import com.company.hr.dto.request.HrTransferRequest;
import com.company.hr.dto.response.HrEmployeeDetailDTO;
import com.company.hr.dto.response.HrEmployeeSummaryDTO;
import com.company.hr.repository.HrEmployeeCommandJdbcRepository;
import com.company.hr.repository.HrEmployeeJdbcRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Jersey employee list/detail resource preserving the current frontend contract.
 */
@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HrEmployeeResource {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrEmployeeResource.class);
    private final HrEmployeeJdbcRepository repository;
    private final HrEmployeeCommandJdbcRepository commandRepository;
    private final HrFormatter formatter;

    public HrEmployeeResource() {
        this(new HrEmployeeJdbcRepository(), new HrEmployeeCommandJdbcRepository(), new HrFormatter());
    }

    HrEmployeeResource(HrEmployeeJdbcRepository repository, HrFormatter formatter) {
        this(repository, new HrEmployeeCommandJdbcRepository(), formatter);
    }

    @Inject
    HrEmployeeResource(HrEmployeeJdbcRepository repository,
                       HrEmployeeCommandJdbcRepository commandRepository,
                       HrFormatter formatter) {
        this.repository = repository;
        this.commandRepository = commandRepository;
        this.formatter = formatter;
    }

    @GET
    public HrPagedResponse<HrEmployeeSummaryDTO> findAll(@DefaultValue("0") @QueryParam("page") int page,
                                                         @DefaultValue("10") @QueryParam("size") int size,
                                                         @DefaultValue("lastName") @QueryParam("sort") String sort,
                                                         @QueryParam("search") String search,
                                                         @QueryParam("departmentId") Integer departmentId,
                                                         @QueryParam("status") String status,
                                                         @QueryParam("hireDateFrom") String hireDateFrom,
                                                         @QueryParam("hireDateTo") String hireDateTo) {
        LocalDate parsedHireDateFrom = parseDateQueryParam("hireDateFrom", hireDateFrom);
        LocalDate parsedHireDateTo = parseDateQueryParam("hireDateTo", hireDateTo);
        validateHireDateRange(parsedHireDateFrom, parsedHireDateTo);

        try {
            HrEmployeeJdbcRepository.EmployeePage result = repository.findAll(
                    page,
                    size,
                    sort,
                    search,
                    departmentId,
                    status,
                    parsedHireDateFrom,
                    parsedHireDateTo
            );
            List<HrEmployeeSummaryDTO> masked = result.employees().stream()
                    .map(this::maskSummary)
                    .toList();
            return HrPagedResponse.of(masked, result.totalElements(), result.totalPages(), result.currentPage(), result.pageSize());
        } catch (IllegalStateException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @GET
    @Path("/{id}")
    public HrApiResponse<HrEmployeeDetailDTO> findById(@PathParam("id") Integer employeeId) {
        try {
            HrEmployeeDetailDTO employee = repository.findById(employeeId)
                    .map(this::maskDetail)
                    .orElseThrow(() -> new HrResourceNotFoundException("Employee", employeeId));
            return HrApiResponse.success(employee);
        } catch (HrResourceNotFoundException ex) {
            throw ex;
        } catch (IllegalStateException ex) {
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    public Response hire(HrEmployeeCreateRequest request) {
        requireAdminOrHrSpecialist();
        validateCreateRequest(request);
        try {
            Integer employeeId = commandRepository.hireEmployee(request);
            LOGGER.info("Employee hire completed for employeeId={}", employeeId);
            return Response.status(Response.Status.CREATED)
                    .entity(HrApiResponse.created(loadAndMask(employeeId), null))
                    .build();
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to hire employee", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/terminate")
    public Response terminate(HrTerminateRequest request) {
        requireAdminOrHrSpecialist();
        validateTerminateRequest(request);
        try {
            Integer employeeId = commandRepository.terminateEmployee(request);
            LOGGER.info("Employee termination completed for employeeId={}", employeeId);
            return Response.ok(HrApiResponse.success(loadAndMaskIncludingDeleted(employeeId))).build();
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to terminate employee", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/promote")
    public Response promote(HrPromoteRequest request) {
        requireAdminOrHrSpecialist();
        validatePromoteRequest(request);
        try {
            Integer employeeId = commandRepository.promoteEmployee(request);
            LOGGER.info("Employee promotion completed for employeeId={}", employeeId);
            return Response.ok(HrApiResponse.success(loadAndMask(employeeId))).build();
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to promote employee", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    @POST
    @Path("/transfer")
    public Response transfer(HrTransferRequest request) {
        requireAdminOrHrSpecialist();
        validateTransferRequest(request);
        try {
            Integer employeeId = commandRepository.transferEmployee(request);
            LOGGER.info("Employee transfer completed for employeeId={}", employeeId);
            return Response.ok(HrApiResponse.success(loadAndMask(employeeId))).build();
        } catch (IllegalStateException ex) {
            LOGGER.error("Failed to transfer employee", ex);
            throw new HrApplicationException("DB_ACCESS_ERROR", ex);
        }
    }

    private HrEmployeeSummaryDTO maskSummary(HrEmployeeSummaryDTO employee) {
        Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
        boolean canViewPii = HrSecurityUtil.canViewPii(employee.getEmployeeId(), currentEmployeeId);
        boolean canViewSalary = HrSecurityUtil.canViewSalary(
                employee.getEmployeeId(),
                currentEmployeeId,
                currentEmployeeId != null && currentEmployeeId.equals(employee.getManagerId())
        );

        if (!canViewPii) {
            employee.setEmail(formatter.maskEmail(employee.getEmail()));
        }
        if (!canViewSalary) {
            employee.setSalary(null);
        }
        return employee;
    }

    private HrEmployeeDetailDTO maskDetail(HrEmployeeDetailDTO employee) {
        Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
        boolean canViewPii = HrSecurityUtil.canViewPii(employee.getEmployeeId(), currentEmployeeId);
        boolean canViewSalary = HrSecurityUtil.canViewSalary(
                employee.getEmployeeId(),
                currentEmployeeId,
                currentEmployeeId != null && currentEmployeeId.equals(employee.getManagerId())
        );

        if (!canViewPii) {
            employee.setEmail(formatter.maskEmail(employee.getEmail()));
            employee.setPhoneNumber(null);
        }
        if (!canViewSalary) {
            employee.setSalary(null);
            employee.setCommissionPct(null);
        }
        if (employee.getJobHistory() == null) {
            employee.setJobHistory(List.of());
        }
        return employee;
    }

    private HrEmployeeDetailDTO loadAndMask(Integer employeeId) {
        HrEmployeeDetailDTO employee = repository.findById(employeeId)
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", employeeId));
        return maskDetail(employee);
    }

    private HrEmployeeDetailDTO loadAndMaskIncludingDeleted(Integer employeeId) {
        HrEmployeeDetailDTO employee = repository.findByIdIncludingDeleted(employeeId)
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", employeeId));
        return maskDetail(employee);
    }

    private void requireAdminOrHrSpecialist() {
        if (!HrSecurityUtil.isAdminOrHrSpecialist()) {
            LOGGER.warn("Rejected employee workflow request for non-privileged caller");
            throw new HrAccessDeniedException();
        }
    }

    private void validateCreateRequest(HrEmployeeCreateRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
        } else {
            requireNotBlank(fieldErrors, "lastName", request.getLastName(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "email", request.getEmail(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "jobId", request.getJobId(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "initialPassword", request.getInitialPassword(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "idempotencyKey", request.getIdempotencyKey(), "VALIDATION_REQUIRED");
            requireNotNull(fieldErrors, "hireDate", request.getHireDate(), "VALIDATION_REQUIRED");
            if (request.getInitialPassword() != null && request.getInitialPassword().length() < 8) {
                fieldErrors.put("initialPassword", "VALIDATION_MIN_LENGTH_8");
            }
            if (request.getSalary() != null && request.getSalary().compareTo(BigDecimal.ZERO) <= 0) {
                fieldErrors.put("salary", "VALIDATION_POSITIVE_NUMBER");
            }
            if (request.getCommissionPct() != null && request.getCommissionPct().compareTo(BigDecimal.ZERO) < 0) {
                fieldErrors.put("commissionPct", "VALIDATION_NON_NEGATIVE");
            }
            if (request.getCommissionPct() != null && request.getCommissionPct().compareTo(BigDecimal.ONE) > 0) {
                fieldErrors.put("commissionPct", "VALIDATION_MAX_VALUE_1");
            }
            if (request.getEmploymentType() != null
                    && "CONTRACT".equals(request.getEmploymentType().name())
                    && request.getContractEndDate() == null) {
                fieldErrors.put("contractEndDate", "VALIDATION_REQUIRED_FOR_CONTRACT");
            }
        }
        throwIfValidationFailed(fieldErrors);
    }

    private void validateTerminateRequest(HrTerminateRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
        } else {
            requireNotNull(fieldErrors, "employeeId", request.getEmployeeId(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "reason", request.getReason(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "idempotencyKey", request.getIdempotencyKey(), "VALIDATION_REQUIRED");
        }
        throwIfValidationFailed(fieldErrors);
    }

    private void validatePromoteRequest(HrPromoteRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
        } else {
            requireNotNull(fieldErrors, "employeeId", request.getEmployeeId(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "newJobId", request.getNewJobId(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "idempotencyKey", request.getIdempotencyKey(), "VALIDATION_REQUIRED");
            if (request.getNewSalary() != null && request.getNewSalary().compareTo(BigDecimal.ZERO) <= 0) {
                fieldErrors.put("newSalary", "VALIDATION_POSITIVE_NUMBER");
            }
        }
        throwIfValidationFailed(fieldErrors);
    }

    private void validateTransferRequest(HrTransferRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        if (request == null) {
            fieldErrors.put("request", "VALIDATION_REQUIRED");
        } else {
            requireNotNull(fieldErrors, "employeeId", request.getEmployeeId(), "VALIDATION_REQUIRED");
            requireNotNull(fieldErrors, "newDepartmentId", request.getNewDepartmentId(), "VALIDATION_REQUIRED");
            requireNotBlank(fieldErrors, "idempotencyKey", request.getIdempotencyKey(), "VALIDATION_REQUIRED");
        }
        throwIfValidationFailed(fieldErrors);
    }

    private void requireNotBlank(Map<String, String> fieldErrors, String field, String value, String message) {
        if (value == null || value.isBlank()) {
            fieldErrors.put(field, message);
        }
    }

    private void requireNotNull(Map<String, String> fieldErrors, String field, Object value, String message) {
        if (value == null) {
            fieldErrors.put(field, message);
        }
    }

    private void throwIfValidationFailed(Map<String, String> fieldErrors) {
        if (!fieldErrors.isEmpty()) {
            throw new HrValidationException(fieldErrors);
        }
    }

    private LocalDate parseDateQueryParam(String field, String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException ex) {
            throw new HrValidationException(Map.of(field, "VALIDATION_INVALID_DATE"));
        }
    }

    private void validateHireDateRange(LocalDate hireDateFrom, LocalDate hireDateTo) {
        if (hireDateFrom != null && hireDateTo != null && hireDateFrom.isAfter(hireDateTo)) {
            throw new HrValidationException(Map.of("hireDateFrom", "VALIDATION_DATE_RANGE"));
        }
    }
}
