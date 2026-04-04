package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrRegionRequest;
import com.company.hr.dto.response.HrRegionDTO;
import com.company.hr.service.HrRegionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/regions")
@RequiredArgsConstructor
public class HrRegionController {

    private final HrRegionService service;

    @GetMapping
    public ResponseEntity<HrApiResponse<List<HrRegionDTO>>> findAll() {
        return ResponseEntity.ok(HrApiResponse.success(service.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrRegionDTO>> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrRegionDTO>> create(@Valid @RequestBody HrRegionRequest request) {
        return ResponseEntity.status(201).body(HrApiResponse.created(service.create(request), "Region created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrRegionDTO>> update(@PathVariable Integer id,
                                                              @Valid @RequestBody HrRegionRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HrApiResponse<Void>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(HrApiResponse.success(null, "Region deleted"));
    }
}
