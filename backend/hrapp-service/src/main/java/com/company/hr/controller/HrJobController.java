package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrJobRequest;
import com.company.hr.dto.response.HrJobDTO;
import com.company.hr.service.HrJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/jobs")
@RequiredArgsConstructor
public class HrJobController {

    private final HrJobService service;

    @GetMapping
    public ResponseEntity<HrApiResponse<List<HrJobDTO>>> findAll() {
        return ResponseEntity.ok(HrApiResponse.success(service.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrJobDTO>> findById(@PathVariable String id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrJobDTO>> create(@Valid @RequestBody HrJobRequest request) {
        return ResponseEntity.status(201).body(HrApiResponse.created(service.create(request), "Job created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrJobDTO>> update(@PathVariable String id,
                                                           @Valid @RequestBody HrJobRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HrApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(HrApiResponse.success(null, "Job deleted"));
    }
}
