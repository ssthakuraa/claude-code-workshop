package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class HrCountryDTO {
    private String countryId;
    private String countryName;
    private Integer regionId;
    private String regionName;
}
