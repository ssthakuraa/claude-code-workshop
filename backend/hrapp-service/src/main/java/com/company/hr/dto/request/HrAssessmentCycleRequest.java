package com.company.hr.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * API request shape for creating or updating assessment-cycle setup rows.
 */
@Data
@NoArgsConstructor
public class HrAssessmentCycleRequest {
    private String cycleCode;
    private String defaultLabel;
    private String periodType;
    private String startDate;
    private String endDate;
    private String cycleStatus;
    private Integer displayOrder;
    private Boolean active;
    private Map<String, String> translations;
}
