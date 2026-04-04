package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HrRegionRequest {
    @NotNull(message = "Region ID is required")
    private Integer regionId;

    @NotBlank(message = "Region name is required")
    @Size(max = 25, message = "Region name must not exceed 25 characters")
    private String regionName;
}
