package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.response.HrDashboardSummaryDTO;
import com.company.hr.service.HrDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/app/hr/api/v1/dashboard")
@RequiredArgsConstructor
public class HrDashboardController {

    private final HrDashboardService service;

    @GetMapping("/summary")
    public ResponseEntity<HrApiResponse<HrDashboardSummaryDTO>> getSummary() {
        return ResponseEntity.ok(HrApiResponse.success(service.getSummary()));
    }

    @GetMapping("/headcount-by-country")
    public ResponseEntity<HrApiResponse<List<HrDashboardSummaryDTO.CountryCount>>> getHeadcountByCountry() {
        return ResponseEntity.ok(HrApiResponse.success(service.getHeadcountByCountry()));
    }
}
