package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HrTerminateRequest {
    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotBlank(message = "Termination reason is required")
    private String reason;

    private LocalDate effectiveDate;

    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
