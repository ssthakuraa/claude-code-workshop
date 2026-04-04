package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data @NoArgsConstructor
public class HrJobHistoryDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String jobId;
    private String jobTitle;
    private Integer departmentId;
    private String departmentName;
}
