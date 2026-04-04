package com.company.hr.dto.request;

import com.company.hr.model.HrEmployee.EmploymentType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HrEmployeeUpdateRequest {

    @Size(max = 20)
    private String firstName;

    @Size(max = 25)
    private String lastName;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    private String jobId;

    @DecimalMin(value = "0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;

    @DecimalMin(value = "0")
    @DecimalMax(value = "1")
    private BigDecimal commissionPct;

    private Integer managerId;
    private Integer departmentId;
    private EmploymentType employmentType;
    private LocalDate contractEndDate;
}
