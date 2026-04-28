package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload for creating or updating country reference data.
 */
@Data
public class HrCountryRequest {
    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(min = 2, max = 2, message = "VALIDATION_EXACT_LENGTH_2")
    private String countryId;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 60, message = "VALIDATION_MAX_LENGTH")
    private String countryName;

    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer regionId;
}
