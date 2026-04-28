package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Request payload for the employee termination workflow.
 */
@Data
public class HrTerminateRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer employeeId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String reason;

    private LocalDate effectiveDate;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String idempotencyKey;
}
