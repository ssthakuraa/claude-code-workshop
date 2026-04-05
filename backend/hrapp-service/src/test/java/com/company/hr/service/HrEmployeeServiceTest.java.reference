package com.company.hr.service;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.format.HrFormatter;
import com.company.hr.dto.request.HrEmployeeCreateRequest;
import com.company.hr.dto.request.HrPromoteRequest;
import com.company.hr.dto.request.HrTerminateRequest;
import com.company.hr.model.HrEmployee;
import com.company.hr.model.HrEmployee.EmploymentStatus;
import com.company.hr.model.HrJob;
import com.company.hr.model.HrRole;
import com.company.hr.model.HrUser;
import com.company.hr.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HrEmployeeServiceTest {

    @Mock HrEmployeeRepository employeeRepository;
    @Mock HrJobRepository jobRepository;
    @Mock HrDepartmentRepository departmentRepository;
    @Mock HrUserRepository userRepository;
    @Mock HrRoleRepository roleRepository;
    @Mock HrJobHistoryRepository jobHistoryRepository;
    @Mock HrIdempotencyKeyRepository idempotencyKeyRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock HrFormatter formatter;
    @Mock ObjectMapper objectMapper;

    @InjectMocks HrEmployeeService service;

    private HrJob job;

    @BeforeEach
    void setUp() {
        job = new HrJob("IT_DEV", "Developer", new BigDecimal("4000"), new BigDecimal("12000"));
    }

    // --- findById ---

    @Test
    void findById_throwsNotFound_whenEmployeeMissing() {
        when(employeeRepository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById(99))
                .isInstanceOf(HrResourceNotFoundException.class);
    }

    // --- hireEmployee ---

    @Test
    void hireEmployee_throwsConflict_onDuplicateIdempotencyKey() {
        HrEmployeeCreateRequest req = buildHireRequest("key-001", "test@example.com", new BigDecimal("8000"));
        when(idempotencyKeyRepository.existsById("key-001")).thenReturn(true);

        assertThatThrownBy(() -> service.hireEmployee(req))
                .isInstanceOf(HrConflictException.class);
    }

    @Test
    void hireEmployee_throwsConflict_onDuplicateEmail() {
        HrEmployeeCreateRequest req = buildHireRequest("key-002", "existing@example.com", new BigDecimal("8000"));
        when(idempotencyKeyRepository.existsById("key-002")).thenReturn(false);
        when(employeeRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThatThrownBy(() -> service.hireEmployee(req))
                .isInstanceOf(HrConflictException.class);
    }

    @Test
    void hireEmployee_throwsNotFound_whenJobMissing() {
        HrEmployeeCreateRequest req = buildHireRequest("key-003", "new@example.com", new BigDecimal("8000"));
        when(idempotencyKeyRepository.existsById("key-003")).thenReturn(false);
        when(employeeRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(jobRepository.findById("IT_DEV")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.hireEmployee(req))
                .isInstanceOf(HrResourceNotFoundException.class);
    }

    @Test
    void hireEmployee_throwsBusinessRule_whenSalaryBelowMin() {
        HrEmployeeCreateRequest req = buildHireRequest("key-004", "new@example.com", new BigDecimal("1000")); // below 4000 min
        when(idempotencyKeyRepository.existsById("key-004")).thenReturn(false);
        when(employeeRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(jobRepository.findById("IT_DEV")).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> service.hireEmployee(req))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }

    @Test
    void hireEmployee_succeeds_withValidRequest() {
        HrEmployeeCreateRequest req = buildHireRequest("key-005", "new@example.com", new BigDecimal("8000"));

        HrEmployee saved = new HrEmployee();
        saved.setEmployeeId(100);
        saved.setFirstName("John");
        saved.setLastName("Doe");
        saved.setEmail("new@example.com");
        saved.setHireDate(LocalDate.now());
        saved.setJob(job);

        HrRole role = new HrRole();
        role.setRoleName("ROLE_EMPLOYEE");

        when(idempotencyKeyRepository.existsById("key-005")).thenReturn(false);
        when(employeeRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(jobRepository.findById("IT_DEV")).thenReturn(Optional.of(job));
        when(employeeRepository.save(any())).thenReturn(saved);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(roleRepository.findByRoleName("ROLE_EMPLOYEE")).thenReturn(Optional.of(role));
        when(userRepository.save(any())).thenReturn(new HrUser());
        when(jobHistoryRepository.save(any())).thenReturn(null);
        when(idempotencyKeyRepository.save(any())).thenReturn(null);
        when(jobHistoryRepository.findByEmployee_EmployeeIdOrderByIdStartDateDesc(100)).thenReturn(List.of());
        when(formatter.formatFullName(any(), any())).thenReturn("John Doe");
        when(passwordEncoder.encode(any())).thenReturn("hashed");

        var result = service.hireEmployee(req);

        assertThat(result).isNotNull();
        assertThat(result.getEmployeeId()).isEqualTo(100);
    }

    // --- terminateEmployee ---

    @Test
    void terminateEmployee_throwsBusinessRule_whenAlreadyTerminated() {
        HrEmployee employee = new HrEmployee();
        employee.setEmployeeId(1);
        employee.setEmploymentStatus(EmploymentStatus.TERMINATED);

        HrTerminateRequest req = new HrTerminateRequest();
        req.setEmployeeId(1);
        req.setIdempotencyKey("key-t1");
        req.setReason("Resigned");

        when(idempotencyKeyRepository.existsById("key-t1")).thenReturn(false);
        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> service.terminateEmployee(req))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }

    // --- promoteEmployee ---

    @Test
    void promoteEmployee_throwsBusinessRule_whenSalaryExceedsNewJobMax() {
        HrJob newJob = new HrJob("IT_MGR", "Manager", new BigDecimal("6000"), new BigDecimal("10000"));

        HrEmployee employee = new HrEmployee();
        employee.setEmployeeId(1);
        employee.setJob(job);

        HrPromoteRequest req = new HrPromoteRequest();
        req.setEmployeeId(1);
        req.setNewJobId("IT_MGR");
        req.setNewSalary(new BigDecimal("99000")); // exceeds max
        req.setIdempotencyKey("key-p1");

        when(idempotencyKeyRepository.existsById("key-p1")).thenReturn(false);
        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));
        when(jobRepository.findById("IT_MGR")).thenReturn(Optional.of(newJob));

        assertThatThrownBy(() -> service.promoteEmployee(req))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }

    // --- helpers ---

    private HrEmployeeCreateRequest buildHireRequest(String key, String email, BigDecimal salary) {
        HrEmployeeCreateRequest req = new HrEmployeeCreateRequest();
        req.setIdempotencyKey(key);
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setEmail(email);
        req.setJobId("IT_DEV");
        req.setSalary(salary);
        req.setHireDate(LocalDate.now());
        req.setInitialPassword("password123");
        return req;
    }
}
