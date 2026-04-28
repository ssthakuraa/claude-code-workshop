package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

/**
 * Assessment-cycle row returned to the admin setup page.
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrAssessmentCycleDTO {
    private String cycleCode;
    private String defaultLabel;
    private String localizedLabel;
    private String periodType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String cycleStatus;
    private Integer displayOrder;
    private Boolean active;
    private Map<String, String> translations;
}
