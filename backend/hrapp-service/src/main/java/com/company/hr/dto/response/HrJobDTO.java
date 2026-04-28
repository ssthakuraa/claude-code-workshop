package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

/**
 * Job reference record returned by read APIs.
 */
@Data @NoArgsConstructor @AllArgsConstructor
public class HrJobDTO {
    private String jobId;
    private String jobTitle;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
}
