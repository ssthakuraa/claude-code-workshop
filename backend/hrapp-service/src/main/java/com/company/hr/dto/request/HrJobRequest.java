package com.company.hr.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Request payload for creating or updating job reference data.
 */
@Data
public class HrJobRequest {
    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 10, message = "VALIDATION_MAX_LENGTH")
    private String jobId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 35, message = "VALIDATION_MAX_LENGTH")
    private String jobTitle;

    @DecimalMin(value = "0", inclusive = false, message = "VALIDATION_POSITIVE_NUMBER")
    private BigDecimal minSalary;

    @DecimalMin(value = "0", inclusive = false, message = "VALIDATION_POSITIVE_NUMBER")
    private BigDecimal maxSalary;
}
