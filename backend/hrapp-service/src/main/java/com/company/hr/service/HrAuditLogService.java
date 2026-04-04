package com.company.hr.service;

import com.company.hr.common.log.HrLogHelper;
import com.company.hr.common.response.HrPagedResponse;
import com.company.hr.dto.response.HrAuditLogDTO;
import com.company.hr.model.HrAuditLog;
import com.company.hr.repository.HrAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HrAuditLogService {

    private static final HrLogHelper LOGGER = new HrLogHelper(HrAuditLogService.class);

    private final HrAuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrPagedResponse<HrAuditLogDTO> findAll(Pageable pageable, String tableName) {
        LOGGER.info("Entering findAll(page={}, size={}, table={})", pageable.getPageNumber(), pageable.getPageSize(), tableName);

        Page<HrAuditLog> page = tableName != null && !tableName.isBlank()
                ? auditLogRepository.findByTableNameOrderByChangedAtDesc(tableName, pageable)
                : auditLogRepository.findAllByOrderByChangedAtDesc(pageable);

        HrPagedResponse<HrAuditLogDTO> result = HrPagedResponse.of(
                page.map(this::toDTO).getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );

        LOGGER.info("Exiting findAll(), returned {} entries", result.getTotalElements());
        return result;
    }

    private HrAuditLogDTO toDTO(HrAuditLog log) {
        HrAuditLogDTO dto = new HrAuditLogDTO();
        dto.setAuditId(log.getAuditId());
        dto.setTableName(log.getTableName());
        dto.setRecordId(log.getRecordId());
        dto.setAction(log.getAction() != null ? log.getAction().name() : null);
        dto.setOldValue(log.getOldValue());
        dto.setNewValue(log.getNewValue());
        dto.setChangedBy(log.getChangedBy());
        dto.setChangedAt(log.getChangedAt());
        return dto;
    }
}
