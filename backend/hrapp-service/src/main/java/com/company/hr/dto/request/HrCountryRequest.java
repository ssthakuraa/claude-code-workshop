package com.company.hr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HrCountryRequest {
    @NotBlank(message = "Country ID is required")
    @Size(min = 2, max = 2, message = "Country ID must be exactly 2 characters (ISO 3166-1 alpha-2)")
    private String countryId;

    @NotBlank(message = "Country name is required")
    @Size(max = 60, message = "Country name must not exceed 60 characters")
    private String countryName;

    @NotNull(message = "Region ID is required")
    private Integer regionId;
}
