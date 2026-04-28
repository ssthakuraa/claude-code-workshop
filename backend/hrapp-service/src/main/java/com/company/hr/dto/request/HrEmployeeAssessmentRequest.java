package com.company.hr.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request shape for employee assessment draft and submit flows.
 */
@Data
@NoArgsConstructor
public class HrEmployeeAssessmentRequest {
    private String cycleCode;
    private BigDecimal goalCompletionPct;
    private BigDecimal competencyScore;
    private String employeeReflection;
    private String nextCyclePlan;
}
