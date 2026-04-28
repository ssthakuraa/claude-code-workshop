package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Request payload for the employee transfer workflow.
 */
@Data
public class HrTransferRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer employeeId;

    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer newDepartmentId;

    private Integer newManagerId;
    private LocalDate effectiveDate;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String idempotencyKey;
}
