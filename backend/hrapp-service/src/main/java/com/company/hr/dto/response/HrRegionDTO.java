package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class HrRegionDTO {
    private Integer regionId;
    private String regionName;
}
