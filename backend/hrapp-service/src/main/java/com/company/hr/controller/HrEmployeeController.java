package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.dto.request.*;
import com.company.hr.dto.response.*;
import com.company.hr.service.HrEmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app/hr/api/v1/employees")
@RequiredArgsConstructor
public class HrEmployeeController {

    private final HrEmployeeService service;

    @GetMapping
    public ResponseEntity<HrPagedResponse<HrEmployeeSummaryDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) String status) {
        var pageable = PageRequest.of(page, size, Sort.by(sort));
        return ResponseEntity.ok(service.findAll(pageable, search, departmentId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> hire(@Valid @RequestBody HrEmployeeCreateRequest request) {
        return ResponseEntity.status(201)
                .body(HrApiResponse.created(service.hireEmployee(request), "Employee hired successfully"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> update(@PathVariable Integer id,
                                                                       @Valid @RequestBody HrEmployeeUpdateRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @PostMapping("/terminate")
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> terminate(@Valid @RequestBody HrTerminateRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.terminateEmployee(request), "Employee terminated"));
    }

    @PostMapping("/promote")
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> promote(@Valid @RequestBody HrPromoteRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.promoteEmployee(request), "Employee promoted"));
    }

    @PostMapping("/transfer")
    public ResponseEntity<HrApiResponse<HrEmployeeDetailDTO>> transfer(@Valid @RequestBody HrTransferRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.transferEmployee(request), "Employee transferred"));
    }
}
