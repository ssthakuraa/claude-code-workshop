package com.company.hr.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Minimal employee record for list views.
 * Salary is nullable — masked based on RBAC.
 */
@Data @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrEmployeeSummaryDTO {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;           // May be masked
    private String jobId;
    private String jobTitle;
    private Integer departmentId;
    private String departmentName;
    private String employmentStatus;
    private String employmentType;
    private BigDecimal salary;      // Null if caller cannot view salary
    private Integer managerId;
    private String managerName;
    private LocalDate hireDate;
}
