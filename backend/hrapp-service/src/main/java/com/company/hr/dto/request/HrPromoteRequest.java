package com.company.hr.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HrPromoteRequest {
    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotBlank(message = "New job ID is required")
    private String newJobId;

    @DecimalMin(value = "0", inclusive = false, message = "New salary must be positive")
    private BigDecimal newSalary;

    private LocalDate effectiveDate;

    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
