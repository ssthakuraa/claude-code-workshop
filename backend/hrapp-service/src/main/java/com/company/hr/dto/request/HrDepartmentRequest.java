package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HrDepartmentRequest {
    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @NotBlank(message = "Department name is required")
    @Size(max = 30, message = "Department name must not exceed 30 characters")
    private String departmentName;

    private Integer managerId;
    private Integer locationId;
    private Integer parentDepartmentId;
}
