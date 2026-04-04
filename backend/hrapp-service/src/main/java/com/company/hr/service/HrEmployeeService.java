package com.company.hr.service;

import com.company.hr.common.exception.*;
import com.company.hr.common.format.HrFormatter;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.common.security.HrSecurityUtil;
import com.company.hr.dto.request.*;
import com.company.hr.dto.response.*;
import com.company.hr.model.*;
import com.company.hr.model.HrEmployee.EmploymentStatus;
import com.company.hr.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrEmployeeService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrEmployeeService.class);

    private final HrEmployeeRepository employeeRepository;
    private final HrJobRepository jobRepository;
    private final HrDepartmentRepository departmentRepository;
    private final HrUserRepository userRepository;
    private final HrRoleRepository roleRepository;
    private final HrJobHistoryRepository jobHistoryRepository;
    private final HrIdempotencyKeyRepository idempotencyKeyRepository;
    private final PasswordEncoder passwordEncoder;
    private final HrFormatter formatter;
    private final ObjectMapper objectMapper;

    // =====================================================
    // READ
    // =====================================================

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST','MANAGER','EMPLOYEE')")
    public HrPagedResponse<HrEmployeeSummaryDTO> findAll(Pageable pageable, String search,
                                                          Integer departmentId, String status) {
        LOGGER.info("Entering findAll(page={}, size={}, dept={})", pageable.getPageNumber(), pageable.getPageSize(), departmentId);

        Specification<HrEmployee> spec = buildSpec(search, departmentId, status);

        // MANAGER: scope to direct/indirect reports only
        if (HrSecurityUtil.isManager() && !HrSecurityUtil.isAdminOrHrSpecialist()) {
            Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
            if (currentEmployeeId != null) {
                List<Integer> reportIds = employeeRepository
                        .findDirectAndIndirectReports(currentEmployeeId)
                        .stream().map(HrEmployee::getEmployeeId).collect(Collectors.toList());
                spec = spec.and((root, query, cb) -> root.get("employeeId").in(reportIds));
            }
        }

        Page<HrEmployee> page = employeeRepository.findAll(spec, pageable);
        Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();

        List<HrEmployeeSummaryDTO> dtos = page.getContent().stream()
                .map(e -> toSummaryWithMasking(e, currentEmployeeId))
                .collect(Collectors.toList());

        LOGGER.info("Exiting findAll, found {} employees", page.getTotalElements());
        return HrPagedResponse.of(dtos, page.getTotalElements(),
                page.getTotalPages(), pageable.getPageNumber(), pageable.getPageSize());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST','MANAGER','EMPLOYEE')")
    public HrEmployeeDetailDTO findById(Integer id) {
        LOGGER.info("Entering findById(id={})", id);
        HrEmployee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", id));

        Integer currentEmployeeId = HrSecurityUtil.getCurrentEmployeeId();
        HrEmployeeDetailDTO dto = toDetailWithMasking(employee, currentEmployeeId);
        LOGGER.info("Exiting findById, found: {} {}", employee.getFirstName(), employee.getLastName());
        return dto;
    }

    // =====================================================
    // HIRE
    // =====================================================

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO hireEmployee(HrEmployeeCreateRequest request) {
        LOGGER.info("Entering hireEmployee(email={}, jobId={})", request.getEmail(), request.getJobId());

        // 1. Check idempotency
        checkIdempotency(request.getIdempotencyKey(), "POST /employees/hire");

        // 2. Check email uniqueness
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new HrConflictException("Email already in use.", "EMAIL_EXISTS");
        }

        // 3. Load job and validate salary
        HrJob job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new HrResourceNotFoundException("Job", request.getJobId()));
        validateSalaryForJob(request.getSalary(), job);

        // 4. Load manager if provided
        HrEmployee manager = null;
        if (request.getManagerId() != null) {
            manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Employee (manager)", request.getManagerId()));
        }

        // 5. Load department if provided
        HrDepartment department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Department", request.getDepartmentId()));
        }

        // 6. Create and save employee
        HrEmployee employee = new HrEmployee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setHireDate(request.getHireDate());
        employee.setJob(job);
        employee.setSalary(request.getSalary());
        employee.setCommissionPct(request.getCommissionPct());
        employee.setManager(manager);
        employee.setDepartment(department);
        employee.setEmploymentStatus(request.getEmploymentStatus());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setContractEndDate(request.getContractEndDate());
        employee = employeeRepository.save(employee);

        // 7. Create user account
        createUserForEmployee(employee, request.getUsername(), request.getInitialPassword());

        // 8. Create initial job history entry
        createJobHistoryEntry(employee, job, department, request.getHireDate(), null);

        // 9. Record idempotency
        recordIdempotency(request.getIdempotencyKey(), "POST /employees/hire", 201);

        LOGGER.info("Exiting hireEmployee, hired {} {} (ID={})",
                request.getFirstName(), request.getLastName(), employee.getEmployeeId());
        return toDetailWithMasking(employee, HrSecurityUtil.getCurrentEmployeeId());
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO update(Integer id, HrEmployeeUpdateRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrEmployee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", id));

        if (request.getFirstName() != null) employee.setFirstName(request.getFirstName());
        if (request.getLastName() != null) employee.setLastName(request.getLastName());
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (employeeRepository.existsByEmail(request.getEmail())) {
                throw new HrConflictException("Email already in use.", "EMAIL_EXISTS");
            }
            employee.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) employee.setPhoneNumber(request.getPhoneNumber());
        if (request.getJobId() != null) {
            HrJob job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Job", request.getJobId()));
            employee.setJob(job);
        }
        if (request.getSalary() != null) {
            validateSalaryForJob(request.getSalary(), employee.getJob());
            employee.setSalary(request.getSalary());
        }
        if (request.getCommissionPct() != null) employee.setCommissionPct(request.getCommissionPct());
        if (request.getDepartmentId() != null) {
            employee.setDepartment(departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Department", request.getDepartmentId())));
        }
        if (request.getManagerId() != null) {
            employee.setManager(employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Employee (manager)", request.getManagerId())));
        }
        if (request.getEmploymentType() != null) employee.setEmploymentType(request.getEmploymentType());
        if (request.getContractEndDate() != null) employee.setContractEndDate(request.getContractEndDate());

        HrEmployee updated = employeeRepository.save(employee);
        LOGGER.info("Exiting update, updated employee: {}", updated.getEmployeeId());
        return toDetailWithMasking(updated, HrSecurityUtil.getCurrentEmployeeId());
    }

    // =====================================================
    // TERMINATE
    // =====================================================

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO terminateEmployee(HrTerminateRequest request) {
        LOGGER.info("Entering terminateEmployee(employeeId={})", request.getEmployeeId());
        checkIdempotency(request.getIdempotencyKey(), "POST /employees/terminate");

        HrEmployee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", request.getEmployeeId()));

        if (employee.getEmploymentStatus() == EmploymentStatus.TERMINATED) {
            throw new HrBusinessRuleViolationException(
                    "Employee " + employee.getEmployeeId() + " is already terminated.",
                    "EMPLOYEE_ALREADY_TERMINATED");
        }

        // Close current job history entry
        LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now();
        closeJobHistory(employee, effectiveDate);

        // Soft delete
        employee.setEmploymentStatus(EmploymentStatus.TERMINATED);
        employee.setDeletedAt(Instant.now());
        employeeRepository.save(employee);

        // Deactivate user account
        userRepository.findByEmployee_EmployeeId(employee.getEmployeeId())
                .ifPresent(user -> {
                    user.setActive(false);
                    userRepository.save(user);
                });

        recordIdempotency(request.getIdempotencyKey(), "POST /employees/terminate", 200);
        LOGGER.info("Exiting terminateEmployee, terminated ID={}", employee.getEmployeeId());
        return toDetailWithMasking(employee, HrSecurityUtil.getCurrentEmployeeId());
    }

    // =====================================================
    // PROMOTE
    // =====================================================

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO promoteEmployee(HrPromoteRequest request) {
        LOGGER.info("Entering promoteEmployee(employeeId={})", request.getEmployeeId());
        checkIdempotency(request.getIdempotencyKey(), "POST /employees/promote");

        HrEmployee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", request.getEmployeeId()));
        HrJob newJob = jobRepository.findById(request.getNewJobId())
                .orElseThrow(() -> new HrResourceNotFoundException("Job", request.getNewJobId()));

        LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now();
        validateSalaryForJob(request.getNewSalary(), newJob);

        // Close current job history
        closeJobHistory(employee, effectiveDate.minusDays(1));

        // Update employee
        employee.setJob(newJob);
        if (request.getNewSalary() != null) employee.setSalary(request.getNewSalary());
        employeeRepository.save(employee);

        // Open new job history entry
        createJobHistoryEntry(employee, newJob, employee.getDepartment(), effectiveDate, null);

        recordIdempotency(request.getIdempotencyKey(), "POST /employees/promote", 200);
        LOGGER.info("Exiting promoteEmployee, promoted ID={} to job={}", employee.getEmployeeId(), newJob.getJobId());
        return toDetailWithMasking(employee, HrSecurityUtil.getCurrentEmployeeId());
    }

    // =====================================================
    // TRANSFER
    // =====================================================

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO transferEmployee(HrTransferRequest request) {
        LOGGER.info("Entering transferEmployee(employeeId={})", request.getEmployeeId());
        checkIdempotency(request.getIdempotencyKey(), "POST /employees/transfer");

        HrEmployee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new HrResourceNotFoundException("Employee", request.getEmployeeId()));
        HrDepartment newDept = departmentRepository.findById(request.getNewDepartmentId())
                .orElseThrow(() -> new HrResourceNotFoundException("Department", request.getNewDepartmentId()));

        LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now();

        // Close current job history
        closeJobHistory(employee, effectiveDate.minusDays(1));

        // Update employee
        employee.setDepartment(newDept);
        if (request.getNewManagerId() != null) {
            employee.setManager(employeeRepository.findById(request.getNewManagerId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Employee (manager)", request.getNewManagerId())));
        }
        employeeRepository.save(employee);

        // Open new job history entry
        createJobHistoryEntry(employee, employee.getJob(), newDept, effectiveDate, null);

        recordIdempotency(request.getIdempotencyKey(), "POST /employees/transfer", 200);
        LOGGER.info("Exiting transferEmployee, transferred ID={} to dept={}", employee.getEmployeeId(), newDept.getDepartmentId());
        return toDetailWithMasking(employee, HrSecurityUtil.getCurrentEmployeeId());
    }

    // =====================================================
    // Helpers
    // =====================================================

    private void validateSalaryForJob(BigDecimal salary, HrJob job) {
        if (salary == null || job == null) return;
        if (job.getMinSalary() != null && salary.compareTo(job.getMinSalary()) < 0) {
            throw new HrBusinessRuleViolationException(
                    "Salary " + salary + " is below minimum " + job.getMinSalary() + " for job " + job.getJobId(),
                    "SALARY_BELOW_MINIMUM");
        }
        if (job.getMaxSalary() != null && salary.compareTo(job.getMaxSalary()) > 0) {
            throw new HrBusinessRuleViolationException(
                    "Salary " + salary + " exceeds maximum " + job.getMaxSalary() + " for job " + job.getJobId(),
                    "SALARY_ABOVE_MAXIMUM");
        }
    }

    private void createUserForEmployee(HrEmployee employee, String username, String password) {
        String resolvedUsername = (username != null && !username.isBlank())
                ? username
                : employee.getEmail().split("@")[0];

        if (userRepository.existsByUsername(resolvedUsername)) {
            resolvedUsername = resolvedUsername + "_" + employee.getEmployeeId();
        }

        HrUser user = new HrUser();
        user.setEmployee(employee);
        user.setUsername(resolvedUsername);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setActive(true);

        HrRole employeeRole = roleRepository.findByRoleName("ROLE_EMPLOYEE")
                .orElseThrow(() -> new HrResourceNotFoundException("Role", "ROLE_EMPLOYEE"));
        user.getRoles().add(employeeRole);
        userRepository.save(user);
    }

    private void createJobHistoryEntry(HrEmployee employee, HrJob job, HrDepartment dept,
                                        LocalDate startDate, LocalDate endDate) {
        HrJobHistoryId id = new HrJobHistoryId(employee.getEmployeeId(), startDate);
        HrJobHistory history = new HrJobHistory();
        history.setId(id);
        history.setEmployee(employee);
        history.setJob(job);
        history.setDepartment(dept);
        history.setEndDate(endDate); // null = currently in this role; updated on next action (promote/transfer/terminate)
        jobHistoryRepository.save(history);
    }

    private void closeJobHistory(HrEmployee employee, LocalDate endDate) {
        // Find the most recent open job history entry and close it
        List<HrJobHistory> history = jobHistoryRepository
                .findByEmployee_EmployeeIdOrderByIdStartDateDesc(employee.getEmployeeId());
        if (!history.isEmpty()) {
            HrJobHistory latest = history.get(0);
            latest.setEndDate(endDate);
            jobHistoryRepository.save(latest);
        }
    }

    private void checkIdempotency(String key, String endpoint) {
        if (idempotencyKeyRepository.existsById(key)) {
            throw new HrConflictException(
                    "This request has already been processed (idempotency key: " + key + ").",
                    "DUPLICATE_REQUEST");
        }
    }

    private void recordIdempotency(String key, String endpoint, int status) {
        HrIdempotencyKey record = new HrIdempotencyKey();
        record.setIdempotencyKey(key);
        record.setEndpoint(endpoint);
        record.setResponseStatus(status);
        record.setExpiresAt(Instant.now().plusSeconds(86400)); // 24 hours
        idempotencyKeyRepository.save(record);
    }

    private Specification<HrEmployee> buildSpec(String search, Integer departmentId, String status) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), like),
                        cb.like(cb.lower(root.get("lastName")), like),
                        cb.like(cb.lower(root.get("email")), like)
                ));
            }
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("departmentId"), departmentId));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("employmentStatus"),
                        EmploymentStatus.valueOf(status.toUpperCase())));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private HrEmployeeSummaryDTO toSummaryWithMasking(HrEmployee e, Integer currentEmployeeId) {
        HrEmployeeSummaryDTO dto = new HrEmployeeSummaryDTO();
        dto.setEmployeeId(e.getEmployeeId());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setFullName(formatter.formatFullName(e.getFirstName(), e.getLastName()));
        dto.setHireDate(e.getHireDate());
        dto.setEmploymentStatus(e.getEmploymentStatus() != null ? e.getEmploymentStatus().name() : null);
        dto.setEmploymentType(e.getEmploymentType() != null ? e.getEmploymentType().name() : null);

        // PII masking
        boolean canViewPii = HrSecurityUtil.canViewPii(e.getEmployeeId(), currentEmployeeId);
        dto.setEmail(canViewPii ? e.getEmail() : formatter.maskEmail(e.getEmail()));

        // Salary masking
        boolean canViewSalary = HrSecurityUtil.canViewSalary(e.getEmployeeId(), currentEmployeeId, true);
        if (canViewSalary) dto.setSalary(e.getSalary());

        if (e.getJob() != null) {
            dto.setJobId(e.getJob().getJobId());
            dto.setJobTitle(e.getJob().getJobTitle());
        }
        if (e.getDepartment() != null) {
            dto.setDepartmentId(e.getDepartment().getDepartmentId());
            dto.setDepartmentName(e.getDepartment().getDepartmentName());
        }
        if (e.getManager() != null) {
            dto.setManagerId(e.getManager().getEmployeeId());
            dto.setManagerName(formatter.formatFullName(e.getManager().getFirstName(), e.getManager().getLastName()));
        }
        return dto;
    }

    private HrEmployeeDetailDTO toDetailWithMasking(HrEmployee e, Integer currentEmployeeId) {
        HrEmployeeDetailDTO dto = new HrEmployeeDetailDTO();
        dto.setEmployeeId(e.getEmployeeId());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setFullName(formatter.formatFullName(e.getFirstName(), e.getLastName()));
        dto.setHireDate(e.getHireDate());
        dto.setEmploymentStatus(e.getEmploymentStatus() != null ? e.getEmploymentStatus().name() : null);
        dto.setEmploymentType(e.getEmploymentType() != null ? e.getEmploymentType().name() : null);
        dto.setContractEndDate(e.getContractEndDate());

        boolean canViewPii = HrSecurityUtil.canViewPii(e.getEmployeeId(), currentEmployeeId);
        dto.setEmail(canViewPii ? e.getEmail() : formatter.maskEmail(e.getEmail()));
        if (canViewPii) dto.setPhoneNumber(e.getPhoneNumber());

        boolean canViewSalary = HrSecurityUtil.canViewSalary(e.getEmployeeId(), currentEmployeeId, true);
        if (canViewSalary) {
            dto.setSalary(e.getSalary());
            dto.setCommissionPct(e.getCommissionPct());
        }

        if (e.getJob() != null) {
            dto.setJobId(e.getJob().getJobId());
            dto.setJobTitle(e.getJob().getJobTitle());
        }
        if (e.getDepartment() != null) {
            dto.setDepartmentId(e.getDepartment().getDepartmentId());
            dto.setDepartmentName(e.getDepartment().getDepartmentName());
            if (e.getDepartment().getLocation() != null) {
                dto.setLocationCity(e.getDepartment().getLocation().getCity());
            }
        }
        if (e.getManager() != null) {
            dto.setManagerId(e.getManager().getEmployeeId());
            dto.setManagerName(formatter.formatFullName(e.getManager().getFirstName(), e.getManager().getLastName()));
        }

        // Job history
        List<HrJobHistoryDTO> history = jobHistoryRepository
                .findByEmployee_EmployeeIdOrderByIdStartDateDesc(e.getEmployeeId())
                .stream().map(h -> {
                    HrJobHistoryDTO hDto = new HrJobHistoryDTO();
                    hDto.setStartDate(h.getId().getStartDate());
                    hDto.setEndDate(h.getEndDate());
                    if (h.getJob() != null) { hDto.setJobId(h.getJob().getJobId()); hDto.setJobTitle(h.getJob().getJobTitle()); }
                    if (h.getDepartment() != null) { hDto.setDepartmentId(h.getDepartment().getDepartmentId()); hDto.setDepartmentName(h.getDepartment().getDepartmentName()); }
                    return hDto;
                }).collect(Collectors.toList());
        dto.setJobHistory(history);

        return dto;
    }

    private HrPagedResponse<HrEmployeeSummaryDTO> HrPagedResponse(List<HrEmployeeSummaryDTO> dtos,
                                                                    long total, int totalPages,
                                                                    int page, int size) {
        return com.company.hr.common.response.HrPagedResponse.of(dtos, total, totalPages, page, size);
    }
}
