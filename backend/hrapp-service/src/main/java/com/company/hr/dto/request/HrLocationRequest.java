package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HrLocationRequest {
    @NotNull(message = "Location ID is required")
    private Integer locationId;

    @Size(max = 40, message = "Street address must not exceed 40 characters")
    private String streetAddress;

    @Size(max = 12, message = "Postal code must not exceed 12 characters")
    private String postalCode;

    @NotBlank(message = "City is required")
    @Size(max = 30, message = "City must not exceed 30 characters")
    private String city;

    @Size(max = 25, message = "State/province must not exceed 25 characters")
    private String stateProvince;

    @NotBlank(message = "Country ID is required")
    private String countryId;
}
