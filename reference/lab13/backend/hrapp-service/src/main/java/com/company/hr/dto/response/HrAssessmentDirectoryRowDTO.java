package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Read model for the HR assessments directory page.
 */
@Data
@NoArgsConstructor
public class HrAssessmentDirectoryRowDTO {
    private Long assessmentId;
    private Integer employeeId;
    private String employeeName;
    private Integer departmentId;
    private String departmentName;
    private String cycleCode;
    private String cycleLabel;
    private String reviewStatus;
    private BigDecimal goalCompletionPct;
    private BigDecimal competencyScore;
    private Integer reviewerUserId;
    private String reviewerName;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
