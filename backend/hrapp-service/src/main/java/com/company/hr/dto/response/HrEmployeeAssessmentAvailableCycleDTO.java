package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Open cycle option that an employee can start an assessment against.
 */
@Data
@NoArgsConstructor
public class HrEmployeeAssessmentAvailableCycleDTO {
    private String cycleCode;
    private String cycleLabel;
    private String periodType;
    private LocalDate startDate;
    private LocalDate endDate;
}
