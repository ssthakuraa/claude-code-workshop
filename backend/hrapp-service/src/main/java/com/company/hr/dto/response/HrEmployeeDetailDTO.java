package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Full employee record for 360 detail view.
 */
@Data @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrEmployeeDetailDTO {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;           // May be masked
    private String phoneNumber;     // May be null if PII masked
    private LocalDate hireDate;
    private String jobId;
    private String jobTitle;
    private BigDecimal salary;      // Null if caller cannot view salary
    private BigDecimal commissionPct;
    private Integer managerId;
    private String managerName;
    private Integer departmentId;
    private String departmentName;
    private String locationCity;
    private String employmentStatus;
    private String employmentType;
    private LocalDate contractEndDate;
    private List<HrJobHistoryDTO> jobHistory;
}
