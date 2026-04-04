package com.company.hr.dto.request;

import com.company.hr.model.HrEmployee.EmploymentStatus;
import com.company.hr.model.HrEmployee.EmploymentType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HrEmployeeCreateRequest {

    @Size(max = 20, message = "First name must not exceed 20 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 25, message = "Last name must not exceed 25 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @NotBlank(message = "Job ID is required")
    private String jobId;

    @DecimalMin(value = "0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;

    @DecimalMin(value = "0", message = "Commission must be non-negative")
    @DecimalMax(value = "1", message = "Commission must not exceed 1.00")
    private BigDecimal commissionPct;

    private Integer managerId;

    private Integer departmentId;

    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    private LocalDate contractEndDate;

    // Username for hr_users record (defaults to email prefix if not provided)
    private String username;

    // Initial password — required for hire
    @NotBlank(message = "Initial password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String initialPassword;

    // Idempotency key — required for hire endpoint
    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
