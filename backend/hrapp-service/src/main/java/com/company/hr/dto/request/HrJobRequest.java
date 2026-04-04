package com.company.hr.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class HrJobRequest {
    @NotBlank(message = "Job ID is required")
    @Size(max = 10, message = "Job ID must not exceed 10 characters")
    private String jobId;

    @NotBlank(message = "Job title is required")
    @Size(max = 35, message = "Job title must not exceed 35 characters")
    private String jobTitle;

    @DecimalMin(value = "0", inclusive = false, message = "Minimum salary must be positive")
    private BigDecimal minSalary;

    @DecimalMin(value = "0", inclusive = false, message = "Maximum salary must be positive")
    private BigDecimal maxSalary;
}
