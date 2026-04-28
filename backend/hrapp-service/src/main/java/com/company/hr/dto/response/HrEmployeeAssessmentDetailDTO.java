package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Employee-facing assessment detail payload for read/edit screens.
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrEmployeeAssessmentDetailDTO {
    private Long assessmentId;
    private String cycleCode;
    private String cycleLabel;
    private String periodType;
    private LocalDate cycleStartDate;
    private LocalDate cycleEndDate;
    private String reviewStatus;
    private BigDecimal goalCompletionPct;
    private BigDecimal competencyScore;
    private String employeeReflection;
    private String nextCyclePlan;
    private String managerFeedback;
    private Integer reviewerUserId;
    private String reviewerName;
    private String reviewerJobTitle;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
}
