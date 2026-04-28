package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload for creating or updating location reference data.
 */
@Data
public class HrLocationRequest {
    @NotNull(message = "VALIDATION_REQUIRED")
    private Integer locationId;

    @Size(max = 40, message = "VALIDATION_MAX_LENGTH")
    private String streetAddress;

    @Size(max = 12, message = "VALIDATION_MAX_LENGTH")
    private String postalCode;

    @NotBlank(message = "VALIDATION_REQUIRED")
    @Size(max = 30, message = "VALIDATION_MAX_LENGTH")
    private String city;

    @Size(max = 25, message = "VALIDATION_MAX_LENGTH")
    private String stateProvince;

    @NotBlank(message = "VALIDATION_REQUIRED")
    private String countryId;
}
