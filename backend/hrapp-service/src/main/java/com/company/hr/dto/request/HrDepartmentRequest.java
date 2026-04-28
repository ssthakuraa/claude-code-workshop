package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload for creating or updating department records.
 */
@Data
public class HrDepartmentRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer departmentId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 30, message = "VALIDATION_MAX_LENGTH")
    private String departmentName;

    private Integer managerId;
    private Integer locationId;
    private Integer parentDepartmentId;
}
