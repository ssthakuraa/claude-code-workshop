package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrLocationRequest;
import com.company.hr.dto.response.HrLocationDTO;
import com.company.hr.service.HrLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/locations")
@RequiredArgsConstructor
public class HrLocationController {

    private final HrLocationService service;

    @GetMapping
    public ResponseEntity<HrApiResponse<List<HrLocationDTO>>> findAll(
            @RequestParam(required = false) String countryId) {
        List<HrLocationDTO> data = countryId != null
                ? service.findByCountry(countryId)
                : service.findAll();
        return ResponseEntity.ok(HrApiResponse.success(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrLocationDTO>> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(HrApiResponse.success(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HrApiResponse<HrLocationDTO>> create(@Valid @RequestBody HrLocationRequest request) {
        return ResponseEntity.status(201).body(HrApiResponse.created(service.create(request), "Location created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrApiResponse<HrLocationDTO>> update(@PathVariable Integer id,
                                                                @Valid @RequestBody HrLocationRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HrApiResponse<Void>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(HrApiResponse.success(null, "Location deleted"));
    }
}
