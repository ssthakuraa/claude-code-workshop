package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Historical job assignment nested within employee detail responses.
 */
@Data @NoArgsConstructor
public class HrJobHistoryDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String jobId;
    private String jobTitle;
    private Integer departmentId;
    private String departmentName;
}
