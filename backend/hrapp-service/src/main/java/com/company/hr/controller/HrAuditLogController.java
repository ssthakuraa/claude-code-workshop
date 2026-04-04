package com.company.hr.controller;

import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.dto.response.HrAuditLogDTO;
import com.company.hr.service.HrAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app/hr/api/v1/audit-logs")
@RequiredArgsConstructor
public class HrAuditLogController {

    private final HrAuditLogService service;

    @GetMapping
    public ResponseEntity<HrPagedResponse<HrAuditLogDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String tableName) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "changedAt"));
        return ResponseEntity.ok(service.findAll(pageable, tableName));
    }
}
