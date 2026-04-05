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

    // --- hireEmployee tests: write these during Lab 2 ---
    // See HrEmployeeServiceTest.java.reference for the completed test cases.

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
