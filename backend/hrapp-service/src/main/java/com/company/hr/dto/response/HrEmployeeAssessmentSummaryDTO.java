package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Employee-facing assessment summary row.
 */
@Data
@NoArgsConstructor
public class HrEmployeeAssessmentSummaryDTO {
    private Long assessmentId;
    private String cycleCode;
    private String cycleLabel;
    private String reviewStatus;
    private String reviewerName;
    private String reviewerJobTitle;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
}
