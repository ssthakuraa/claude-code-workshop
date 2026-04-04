package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrDepartmentRequest;
import com.company.hr.dto.response.HrDepartmentDTO;
import com.company.hr.service.HrDepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/departments")
@RequiredArgsConstructor
public class HrDepartmentController {

    private final HrDepartmentService service;

    @GetMapping
    public ResponseEntity<HrApiResponse<List<HrDepartmentDTO>>> findAll() {
        return ResponseEntity.ok(HrApiResponse.success(service.findAll()));
    }

    @GetMapping("/tree")
    public ResponseEntity<HrApiResponse<List<HrDepartmentDTO>>> findTree() {
        return ResponseEntity.ok(HrApiResponse.success(service.findTree()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrDepartmentDTO>> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrDepartmentDTO>> create(@Valid @RequestBody HrDepartmentRequest request) {
        return ResponseEntity.status(201)
                .body(HrApiResponse.created(service.create(request), "Department created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrDepartmentDTO>> update(@PathVariable Integer id,
                                                                   @Valid @RequestBody HrDepartmentRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HrApiResponse<Void>> delete(@PathVariable Integer id) {
        service.softDelete(id);
        return ResponseEntity.ok(HrApiResponse.success(null, "Department deleted"));
    }
}
