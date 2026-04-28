package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload for creating or updating region reference data.
 */
@Data
public class HrRegionRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer regionId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 25, message = "VALIDATION_MAX_LENGTH")
    private String regionName;
}
