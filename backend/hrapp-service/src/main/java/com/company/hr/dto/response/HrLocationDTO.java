package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class HrLocationDTO {
    private Integer locationId;
    private String streetAddress;
    private String postalCode;
    private String city;
    private String stateProvince;
    private String countryId;
    private String countryName;
}
