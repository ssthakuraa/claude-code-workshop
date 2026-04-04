package com.company.hr.service;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.dto.request.HrDepartmentRequest;
import com.company.hr.model.HrDepartment;
import com.company.hr.repository.HrDepartmentRepository;
import com.company.hr.repository.HrEmployeeRepository;
import com.company.hr.repository.HrLocationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HrDepartmentServiceTest {

    @Mock HrDepartmentRepository repository;
    @Mock HrLocationRepository locationRepository;
    @Mock HrEmployeeRepository employeeRepository;
    @InjectMocks HrDepartmentService service;

    @Test
    void findById_throwsNotFound_whenMissing() {
        when(repository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById(99))
                .isInstanceOf(HrResourceNotFoundException.class);
    }

    @Test
    void softDelete_throwsBusinessRule_whenDepartmentHasActiveEmployees() {
        HrDepartment dept = new HrDepartment();
        dept.setDepartmentId(10);

        when(repository.findById(10)).thenReturn(Optional.of(dept));
        when(repository.countActiveEmployees(10)).thenReturn(3L);

        assertThatThrownBy(() -> service.softDelete(10))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }

    @Test
    void update_throwsBusinessRule_whenParentSetToSelf() {
        HrDepartment dept = new HrDepartment();
        dept.setDepartmentId(10);

        HrDepartmentRequest req = new HrDepartmentRequest();
        req.setDepartmentId(10);
        req.setDepartmentName("Engineering");
        req.setParentDepartmentId(10); // self-reference

        when(repository.findById(10)).thenReturn(Optional.of(dept));

        assertThatThrownBy(() -> service.update(10, req))
                .isInstanceOf(HrBusinessRuleViolationException.class);
    }
}
