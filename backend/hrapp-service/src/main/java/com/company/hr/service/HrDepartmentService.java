package com.company.hr.service;

import com.company.hr.common.exception.HrBusinessRuleViolationException;
import com.company.hr.common.exception.HrConflictException;
import com.company.hr.common.exception.HrResourceNotFoundException;
import com.company.hr.common.log.HrLogHelper;
import com.company.hr.dto.request.HrDepartmentRequest;
import com.company.hr.dto.response.HrDepartmentDTO;
import com.company.hr.model.HrDepartment;
import com.company.hr.model.HrEmployee;
import com.company.hr.model.HrLocation;
import com.company.hr.repository.HrDepartmentRepository;
import com.company.hr.repository.HrEmployeeRepository;
import com.company.hr.repository.HrLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrDepartmentService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrDepartmentService.class);

    private final HrDepartmentRepository repository;
    private final HrLocationRepository locationRepository;
    private final HrEmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    @Cacheable("departments")
    public List<HrDepartmentDTO> findAll() {
        LOGGER.info("Entering findAll()");
        List<HrDepartmentDTO> result = repository.findAll().stream()
                .map(this::toFlatDTO).collect(Collectors.toList());
        LOGGER.info("Exiting findAll(), {} departments", result.size());
        return result;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<HrDepartmentDTO> findTree() {
        LOGGER.info("Entering findTree()");
        List<HrDepartment> roots = repository.findByParentDepartmentIsNull();
        List<HrDepartmentDTO> tree = roots.stream()
                .map(this::toTreeDTO).collect(Collectors.toList());
        LOGGER.info("Exiting findTree(), {} root departments", tree.size());
        return tree;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public HrDepartmentDTO findById(Integer id) {
        LOGGER.info("Entering findById(id={})", id);
        HrDepartment dept = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Department", id));
        return toFlatDTO(dept);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST')")
    @CacheEvict(value = "departments", allEntries = true)
    public HrDepartmentDTO create(HrDepartmentRequest request) {
        LOGGER.info("Entering create(departmentId={})", request.getDepartmentId());
        if (repository.existsById(request.getDepartmentId())) {
            throw new HrConflictException("Department with ID " + request.getDepartmentId() + " already exists.");
        }
        HrDepartment dept = new HrDepartment();
        applyRequest(dept, request);
        HrDepartmentDTO result = toFlatDTO(repository.save(dept));
        LOGGER.info("Exiting create, saved department: {}", result.getDepartmentName());
        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST')")
    @CacheEvict(value = "departments", allEntries = true)
    public HrDepartmentDTO update(Integer id, HrDepartmentRequest request) {
        LOGGER.info("Entering update(id={})", id);
        HrDepartment dept = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Department", id));
        // Guard: prevent setting parent to self or descendant
        if (request.getParentDepartmentId() != null &&
                request.getParentDepartmentId().equals(id)) {
            throw new HrBusinessRuleViolationException(
                    "Department cannot be its own parent.", "CIRCULAR_DEPARTMENT_REFERENCE");
        }
        applyRequest(dept, request);
        return toFlatDTO(repository.save(dept));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    @CacheEvict(value = "departments", allEntries = true)
    public void softDelete(Integer id) {
        LOGGER.info("Entering softDelete(id={})", id);
        HrDepartment dept = repository.findById(id)
                .orElseThrow(() -> new HrResourceNotFoundException("Department", id));
        long activeEmployees = repository.countActiveEmployees(id);
        if (activeEmployees > 0) {
            throw new HrBusinessRuleViolationException(
                    "Department " + id + " cannot be deleted — it has " + activeEmployees + " active employee(s).",
                    "DEPARTMENT_HAS_EMPLOYEES");
        }
        dept.setDeletedAt(Instant.now());
        repository.save(dept);
        LOGGER.info("Exiting softDelete, deleted department ID={}", id);
    }

    private void applyRequest(HrDepartment dept, HrDepartmentRequest request) {
        dept.setDepartmentId(request.getDepartmentId());
        dept.setDepartmentName(request.getDepartmentName());

        if (request.getLocationId() != null) {
            HrLocation loc = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Location", request.getLocationId()));
            dept.setLocation(loc);
        }
        if (request.getManagerId() != null) {
            HrEmployee mgr = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Employee", request.getManagerId()));
            dept.setManager(mgr);
        }
        if (request.getParentDepartmentId() != null) {
            HrDepartment parent = repository.findById(request.getParentDepartmentId())
                    .orElseThrow(() -> new HrResourceNotFoundException("Department", request.getParentDepartmentId()));
            dept.setParentDepartment(parent);
        }
    }

    private HrDepartmentDTO toFlatDTO(HrDepartment dept) {
        HrDepartmentDTO dto = new HrDepartmentDTO();
        dto.setDepartmentId(dept.getDepartmentId());
        dto.setDepartmentName(dept.getDepartmentName());
        if (dept.getManager() != null) {
            dto.setManagerId(dept.getManager().getEmployeeId());
            dto.setManagerName(dept.getManager().getFirstName() + " " + dept.getManager().getLastName());
        }
        if (dept.getLocation() != null) {
            dto.setLocationId(dept.getLocation().getLocationId());
            dto.setLocationCity(dept.getLocation().getCity());
        }
        if (dept.getParentDepartment() != null) {
            dto.setParentDepartmentId(dept.getParentDepartment().getDepartmentId());
            dto.setParentDepartmentName(dept.getParentDepartment().getDepartmentName());
        }
        dto.setEmployeeCount((int) repository.countActiveEmployees(dept.getDepartmentId()));
        return dto;
    }

    private HrDepartmentDTO toTreeDTO(HrDepartment dept) {
        HrDepartmentDTO dto = toFlatDTO(dept);
        if (dept.getChildren() != null && !dept.getChildren().isEmpty()) {
            dto.setChildren(dept.getChildren().stream()
                    .map(this::toTreeDTO).collect(Collectors.toList()));
        }
        return dto;
    }
}
