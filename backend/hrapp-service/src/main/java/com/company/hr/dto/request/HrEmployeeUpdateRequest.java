package com.company.hr.dto.request;

import com.company.hr.domain.HrEmploymentType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for general employee profile updates.
 */
@Data
public class HrEmployeeUpdateRequest {

    @Size(max = 20, message = "VALIDATION_MAX_LENGTH")
    private String firstName;

    @Size(max = 25, message = "VALIDATION_MAX_LENGTH")
    private String lastName;

    @Email(message = "VALIDATION_INVALID_EMAIL")
    @Size(max = 100, message = "VALIDATION_MAX_LENGTH")
    private String email;

    @Size(max = 20, message = "VALIDATION_MAX_LENGTH")
    private String phoneNumber;

    private String jobId;

    @DecimalMin(value = "0", inclusive = false, message = "VALIDATION_POSITIVE_NUMBER")
    private BigDecimal salary;

    @DecimalMin(value = "0")
    @DecimalMax(value = "1")
    private BigDecimal commissionPct;

    private Integer managerId;
    private Integer departmentId;
    private HrEmploymentType employmentType;
    private LocalDate contractEndDate;
}
