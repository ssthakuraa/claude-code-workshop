package com.company.hr.dto.request;

import com.company.hr.domain.HrEmploymentStatus;
import com.company.hr.domain.HrEmploymentType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for the employee hire workflow.
 */
@Data
public class HrEmployeeCreateRequest {

    @Size(max = 20, message = "VALIDATION_MAX_LENGTH")
    private String firstName;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 25, message = "VALIDATION_MAX_LENGTH")
    private String lastName;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Email(message = "VALIDATION_INVALID_EMAIL")
    @Size(max = 100)
    private String email;

    @Size(max = 20, message = "VALIDATION_MAX_LENGTH")
    private String phoneNumber;

    @NotNull(message = "VALIDATION_REQUIRED")
    private LocalDate hireDate;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String jobId;

    @DecimalMin(value = "0", inclusive = false, message = "VALIDATION_POSITIVE_NUMBER")
    private BigDecimal salary;

    @DecimalMin(value = "0", message = "VALIDATION_NON_NEGATIVE")
    @DecimalMax(value = "1", message = "VALIDATION_MAX_VALUE_1")
    private BigDecimal commissionPct;

    private Integer managerId;

    private Integer departmentId;

    private HrEmploymentStatus employmentStatus = HrEmploymentStatus.ACTIVE;

    private HrEmploymentType employmentType = HrEmploymentType.FULL_TIME;

    private LocalDate contractEndDate;

    // Username for hr_users record (defaults to email prefix if not provided)
    private String username;

    // Initial password — required for hire
    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(min = 8, message = "VALIDATION_MIN_LENGTH_8")
    private String initialPassword;

    // Idempotency key — required for hire endpoint
    @NotBlank(message = "VALIDATION_REQUIRED")
    private String idempotencyKey;
}
