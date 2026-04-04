package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrAuditLogDTO {
    private Long auditId;
    private String tableName;
    private String recordId;
    private String action;
    private String oldValue;
    private String newValue;
    private Integer changedBy;
    private Instant changedAt;
}
