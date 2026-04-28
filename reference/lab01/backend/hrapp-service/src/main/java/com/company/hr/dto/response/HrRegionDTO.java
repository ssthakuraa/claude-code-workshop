package com.company.hr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Region reference record returned by read APIs.
 */
@Data @NoArgsConstructor @AllArgsConstructor
public class HrRegionDTO {
    private Integer regionId;
    private String regionName;
}
