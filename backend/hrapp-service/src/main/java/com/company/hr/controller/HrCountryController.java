package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrCountryRequest;
import com.company.hr.dto.response.HrCountryDTO;
import com.company.hr.service.HrCountryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/countries")
@RequiredArgsConstructor
public class HrCountryController {

    private final HrCountryService service;

    @GetMapping
    public ResponseEntity<HrApiResponse<List<HrCountryDTO>>> findAll(
            @RequestParam(required = false) Integer regionId) {
        List<HrCountryDTO> data = regionId != null
                ? service.findByRegion(regionId)
                : service.findAll();
        return ResponseEntity.ok(HrApiResponse.success(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrCountryDTO>> findById(@PathVariable String id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrCountryDTO>> create(@Valid @RequestBody HrCountryRequest request) {
        return ResponseEntity.status(201).body(HrApiResponse.created(service.create(request), "Country created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrCountryDTO>> update(@PathVariable String id,
                                                               @Valid @RequestBody HrCountryRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HrApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(HrApiResponse.success(null, "Country deleted"));
    }
}
