package com.company.hr.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for the employee promotion workflow.
 */
@Data
public class HrPromoteRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer employeeId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String newJobId;

    @DecimalMin(value = "0", inclusive = false, message = "VALIDATION_POSITIVE_NUMBER")
    private BigDecimal newSalary;

    private LocalDate effectiveDate;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String idempotencyKey;
}
