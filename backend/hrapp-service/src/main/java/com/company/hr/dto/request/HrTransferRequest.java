package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HrTransferRequest {
    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotNull(message = "New department ID is required")
    private Integer newDepartmentId;

    private Integer newManagerId;
    private LocalDate effectiveDate;

    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
